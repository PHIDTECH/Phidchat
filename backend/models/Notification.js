const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: [
      'friend_request',
      'friend_accept',
      'post_like',
      'post_comment',
      'comment_reply',
      'comment_like',
      'post_share',
      'mention',
      'message',
      'content_purchase',
      'verification_approved',
      'withdrawal_approved'
    ],
    required: true
  },
  content: {
    text: String,
    image: String
  },
  relatedPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  relatedComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  },
  relatedContent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  link: String
}, {
  timestamps: true
});

notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
