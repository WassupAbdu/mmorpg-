import { create } from 'zustand';
import { BattlePassTier, UserBattlePass } from '../types/multiplayer.types';

interface BattlePassState {
  tiers: BattlePassTier[];
  userProgress: UserBattlePass | null;
  currentSeason: number;
  
  // Actions
  setTiers: (tiers: BattlePassTier[]) => void;
  setUserProgress: (progress: UserBattlePass) => void;
  addXP: (xp: number) => void;
  claimReward: (tier: number, type: 'free' | 'premium') => void;
  purchasePremium: () => void;
}

export const useBattlePassStore = create<BattlePassState>((set, get) => ({
  tiers: [],
  userProgress: null,
  currentSeason: 1,
  
  setTiers: (tiers: BattlePassTier[]) => {
    set({ tiers });
  },
  
  setUserProgress: (progress: UserBattlePass) => {
    set({ userProgress: progress });
  },
  
  addXP: (xp: number) => {
    const progress = get().userProgress;
    if (!progress) return;
    
    const newXP = progress.currentXP + xp;
    const tiers = get().tiers;
    
    // Find new tier
    let newTier = progress.currentTier;
    for (const tier of tiers) {
      if (newXP >= tier.requiredXP && tier.tier > newTier) {
        newTier = tier.tier;
      }
    }
    
    set({
      userProgress: {
        ...progress,
        currentXP: newXP,
        currentTier: newTier,
      },
    });
  },
  
  claimReward: (tier: number, type: 'free' | 'premium') => {
    const progress = get().userProgress;
    if (!progress) return;
    
    // Check if already claimed
    const alreadyClaimed = progress.claimedRewards.some(
      r => r.tier === tier && r.type === type
    );
    
    if (alreadyClaimed) return;
    
    // Check if tier is unlocked
    if (tier > progress.currentTier) return;
    
    // Check if premium
    if (type === 'premium' && !progress.isPremium) return;
    
    set({
      userProgress: {
        ...progress,
        claimedRewards: [...progress.claimedRewards, { tier, type }],
      },
    });
  },
  
  purchasePremium: () => {
    const progress = get().userProgress;
    if (!progress) return;
    
    set({
      userProgress: {
        ...progress,
        isPremium: true,
      },
    });
  },
}));
