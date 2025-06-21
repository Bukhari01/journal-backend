// controllers/authController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import useragent from 'useragent';

import User from '../models/User.js';
import Session from '../models/Session.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ msg: 'Username already exists' });

    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Registration failed', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = generateToken(user._id);

    // Session tracking
    const agent = useragent.parse(req.headers['user-agent']);
    const sessionData = {
      userId: user._id,
      accessToken: token,
      userAgent: agent.toString(),
      ip: req.ip,
    };

    // Enforce 2-device session limit
    const activeSessions = await Session.find({ userId: user._id, isActive: true }).sort({ createdAt: 1 });

    if (activeSessions.length >= 2) {
      const oldest = activeSessions[0];
      oldest.isActive = false;
      await oldest.save();
    }

    await Session.create(sessionData);

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ msg: 'Login failed', error: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.token;
    const session = await Session.findOne({ accessToken: token, isActive: true });

    if (session) {
      session.isActive = false;
      await session.save();
    }

    res.status(200).json({ msg: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Logout failed', error: err.message });
  }
};

export const logoutAll = async (req, res) => {
  try {
    const userId = req.user.id;
    await Session.updateMany({ userId, isActive: true }, { isActive: false });
    res.status(200).json({ msg: 'Logged out from all devices' });
  } catch (err) {
    res.status(500).json({ msg: 'Logout all failed', error: err.message });
  }
};
