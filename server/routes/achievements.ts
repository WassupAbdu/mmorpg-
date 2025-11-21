import express from 'express';
import { Achievement, UserAchievement } from '../models/Achievement';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all achievements
router.get('/', async (req, res) => {
  try {
    const achievements = await Achievement.find({ isSecret: false });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

// Get user's achievements
router.get('/user', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userAchievements = await UserAchievement.find({ userId: req.userId });
    res.json(userAchievements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user achievements' });
  }
});

// Update achievement progress
router.post('/progress', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { achievementId, progress } = req.body;
    
    let userAchievement = await UserAchievement.findOne({
      userId: req.userId,
      achievementId,
    });
    
    if (!userAchievement) {
      userAchievement = new UserAchievement({
        userId: req.userId,
        achievementId,
        progress: 0,
        completed: false,
      });
    }
    
    userAchievement.progress = progress;
    
    // Check if completed
    const achievement = await Achievement.findOne({ id: achievementId });
    if (achievement && progress >= achievement.criteria.required) {
      userAchievement.completed = true;
      userAchievement.completedAt = new Date();
    }
    
    await userAchievement.save();
    res.json(userAchievement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update achievement progress' });
  }
});

export default router;
