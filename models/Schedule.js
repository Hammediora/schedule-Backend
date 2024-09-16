import mongoose from 'mongoose';


// Define the Schedule schema
const ScheduleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },  
  date: { type: Date, required: true }, 
  is_approved: { type: Boolean, default: false },  
}, {
  timestamps: true  
});

// Create the Schedule model
const Schedule = mongoose.model('Schedule', ScheduleSchema);
export default Schedule;

