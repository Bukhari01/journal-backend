// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';
import journalRoutes from './routes/journalRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import { verifyToken } from './middleware/authMiddleware.js';
import connectDB from './db/connect.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/journal', verifyToken, journalRoutes);
app.use('/api/sessions', verifyToken, sessionRoutes);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});
