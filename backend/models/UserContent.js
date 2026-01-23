const mongoose = require('mongoose');

const userContentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
    required: true
  },
  purchasedAt: {
    type: Date,
    default: Date.now
  },
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  },
  amountPaid: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate purchases
userContentSchema.index({ userId: 1, contentId: 1 }, { unique: true });

module.exports = mongoose.model('UserContent', userContentSchema);
