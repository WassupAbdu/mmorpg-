import { create } from 'zustand';
import { Spell } from '../types/spell.types';
import { Character } from '../types/character.types';

interface CombatState {
  // État de sélection
  selectedSpell: Spell | null;
  targetCharacterId: string | null;
  hoveredCharacterId: string | null;
  
  // Actions
  selectSpell: (spell: Spell | null) => void;
  selectTarget: (id: string | null) => void;
  setHoveredCharacter: (id: string | null) => void;
  clearSelection: () => void;
}

export const useCombatStore = create<CombatState>((set) => ({
  // État initial
  selectedSpell: null,
  targetCharacterId: null,
  hoveredCharacterId: null,
  
  // Sélectionner un sort
  selectSpell: (spell: Spell | null) => {
    set({ selectedSpell: spell });
  },
  
  // Sélectionner une cible
  selectTarget: (id: string | null) => {
    set({ targetCharacterId: id });
  },
  
  // Définir le personnage survolé
  setHoveredCharacter: (id: string | null) => {
    set({ hoveredCharacterId: id });
  },
  
  // Vider la sélection
  clearSelection: () => {
    set({
      selectedSpell: null,
      targetCharacterId: null,
      hoveredCharacterId: null,
    });
  },
}));
