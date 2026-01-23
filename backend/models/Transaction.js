const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: String,
    unique: true,
    required: true
  },
  
  type: {
    type: String,
    enum: ['VERIFICATION', 'CONTENT_PURCHASE', 'WITHDRAWAL', 'DEPOSIT'],
    required: true
  },
  
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'TZS'
  },
  
  // For content purchases
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content'
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  commission: {
    type: Number,
    default: 0
  },
  creatorEarnings: {
    type: Number,
    default: 0
  },
  
  // Payment details
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'],
    default: 'PENDING'
  },
  paymentMethod: {
    type: String,
    default: 'SELCOM'
  },
  
  // Selcom specific
  selcomOrderId: String,
  selcomTransactionId: String,
  paymentUrl: String,
  
  // For withdrawals
  withdrawalPhone: String,
  withdrawalStatus: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
  },
  
  // Metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  completedAt: Date,
  failedAt: Date,
  failureReason: String
}, {
  timestamps: true
});

// Indexes
transactionSchema.index({ userId: 1 });
transactionSchema.index({ orderId: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
