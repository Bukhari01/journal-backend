import jwt from 'jsonwebtoken';
import Session from '../models/Session.js';

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (!token) return res.status(401).json({ msg: 'Missing token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const session = await Session.findOne({
      userId: decoded.id,
      accessToken: token,
      isActive: true,
    });

    if (!session) return res.status(401).json({ msg: 'Session invalid or expired' });

    req.user = decoded;
    req.token = token;
    session.lastUsedAt = new Date();
    await session.save();

    next();
  } catch (err) {
    return res.status(403).json({ msg: 'Unauthorized' });
  }
};
