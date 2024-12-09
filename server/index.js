import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { limiter, helmetConfig, sanitizeInput } from './middleware/security.js';
import userRoutes from './routes/users.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { db } from './config/firebase.js';

// Load environment variables
config()

// Get current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const server = express()

// Security middleware
server.use(helmetConfig)
server.use(limiter)
server.use(sanitizeInput)

// Configure CORS
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.ALLOWED_ORIGINS?.split(',') 
        : 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400 // 24 hours
}
server.use(cors(corsOptions))
server.use(express.json({ limit: '10kb' })) // Limit payload size

// Routes
server.use('/api/users', userRoutes)

// Error handler
server.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('Firebase Project ID:', process.env.FIREBASE_PROJECT_ID);
});

export default server;
