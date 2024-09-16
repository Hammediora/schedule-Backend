import mongoose from 'mongoose';

// Define the Task schema
const TaskSchema = new mongoose.Schema({
  task: { type: String, required: true }, 
  description: { type: String }, 
}, {
  timestamps: true  
});

// Define the predefined tasks
TaskSchema.statics.PREDEFINED_TASKS = {
  LINE: {
    name: 'Line',
    description: 'Tasks related to managing the line or serving food'
  },
  CASHIER: {
    name: 'Cashier',
    description: 'Tasks related to managing the cash register and transactions'
  },
  GRILL: {
    name: 'Grill',
    description: 'Tasks related to cooking food on the grill'
  },
  PREP: {
    name: 'Prep',
    description: 'Tasks related to preparing food for cooking'
  },
  MANAGER: {
    name: 'Manager',
    description: 'Tasks related to managing the restaurant and supervising employees'
  }
};

// Create the Task model
const Task = mongoose.model('Task', TaskSchema);
export default Task;
