# 📦 Guide des Assets 3D

## Assets Disponibles

### 🏰 Free 3D Modular Game Assets For Prototyping
**Chemin** : `src/assets/Free 3D Modular Game Assets For Prototyping/`

#### Personnage
- `Character/Character.fbx` - Modèle de personnage modulaire

#### Pièces Modulaires (Pieces/)
- Murs, portes, fenêtres
- Escaliers, rampes, échelles
- Piliers, clôtures
- Formes géométriques de base
- **Total** : 70+ objets

#### Scènes d'Exemple (Sample 1-5/)
- 5 scènes pré-assemblées
- Bonnes références pour level design

---

### 🏰 Free Medieval Low Poly Pack
**Chemin** : `src/assets/Free_Version_MedievalLowPolyPack/`

#### Modèles GLB (Prêts à l'emploi)
- `BrokenPot1.glb` - Pot cassé
- `MudRock1.glb` - Rocher boueux  
- `Rock1.glb` - Rocher
- `Shield1.glb` - ✅ **Bouclier** (arme)
- `Skull.glb` - Crâne (décor)
- `SmallBlueCrystal.glb` - ✅ Cristal bleu
- `SmallPurpleCrystal.glb` - ✅ Cristal violet
- `SmallRedCrystal.glb` - ✅ Cristal rouge
- `StoneSpear.glb` - ✅ **Lance** (arme)
- `StoneSword.glb` - ✅ **Épée** (arme)
- `Torch.glb` - Torche lumineuse

**Usage** : Utilisez `useGLTF` de `@react-three/drei`

---

### 🗡️ Free Dagger 3D Low Poly Models
**Chemin** : `src/assets/free-dagger-3d-low-poly-models/fbx/`

#### Collection de 24 Dagues
- `_dagger_1.fbx` à `_dagger_24.fbx`
- Styles variés : courtes, longues, recourbées, dentelées
- Textures dans `/texture/`

**Parfait pour** :
- Voleur
- Assassin
- Armes de secours

---

### 🏘️ Separate Assets FBX
**Chemin** : `src/assets/source/Separate_assets_fbx/Separate_assets_fbx/`

#### Objets de Village (41 modèles)
**Végétation** :
- `big_fabulous_tree_001.fbx` - Grand arbre
- `fabulous_tree_001.fbx` - Arbre moyen
- `tree_001.fbx` - Arbre simple
- `fir_001.fbx` - Sapin
- `fabulous_mushroom_001-004.fbx` - 4 champignons
- `cactus_001.fbx` - Cactus

**Constructions** :
- `house_001.fbx` - ✅ Maison 1
- `house_002.fbx` - ✅ Maison 2
- `house_003.fbx` - ✅ Maison 3
- `stall_001.fbx` - Étal de marché
- `stall_table_001.fbx` - Table d'étal

**Objets** :
- `barrel_001.fbx` - Tonneau
- `box_001-003.fbx` - Caisses (3 types)
- `bag_001-004.fbx` - Sacs (4 types)
- `bucket_001.fbx` - Seau
- `cart_001.fbx` - Chariot
- `jug_001-005.fbx` - Cruches (5 types)
- `log_001-004.fbx` - Rondins (4 types)
- `plate_001-003.fbx` - Assiettes (3 types)

**Utilitaires** :
- `table_001.fbx` - Table
- `crane_001.fbx` - Grue
- `holder_001.fbx` - Support
- `pointer_001.fbx` - Pointeur/Panneau

**Texture** :
- `Texture_1.png` - Texture commune

---

### 🌄 99 Texture HDR
**Chemin** : `src/assets/99-texture-hdr/`

#### HDRs (Pour l'éclairage)
- `HDRs/kloppenheim_02_2k.hdr` - Scène extérieure
- `HDRs/spruit_sunrise_4k.hdr` - Lever de soleil

#### Textures PBR (Pour les matériaux)
- `Textures/aerial_grass_rock_2k_jpg/` - Herbe et rochers
- `Textures/brown_planks_03_2k_jpg/` - Planches bois
- `Textures/rock_ground_02_2k_jpg/` - Sol rocheux

**Usage** : 
```tsx
import { useTexture } from '@react-three/drei';
const texture = useTexture('/path/to/texture.jpg');
```

---

## 🔄 Comment Charger les Modèles

### GLB/GLTF (Recommandé)
```tsx
import { useGLTF } from '@react-three/drei';

function MyModel() {
  const { scene } = useGLTF('/assets/Free_Version_MedievalLowPolyPack/Rock1.glb');
  return <primitive object={scene} />;
}
```

### FBX
```tsx
import { useLoader } from '@react-three/fiber';
import { FBXLoader } from 'three-stdlib';

function MyModel() {
  const fbx = useLoader(FBXLoader, '/assets/source/Separate_assets_fbx/Separate_assets_fbx/house_001.fbx');
  return <primitive object={fbx} />;
}
```

