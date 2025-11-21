// Friend System
export interface Friend {
  id: string;
  userId: string;
  displayName: string;
  photoURL?: string;
  status: 'online' | 'offline' | 'in-combat' | 'in-dungeon';
  lastSeen: number;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromDisplayName: string;
  timestamp: number;
}

// Party System
export interface PartyMember {
  characterId: string;
  characterName: string;
  class: string;
  level: number;
  hp: number;
  maxHp: number;
  role: 'leader' | 'member';
}

export interface Party {
  id: string;
  name: string;
  members: PartyMember[];
  maxMembers: number;
  isPublic: boolean;
  currentDungeonId?: string;
}

// Guild System
export interface GuildMember {
  characterId: string;
  characterName: string;
  rank: 'leader' | 'officer' | 'member';
  contributionPoints: number;
  joinedAt: number;
}

export interface Guild {
  id: string;
  name: string;
  tag: string;
  description: string;
  level: number;
  experience: number;
  members: GuildMember[];
  maxMembers: number;
  treasury: number;
}

// Quest System
export interface QuestObjective {
  type: 'kill' | 'collect' | 'interact' | 'reach';
  target: string;
  current: number;
  required: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'story' | 'guild';
  npcGiver?: string;
  objectives: QuestObjective[];
  rewards: {
    experience: number;
    gold?: number;
    battlePassXP?: number;
  };
  isRepeatable: boolean;
  resetTime?: 'daily' | 'weekly' | 'monthly';
}

export interface UserQuest {
  questId: string;
  startedAt: number;
  objectives: {
    type: string;
    current: number;
    required: number;
  }[];
  completed: boolean;
  completedAt?: number;
}

// Battle Pass
export interface BattlePassReward {
  type: 'item' | 'gold' | 'cosmetic';
  itemId?: string;
  amount?: number;
  name: string;
  icon: string;
}

export interface BattlePassTier {
  tier: number;
  requiredXP: number;
  rewards: {
    free: BattlePassReward[];
    premium: BattlePassReward[];
  };
}

export interface UserBattlePass {
  season: number;
  currentTier: number;
  currentXP: number;
  isPremium: boolean;
  claimedRewards: {
    tier: number;
    type: 'free' | 'premium';
  }[];
}

// Achievement System
export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'combat' | 'exploration' | 'social' | 'progression' | 'collection';
  icon: string;
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum';
  criteria: {
    type: string;
    target: string;
    required: number;
  };
  rewards: {
    experience?: number;
    gold?: number;
    title?: string;
  };
  isSecret: boolean;
}

export interface UserAchievement {
  achievementId: string;
  progress: number;
  completed: boolean;
  completedAt?: number;
}

// Chat System
export interface ChatMessage {
  id: string;
  channel: 'global' | 'party' | 'guild' | 'whisper';
  fromCharacterId: string;
  fromCharacterName: string;
  message: string;
  timestamp: number;
}

// Map System
export interface GameMap {
  id: string;
  name: string;
  countryId: string;
  description: string;
  minLevel: number;
  maxLevel: number;
  width: number;
  height: number;
  dungeons: string[];
}

export interface Country {
  id: string;
  name: string;
  description: string;
  maps: string[];
}

// Dungeon System
export interface Dungeon {
  id: string;
  name: string;
  description: string;
  difficulty: 'normal' | 'hard' | 'extreme';
  requiredPlayers: number;
  minLevel: number;
  mapId: string;
  rewards: {
    experience: number;
    gold: number;
    items: string[];
  };
}
