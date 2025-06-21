import express from 'express';
import {
  createEntry,
  getAllEntries,
  getEntryById,
  updateEntry,
  deleteEntry
} from '../controllers/journalController.js';

const router = express.Router();

// All routes are protected via verifyToken in server.js

// Better, human-readable route paths
router.post('/create', createEntry);                  // POST /api/journal/create
router.get('/all', getAllEntries);                    // GET  /api/journal/all
router.get('/entry/:id', getEntryById);               // GET  /api/journal/entry/:id
router.put('/update/:id', updateEntry);               // PUT  /api/journal/update/:id
router.delete('/delete/:id', deleteEntry);            // DELETE /api/journal/delete/:id

export default router;
