import mongoose from 'mongoose';

// Define the User schema with both Firebase UID and Employee ID
const UserSchema = new mongoose.Schema({
  firebaseUid: { type: String, default: null},  
  employeeId: { type: String, unique: true },   
  name: { type: String, required: true },
  email: { type: String, default: null, unique: true, sparse: true },  
  role: { 
    type: String, 
    enum: ['general manager', 'service manager', 'kitchen manager', 'crew member'],  
    default: 'crew member' 
  },

  // Dedicated fields for availability and shift preferences
  availability: {
    monday: { start: String, end: String, off: { type: Boolean, default: false } },  
    tuesday: { start: String, end: String, off: { type: Boolean, default: false } },  
    wednesday: { start: String, end: String, off: { type: Boolean, default: false } },
    thursday: { start: String, end: String, off: { type: Boolean, default: false } },
    friday: { start: String, end: String, off: { type: Boolean, default: false } },
    saturday: { start: String, end: String, off: { type: Boolean, default: false } },
    sunday: { start: String, end: String, off: { type: Boolean, default: false } }
  },

  shift_preferences: { type: String, enum: ['morning', 'afternoon', 'evening', 'night'], default: 'morning' },

  // JSON field for additional, non-queryable preferences
  additional_preferences: { type: Object, default: {} },

  // Array of assigned tasks (reference to Task model)
  assignedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }] 

}, {
  timestamps: true
});

// Create and export the User model
const User = mongoose.model('User', UserSchema);
export default User;
