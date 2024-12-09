// Input validation helpers
export const isValidEmail = (email) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
};

export const isValidName = (name) => {
  return typeof name === 'string' && name.length > 0 && name.length <= 100;
};

// Generate a unique referral code
export const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Calculate user position based on referral count
export const calculatePosition = async (db, email) => {
  const usersRef = db.collection('users');
  const userDoc = await usersRef.where('email', '==', email).get();
  
  if (userDoc.empty) return -1;

  const userData = userDoc.docs[0].data();
  const allUsers = await usersRef.get();
  
  let position = 1;
  for (const doc of allUsers.docs) {
    const otherUser = doc.data();
    if (
      otherUser.email !== email && (
        otherUser.referrals > userData.referrals ||
        (otherUser.referrals === userData.referrals && doc.createTime < userDoc.docs[0].createTime)
      )
    ) {
      position++;
    }
  }
  
  return position;
};
