import { Quest } from '../types/multiplayer.types';

export const QUESTS: Quest[] = [
  // Daily Quests
  {
    id: 'daily_monster_hunt',
    title: 'Daily Monster Hunt',
    description: 'Defeat 10 monsters to earn rewards',
    type: 'daily',
    npcGiver: 'Guard Captain Marcus',
    objectives: [
      {
        type: 'kill',
        target: 'any',
        current: 0,
        required: 10,
      },
    ],
    rewards: {
      experience: 500,
      gold: 100,
      battlePassXP: 50,
    },
    isRepeatable: true,
    resetTime: 'daily',
  },
  {
    id: 'daily_dungeon_run',
    title: 'Daily Dungeon Challenge',
    description: 'Complete 1 dungeon today',
    type: 'daily',
    npcGiver: 'Dungeon Master Elara',
    objectives: [
      {
        type: 'kill',
        target: 'dungeon_boss',
        current: 0,
        required: 1,
      },
    ],
    rewards: {
      experience: 1000,
      gold: 250,
      battlePassXP: 100,
    },
    isRepeatable: true,
    resetTime: 'daily',
  },
  {
    id: 'daily_collection',
    title: 'Resource Gathering',
    description: 'Collect resources from defeated enemies',
    type: 'daily',
    npcGiver: 'Merchant Wilhelm',
    objectives: [
      {
        type: 'collect',
        target: 'resource',
        current: 0,
        required: 20,
      },
    ],
    rewards: {
      experience: 300,
      gold: 150,
      battlePassXP: 30,
    },
    isRepeatable: true,
    resetTime: 'daily',
  },
  
  // Weekly Quests
  {
    id: 'weekly_elite_hunt',
    title: 'Elite Monster Hunt',
    description: 'Defeat 5 elite monsters this week',
    type: 'weekly',
    npcGiver: 'Hunter Guildmaster',
    objectives: [
      {
        type: 'kill',
        target: 'elite',
        current: 0,
        required: 5,
      },
    ],
    rewards: {
      experience: 3000,
      gold: 1000,
      battlePassXP: 300,
    },
    isRepeatable: true,
    resetTime: 'weekly',
  },
  {
    id: 'weekly_dungeon_master',
    title: 'Dungeon Master',
    description: 'Complete 5 different dungeons this week',
    type: 'weekly',
    npcGiver: 'Dungeon Master Elara',
    objectives: [
      {
        type: 'kill',
        target: 'dungeon_boss',
        current: 0,
        required: 5,
      },
    ],
    rewards: {
      experience: 5000,
      gold: 2000,
      battlePassXP: 500,
    },
    isRepeatable: true,
    resetTime: 'weekly',
  },
  {
    id: 'weekly_party_quest',
    title: 'Team Player',
    description: 'Complete 10 quests or dungeons with a party',
    type: 'weekly',
    npcGiver: 'Party Coordinator',
    objectives: [
      {
        type: 'kill',
        target: 'party_objective',
        current: 0,
        required: 10,
      },
    ],
    rewards: {
      experience: 4000,
      gold: 1500,
      battlePassXP: 400,
    },
    isRepeatable: true,
    resetTime: 'weekly',
  },
  {
    id: 'weekly_guild_contribution',
    title: 'Guild Contribution',
    description: 'Contribute to your guild through quests',
    type: 'weekly',
    npcGiver: 'Guild Steward',
    objectives: [
      {
        type: 'interact',
        target: 'guild_quest',
        current: 0,
        required: 3,
      },
    ],
    rewards: {
      experience: 3500,
      gold: 1200,
      battlePassXP: 350,
    },
    isRepeatable: true,
    resetTime: 'weekly',
  },
  
  // Monthly Quests
  {
    id: 'monthly_boss_slayer',
    title: 'Boss Slayer Challenge',
    description: 'Defeat 20 boss monsters this month',
    type: 'monthly',
    npcGiver: 'King\'s Herald',
    objectives: [
      {
        type: 'kill',
        target: 'boss',
        current: 0,
        required: 20,
      },
    ],
    rewards: {
      experience: 15000,
      gold: 5000,
      battlePassXP: 1000,
    },
    isRepeatable: true,
    resetTime: 'monthly',
  },
  {
    id: 'monthly_explorer',
    title: 'World Explorer',
    description: 'Visit 10 different maps this month',
    type: 'monthly',
    npcGiver: 'Cartographer',
    objectives: [
      {
        type: 'reach',
        target: 'maps',
        current: 0,
        required: 10,
      },
    ],
    rewards: {
      experience: 10000,
      gold: 3000,
      battlePassXP: 800,
    },
    isRepeatable: true,
    resetTime: 'monthly',
  },
  {
    id: 'monthly_collector',
    title: 'Treasure Hunter',
    description: 'Collect 100 rare items this month',
    type: 'monthly',
    npcGiver: 'Treasure Hunter Guildmaster',
    objectives: [
      {
        type: 'collect',
        target: 'rare_items',
        current: 0,
        required: 100,
      },
    ],
    rewards: {
      experience: 12000,
      gold: 4000,
      battlePassXP: 900,
    },
    isRepeatable: true,
    resetTime: 'monthly',
  },
  
  // Story Quests
  {
    id: 'story_beginning',
    title: 'A Hero\'s Journey Begins',
    description: 'Speak with the village elder to learn about your destiny',
    type: 'story',
    npcGiver: 'Village Elder',
    objectives: [
      {
        type: 'interact',
        target: 'village_elder',
        current: 0,
        required: 1,
      },
    ],
    rewards: {
      experience: 200,
      gold: 50,
      battlePassXP: 20,
    },
    isRepeatable: false,
  },
  {
    id: 'story_first_combat',
    title: 'First Blood',
    description: 'Prove your worth by defeating 5 goblins',
    type: 'story',
    npcGiver: 'Guard Captain Marcus',
    objectives: [
      {
        type: 'kill',
        target: 'goblin',
        current: 0,
        required: 5,
      },
    ],
    rewards: {
      experience: 500,
      gold: 100,
      battlePassXP: 50,
    },
    isRepeatable: false,
  },
  {
    id: 'story_dungeon_intro',
    title: 'The Goblin Threat',
    description: 'Clear the Goblin Cave to protect the village',
    type: 'story',
    npcGiver: 'Guard Captain Marcus',
    objectives: [
      {
        type: 'kill',
        target: 'goblin_king',
        current: 0,
        required: 1,
      },
    ],
    rewards: {
      experience: 1000,
      gold: 300,
      battlePassXP: 100,
    },
    isRepeatable: false,
  },
  {
    id: 'story_desert_journey',
    title: 'Journey to Solaris',
    description: 'Travel to the Empire of Solaris and meet the Sultan',
    type: 'story',
    npcGiver: 'King of Valoria',
    objectives: [
      {
        type: 'reach',
        target: 'solaris_capital',
        current: 0,
        required: 1,
      },
      {
        type: 'interact',
        target: 'sultan',
        current: 0,
        required: 1,
      },
    ],
    rewards: {
      experience: 3000,
      gold: 1000,
      battlePassXP: 200,
    },
    isRepeatable: false,
  },
  {
    id: 'story_frozen_quest',
    title: 'The Frozen Prophecy',
    description: 'Investigate strange occurrences in the Frozen North',
    type: 'story',
    npcGiver: 'Oracle of Solaris',
    objectives: [
      {
        type: 'reach',
        target: 'north_tundra',
        current: 0,
        required: 1,
      },
      {
        type: 'kill',
        target: 'frost_giant',
        current: 0,
        required: 1,
      },
    ],
    rewards: {
      experience: 8000,
      gold: 3000,
      battlePassXP: 500,
    },
    isRepeatable: false,
  },
  {
    id: 'story_mystic_discovery',
    title: 'The Floating Mysteries',
    description: 'Discover the secrets of the Mystic Isles',
    type: 'story',
    npcGiver: 'Ancient Sage',
    objectives: [
      {
        type: 'reach',
        target: 'isles_central',
        current: 0,
        required: 1,
      },
      {
        type: 'interact',
        target: 'arcane_library',
        current: 0,
        required: 1,
      },
    ],
    rewards: {
      experience: 12000,
      gold: 5000,
      battlePassXP: 800,
    },
    isRepeatable: false,
  },
  {
    id: 'story_shadow_threat',
    title: 'The Shadow Rises',
    description: 'Confront the dark lord in the Shadowlands',
    type: 'story',
    npcGiver: 'Council of Elders',
    objectives: [
      {
        type: 'reach',
        target: 'shadow_keep',
        current: 0,
        required: 1,
      },
      {
        type: 'kill',
        target: 'dark_lord',
        current: 0,
        required: 1,
      },
    ],
    rewards: {
      experience: 50000,
      gold: 20000,
      battlePassXP: 2000,
    },
    isRepeatable: false,
  },
  
  // Guild Quests
  {
    id: 'guild_monster_hunt',
    title: 'Guild Monster Hunt',
    description: 'Work together to defeat 100 monsters as a guild',
    type: 'guild',
    npcGiver: 'Guild Steward',
    objectives: [
      {
        type: 'kill',
        target: 'any',
        current: 0,
        required: 100,
      },
    ],
    rewards: {
      experience: 5000,
      gold: 2000,
      battlePassXP: 300,
    },
    isRepeatable: true,
  },
  {
    id: 'guild_dungeon_clear',
    title: 'Guild Dungeon Raid',
    description: 'Complete 10 dungeons as guild members',
    type: 'guild',
    npcGiver: 'Guild Steward',
    objectives: [
      {
        type: 'kill',
        target: 'dungeon_boss',
        current: 0,
        required: 10,
      },
    ],
    rewards: {
      experience: 8000,
      gold: 4000,
      battlePassXP: 500,
    },
    isRepeatable: true,
  },
  {
    id: 'guild_treasury',
    title: 'Guild Treasury',
    description: 'Contribute gold to the guild treasury',
    type: 'guild',
    npcGiver: 'Guild Treasurer',
    objectives: [
      {
        type: 'interact',
        target: 'treasury',
        current: 0,
        required: 10000,
      },
    ],
    rewards: {
      experience: 10000,
      gold: 0,
      battlePassXP: 600,
    },
    isRepeatable: true,
  },
];
