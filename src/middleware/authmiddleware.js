import admin from '../config.js/firebaseAdmin.js';
import User from '../../models/User.js';

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get the token from headers
      token = req.headers.authorization.split(' ')[1];

      // Verify Firebase ID token
      const decodedToken = await admin.auth().verifyIdToken(token);
      const firebaseUid = decodedToken.uid;

      // Find user in MongoDB using the Firebase UID
      req.user = await User.findOne({ firebaseUid }).select('-hashed_password');  

      if (!req.user) {
        return res.status(401).json({ message: 'User not found in the database' });
      }

      next();  // Proceed to the next middleware or route
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export default { protect };
