import { Spell } from '../types/spell.types';
import { CharacterClass, ElementType } from '../types/character.types';

// Sorts du Guerrier
const WARRIOR_SPELLS: Spell[] = [
  { id: 'war_1', name: 'Frappe du Colosse', pa: 4, critChance: 1/50, damageMin: 16, damageMax: 28, element: ElementType.EARTH, rangeMin: 1, rangeMax: 2, description: 'Un coup puissant qui ébranle le sol.' },
  { id: 'war_2', name: 'Coup de Titan', pa: 3, critChance: 1/35, damageMin: 12, damageMax: 22, element: ElementType.EARTH, rangeMin: 1, rangeMax: 3, description: 'Frappe avec la force d\'un titan.' },
  { id: 'war_3', name: 'Écrasement de l\'Enclume', pa: 5, critChance: 1/30, damageMin: 18, damageMax: 34, element: ElementType.FIRE, rangeMin: 1, rangeMax: 1, description: 'Écrase l\'ennemi avec une force brûlante.' },
  { id: 'war_4', name: 'Coup de Foudre', pa: 4, critChance: 1/40, damageMin: 14, damageMax: 26, element: ElementType.AIR, rangeMin: 1, rangeMax: 2, description: 'Frappe rapide comme l\'éclair.' },
  { id: 'war_5', name: 'Furie du Berserker', pa: 6, critChance: 1/25, damageMin: 24, damageMax: 40, element: ElementType.EARTH, rangeMin: 1, rangeMax: 1, description: 'Déchaîne une fureur incontrôlable.' },
  { id: 'war_6', name: 'Charge de la Montagne', pa: 3, critChance: 1/40, damageMin: 10, damageMax: 20, element: ElementType.EARTH, rangeMin: 2, rangeMax: 4, description: 'Charge avec l\'élan d\'une montagne.' },
  { id: 'war_7', name: 'Frappe de la Tempête', pa: 4, critChance: 1/30, damageMin: 15, damageMax: 27, element: ElementType.WATER, rangeMin: 1, rangeMax: 2, description: 'Frappe avec la force d\'une tempête.' },
  { id: 'war_8', name: 'Déferlement du Géant', pa: 5, critChance: 1/20, damageMin: 20, damageMax: 35, element: ElementType.EARTH, rangeMin: 1, rangeMax: 3, description: 'Déferle comme un géant en colère.' },
  { id: 'war_9', name: 'Lame du Cataclysme', pa: 6, critChance: 1/15, damageMin: 28, damageMax: 46, element: ElementType.FIRE, rangeMin: 1, rangeMax: 1, description: 'Une lame qui apporte le cataclysme.' },
  { id: 'war_10', name: 'Assaut du Destructeur', pa: 7, critChance: 1/10, damageMin: 34, damageMax: 50, element: ElementType.EARTH, rangeMin: 1, rangeMax: 1, description: 'L\'assaut ultime du destructeur.' },
];

