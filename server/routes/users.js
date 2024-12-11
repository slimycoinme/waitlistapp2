import express from 'express';
import { getUsers, createUser, getUserByEmail, getUserByReferralCode } from '../controllers/userController.js';

const router = express.Router();

// Get all users with pagination
router.get('/', getUsers);

// Create new user
router.post('/', createUser);

// Get user by email
router.get('/email/:email', getUserByEmail);

// Get user by referral code
router.get('/referral/:referralCode', getUserByReferralCode);

export default router;
