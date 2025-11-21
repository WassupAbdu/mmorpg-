import express from 'express';
import Quest from '../models/Quest';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Get all quests
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    
    const quests = await Quest.find(filter);
    res.json(quests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quests' });
  }
});

// Get quest by ID
router.get('/:id', async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.id);
    
    if (!quest) {
      return res.status(404).json({ error: 'Quest not found' });
    }
    
    res.json(quest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quest' });
  }
});

// Create quest (admin only - add admin middleware later)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const quest = new Quest(req.body);
    await quest.save();
    res.status(201).json(quest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create quest' });
  }
});

export default router;
