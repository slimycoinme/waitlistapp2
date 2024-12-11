import express from 'express';
import cors from 'cors';
import userRoutes from './routes/users.js';

const app = express();
const port = process.env.PORT || 3000;

// Start server
const startServer = async () => {
  try {
    // Middleware
    app.use(cors({
      origin: ['http://localhost:5173', 'http://localhost:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
    app.use(express.json());

    // Log all requests
    app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
      next();
    });

    // Routes
    app.use('/api/users', userRoutes);

    // Health check endpoint
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', environment: process.env.NODE_ENV, projectId: process.env.FIREBASE_PROJECT_ID });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error('Global error handler:', err);
      res.status(500).json({ error: 'Internal server error', message: err.message });
    });

    // Start listening
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log('Environment:', process.env.NODE_ENV);
      console.log('Firebase Project ID:', process.env.FIREBASE_PROJECT_ID);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
