const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { auth } = require('../middleware/auth');

// Get conversations
router.get('/conversations', auth, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id
    })
      .populate('participants', 'name profilePicture isOnline')
      .populate('lastMessage')
      .sort({ lastMessageAt: -1 });

    res.json({ success: true, conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get or create conversation
router.post('/conversations', auth, async (req, res) => {
  try {
    const { participantId } = req.body;

    if (!participantId) {
      return res.status(400).json({ success: false, message: 'Participant ID required' });
    }

    // Check if conversation exists
    let conversation = await Conversation.findOne({
      isGroup: false,
      participants: { $all: [req.user._id, participantId] }
    })
      .populate('participants', 'name profilePicture isOnline')
      .populate('lastMessage');

    if (!conversation) {
      // Create new conversation
      conversation = await Conversation.create({
        participants: [req.user._id, participantId],
        isGroup: false
      });

      await conversation.populate('participants', 'name profilePicture isOnline');
    }

    res.json({ success: true, conversation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get messages in conversation
router.get('/conversations/:conversationId/messages', auth, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const conversation = await Conversation.findById(req.params.conversationId);

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    // Check if user is participant
    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const messages = await Message.find({
      conversation: req.params.conversationId,
      isDeleted: false
    })
      .populate('sender', 'name profilePicture')
      .populate('replyTo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments({
      conversation: req.params.conversationId,
      isDeleted: false
    });

    // Mark messages as read
    await Message.updateMany(
      {
        conversation: req.params.conversationId,
        sender: { $ne: req.user._id },
        'readBy.user': { $ne: req.user._id }
      },
      {
        $push: {
          readBy: {
            user: req.user._id,
            readAt: new Date()
          }
        }
      }
    );

    // Reset unread count
    const unreadEntry = conversation.unreadCount.find(
      u => u.user.toString() === req.user._id.toString()
    );
    if (unreadEntry) {
      unreadEntry.count = 0;
      await conversation.save();
    }

    res.json({
      success: true,
      messages: messages.reverse(),
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send message
router.post('/conversations/:conversationId/messages', auth, [
  body('content.text').optional().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const conversation = await Conversation.findById(req.params.conversationId);

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { content, messageType = 'text', replyTo } = req.body;

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      content,
      messageType,
      replyTo
    });

    await message.populate('sender', 'name profilePicture');

    // Update conversation
    conversation.lastMessage = message._id;
    conversation.lastMessageAt = new Date();

    // Update unread counts for other participants
    conversation.participants.forEach(participantId => {
      if (participantId.toString() !== req.user._id.toString()) {
        const unreadEntry = conversation.unreadCount.find(
          u => u.user.toString() === participantId.toString()
        );
        if (unreadEntry) {
          unreadEntry.count += 1;
        } else {
          conversation.unreadCount.push({
            user: participantId,
            count: 1
          });
        }
      }
    });

    await conversation.save();

    // Create notifications for other participants
    const otherParticipants = conversation.participants.filter(
      p => p.toString() !== req.user._id.toString()
    );

    const notifications = otherParticipants.map(userId => ({
      recipient: userId,
      sender: req.user._id,
      type: 'message',
      content: {
        text: `${req.user.name} sent you a message`
      }
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete message
router.delete('/messages/:messageId', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();

    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get unread message count
router.get('/unread-count', auth, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id
    });

    let totalUnread = 0;
    conversations.forEach(conv => {
      const unreadEntry = conv.unreadCount.find(
        u => u.user.toString() === req.user._id.toString()
      );
      if (unreadEntry) {
        totalUnread += unreadEntry.count;
      }
    });

    res.json({ success: true, unreadCount: totalUnread });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