### Avec notre utilitaire
```tsx
import { useFBXModel, useGLTFModel } from '../utils/modelLoader';

function MyModel() {
  const model = useGLTFModel('/assets/Free_Version_MedievalLowPolyPack/Rock1.glb');
  return model ? <primitive object={model} /> : null;
}
```

---

## 🎨 Suggestions d'Utilisation

### Pour les Personnages
**Actuellement** : Cylindres colorés
**À implémenter** :
```tsx
import { useFBXModel } from '../utils/modelLoader';

const characterModel = useFBXModel(
  '/assets/Free 3D Modular Game Assets For Prototyping/Character/Character.fbx'
);
```

### Pour les Armes
**Actuellement** : Géométries simples (box, cylinder, cone)
**À implémenter** :
- Épée : `StoneSword.glb`
- Lance : `StoneSpear.glb`
- Bouclier : `Shield1.glb`
- Dagues : Choisir parmi 24 modèles FBX

### Pour les Décors

#### Maisons
```tsx
// Utiliser les 3 maisons FBX
const houses = [
  'house_001.fbx',
  'house_002.fbx',
  'house_003.fbx'
];
```

#### Arbres
```tsx
// Remplacer les arbres procéduraux par :
'big_fabulous_tree_001.fbx'  // Grand arbre
'fabulous_tree_001.fbx'      // Arbre moyen
'tree_001.fbx'               // Arbre simple
'fir_001.fbx'                // Sapin
```

#### Rochers
```tsx
// Remplacer dodécaèdres par :
'Rock1.glb'
'MudRock1.glb'
```

#### Cristaux
```tsx
// Remplacer les cones par :
'SmallBlueCrystal.glb'
'SmallPurpleCrystal.glb'
'SmallRedCrystal.glb'
```

### Pour le Village
**Actuellement** : Aucun
**À ajouter** :
- Étals de marché (`stall_001.fbx`)
- Tonneaux (`barrel_001.fbx`)
- Caisses (`box_001-003.fbx`)
- Sacs (`bag_001-004.fbx`)
- Charriot (`cart_001.fbx`)
- Tables (`table_001.fbx`, `stall_table_001.fbx`)

---

## 📝 Exemple Complet

### Remplacer un Arbre Procédural

**Avant** (Terrain.tsx) :
```tsx
function Tree({ position, treeIndex }) {
  return (
    <group position={position}>
      {/* Cylindre + Sphères */}
    </group>
  );
}
```

**Après** :
```tsx
import { useFBXModel } from '../../utils/modelLoader';

function Tree({ position, treeIndex, modelPath }) {
  const model = useFBXModel(modelPath);
  
  return model ? (
    <primitive 
      object={model} 
      position={position}
      scale={[0.8 + (treeIndex * 37) % 60 / 100, ...]}
    />
  ) : null;
}

// Utilisation
<Tree 
  position={pos} 
  treeIndex={i}
  modelPath="/assets/source/Separate_assets_fbx/Separate_assets_fbx/tree_001.fbx"
/>
```

---

## 🚀 Prochaines Étapes

### Phase 1 : Armes
1. Charger `StoneSword.glb` pour les épées
2. Charger `StoneSpear.glb` pour les lances
3. Charger `Shield1.glb` pour les boucliers
4. Charger dagues FBX pour voleurs/assassins

### Phase 2 : Décors
1. Remplacer arbres procéduraux par FBX
2. Charger les 3 maisons FBX
3. Utiliser cristaux GLB
4. Ajouter rochers GLB

### Phase 3 : Personnages
1. Charger Character.fbx de base
2. Adapter les couleurs par classe
3. Ajouter animations (marche, course, attaque)

### Phase 4 : Village
1. Créer zone de village
2. Placer étals, tonneaux, caisses
3. Ajouter PNJs

---

## ⚠️ Notes Importantes

### Chemins d'Accès
- Les chemins dans le code doivent être **relatifs au dossier public**
- Ou copier les assets dans `/public/assets/`
- Ou utiliser `import` pour bundler avec Vite

### Performances
- GLB est plus performant que FBX (déjà optimisé)
- Utiliser `<Instances>` pour objets répétés (arbres, rochers)
- Limiter les ombres sur objets nombreux

### Textures
- Charger une seule fois avec `useTexture`
- Partager entre plusieurs objets
- Utiliser mipmaps pour distance

---

## 📚 Ressources

- [Three.js Loaders](https://threejs.org/docs/#examples/en/loaders/GLTFLoader)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Drei Helpers](https://github.com/pmndrs/drei)
- [FBX Format](https://en.wikipedia.org/wiki/FBX)
- [glTF Format](https://www.khronos.org/gltf/)

---

**Dernière mise à jour** : 24 Novembre 2025
