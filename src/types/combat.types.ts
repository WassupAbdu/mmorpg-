import { Character } from './character.types';
import { Spell } from './spell.types';

export interface CombatAction {
  actorId: string;
  targetId: string;
  spell: Spell;
  damage: number;
  isCritical: boolean;
  timestamp: number;
}

export interface CombatLogEntry {
  id: string;
  message: string;
  timestamp: number;
  type: 'damage' | 'heal' | 'critical' | 'miss' | 'death' | 'turn' | 'info';
}

export type CombatPhase = 'selection' | 'action' | 'animation' | 'end';

export interface CombatState {
  phase: CombatPhase;
  turnOrder: string[]; // IDs des personnages dans l'ordre des tours
  currentTurnIndex: number;
  combatLog: CombatLogEntry[];
}
