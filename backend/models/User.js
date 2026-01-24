const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Jina ni lazima'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email ni lazima'],
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: function() { return !this.oauthProvider; },
    sparse: true
  },
  password: {
    type: String,
    required: function() { return !this.oauthProvider; },
    minlength: 6,
    select: false
  },
  oauthProvider: {
    type: String,
    enum: ['google', 'facebook', null],
    default: null
  },
  oauthId: {
    type: String,
    sparse: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  coverPhoto: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: '',
    maxlength: 500
  },
  location: {
    country: String,
    region: String,
    district: String,
    city: String,
    street: String
  },
  website: String,
  dateOfBirth: Date,
  education: String,
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say', ''],
    default: ''
  },
  
  // Verification
  verified: {
    type: Boolean,
    default: false
  },
  verifiedAt: Date,
  
  // Wallet/Account
  wallet: {
    balance: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'TZS'
    }
  },
  
  // Creator Info
  isCreator: {
    type: Boolean,
    default: false
  },
  creatorType: [{
    type: String,
    enum: ['MOVIES', 'SERIES', 'COMEDY', 'GOSPEL', 'MUSIC']
  }],
  totalEarnings: {
    type: Number,
    default: 0
  },
  
  // Social
  friends: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted'],
      default: 'accepted'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  friendRequestsSent: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  friendRequestsReceived: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  blockedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Purchased content
  purchasedContent: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content'
  }],
  
  // Role
  role: {
    type: String,
    enum: ['user', 'creator', 'admin'],
    default: 'user'
  },
  privacySettings: {
    profileVisibility: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'public'
    },
    postVisibility: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'public'
    },
    friendListVisibility: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'friends'
    },
    allowFriendRequests: {
      type: Boolean,
      default: true
    },
    allowMessages: {
      type: String,
      enum: ['everyone', 'friends', 'nobody'],
      default: 'everyone'
    }
  },
  notificationSettings: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    },
    friendRequests: {
      type: Boolean,
      default: true
    },
    comments: {
      type: Boolean,
      default: true
    },
    likes: {
      type: Boolean,
      default: true
    },
    messages: {
      type: Boolean,
      default: true
    }
  },
  accountStatus: {
    type: String,
    enum: ['active', 'suspended', 'banned', 'deleted'],
    default: 'active'
  },
  suspendedUntil: Date,
  banReason: String,
  lastActive: {
    type: Date,
    default: Date.now
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual for follower count
userSchema.virtual('followerCount').get(function() {
  return this.followers.length;
});

userSchema.virtual('followingCount').get(function() {
  return this.following.length;
});

module.exports = mongoose.model('User', userSchema);
