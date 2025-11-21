import { create } from 'zustand';
import { socketManager } from '../utils/socket';
import { Friend, FriendRequest, Party, ChatMessage } from '../types/multiplayer.types';

interface MultiplayerState {
  // Connection
  isConnected: boolean;
  
  // Friends
  friends: Friend[];
  friendRequests: FriendRequest[];
  
  // Party
  currentParty: Party | null;
  partyInvites: string[];
  
  // Chat
  chatMessages: ChatMessage[];
  
  // Actions
  connect: (token: string, characterId: string) => Promise<void>;
  disconnect: () => void;
  
  // Friend actions
  sendFriendRequest: (targetUserId: string) => void;
  acceptFriendRequest: (requestId: string) => void;
  rejectFriendRequest: (requestId: string) => void;
  removeFriend: (friendId: string) => void;
  setFriends: (friends: Friend[]) => void;
  setFriendRequests: (requests: FriendRequest[]) => void;
  
  // Party actions
  createParty: (members: string[]) => void;
  inviteToParty: (characterId: string) => void;
  joinParty: (partyId: string) => void;
  leaveParty: () => void;
  setCurrentParty: (party: Party | null) => void;
  addPartyInvite: (partyId: string) => void;
  removePartyInvite: (partyId: string) => void;
  
  // Chat actions
  sendMessage: (channel: string, message: string, characterName: string) => void;
  sendWhisper: (targetCharacterId: string, message: string, characterName: string) => void;
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;
}

export const useMultiplayerStore = create<MultiplayerState>((set, get) => ({
  isConnected: false,
  friends: [],
  friendRequests: [],
  currentParty: null,
  partyInvites: [],
  chatMessages: [],
  
  connect: async (token: string, characterId: string) => {
    try {
      await socketManager.connect(token, characterId);
      set({ isConnected: true });
      
      // Setup event listeners
      socketManager.on('player:joined', (data: any) => {
        console.log('Player joined:', data);
      });
      
      socketManager.on('player:left', (data: any) => {
        console.log('Player left:', data);
      });
      
      socketManager.on('party:invitation', (data: any) => {
        get().addPartyInvite(data.partyId);
      });
      
      socketManager.on('party:created', (data: any) => {
        get().setCurrentParty(data);
      });
      
      socketManager.on('party:member_joined', (data: any) => {
        const party = get().currentParty;
        if (party && party.id === data.partyId) {
          // Update party members
          console.log('Party member joined:', data);
        }
      });
      
      socketManager.on('party:member_left', (data: any) => {
        const party = get().currentParty;
        if (party && party.id === data.partyId) {
          console.log('Party member left:', data);
        }
      });
      
      socketManager.on('chat:message_received', (data: ChatMessage) => {
        get().addChatMessage(data);
      });
      
      socketManager.on('chat:whisper_received', (data: any) => {
        get().addChatMessage({
          id: `whisper_${Date.now()}`,
          channel: 'whisper',
          fromCharacterId: data.fromCharacterId,
          fromCharacterName: data.fromCharacterName,
          message: data.message,
          timestamp: data.timestamp,
        });
      });
      
    } catch (error) {
      console.error('Failed to connect:', error);
      throw error;
    }
  },
  
  disconnect: () => {
    socketManager.disconnect();
    set({ isConnected: false });
  },
  
  sendFriendRequest: (targetUserId: string) => {
    // API call to send friend request
    console.log('Sending friend request to:', targetUserId);
  },
  
  acceptFriendRequest: (requestId: string) => {
    // API call to accept friend request
    console.log('Accepting friend request:', requestId);
  },
  
  rejectFriendRequest: (requestId: string) => {
    set(state => ({
      friendRequests: state.friendRequests.filter(r => r.id !== requestId),
    }));
  },
  
  removeFriend: (friendId: string) => {
    set(state => ({
      friends: state.friends.filter(f => f.id !== friendId),
    }));
  },
  
  setFriends: (friends: Friend[]) => {
    set({ friends });
  },
  
  setFriendRequests: (requests: FriendRequest[]) => {
    set({ friendRequests: requests });
  },
  
  createParty: (members: string[]) => {
    const partyId = `party_${Date.now()}`;
    socketManager.emit('party:create', { partyId, members });
  },
  
  inviteToParty: (characterId: string) => {
    const party = get().currentParty;
    if (party) {
      socketManager.emit('party:invite', { partyId: party.id, characterId });
    }
  },
  
  joinParty: (partyId: string) => {
    socketManager.emit('party:join', { partyId });
    get().removePartyInvite(partyId);
  },
  
  leaveParty: () => {
    const party = get().currentParty;
    if (party) {
      socketManager.emit('party:leave', { partyId: party.id });
      set({ currentParty: null });
    }
  },
  
  setCurrentParty: (party: Party | null) => {
    set({ currentParty: party });
  },
  
  addPartyInvite: (partyId: string) => {
    set(state => ({
      partyInvites: [...state.partyInvites, partyId],
    }));
  },
  
  removePartyInvite: (partyId: string) => {
    set(state => ({
      partyInvites: state.partyInvites.filter(id => id !== partyId),
    }));
  },
  
  sendMessage: (channel: string, message: string, characterName: string) => {
    socketManager.emit('chat:message', { channel, message, characterName });
  },
  
  sendWhisper: (targetCharacterId: string, message: string, characterName: string) => {
    socketManager.emit('chat:whisper', { targetCharacterId, message, characterName });
  },
  
  addChatMessage: (message: ChatMessage) => {
    set(state => ({
      chatMessages: [...state.chatMessages, message].slice(-100), // Keep last 100 messages
    }));
  },
  
  clearChat: () => {
    set({ chatMessages: [] });
  },
}));
