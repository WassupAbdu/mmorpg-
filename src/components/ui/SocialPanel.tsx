import { useState } from 'react';
import { useMultiplayerStore } from '../../stores/multiplayerStore';
import { useGuildStore } from '../../stores/guildStore';

type Tab = 'friends' | 'party' | 'guild' | 'chat';

export function SocialPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('friends');
  const [isOpen, setIsOpen] = useState(false);
  
  const { friends, friendRequests, currentParty, chatMessages, sendMessage } = useMultiplayerStore();
  const { currentGuild } = useGuildStore();
  
  const [chatInput, setChatInput] = useState('');
  const [chatChannel, setChatChannel] = useState<'global' | 'party' | 'guild'>('global');

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      sendMessage(chatChannel, chatInput, 'Player'); // Replace 'Player' with actual character name
      setChatInput('');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 top-20 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg shadow-lg z-50"
      >
        👥 Social
      </button>
    );
  }

  return (
    <div className="fixed right-4 top-20 w-96 bg-slate-800 rounded-lg shadow-2xl z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Social</h2>
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
          onClick={() => setActiveTab('friends')}
          className={`flex-1 py-3 px-4 font-medium ${
            activeTab === 'friends'
              ? 'bg-slate-800 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          👥 Friends
        </button>
        <button
          onClick={() => setActiveTab('party')}
          className={`flex-1 py-3 px-4 font-medium ${
            activeTab === 'party'
              ? 'bg-slate-800 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          🎉 Party
        </button>
        <button
          onClick={() => setActiveTab('guild')}
          className={`flex-1 py-3 px-4 font-medium ${
            activeTab === 'guild'
              ? 'bg-slate-800 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          🏛️ Guild
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 px-4 font-medium ${
            activeTab === 'chat'
              ? 'bg-slate-800 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          💬 Chat
        </button>
      </div>

      {/* Content */}
      <div className="p-4 h-96 overflow-y-auto">
        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <div className="space-y-4">
            {friendRequests.length > 0 && (
              <div className="bg-yellow-900/30 border border-yellow-500 rounded p-3">
                <h3 className="font-semibold text-yellow-500 mb-2">Friend Requests</h3>
                {friendRequests.map(req => (
                  <div key={req.id} className="flex justify-between items-center mb-2">
                    <span className="text-white">{req.fromDisplayName}</span>
                    <div className="space-x-2">
                      <button className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded">
                        Accept
                      </button>
                      <button className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div>
              <h3 className="font-semibold text-white mb-2">Friends ({friends.length})</h3>
              {friends.length === 0 ? (
                <p className="text-gray-400 text-sm">No friends yet. Add some!</p>
              ) : (
                <div className="space-y-2">
                  {friends.map(friend => (
                    <div key={friend.id} className="flex items-center justify-between p-2 bg-slate-700 rounded">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          friend.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                        }`} />
                        <span className="text-white">{friend.displayName}</span>
                      </div>
                      <button className="text-blue-400 hover:text-blue-300 text-sm">
                        Message
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Party Tab */}
        {activeTab === 'party' && (
          <div>
            {currentParty ? (
              <div className="space-y-4">
                <div className="bg-slate-700 p-3 rounded">
                  <h3 className="font-semibold text-white mb-2">
                    {currentParty.name || 'Current Party'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Members: {currentParty.members.length}/{currentParty.maxMembers}
                  </p>
                </div>
                
                <div className="space-y-2">
                  {currentParty.members.map(member => (
                    <div key={member.characterId} className="p-2 bg-slate-700 rounded">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white font-medium">{member.characterName}</p>
                          <p className="text-sm text-gray-400">
                            {member.class} - Lv.{member.level}
                            {member.role === 'leader' && ' 👑'}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-green-400">
                            {member.hp}/{member.maxHp} HP
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded">
                  Leave Party
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">You're not in a party</p>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
                  Create Party
                </button>
              </div>
            )}
          </div>
        )}

        {/* Guild Tab */}
        {activeTab === 'guild' && (
          <div>
            {currentGuild ? (
              <div className="space-y-4">
                <div className="bg-slate-700 p-4 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white">[{currentGuild.tag}] {currentGuild.name}</h3>
                    <span className="text-sm text-gray-400">Lv.{currentGuild.level}</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{currentGuild.description}</p>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Members: {currentGuild.members.length}/{currentGuild.maxMembers}</span>
                    <span>Treasury: {currentGuild.treasury} gold</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-2">Members</h4>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {currentGuild.members.map(member => (
                      <div key={member.characterId} className="p-2 bg-slate-700 rounded flex justify-between items-center">
                        <div>
                          <span className="text-white">{member.characterName}</span>
                          <span className="text-sm text-gray-400 ml-2">
                            {member.rank === 'leader' && '👑'}
                            {member.rank === 'officer' && '⭐'}
                          </span>
                        </div>
                        <span className="text-sm text-gray-400">{member.contributionPoints} CP</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">You're not in a guild</p>
                <div className="space-x-2">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
                    Create Guild
                  </button>
                  <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded">
                    Browse Guilds
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-full">
            {/* Channel Selector */}
            <div className="flex space-x-2 mb-2">
              <button
                onClick={() => setChatChannel('global')}
                className={`px-3 py-1 rounded text-sm ${
                  chatChannel === 'global'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-gray-400'
                }`}
              >
                Global
              </button>
              <button
                onClick={() => setChatChannel('party')}
                className={`px-3 py-1 rounded text-sm ${
                  chatChannel === 'party'
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-700 text-gray-400'
                }`}
                disabled={!currentParty}
              >
                Party
              </button>
              <button
                onClick={() => setChatChannel('guild')}
                className={`px-3 py-1 rounded text-sm ${
                  chatChannel === 'guild'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-gray-400'
                }`}
                disabled={!currentGuild}
              >
                Guild
              </button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 bg-slate-900 rounded p-2 mb-2 overflow-y-auto space-y-1">
              {chatMessages
                .filter(msg => msg.channel === chatChannel || msg.channel === 'whisper')
                .map(msg => (
                  <div key={msg.id} className="text-sm">
                    <span className={`font-semibold ${
                      msg.channel === 'global' ? 'text-blue-400' :
                      msg.channel === 'party' ? 'text-green-400' :
                      msg.channel === 'guild' ? 'text-purple-400' :
                      'text-yellow-400'
                    }`}>
                      [{msg.channel}] {msg.fromCharacterName}:
                    </span>
                    <span className="text-white ml-1">{msg.message}</span>
                  </div>
                ))}
            </div>
            
            {/* Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 bg-slate-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
