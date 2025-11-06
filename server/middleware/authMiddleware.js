import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// This is the "gatekeeper" function
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
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find the user by the ID from the token
      //    and attach their info to the 'req' object
      req.user = await User.findById(decoded.user.id).select('-password');

      // 4. Call 'next()' to pass control to the actual route
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// --- This is the line that fixes the error ---
export { protect };