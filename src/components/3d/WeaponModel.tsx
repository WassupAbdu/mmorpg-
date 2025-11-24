import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useWeaponStore } from '../../stores/weaponStore';
import { WeaponType } from '../../types/weapon.types';
import * as THREE from 'three';

interface WeaponModelProps {
  parentRef: React.RefObject<THREE.Group>;
}

export default function WeaponModel({ parentRef }: WeaponModelProps) {
  const weaponRef = useRef<THREE.Group>(null);
  const { currentWeapon, weaponDrawn } = useWeaponStore();

  useFrame(() => {
    if (!weaponRef.current || !parentRef.current) return;

    // Positionner l'arme à côté du personnage
    if (weaponDrawn && currentWeapon?.type !== WeaponType.FISTS) {
      weaponRef.current.position.copy(parentRef.current.position);
      weaponRef.current.position.x += 0.8;
      weaponRef.current.position.y += 1;
      weaponRef.current.rotation.copy(parentRef.current.rotation);
      weaponRef.current.visible = true;
    } else {
      weaponRef.current.visible = false;
    }
  });

  if (!currentWeapon || currentWeapon.type === WeaponType.FISTS) {
    return null;
  }

  return (
    <group ref={weaponRef}>
      {renderWeaponMesh(currentWeapon.type)}
    </group>
  );
}

// Fonction pour rendre le mesh de l'arme selon son type
function renderWeaponMesh(type: WeaponType) {
  switch (type) {
    case WeaponType.SWORD:
      return <SwordMesh />;
    case WeaponType.DAGGER:
      return <DaggerMesh />;
    case WeaponType.AXE:
      return <AxeMesh />;
    case WeaponType.BOW:
      return <BowMesh />;
    case WeaponType.STAFF:
      return <StaffMesh />;
    case WeaponType.SPEAR:
      return <SpearMesh />;
    case WeaponType.MACE:
      return <MaceMesh />;
    case WeaponType.SHIELD:
      return <ShieldMesh />;
    default:
      return null;
  }
}

// Modèles 3D simples pour chaque type d'arme

function SwordMesh() {
  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      {/* Lame */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[0.1, 1.6, 0.05]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Poignée */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      {/* Garde */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.4, 0.05, 0.05]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} />
      </mesh>
    </group>
  );
}

function DaggerMesh() {
  return (
    <group rotation={[0, 0, Math.PI / 3]} scale={0.7}>
      {/* Lame */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.08, 0.8, 0.04]} />
        <meshStandardMaterial color="#a0a0a0" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Poignée */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.3, 8]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
    </group>
  );
}

function AxeMesh() {
  return (
    <group rotation={[0, 0, Math.PI / 6]}>
      {/* Manche */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 1.2, 8]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      {/* Lame */}
      <mesh position={[0.15, 1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.6, 0.1, 0.4]} />
        <meshStandardMaterial color="#808080" metalness={0.8} />
      </mesh>
    </group>
  );
}

function BowMesh() {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      {/* Arc */}
      <mesh>
        <torusGeometry args={[0.8, 0.04, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      {/* Corde */}
      <mesh position={[0, -0.8, 0]}>
        <boxGeometry args={[1.6, 0.01, 0.01]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function StaffMesh() {
  return (
    <group>
      {/* Bâton */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 1.8, 8]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      {/* Orbe magique */}
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#8b00ff"
          emissive="#8b00ff"
          emissiveIntensity={0.5}
        />
      </mesh>
      <pointLight position={[0, 1.7, 0]} color="#8b00ff" intensity={1} distance={3} />
    </group>
  );
}

function SpearMesh() {
  return (
    <group rotation={[0, 0, Math.PI / 8]}>
      {/* Manche */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.8, 8]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      {/* Pointe */}
      <mesh position={[0, 1.8, 0]}>
        <coneGeometry args={[0.1, 0.4, 8]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.9} />
      </mesh>
    </group>
  );
}

function MaceMesh() {
  return (
    <group rotation={[0, 0, Math.PI / 6]}>
      {/* Manche */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.9, 8]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      {/* Tête de masse */}
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#808080" metalness={0.7} />
      </mesh>
      {/* Pointes */}
      <mesh position={[0, 1.05, 0]}>
        <coneGeometry args={[0.05, 0.15, 8]} />
        <meshStandardMaterial color="#404040" />
      </mesh>
    </group>
  );
}

function ShieldMesh() {
  return (
    <group rotation={[0, Math.PI / 4, 0]} position={[-0.5, 0, 0]}>
      {/* Bouclier */}
      <mesh>
        <cylinderGeometry args={[0.6, 0.6, 0.1, 8]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} />
      </mesh>
      {/* Emblème */}
      <mesh position={[0, 0, 0.06]}>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 6]} />
        <meshStandardMaterial color="#8b0000" />
      </mesh>
    </group>
  );
}
