import User from '../../models/User.js';
import { generateEmployeeId } from '../../utils/generateEmployeeId.js';
import admin from '../config.js/firebaseAdmin.js';

// Create a new user with Firebase UID
const createUser = async (req, res) => {
  const { firebaseUid, name, email, role, availability, shift_preferences } = req.body;

  try {
    console.log("Creating a new user", { firebaseUid, name, email });
    const userExists = await User.findOne({ firebaseUid });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate a unique Employee ID
    const [firstName, lastName] = name.split(' ');
    const employeeId = await generateEmployeeId(firstName, lastName);

    // Create a new user in MongoDB with Firebase UID and Employee ID
    const user = new User({
      firebaseUid,
      employeeId,
      name,
      email,
    });

    const savedUser = await user.save();

    res.status(201).json({
      _id: savedUser._id,
      firebaseUid: savedUser.firebaseUid,
      employeeId: savedUser.employeeId,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

// Login user using Firebase ID Token
const loginUser = async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }

  try {
    // Step 1: Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebaseUid = decodedToken.uid;

    // Step 2: Find user in MongoDB
    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.status(404).json({ message: 'User not found in the database' });
    }

    // Step 3: Return user data to frontend
    res.status(200).json({
      _id: user._id,
      firebaseUid: user.firebaseUid,
      employeeId: user.employeeId,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
};

// @desc    Verify Firebase ID token and get user profile
const verifyToken = async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];  

  try {
    // Verify the Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebaseUid = decodedToken.uid;

    // Find the user in MongoDB by Firebase UID
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      _id: user._id,
      firebaseUid: user.firebaseUid,
      employeeId: user.employeeId,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();  
    console.log(users)
    res.status(200).json(users);      
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

export default { 
  createUser,
  loginUser,  
  getAllUsers,
  verifyToken,  
};
