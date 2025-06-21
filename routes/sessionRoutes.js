import express from 'express';
import { getActiveSessions } from '../controllers/sessionController.js';

const router = express.Router();

// Already protected with verifyToken in server.js
router.get('/active', getActiveSessions); // GET /api/sessions/active

export default router;
