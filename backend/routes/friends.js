const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Notification = require('../models/Notification');
const { auth } = require('../middleware/auth');

// Send friend request
router.post('/request/:userId', auth, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.userId);

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (req.user._id.toString() === targetUser._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot send request to yourself' });
    }

    // Check if already friends
    const alreadyFriends = req.user.friends.some(
      f => f.user.toString() === targetUser._id.toString()
    );

    if (alreadyFriends) {
      return res.status(400).json({ success: false, message: 'Already friends' });
    }

    // Check if request already sent
    if (req.user.friendRequestsSent.includes(targetUser._id)) {
      return res.status(400).json({ success: false, message: 'Request already sent' });
    }

    // Check if user is blocked
    if (targetUser.blockedUsers.includes(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Cannot send request' });
    }

    // Add to sent and received lists
    req.user.friendRequestsSent.push(targetUser._id);
    targetUser.friendRequestsReceived.push(req.user._id);

    await req.user.save();
    await targetUser.save();

    // Create notification
    await Notification.create({
      recipient: targetUser._id,
      sender: req.user._id,
      type: 'friend_request',
      content: {
        text: `${req.user.name} sent you a friend request`
      }
    });

    res.json({ success: true, message: 'Friend request sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Accept friend request
router.post('/accept/:userId', auth, async (req, res) => {
  try {
    const requester = await User.findById(req.params.userId);

    if (!requester) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if request exists
    if (!req.user.friendRequestsReceived.includes(requester._id)) {
      return res.status(400).json({ success: false, message: 'No friend request from this user' });
    }

    // Add to friends
    req.user.friends.push({
      user: requester._id,
      status: 'accepted'
    });
    requester.friends.push({
      user: req.user._id,
      status: 'accepted'
    });

    // Remove from request lists
    req.user.friendRequestsReceived = req.user.friendRequestsReceived.filter(
      id => id.toString() !== requester._id.toString()
    );
    requester.friendRequestsSent = requester.friendRequestsSent.filter(
      id => id.toString() !== req.user._id.toString()
    );

    await req.user.save();
    await requester.save();

    // Create notification
    await Notification.create({
      recipient: requester._id,
      sender: req.user._id,
      type: 'friend_accept',
      content: {
        text: `${req.user.name} accepted your friend request`
      }
    });

    res.json({ success: true, message: 'Friend request accepted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Decline friend request
router.post('/decline/:userId', auth, async (req, res) => {
  try {
    const requester = await User.findById(req.params.userId);

    if (!requester) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Remove from request lists
    req.user.friendRequestsReceived = req.user.friendRequestsReceived.filter(
      id => id.toString() !== requester._id.toString()
    );
    requester.friendRequestsSent = requester.friendRequestsSent.filter(
      id => id.toString() !== req.user._id.toString()
    );

    await req.user.save();
    await requester.save();

    res.json({ success: true, message: 'Friend request declined' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Unfriend
router.delete('/:userId', auth, async (req, res) => {
  try {
    const friend = await User.findById(req.params.userId);

    if (!friend) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Remove from friends
    req.user.friends = req.user.friends.filter(
      f => f.user.toString() !== friend._id.toString()
    );
    friend.friends = friend.friends.filter(
      f => f.user.toString() !== req.user._id.toString()
    );

    await req.user.save();
    await friend.save();

    res.json({ success: true, message: 'Unfriended successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get friend list
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('friends.user', 'name profilePicture verified isOnline');

    const friends = user.friends
      .filter(f => f.status === 'accepted')
      .map(f => f.user);

    res.json({ success: true, friends });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get friend requests
router.get('/requests', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('friendRequestsReceived', 'name profilePicture verified')
      .populate('friendRequestsSent', 'name profilePicture verified');

    res.json({
      success: true,
      received: user.friendRequestsReceived,
      sent: user.friendRequestsSent
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get suggested friends
router.get('/suggestions', auth, async (req, res) => {
  try {
    const friendIds = req.user.friends.map(f => f.user);
    const requestIds = [
      ...req.user.friendRequestsSent,
      ...req.user.friendRequestsReceived
    ];

    // Find users who are friends with user's friends but not with user
    const suggestions = await User.find({
      _id: {
        $nin: [...friendIds, ...requestIds, req.user._id]
      },
      accountStatus: 'active',
      'friends.user': { $in: friendIds }
    })
      .select('name profilePicture verified bio')
      .limit(10);

    res.json({ success: true, suggestions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Block user
router.post('/block/:userId', auth, async (req, res) => {
  try {
    const userToBlock = await User.findById(req.params.userId);

    if (!userToBlock) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (req.user.blockedUsers.includes(userToBlock._id)) {
      return res.status(400).json({ success: false, message: 'User already blocked' });
    }

    // Remove from friends if friends
    req.user.friends = req.user.friends.filter(
      f => f.user.toString() !== userToBlock._id.toString()
    );
    userToBlock.friends = userToBlock.friends.filter(
      f => f.user.toString() !== req.user._id.toString()
    );

    // Add to blocked list
    req.user.blockedUsers.push(userToBlock._id);

    await req.user.save();
    await userToBlock.save();

    res.json({ success: true, message: 'User blocked' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Unblock user
router.delete('/block/:userId', auth, async (req, res) => {
  try {
    req.user.blockedUsers = req.user.blockedUsers.filter(
      id => id.toString() !== req.params.userId
    );

    await req.user.save();

    res.json({ success: true, message: 'User unblocked' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
