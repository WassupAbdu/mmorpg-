---
applyTo: '**'
---

# Instructions pour le développement du MMORPG 3D - Combat Tour par Tour

## Stack Technique

**Framework & Langages:**
- React 18+ avec TypeScript
- Vite comme bundler
- Three.js pour le rendu 3D
- React Three Fiber (@react-three/fiber) pour l'intégration React/Three.js
- @react-three/drei pour les helpers 3D

**État & Styling:**
- Zustand pour la gestion d'état globale
- Tailwind CSS pour le styling

**Backend (Phase 2):**
- Node.js + Express pour le multijoueur
- WebSocket pour les communications temps réel

## Architecture du Projet

```
/src
  /components
    /3d
      - Character3D.tsx
      - GameGrid.tsx
      - Projectile.tsx
      - EffectParticles.tsx
    /ui
      - CombatUI.tsx
      - CharacterSheet.tsx
      - SpellBook.tsx
      - InventoryPanel.tsx
      - CombatLog.tsx
    /character
      - CharacterCreation.tsx
      - ClassSelection.tsx
  /stores
    - gameStore.ts (Zustand)
    - characterStore.ts
    - combatStore.ts
  /data
    - classes.ts
    - spells.ts
    - passiveSkills.ts
    - artifacts.ts
  /types
    - character.types.ts
    - spell.types.ts
    - combat.types.ts
  /utils
    - damageCalculator.ts
    - distanceCalculator.ts
    - combatLogic.ts
  /hooks
    - useCharacter.ts
    - useCombat.ts
  App.tsx
  main.tsx
```

## Spécifications du Jeu

### 1. Classes de Personnages

**7 Classes disponibles:**

1. **Guerrier**
   - Équipement: Arme à deux mains, armure lourde
   - Évolution: Maître guerrier
   - Bonus: +15% défense contre monstres
   - Couleur: #b91c1c (rouge foncé)

2. **Paladin**
   - Équipement: Arme à une main + bouclier ou lance à deux mains, armure lourde
   - Évolution: Paladin supérieur
   - Bonus: +15% attaque contre monstres
   - Couleur: #fbbf24 (or)

3. **Archer**
   - Équipement: Arc ou dagues, armure légère
   - Évolution: Héros Archer
   - Bonus: +15% agilité
   - Couleur: #10b981 (vert)

4. **Sorcier**
   - Équipement: Bâton ou grimoire, robe de mage/armure légère
   - Évolution: Haut mage
   - Bonus: +15% magie
   - Couleur: #8b5cf6 (violet)

5. **Clerc**
   - Équipement: Bâton ou sceptre, robe de mage/armure légère
   - Évolution: Maître soigneur
   - Bonus: +15% chance
   - Couleur: #f0f9ff (bleu clair)

6. **Voleur**
   - Équipement: Dagues doubles, armure légère
   - Évolution: Maître voleur
   - Bonus: +15% agilité
   - Couleur: #374151 (gris foncé)

7. **Assassin**
   - Équipement: Dagues uniques/doubles, armure légère ou lourde
   - Évolution: Chasseur de démons
   - Bonus: +15% furtivité
   - Couleur: #1f2937 (gris très foncé)

### 2. Système de Caractéristiques

**Stats de base:**
- Points de vie (HP)
- Magie (Mana)
- Vigueur
- Sagesse
- Force / Terre (influence dégâts Terre)
- Intelligence / Feu (influence dégâts Feu)
- Agilité / Vent (influence dégâts Air)
- Chance / Eau (influence dégâts Eau)
- Points d'actions (PA) - Base: 10
- Points de mouvements (PM) - Base: 5
- Furtivité
- Défense
- Esquive
- Résistance à la magie
- Résistance au corps à corps
- Résistance à distance
- Vitesse de déplacement

**Progression par niveau:**
- Niveau max: 100
- Gains par niveau: +10 HP, +10 Mana, +10 Vigueur
- Niveau 50: +1 PA permanent, +2 PM permanents
- Niveau 100: +1 PA permanent, +2 PM permanents

