import Database from 'better-sqlite3';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { config } from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin with service account
const serviceAccount = JSON.parse(
  fs.readFileSync(join(__dirname, 'config', 'only4u-waitinglist-firebase-adminsdk-rqvz7-b86f667817.json'), 'utf8')
);

initializeApp({
  credential: cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID
});

const firestore = getFirestore();

// Initialize SQLite database
const sqliteDb = new Database(process.env.DB_PATH || join(__dirname, '..', 'data', 'waitlist.db'));

async function migrateData() {
  console.log('Starting migration from SQLite to Firestore...');

  try {
    // Get all users from SQLite
    const users = sqliteDb.prepare('SELECT * FROM users').all();
    console.log(`Found ${users.length} users to migrate`);

    // Create a batch write
    const batch = firestore.batch();

    // Process each user
    for (const user of users) {
      const userRef = firestore.collection('users').doc();
      const userData = {
        name: user.name,
        email: user.email,
        referral_code: user.referral_code,
        referred_by: user.referred_by || null,
        referrals: user.referrals || 0,
        feedback: user.feedback || null,
        created_at: FieldValue.serverTimestamp(),
      };

      batch.set(userRef, userData);
    }

    // Commit the batch
    await batch.commit();
    console.log('Migration completed successfully!');

    // Create email index
    await firestore.collection('users').doc('--indexes--').set({
      email: users.map(user => user.email)
    });

    console.log('Email index created');

  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }

  // Close SQLite connection
  sqliteDb.close();
  process.exit(0);
}

// Run migration
migrateData();
