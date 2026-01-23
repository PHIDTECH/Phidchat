const express = require('express');
const User = require('../models/User');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get user by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'name profilePicture')
      .populate('following', 'name profilePicture');

    if (!user) {
      return res.status(404).json({ success: false, message: 'Mtumiaji hapatikani' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get User Error:', error);
    res.status(500).json({ success: false, message: 'Hitilafu imetokea' });
  }
});

// Follow user
router.post('/:id/follow', auth, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    
    if (!userToFollow) {
      return res.status(404).json({ success: false, message: 'Mtumiaji hapatikani' });
    }

    if (req.params.id === req.userId.toString()) {
      return res.status(400).json({ success: false, message: 'Huwezi kujifuata mwenyewe' });
    }

    // Check if already following
    const isFollowing = userToFollow.followers.includes(req.userId);

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(req.params.id, {
        $pull: { followers: req.userId }
      });
      await User.findByIdAndUpdate(req.userId, {
        $pull: { following: req.params.id }
      });

      res.json({ success: true, following: false, message: 'Umemwacha kufuata' });
    } else {
      // Follow
      await User.findByIdAndUpdate(req.params.id, {
        $addToSet: { followers: req.userId }
      });
      await User.findByIdAndUpdate(req.userId, {
        $addToSet: { following: req.params.id }
      });

      res.json({ success: true, following: true, message: 'Unamfuata sasa' });
    }
  } catch (error) {
    console.error('Follow User Error:', error);
    res.status(500).json({ success: false, message: 'Hitilafu imetokea' });
  }
});

// Get user's followers
router.get('/:id/followers', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('followers', 'name profilePicture verified bio');

    if (!user) {
      return res.status(404).json({ success: false, message: 'Mtumiaji hapatikani' });
    }

    res.json(user.followers);
  } catch (error) {
    console.error('Get Followers Error:', error);
    res.status(500).json({ success: false, message: 'Hitilafu imetokea' });
  }
});

// Get user's following
router.get('/:id/following', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('following', 'name profilePicture verified bio');

    if (!user) {
      return res.status(404).json({ success: false, message: 'Mtumiaji hapatikani' });
    }

    res.json(user.following);
  } catch (error) {
    console.error('Get Following Error:', error);
    res.status(500).json({ success: false, message: 'Hitilafu imetokea' });
  }
});

// Get all users or search
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;

    let query = {};
    if (q) {
      query.name = { $regex: q, $options: 'i' };
    }

    const users = await User.find(query)
      .select('name email profilePicture verified isCreator isOnline')
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({ success: true, users });
  } catch (error) {
    console.error('Search Users Error:', error);
    res.status(500).json({ success: false, message: 'Hitilafu imetokea' });
  }
});

// Search users (alternative endpoint)
router.get('/search/query', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.json([]);
    }

    const users = await User.find({
      name: { $regex: q, $options: 'i' }
    })
    .select('name profilePicture verified isCreator')
    .limit(parseInt(limit));

    res.json(users);
  } catch (error) {
    console.error('Search Users Error:', error);
    res.status(500).json({ success: false, message: 'Hitilafu imetokea' });
  }
});

// Get top creators
router.get('/top/creators', async (req, res) => {
  try {
    const creators = await User.find({ isCreator: true })
      .select('name profilePicture verified bio totalEarnings followers')
      .sort({ 'followers.length': -1, totalEarnings: -1 })
      .limit(10);

    res.json(creators);
  } catch (error) {
    console.error('Get Top Creators Error:', error);
    res.status(500).json({ success: false, message: 'Hitilafu imetokea' });
  }
});

module.exports = router;