// Sorts du Paladin
const PALADIN_SPELLS: Spell[] = [
  { id: 'pal_1', name: 'Lame du Ciel', pa: 3, critChance: 1/40, damageMin: 12, damageMax: 20, element: ElementType.LIGHT, rangeMin: 1, rangeMax: 2, description: 'Une lame bénie par les cieux.' },
  { id: 'pal_2', name: 'Choc de la Foi', pa: 4, critChance: 1/35, damageMin: 14, damageMax: 25, element: ElementType.LIGHT, rangeMin: 1, rangeMax: 3, description: 'Un choc rempli de foi divine.' },
  { id: 'pal_3', name: 'Charge du Croisé', pa: 5, critChance: 1/30, damageMin: 20, damageMax: 32, element: ElementType.EARTH, rangeMin: 1, rangeMax: 1, description: 'Charge héroïque du croisé.' },
  { id: 'pal_4', name: 'Lumière Divine', pa: 2, critChance: 1/50, damageMin: 8, damageMax: 15, element: ElementType.LIGHT, rangeMin: 3, rangeMax: 5, description: 'Projectile de lumière pure.' },
  { id: 'pal_5', name: 'Frappe Sacrée', pa: 4, critChance: 1/35, damageMin: 15, damageMax: 28, element: ElementType.FIRE, rangeMin: 1, rangeMax: 2, description: 'Frappe sanctifiée par le feu sacré.' },
  { id: 'pal_6', name: 'Marteau de la Justice', pa: 6, critChance: 1/20, damageMin: 22, damageMax: 40, element: ElementType.LIGHT, rangeMin: 1, rangeMax: 3, description: 'Le marteau qui rend justice.' },
  { id: 'pal_7', name: 'Éclair du Protecteur', pa: 3, critChance: 1/45, damageMin: 10, damageMax: 18, element: ElementType.LIGHT, rangeMin: 2, rangeMax: 4, description: 'Éclair protecteur.' },
  { id: 'pal_8', name: 'Lance du Jugement', pa: 5, critChance: 1/25, damageMin: 18, damageMax: 34, element: ElementType.LIGHT, rangeMin: 1, rangeMax: 4, description: 'Lance qui juge les impies.' },
  { id: 'pal_9', name: 'Rempart des Cieux', pa: 4, critChance: 1/30, damageMin: 14, damageMax: 27, element: ElementType.EARTH, rangeMin: 1, rangeMax: 2, description: 'Protection céleste.' },
  { id: 'pal_10', name: 'Flèche de la Vertu', pa: 2, critChance: 1/40, damageMin: 8, damageMax: 16, element: ElementType.LIGHT, rangeMin: 3, rangeMax: 6, description: 'Flèche de lumière vertueuse.' },
];

// Sorts de l'Archer
const ARCHER_SPELLS: Spell[] = [
  { id: 'arc_1', name: 'Pluie de Flèches', pa: 4, critChance: 1/50, damageMin: 14, damageMax: 24, element: ElementType.AIR, rangeMin: 3, rangeMax: 5, aoeRadius: 2, description: 'Une pluie de flèches mortelles.' },
  { id: 'arc_2', name: 'Tir du Faucon', pa: 3, critChance: 1/30, damageMin: 10, damageMax: 18, element: ElementType.AIR, rangeMin: 4, rangeMax: 7, description: 'Tir précis comme un faucon.' },
  { id: 'arc_3', name: 'Tempête de Dagues', pa: 4, critChance: 1/35, damageMin: 15, damageMax: 26, element: ElementType.FIRE, rangeMin: 1, rangeMax: 2, description: 'Lancer multiple de dagues enflammées.' },
  { id: 'arc_4', name: 'Œil du Lynx', pa: 2, critChance: 1/40, damageMin: 8, damageMax: 15, element: ElementType.AIR, rangeMin: 5, rangeMax: 8, description: 'Tir de très longue portée.' },
  { id: 'arc_5', name: 'Flèche de Givre', pa: 3, critChance: 1/35, damageMin: 12, damageMax: 20, element: ElementType.ICE, rangeMin: 3, rangeMax: 6, description: 'Flèche glacée qui ralentit.' },
  { id: 'arc_6', name: 'Tir à l\'Aurore', pa: 5, critChance: 1/25, damageMin: 18, damageMax: 30, element: ElementType.LIGHT, rangeMin: 4, rangeMax: 6, description: 'Tir lumineux au lever du jour.' },
  { id: 'arc_7', name: 'Vague de Vent', pa: 3, critChance: 1/40, damageMin: 10, damageMax: 19, element: ElementType.AIR, rangeMin: 3, rangeMax: 5, description: 'Vague d\'air tranchant.' },
  { id: 'arc_8', name: 'Visée Implacable', pa: 6, critChance: 1/15, damageMin: 22, damageMax: 40, element: ElementType.AIR, rangeMin: 5, rangeMax: 7, description: 'Tir impossible à esquiver.' },
  { id: 'arc_9', name: 'Flèche du Tonnerre', pa: 4, critChance: 1/30, damageMin: 16, damageMax: 28, element: ElementType.ELECTRIC, rangeMin: 3, rangeMax: 5, description: 'Flèche chargée d\'électricité.' },
  { id: 'arc_10', name: 'Éclair Céleste', pa: 2, critChance: 1/45, damageMin: 7, damageMax: 14, element: ElementType.LIGHT, rangeMin: 4, rangeMax: 8, description: 'Éclair de lumière rapide.' },
];

