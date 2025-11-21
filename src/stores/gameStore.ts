import { create } from 'zustand';
import { CombatPhase, CombatLogEntry } from '../types/combat.types';

interface GameState {
  // État du jeu
  isInCombat: boolean;
  currentTurn: number;
  combatPhase: CombatPhase;
  combatLog: CombatLogEntry[];
  turnOrder: string[];
  currentTurnIndex: number;
  
  // Actions
  startCombat: (characterIds: string[]) => void;
  endCombat: () => void;
  nextTurn: () => void;
  addLogEntry: (entry: CombatLogEntry) => void;
  clearLog: () => void;
  setCombatPhase: (phase: CombatPhase) => void;
  setTurnOrder: (order: string[]) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // État initial
  isInCombat: false,
  currentTurn: 1,
  combatPhase: 'selection',
  combatLog: [],
  turnOrder: [],
  currentTurnIndex: 0,
  
  // Démarrer un combat
  startCombat: (characterIds: string[]) => {
    set({
      isInCombat: true,
      currentTurn: 1,
      combatPhase: 'selection',
      turnOrder: characterIds,
      currentTurnIndex: 0,
      combatLog: [{
        id: `log_combat_start_${Date.now()}`,
        message: '⚔️ Le combat commence !',
        timestamp: Date.now(),
        type: 'info',
      }],
    });
  },
  
  // Terminer le combat
  endCombat: () => {
    const state = get();
    set({
      isInCombat: false,
      combatPhase: 'end',
      combatLog: [
        ...state.combatLog,
        {
          id: `log_combat_end_${Date.now()}`,
          message: '🏆 Le combat est terminé !',
          timestamp: Date.now(),
          type: 'info',
        },
      ],
    });
  },
  
  // Passer au tour suivant
  nextTurn: () => {
    const state = get();
    const nextIndex = (state.currentTurnIndex + 1) % state.turnOrder.length;
    const isNewRound = nextIndex === 0;
    
    set({
      currentTurnIndex: nextIndex,
      currentTurn: isNewRound ? state.currentTurn + 1 : state.currentTurn,
      combatPhase: 'selection',
    });
  },
  
  // Ajouter une entrée au log
  addLogEntry: (entry: CombatLogEntry) => {
    const state = get();
    set({
      combatLog: [...state.combatLog, entry],
    });
  },
  
  // Vider le log
  clearLog: () => {
    set({ combatLog: [] });
  },
  
  // Changer la phase de combat
  setCombatPhase: (phase: CombatPhase) => {
    set({ combatPhase: phase });
  },
  
  // Définir l'ordre des tours
  setTurnOrder: (order: string[]) => {
    set({ turnOrder: order, currentTurnIndex: 0 });
  },
}));
