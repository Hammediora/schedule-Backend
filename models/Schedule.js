import mongoose from 'mongoose';


// Define the Schedule schema
const ScheduleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to the User
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },  // Reference to the Task
  date: { type: Date, required: true },  // The date/time of the task/shift
  is_approved: { type: Boolean, default: false },  // Whether the schedule has been approved by a manager
}, {
  timestamps: true  // Automatically create `createdAt` and `updatedAt` fields
});

// Create the Schedule model
const Schedule = mongoose.model('Schedule', ScheduleSchema);
export default Schedule;

