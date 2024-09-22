import User from '../../models/User.js';
import { generateEmployeeId } from '../../utils/generateEmployeeId.js';
import admin from '../config.js/firebaseAdmin.js';

// Create a new user with Firebase UID (for signup)
const createUser = async (req, res) => {
  const { firebaseUid, name, email, role, availability, shift_preferences } = req.body;
  try {
    const userExists = await User.findOne({ firebaseUid });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const [firstName, lastName] = name.split(' ');
    const employeeId = await generateEmployeeId(firstName, lastName);
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
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

// Add new employee (without Firebase UID)
const addEmployee = async (req, res) => {
  const { name, role, availability, tasks } = req.body;
  try {
    const employeeId = await generateEmployeeId(name.split(' ')[0], name.split(' ')[1]);
    const newEmployee = new User({
      name,
      role,
      employeeId,
      availability,
      assignedTasks: tasks,  
    });
    const savedEmployee = await newEmployee.save();
    res.status(201).json({
      _id: savedEmployee._id,
      employeeId: savedEmployee.employeeId,
      name: savedEmployee.name,
      role: savedEmployee.role,
      availability: savedEmployee.availability,
      assignedTasks: savedEmployee.assignedTasks, 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add employee', error: error.message });
  }
};

// View an employee by ID (populate assignedTasks)
const getEmployeeById = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id).populate('assignedTasks');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee', error: error.message });
  }
};

// Update employee by ID
const updateEmployee = async (req, res) => {
  const { name, role, availability, tasks } = req.body; 
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    employee.name = name || employee.name;
    employee.role = role || employee.role;
    employee.availability = availability || employee.availability;
    employee.assignedTasks = tasks || employee.assignedTasks;  
    const updatedEmployee = await employee.save();
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: 'Error updating employee', error: error.message });
  }
};

// Delete employee by ID
const deleteEmployee = async (req, res) => {
  try {
    const employee = await User.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting employee', error: error.message });
  }
};

// Login user using Firebase ID Token
const loginUser = async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(400).json({ message: 'No token provided' });
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebaseUid = decodedToken.uid;
    const user = await User.findOne({ firebaseUid });
    if (!user) return res.status(404).json({ message: 'User not found in the database' });
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
};

// Verify Firebase ID token and get user profile
const verifyToken = async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebaseUid = decodedToken.uid;
    const user = await User.findOne({ firebaseUid });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
};

// Get all users (populate assignedTasks)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('assignedTasks'); 
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Assign tasks to user
const assignTasksToUser = async (req, res) => {
  const { userId, taskIds } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Assign tasks to the user
    user.assignedTasks = [...new Set([...user.assignedTasks, ...taskIds])]; // Prevent duplicate task assignment
    await user.save();

    res.status(200).json({ message: 'Tasks assigned successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning tasks to user', error: error.message });
  }
};

const getTasksForUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('assignedTasks');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

export default {
  createUser,
  loginUser,
  addEmployee,
  getAllUsers,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getTasksForUser,
  assignTasksToUser,
  verifyToken,
};