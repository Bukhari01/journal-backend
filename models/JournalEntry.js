import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  content: String,
  date: Date,
}, { timestamps: true });

const JournalEntry = mongoose.model('JournalEntry', journalSchema);
export default JournalEntry;
