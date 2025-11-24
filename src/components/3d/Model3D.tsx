import { Suspense } from 'react';
import { useGLTF } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { FBXLoader } from 'three-stdlib';

interface ModelProps {
  path: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
}

/**
 * Composant pour charger et afficher un modèle GLB
 */
export function GLBModel({ path, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }: ModelProps) {
  const { scene } = useGLTF(path);
  const clonedScene = scene.clone();

  return (
    <Suspense fallback={<LoadingPlaceholder position={position} />}>
      <primitive
        object={clonedScene}
        position={position}
        rotation={rotation}
        scale={scale}
      />
    </Suspense>
  );
}

/**
 * Composant pour charger et afficher un modèle FBX
 */
export function FBXModel({ path, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }: ModelProps) {
  const fbx = useLoader(FBXLoader, path);
  const clonedFBX = fbx.clone();

  return (
    <Suspense fallback={<LoadingPlaceholder position={position} />}>
      <primitive
        object={clonedFBX}
        position={position}
        rotation={rotation}
        scale={scale}
      />
    </Suspense>
  );
}

/**
 * Placeholder affiché pendant le chargement
 */
function LoadingPlaceholder({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#888888" wireframe />
    </mesh>
  );
}

/**
 * Composant générique qui détecte le type de fichier
 */
export function Model3D({ path, position, rotation, scale }: ModelProps) {
  const extension = path.split('.').pop()?.toLowerCase();

  if (extension === 'glb' || extension === 'gltf') {
    return <GLBModel path={path} position={position} rotation={rotation} scale={scale} />;
  } else if (extension === 'fbx') {
    return <FBXModel path={path} position={position} rotation={rotation} scale={scale} />;
  }

  console.error(`Format de fichier non supporté: ${extension}`);
  return null;
}

/**
 * Fonction pour précharger les modèles fréquemment utilisés
 * Appelez cette fonction au démarrage de l'application
 */
export function PreloadModels() {
  // Armes
  useGLTF.preload('/assets/Free_Version_MedievalLowPolyPack/StoneSword.glb');
  useGLTF.preload('/assets/Free_Version_MedievalLowPolyPack/StoneSpear.glb');
  useGLTF.preload('/assets/Free_Version_MedievalLowPolyPack/Shield1.glb');
  
  // Cristaux
  useGLTF.preload('/assets/Free_Version_MedievalLowPolyPack/SmallBlueCrystal.glb');
  useGLTF.preload('/assets/Free_Version_MedievalLowPolyPack/SmallPurpleCrystal.glb');
  useGLTF.preload('/assets/Free_Version_MedievalLowPolyPack/SmallRedCrystal.glb');
  
  // Environnement
  useGLTF.preload('/assets/Free_Version_MedievalLowPolyPack/Rock1.glb');
  useGLTF.preload('/assets/Free_Version_MedievalLowPolyPack/MudRock1.glb');
  
  return null;
}
