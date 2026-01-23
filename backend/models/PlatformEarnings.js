const mongoose = require('mongoose');

const platformEarningsSchema = new mongoose.Schema({
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
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
  source: {
    type: String,
    enum: ['VERIFICATION', 'CONTENT_PURCHASE', 'WITHDRAWAL_FEE'],
    required: true
  },
  description: String
}, {
  timestamps: true
});

platformEarningsSchema.index({ createdAt: -1 });
platformEarningsSchema.index({ source: 1 });

module.exports = mongoose.model('PlatformEarnings', platformEarningsSchema);
