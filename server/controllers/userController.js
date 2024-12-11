import UserModel from '../models/user.js';

// Create new user
export const createUser = async (req, res) => {
  try {
    const { name, email, referralCode } = req.body;
    
    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: {
          name: !name ? 'Name is required' : null,
          email: !email ? 'Email is required' : null
        }
      });
    }

    console.log('Creating new user:', { name, email, referralCode });
    
    // Check if user already exists
    const existingUser = await UserModel.getUserByEmail(email);
    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(409).json({ 
        error: 'User already exists',
        details: 'This email is already registered'
      });
    }

    // If referral code provided, update referrer's count
    if (referralCode) {
      const referrer = await UserModel.getUserByReferralCode(referralCode);
      if (referrer) {
        await UserModel.updateReferralCount(referrer.id, (referrer.referrals || 0) + 1);
      }
    }
    
    // Create user
    const newUser = await UserModel.createUser({ name, email, referralCode });
    console.log('User created successfully:', newUser.id);
    
    res.status(201).json({ 
      message: 'User created successfully',
      user: newUser 
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ 
      error: 'Failed to create user',
      details: error.message
    });
  }
};

// Get all users with pagination
export const getUsers = async (req, res) => {
  try {
    const { limit = 25, startAfter } = req.query;
    console.log('Fetching users with params:', { limit, startAfter });
    
    let startAfterDoc = null;
    if (startAfter) {
      try {
        startAfterDoc = JSON.parse(startAfter);
      } catch (e) {
        console.warn('Invalid startAfter parameter:', e);
      }
    }

    const result = await UserModel.getAllUsers(parseInt(limit), startAfterDoc);
    
    // Format the lastDoc to be JSON-serializable
    const formattedLastDoc = result.lastDoc ? {
      id: result.lastDoc.id,
      referrals: result.lastDoc.referrals,
      position: result.lastDoc.position
    } : null;

    res.json({
      users: result.users,
      lastDoc: formattedLastDoc,
      totalCount: result.totalCount
    });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ 
      error: 'Failed to fetch users',
      details: error.message
    });
  }
};

// Get user by email
export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await UserModel.getUserByEmail(email);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        details: `No user found with email: ${email}`
      });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error getting user by email:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user',
      details: error.message
    });
  }
};

// Get user by referral code
export const getUserByReferralCode = async (req, res) => {
  try {
    const { referralCode } = req.params;
    const user = await UserModel.getUserByReferralCode(referralCode);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        details: `No user found with referral code: ${referralCode}`
      });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error getting user by referral code:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user',
      details: error.message
    });
  }
};
