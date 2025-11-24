import { useLoader } from '@react-three/fiber';
import { FBXLoader } from 'three-stdlib';
import { GLTFLoader } from 'three-stdlib';
import * as THREE from 'three';

/**
 * Hook pour charger des modèles FBX
 */
export function useFBXModel(path: string) {
  try {
    const fbx = useLoader(FBXLoader, path);
    return fbx;
  } catch (error) {
    console.error(`Erreur lors du chargement du modèle FBX: ${path}`, error);
    return null;
  }
}

/**
 * Hook pour charger des modèles GLTF/GLB
 */
export function useGLTFModel(path: string) {
  try {
    const gltf = useLoader(GLTFLoader, path);
    return gltf.scene;
  } catch (error) {
    console.error(`Erreur lors du chargement du modèle GLTF: ${path}`, error);
    return null;
  }
}

/**
 * Applique une texture à un modèle
 */
export function applyTextureToModel(
  model: THREE.Object3D,
  texturePath: string
) {
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(texturePath, (texture) => {
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.material instanceof THREE.Material) {
          (child.material as THREE.MeshStandardMaterial).map = texture;
          child.material.needsUpdate = true;
        }
      }
    });
  });
}

/**
 * Clone un modèle 3D
 */
export function cloneModel(model: THREE.Object3D): THREE.Object3D {
  return model.clone();
}
