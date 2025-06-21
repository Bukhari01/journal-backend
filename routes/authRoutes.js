// routes/authRoutes.js
import express from 'express';
import {
  register,
  login,
  logout,
  logoutAll
} from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.post('/register', register);
router.post('/login', login);

// Protected Routes

router.post('/logout', verifyToken, logout);
router.post('/logout-all', verifyToken, logoutAll);

export default router;
