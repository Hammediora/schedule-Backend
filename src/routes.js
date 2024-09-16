import express from 'express';
import scheduleController from './controllers/scheduleController.js';
import UserController from './controllers/UserController.js';  
import taskController from './controllers/taskController.js';
import timeOffController from './controllers/timeOffController.js';

const router = express.Router();

// User routes
router.post('/users', UserController.createUser);                   
router.get('/users', UserController.getAllUsers);                    
router.get('/users/login', UserController.loginUser);               
router.post('/users/addEmployee', UserController.addEmployee);       

// New user-related routes
router.get('/users/:id', UserController.getEmployeeById);           
router.put('/users/:id', UserController.updateEmployee);           
router.delete('/users/:id', UserController.deleteEmployee);     

// Task routes
router.post('/tasks', taskController.createTask);                    
router.get('/tasks', taskController.getTasks);
router.get('/tasks', taskController.getTaskById);   
router.put('/task', taskController.updateTask);
router.delete('task', taskController.deleteTask)             

// Schedule routes
router.post('/schedules', scheduleController.createSchedule);      
router.get('/schedules', scheduleController.getSchedules);          
router.put('/schedules/:id/approve', scheduleController.approveSchedule); 

// Time-off routes
router.post('/timeoff', timeOffController.createTimeOffRequest);     
router.get('/timeoff', timeOffController.getTimeOffRequests);       
router.put('/timeoff/:id/approve', timeOffController.approveTimeOffRequest);  

export default router;
