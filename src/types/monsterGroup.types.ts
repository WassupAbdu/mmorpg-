import { Monster } from './monster.types';

export interface MonsterGroup {
  id: string;
  boss: Monster;
  minions: Monster[];
  position: {
    x: number;
    z: number;
  };
  radius: number;
}

export interface MonsterBoss extends Monster {
  isBoss: true;
  bossMultiplier: number;
}
