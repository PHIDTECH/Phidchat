const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Notification = require('../models/Notification');
const { auth } = require('../middleware/auth');

// Get comments for a post
router.get('/post/:postId', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({
      post: req.params.postId,
      parentComment: null,
      status: 'active'
    })
      .populate('author', 'name profilePicture verified')
      .populate({
        path: 'replies',
        populate: { path: 'author', select: 'name profilePicture verified' }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Comment.countDocuments({
      post: req.params.postId,
      parentComment: null,
      status: 'active'
    });

    res.json({
      success: true,
      comments,
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

// Create comment
router.post('/', auth, [
  body('content').notEmpty().isLength({ max: 2000 }),
  body('post').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { content, post, parentComment, mentions } = req.body;

    const postDoc = await Post.findById(post);
    if (!postDoc) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comment = await Comment.create({
      post,
      author: req.user._id,
      content,
      parentComment,
      mentions
    });

    await comment.populate('author', 'name profilePicture verified');

    // Add comment to post
    postDoc.comments.push(comment._id);
    await postDoc.updateEngagement();

    // Update parent comment if reply
    if (parentComment) {
      const parentCommentDoc = await Comment.findById(parentComment);
      if (parentCommentDoc) {
        parentCommentDoc.replies.push(comment._id);
        await parentCommentDoc.save();

        // Notify parent comment author
        if (parentCommentDoc.author.toString() !== req.user._id.toString()) {
          await Notification.create({
            recipient: parentCommentDoc.author,
            sender: req.user._id,
            type: 'comment_reply',
            relatedPost: post,
            relatedComment: comment._id,
            content: {
              text: `${req.user.name} replied to your comment`
            }
          });
        }
      }
    } else {
      // Notify post author
      if (postDoc.author.toString() !== req.user._id.toString()) {
        await Notification.create({
          recipient: postDoc.author,
          sender: req.user._id,
          type: 'post_comment',
          relatedPost: post,
          relatedComment: comment._id,
          content: {
            text: `${req.user.name} commented on your post`
          }
        });
      }
    }

    // Notify mentioned users
    if (mentions && mentions.length > 0) {
      const notifications = mentions.map(userId => ({
        recipient: userId,
        sender: req.user._id,
        type: 'mention',
        relatedPost: post,
        relatedComment: comment._id,
        content: {
          text: `${req.user.name} mentioned you in a comment`
        }
      }));
      await Notification.insertMany(notifications);
    }

    res.status(201).json({ success: true, comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update comment
router.put('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    comment.content = req.body.content || comment.content;
    comment.isEdited = true;
    comment.editedAt = new Date();

    await comment.save();
    await comment.populate('author', 'name profilePicture verified');

    res.json({ success: true, comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete comment
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    comment.status = 'deleted';
    await comment.save();

    // Update post comment count
    const post = await Post.findById(comment.post);
    if (post) {
      post.comments = post.comments.filter(c => c.toString() !== comment._id.toString());
      await post.updateEngagement();
    }

    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Like comment
router.post('/:id/like', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    const existingLike = comment.likes.find(
      like => like.user.toString() === req.user._id.toString()
    );

    if (existingLike) {
      return res.status(400).json({ success: false, message: 'Already liked' });
    }

    comment.likes.push({ user: req.user._id });
    await comment.save();

    // Create notification
    if (comment.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: comment.author,
        sender: req.user._id,
        type: 'comment_like',
        relatedPost: comment.post,
        relatedComment: comment._id,
        content: {
          text: `${req.user.name} liked your comment`
        }
      });
    }

    await comment.populate('author', 'name profilePicture verified');

    res.json({ success: true, comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Unlike comment
router.delete('/:id/like', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    comment.likes = comment.likes.filter(
      like => like.user.toString() !== req.user._id.toString()
    );

    await comment.save();
    await comment.populate('author', 'name profilePicture verified');

    res.json({ success: true, comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
