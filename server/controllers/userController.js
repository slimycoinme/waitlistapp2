import { isValidEmail, isValidName, generateReferralCode } from '../utils/helpers.js';
import { UserModel } from '../models/user.js';

export const getAllUsers = async (req, res) => {
  try {
    console.log('Fetching users...');
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startAfter = req.query.startAfter || null;
    
    console.log('Calling UserModel.getAllUsers with:', { limit, startAfter });
    const users = await UserModel.getAllUsers(limit, startAfter);
    console.log('Users fetched:', users);
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, referred_by } = req.body;

    // Validate input
    if (!isValidName(name) || !isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid name or email format' });
    }

    // Check if email already exists
    const existingPosition = await UserModel.getPosition(email);
    if (existingPosition !== -1) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Create new user
    const referralCode = generateReferralCode();
    const userData = {
      name,
      email,
      referral_code: referralCode,
      referrals: 0,
      referred_by: referred_by || null
    };

    const newUser = await UserModel.create(userData);

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserPosition = async (req, res) => {
  try {
    const { email } = req.params;
    
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const position = await UserModel.getPosition(email);
    
    if (position === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ position });
  } catch (error) {
    console.error('Error getting user position:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
