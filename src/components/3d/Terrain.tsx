import { useMemo } from 'react';

// Générer des positions fixes pour les objets (appelé une seule fois)
function generatePositions(count: number, range: number): [number, number, number][] {
  const positions: [number, number, number][] = [];
  for (let i = 0; i < count; i++) {
    positions.push([
      Math.random() * range - range / 2,
      0,
      Math.random() * range - range / 2,
    ]);
  }
  return positions;
}

const TREE_POSITIONS = generatePositions(50, 100);
const BUSH_POSITIONS = generatePositions(80, 100);
const ROCK_POSITIONS = generatePositions(40, 100);

export default function Terrain() {
  // Utiliser les positions pré-générées
  const treePositions = useMemo(() => TREE_POSITIONS, []);
  const bushPositions = useMemo(() => BUSH_POSITIONS, []);
  const rockPositions = useMemo(() => ROCK_POSITIONS, []);

  const housePositions = useMemo(() => {
    return [
      [-20, 0, -20],
      [25, 0, -15],
      [-15, 0, 30],
      [30, 0, 25],
      [-30, 0, -30],
    ] as [number, number, number][];
  }, []);

  return (
    <group>
      {/* Sol principal avec texture herbe */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200, 50, 50]} />
        <meshStandardMaterial
          color="#4a7c3f"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Grille pour le sol (optionnelle, pour debug) */}
      <gridHelper args={[200, 40, '#334155', '#1e293b']} position={[0, 0.01, 0]} />

      {/* Arbres */}
      {treePositions.map((pos, i) => (
        <Tree key={`tree-${i}`} position={pos} treeIndex={i} />
      ))}

      {/* Buissons */}
      {bushPositions.map((pos, i) => (
        <Bush key={`bush-${i}`} position={pos} bushIndex={i} />
      ))}

      {/* Rochers */}
      {rockPositions.map((pos, i) => (
        <Rock key={`rock-${i}`} position={pos} rockIndex={i} />
      ))}

      {/* Maisons */}
      {housePositions.map((pos, i) => (
        <House key={`house-${i}`} position={pos} rotation={[0, i * 0.7, 0]} />
      ))}

      {/* Cristaux magiques */}
      <Crystal position={[10, 0, 10]} color="#0088ff" />
      <Crystal position={[-12, 0, 15]} color="#ff0088" />
      <Crystal position={[18, 0, -8]} color="#00ff88" />
    </group>
  );
}

// Composant Arbre simple
function Tree({ position, treeIndex }: { position: [number, number, number]; treeIndex: number }) {
  const scale = 0.8 + ((treeIndex * 37) % 60) / 100;
  
  return (
    <group position={position} scale={scale}>
      {/* Tronc */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 3, 8]} />
        <meshStandardMaterial color="#5a3a28" />
      </mesh>
      
      {/* Feuillage - 3 sphères */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <sphereGeometry args={[1.2, 8, 8]} />
        <meshStandardMaterial color="#2d5016" />
      </mesh>
      <mesh position={[0, 4.5, 0]} castShadow>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#3a6b20" />
      </mesh>
      <mesh position={[0, 5.3, 0]} castShadow>
        <sphereGeometry args={[0.7, 8, 8]} />
        <meshStandardMaterial color="#4a8028" />
      </mesh>
    </group>
  );
}

// Composant Buisson
function Bush({ position, bushIndex }: { position: [number, number, number]; bushIndex: number }) {
  const scale = 0.5 + ((bushIndex * 23) % 50) / 100;
  
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.8, 6, 6]} />
        <meshStandardMaterial color="#3a6b20" roughness={0.9} />
      </mesh>
      <mesh position={[0.4, 0.4, 0.3]} castShadow>
        <sphereGeometry args={[0.5, 6, 6]} />
        <meshStandardMaterial color="#2d5016" roughness={0.9} />
      </mesh>
    </group>
  );
}

// Composant Rocher
function Rock({ position, rockIndex }: { position: [number, number, number]; rockIndex: number }) {
  const scale = 0.6 + ((rockIndex * 41) % 80) / 100;
  const rotation = ((rockIndex * 13) % 360) * (Math.PI / 180);
  
  return (
    <mesh
      position={position}
      scale={scale}
      rotation={[0, rotation, 0]}
      castShadow
    >
      <dodecahedronGeometry args={[0.8, 0]} />
      <meshStandardMaterial color="#6b7280" roughness={0.95} />
    </mesh>
  );
}

// Composant Maison simple
function House({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Murs */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[4, 3, 4]} />
        <meshStandardMaterial color="#8b6f47" />
      </mesh>
      
      {/* Toit */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <coneGeometry args={[3.2, 2, 4]} />
        <meshStandardMaterial color="#a0522d" />
      </mesh>
      
      {/* Porte */}
      <mesh position={[0, 0.8, 2.01]} castShadow>
        <boxGeometry args={[0.8, 1.6, 0.1]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      
      {/* Fenêtre */}
      <mesh position={[1.2, 1.5, 2.01]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.05]} />
        <meshStandardMaterial color="#87ceeb" emissive="#ffff99" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[-1.2, 1.5, 2.01]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.05]} />
        <meshStandardMaterial color="#87ceeb" emissive="#ffff99" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

// Composant Cristal magique (comme dans les assets)
function Crystal({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 1, 0]} castShadow>
        <coneGeometry args={[0.4, 2, 6]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      
      {/* Lueur autour du cristal */}
      <pointLight position={[0, 1, 0]} color={color} intensity={2} distance={5} />
    </group>
  );
}
