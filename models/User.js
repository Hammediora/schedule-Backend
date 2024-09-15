import mongoose from 'mongoose';

// Define the User schema with both Firebase UID and Employee ID
const UserSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true }, 
  employeeId: { type: String, unique: true },  
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { 
    type: String, 
    enum: ['general manager', 'service manager', 'kitchen manager', 'crew member'],  
    default: 'crew member' 
  },

  // Dedicated fields for availability and shift preferences
  availability: {
    monday: { start: String, end: String },  
    tuesday: { start: String, end: String },  
    wednesday: { start: String, end: String },
    thursday: { start: String, end: String },
    friday: { start: String, end: String },
    saturday: { start: String, end: String },
    sunday: { start: String, end: String }
  },

  shift_preferences: { type: String, enum: ['morning', 'afternoon', 'evening', 'night'], default: 'morning' },

  // JSON field for additional, non-queryable preferences
  additional_preferences: { type: Object, default: {} }

}, {
  timestamps: true
});

// Create and export the User model
const User = mongoose.model('User', UserSchema);
export default User;
