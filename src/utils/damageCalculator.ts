import { Character, ElementType } from '../types/character.types';
import { Spell } from '../types/spell.types';

/**
 * Calcule les dégâts d'un sort
 */
export const calculateDamage = (
  caster: Character,
  target: Character,
  spell: Spell
): { damage: number; isCritical: boolean } => {
  // Dégâts de base aléatoires
  const baseDamage = Math.floor(
    Math.random() * (spell.damageMax - spell.damageMin + 1) + spell.damageMin
  );

  // Vérification du coup critique
  const isCritical = Math.random() < spell.critChance;
  let damage = baseDamage;

  if (isCritical) {
    damage *= 1.5; // Multiplicateur critique
  }

  // Modificateur basé sur les stats du lanceur
  const statModifier = getStatModifier(caster, spell.element);
  damage *= 1 + statModifier / 100;

  // Résistance de la cible
  const resistance = target.elementalResistance[spell.element] || 0;
  damage *= 1 - resistance;

  // Résistance générale à la magie pour les sorts magiques
  if (isMagicSpell(spell)) {
    damage *= 1 - target.magicResistance / 100;
  }

  // Arrondir au nombre entier
  damage = Math.floor(damage);

  // Minimum 1 dégât
  return { damage: Math.max(1, damage), isCritical };
};

/**
 * Obtient le modificateur de stat basé sur l'élément du sort
 */
const getStatModifier = (character: Character, element: ElementType): number => {
  switch (element) {
    case ElementType.EARTH:
      return character.strength * 0.5;
    case ElementType.FIRE:
      return character.intelligence * 0.5;
    case ElementType.AIR:
      return character.agility * 0.5;
    case ElementType.WATER:
      return character.luck * 0.5;
    case ElementType.LIGHT:
      return character.wisdom * 0.5;
    case ElementType.SHADOW:
    case ElementType.DARKNESS:
      return character.stealth * 0.5;
    case ElementType.ARCANE:
      return character.intelligence * 0.6;
    case ElementType.ICE:
      return character.intelligence * 0.4;
    case ElementType.ELECTRIC:
      return character.agility * 0.4;
    case ElementType.POISON:
      return character.agility * 0.3;
    case ElementType.STEALTH:
      return character.stealth * 0.6;
    default:
      return 0;
  }
};

/**
 * Détermine si un sort est magique
 */
const isMagicSpell = (spell: Spell): boolean => {
  const magicElements = [
    ElementType.FIRE,
    ElementType.ICE,
    ElementType.ELECTRIC,
    ElementType.ARCANE,
    ElementType.LIGHT,
    ElementType.DARKNESS,
  ];
  return magicElements.includes(spell.element);
};

/**
 * Calcule les soins d'un sort de soin
 */
export const calculateHealing = (
  caster: Character,
  target: Character,
  spell: Spell
): number => {
  // Soins de base
  let healing = Math.floor(
    Math.random() * (spell.damageMax - spell.damageMin + 1) + spell.damageMin
  );

  // Modificateur basé sur la sagesse
  const wisdomModifier = caster.wisdom * 0.5;
  healing *= 1 + wisdomModifier / 100;

  // Arrondir et s'assurer qu'on ne dépasse pas les HP max
  healing = Math.floor(healing);
  const actualHealing = Math.min(healing, target.maxHp - target.hp);

  return Math.max(0, actualHealing);
};

/**
 * Calcule l'initiative d'un personnage pour déterminer l'ordre des tours
 */
export const calculateInitiative = (character: Character): number => {
  // Base sur l'agilité avec un facteur aléatoire
  return character.agility + Math.random() * 20;
};

/**
 * Vérifie si une attaque touche ou rate
 */
export const checkHit = (attacker: Character, target: Character): boolean => {
  // Calcul basique : 95% de chance de toucher - esquive de la cible
  const baseHitChance = 95;
  const dodgeReduction = target.dodge * 0.5; // Chaque point d'esquive réduit de 0.5%
  const hitChance = Math.max(10, baseHitChance - dodgeReduction); // Min 10% de chance

  return Math.random() * 100 < hitChance;
};

/**
 * Applique les dégâts à une cible
 */
export const applyDamage = (target: Character, damage: number): Character => {
  const newHp = Math.max(0, target.hp - damage);
  return {
    ...target,
    hp: newHp,
    isAlive: newHp > 0,
  };
};

/**
 * Applique les soins à une cible
 */
export const applyHealing = (target: Character, healing: number): Character => {
  const newHp = Math.min(target.maxHp, target.hp + healing);
  return {
    ...target,
    hp: newHp,
  };
};

/**
 * Restaure les PA et PM d'un personnage au début de son tour
 */
export const restoreActionPoints = (character: Character): Character => {
  return {
    ...character,
    pa: character.maxPa,
    pm: character.maxPm,
  };
};
