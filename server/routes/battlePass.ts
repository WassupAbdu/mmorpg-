import express from 'express';
import { BattlePassTier, UserBattlePass } from '../models/BattlePass';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get battle pass tiers
router.get('/tiers', async (req, res) => {
  try {
    const tiers = await BattlePassTier.find().sort({ tier: 1 });
    res.json(tiers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch battle pass tiers' });
  }
});

// Get user's battle pass progress
router.get('/progress', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const season = parseInt(req.query.season as string) || 1;
    
    let userBattlePass = await UserBattlePass.findOne({
      userId: req.userId,
      season,
    });
    
    if (!userBattlePass) {
      userBattlePass = new UserBattlePass({
        userId: req.userId,
        season,
        currentTier: 1,
        currentXP: 0,
        isPremium: false,
        claimedRewards: [],
      });
      await userBattlePass.save();
    }
    
    res.json(userBattlePass);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch battle pass progress' });
  }
});

// Add XP to battle pass
router.post('/xp', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { xp, season = 1 } = req.body;
    
    let userBattlePass = await UserBattlePass.findOne({
      userId: req.userId,
      season,
    });
    
    if (!userBattlePass) {
      userBattlePass = new UserBattlePass({
        userId: req.userId,
        season,
        currentTier: 1,
        currentXP: 0,
        isPremium: false,
        claimedRewards: [],
      });
    }
    
    userBattlePass.currentXP += xp;
    
    // Check for tier progression
    const tiers = await BattlePassTier.find().sort({ tier: 1 });
    for (const tier of tiers) {
      if (userBattlePass.currentXP >= tier.requiredXP && tier.tier > userBattlePass.currentTier) {
        userBattlePass.currentTier = tier.tier;
      }
    }
    
    await userBattlePass.save();
    res.json(userBattlePass);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add battle pass XP' });
  }
});

// Claim reward
router.post('/claim', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { tier, type, season = 1 } = req.body;
    
    const userBattlePass = await UserBattlePass.findOne({
      userId: req.userId,
      season,
    });
    
    if (!userBattlePass) {
      return res.status(404).json({ error: 'Battle pass not found' });
    }
    
    // Check if tier is unlocked
    if (tier > userBattlePass.currentTier) {
      return res.status(400).json({ error: 'Tier not unlocked yet' });
    }
    
    // Check if premium reward requires premium
    if (type === 'premium' && !userBattlePass.isPremium) {
      return res.status(400).json({ error: 'Premium battle pass required' });
    }
    
    // Check if already claimed
    const alreadyClaimed = userBattlePass.claimedRewards.some(
      r => r.tier === tier && r.type === type
    );
    
    if (alreadyClaimed) {
      return res.status(400).json({ error: 'Reward already claimed' });
    }
    
    // Add to claimed rewards
    userBattlePass.claimedRewards.push({
      tier,
      type,
      claimedAt: new Date(),
    });
    
    await userBattlePass.save();
    res.json(userBattlePass);
  } catch (error) {
    res.status(500).json({ error: 'Failed to claim reward' });
  }
});

// Purchase premium
router.post('/premium', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { season = 1 } = req.body;
    
    const userBattlePass = await UserBattlePass.findOne({
      userId: req.userId,
      season,
    });
    
    if (!userBattlePass) {
      return res.status(404).json({ error: 'Battle pass not found' });
    }
    
    userBattlePass.isPremium = true;
    await userBattlePass.save();
    
    res.json(userBattlePass);
  } catch (error) {
    res.status(500).json({ error: 'Failed to purchase premium' });
  }
});

export default router;
