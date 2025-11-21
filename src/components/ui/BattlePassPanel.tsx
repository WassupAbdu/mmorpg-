import { useState } from 'react';
import { useBattlePassStore } from '../../stores/battlePassStore';
import { BATTLE_PASS_TIERS } from '../../data/battlePassTiers';

export function BattlePassPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { userProgress, claimReward, purchasePremium } = useBattlePassStore();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-36 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg shadow-lg z-50"
      >
        🏆 Battle Pass
      </button>
    );
  }

  const currentTier = userProgress?.currentTier || 1;
  const currentXP = userProgress?.currentXP || 0;
  const isPremium = userProgress?.isPremium || false;
  
  const currentTierData = BATTLE_PASS_TIERS.find(t => t.tier === currentTier);
  const nextTierData = BATTLE_PASS_TIERS.find(t => t.tier === currentTier + 1);
  
  const xpToNextTier = nextTierData ? nextTierData.requiredXP - currentXP : 0;
  const progressPercent = nextTierData 
    ? ((currentXP - (currentTierData?.requiredXP || 0)) / (nextTierData.requiredXP - (currentTierData?.requiredXP || 0))) * 100
    : 100;

  return (
    <div className="fixed left-4 top-36 w-[800px] bg-slate-800 rounded-lg shadow-2xl z-50 overflow-hidden max-h-[80vh] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Battle Pass Season 1</h2>
            <p className="text-purple-200">Level up through 100 tiers of rewards!</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-300"
          >
            ✕
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-bold">Tier {currentTier}</span>
            <span className="text-purple-300">{currentXP.toLocaleString()} XP</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-4 mb-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, progressPercent)}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>Next tier: {xpToNextTier.toLocaleString()} XP</span>
            <span>{Math.floor(progressPercent)}%</span>
          </div>
        </div>
        
        {/* Premium Button */}
        {!isPremium && (
          <button
            onClick={purchasePremium}
            className="w-full mt-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-lg"
          >
            ⭐ Upgrade to Premium - Unlock Premium Rewards!
          </button>
        )}
      </div>

      {/* Tiers List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {BATTLE_PASS_TIERS.map(tier => {
            const isUnlocked = currentTier >= tier.tier;
            const isCurrent = currentTier === tier.tier;
            const freeRewardClaimed = userProgress?.claimedRewards.some(
              r => r.tier === tier.tier && r.type === 'free'
            );
            const premiumRewardClaimed = userProgress?.claimedRewards.some(
              r => r.tier === tier.tier && r.type === 'premium'
            );

            return (
              <div
                key={tier.tier}
                className={`p-4 rounded-lg border-2 ${
                  isCurrent
                    ? 'border-purple-500 bg-purple-900/20'
                    : isUnlocked
                    ? 'border-slate-600 bg-slate-700'
                    : 'border-slate-700 bg-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      isUnlocked ? 'bg-purple-600 text-white' : 'bg-slate-600 text-gray-400'
                    }`}>
                      {tier.tier}
                    </div>
                    <div>
                      <p className="text-white font-semibold">Tier {tier.tier}</p>
                      <p className="text-xs text-gray-400">{tier.requiredXP.toLocaleString()} XP</p>
                    </div>
                  </div>
                  {isCurrent && (
                    <span className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full">
                      Current
                    </span>
                  )}
                </div>

                {/* Rewards */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Free Rewards */}
                  <div className={`p-3 rounded ${isUnlocked ? 'bg-slate-600' : 'bg-slate-700'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-300">Free</span>
                      {freeRewardClaimed && (
                        <span className="text-green-400 text-xs">✓ Claimed</span>
                      )}
                    </div>
                    <div className="space-y-1">
                      {tier.rewards.free.map((reward, idx) => (
                        <div key={idx} className="text-xs text-gray-300 flex items-center space-x-1">
                          <span>{reward.icon}</span>
                          <span>{reward.name}</span>
                        </div>
                      ))}
                    </div>
                    {isUnlocked && !freeRewardClaimed && (
                      <button
                        onClick={() => claimReward(tier.tier, 'free')}
                        className="w-full mt-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                      >
                        Claim
                      </button>
                    )}
                  </div>

                  {/* Premium Rewards */}
                  <div className={`p-3 rounded ${
                    isUnlocked && isPremium 
                      ? 'bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-500'
                      : 'bg-slate-700'
                  }`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-yellow-400">Premium ⭐</span>
                      {premiumRewardClaimed && (
                        <span className="text-green-400 text-xs">✓ Claimed</span>
                      )}
                    </div>
                    <div className="space-y-1">
                      {tier.rewards.premium.map((reward, idx) => (
                        <div key={idx} className={`text-xs flex items-center space-x-1 ${
                          isPremium ? 'text-yellow-200' : 'text-gray-500'
                        }`}>
                          <span>{reward.icon}</span>
                          <span>{reward.name}</span>
                        </div>
                      ))}
                    </div>
                    {isUnlocked && isPremium && !premiumRewardClaimed && (
                      <button
                        onClick={() => claimReward(tier.tier, 'premium')}
                        className="w-full mt-2 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded"
                      >
                        Claim
                      </button>
                    )}
                    {!isPremium && (
                      <div className="mt-2 text-xs text-center text-gray-500">
                        🔒 Premium Required
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
