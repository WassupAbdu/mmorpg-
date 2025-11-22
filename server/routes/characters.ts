import express from 'express';
import Character from '../models/Character';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all characters for user
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const characters = await Character.find({ userId: req.userId });
    res.json(characters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch characters' });
  }
});

// Get character by ID
router.get('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const character = await Character.findOne({
      _id: req.params.id,
      userId: req.userId,
    });
    
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    res.json(character);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch character' });
  }
});

// Create character
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const character = new Character({
      ...req.body,
      userId: req.userId,
    });
    
    await character.save();
    res.status(201).json(character);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create character' });
  }
});

// Update character
router.patch('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const character = await Character.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: req.body },
      { new: true }
    );
    
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    res.json(character);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update character' });
  }
});

// Delete character
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const character = await Character.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    res.json({ message: 'Character deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete character' });
  }
});

export default router;