**Retour du Plus Fort:**
- Au niveau 100, possibilité de revenir au niveau 1
- Conservation des PA et PM bonus
- Répétable à l'infini

### 3. Système de Sorts

**Types d'éléments:**
- Terre, Feu, Air, Eau, Lumière, Ombre, Poison, Ténèbres, Arcane, Glace, Électrique

**Structure d'un sort:**
```typescript
interface Spell {
  name: string;
  pa: number; // Coût en points d'action
  critChance: number; // Probabilité de coup critique (ex: 0.02 = 1/50)
  damageMin: number;
  damageMax: number;
  element: ElementType;
  rangeMin: number; // Portée minimum
  rangeMax: number; // Portée maximum
  cooldown?: number; // Tour de recharge (optionnel)
  aoeRadius?: number; // Rayon d'effet de zone (optionnel)
}
```

### 4. Compétences Passives

**Structure d'une compétence passive:**
```typescript
interface PassiveSkill {
  name: string;
  description: string;
  levels: {
    level: number;
    bonus: number | string;
  }[];
  maxLevel: 5;
}
```

**Exemples:**
- Résistance Implacable: Réduction dégâts 2% à 10%
- Force Inépuisable: +Force 3% à 15%
- Maîtrise des Armes Lourdes: +Dégâts armes 2 mains 4% à 20%

### 5. Système de Combat Tour par Tour

**Mécanique de combat:**
1. Initiative détermine l'ordre des tours
2. Chaque personnage a PA et PM à dépenser
3. Les sorts coûtent des PA
4. Les déplacements coûtent des PM
5. Fin de tour restaure PA et PM au maximum

**Calcul des dégâts:**
```typescript
// Dégâts de base
baseDamage = random(spell.damageMin, spell.damageMax)

// Coup critique
if (random() < spell.critChance) {
  baseDamage *= 1.5 // ou 2.0 selon préférence
  isCritical = true
}

// Modificateurs de stats
damageModifier = 1 + (characterStat / 100) * statBonus

// Résistances de la cible
resistance = target.elementalResistance[spell.element] || 0

// Dégâts finaux
finalDamage = baseDamage * damageModifier * (1 - resistance)
```

**Calcul de distance:**
```typescript
// Distance Manhattan (grille)
distance = Math.abs(char1.x - char2.x) + Math.abs(char1.z - char2.z)
```

### 6. Système d'Équipement

**6 Artéfacts légendaires équipables:**
- Arme principale
- Armure
- Casque
- Gants
- Bottes
- Accessoire

**Familiers et Montures:**
- 1 familier OU 1 monture équipable
- Bonus passifs selon le type

### 7. Gestion des Personnages

**Création:**
- Nom personnalisé ou généré aléatoirement
- Sélection de classe
- Apparence visuelle (couleur, style)

**Suppression:**
- Le joueur peut supprimer un personnage à tout moment
- Confirmation requise

### 8. Interface Utilisateur

**Composants requis:**

1. **Écran de sélection de classe**
   - Affichage des 7 classes avec descriptions
   - Prévisualisation 3D du personnage
   - Statistiques de base

2. **HUD de combat**
   - Barres de HP/Mana
   - Compteur PA/PM
   - Liste des sorts disponibles
   - Journal de combat
   - Bouton "Terminer le tour"

3. **Feuille de personnage**
   - Toutes les caractéristiques
   - Sorts appris
   - Compétences passives
   - Équipement

4. **Inventaire**
   - Gestion des objets
   - Équipement des artéfacts
   - Familiers/Montures

### 9. Rendu 3D - Spécifications

**Caméra:**
- Vue isométrique / tactique
- OrbitControls pour rotation
- Zoom limité (min: 8, max: 20)
- Angle max: Math.PI / 2.5