// Sorts du Sorcier
const SORCERER_SPELLS: Spell[] = [
  { id: 'sor_1', name: 'Explosion Arcanique', pa: 5, critChance: 1/30, damageMin: 20, damageMax: 35, element: ElementType.ARCANE, rangeMin: 2, rangeMax: 4, aoeRadius: 1, description: 'Explosion de magie pure.' },
  { id: 'sor_2', name: 'Souffle du Dragon', pa: 6, critChance: 1/25, damageMin: 24, damageMax: 40, element: ElementType.FIRE, rangeMin: 1, rangeMax: 1, aoeRadius: 2, description: 'Souffle de feu dévastateur.' },
  { id: 'sor_3', name: 'Tempête de Feu', pa: 7, critChance: 1/20, damageMin: 30, damageMax: 48, element: ElementType.FIRE, rangeMin: 2, rangeMax: 3, aoeRadius: 2, description: 'Tempête de flammes destructrice.' },
  { id: 'sor_4', name: 'Vortex de Glace', pa: 4, critChance: 1/35, damageMin: 15, damageMax: 27, element: ElementType.ICE, rangeMin: 2, rangeMax: 5, description: 'Vortex de glace mortelle.' },
  { id: 'sor_5', name: 'Pluie de Météores', pa: 8, critChance: 1/15, damageMin: 34, damageMax: 55, element: ElementType.FIRE, rangeMin: 3, rangeMax: 5, aoeRadius: 3, description: 'Invoque une pluie de météores.' },
  { id: 'sor_6', name: 'Chaine de Foudre', pa: 6, critChance: 1/25, damageMin: 22, damageMax: 38, element: ElementType.ELECTRIC, rangeMin: 2, rangeMax: 4, description: 'Éclair qui rebondit entre les cibles.' },
  { id: 'sor_7', name: 'Malédiction des Ombres', pa: 3, critChance: 1/40, damageMin: 12, damageMax: 20, element: ElementType.DARKNESS, rangeMin: 1, rangeMax: 3, description: 'Malédiction ténébreuse.' },
  { id: 'sor_8', name: 'Flamme du Phénix', pa: 5, critChance: 1/30, damageMin: 18, damageMax: 32, element: ElementType.FIRE, rangeMin: 2, rangeMax: 4, description: 'Flamme renaissante du phénix.' },
  { id: 'sor_9', name: 'Éclair Mystique', pa: 4, critChance: 1/35, damageMin: 14, damageMax: 26, element: ElementType.ARCANE, rangeMin: 3, rangeMax: 5, description: 'Éclair de magie arcanique.' },
  { id: 'sor_10', name: 'Rafale de Cristal', pa: 3, critChance: 1/40, damageMin: 12, damageMax: 22, element: ElementType.ICE, rangeMin: 2, rangeMax: 5, description: 'Projectiles de cristaux de glace.' },
];

