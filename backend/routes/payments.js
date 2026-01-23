const express = require('express');
const { body, validationResult } = require('express-validator');
const selcomService = require('../services/selcomService');
const commissionService = require('../services/commissionService');
const User = require('../models/User');
const Content = require('../models/Content');
const Transaction = require('../models/Transaction');
const UserContent = require('../models/UserContent');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Buy content
router.post('/buy-content', auth, [
  body('contentId').notEmpty().withMessage('Content ID inahitajika'),
  body('phone').notEmpty().withMessage('Namba ya simu inahitajika')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { contentId, phone } = req.body;
    
    // Get content
    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content haipatikani' });
    }

    // Check if already purchased
    const existingPurchase = await UserContent.findOne({
      userId: req.userId,
      contentId: contentId
    });
    if (existingPurchase) {
      return res.status(400).json({ success: false, message: 'Umeshununua content hii tayari' });
    }

    const orderId = selcomService.generateOrderId('CONTENT');

    // Create pending transaction
    const transaction = await Transaction.create({
      userId: req.userId,
      orderId: orderId,
      type: 'CONTENT_PURCHASE',
      amount: content.price,
      contentId: content._id,
      creatorId: content.creatorId,
      status: 'PENDING'
    });

    // Create Selcom order
    const orderData = {
      orderId: orderId,
      email: req.user.email,
      name: req.user.name,
      phone: phone,
      amount: content.price
    };

    const selcomOrder = await selcomService.createOrder(orderData);

    // Update transaction with Selcom data
    transaction.selcomOrderId = selcomOrder.order_id || orderId;
    transaction.paymentUrl = selcomOrder.payment_url;
    await transaction.save();

    res.json({
      success: true,
      paymentUrl: selcomOrder.payment_url,
      orderId: orderId
    });
  } catch (error) {
    console.error('Buy Content Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Hitilafu imetokea' });
  }
});

// Verification payment
router.post('/verification-payment', auth, [
  body('phone').notEmpty().withMessage('Namba ya simu inahitajika')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    if (req.user.verified) {
      return res.status(400).json({ success: false, message: 'Umeshathibitishwa tayari' });
    }

    const { phone } = req.body;
    const verificationFee = 10000; // TZS 10,000
    const orderId = selcomService.generateOrderId('VERIFY');

    const transaction = await Transaction.create({
      userId: req.userId,
      orderId: orderId,
      type: 'VERIFICATION',
      amount: verificationFee,
      status: 'PENDING'
    });

    const orderData = {
      orderId: orderId,
      email: req.user.email,
      name: req.user.name,
      phone: phone,
      amount: verificationFee
    };

    const selcomOrder = await selcomService.createOrder(orderData);

    transaction.selcomOrderId = selcomOrder.order_id || orderId;
    transaction.paymentUrl = selcomOrder.payment_url;
    await transaction.save();

    res.json({
      success: true,
      paymentUrl: selcomOrder.payment_url,
      orderId: orderId
    });
  } catch (error) {
    console.error('Verification Payment Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Hitilafu imetokea' });
  }
});

// Webhook - Payment confirmation from Selcom
router.post('/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-selcom-signature'];
    
    // Verify webhook signature (in production)
    // if (!selcomService.verifyWebhook(req.body, signature)) {
    //   return res.status(401).json({ error: 'Invalid signature' });
    // }

    const { order_id, payment_status, transid, amount } = req.body;

    const transaction = await Transaction.findOne({ orderId: order_id });
    if (!transaction) {
      console.error('Transaction not found for order:', order_id);
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (payment_status === 'COMPLETED' || payment_status === 'SUCCESS') {
      transaction.status = 'COMPLETED';
      transaction.selcomTransactionId = transid;
      transaction.completedAt = new Date();

      if (transaction.type === 'VERIFICATION') {
        await User.findByIdAndUpdate(transaction.userId, {
          verified: true,
          verifiedAt: new Date()
        });
        
        await commissionService.distributeEarnings(transaction);

      } else if (transaction.type === 'CONTENT_PURCHASE') {
        // Calculate and distribute commission
        const breakdown = commissionService.calculateCommission(transaction.amount, 'CONTENT');
        transaction.commission = breakdown.commission;
        transaction.creatorEarnings = breakdown.creatorEarnings;

        await commissionService.distributeEarnings(transaction);

        // Grant access to content
        await UserContent.create({
          userId: transaction.userId,
          contentId: transaction.contentId,
          transactionId: transaction._id,
          amountPaid: transaction.amount
        });

        // Update content stats
        await Content.findByIdAndUpdate(transaction.contentId, {
          $inc: { 
            purchases: 1,
            totalEarnings: breakdown.creatorEarnings
          }
        });

        // Add to user's purchased content
        await User.findByIdAndUpdate(transaction.userId, {
          $addToSet: { purchasedContent: transaction.contentId }
        });
      }

      await transaction.save();
    } else if (payment_status === 'FAILED' || payment_status === 'CANCELLED') {
      transaction.status = payment_status === 'FAILED' ? 'FAILED' : 'CANCELLED';
      transaction.failedAt = new Date();
      transaction.failureReason = req.body.failure_reason || 'Payment failed';
      await transaction.save();
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user transactions
router.get('/transactions', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('contentId', 'title thumbnailUrl');

    res.json(transactions);
  } catch (error) {
    console.error('Get Transactions Error:', error);
    res.status(500).json({ success: false, message: 'Hitilafu imetokea' });
  }
});

// Get wallet balance
router.get('/wallet', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    const pendingWithdrawals = await Transaction.aggregate([
      {
        $match: {
          userId: req.userId,
          type: 'WITHDRAWAL',
          status: 'PENDING'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    res.json({
      balance: user.wallet.balance,
      currency: user.wallet.currency,
      pendingWithdrawals: pendingWithdrawals[0]?.total || 0
    });
  } catch (error) {
    console.error('Get Wallet Error:', error);
    res.status(500).json({ success: false, message: 'Hitilafu imetokea' });
  }
});

// Request withdrawal
router.post('/withdraw', auth, [
  body('amount').isNumeric().withMessage('Kiasi kinahitajika'),
  body('phone').notEmpty().withMessage('Namba ya simu inahitajika')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { amount, phone } = req.body;
    const user = await User.findById(req.userId);

    // Validate withdrawal
    const validation = commissionService.validateWithdrawalAmount(amount, user.wallet.balance);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    const orderId = selcomService.generateOrderId('WITHDRAW');

    // Create withdrawal transaction
    const transaction = await Transaction.create({
      userId: req.userId,
      orderId: orderId,
      type: 'WITHDRAWAL',
      amount: amount,
      commission: validation.fee,
      withdrawalPhone: phone,
      withdrawalStatus: 'PENDING',
      status: 'PENDING'
    });

    // Deduct from balance
    await User.findByIdAndUpdate(req.userId, {
      $inc: { 'wallet.balance': -(amount + validation.fee) }
    });

    res.json({
      success: true,
      message: 'Ombi lako la kutoa pesa limepokelewa. Utapokea pesa ndani ya masaa 24.',
      transaction: {
        orderId: orderId,
        amount: amount,
        fee: validation.fee,
        netAmount: amount
      }
    });
  } catch (error) {
    console.error('Withdrawal Error:', error);
    res.status(500).json({ success: false, message: 'Hitilafu imetokea' });
  }
});

module.exports = router;