**Grille de combat:**
- Grille 12x12 cases minimum
- Lignes visibles (couleur: #334155)
- Sol plat

**Représentation des personnages:**
- Cylindre coloré selon la classe
- Hauteur: 2 unités
- Rayon: 0.4 unités
- Animation de sélection (bounce)
- Nom au-dessus (Text de @react-three/drei)
- Barre de HP visible

**Effets visuels:**
- Particules pour les sorts
- Trails pour les projectiles
- Animation d'impact
- Effet de coup critique

**Éclairage:**
- ambientLight: intensité 0.5
- directionalLight: position [10, 10, 5], intensité 1
- pointLight: position [0, 5, 0], intensité 0.5, couleur #3b82f6

### 10. Gestion d'État avec Zustand

**Structure des stores:**

```typescript
// gameStore.ts
interface GameState {
  currentTurn: number;
  combatPhase: 'selection' | 'action' | 'animation' | 'end';
  combatLog: string[];
  addLogEntry: (entry: string) => void;
  nextTurn: () => void;
}

// characterStore.ts
interface CharacterState {
  characters: Character[];
  selectedCharacterId: string | null;
  addCharacter: (character: Character) => void;
  removeCharacter: (id: string) => void;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  selectCharacter: (id: string) => void;
}

// combatStore.ts
interface CombatState {
  selectedSpell: Spell | null;
  targetCharacterId: string | null;
  selectSpell: (spell: Spell) => void;
  selectTarget: (id: string) => void;
  executeAction: () => void;
  clearSelection: () => void;
}
```

### 11. Fonctionnalités Prioritaires (Phase 1)

**MVP (Minimum Viable Product):**
1. ✅ Création de personnage avec sélection de classe
2. ✅ Affichage 3D des personnages sur grille
3. ✅ Système de combat tour par tour fonctionnel
4. ✅ Lancement de sorts avec calcul de dégâts
5. ✅ Gestion PA/PM
6. ✅ Journal de combat
7. ✅ Interface utilisateur complète

**Phase 2 (Extensions):**
1. Système de déplacement sur la grille
2. Animations des sorts et projectiles
3. Système d'inventaire et équipement
4. Compétences passives
5. Système de progression/XP
6. Artéfacts légendaires
7. Familiers et montures

**Phase 3 (Multijoueur):**
1. Backend Node.js + Express
2. WebSocket pour temps réel
3. Matchmaking
4. Combat PvP
5. Guildes

### 12. Liste Complète des Sorts (Référence)

#### Guerrier
1. Frappe du Colosse: 4 PA, 1/50 crit, 16-28 Terre, portée 1-2
2. Coup de Titan: 3 PA, 1/35 crit, 12-22 Terre, portée 1-3
3. Écrasement de l'Enclume: 5 PA, 1/30 crit, 18-34 Feu, portée 1
4. Coup de Foudre: 4 PA, 1/40 crit, 14-26 Air, portée 1-2
5. Furie du Berserker: 6 PA, 1/25 crit, 24-40 Terre, portée 1
6. Charge de la Montagne: 3 PA, 1/40 crit, 10-20 Terre, portée 2-4
7. Frappe de la Tempête: 4 PA, 1/30 crit, 15-27 Eau, portée 1-2
8. Déferlement du Géant: 5 PA, 1/20 crit, 20-35 Terre, portée 1-3
9. Lame du Cataclysme: 6 PA, 1/15 crit, 28-46 Feu, portée 1
10. Assaut du Destructeur: 7 PA, 1/10 crit, 34-50 Terre, portée 1

#### Paladin
1. Lame du Ciel: 3 PA, 1/40 crit, 12-20 Lumière, portée 1-2
2. Choc de la Foi: 4 PA, 1/35 crit, 14-25 Lumière, portée 1-3
3. Charge du Croisé: 5 PA, 1/30 crit, 20-32 Terre, portée 1
4. Lumière Divine: 2 PA, 1/50 crit, 8-15 Lumière, portée 3-5
5. Frappe Sacrée: 4 PA, 1/35 crit, 15-28 Feu, portée 1-2
6. Marteau de la Justice: 6 PA, 1/20 crit, 22-40 Lumière, portée 1-3
7. Éclair du Protecteur: 3 PA, 1/45 crit, 10-18 Lumière, portée 2-4
8. Lance du Jugement: 5 PA, 1/25 crit, 18-34 Lumière, portée 1-4
9. Rempart des Cieux: 4 PA, 1/30 crit, 14-27 Terre, portée 1-2
10. Flèche de la Vertu: 2 PA, 1/40 crit, 8-16 Lumière, portée 3-6

#### Archer
1. Pluie de Flèches: 4 PA, 1/50 crit, 14-24 Air, portée 3-5
2. Tir du Faucon: 3 PA, 1/30 crit, 10-18 Air, portée 4-7
3. Tempête de Dagues: 4 PA, 1/35 crit, 15-26 Feu, portée 1-2
4. Œil du Lynx: 2 PA, 1/40 crit, 8-15 Air, portée 5-8
5. Flèche de Givre: 3 PA, 1/35 crit, 12-20 Glace, portée 3-6
6. Tir à l'Aurore: 5 PA, 1/25 crit, 18-30 Lumière, portée 4-6
7. Vague de Vent: 3 PA, 1/40 crit, 10-19 Air, portée 3-5
8. Visée Implacable: 6 PA, 1/15 crit, 22-40 Air, portée 5-7
9. Flèche du Tonnerre: 4 PA, 1/30 crit, 16-28 Électrique, portée 3-5
10. Éclair Céleste: 2 PA, 1/45 crit, 7-14 Lumière, portée 4-8

#### Sorcier
1. Explosion Arcanique: 5 PA, 1/30 crit, 20-35 Arcane, portée 2-4
2. Souffle du Dragon: 6 PA, 1/25 crit, 24-40 Feu, portée 1
3. Tempête de Feu: 7 PA, 1/20 crit, 30-48 Feu, portée 2-3
4. Vortex de Glace: 4 PA, 1/35 crit, 15-27 Glace, portée 2-5
5. Pluie de Météores: 8 PA, 1/15 crit, 34-55 Feu, portée 3-5
6. Chaine de Foudre: 6 PA, 1/25 crit, 22-38 Électrique, portée 2-4
7. Malédiction des Ombres: 3 PA, 1/40 crit, 12-20 Ténèbres, portée 1-3
8. Flamme du Phénix: 5 PA, 1/30 crit, 18-32 Feu, portée 2-4
9. Éclair Mystique: 4 PA, 1/35 crit, 14-26 Arcane, portée 3-5
10. Rafale de Cristal: 3 PA, 1/40 crit, 12-22 Glace, portée 2-5

#### Clerc
1. Bénédiction de Lumière: 2 PA, 1/45 crit, 8-15 Lumière, portée 3-5
2. Choc de Sanctification: 4 PA, 1/35 crit, 14-26 Lumière, portée 2-4
3. Onde de Vie: 3 PA, 1/40 crit, 12-20 Eau, portée 3-6
4. Jugement des Cieux: 5 PA, 1/30 crit, 18-34 Lumière, portée 1-3
5. Soin Miraculeux: 3 PA, 1/35 crit, 15-25 soins, portée 2-4
6. Invocation du Gardien: 6 PA, 1/25 crit, 20-40 Lumière, portée 1-2
7. Éclat du Cœur: 2 PA, 1/45 crit, 8-14 Lumière, portée 3-5
8. Vague de Sérénité: 4 PA, 1/35 crit, 14-28 soins, portée 2-5
9. Bénédiction de l'Ange: 5 PA, 1/30 crit, 18-32 Lumière, portée 1-3
10. Réveil Divin: 7 PA, 1/20 crit, 26-40 soins, portée 2-3

#### Voleur
1. Assaut du Serpent: 3 PA, 1/35 crit, 12-20 Poison, portée 1-2
2. Frappe Fantôme: 4 PA, 1/30 crit, 15-28 Ombre, portée 1-3
3. Lame de l'Ombre: 5 PA, 1/25 crit, 18-34 Ténèbres, portée 1
4. Coup de Scorpion: 3 PA, 1/35 crit, 12-24 Poison, portée 1-3
5. Danse des Lames: 4 PA, 1/30 crit, 14-26 Feu, portée 1-2
6. Embuscade Rapide: 2 PA, 1/45 crit, 8-15 Terre, portée 1-3
7. Coup Fourbe: 3 PA, 1/40 crit, 12-22 Ombre, portée 1
8. Rafale de l'Éclair: 5 PA, 1/25 crit, 20-35 Électrique, portée 1-3
9. Lame Venimeuse: 4 PA, 1/35 crit, 16-30 Poison, portée 1
10. Furtivité Mortelle: 6 PA, 1/20 crit, 24-42 Ténèbres, portée 1

#### Assassin
1. Coup de l'Ombre: 4 PA, 1/30 crit, 15-28 Ombre, portée 1-2
2. Danse du Démon: 6 PA, 1/25 crit, 22-40 Feu, portée 1
3. Lame Spectrale: 5 PA, 1/25 crit, 18-34 Ténèbres, portée 1-3
4. Coup de la Nuit: 3 PA, 1/35 crit, 12-22 Ombre, portée 1-3
5. Assaut Silencieux: 4 PA, 1/30 crit, 14-27 Furtivité, portée 1
6. Cœur de la Lame: 5 PA, 1/25 crit, 18-32 Terre, portée 1
7. Lame de Sang: 6 PA, 1/20 crit, 24-40 Ombre, portée 1-2
8. Embuscade du Prédateur: 3 PA, 1/35 crit, 12-24 Feu, portée 1-3
9. Poignard Maudit: 4 PA, 1/30 crit, 16-30 Ténèbres, portée 1-2
10. Saut Mortel: 7 PA, 1/15 crit, 30-50 Terre, portée 1

### 13. Bonnes Pratiques de Code

**TypeScript:**
- Types stricts activés
- Pas de `any`
- Interfaces pour toutes les structures de données
- Enums pour les constantes

**React:**
- Composants fonctionnels uniquement
- Hooks personnalisés pour la logique réutilisable
- Mémoisation avec `useMemo` et `useCallback` si nécessaire
- Props typées

**Three.js:**
- Utiliser @react-three/drei au maximum
- Optimiser les géométries (réutilisation)
- Limiter les re-renders avec `useFrame` judicieusement
- Disposer des ressources inutilisées

**Performance:**
- Lazy loading des composants lourds
- Virtualisation pour les grandes listes
- Debounce pour les inputs
- Throttle pour les événements fréquents

### 14. Commandes de Développement

```bash
# Installation
npm install

# Développement
npm run dev

# Build
npm run build

# Preview du build
npm run preview

# Linting
npm run lint

# Tests (à ajouter)
npm run test
```

### 15. Dépendances Principales

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "three": "^0.160.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.92.0",
    "zustand": "^4.4.7"
  },
  "devDependencies": {
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.0",
    "@types/three": "^0.160.0",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.8",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

---

## Notes Importantes pour l'Agent

1. **Priorité sur le TypeScript**: Tous les fichiers doivent être typés strictement
2. **Pas de localStorage**: Les artifacts Claude.ai ne supportent pas localStorage, utiliser Zustand pour la persistence
3. **Optimisation 3D**: Limiter les objets 3D complexes pour les performances navigateur
4. **Mobile-first**: Penser responsive dès le départ
5. **Accessibilité**: Ajouter les attributs ARIA appropriés
6. **Commentaires**: Documenter les fonctions complexes, surtout les calculs de combat
7. **Tests**: Prévoir des tests unitaires pour les fonctions utilitaires (calculs de dégâts, distance, etc.)

## Références Utiles

- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Dernière mise à jour:** 2025-01-21  
**Version:** 1.0.0