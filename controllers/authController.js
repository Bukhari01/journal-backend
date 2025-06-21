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
    const agent = useragent.parse(req.headers['user-agent']);
    const userAgentString = agent.toString();

    let device = agent.device.family;
    if (device === 'Other') {
      device = 'Desktop';
    }

    let browserName = agent.family;
    if (req.headers['user-agent'].includes('Edg/')) {
      browserName = 'Edge';
    }

    const sessionQuery = {
      userId: user._id,
      browser: browserName,
      os: agent.os.toString(),
      device: device
    };

    const session = await Session.findOneAndUpdate(
      sessionQuery,
      {
        $set: {
          accessToken: token,
          lastUsedAt: new Date(),
          ip: req.ip,
          isActive: true,
          userAgent: userAgentString,
        },
        $setOnInsert: { createdAt: new Date(), browser: browserName, os: agent.os.toString(), device: device }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const isNewSession = Math.abs(session.createdAt.getTime() - session.lastUsedAt.getTime()) < 1000;

    if (isNewSession) {
      const activeSessions = await Session.find({ userId: user._id, isActive: true }).sort({ createdAt: -1 }); // newest first

      if (activeSessions.length > 2) {
        // Invalidate the oldest session(s)
        const sessionsToDeactivate = activeSessions.slice(2);
        for (const s of sessionsToDeactivate) {
          s.isActive = false;
          await s.save();
        }
      }
    }

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
