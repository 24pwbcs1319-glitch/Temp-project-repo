import express from 'express';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

import authRoutes from './server/routes/auth.js';
import taskRoutes from './server/routes/tasks.js';
import subjectRoutes from './server/routes/subjects.js';

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

/**
 * Connects to MongoDB. If no URI is provided, it spins up an in-memory db for testing
 */
async function connectDB() {
  try {
    let mongoUri = process.env.MONGODB_URI || 'mongodb+srv://smart_user01:smartstudyplanner@smart-study-planner.swvjusm.mongodb.net/SmartStudyPlanner?appName=Smart-Study-Planner';

    if (mongoUri && !mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
      console.warn('Invalid MONGODB_URI format. Using explicit Atlas fallback...');
      mongoUri = 'mongodb+srv://smart_user01:smartstudyplanner@smart-study-planner.swvjusm.mongodb.net/SmartStudyPlanner?appName=Smart-Study-Planner';
    }

    if (!mongoUri) {
      console.log('No MONGODB_URI provided. Starting ephemeral in-memory MongoDB for demo mode...');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log(`In-memory database started at ${mongoUri}`);
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/subjects', subjectRoutes);

/**
 * Health Check Endpoint for the server
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Smart Study Planner API running' });
});

/**
 * Starts the Express server and integrates Vite middleware in development
 */
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production built files
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
