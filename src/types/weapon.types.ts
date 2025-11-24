export enum WeaponType {
  FISTS = 'FISTS',
  SWORD = 'SWORD',
  AXE = 'AXE',
  DAGGER = 'DAGGER',
  BOW = 'BOW',
  STAFF = 'STAFF',
  SPEAR = 'SPEAR',
  MACE = 'MACE',
  SHIELD = 'SHIELD',
}

export interface Weapon {
  id: string;
  name: string;
  type: WeaponType;
  damage: number;
  range: number;
  speed: number; // Vitesse d'attaque
  modelPath?: string; // Chemin vers le modèle 3D
  equipped: boolean;
}

export interface WeaponState {
  currentWeapon: Weapon | null;
  weaponDrawn: boolean; // Arme sortie ou rangée
  availableWeapons: Weapon[];
  
  equipWeapon: (weapon: Weapon) => void;
  toggleWeapon: () => void; // Ranger/Sortir l'arme
  addWeapon: (weapon: Weapon) => void;
  removeWeapon: (weaponId: string) => void;
}
