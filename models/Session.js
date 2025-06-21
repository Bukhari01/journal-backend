import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  accessToken: String,
  userAgent: String,
  browser: String,
  os: String,
  device: String,
  ip: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastUsedAt: { type: Date, default: Date.now }
});

const Session = mongoose.model('Session', sessionSchema);
export default Session;
