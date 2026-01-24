const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const { auth } = require('../middleware/auth');
const upload = require('../config/multer');

// Get newsfeed posts
router.get('/feed', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Get posts from user's friends and own posts
    const friendIds = req.user.friends.map(f => f.user);
    const userIds = [...friendIds, req.user._id];

    const posts = await Post.find({
      author: { $in: userIds },
      status: 'active',
      $or: [
        { visibility: 'public' },
        { visibility: 'friends', author: { $in: userIds } }
      ]
    })
      .populate('author', 'name profilePicture verified')
      .populate('originalPost')
      .populate({
        path: 'comments',
        options: { limit: 3, sort: { createdAt: -1 } },
        populate: { path: 'author', select: 'name profilePicture' }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Post.countDocuments({
      author: { $in: userIds },
      status: 'active'
    });

    res.json({
      success: true,
      posts,
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

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name profilePicture verified bio')
      .populate('originalPost')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name profilePicture' }
      });

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Increment view count
    post.engagement.viewCount += 1;
    await post.save();

    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create post
router.post('/', auth, upload.array('media', 10), async (req, res) => {
  try {
    const { text, visibility, hashtags, mentions } = req.body;

    // Build content object
    const content = {
      text: text || ''
    };

    // Add uploaded images to content
    if (req.files && req.files.length > 0) {
      content.images = req.files.map(file => ({
        url: `/${file.path.replace(/\\/g, '/')}`
      }));
    }

    // Extract hashtags from text if not provided
    let postHashtags = hashtags ? (Array.isArray(hashtags) ? hashtags : [hashtags]) : [];
    if (content.text) {
      const extractedHashtags = content.text.match(/#[\w]+/g);
      if (extractedHashtags) {
        postHashtags = [...postHashtags, ...extractedHashtags.map(tag => tag.slice(1).toLowerCase())];
      }
    }

    const post = await Post.create({
      author: req.user._id,
      content,
      visibility: visibility || 'public',
      hashtags: [...new Set(postHashtags)],
      mentions: mentions ? (Array.isArray(mentions) ? mentions : [mentions]) : []
    });

    await post.populate('author', 'name profilePicture verified');

    // Create notifications for mentions
    if (mentions && mentions.length > 0) {
      const mentionArray = Array.isArray(mentions) ? mentions : [mentions];
      const notifications = mentionArray.map(userId => ({
        recipient: userId,
        sender: req.user._id,
        type: 'mention',
        relatedPost: post._id,
        content: {
          text: `${req.user.name} mentioned you in a post`
        }
      }));
      await Notification.insertMany(notifications);
    }

    res.status(201).json({ success: true, post });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update post
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Save to edit history
    if (post.content.text) {
      post.editHistory.push({
        content: post.content.text,
        editedAt: new Date()
      });
    }

    post.content = req.body.content || post.content;
    post.visibility = req.body.visibility || post.visibility;
    post.isEdited = true;

    await post.save();
    await post.populate('author', 'name profilePicture verified');

    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    post.status = 'deleted';
    await post.save();

    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Like/React to post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const { reaction = 'like' } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Check if already liked
    const existingLike = post.likes.find(
      like => like.user.toString() === req.user._id.toString()
    );

    if (existingLike) {
      // Update reaction
      existingLike.reaction = reaction;
    } else {
      // Add new like
      post.likes.push({
        user: req.user._id,
        reaction
      });

      // Create notification
      if (post.author.toString() !== req.user._id.toString()) {
        await Notification.create({
          recipient: post.author,
          sender: req.user._id,
          type: 'post_like',
          relatedPost: post._id,
          content: {
            text: `${req.user.name} reacted to your post`
          }
        });
      }
    }

    await post.updateEngagement();
    await post.populate('author', 'name profilePicture verified');

    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Unlike post
router.delete('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.likes = post.likes.filter(
      like => like.user.toString() !== req.user._id.toString()
    );

    await post.updateEngagement();
    await post.populate('author', 'name profilePicture verified');

    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Share post
router.post('/:id/share', auth, async (req, res) => {
  try {
    const originalPost = await Post.findById(req.params.id);

    if (!originalPost) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const { content } = req.body;

    // Create shared post
    const sharedPost = await Post.create({
      author: req.user._id,
      content: content || {},
      originalPost: originalPost._id,
      isShared: true,
      visibility: req.user.privacySettings.postVisibility
    });

    // Update original post shares
    originalPost.shares.push({
      user: req.user._id
    });
    await originalPost.updateEngagement();

    // Create notification
    if (originalPost.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: originalPost.author,
        sender: req.user._id,
        type: 'post_share',
        relatedPost: originalPost._id,
        content: {
          text: `${req.user.name} shared your post`
        }
      });
    }

    await sharedPost.populate('author', 'name profilePicture verified');
    await sharedPost.populate('originalPost');

    res.status(201).json({ success: true, post: sharedPost });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user's posts
router.get('/user/:userId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await Post.find({
      author: req.params.userId,
      status: 'active'
    })
      .populate('author', 'name profilePicture verified')
      .populate('originalPost')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Post.countDocuments({
      author: req.params.userId,
      status: 'active'
    });

    res.json({
      success: true,
      posts,
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

module.exports = router;
