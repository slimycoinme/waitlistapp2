import express from 'express';
import { getAllUsers, createUser, getUserPosition } from '../controllers/userController.js';

const router = express.Router();

// Get all users
router.get('/', getAllUsers);

// Create new user
router.post('/', createUser);

// Get user position
router.get('/:email/position', getUserPosition);

export default router;
