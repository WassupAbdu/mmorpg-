import { useState } from 'react';
import { useAchievementStore } from '../../stores/achievementStore';
import { ACHIEVEMENTS } from '../../data/achievements';
import { Achievement } from '../../types/multiplayer.types';

type CategoryFilter = 'all' | 'combat' | 'exploration' | 'social' | 'progression' | 'collection';

export function AchievementPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const { userAchievements, recentUnlock } = useAchievementStore();

  if (!isOpen) {
    return (
      <>
        {/* Achievement Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-4 top-52 bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-lg shadow-lg z-50"
        >
          🏅 Achievements
        </button>

        {/* Achievement Unlock Notification */}
        {recentUnlock && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] animate-bounce">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 rounded-lg shadow-2xl border-4 border-yellow-300">
              <div className="text-center">
                <div className="text-6xl mb-2">{recentUnlock.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-1">Achievement Unlocked!</h3>
                <p className="text-xl text-yellow-100 font-semibold">{recentUnlock.title}</p>
                <p className="text-sm text-yellow-200 mt-2">{recentUnlock.description}</p>
                {recentUnlock.rewards.title && (
                  <p className="text-sm text-white mt-3 bg-black/30 px-4 py-2 rounded">
                    New Title: {recentUnlock.rewards.title}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  const filteredAchievements = categoryFilter === 'all'
    ? ACHIEVEMENTS
    : ACHIEVEMENTS.filter(a => a.category === categoryFilter);

  const completedCount = userAchievements.filter(ua => ua.completed).length;
  const totalCount = ACHIEVEMENTS.filter(a => !a.isSecret).length;
  const completionPercent = (completedCount / totalCount) * 100;

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'bronze': return 'text-orange-600';
      case 'silver': return 'text-gray-400';
      case 'gold': return 'text-yellow-400';
      case 'platinum': return 'text-cyan-400';
    }
  };

  const getRarityBg = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'bronze': return 'bg-orange-900/30 border-orange-500';
      case 'silver': return 'bg-gray-800/30 border-gray-500';
      case 'gold': return 'bg-yellow-900/30 border-yellow-500';
      case 'platinum': return 'bg-cyan-900/30 border-cyan-500';
    }
  };

  return (
    <div className="fixed left-4 top-52 w-[700px] bg-slate-800 rounded-lg shadow-2xl z-50 overflow-hidden max-h-[80vh] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-900 to-yellow-900 p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Achievements</h2>
            <p className="text-orange-200">Complete challenges to earn rewards!</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        {/* Progress */}
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-bold">
              {completedCount} / {totalCount} Completed
            </span>
            <span className="text-orange-300">{Math.floor(completionPercent)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-orange-500 to-yellow-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex bg-slate-700 overflow-x-auto">
        {(['all', 'combat', 'exploration', 'social', 'progression', 'collection'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              categoryFilter === cat
                ? 'bg-slate-800 text-white border-b-2 border-orange-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Achievements List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredAchievements.map(achievement => {
            const userAch = userAchievements.find(ua => ua.achievementId === achievement.id);
            const isCompleted = userAch?.completed || false;
            const progress = userAch?.progress || 0;
            const progressPercent = (progress / achievement.criteria.required) * 100;

            // Don't show secret achievements until unlocked
            if (achievement.isSecret && !isCompleted) {
              return (
                <div
                  key={achievement.id}
                  className="p-4 bg-slate-900 rounded-lg border-2 border-slate-700"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">❓</div>
                    <h3 className="font-semibold text-gray-500">Secret Achievement</h3>
                    <p className="text-xs text-gray-600 mt-1">Keep exploring to discover this!</p>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 ${
                  isCompleted
                    ? `${getRarityBg(achievement.rarity)} border-2`
                    : 'bg-slate-700 border-slate-600'
                } ${isCompleted ? 'shadow-lg' : ''}`}
              >
                <div className="flex items-start space-x-3 mb-2">
                  <div className={`text-3xl ${isCompleted ? '' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-semibold ${isCompleted ? 'text-white' : 'text-gray-400'}`}>
                        {achievement.title}
                      </h3>
                      {isCompleted && (
                        <span className="text-green-400 text-sm">✓</span>
                      )}
                    </div>
                    <p className={`text-xs ${getRarityColor(achievement.rarity)} uppercase`}>
                      {achievement.rarity}
                    </p>
                  </div>
                </div>

                <p className={`text-sm mb-3 ${isCompleted ? 'text-gray-300' : 'text-gray-500'}`}>
                  {achievement.description}
                </p>

                {/* Progress */}
                {!isCompleted && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{progress} / {achievement.criteria.required}</span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, progressPercent)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Rewards */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex space-x-2 text-gray-400">
                    {achievement.rewards.experience && (
                      <span>🎯 {achievement.rewards.experience} XP</span>
                    )}
                    {achievement.rewards.gold && (
                      <span>💰 {achievement.rewards.gold}</span>
                    )}
                  </div>
                  {achievement.rewards.title && (
                    <span className="text-purple-400 text-xs">
                      👑 {achievement.rewards.title}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
