import { Character } from '../types/character.types';
import { Spell } from '../types/spell.types';
import { CombatAction, CombatLogEntry } from '../types/combat.types';
import { calculateDamage, calculateHealing, calculateInitiative, checkHit, applyDamage, applyHealing } from './damageCalculator';
import { isInRange } from './distanceCalculator';

/**
 * Détermine l'ordre des tours basé sur l'initiative
 */
export const determineTurnOrder = (characters: Character[]): string[] => {
  const initiativeMap = characters.map((char) => ({
    id: char.id,
    initiative: calculateInitiative(char),
  }));

  // Trier par initiative décroissante
  initiativeMap.sort((a, b) => b.initiative - a.initiative);

  return initiativeMap.map((entry) => entry.id);
};

/**
 * Vérifie si un personnage peut lancer un sort
 */
export const canCastSpell = (
  caster: Character,
  spell: Spell,
  target: Character
): { canCast: boolean; reason?: string } => {
  // Vérifier si le personnage est vivant
  if (!caster.isAlive) {
    return { canCast: false, reason: 'Le lanceur est mort' };
  }

  // Vérifier les PA
  if (caster.pa < spell.pa) {
    return { canCast: false, reason: 'Pas assez de PA' };
  }

  // Vérifier le cooldown
  if (spell.currentCooldown && spell.currentCooldown > 0) {
    return { canCast: false, reason: 'Sort en cooldown' };
  }

  // Vérifier la portée
  if (!isInRange(caster.position, target.position, spell.rangeMin, spell.rangeMax)) {
    return { canCast: false, reason: 'Cible hors de portée' };
  }

  // Pour les sorts de soin, vérifier si la cible est vivante
  if (spell.isHeal && !target.isAlive) {
    return { canCast: false, reason: 'Impossible de soigner un mort' };
  }

  // Pour les sorts offensifs, vérifier si la cible est vivante
  if (!spell.isHeal && !target.isAlive) {
    return { canCast: false, reason: 'La cible est déjà morte' };
  }

  return { canCast: true };
};

/**
 * Exécute une action de combat
 */
export const executeCombatAction = (
  caster: Character,
  target: Character,
  spell: Spell
): {
  updatedCaster: Character;
  updatedTarget: Character;
  action: CombatAction;
  logEntries: CombatLogEntry[];
} => {
  const logEntries: CombatLogEntry[] = [];
  let updatedTarget = { ...target };
  let damage = 0;
  let isCritical = false;

  // Vérifier si c'est un sort de soin
  if (spell.isHeal) {
    const healing = calculateHealing(caster, target, spell);
    updatedTarget = applyHealing(target, healing);
    
    logEntries.push({
      id: `log_${Date.now()}`,
      message: `${caster.name} soigne ${target.name} de ${healing} HP`,
      timestamp: Date.now(),
      type: 'heal',
    });
  } else {
    // Sort offensif
    // Vérifier si l'attaque touche
    if (!checkHit(caster, target)) {
      logEntries.push({
        id: `log_${Date.now()}`,
        message: `${caster.name} rate son attaque sur ${target.name}`,
        timestamp: Date.now(),
        type: 'miss',
      });
    } else {
      // Calculer les dégâts
      const damageResult = calculateDamage(caster, target, spell);
      damage = damageResult.damage;
      isCritical = damageResult.isCritical;

      // Appliquer les dégâts
      updatedTarget = applyDamage(target, damage);

      // Log de l'attaque
      if (isCritical) {
        logEntries.push({
          id: `log_${Date.now()}_crit`,
          message: `COUP CRITIQUE ! ${caster.name} inflige ${damage} dégâts à ${target.name} avec ${spell.name}`,
          timestamp: Date.now(),
          type: 'critical',
        });
      } else {
        logEntries.push({
          id: `log_${Date.now()}_dmg`,
          message: `${caster.name} inflige ${damage} dégâts à ${target.name} avec ${spell.name}`,
          timestamp: Date.now(),
          type: 'damage',
        });
      }

      // Si la cible meurt
      if (!updatedTarget.isAlive) {
        logEntries.push({
          id: `log_${Date.now()}_death`,
          message: `${target.name} est vaincu !`,
          timestamp: Date.now(),
          type: 'death',
        });
      }
    }
  }

  // Déduire les PA du lanceur
  const updatedCaster: Character = {
    ...caster,
    pa: caster.pa - spell.pa,
  };

  // Créer l'action
  const action: CombatAction = {
    actorId: caster.id,
    targetId: target.id,
    spell,
    damage,
    isCritical,
    timestamp: Date.now(),
  };

  return { updatedCaster, updatedTarget, action, logEntries };
};

/**
 * Vérifie si le combat est terminé
 */
export const isCombatOver = (characters: Character[]): {
  isOver: boolean;
  winners?: Character[];
} => {
  const aliveCharacters = characters.filter((char) => char.isAlive);
  
  if (aliveCharacters.length === 0) {
    return { isOver: true, winners: [] };
  }

  // Si tous les personnages vivants sont du même côté (joueur ou IA)
  const players = aliveCharacters.filter((char) => char.isPlayerControlled);
  const enemies = aliveCharacters.filter((char) => !char.isPlayerControlled);

  if (players.length === 0) {
    return { isOver: true, winners: enemies };
  }

  if (enemies.length === 0) {
    return { isOver: true, winners: players };
  }

  return { isOver: false };
};

/**
 * Génère un message de log pour le début d'un tour
 */
export const generateTurnStartLog = (character: Character, turnNumber: number): CombatLogEntry => {
  return {
    id: `log_turn_${turnNumber}_${character.id}`,
    message: `--- Tour ${turnNumber}: C'est au tour de ${character.name} ---`,
    timestamp: Date.now(),
    type: 'turn',
  };
};

/**
 * Calcule l'expérience gagnée après un combat
 */
export const calculateExperienceReward = (defeatedEnemies: Character[]): number => {
  return defeatedEnemies.reduce((total, enemy) => {
    // Base XP = niveau de l'ennemi * 10
    return total + enemy.level * 10;
  }, 0);
};
