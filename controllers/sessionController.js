import Session from '../models/Session.js';

export const getActiveSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      userId: req.user.id,
      isActive: true
    }).select('-accessToken'); // Don't send token back

    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch sessions', error: err.message });
  }
};
