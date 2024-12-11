import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

// Get Firestore instance
const db = getFirestore(app);

// Configure Firestore settings
db.settings({
  ignoreUndefinedProperties: true,
});

// Retry mechanism with exponential backoff
const retry = async (operation, maxRetries = 5) => {
  let lastError;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // If it's not a quota error, throw immediately
      if (error.code !== 8) {
        throw error;
      }
      
      // Calculate delay with exponential backoff and jitter
      const baseDelay = Math.min(1000 * Math.pow(2, attempt), 10000);
      const jitter = Math.random() * 1000;
      const delay = baseDelay + jitter;
      
      console.log(`Quota exceeded. Attempt ${attempt + 1}/${maxRetries}. Retrying in ${Math.round(delay)}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  console.error(`Failed after ${maxRetries} attempts:`, lastError);
  throw lastError;
};

export { db, retry };
