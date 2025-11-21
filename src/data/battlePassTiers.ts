import { BattlePassTier } from '../types/multiplayer.types';

// Generate 100 tiers with progressive XP requirements
export const BATTLE_PASS_TIERS: BattlePassTier[] = Array.from({ length: 100 }, (_, index) => {
  const tier = index + 1;
  
  // XP requirement increases progressively
  // Formula: baseXP * tier + (tier * 50)
  const requiredXP = tier === 1 ? 0 : 1000 * tier + (tier * 50);
  
  // Determine rewards based on tier milestones
  const isMilestone = tier % 10 === 0;
  const isMajorMilestone = tier % 25 === 0;
  
  let freeRewards = [];
  let premiumRewards = [];
  
  if (tier === 100) {
    // Special rewards for tier 100
    freeRewards = [
      { type: 'gold', amount: 10000, name: 'Gold', icon: '💰' },
      { type: 'cosmetic', name: 'Legendary Title: Battle Pass Master', icon: '🏆' },
    ];
    premiumRewards = [
      { type: 'item', name: 'Legendary Battle Pass Weapon', icon: '⚔️' },
      { type: 'cosmetic', name: 'Ultimate Battle Pass Skin', icon: '✨' },
      { type: 'gold', amount: 25000, name: 'Gold', icon: '💰' },
    ];
  } else if (isMajorMilestone) {
    // Major milestone rewards (25, 50, 75)
    freeRewards = [
      { type: 'gold', amount: 2000, name: 'Gold', icon: '💰' },
      { type: 'cosmetic', name: `Tier ${tier} Emblem`, icon: '🎖️' },
    ];
    premiumRewards = [
      { type: 'item', name: `Epic Tier ${tier} Weapon`, icon: '⚔️' },
      { type: 'cosmetic', name: `Tier ${tier} Armor Skin`, icon: '🛡️' },
      { type: 'gold', amount: 5000, name: 'Gold', icon: '💰' },
    ];
  } else if (isMilestone) {
    // Regular milestone rewards (every 10 tiers)
    freeRewards = [
      { type: 'gold', amount: 1000, name: 'Gold', icon: '💰' },
    ];
    premiumRewards = [
      { type: 'item', name: `Rare Tier ${tier} Gear`, icon: '🎁' },
      { type: 'gold', amount: 3000, name: 'Gold', icon: '💰' },
    ];
  } else {
    // Regular tier rewards
    const goldAmount = 100 + (tier * 10);
    freeRewards = [
      { type: 'gold', amount: goldAmount, name: 'Gold', icon: '💰' },
    ];
    premiumRewards = [
      { type: 'gold', amount: goldAmount * 3, name: 'Gold', icon: '💰' },
    ];
    
    // Add bonus items on certain tiers
    if (tier % 5 === 0) {
      premiumRewards.push({
        type: 'item',
        name: `Battle Pass Item ${tier}`,
        icon: '📦',
      });
    }
    
    // Add cosmetics on specific tiers
    if (tier % 7 === 0) {
      freeRewards.push({
        type: 'cosmetic',
        name: `Tier ${tier} Badge`,
        icon: '🏅',
      });
    }
    
    if (tier % 15 === 0) {
      premiumRewards.push({
        type: 'cosmetic',
        name: `Tier ${tier} Effect`,
        icon: '✨',
      });
    }
  }
  
  return {
    tier,
    requiredXP,
    rewards: {
      free: freeRewards as any,
      premium: premiumRewards as any,
    },
  };
});

// Export some specific milestone tiers for reference
export const MILESTONE_TIERS = [1, 10, 25, 50, 75, 100];

export const getBattlePassTier = (tier: number): BattlePassTier | undefined => {
  return BATTLE_PASS_TIERS.find(t => t.tier === tier);
};

export const getNextTier = (currentTier: number): BattlePassTier | undefined => {
  return BATTLE_PASS_TIERS.find(t => t.tier === currentTier + 1);
};

export const getTotalXPRequired = (targetTier: number): number => {
  const tier = BATTLE_PASS_TIERS.find(t => t.tier === targetTier);
  return tier ? tier.requiredXP : 0;
};
