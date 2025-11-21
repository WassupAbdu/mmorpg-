import { Character, ElementType, Position } from './character.types';
import { Spell } from './spell.types';

export enum MonsterType {
  GOBLIN = 'GOBLIN',
  ORC = 'ORC',
  TROLL = 'TROLL',
  DRAGON = 'DRAGON',
  UNDEAD = 'UNDEAD',
  DEMON = 'DEMON',
  ELEMENTAL = 'ELEMENTAL',
  BEAST = 'BEAST',
  INSECT = 'INSECT',
  SLIME = 'SLIME',
  GOLEM = 'GOLEM',
  SPIRIT = 'SPIRIT',
  VAMPIRE = 'VAMPIRE',
  WEREWOLF = 'WEREWOLF',
  SKELETON = 'SKELETON',
  ZOMBIE = 'ZOMBIE',
  GHOST = 'GHOST',
  WRAITH = 'WRAITH',
  LICH = 'LICH',
  HYDRA = 'HYDRA',
  CHIMERA = 'CHIMERA',
  GRIFFIN = 'GRIFFIN',
  PHOENIX = 'PHOENIX',
  KRAKEN = 'KRAKEN',
  MINOTAUR = 'MINOTAUR',
  CENTAUR = 'CENTAUR',
  HARPY = 'HARPY',
  BASILISK = 'BASILISK',
  COCKATRICE = 'COCKATRICE',
  WYVERN = 'WYVERN',
  DRAKE = 'DRAKE',
  WYRM = 'WYRM',
  SERPENT = 'SERPENT',
  SPIDER = 'SPIDER',
  SCORPION = 'SCORPION',
  MANTIS = 'MANTIS',
  BEETLE = 'BEETLE',
  WASP = 'WASP',
  ANT = 'ANT',
  WOLF = 'WOLF',
  BEAR = 'BEAR',
  LION = 'LION',
  TIGER = 'TIGER',
  EAGLE = 'EAGLE',
  FALCON = 'FALCON',
  HAWK = 'HAWK',
  OWL = 'OWL',
  RAVEN = 'RAVEN',
  CROW = 'CROW',
  BAT = 'BAT',
}

export enum MonsterRarity {
  COMMON = 'COMMON',
  UNCOMMON = 'UNCOMMON',
  RARE = 'RARE',
  ELITE = 'ELITE',
  BOSS = 'BOSS',
  LEGENDARY = 'LEGENDARY',
}

export interface MonsterDefinition {
  type: MonsterType;
  name: string;
  description: string;
  rarity: MonsterRarity;
  level: number;
  
  // Stats de base
  baseHp: number;
  baseMana: number;
  baseStrength: number;
  baseIntelligence: number;
  baseAgility: number;
  baseLuck: number;
  baseDefense: number;
  
  // Apparence
  color: string;
  scale: number;
  
  // Comportement IA
  aggroRange: number; // Distance d'agression
  aiStrategy: 'aggressive' | 'defensive' | 'balanced' | 'ranged' | 'support';
  
  // Capacités spéciales
  spells: string[]; // IDs des sorts
  abilities: string[]; // Capacités uniques
  
  // Drops
  experienceReward: number;
  lootTable: {
    itemId: string;
    dropChance: number;
  }[];
}

export interface Monster extends Omit<Character, 'class'> {
  monsterType: MonsterType;
  definition: MonsterDefinition;
  aggroTarget: string | null; // ID du personnage ciblé
}

export interface MonsterSpawnPoint {
  position: Position;
  monsterTypes: MonsterType[];
  spawnRate: number; // Secondes entre chaque spawn
  maxSpawned: number;
  currentSpawned: number;
  lastSpawnTime: number;
}
