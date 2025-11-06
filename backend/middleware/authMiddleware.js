const jwt = require('jsonwebtoken');
const User = require('../models/User');

// This middleware is compatible with server folder's protect middleware
// It provides the same functionality while working with backend's User model
const protect = async (req, res, next) => {
  let token;

  // Check for the token in the "Authorization" header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 1. Get the token from the header (e.g., "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token is valid
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key-change-in-production'
      );

      // 3. Find the user by the ID from the token
      //    and attach their info to the 'req' object
      // Server folder uses decoded.user.id, backend uses decoded.userId
      const userId = decoded.user?.id || decoded.userId;
      req.user = await User.findById(userId).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // 4. Call 'next()' to pass control to the actual route
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };

