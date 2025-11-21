# ⚔️ MMORPG 3D - Combat Tour par Tour

Un MMORPG 3D innovant en tour par tour, développé avec React, Three.js et TypeScript. Explorez un monde immense, affrontez des dizaines de monstres uniques et maîtrisez les 7 classes de personnages disponibles !

![MMORPG Banner](https://img.shields.io/badge/Status-Alpha-yellow) ![React](https://img.shields.io/badge/React-18.3-blue) ![Three.js](https://img.shields.io/badge/Three.js-0.160-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

## 🎮 Fonctionnalités Principales

### ✨ Système d'Authentification
- Login/Register avec email et mot de passe
- Support OAuth avec Google et GitHub (préparé)
- Interface moderne et responsive

### 🏰 Monde 3D Immense
- **Carte de 100x100 cases** avec rendu 3D complet
- Caméra orbital contrôlable (zoom, rotation, panoramique)
- Plus de **50 types de monstres uniques** avec IA
- Système de spawn dynamique

### ⚔️ 7 Classes de Personnages
1. **Guerrier** - Maître du combat rapproché (+15% défense)
2. **Paladin** - Champion de la lumière (+15% attaque)
3. **Archer** - Expert du combat à distance (+15% agilité)
4. **Sorcier** - Maître des arcanes (+15% magie)
5. **Clerc** - Prêtre soigneur (+15% chance)
6. **Voleur** - Ombre de la nuit (+15% agilité)
7. **Assassin** - Tueur silencieux (+15% furtivité)

### 🔮 70 Sorts Uniques
- 10 sorts par classe
- Éléments variés : Terre, Feu, Air, Eau, Lumière, Ombre, Poison, etc.
- Système de coups critiques
- Portées et coûts en PA différents

### 💥 Combat Tour par Tour Tactique
- Initiative basée sur l'agilité
- Système de PA (Points d'Action) et PM (Points de Mouvement)
- Calcul avancé des dégâts avec résistances élémentaires
- Journal de combat en temps réel
- Interface HUD complète

### 👾 Plus de 50 Monstres
Différentes raretés et niveaux :
- **Communs** : Gobelins, Loups, Slimes (Niv 1-10)
- **Peu communs** : Orcs, Squelettes, Ours (Niv 11-20)
- **Rares** : Trolls, Vampires, Minotaures (Niv 21-40)
- **Élites** : Golems, Démons, Liches (Niv 41-60)
- **Boss** : Dragons, Phénix, Krakens (Niv 61-80)
- **Légendaires** : Spectres, Basilics, Griffons (Niv 81-100)

## 🚀 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Étapes

```bash
# Cloner le repository
git clone https://github.com/WassupAbdu/mmorpg-.git
cd mmorpg-

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Build pour production
npm run build

# Preview du build
npm run preview
```

## 📁 Structure du Projet

```
/src
  /components
    /3d              # Composants Three.js
      - Character3D.tsx
      - Monster3D.tsx
      - GameGrid.tsx
      - Projectile.tsx
      - EffectParticles.tsx
    /ui              # Interface utilisateur
      - CombatUI.tsx
    /character
      - ClassSelection.tsx
    /auth
      - LoginRegister.tsx
  /stores            # Gestion d'état Zustand
    - gameStore.ts
    - characterStore.ts
    - combatStore.ts
    - authStore.ts
    - worldStore.ts
  /data              # Données du jeu
    - classes.ts     (7 classes)
    - spells.ts      (70 sorts)
    - monsters.ts    (50+ monstres)
    - passiveSkills.ts
  /types             # Définitions TypeScript
    - character.types.ts
    - spell.types.ts
    - combat.types.ts
    - monster.types.ts
  /utils             # Utilitaires
    - damageCalculator.ts
    - distanceCalculator.ts
    - combatLogic.ts
```

## 🎯 Système de Combat

### Calcul des Dégâts
```typescript
// Dégâts de base
baseDamage = random(spell.damageMin, spell.damageMax)

// Coup critique
if (random() < spell.critChance) {
  baseDamage *= 1.5
  isCritical = true
}

// Modificateurs de stats
damageModifier = 1 + (characterStat / 100) * statBonus

// Résistances
resistance = target.elementalResistance[spell.element] || 0

// Dégâts finaux
finalDamage = baseDamage * damageModifier * (1 - resistance)
```

### Calcul de Distance (Manhattan)
```typescript
distance = Math.abs(char1.x - char2.x) + Math.abs(char1.z - char2.z)
```

## 🎨 Technologies Utilisées

- **React 18** - Framework UI
- **TypeScript 5** - Typage statique
- **Three.js 0.160** - Rendu 3D
- **React Three Fiber** - Intégration React/Three.js
- **@react-three/drei** - Helpers 3D
- **Zustand** - Gestion d'état
- **Tailwind CSS** - Styling
- **Vite** - Bundler rapide

## 🗺️ Roadmap

### Phase 1 - MVP ✅ (Complété)
- [x] Authentification
- [x] Sélection de classe
- [x] Monde 3D avec grille 100x100
- [x] 50+ monstres uniques
- [x] Combat tour par tour
- [x] 70 sorts
- [x] Interface HUD complète

### Phase 2 - Extensions (En cours)
- [ ] Système de déplacement complet
- [ ] Animations avancées des sorts
- [ ] Système d'inventaire et équipement
- [ ] Compétences passives actives
- [ ] Système de progression/XP
- [ ] Artéfacts légendaires
- [ ] Familiers et montures

### Phase 3 - Multijoueur
- [ ] Backend Node.js + Express
- [ ] WebSocket temps réel
- [ ] Matchmaking
- [ ] Combat PvP
- [ ] Guildes et système social
- [ ] Base de données (MongoDB/PostgreSQL)

### Phase 4 - Polish
- [ ] Optimisations 3D
- [ ] Effets sonores et musique
- [ ] Animations avancées
- [ ] Tests automatisés
- [ ] Documentation API

## 🎮 Comment Jouer

1. **Connexion** : Créez un compte ou connectez-vous
2. **Création** : Choisissez votre classe et nommez votre personnage
3. **Combat** : 
   - Attendez votre tour
   - Sélectionnez un sort dans la barre en bas
   - Cliquez sur un monstre pour l'attaquer
   - Cliquez sur "Terminer le Tour" quand vous avez fini
4. **Navigation** :
   - Clic droit + Drag : Rotation de la caméra
   - Scroll : Zoom
   - Clic milieu + Drag : Panoramique

## 📊 Statistiques du Projet

- **~5000+ lignes de code TypeScript**
- **10+ composants React**
- **5 composants 3D Three.js**
- **5 stores Zustand**
- **50+ monstres avec IA**
- **70 sorts uniques**
- **7 classes jouables**
- **Carte 100x100 cases**

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

**WassupAbdu** - [GitHub](https://github.com/WassupAbdu)

## 🙏 Remerciements

- Three.js pour le moteur 3D
- React Three Fiber pour l'intégration React
- La communauté open source

## 📸 Screenshots

*À venir - Le jeu est actuellement en développement actif*

---

**Note** : Ce projet est en développement actif (Alpha). Des bugs peuvent être présents et des fonctionnalités peuvent changer.

⭐ Si vous aimez ce projet, n'oubliez pas de lui donner une étoile sur GitHub !