// Sorts du Clerc
const CLERIC_SPELLS: Spell[] = [
  { id: 'cle_1', name: 'Bénédiction de Lumière', pa: 2, critChance: 1/45, damageMin: 8, damageMax: 15, element: ElementType.LIGHT, rangeMin: 3, rangeMax: 5, description: 'Lumière bénite qui blesse les ténèbres.' },
  { id: 'cle_2', name: 'Choc de Sanctification', pa: 4, critChance: 1/35, damageMin: 14, damageMax: 26, element: ElementType.LIGHT, rangeMin: 2, rangeMax: 4, description: 'Choc de lumière sanctifiée.' },
  { id: 'cle_3', name: 'Onde de Vie', pa: 3, critChance: 1/40, damageMin: 12, damageMax: 20, element: ElementType.WATER, rangeMin: 3, rangeMax: 6, description: 'Onde d\'eau vivifiante.' },
  { id: 'cle_4', name: 'Jugement des Cieux', pa: 5, critChance: 1/30, damageMin: 18, damageMax: 34, element: ElementType.LIGHT, rangeMin: 1, rangeMax: 3, description: 'Jugement divin qui frappe les impies.' },
  { id: 'cle_5', name: 'Soin Miraculeux', pa: 3, critChance: 1/35, damageMin: 15, damageMax: 25, element: ElementType.LIGHT, rangeMin: 2, rangeMax: 4, isHeal: true, description: 'Soins miraculeux.' },
  { id: 'cle_6', name: 'Invocation du Gardien', pa: 6, critChance: 1/25, damageMin: 20, damageMax: 40, element: ElementType.LIGHT, rangeMin: 1, rangeMax: 2, description: 'Invoque un gardien céleste.' },
  { id: 'cle_7', name: 'Éclat du Cœur', pa: 2, critChance: 1/45, damageMin: 8, damageMax: 14, element: ElementType.LIGHT, rangeMin: 3, rangeMax: 5, description: 'Éclat de lumière pure.' },
  { id: 'cle_8', name: 'Vague de Sérénité', pa: 4, critChance: 1/35, damageMin: 14, damageMax: 28, element: ElementType.WATER, rangeMin: 2, rangeMax: 5, isHeal: true, description: 'Vague apaisante qui soigne.' },
  { id: 'cle_9', name: 'Bénédiction de l\'Ange', pa: 5, critChance: 1/30, damageMin: 18, damageMax: 32, element: ElementType.LIGHT, rangeMin: 1, rangeMax: 3, description: 'Bénédiction angélique puissante.' },
  { id: 'cle_10', name: 'Réveil Divin', pa: 7, critChance: 1/20, damageMin: 26, damageMax: 40, element: ElementType.LIGHT, rangeMin: 2, rangeMax: 3, isHeal: true, description: 'Réveil divin qui restaure la vie.' },
];

// Sorts du Voleur
const THIEF_SPELLS: Spell[] = [
  { id: 'thi_1', name: 'Assaut du Serpent', pa: 3, critChance: 1/35, damageMin: 12, damageMax: 20, element: ElementType.POISON, rangeMin: 1, rangeMax: 2, description: 'Frappe empoisonnée rapide.' },
  { id: 'thi_2', name: 'Frappe Fantôme', pa: 4, critChance: 1/30, damageMin: 15, damageMax: 28, element: ElementType.SHADOW, rangeMin: 1, rangeMax: 3, description: 'Frappe invisible comme un fantôme.' },
  { id: 'thi_3', name: 'Lame de l\'Ombre', pa: 5, critChance: 1/25, damageMin: 18, damageMax: 34, element: ElementType.DARKNESS, rangeMin: 1, rangeMax: 1, description: 'Lame forgée dans les ombres.' },
  { id: 'thi_4', name: 'Coup de Scorpion', pa: 3, critChance: 1/35, damageMin: 12, damageMax: 24, element: ElementType.POISON, rangeMin: 1, rangeMax: 3, description: 'Coup venimeux du scorpion.' },
  { id: 'thi_5', name: 'Danse des Lames', pa: 4, critChance: 1/30, damageMin: 14, damageMax: 26, element: ElementType.FIRE, rangeMin: 1, rangeMax: 2, description: 'Danse mortelle de lames enflammées.' },
  { id: 'thi_6', name: 'Embuscade Rapide', pa: 2, critChance: 1/45, damageMin: 8, damageMax: 15, element: ElementType.EARTH, rangeMin: 1, rangeMax: 3, description: 'Embuscade furtive.' },
  { id: 'thi_7', name: 'Coup Fourbe', pa: 3, critChance: 1/40, damageMin: 12, damageMax: 22, element: ElementType.SHADOW, rangeMin: 1, rangeMax: 1, description: 'Coup traître depuis les ombres.' },
  { id: 'thi_8', name: 'Rafale de l\'Éclair', pa: 5, critChance: 1/25, damageMin: 20, damageMax: 35, element: ElementType.ELECTRIC, rangeMin: 1, rangeMax: 3, description: 'Série de coups électriques.' },
  { id: 'thi_9', name: 'Lame Venimeuse', pa: 4, critChance: 1/35, damageMin: 16, damageMax: 30, element: ElementType.POISON, rangeMin: 1, rangeMax: 1, description: 'Lame enduite de poison mortel.' },
  { id: 'thi_10', name: 'Furtivité Mortelle', pa: 6, critChance: 1/20, damageMin: 24, damageMax: 42, element: ElementType.DARKNESS, rangeMin: 1, rangeMax: 1, description: 'Frappe furtive dévastatrice.' },
];

