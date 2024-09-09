import express from 'express';
import scheduleController from './controllers/Schedule/scheduleController.js';
import UserController from './controllers/User/UserController.js';
import taskController from './controllers/Task/taskController.js';
import timeOffController from './controllers/TimeOff/timeOffController.js';

const router = express.Router();

// User routes
router.post('/createTask', taskController.createTask);  
router.get('/getTask', taskController.getTasks);  


// Task routes
router.post('/createUser', UserController.createUser);  
router.get('/getUser', UserController.getUsers);   

// Create and fetch schedules
router.post('/createSchedule', scheduleController.createSchedule);
router.get('/getSchedule', scheduleController.getSchedules);
router.put('/:id/approve', scheduleController.approveSchedule);

// Time-off requests
router.post('/createTimeOffRequest', timeOffController.createTimeOffRequest);
router.get('/getTimeOffRequests', timeOffController.getTimeOffRequests);
router.put('/:id/approve', timeOffController.approveTimeOffRequest);

export default router;
