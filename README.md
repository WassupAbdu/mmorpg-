# ⚔️ MMORPG 3D - Combat Tour par Tour

Un MMORPG 3D innovant en tour par tour, développé avec React, Three.js et TypeScript. Explorez un monde immense, affrontez des dizaines de monstres uniques et maîtrisez les 7 classes de personnages disponibles !

![MMORPG Banner](https://img.shields.io/badge/Status-Alpha-yellow) ![React](https://img.shields.io/badge/React-18.3-blue) ![Three.js](https://img.shields.io/badge/Three.js-0.160-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

## 🎮 Fonctionnalités Principales

### ✨ Système d'Authentification
- Login/Register avec email et mot de passe
- Support OAuth avec Google et GitHub (préparé)
- Interface moderne et responsive
- JWT pour la sécurité
- Backend Node.js + MongoDB

### 🌐 Mode Multijoueur en Ligne
- **WebSocket temps réel** avec Socket.io
- **Système d'amis** : liste d'amis, demandes, statut en ligne
- **Système de groupes** : créez des parties de 3-5 joueurs
- **Guildes** : créez ou rejoignez une guilde, rangs, trésorerie
- **Chat en temps réel** : global, groupe, guilde, chuchotement
- **Combat multijoueur** : affrontez des monstres en groupe
- **Donjons en groupe** : 20+ donjons pour 3 joueurs

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

### 🏆 Battle Pass (100 Paliers)
- **Système de progression** avec 100 paliers
- **Récompenses gratuites** et **premium**
- **Quêtes quotidiennes** : 10+ quêtes qui se réinitialisent chaque jour
- **Quêtes hebdomadaires** : défis plus difficiles
- **Quêtes mensuelles** : récompenses exceptionnelles
- **Quêtes de guilde** : progression en équipe
- **XP de Battle Pass** gagnée via les quêtes

### 🏅 Système de Succès (Style PSN)
- **25+ succès** répartis en 5 catégories
- Catégories : Combat, Exploration, Social, Progression, Collection
- **Raretés** : Bronze, Argent, Or, Platine
- **Succès secrets** à découvrir
- **Récompenses** : XP, or, titres spéciaux
- **Notifications** style PlayStation

### 🗺️ Monde Immense
- **5 Pays uniques** avec thèmes distincts :
  - Royaume de Valoria (débutants)
  - Empire de Solaris (désert)
  - Nord Gelé (glace)
  - Îles Mystiques (magie)
  - Terres d'Ombre (corruption)
- **50+ Cartes** (10+ par pays)
- **Navigation** entre cartes et pays
- **Niveaux recommandés** pour chaque zone

### 🏰 Donjons de Groupe
- **20+ Donjons** obscurs
- **Requis** : Groupes de 3 joueurs
- **Difficultés** : Normal, Difficile, Extrême
- **Boss uniques** dans chaque donjon
- **Récompenses** : XP, or, objets légendaires
- **Matchmaking** pour trouver des coéquipiers

## 🚀 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn
- MongoDB (pour le serveur backend)

### Installation Frontend

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

### Installation Backend (Serveur)

```bash
# Dans le dossier du projet

# Copier le fichier d'environnement
cp .env.example .env

# Éditer .env avec vos configurations
# MONGODB_URI=mongodb://localhost:27017/mmorpg
# JWT_SECRET=votre-cle-secrete
# PORT=3000

# Démarrer MongoDB
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS

# Lancer le serveur
npm run server
```

Le serveur sera accessible sur `http://localhost:3000`  
Le frontend sera accessible sur `http://localhost:5173`

Pour plus de détails sur le serveur, voir [SERVER_README.md](SERVER_README.md)

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
- [x] Système de quêtes (quotidiennes, hebdomadaires, mensuelles)
- [x] Battle Pass avec 100 paliers
- [x] Système de succès (25+ succès)
- [x] 5 pays avec 50+ cartes
- [x] 20+ donjons (3 joueurs)
- [x] PWA (Progressive Web App)

### Phase 2 - Extensions (En cours)
- [ ] Système de déplacement complet
- [ ] Animations avancées des sorts
- [ ] Système d'inventaire et équipement
- [ ] Compétences passives actives
- [ ] Système de progression/XP
- [ ] Artéfacts légendaires
- [ ] Familiers et montures

### Phase 3 - Multijoueur ✅ (Complété)
- [x] Backend Node.js + Express
- [x] WebSocket temps réel (Socket.io)
- [x] Système d'amis et messagerie
- [x] Combat multijoueur
- [x] Guildes et système social
- [x] Base de données MongoDB
- [x] Système de groupes/parties
- [x] Chat (global, guilde, groupe, chuchotement)

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

- **~15000+ lignes de code TypeScript**
- **25+ composants React**
- **5 composants 3D Three.js**
- **10+ stores Zustand**
- **50+ monstres avec IA**
- **70 sorts uniques**
- **7 classes jouables**
- **5 pays, 50+ cartes**
- **20+ donjons**
- **25+ succès**
- **20+ quêtes**
- **100 paliers Battle Pass**
- **Backend Node.js + MongoDB**
- **WebSocket temps réel**
- **PWA-ready**

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
