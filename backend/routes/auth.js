const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const upload = require('../config/multer');

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET, 
    { expiresIn: '30d' }
  );
};

// Register
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Jina linahitajika'),
  body('email').isEmail().normalizeEmail().withMessage('Email si sahihi'),
  body('phone').trim().notEmpty().withMessage('Namba ya simu inahitajika'),
  body('password').isLength({ min: 6 }).withMessage('Password lazima iwe angalau herufi 6')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { name, email, phone, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email hii imeshatumika' 
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture,
        verified: user.verified,
        wallet: user.wallet,
        isCreator: user.isCreator
      }
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Hitilafu imetokea' 
    });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Email si sahihi'),
  body('password').notEmpty().withMessage('Password inahitajika')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email au password si sahihi' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email au password si sahihi' 
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture,
        coverPhoto: user.coverPhoto,
        bio: user.bio,
        verified: user.verified,
        wallet: user.wallet,
        isCreator: user.isCreator,
        creatorType: user.creatorType,
        totalEarnings: user.totalEarnings,
        followers: user.followers,
        following: user.following
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Hitilafu imetokea' 
    });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('followers', 'name profilePicture')
      .populate('following', 'name profilePicture');

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get Me Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Hitilafu imetokea' 
    });
  }
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { 
      name, 
      bio, 
      phone, 
      gender, 
      dateOfBirth, 
      education,
      country,
      region,
      district,
      city,
      street,
      website 
    } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (phone) updateData.phone = phone;
    if (gender !== undefined) updateData.gender = gender;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (education !== undefined) updateData.education = education;
    if (website !== undefined) updateData.website = website;
    
    // Handle location as nested object
    const location = {};
    if (country !== undefined) location.country = country;
    if (region !== undefined) location.region = region;
    if (district !== undefined) location.district = district;
    if (city !== undefined) location.city = city;
    if (street !== undefined) location.street = street;
    
    if (Object.keys(location).length > 0) {
      updateData.location = location;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Hitilafu imetokea' 
    });
  }
});

// Upload profile picture
router.post('/upload-profile-picture', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tafadhali chagua picha' 
      });
    }

    const profilePictureUrl = `/${req.file.path.replace(/\\/g, '/')}`;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { profilePicture: profilePictureUrl },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Picha ya profile imebadilishwa!',
      profilePicture: profilePictureUrl,
      user
    });
  } catch (error) {
    console.error('Upload Profile Picture Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Hitilafu imetokea' 
    });
  }
});

// Upload cover photo
router.post('/upload-cover-photo', auth, upload.single('coverPhoto'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tafadhali chagua picha' 
      });
    }

    const coverPhotoUrl = `/${req.file.path.replace(/\\/g, '/')}`;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { coverPhoto: coverPhotoUrl },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Picha ya cover imebadilishwa!',
      coverPhoto: coverPhotoUrl,
      user
    });
  } catch (error) {
    console.error('Upload Cover Photo Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Hitilafu imetokea' 
    });
  }
});

// Become a creator
router.post('/become-creator', auth, async (req, res) => {
  try {
    const { creatorType } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { 
        isCreator: true,
        creatorType: creatorType || [],
        role: 'creator'
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Umekuwa creator!',
      user
    });
  } catch (error) {
    console.error('Become Creator Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Hitilafu imetokea' 
    });
  }
});

module.exports = router;
