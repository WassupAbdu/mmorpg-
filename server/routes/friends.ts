import express from 'express';
import Friendship from '../models/Friend';
import User from '../models/User';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all friends
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const friendships = await Friendship.find({
      $or: [
        { userId1: req.userId },
        { userId2: req.userId },
      ],
      status: 'accepted',
    })
    .populate('userId1', 'displayName photoURL')
    .populate('userId2', 'displayName photoURL');
    
    res.json(friendships);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch friends' });
  }
});

// Get pending friend requests
router.get('/pending', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const requests = await Friendship.find({
      userId2: req.userId,
      status: 'pending',
    }).populate('userId1', 'displayName photoURL');
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Send friend request
router.post('/request', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { targetUserId } = req.body;
    
    if (req.userId === targetUserId) {
      return res.status(400).json({ error: 'Cannot add yourself' });
    }
    
    // Check if target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if friendship already exists
    const existing = await Friendship.findOne({
      $or: [
        { userId1: req.userId, userId2: targetUserId },
        { userId1: targetUserId, userId2: req.userId },
      ],
    });
    
    if (existing) {
      return res.status(400).json({ error: 'Friendship already exists' });
    }
    
    // Create friendship request
    const friendship = new Friendship({
      userId1: req.userId,
      userId2: targetUserId,
      status: 'pending',
      requestedBy: req.userId,
    });
    
    await friendship.save();
    res.status(201).json(friendship);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send request' });
  }
});

// Accept friend request
router.post('/:id/accept', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const friendship = await Friendship.findOne({
      _id: req.params.id,
      userId2: req.userId,
      status: 'pending',
    });
    
    if (!friendship) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    friendship.status = 'accepted';
    await friendship.save();
    
    res.json(friendship);
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept request' });
  }
});

// Reject friend request
router.delete('/:id/reject', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const friendship = await Friendship.findOneAndDelete({
      _id: req.params.id,
      userId2: req.userId,
      status: 'pending',
    });
    
    if (!friendship) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    res.json({ message: 'Request rejected' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject request' });
  }
});

// Remove friend
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const friendship = await Friendship.findOneAndDelete({
      _id: req.params.id,
      $or: [
        { userId1: req.userId },
        { userId2: req.userId },
      ],
    });
    
    if (!friendship) {
      return res.status(404).json({ error: 'Friendship not found' });
    }
    
    res.json({ message: 'Friend removed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove friend' });
  }
});

export default router;
