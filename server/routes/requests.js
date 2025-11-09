const express = require('express');
const router = express.Router();
const HelpRequest = require('../models/HelpRequest');
const User = require('../models/User');
const { isAuthenticated, isOwner } = require('../middleware/auth');

// Create new help request
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { title, description, requiredSkill, category, urgencyLevel, location, preferredTimeline } = req.body;
    const requesterId = req.user.id || req.user._id;

    // Validate required fields
    if (!title || !description || !requiredSkill || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const helpRequest = await HelpRequest.create({
      requesterId,
      title,
      description,
      requiredSkill,
      category,
      urgencyLevel: urgencyLevel || 'Medium',
      location: location || 'Online',
      preferredTimeline
    });

    const populatedRequest = await HelpRequest.findById(helpRequest._id)
      .populate('requesterId', 'fullName profilePicture location');

    res.status(201).json({
      success: true,
      message: 'Help request created successfully',
      request: populatedRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating help request'
    });
  }
});

// Get all help requests with filters
router.get('/', async (req, res) => {
  try {
    const { 
      status, 
      category, 
      urgency, 
      location, 
      query, 
      page = 1, 
      limit = 10 
    } = req.query;
    
    let filter = {};
    
    // Status filter
    if (status) {
      filter.status = status;
    } else {
      // By default, show only open and in-progress requests
      filter.status = { $in: ['Open', 'In Progress'] };
    }
    
    // Category filter
    if (category) {
      filter.category = category;
    }
    
    // Urgency filter
    if (urgency) {
      filter.urgencyLevel = urgency;
    }
    
    // Location filter
    if (location) {
      filter.location = new RegExp(location, 'i');
    }
    
    // Text search
    if (query) {
      filter.$text = { $search: query };
    }

    const requests = await HelpRequest.find(filter)
      .populate('requesterId', 'fullName profilePicture location reputationScore')
      .populate('responses.userId', 'fullName profilePicture')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await HelpRequest.countDocuments(filter);

    res.json({
      success: true,
      requests,
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
      message: 'Error fetching help requests'
    });
  }
});

// Get single help request
router.get('/:id', async (req, res) => {
  try {
    const request = await HelpRequest.findById(req.params.id)
      .populate('requesterId', 'fullName profilePicture location reputationScore bio')
      .populate('responses.userId', 'fullName profilePicture location reputationScore')
      .populate('acceptedResponderId', 'fullName profilePicture');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Help request not found'
      });
    }

    res.json({
      success: true,
      request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching help request'
    });
  }
});

// Get user's own requests
router.get('/user/my-requests', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    
    const requests = await HelpRequest.find({ requesterId: userId })
      .populate('responses.userId', 'fullName profilePicture')
      .populate('acceptedResponderId', 'fullName profilePicture')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching your requests'
    });
  }
});

// Update help request
router.put('/:id', isAuthenticated, isOwner(HelpRequest), async (req, res) => {
  try {
    const { title, description, urgencyLevel, location, preferredTimeline, status } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (urgencyLevel) updateData.urgencyLevel = urgencyLevel;
    if (location) updateData.location = location;
    if (preferredTimeline) updateData.preferredTimeline = preferredTimeline;
    if (status) {
      updateData.status = status;
      if (status === 'Completed') {
        updateData.completedAt = new Date();
      }
    }

    const request = await HelpRequest.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('requesterId', 'fullName profilePicture');

    res.json({
      success: true,
      message: 'Help request updated successfully',
      request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating help request'
    });
  }
});

// Respond to help request
router.post('/:id/respond', isAuthenticated, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id || req.user._id;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Response message is required'
      });
    }

    const request = await HelpRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Help request not found'
      });
    }

    if (request.status === 'Completed' || request.status === 'Closed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot respond to a closed or completed request'
      });
    }

    // Check if user already responded
    const alreadyResponded = request.responses.some(
      r => r.userId.toString() === userId.toString()
    );

    if (alreadyResponded) {
      return res.status(400).json({
        success: false,
        message: 'You have already responded to this request'
      });
    }

    request.responses.push({
      userId,
      message,
      respondedAt: new Date()
    });

    await request.save();

    const updatedRequest = await HelpRequest.findById(req.params.id)
      .populate('responses.userId', 'fullName profilePicture location reputationScore');

    res.json({
      success: true,
      message: 'Response submitted successfully',
      request: updatedRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting response'
    });
  }
});

// Accept a responder
router.post('/:id/accept/:responderId', isAuthenticated, isOwner(HelpRequest), async (req, res) => {
  try {
    const request = await HelpRequest.findById(req.params.id);

    if (request.status !== 'Open') {
      return res.status(400).json({
        success: false,
        message: 'Can only accept responders for open requests'
      });
    }

    request.acceptedResponderId = req.params.responderId;
    request.status = 'In Progress';
    await request.save();

    const updatedRequest = await HelpRequest.findById(req.params.id)
      .populate('acceptedResponderId', 'fullName profilePicture');

    res.json({
      success: true,
      message: 'Responder accepted successfully',
      request: updatedRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error accepting responder'
    });
  }
});

// Rate completed request
router.post('/:id/rate', isAuthenticated, isOwner(HelpRequest), async (req, res) => {
  try {
    const { score, feedback } = req.body;

    if (!score || score < 1 || score > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating score must be between 1 and 5'
      });
    }

    const request = await HelpRequest.findById(req.params.id);

    if (request.status !== 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate completed requests'
      });
    }

    if (request.rating && request.rating.score) {
      return res.status(400).json({
        success: false,
        message: 'Request already rated'
      });
    }

    request.rating = { score, feedback };
    await request.save();

    // Update responder's reputation
    if (request.acceptedResponderId) {
      const responder = await User.findById(request.acceptedResponderId);
      responder.reputationScore += score;
      responder.totalRatings += 1;
      await responder.save();
    }

    res.json({
      success: true,
      message: 'Rating submitted successfully',
      request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting rating'
    });
  }
});

// Delete help request
router.delete('/:id', isAuthenticated, isOwner(HelpRequest), async (req, res) => {
  try {
    await HelpRequest.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Help request deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting help request'
    });
  }
});

module.exports = router;
