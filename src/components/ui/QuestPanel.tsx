import { useState } from 'react';
import { useQuestStore } from '../../stores/questStore';
import { QUESTS } from '../../data/quests';

export function QuestPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'available'>('active');
  
  const { activeQuests, availableQuests, acceptQuest, abandonQuest } = useQuestStore();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-20 bg-yellow-600 hover:bg-yellow-700 text-white p-3 rounded-lg shadow-lg z-50"
      >
        📜 Quests
      </button>
    );
  }

  return (
    <div className="fixed left-4 top-20 w-96 bg-slate-800 rounded-lg shadow-2xl z-50 overflow-hidden max-h-[80vh] flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Quests</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-700">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-3 px-4 font-medium ${
            activeTab === 'active'
              ? 'bg-slate-800 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Active ({activeQuests.length})
        </button>
        <button
          onClick={() => setActiveTab('available')}
          className={`flex-1 py-3 px-4 font-medium ${
            activeTab === 'available'
              ? 'bg-slate-800 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Available ({QUESTS.length})
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Active Quests */}
        {activeTab === 'active' && (
          <>
            {activeQuests.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No active quests</p>
                <p className="text-sm mt-2">Check available quests to start!</p>
              </div>
            ) : (
              activeQuests.map(userQuest => {
                const quest = QUESTS.find(q => q.id === userQuest.questId);
                if (!quest) return null;
                
                const allCompleted = userQuest.objectives.every(
                  obj => obj.current >= obj.required
                );

                return (
                  <div
                    key={userQuest.questId}
                    className={`p-4 rounded-lg ${
                      allCompleted
                        ? 'bg-green-900/30 border border-green-500'
                        : 'bg-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-white">{quest.title}</h3>
                        <p className="text-xs text-gray-400">
                          {quest.type.toUpperCase()}
                          {quest.npcGiver && ` • ${quest.npcGiver}`}
                        </p>
                      </div>
                      {allCompleted && (
                        <span className="text-green-500 text-sm">✓ Complete</span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-300 mb-3">{quest.description}</p>
                    
                    {/* Objectives */}
                    <div className="space-y-2 mb-3">
                      {userQuest.objectives.map((obj, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-300">
                              {obj.type}: {quest.objectives[index].target}
                            </span>
                            <span className={`${
                              obj.current >= obj.required ? 'text-green-400' : 'text-yellow-400'
                            }`}>
                              {obj.current}/{obj.required}
                            </span>
                          </div>
                          <div className="w-full bg-slate-600 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                obj.current >= obj.required ? 'bg-green-500' : 'bg-yellow-500'
                              }`}
                              style={{ width: `${Math.min(100, (obj.current / obj.required) * 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Rewards */}
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                      <div className="flex space-x-3">
                        {quest.rewards.experience && (
                          <span>🎯 {quest.rewards.experience} XP</span>
                        )}
                        {quest.rewards.gold && (
                          <span>💰 {quest.rewards.gold} Gold</span>
                        )}
                        {quest.rewards.battlePassXP && (
                          <span>🏆 {quest.rewards.battlePassXP} BP XP</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {allCompleted ? (
                        <button className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm">
                          Complete Quest
                        </button>
                      ) : (
                        <button
                          onClick={() => abandonQuest(userQuest.questId)}
                          className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                        >
                          Abandon
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}

        {/* Available Quests */}
        {activeTab === 'available' && (
          <>
            {QUESTS.map(quest => {
              const isActive = activeQuests.some(aq => aq.questId === quest.id);
              if (isActive) return null;

              const typeColors = {
                daily: 'text-blue-400',
                weekly: 'text-purple-400',
                monthly: 'text-orange-400',
                story: 'text-yellow-400',
                guild: 'text-green-400',
              };

              return (
                <div key={quest.id} className="p-4 bg-slate-700 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-white">{quest.title}</h3>
                      <p className={`text-xs ${typeColors[quest.type]}`}>
                        {quest.type.toUpperCase()}
                        {quest.npcGiver && ` • ${quest.npcGiver}`}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-3">{quest.description}</p>
                  
                  {/* Objectives Preview */}
                  <div className="mb-3 space-y-1">
                    {quest.objectives.map((obj, index) => (
                      <p key={index} className="text-xs text-gray-400">
                        • {obj.type}: {obj.target} (0/{obj.required})
                      </p>
                    ))}
                  </div>
                  
                  {/* Rewards */}
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <div className="flex space-x-3">
                      {quest.rewards.experience && (
                        <span>🎯 {quest.rewards.experience} XP</span>
                      )}
                      {quest.rewards.gold && (
                        <span>💰 {quest.rewards.gold} Gold</span>
                      )}
                      {quest.rewards.battlePassXP && (
                        <span>🏆 {quest.rewards.battlePassXP} BP XP</span>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => acceptQuest(quest.id)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                  >
                    Accept Quest
                  </button>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
