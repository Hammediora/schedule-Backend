import mongoose from 'mongoose';

// Define the Time-Off Request schema
const TimeOffRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to the User
  requested_date: { type: Date, required: true },  // The date for which time off is requested
  approved: { type: Boolean, default: false },  // Whether the request is approved by a manager
}, {
  timestamps: true  // Automatically create `createdAt` and `updatedAt` fields
});

// Create the Time-Off Request model
const TimeOffRequest = mongoose.model('TimeOffRequest', TimeOffRequestSchema);
export default TimeOffRequest;
