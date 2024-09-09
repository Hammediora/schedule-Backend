import mongoose from 'mongoose';

// Define the Task schema
const TaskSchema = new mongoose.Schema({
  task_name: { type: String, required: true },  // Name of the task (e.g., "Inventory Management")
  description: { type: String },  // Optional description of the task
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },  // Priority of the task
  deadline: { type: Date },  // Optional deadline for the task
}, {
  timestamps: true  // Automatically create `createdAt` and `updatedAt` fields
});

// Create the Task model
const Task = mongoose.model('Task', TaskSchema);
export default Task;
