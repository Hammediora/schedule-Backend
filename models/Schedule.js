import mongoose from 'mongoose';

// Define the Schedule schema
const ScheduleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },  
  shift: {
    day: { type: String, required: true }, 
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    date: { type: Date, required: true },  
  },
  is_approved: { type: Boolean, default: false },  
  feedback: { 
    comment: { type: String, default: null },
    submitted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: { type: String, enum: ['availability', 'proficiency', 'overlap', 'other'], default: 'other' }
  },
  is_active: { type: Boolean, default: true },

  // Week-related fields to identify which week the schedule belongs to
  week_start: { type: Date, required: true },  
  week_end: { type: Date, required: true },   

  projected_sales: { type: Number, default: 0 },  
  required_employees: { type: Number, default: 0 },

}, {
  timestamps: true
});

// Helper function to assign the correct week_start and week_end based on a date
ScheduleSchema.methods.setWeekRange = function () {
  const currentDate = new Date(this.shift.date);
  const dayOfWeek = currentDate.getUTCDay();
  
  // Calculate the start and end of the week (assuming the week starts on Monday)
  const mondayDate = new Date(currentDate);
  mondayDate.setDate(currentDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  const sundayDate = new Date(mondayDate);
  sundayDate.setDate(mondayDate.getDate() + 6);

  this.week_start = mondayDate;
  this.week_end = sundayDate;
};

// Pre-save middleware to ensure week_start and week_end are set
ScheduleSchema.pre('save', function(next) {
  if (!this.week_start || !this.week_end) {
    this.setWeekRange();
  }
  next();
});

// Create the Schedule model
const Schedule = mongoose.model('Schedule', ScheduleSchema);
export default Schedule;
