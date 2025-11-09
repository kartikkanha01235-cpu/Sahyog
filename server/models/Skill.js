const mongoose = require('mongoose');

const skillCategories = [
  'Technical Skills',
  'Creative Skills',
  'Academic Skills',
  'Life Skills',
  'Professional Skills',
  'Craft & Trades',
  'Other'
];

const skillSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skillName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: skillCategories
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  experienceLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Intermediate'
  },
  yearsOfExperience: {
    type: Number,
    min: 0,
    default: 0
  },
  availableFor: {
    type: String,
    enum: ['Online', 'In-Person', 'Both'],
    default: 'Both'
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for search optimization
skillSchema.index({ skillName: 'text', description: 'text' });
skillSchema.index({ category: 1 });
skillSchema.index({ userId: 1 });
skillSchema.index({ rating: -1 });

module.exports = mongoose.model('Skill', skillSchema);
module.exports.skillCategories = skillCategories;
