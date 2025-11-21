import { useMemo } from 'react';
import { useWorldStore } from '../../stores/worldStore';

interface GameGridProps {
  showGridLines?: boolean;
}

export const GameGrid = ({ showGridLines = true }: GameGridProps) => {
  const gridWidth = useWorldStore((state) => state.gridWidth);
  const gridHeight = useWorldStore((state) => state.gridHeight);

  // Créer la géométrie de la grille
  const gridGeometry = useMemo(() => {
    const lines: JSX.Element[] = [];
    
    if (!showGridLines) return null;

    // Lignes verticales
    for (let i = 0; i <= gridWidth; i++) {
      lines.push(
        <line key={`v-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([i, 0, 0, i, 0, gridHeight])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#334155" />
        </line>
      );
    }

    // Lignes horizontales
    for (let i = 0; i <= gridHeight; i++) {
      lines.push(
        <line key={`h-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([0, 0, i, gridWidth, 0, i])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#334155" />
        </line>
      );
    }

    return lines;
  }, [gridWidth, gridHeight, showGridLines]);

  return (
    <group>
      {/* Sol de la grille */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[gridWidth / 2, -0.01, gridHeight / 2]} receiveShadow>
        <planeGeometry args={[gridWidth, gridHeight]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Lignes de la grille */}
      {gridGeometry}
    </group>
  );
};
