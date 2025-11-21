import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import { Mesh, Group } from 'three';
import { Character } from '../../types/character.types';
import { useCharacterStore } from '../../stores/characterStore';
import { useCombatStore } from '../../stores/combatStore';

interface Character3DProps {
  character: Character;
  onClick?: () => void;
}

export const Character3D = ({ character, onClick }: Character3DProps) => {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  
  const selectedCharacterId = useCharacterStore((state) => state.selectedCharacterId);
  const hoveredCharacterId = useCombatStore((state) => state.hoveredCharacterId);
  const setHoveredCharacter = useCombatStore((state) => state.setHoveredCharacter);
  
  const isSelected = selectedCharacterId === character.id;
  const isHovered = hoveredCharacterId === character.id || hovered;

  // Animation de sélection (bounce)
  useFrame((state) => {
    if (groupRef.current && isSelected) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.1 + 1;
    } else if (groupRef.current) {
      groupRef.current.position.y = 1;
    }
    
    // Rotation légère si survolé
    if (meshRef.current && isHovered) {
      meshRef.current.rotation.y += 0.02;
    }
  });

  const hpPercentage = (character.hp / character.maxHp) * 100;
  const hpColor = hpPercentage > 50 ? '#10b981' : hpPercentage > 25 ? '#f59e0b' : '#ef4444';

  return (
    <group
      ref={groupRef}
      position={[character.position.x, 1, character.position.z]}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        setHoveredCharacter(character.id);
      }}
      onPointerOut={() => {
        setHovered(false);
        setHoveredCharacter(null);
      }}
    >
      {/* Cylindre représentant le personnage */}
      <mesh ref={meshRef} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 2, 16]} />
        <meshStandardMaterial
          color={character.color}
          emissive={isSelected || isHovered ? character.color : '#000000'}
          emissiveIntensity={isSelected || isHovered ? 0.3 : 0}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Tête (sphère) */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={character.color}
          emissive={isSelected || isHovered ? character.color : '#000000'}
          emissiveIntensity={isSelected || isHovered ? 0.3 : 0}
        />
      </mesh>

      {/* Nom du personnage */}
      <Text
        position={[0, 2.2, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        {character.name}
      </Text>

      {/* Barre de HP */}
      <Html position={[0, 2.6, 0]} center>
        <div className="flex flex-col items-center" style={{ width: '100px' }}>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${hpPercentage}%`,
                backgroundColor: hpColor,
              }}
            />
          </div>
          <span className="text-white text-xs mt-1 font-bold shadow-lg">
            {character.hp}/{character.maxHp}
          </span>
        </div>
      </Html>

      {/* Indicateur de sélection */}
      {isSelected && (
        <mesh position={[0, -1.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.7, 32]} />
          <meshBasicMaterial color="#ffff00" transparent opacity={0.6} />
        </mesh>
      )}

      {/* Indicateur si mort */}
      {!character.isAlive && (
        <Html position={[0, 0, 0]} center>
          <div className="text-red-500 text-4xl font-bold">💀</div>
        </Html>
      )}
    </group>
  );
};
