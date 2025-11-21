export enum CharacterClass {
  WARRIOR = 'WARRIOR',
  PALADIN = 'PALADIN',
  ARCHER = 'ARCHER',
  SORCERER = 'SORCERER',
  CLERIC = 'CLERIC',
  THIEF = 'THIEF',
  ASSASSIN = 'ASSASSIN',
}

export enum ElementType {
  EARTH = 'EARTH',
  FIRE = 'FIRE',
  AIR = 'AIR',
  WATER = 'WATER',
  LIGHT = 'LIGHT',
  SHADOW = 'SHADOW',
  POISON = 'POISON',
  DARKNESS = 'DARKNESS',
  ARCANE = 'ARCANE',
  ICE = 'ICE',
  ELECTRIC = 'ELECTRIC',
  STEALTH = 'STEALTH',
}

export interface ElementalResistance {
  [ElementType.EARTH]: number;
  [ElementType.FIRE]: number;
  [ElementType.AIR]: number;
  [ElementType.WATER]: number;
  [ElementType.LIGHT]: number;
  [ElementType.SHADOW]: number;
  [ElementType.POISON]: number;
  [ElementType.DARKNESS]: number;
  [ElementType.ARCANE]: number;
  [ElementType.ICE]: number;
  [ElementType.ELECTRIC]: number;
  [ElementType.STEALTH]: number;
}

export interface Position {
  x: number;
  z: number;
}

export interface Character {
  id: string;
  name: string;
  class: CharacterClass;
  level: number;
  experience: number;
  
  // Stats de base
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  vigor: number;
  wisdom: number;
  strength: number; // Force / Terre
  intelligence: number; // Intelligence / Feu
  agility: number; // Agilité / Vent
  luck: number; // Chance / Eau
  
  // Points d'action
  pa: number; // Points d'action actuels
  maxPa: number; // Points d'action max
  pm: number; // Points de mouvement actuels
  maxPm: number; // Points de mouvement max
  
  // Stats de combat
  stealth: number;
  defense: number;
  dodge: number;
  magicResistance: number;
  meleeResistance: number;
  rangedResistance: number;
  moveSpeed: number;
  
  // Résistances élémentaires
  elementalResistance: Partial<ElementalResistance>;
  
  // Position
  position: Position;
  
  // Progression
  rebirthCount: number; // Nombre de "Retour du Plus Fort"
  
  // Apparence
  color: string;
  
  // État
  isAlive: boolean;
  isPlayerControlled: boolean;
}

export interface ClassDefinition {
  id: CharacterClass;
  name: string;
  description: string;
  evolution: string;
  bonus: string;
  color: string;
  equipment: string[];
  
  // Stats de départ
  baseHp: number;
  baseMana: number;
  baseVigor: number;
  baseWisdom: number;
  baseStrength: number;
  baseIntelligence: number;
  baseAgility: number;
  baseLuck: number;
  baseStealth: number;
  baseDefense: number;
  baseDodge: number;
}

export interface Artifact {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'helmet' | 'gloves' | 'boots' | 'accessory';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  stats: {
    hp?: number;
    mana?: number;
    strength?: number;
    intelligence?: number;
    agility?: number;
    luck?: number;
    defense?: number;
    magicResistance?: number;
  };
  description: string;
}

export interface Companion {
  id: string;
  name: string;
  type: 'familiar' | 'mount';
  description: string;
  stats: {
    hp?: number;
    moveSpeed?: number;
    bonusDamage?: number;
  };
}
