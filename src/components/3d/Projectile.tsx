import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Group } from 'three';
import { Position } from '../../types/character.types';
import { ElementType } from '../../types/character.types';
import { Trail } from '@react-three/drei';

interface ProjectileProps {
  from: Position;
  to: Position;
  element: ElementType;
  onComplete: () => void;
}

const ELEMENT_COLORS: Record<ElementType, string> = {
  [ElementType.EARTH]: '#92400e',
  [ElementType.FIRE]: '#dc2626',
  [ElementType.AIR]: '#3b82f6',
  [ElementType.WATER]: '#0ea5e9',
  [ElementType.LIGHT]: '#fbbf24',
  [ElementType.SHADOW]: '#6b7280',
  [ElementType.POISON]: '#22c55e',
  [ElementType.DARKNESS]: '#1f2937',
  [ElementType.ARCANE]: '#a855f7',
  [ElementType.ICE]: '#06b6d4',
  [ElementType.ELECTRIC]: '#eab308',
  [ElementType.STEALTH]: '#374151',
};

export const Projectile = ({ from, to, element, onComplete }: ProjectileProps) => {
  const groupRef = useRef<Group>(null);
  const startPos = new Vector3(from.x, 1, from.z);
  const endPos = new Vector3(to.x, 1, to.z);
  const speed = 10; // unités par seconde
  const progress = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    progress.current += delta * speed;
    const distance = startPos.distanceTo(endPos);
    const t = Math.min(progress.current / distance, 1);

    // Interpolation avec arc parabolique
    const currentPos = new Vector3().lerpVectors(startPos, endPos, t);
    currentPos.y += Math.sin(t * Math.PI) * 2; // Arc

    groupRef.current.position.copy(currentPos);

    // Rotation du projectile
    groupRef.current.rotation.x += delta * 5;
    groupRef.current.rotation.y += delta * 3;

    // Compléter l'animation
    if (t >= 1) {
      onComplete();
    }
  });

  const color = ELEMENT_COLORS[element];

  return (
    <group ref={groupRef}>
      <Trail
        width={0.5}
        length={6}
        color={color}
        attenuation={(t) => t * t}
      >
        {/* Projectile sphérique avec particules */}
        <mesh castShadow>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.8}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Particules autour */}
        {[...Array(6)].map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          const radius = 0.3;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius,
              ]}
            >
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshBasicMaterial color={color} transparent opacity={0.6} />
            </mesh>
          );
        })}
      </Trail>
    </group>
  );
};
