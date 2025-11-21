import { ElementType } from './character.types';

export interface Spell {
  id: string;
  name: string;
  pa: number; // Coût en points d'action
  critChance: number; // Probabilité de coup critique (ex: 0.02 = 1/50)
  damageMin: number;
  damageMax: number;
  element: ElementType;
  rangeMin: number; // Portée minimum
  rangeMax: number; // Portée maximum
  cooldown?: number; // Tour de recharge (optionnel)
  currentCooldown?: number; // Cooldown actuel
  aoeRadius?: number; // Rayon d'effet de zone (optionnel)
  isHeal?: boolean; // Si c'est un sort de soin
  description: string;
  icon?: string;
}

export interface PassiveSkill {
  id: string;
  name: string;
  description: string;
  levels: {
    level: number;
    bonus: number | string;
  }[];
  maxLevel: number;
  currentLevel: number;
}
