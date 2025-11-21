import { create } from 'zustand';
import { Monster, MonsterSpawnPoint } from '../types/monster.types';
import { Position } from '../types/character.types';

interface WorldState {
  // Configuration du monde
  gridWidth: number;
  gridHeight: number;
  
  // Monstres
  monsters: Monster[];
  spawnPoints: MonsterSpawnPoint[];
  
  // Caméra
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  
  // Actions
  setGridSize: (width: number, height: number) => void;
  addMonster: (monster: Monster) => void;
  removeMonster: (id: string) => void;
  updateMonster: (id: string, updates: Partial<Monster>) => void;
  getMonsterById: (id: string) => Monster | undefined;
  getMonsterAt: (position: Position) => Monster | undefined;
  addSpawnPoint: (spawnPoint: MonsterSpawnPoint) => void;
  setCameraPosition: (position: [number, number, number]) => void;
  setCameraTarget: (target: [number, number, number]) => void;
  clearMonsters: () => void;
}

export const useWorldStore = create<WorldState>((set, get) => ({
  // État initial - Carte immense 100x100
  gridWidth: 100,
  gridHeight: 100,
  monsters: [],
  spawnPoints: [],
  cameraPosition: [50, 30, 50],
  cameraTarget: [50, 0, 50],
  
  // Définir la taille de la grille
  setGridSize: (width: number, height: number) => {
    set({ gridWidth: width, gridHeight: height });
  },
  
  // Ajouter un monstre
  addMonster: (monster: Monster) => {
    set((state) => ({
      monsters: [...state.monsters, monster],
    }));
  },
  
  // Supprimer un monstre
  removeMonster: (id: string) => {
    set((state) => ({
      monsters: state.monsters.filter((monster) => monster.id !== id),
    }));
  },
  
  // Mettre à jour un monstre
  updateMonster: (id: string, updates: Partial<Monster>) => {
    set((state) => ({
      monsters: state.monsters.map((monster) =>
        monster.id === id ? { ...monster, ...updates } : monster
      ),
    }));
  },
  
  // Obtenir un monstre par ID
  getMonsterById: (id: string) => {
    return get().monsters.find((monster) => monster.id === id);
  },
  
  // Obtenir un monstre à une position donnée
  getMonsterAt: (position: Position) => {
    return get().monsters.find(
      (monster) =>
        monster.position.x === position.x && monster.position.z === position.z
    );
  },
  
  // Ajouter un point de spawn
  addSpawnPoint: (spawnPoint: MonsterSpawnPoint) => {
    set((state) => ({
      spawnPoints: [...state.spawnPoints, spawnPoint],
    }));
  },
  
  // Définir la position de la caméra
  setCameraPosition: (position: [number, number, number]) => {
    set({ cameraPosition: position });
  },
  
  // Définir la cible de la caméra
  setCameraTarget: (target: [number, number, number]) => {
    set({ cameraTarget: target });
  },
  
  // Vider tous les monstres
  clearMonsters: () => {
    set({ monsters: [] });
  },
}));
