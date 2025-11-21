import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { BufferGeometry, Float32BufferAttribute } from 'three';
import { Position } from '../../types/character.types';
import { ElementType } from '../../types/character.types';

interface EffectParticlesProps {
  position: Position;
  element: ElementType;
  type: 'explosion' | 'impact' | 'critical' | 'heal';
  onComplete?: () => void;
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

export const EffectParticles = ({
  position,
  element,
  type,
  onComplete,
}: EffectParticlesProps) => {
  const pointsRef = useRef<any>(null);
  const time = useRef(0);
  const duration = type === 'critical' ? 1.5 : 1.0;

  const particleCount = type === 'explosion' ? 100 : type === 'critical' ? 50 : 30;

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      // Position initiale au centre
      positions[i * 3] = position.x;
      positions[i * 3 + 1] = 1;
      positions[i * 3 + 2] = position.z;

      // Vélocités aléatoires
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 1;
      velocities.push(
        Math.cos(angle) * speed, // vx
        Math.random() * 3 + 1, // vy (vers le haut)
        Math.sin(angle) * speed // vz
      );
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    return { geometry, velocities };
  }, [particleCount, position]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;

    time.current += delta;

    const positions = pointsRef.current.geometry.attributes.position.array;

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;

      // Mettre à jour la position
      positions[idx] += particles.velocities[idx] * delta;
      positions[idx + 1] += particles.velocities[idx + 1] * delta;
      positions[idx + 2] += particles.velocities[idx + 2] * delta;

      // Gravité
      particles.velocities[idx + 1] -= 9.8 * delta;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Terminer l'effet
    if (time.current >= duration && onComplete) {
      onComplete();
    }
  });

  const color = ELEMENT_COLORS[element];
  const opacity = Math.max(0, 1 - time.current / duration);

  return (
    <Points ref={pointsRef} geometry={particles.geometry}>
      <PointMaterial
        transparent
        color={color}
        size={type === 'critical' ? 0.15 : 0.1}
        sizeAttenuation
        opacity={opacity}
        depthWrite={false}
      />
    </Points>
  );
};
