import { create } from 'zustand';
import { Character, CharacterClass, Position } from '../types/character.types';
import { CLASSES } from '../data/classes';
import { SPELLS_BY_CLASS } from '../data/spells';

interface CharacterState {
  // État
  characters: Character[];
  selectedCharacterId: string | null;
  playerCharacter: Character | null;
  
  // Actions
  addCharacter: (character: Character) => void;
  removeCharacter: (id: string) => void;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  selectCharacter: (id: string | null) => void;
  createPlayerCharacter: (name: string, characterClass: CharacterClass) => Character;
  setPlayerCharacter: (character: Character) => void;
  getCharacterById: (id: string) => Character | undefined;
  moveCharacter: (id: string, newPosition: Position) => void;
  resetCharacters: () => void;
}

export const useCharacterStore = create<CharacterState>((set, get) => ({
  // État initial
  characters: [],
  selectedCharacterId: null,
  playerCharacter: null,
  
  // Ajouter un personnage
  addCharacter: (character: Character) => {
    set((state) => ({
      characters: [...state.characters, character],
    }));
  },
  
  // Supprimer un personnage
  removeCharacter: (id: string) => {
    set((state) => ({
      characters: state.characters.filter((char) => char.id !== id),
      selectedCharacterId: state.selectedCharacterId === id ? null : state.selectedCharacterId,
    }));
  },
  
  // Mettre à jour un personnage
  updateCharacter: (id: string, updates: Partial<Character>) => {
    set((state) => ({
      characters: state.characters.map((char) =>
        char.id === id ? { ...char, ...updates } : char
      ),
      playerCharacter:
        state.playerCharacter?.id === id
          ? { ...state.playerCharacter, ...updates }
          : state.playerCharacter,
    }));
  },
  
  // Sélectionner un personnage
  selectCharacter: (id: string | null) => {
    set({ selectedCharacterId: id });
  },
  
  // Créer le personnage du joueur
  createPlayerCharacter: (name: string, characterClass: CharacterClass): Character => {
    const classData = CLASSES[characterClass];
    
    const character: Character = {
      id: `player_${Date.now()}`,
      name,
      class: characterClass,
      level: 1,
      experience: 0,
      hp: classData.baseHp,
      maxHp: classData.baseHp,
      mana: classData.baseMana,
      maxMana: classData.baseMana,
      vigor: classData.baseVigor,
      wisdom: classData.baseWisdom,
      strength: classData.baseStrength,
      intelligence: classData.baseIntelligence,
      agility: classData.baseAgility,
      luck: classData.baseLuck,
      pa: 10,
      maxPa: 10,
      pm: 5,
      maxPm: 5,
      stealth: classData.baseStealth,
      defense: classData.baseDefense,
      dodge: classData.baseDodge,
      magicResistance: 10,
      meleeResistance: 10,
      rangedResistance: 10,
      moveSpeed: 5,
      elementalResistance: {},
      position: { x: 5, z: 5 },
      rebirthCount: 0,
      color: classData.color,
      isAlive: true,
      isPlayerControlled: true,
    };
    
    return character;
  },
  
  // Définir le personnage du joueur
  setPlayerCharacter: (character: Character) => {
    set({ playerCharacter: character });
    get().addCharacter(character);
  },
  
  // Obtenir un personnage par ID
  getCharacterById: (id: string) => {
    return get().characters.find((char) => char.id === id);
  },
  
  // Déplacer un personnage
  moveCharacter: (id: string, newPosition: Position) => {
    get().updateCharacter(id, { position: newPosition });
  },
  
  // Réinitialiser tous les personnages
  resetCharacters: () => {
    set({
      characters: [],
      selectedCharacterId: null,
      playerCharacter: null,
    });
  },
}));
