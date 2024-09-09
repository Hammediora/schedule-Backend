import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Define the User schema with both dedicated fields and JSON for flexibility
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['manager', 'employee'], default: 'employee' },
  hashed_password: { type: String, required: true },  // Hashed password for authentication

  // Dedicated fields for availability and shift preferences
  availability: {
    monday: { start: String, end: String },   // Availability for Monday (e.g., "09:00", "17:00")
    tuesday: { start: String, end: String },  // Availability for Tuesday
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

// Method to hash password before saving the user
UserSchema.pre('save', async function(next) {
  if (!this.isModified('hashed_password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.hashed_password = await bcrypt.hash(this.hashed_password, salt);
  next();
});

// Method to compare password during login
UserSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.hashed_password);
};

// Create and export the User model
const User = mongoose.model('User', UserSchema);
export default User;
