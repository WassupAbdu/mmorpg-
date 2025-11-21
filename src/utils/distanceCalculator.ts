import { Position } from '../types/character.types';

/**
 * Calcule la distance Manhattan entre deux positions sur une grille
 */
export const calculateDistance = (pos1: Position, pos2: Position): number => {
  return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.z - pos2.z);
};

/**
 * Vérifie si une position est dans la portée d'un sort
 */
export const isInRange = (
  casterPos: Position,
  targetPos: Position,
  rangeMin: number,
  rangeMax: number
): boolean => {
  const distance = calculateDistance(casterPos, targetPos);
  return distance >= rangeMin && distance <= rangeMax;
};

/**
 * Obtient toutes les positions dans un rayon donné (pour AoE)
 */
export const getPositionsInRadius = (
  center: Position,
  radius: number
): Position[] => {
  const positions: Position[] = [];

  for (let x = center.x - radius; x <= center.x + radius; x++) {
    for (let z = center.z - radius; z <= center.z + radius; z++) {
      const distance = calculateDistance(center, { x, z });
      if (distance <= radius) {
        positions.push({ x, z });
      }
    }
  }

  return positions;
};

/**
 * Vérifie si une position est valide sur la grille
 */
export const isValidPosition = (
  position: Position,
  gridSize: { width: number; height: number }
): boolean => {
  return (
    position.x >= 0 &&
    position.x < gridSize.width &&
    position.z >= 0 &&
    position.z < gridSize.height
  );
};

/**
 * Trouve le chemin le plus court entre deux positions (algorithme A* simplifié)
 */
export const findPath = (
  start: Position,
  end: Position,
  obstacles: Position[],
  maxDistance: number
): Position[] | null => {
  // Si la distance est trop grande, retourner null
  if (calculateDistance(start, end) > maxDistance) {
    return null;
  }

  // Pour simplifier, on utilise une approche directe
  // Dans une version plus avancée, on utiliserait A*
  const path: Position[] = [];
  let current = { ...start };

  while (current.x !== end.x || current.z !== end.z) {
    // Déplacement vers la cible
    if (current.x < end.x) current.x++;
    else if (current.x > end.x) current.x--;
    else if (current.z < end.z) current.z++;
    else if (current.z > end.z) current.z--;

    // Vérifier si la position est bloquée
    const isBlocked = obstacles.some(
      (obs) => obs.x === current.x && obs.z === current.z
    );

    if (isBlocked) {
      // Position bloquée, chercher une alternative
      return null;
    }

    path.push({ ...current });

    // Sécurité contre les boucles infinies
    if (path.length > maxDistance * 2) {
      return null;
    }
  }

  return path;
};

/**
 * Obtient les positions adjacentes à une position donnée
 */
export const getAdjacentPositions = (position: Position): Position[] => {
  return [
    { x: position.x + 1, z: position.z },
    { x: position.x - 1, z: position.z },
    { x: position.x, z: position.z + 1 },
    { x: position.x, z: position.z - 1 },
  ];
};
