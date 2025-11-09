const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Google OAuth login
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed` 
  }),
  (req, res) => {
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: req.user._id,
        email: req.user.email 
      },
      process.env.JWT_SECRET || 'sahyog-jwt-secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error logging out'
      });
    }
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });
});

// Get current user
router.get('/current', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({
      success: true,
      user: req.user
    });
  }

  // Check JWT token
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sahyog-jwt-secret');
    const User = require('../models/User');
    
    User.findById(decoded.id)
      .select('-googleId')
      .then(user => {
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
      })
      .catch(err => {
        res.status(500).json({
          success: false,
          message: 'Error fetching user'
        });
      });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

module.exports = router;
