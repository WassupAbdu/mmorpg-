import { Monster } from '../types/monster.types';
import { MonsterGroup, MonsterBoss } from '../types/monsterGroup.types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Crée un boss plus puissant qu'un monstre normal
 */
export function createBossMonster(baseMonster: Monster, multiplier: number = 1.3): MonsterBoss {
  const boss: MonsterBoss = {
    ...baseMonster,
    id: `boss-${uuidv4()}`,
    name: `Chef ${baseMonster.name}`,
    hp: Math.floor(baseMonster.hp * multiplier),
    maxHp: Math.floor(baseMonster.maxHp * multiplier),
    pa: baseMonster.pa + 2,
    pm: baseMonster.pm + 1,
    strength: Math.floor(baseMonster.strength * multiplier),
    intelligence: Math.floor(baseMonster.intelligence * multiplier),
    agility: Math.floor(baseMonster.agility * multiplier),
    vigor: Math.floor(baseMonster.vigor * multiplier),
    defense: Math.floor(baseMonster.defense * multiplier),
    isBoss: true,
    bossMultiplier: multiplier,
  };

  return boss;
}

/**
 * Crée un groupe de monstres avec un chef
 */
export function createMonsterGroup(
  baseMonster: Monster,
  groupSize: number = 4,
  centerX: number = 0,
  centerZ: number = 0,
  bossMultiplier: number = 1.3
): MonsterGroup {
  const boss = createBossMonster(baseMonster, bossMultiplier);
  const minions: Monster[] = [];

  // Créer les sous-fifres
  for (let i = 0; i < groupSize - 1; i++) {
    const minion: Monster = {
      ...baseMonster,
      id: `minion-${uuidv4()}`,
    };
    minions.push(minion);
  }

  // Positionner le groupe en cercle autour du centre
  const radius = 3;
  boss.position = { x: centerX, z: centerZ };

  const angleStep = (2 * Math.PI) / minions.length;
  minions.forEach((minion, index) => {
    const angle = angleStep * index;
    minion.position = {
      x: centerX + Math.cos(angle) * radius,
      z: centerZ + Math.sin(angle) * radius,
    };
  });

  return {
    id: `group-${uuidv4()}`,
    boss,
    minions,
    position: { x: centerX, z: centerZ },
    radius,
  };
}

/**
 * Génère plusieurs groupes de monstres sur la carte
 */
export function generateMonsterGroups(
  baseMonster: Monster,
  numGroups: number,
  mapSize: number = 50
): MonsterGroup[] {
  const groups: MonsterGroup[] = [];

  for (let i = 0; i < numGroups; i++) {
    const x = Math.random() * mapSize - mapSize / 2;
    const z = Math.random() * mapSize - mapSize / 2;
    const groupSize = Math.floor(Math.random() * 3) + 3; // 3 à 5 monstres
    const group = createMonsterGroup(baseMonster, groupSize, x, z);
    groups.push(group);
  }

  return groups;
}
