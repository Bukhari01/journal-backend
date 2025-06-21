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

router.post('/create', createEntry);                  
router.get('/all', getAllEntries);                    
router.get('/entry/:id', getEntryById);               
router.put('/update/:id', updateEntry);               
router.delete('/delete/:id', deleteEntry);            

export default router;
