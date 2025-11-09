const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Skill = require('../models/Skill');
const { isAuthenticated } = require('../middleware/auth');

// Get user profile by ID
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-googleId')
      .populate('skillsOffered');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile'
    });
  }
});

// Update user profile
router.put('/profile', isAuthenticated, async (req, res) => {
  try {
    const { bio, location, languages } = req.body;
    const userId = req.user.id || req.user._id;

    const updateData = {};
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (languages !== undefined) updateData.languages = languages;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-googleId');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

// Search users by skills or location
router.get('/search', async (req, res) => {
  try {
    const { query, location, skill, page = 1, limit = 10 } = req.query;
    
    let filter = { isActive: true };
    
    // Text search
    if (query) {
      filter.$text = { $search: query };
    }
    
    // Location filter
    if (location) {
      filter.location = new RegExp(location, 'i');
    }

    let users = await User.find(filter)
      .select('-googleId')
      .populate('skillsOffered')
      .sort({ reputationScore: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Filter by skill if provided
    if (skill) {
      users = users.filter(user => 
        user.skillsOffered.some(s => 
          s.skillName.toLowerCase().includes(skill.toLowerCase())
        )
      );
    }

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching users'
    });
  }
});

// Get user statistics
router.get('/stats/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const skills = await Skill.find({ userId: req.params.id, isActive: true });
    const HelpRequest = require('../models/HelpRequest');
    
    const requestsCreated = await HelpRequest.countDocuments({ 
      requesterId: req.params.id 
    });
    
    const requestsHelped = await HelpRequest.countDocuments({ 
      acceptedResponderId: req.params.id,
      status: 'Completed'
    });

    res.json({
      success: true,
      stats: {
        skillsOffered: skills.length,
        reputationScore: user.reputationScore,
        averageRating: user.averageRating,
        requestsCreated,
        requestsHelped,
        memberSince: user.memberSince
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics'
    });
  }
});

module.exports = router;
