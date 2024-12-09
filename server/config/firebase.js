import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the server/.env file
config({ path: join(dirname(__dirname), '.env') });

let db;

// Initialize Firebase Admin
try {
  console.log('Initializing Firebase Admin...');
  console.log('Project ID:', process.env.FIREBASE_PROJECT_ID);
  
  const app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
      privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID
    }),
    projectId: process.env.FIREBASE_PROJECT_ID
  });

  console.log('Firebase Admin initialized successfully');
  
  // Initialize and configure Firestore
  db = getFirestore(app);
  db.settings({ ignoreUndefinedProperties: true });
  
  console.log('Firestore initialized');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

export { db };
