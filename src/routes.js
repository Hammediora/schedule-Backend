import express from 'express';
import scheduleController from './controllers/scheduleController.js';
import UserController from './controllers/UserController.js';
import taskController from './controllers/taskController.js';
import timeOffController from './controllers/timeOffController.js';

const router = express.Router();

// User routes
router.post('/users', UserController.createUser);    // Create a new user
router.get('/users', UserController.getAllUsers);    // Get all users for visualization
router.get('/users/login', UserController.loginUser);

// Task routes
router.post('/tasks', taskController.createTask);  // POST to create a task
router.get('/tasks', taskController.getTasks);     // GET to fetch all tasks

// Schedule routes
router.post('/schedules', scheduleController.createSchedule);  // POST to create a schedule
router.get('/schedules', scheduleController.getSchedules);     // GET to fetch all schedules
router.put('/schedules/:id/approve', scheduleController.approveSchedule);  // PUT to approve a schedule by ID

// Time-off routes
router.post('/timeoff', timeOffController.createTimeOffRequest);  // POST to create a time-off request
router.get('/timeoff', timeOffController.getTimeOffRequests);     // GET to fetch all time-off requests
router.put('/timeoff/:id/approve', timeOffController.approveTimeOffRequest);  // PUT to approve a time-off request by ID

export default router;
