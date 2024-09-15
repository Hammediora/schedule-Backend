import express from 'express';
import connectDB from './Src/config.js/db.js';
import router from './src/routes.js';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();
const app = express();

// CORS setup
const whitelist = ['http://localhost:3000', 'https://yourproductiondomain.com'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
app.use(cors(corsOptions));

// Connect to MongoDB
connectDB();

// Middleware for logging in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Middleware to parse JSON
app.use(express.json());

// Prefix all routes with /api
app.use('/api', router);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : {},
  });
});

// 404 handler for invalid routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route Not Found' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
