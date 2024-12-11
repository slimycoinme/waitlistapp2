import { db, retry } from '../config/firebase.js';

class UserModel {
  static async getAllUsers(limit = 25, startAfterDoc = null) {
    console.log('Starting getAllUsers query with limit:', limit);
    
    try {
      // First get total count
      const totalCount = await this.getTotalUsers();
      console.log('Total users in database:', totalCount);

      let query = db.collection('users')
        .orderBy('referrals', 'desc')
        .limit(limit);

      if (startAfterDoc && startAfterDoc.id) {
        console.log('Using startAfter document:', startAfterDoc);
        const docRef = await db.collection('users').doc(startAfterDoc.id).get();
        if (docRef.exists) {
          query = query.startAfter(docRef);
        }
      }

      console.log('Executing Firestore query...');
      const snapshot = await retry(async () => await query.get());
      
      if (!snapshot) {
        console.log('No snapshot returned from Firestore');
        return { users: [], lastDoc: null, totalCount };
      }
      
      console.log('Query completed successfully. Documents found:', snapshot.size);

      const users = [];
      let position = startAfterDoc ? startAfterDoc.position + 1 : 1;
      
      snapshot.forEach(doc => {
        const userData = doc.data();
        users.push({
          id: doc.id,
          ...userData,
          position // Use the current position based on referrals order
        });
        position++;
      });

      const lastDoc = snapshot.docs[snapshot.docs.length - 1];
      if (lastDoc) {
        const lastDocData = lastDoc.data();
        return {
          users,
          lastDoc: {
            id: lastDoc.id,
            referrals: lastDocData.referrals,
            position: position - 1
          },
          totalCount
        };
      }

      return { users, lastDoc: null, totalCount };
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      throw error;
    }
  }

  static async createUser(userData) {
    console.log('Starting createUser with data:', userData);
    
    try {
      // Validate required fields
      if (!userData.email) {
        throw new Error('Email is required');
      }

      // Check if user already exists
      const existingUser = await this.getUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Generate a unique referral code
      const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // Get a new document reference
      const userRef = db.collection('users').doc();
      
      // Calculate position based on referrals
      const allUsers = await retry(async () => {
        return await db.collection('users')
          .orderBy('referrals', 'desc')
          .get();
      });
      
      let position = 1;
      allUsers.forEach(() => position++);

      // Prepare user document
      const userDoc = {
        ...userData,
        referral_code: referralCode,
        referrals: 0,
        position: position,
        created_at: new Date(),
        updated_at: new Date()
      };

      // Create user document with retry mechanism
      await retry(async () => {
        await userRef.set(userDoc);
        console.log('User document created successfully');
      });

      return { 
        id: userRef.id,
        ...userDoc
      };
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  }

  static async updateReferralCount(userId, referrals) {
    try {
      const userRef = db.collection('users').doc(userId);
      
      await retry(async () => {
        await userRef.update({
          referrals: referrals,
          updated_at: new Date()
        });
      });

      // Recalculate positions for all users
      const users = await this.getAllUsers(1000); // Get all users
      const sortedUsers = users.users.sort((a, b) => b.referrals - a.referrals);

      // Update positions
      const updates = sortedUsers.map((user, index) => ({
        ref: db.collection('users').doc(user.id),
        position: index + 1
      }));

      // Batch update positions
      const batchSize = 500;
      for (let i = 0; i < updates.length; i += batchSize) {
        const batch = db.batch();
        updates.slice(i, i + batchSize).forEach(({ ref, position }) => {
          batch.update(ref, { position });
        });
        await retry(async () => await batch.commit());
      }

      return true;
    } catch (error) {
      console.error('Error updating referral count:', error);
      throw error;
    }
  }

  static async getTotalUsers() {
    try {
      const snapshot = await retry(async () => {
        return await db.collection('users').count().get();
      });
      return snapshot.data().count;
    } catch (error) {
      console.error('Error getting total users:', error);
      return 0;
    }
  }

  static async getUserByEmail(email) {
    if (!email) {
      throw new Error('Email is required');
    }

    console.log('Starting getUserByEmail with email:', email);
    
    try {
      const snapshot = await retry(async () => {
        return await db.collection('users')
          .where('email', '==', email)
          .limit(1)
          .get();
      });

      if (!snapshot || snapshot.empty) {
        console.log('No user found with email:', email);
        return null;
      }

      const doc = snapshot.docs[0];
      const userData = doc.data();
      console.log('User found with id:', doc.id);
      
      return { 
        id: doc.id, 
        ...userData
      };
    } catch (error) {
      console.error('Error in getUserByEmail:', error);
      throw error;
    }
  }

  static async getUserByReferralCode(referralCode) {
    if (!referralCode) {
      throw new Error('Referral code is required');
    }

    console.log('Starting getUserByReferralCode with code:', referralCode);
    
    try {
      const snapshot = await retry(async () => {
        return await db.collection('users')
          .where('referral_code', '==', referralCode)
          .limit(1)
          .get();
      });

      if (!snapshot || snapshot.empty) {
        console.log('No user found with referral code:', referralCode);
        return null;
      }

      const doc = snapshot.docs[0];
      const userData = doc.data();
      console.log('User found with id:', doc.id);
      
      return { 
        id: doc.id, 
        ...userData
      };
    } catch (error) {
      console.error('Error in getUserByReferralCode:', error);
      throw error;
    }
  }
}

export default UserModel;
