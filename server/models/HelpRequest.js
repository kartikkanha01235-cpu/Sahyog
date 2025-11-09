const mongoose = require('mongoose');

const helpRequestSchema = new mongoose.Schema({
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  requiredSkill: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  urgencyLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  location: {
    type: String,
    trim: true,
    default: 'Online'
  },
  preferredTimeline: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Completed', 'Closed'],
    default: 'Open'
  },
  responses: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: {
      type: String,
      required: true,
      maxlength: 1000
    },
    respondedAt: {
      type: Date,
      default: Date.now
    }
  }],
  acceptedResponderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  completedAt: {
    type: Date
  },
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: {
      type: String,
      maxlength: 500
    }
  }
}, {
  timestamps: true
});

// Indexes for search and filtering
helpRequestSchema.index({ title: 'text', description: 'text', requiredSkill: 'text' });
helpRequestSchema.index({ status: 1 });
helpRequestSchema.index({ urgencyLevel: 1 });
helpRequestSchema.index({ category: 1 });
helpRequestSchema.index({ location: 1 });
helpRequestSchema.index({ requesterId: 1 });
helpRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('HelpRequest', helpRequestSchema);
