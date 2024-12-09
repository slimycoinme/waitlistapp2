import { db } from '../config/firebase.js';

export class UserModel {
  static async updatePositions(userId, referrals, created_at) {
    const batch = db.batch();
    
    // Get all users with same or lower referrals
    const usersToUpdate = await db.collection('users')
      .where('referrals', '<=', referrals)
      .orderBy('referrals', 'desc')
      .orderBy('created_at', 'asc')
      .get();
    
    let currentPosition = 1;
    let userPosition = null;
    
    // Get users with more referrals to determine starting position
    const higherUsers = await db.collection('users')
      .where('referrals', '>', referrals)
      .count()
      .get();
    
    currentPosition += higherUsers.data().count;
    
    // Update positions for users with same or lower referrals
    for (const doc of usersToUpdate.docs) {
      if (doc.id === userId) {
        userPosition = currentPosition;
      }
      
      if (doc.data().position !== currentPosition) {
        batch.update(doc.ref, { position: currentPosition });
      }
      currentPosition++;
    }
    
    await batch.commit();
    return userPosition;
  }

  static async getPosition(email) {
    const userDoc = await db.collection('users')
      .where('email', '==', email)
      .get();
    
    if (userDoc.empty) return -1;
    
    return userDoc.docs[0].data().position || -1;
  }

  static async create(userData) {
    const batch = db.batch();
    
    // Create the user document
    const userRef = db.collection('users').doc();
    batch.set(userRef, {
      ...userData,
      position: null, // Will be updated in updatePositions
      created_at: new Date()
    });
    
    // If user was referred, update referrer's count and positions
    if (userData.referred_by) {
      const referrerDoc = await db.collection('users')
        .where('referral_code', '==', userData.referred_by)
        .get();
      
      if (!referrerDoc.empty) {
        const referrer = referrerDoc.docs[0];
        const newReferralCount = (referrer.data().referrals || 0) + 1;
        batch.update(referrer.ref, { referrals: newReferralCount });
        
        // Commit the batch to save user and update referrer
        await batch.commit();
        
        // Update positions for all affected users
        await this.updatePositions(referrer.id, newReferralCount, referrer.data().created_at);
      } else {
        await batch.commit();
      }
    } else {
      await batch.commit();
    }
    
    // Update positions for the new user
    const position = await this.updatePositions(userRef.id, 0, userData.created_at);
    
    return {
      id: userRef.id,
      ...userData,
      position
    };
  }

  static async getAllUsers(limit = 1000, startAfter = null) {
    try {
      console.log('Starting getAllUsers with limit:', limit);
      
      // First, check if we can access Firestore
      const usersRef = db.collection('users');
      console.log('Got users collection reference');
      
      // Try to get all documents with ordering
      console.log('Fetching documents...');
      let query = usersRef.orderBy('created_at', 'desc');
      
      // Apply pagination with high limit
      if (limit) {
        query = query.limit(limit);
      }
      
      if (startAfter) {
        query = query.startAfter(startAfter);
      }
      
      const snapshot = await query.get();
      console.log(`Found ${snapshot.size} documents`);
      
      if (snapshot.empty) {
        console.log('No documents found in the users collection');
        return [];
      }
      
      // Process documents
      const users = [];
      snapshot.forEach(doc => {
        try {
          const data = doc.data();
          console.log('Processing document:', doc.id, data);
          users.push({
            id: doc.id,
            ...data,
            created_at: data.created_at?.toDate()?.toISOString() || new Date().toISOString()
          });
        } catch (docError) {
          console.error('Error processing document:', doc.id, docError);
        }
      });
      
      console.log(`Successfully processed ${users.length} users`);
      return users;
      
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  static async testFirestoreConnection() {
    try {
      await db.collection('users').get();
      console.log('Firestore connection test successful');
    } catch (error) {
      console.error('Error in Firestore connection test:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
}
