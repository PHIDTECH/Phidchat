const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Jina la content linahitajika'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: true,
    enum: ['MOVIE', 'SERIES', 'COMEDY', 'GOSPEL', 'MUSIC']
  },
  
  // Creator
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Media
  thumbnailUrl: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    default: ''
  },
  audioUrl: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 0
  },
  
  // Pricing
  price: {
    type: Number,
    required: [true, 'Bei inahitajika'],
    min: 0
  },
  currency: {
    type: String,
    default: 'TZS'
  },
  
  // Stats
  views: {
    type: Number,
    default: 0
  },
  purchases: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  
  // Series specific
  seasonNumber: Number,
  episodeNumber: Number,
  seriesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content'
  },
  
  // Status
  status: {
    type: String,
    enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
    default: 'PUBLISHED'
  },
  
  // Tags for search
  tags: [String]
}, {
  timestamps: true
});

// Index for search
contentSchema.index({ title: 'text', description: 'text', tags: 'text' });
contentSchema.index({ category: 1 });
contentSchema.index({ creatorId: 1 });
contentSchema.index({ createdAt: -1 });

// Virtual populate creator
contentSchema.virtual('creator', {
  ref: 'User',
  localField: 'creatorId',
  foreignField: '_id',
  justOne: true
});

contentSchema.set('toJSON', { virtuals: true });
contentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Content', contentSchema);
