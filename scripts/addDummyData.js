import { db } from '../src/config/firebase.js';
import { collection, addDoc } from 'firebase/firestore';

const dummyData = [
  {
    name: "Test User 1",
    email: "test1@example.com",
    joinedAt: new Date(),
    status: "pending"
  },
  {
    name: "Test User 2",
    email: "test2@example.com",
    joinedAt: new Date(),
    status: "approved"
  }
];

async function addDummyData() {
  try {
    const waitlistRef = collection(db, 'waitlist');
    
    for (const data of dummyData) {
      await addDoc(waitlistRef, data);
      console.log('Added document with data:', data);
    }
    
    console.log('Successfully added all dummy data!');
  } catch (error) {
    console.error('Error adding dummy data:', error);
  }
}

addDummyData();
