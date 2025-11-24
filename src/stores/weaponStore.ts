import { create } from 'zustand';
import { Weapon, WeaponState, WeaponType } from '../types/weapon.types';

// Arme par défaut (poings)
const FISTS: Weapon = {
  id: 'fists',
  name: 'Poings',
  type: WeaponType.FISTS,
  damage: 5,
  range: 1,
  speed: 1.5,
  equipped: false,
};

export const useWeaponStore = create<WeaponState>((set) => ({
  currentWeapon: null,
  weaponDrawn: false,
  availableWeapons: [],

  equipWeapon: (weapon: Weapon) => set((state) => {
    // Déséquiper l'ancienne arme
    const updatedWeapons = state.availableWeapons.map((w) =>
      w.id === weapon.id ? { ...w, equipped: true } : { ...w, equipped: false }
    );

    return {
      currentWeapon: weapon,
      weaponDrawn: true,
      availableWeapons: updatedWeapons,
    };
  }),

  toggleWeapon: () => set((state) => {
    // Si l'arme est rangée, on peut utiliser les poings
    const newWeaponDrawn = !state.weaponDrawn;
    
    return {
      weaponDrawn: newWeaponDrawn,
      currentWeapon: newWeaponDrawn ? state.currentWeapon : FISTS,
    };
  }),

  addWeapon: (weapon: Weapon) => set((state) => ({
    availableWeapons: [...state.availableWeapons, weapon],
  })),

  removeWeapon: (weaponId: string) => set((state) => {
    const newWeapons = state.availableWeapons.filter((w) => w.id !== weaponId);
    const newCurrentWeapon = state.currentWeapon?.id === weaponId ? null : state.currentWeapon;
    
    return {
      availableWeapons: newWeapons,
      currentWeapon: newCurrentWeapon,
    };
  }),
}));
