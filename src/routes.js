import express from 'express';
import scheduleController from './controllers/scheduleController.js';
import userController from './controllers/UserController.js';
import taskController from './controllers/taskController.js';
import timeOffController from './controllers/timeOffController.js';

const router = express.Router();

// -------------------- User Routes --------------------
router.post('/users', userController.createUser);
router.get('/users', userController.getAllUsers);
router.get('/users/login', userController.loginUser);
router.post('/users/addEmployee', userController.addEmployee);
router.get('/users/:id', userController.getEmployeeById);
router.put('/users/:id', userController.updateEmployee);
router.delete('/users/:id', userController.deleteEmployee);
router.post('/users/:id/tasks', userController.assignTasksToUser);
router.get('/users/:id/tasks', userController.getTasksForUser);

// -------------------- Task Routes --------------------
router.post('/tasks', taskController.createTask);
router.get('/tasks', taskController.getTasks);
router.get('/tasks/:id', taskController.getTaskById);
router.put('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);
router.get('/tasks/predefined', taskController.getPredefinedTasks);

// -------------------- Schedule Routes --------------------
router.post('/schedules/generate-weekly', scheduleController.generateSchedulesForWeek); 
router.get('/schedules', scheduleController.getSchedules);
router.put('/schedules/:scheduleId', scheduleController.updateSchedule);
router.delete('/schedules/:scheduleId', scheduleController.softDeleteSchedule);
router.put('/schedules/:scheduleId/approve', scheduleController.approveSchedule);  

// -------------------- Time-off Routes --------------------
router.post('/timeoff', timeOffController.createTimeOffRequest);
router.get('/timeoff', timeOffController.getTimeOffRequests);
router.put('/timeoff/:id/approve', timeOffController.approveTimeOffRequest);

export default router;
