const express = require('express');
const { body, validationResult } = require('express-validator');
const Content = require('../models/Content');
const UserContent = require('../models/UserContent');
const { auth, optionalAuth, creatorAuth } = require('../middleware/auth');

const router = express.Router();

// Get all content
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, page = 1, limit = 20, search } = req.query;
    
    const query = { status: 'PUBLISHED' };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [contents, total] = await Promise.all([
      Content.find(query)
        .populate('creatorId', 'name profilePicture verified')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Content.countDocuments(query)
    ]);

    // Transform to include creator as nested object
    const transformedContents = contents.map(content => ({
      ...content.toObject(),
      creator: content.creatorId
    }));

    res.json({
      contents: transformedContents,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Get Content Error:', error);
    res.status(500).json({ success: false, message: 'Hitilafu imetokea' });
  }
});

// Get single content
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id)
      .populate('creatorId', 'name profilePicture verified bio followers');

    if (!content) {
      return res.status(404).json({ success: false, message: 'Content haipatikani' });
    }

    // Increment views
    content.views += 1;
    await content.save();

    const contentObj = content.toObject();
    contentObj.creator = content.creatorId;

    res.json(contentObj);
  } catch (error) {
    console.error('Get Content By ID Error:', error);
    res.status(500).json({ success: false, message: 'Hitilafu imetokea' });
  }
});

// Check if user has access to content
router.get('/:id/access', auth, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content haipatikani' });
    }

    // Creator always has access
    if (content.creatorId.toString() === req.userId.toString()) {
      return res.json({ hasAccess: true, isCreator: true });
    }

    // Check if purchased
    const purchase = await UserContent.findOne({
      userId: req.userId,
      contentId: req.params.id
    });

    res.json({ hasAccess: !!purchase });
  } catch (error) {
    console.error('Check Access Error:', error);
    res.status(500).json({ success: false, message: 'Hitilafu imetokea' });
  }
});

// Get content by creator
router.get('/creator/:creatorId', async (req, res) => {
  try {
    const contents = await Content.find({ 
      creatorId: req.params.creatorId,
      status: 'PUBLISHED'
    })
    .populate('creatorId', 'name profilePicture verified')
    .sort({ createdAt: -1 });

    const transformedContents = contents.map(content => ({
      ...content.toObject(),
      creator: content.creatorId
    }));

    res.json(transformedContents);
  } catch (error) {
    console.error('Get Creator Content Error:', error);
    res.status(500).json({ success: false, message: 'Hitilafu imetokea' });
  }
});

// Create content
router.post('/', creatorAuth, [
  body('title').trim().notEmpty().withMessage('Jina la content linahitajika'),
  body('category').isIn(['MOVIE', 'SERIES', 'COMEDY', 'GOSPEL', 'MUSIC']).withMessage('Category si sahihi'),
  body('price').isNumeric().withMessage('Bei inahitajika')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, description, category, price, thumbnailUrl, videoUrl, audioUrl, duration, tags } = req.body;

    const content = await Content.create({
      title,
      description,
      category,
      price,
      thumbnailUrl,
      videoUrl,
      audioUrl,
      duration,
      tags,
      creatorId: req.userId
    });

    res.status(201).json({
      success: true,
      content
    });
  } catch (error) {
    console.error('Create Content Error:', error);
    res.status(500).json({ success: false, message: 'Hitilafu imetokea' });
  }
});

// Update content
router.put('/:id', creatorAuth, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({ success: false, message: 'Content haipatikani' });
    }

    // Check ownership
    if (content.creatorId.toString() !== req.userId.toString()) {
      return res.status(403).json({ success: false, message: 'Huna ruhusa ya kubadilisha content hii' });
    }

    const { title, description, category, price, thumbnailUrl, videoUrl, audioUrl, duration, tags, status } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category) updateData.category = category;
    if (price) updateData.price = price;
    if (thumbnailUrl) updateData.thumbnailUrl = thumbnailUrl;
    if (videoUrl) updateData.videoUrl = videoUrl;
    if (audioUrl) updateData.audioUrl = audioUrl;
    if (duration) updateData.duration = duration;
    if (tags) updateData.tags = tags;
    if (status) updateData.status = status;

    const updatedContent = await Content.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      content: updatedContent
    });
  } catch (error) {
    console.error('Update Content Error:', error);
    res.status(500).json({ success: false, message: 'Hitilafu imetokea' });
  }
});

// Delete content
router.delete('/:id', creatorAuth, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({ success: false, message: 'Content haipatikani' });
    }

    if (content.creatorId.toString() !== req.userId.toString()) {
      return res.status(403).json({ success: false, message: 'Huna ruhusa ya kufuta content hii' });
    }

    await Content.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Content imefutwa'
    });
  } catch (error) {
    console.error('Delete Content Error:', error);
    res.status(500).json({ success: false, message: 'Hitilafu imetokea' });
  }
});

module.exports = router;
