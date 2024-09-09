import mongoose from 'mongoose';

// Define the Notification schema
const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to the User
  message: { type: String, required: true },  // Notification message content
  read_status: { type: Boolean, default: false },  // Whether the user has read the notification
}, {
  timestamps: true  // Automatically create `createdAt` and `updatedAt` fields
});

// Create the Notification model
const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;
