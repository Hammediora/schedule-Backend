import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config(); 

// Path to your service account key file or environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
