import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import { Mesh, Group } from 'three';
import { Monster } from '../../types/monster.types';
import { useCombatStore } from '../../stores/combatStore';

interface Monster3DProps {
  monster: Monster;
  onClick?: () => void;
}

export const Monster3D = ({ monster, onClick }: Monster3DProps) => {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  
  const hoveredCharacterId = useCombatStore((state) => state.hoveredCharacterId);
  const setHoveredCharacter = useCombatStore((state) => state.setHoveredCharacter);
  const selectedSpell = useCombatStore((state) => state.selectedSpell);
  
  const isHovered = hoveredCharacterId === monster.id || hovered;
  const isTargetable = selectedSpell !== null && monster.isAlive;

  // Animation de respiration
  useFrame((state) => {
    if (meshRef.current) {
      const breathe = Math.sin(state.clock.elapsedTime * 2) * 0.05 + 1;
      meshRef.current.scale.set(breathe, breathe, breathe);
    }
    
    // Rotation si survolé
    if (groupRef.current && isHovered) {
      groupRef.current.rotation.y += 0.01;
    }
  });

  const hpPercentage = (monster.hp / monster.maxHp) * 100;
  const hpColor = hpPercentage > 50 ? '#10b981' : hpPercentage > 25 ? '#f59e0b' : '#ef4444';

  // Forme différente selon le type de monstre
  const scale = monster.definition.scale;

  return (
    <group
      ref={groupRef}
      position={[monster.position.x, scale, monster.position.z]}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        setHoveredCharacter(monster.id);
      }}
      onPointerOut={() => {
        setHovered(false);
        setHoveredCharacter(null);
      }}
    >
      {/* Indicateur de ciblage */}
      {isTargetable && (
        <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[scale * 0.6, scale * 0.8, 32]} />
          <meshBasicMaterial 
            color={isHovered ? '#00ff00' : '#ffff00'} 
            transparent 
            opacity={isHovered ? 0.8 : 0.5}
            side={2}
          />
        </mesh>
      )}

      {/* Corps du monstre */}
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[0.8 * scale, 1.5 * scale, 0.8 * scale]} />
        <meshStandardMaterial
          color={monster.definition.color}
          emissive={isTargetable && isHovered ? '#00ff00' : isHovered ? monster.definition.color : '#000000'}
          emissiveIntensity={isTargetable && isHovered ? 0.5 : isHovered ? 0.3 : 0}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      {/* Curseur de souris au survol */}
      {isTargetable && isHovered && (
        <Html center>
          <div style={{ 
            pointerEvents: 'none',
            color: '#00ff00', 
            fontSize: '24px',
            fontWeight: 'bold',
            textShadow: '0 0 10px #00ff00',
            animation: 'pulse 1s infinite'
          }}>
            🎯
          </div>
        </Html>
      )}

      {/* Détails selon le type */}
      {/* Cornes pour les boss et élites */}
      {(monster.definition.rarity === 'BOSS' || monster.definition.rarity === 'ELITE') && (
        <>
          <mesh position={[-0.3 * scale, 1 * scale, 0]} castShadow>
            <coneGeometry args={[0.1 * scale, 0.5 * scale, 8]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>
          <mesh position={[0.3 * scale, 1 * scale, 0]} castShadow>
            <coneGeometry args={[0.1 * scale, 0.5 * scale, 8]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>
        </>
      )}

      {/* Nom du monstre */}
      <Text
        position={[0, 1.5 * scale, 0]}
        fontSize={0.2 * scale}
        color="#ff4444"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        {monster.definition.name}
      </Text>

      {/* Niveau */}
      <Text
        position={[0, 1.8 * scale, 0]}
        fontSize={0.15 * scale}
        color="#fbbf24"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000000"
      >
        Niv. {monster.level}
      </Text>

      {/* Barre de HP */}
      <Html position={[0, 2.2 * scale, 0]} center>
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
          <span className="text-red-400 text-xs mt-1 font-bold shadow-lg">
            {monster.hp}/{monster.maxHp}
          </span>
        </div>
      </Html>

      {/* Aura selon la rareté */}
      {monster.definition.rarity === 'LEGENDARY' && (
        <mesh position={[0, 0, 0]}>
          <ringGeometry args={[0.9 * scale, 1.1 * scale, 32]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.3} />
        </mesh>
      )}

      {monster.definition.rarity === 'BOSS' && (
        <mesh position={[0, 0, 0]}>
          <ringGeometry args={[0.9 * scale, 1.1 * scale, 32]} />
          <meshBasicMaterial color="#dc2626" transparent opacity={0.3} />
        </mesh>
      )}

      {/* Indicateur si mort */}
      {!monster.isAlive && (
        <Html position={[0, 0, 0]} center>
          <div className="text-gray-500 text-4xl font-bold">💀</div>
        </Html>
      )}
    </group>
  );
};