// Sorts de l'Assassin
const ASSASSIN_SPELLS: Spell[] = [
  { id: 'ass_1', name: 'Coup de l\'Ombre', pa: 4, critChance: 1/30, damageMin: 15, damageMax: 28, element: ElementType.SHADOW, rangeMin: 1, rangeMax: 2, description: 'Coup surgissant des ombres.' },
  { id: 'ass_2', name: 'Danse du Démon', pa: 6, critChance: 1/25, damageMin: 22, damageMax: 40, element: ElementType.FIRE, rangeMin: 1, rangeMax: 1, description: 'Danse démoniaque destructrice.' },
  { id: 'ass_3', name: 'Lame Spectrale', pa: 5, critChance: 1/25, damageMin: 18, damageMax: 34, element: ElementType.DARKNESS, rangeMin: 1, rangeMax: 3, description: 'Lame d\'énergie spectrale.' },
  { id: 'ass_4', name: 'Coup de la Nuit', pa: 3, critChance: 1/35, damageMin: 12, damageMax: 22, element: ElementType.SHADOW, rangeMin: 1, rangeMax: 3, description: 'Frappe de la nuit éternelle.' },
  { id: 'ass_5', name: 'Assaut Silencieux', pa: 4, critChance: 1/30, damageMin: 14, damageMax: 27, element: ElementType.STEALTH, rangeMin: 1, rangeMax: 1, description: 'Assaut totalement silencieux.' },
  { id: 'ass_6', name: 'Cœur de la Lame', pa: 5, critChance: 1/25, damageMin: 18, damageMax: 32, element: ElementType.EARTH, rangeMin: 1, rangeMax: 1, description: 'Frappe directe au cœur.' },
  { id: 'ass_7', name: 'Lame de Sang', pa: 6, critChance: 1/20, damageMin: 24, damageMax: 40, element: ElementType.SHADOW, rangeMin: 1, rangeMax: 2, description: 'Lame assoiffée de sang.' },
  { id: 'ass_8', name: 'Embuscade du Prédateur', pa: 3, critChance: 1/35, damageMin: 12, damageMax: 24, element: ElementType.FIRE, rangeMin: 1, rangeMax: 3, description: 'Embuscade féroce du prédateur.' },
  { id: 'ass_9', name: 'Poignard Maudit', pa: 4, critChance: 1/30, damageMin: 16, damageMax: 30, element: ElementType.DARKNESS, rangeMin: 1, rangeMax: 2, description: 'Poignard portant une malédiction.' },
  { id: 'ass_10', name: 'Saut Mortel', pa: 7, critChance: 1/15, damageMin: 30, damageMax: 50, element: ElementType.EARTH, rangeMin: 1, rangeMax: 1, description: 'Saut meurtrier dévastateur.' },
];

export const SPELLS_BY_CLASS: Record<CharacterClass, Spell[]> = {
  [CharacterClass.WARRIOR]: WARRIOR_SPELLS,
  [CharacterClass.PALADIN]: PALADIN_SPELLS,
  [CharacterClass.ARCHER]: ARCHER_SPELLS,
  [CharacterClass.SORCERER]: SORCERER_SPELLS,
  [CharacterClass.CLERIC]: CLERIC_SPELLS,
  [CharacterClass.THIEF]: THIEF_SPELLS,
  [CharacterClass.ASSASSIN]: ASSASSIN_SPELLS,
};

export const ALL_SPELLS: Spell[] = [
  ...WARRIOR_SPELLS,
  ...PALADIN_SPELLS,
  ...ARCHER_SPELLS,
  ...SORCERER_SPELLS,
  ...CLERIC_SPELLS,
  ...THIEF_SPELLS,
  ...ASSASSIN_SPELLS,
];
