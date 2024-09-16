import mongoose from 'mongoose';

// Define the Notification schema
const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  message: { type: String, required: true },  
  read_status: { type: Boolean, default: false },  
}, {
  timestamps: true  
});

// Create the Notification model
const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;
