const User = require('../models/User');
const PlatformEarnings = require('../models/PlatformEarnings');

class CommissionService {
  constructor() {
    this.rates = {
      CONTENT: 0.15,        // 15% commission on content sales
      VERIFICATION: 1.0,   // 100% goes to platform
      WITHDRAWAL: 0.02     // 2% withdrawal fee
    };
  }

  calculateCommission(amount, type = 'CONTENT') {
    const rate = this.rates[type] || this.rates.CONTENT;
    const commission = Math.round(amount * rate);
    const creatorEarnings = amount - commission;
    
    return {
      total: amount,
      commission,
      creatorEarnings,
      rate,
      ratePercent: rate * 100
    };
  }

  async distributeEarnings(transaction) {
    const breakdown = this.calculateCommission(
      transaction.amount,
      transaction.type
    );

    // Update creator wallet if applicable
    if (transaction.creatorId && transaction.type === 'CONTENT_PURCHASE') {
      await User.findByIdAndUpdate(transaction.creatorId, {
        $inc: { 
          'wallet.balance': breakdown.creatorEarnings,
          'totalEarnings': breakdown.creatorEarnings
        }
      });
    }

    // Record platform earnings
    await PlatformEarnings.create({
      transactionId: transaction._id,
      amount: breakdown.commission,
      currency: transaction.currency || 'TZS',
      source: transaction.type,
      description: `Commission from ${transaction.type} - Order: ${transaction.orderId}`
    });

    return breakdown;
  }

  async getPlatformStats(startDate, endDate) {
    const match = {};
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    const stats = await PlatformEarnings.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$source',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const totalEarnings = await PlatformEarnings.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    return {
      bySource: stats,
      totalEarnings: totalEarnings[0]?.total || 0
    };
  }

  calculateWithdrawalFee(amount) {
    return this.calculateCommission(amount, 'WITHDRAWAL');
  }

  getMinimumWithdrawal() {
    return 5000; // TZS 5,000 minimum
  }

  getMaximumWithdrawal() {
    return 5000000; // TZS 5,000,000 maximum per transaction
  }

  validateWithdrawalAmount(amount, balance) {
    const min = this.getMinimumWithdrawal();
    const max = this.getMaximumWithdrawal();
    const fee = this.calculateWithdrawalFee(amount);
    const totalRequired = amount + fee.commission;

    if (amount < min) {
      return { valid: false, message: `Kiasi cha chini ni TZS ${min.toLocaleString()}` };
    }
    if (amount > max) {
      return { valid: false, message: `Kiasi cha juu ni TZS ${max.toLocaleString()}` };
    }
    if (totalRequired > balance) {
      return { valid: false, message: 'Salio haitoshi (pamoja na ada ya kutoa)' };
    }

    return { valid: true, fee: fee.commission, netAmount: amount };
  }
}

module.exports = new CommissionService();
