import express from 'express';
import Guild from '../models/Guild';
import Character from '../models/Character';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all guilds
router.get('/', async (req, res) => {
  try {
    const guilds = await Guild.find()
      .populate('members.characterId', 'name level class')
      .limit(50);
    res.json(guilds);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch guilds' });
  }
});

// Get guild by ID
router.get('/:id', async (req, res) => {
  try {
    const guild = await Guild.findById(req.params.id)
      .populate('members.characterId', 'name level class');
    
    if (!guild) {
      return res.status(404).json({ error: 'Guild not found' });
    }
    
    res.json(guild);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch guild' });
  }
});

// Create guild
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { name, tag, description, characterId } = req.body;
    
    // Check if character belongs to user
    const character = await Character.findOne({
      _id: characterId,
      userId: req.userId,
    });
    
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    // Check if character is already in a guild
    if (character.guildId) {
      return res.status(400).json({ error: 'Character already in a guild' });
    }
    
    // Create guild
    const guild = new Guild({
      name,
      tag,
      description,
      members: [{
        characterId,
        rank: 'leader',
        contributionPoints: 0,
      }],
      ranks: [
        { name: 'Leader', permissions: ['all'] },
        { name: 'Officer', permissions: ['invite', 'kick', 'promote'] },
        { name: 'Member', permissions: ['chat'] },
      ],
    });
    
    await guild.save();
    
    // Update character
    character.guildId = guild._id;
    await character.save();
    
    res.status(201).json(guild);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Guild name or tag already exists' });
    }
    res.status(500).json({ error: 'Failed to create guild' });
  }
});

// Join guild
router.post('/:id/join', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { characterId } = req.body;
    
    const character = await Character.findOne({
      _id: characterId,
      userId: req.userId,
    });
    
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    if (character.guildId) {
      return res.status(400).json({ error: 'Already in a guild' });
    }
    
    const guild = await Guild.findById(req.params.id);
    if (!guild) {
      return res.status(404).json({ error: 'Guild not found' });
    }
    
    if (guild.members.length >= guild.maxMembers) {
      return res.status(400).json({ error: 'Guild is full' });
    }
    
    guild.members.push({
      characterId: character._id,
      rank: 'member',
      joinedAt: new Date(),
      contributionPoints: 0,
    });
    
    await guild.save();
    
    character.guildId = guild._id;
    await character.save();
    
    res.json(guild);
  } catch (error) {
    res.status(500).json({ error: 'Failed to join guild' });
  }
});

// Leave guild
router.post('/:id/leave', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { characterId } = req.body;
    
    const character = await Character.findOne({
      _id: characterId,
      userId: req.userId,
    });
    
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    const guild = await Guild.findById(req.params.id);
    if (!guild) {
      return res.status(404).json({ error: 'Guild not found' });
    }
    
    // Remove member
    guild.members = guild.members.filter(
      m => m.characterId.toString() !== characterId
    );
    
    await guild.save();
    
    character.guildId = undefined;
    await character.save();
    
    res.json({ message: 'Left guild successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to leave guild' });
  }
});

export default router;
