import { create } from 'zustand';
import { Guild } from '../types/multiplayer.types';

interface GuildState {
  currentGuild: Guild | null;
  availableGuilds: Guild[];
  
  // Actions
  setCurrentGuild: (guild: Guild | null) => void;
  setAvailableGuilds: (guilds: Guild[]) => void;
  createGuild: (name: string, tag: string, description: string) => Promise<void>;
  joinGuild: (guildId: string) => Promise<void>;
  leaveGuild: () => Promise<void>;
  contributeToGuild: (amount: number) => Promise<void>;
}

export const useGuildStore = create<GuildState>((set, get) => ({
  currentGuild: null,
  availableGuilds: [],
  
  setCurrentGuild: (guild: Guild | null) => {
    set({ currentGuild: guild });
  },
  
  setAvailableGuilds: (guilds: Guild[]) => {
    set({ availableGuilds: guilds });
  },
  
  createGuild: async (name: string, tag: string, description: string) => {
    try {
      // API call to create guild
      console.log('Creating guild:', name, tag, description);
      // const response = await fetch('/api/guilds', { method: 'POST', body: JSON.stringify({ name, tag, description }) });
      // const guild = await response.json();
      // set({ currentGuild: guild });
    } catch (error) {
      console.error('Failed to create guild:', error);
      throw error;
    }
  },
  
  joinGuild: async (guildId: string) => {
    try {
      console.log('Joining guild:', guildId);
      // API call to join guild
    } catch (error) {
      console.error('Failed to join guild:', error);
      throw error;
    }
  },
  
  leaveGuild: async () => {
    try {
      const guild = get().currentGuild;
      if (guild) {
        console.log('Leaving guild:', guild.id);
        // API call to leave guild
        set({ currentGuild: null });
      }
    } catch (error) {
      console.error('Failed to leave guild:', error);
      throw error;
    }
  },
  
  contributeToGuild: async (amount: number) => {
    try {
      console.log('Contributing to guild:', amount);
      // API call to contribute
    } catch (error) {
      console.error('Failed to contribute:', error);
      throw error;
    }
  },
}));
