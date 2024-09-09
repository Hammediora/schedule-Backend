import User from '../../../models/User.js';
import generateToken from '../../../utils/generateToken.js';


const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      name,
      email,
      role,
      hashed_password: password,
    });

    const savedUser = await user.save();
    res.status(201).json({
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
      token: generateToken(savedUser._id)
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user' });
  }
};

// @desc    Get all users
// @route   GET /users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

export default { 
  createUser,
  getUsers, 
};
