const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const User = require('../models/User');
const { isAuthenticated, isOwner } = require('../middleware/auth');

// Get all skill categories
router.get('/categories', (req, res) => {
  res.json({
    success: true,
    categories: Skill.skillCategories
  });
});

// Create new skill
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { skillName, category, description, experienceLevel, yearsOfExperience, availableFor } = req.body;
    const userId = req.user.id || req.user._id;

    // Validate required fields
    if (!skillName || !category || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const skill = await Skill.create({
      userId,
      skillName,
      category,
      description,
      experienceLevel: experienceLevel || 'Intermediate',
      yearsOfExperience: yearsOfExperience || 0,
      availableFor: availableFor || 'Both'
    });

    // Add skill to user's skillsOffered array
    await User.findByIdAndUpdate(userId, {
      $push: { skillsOffered: skill._id }
    });

    res.status(201).json({
      success: true,
      message: 'Skill added successfully',
      skill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating skill'
    });
  }
});

// Get skills by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const skills = await Skill.find({ 
      userId: req.params.userId,
      isActive: true 
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      skills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching skills'
    });
  }
});

// Search skills
router.get('/search', async (req, res) => {
  try {
    const { query, category, location, minRating, page = 1, limit = 20 } = req.query;
    
    let filter = { isActive: true };
    
    // Text search
    if (query) {
      filter.$text = { $search: query };
    }
    
    // Category filter
    if (category) {
      filter.category = category;
    }
    
    // Rating filter
    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }

    let skills = await Skill.find(filter)
      .populate('userId', 'fullName location profilePicture reputationScore')
      .sort({ rating: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Filter by location if provided
    if (location) {
      skills = skills.filter(skill => 
        skill.userId.location && 
        skill.userId.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    const total = await Skill.countDocuments(filter);

    res.json({
      success: true,
      skills,
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
      message: 'Error searching skills'
    });
  }
});

// Update skill
router.put('/:id', isAuthenticated, isOwner(Skill), async (req, res) => {
  try {
    const { skillName, category, description, experienceLevel, yearsOfExperience, availableFor } = req.body;

    const updateData = {};
    if (skillName) updateData.skillName = skillName;
    if (category) updateData.category = category;
    if (description) updateData.description = description;
    if (experienceLevel) updateData.experienceLevel = experienceLevel;
    if (yearsOfExperience !== undefined) updateData.yearsOfExperience = yearsOfExperience;
    if (availableFor) updateData.availableFor = availableFor;

    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Skill updated successfully',
      skill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating skill'
    });
  }
});

// Delete skill
router.delete('/:id', isAuthenticated, isOwner(Skill), async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    // Soft delete - mark as inactive
    await Skill.findByIdAndUpdate(req.params.id, { isActive: false });

    // Remove from user's skillsOffered array
    await User.findByIdAndUpdate(userId, {
      $pull: { skillsOffered: req.params.id }
    });

    res.json({
      success: true,
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting skill'
    });
  }
});

module.exports = router;
