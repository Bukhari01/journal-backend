import JournalEntry from '../models/JournalEntry.js';

export const createEntry = async (req, res) => {
  try {
    const { title, content, date } = req.body;
    const newEntry = new JournalEntry({
      userId: req.user.id,
      title,
      content,
      date,
    });

    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to create entry', error: err.message });
  }
};

export const getAllEntries = async (req, res) => {
  try {
    const entries = await JournalEntry.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(entries);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch entries', error: err.message });
  }
};

export const getEntryById = async (req, res) => {
  try {
    const entry = await JournalEntry.findOne({ _id: req.params.id, userId: req.user.id });
    if (!entry) return res.status(404).json({ msg: 'Entry not found' });

    res.status(200).json(entry);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching entry', error: err.message });
  }
};

export const updateEntry = async (req, res) => {
  try {
    const { title, content, date } = req.body;
    const updated = await JournalEntry.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, content, date },
      { new: true }
    );

    if (!updated) return res.status(404).json({ msg: 'Entry not found or unauthorized' });

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update entry', error: err.message });
  }
};

export const deleteEntry = async (req, res) => {
  try {
    const deleted = await JournalEntry.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ msg: 'Entry not found or unauthorized' });

    res.status(200).json({ msg: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete entry', error: err.message });
  }
};