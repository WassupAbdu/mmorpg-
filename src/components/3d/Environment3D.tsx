import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sky, Stars, Cloud } from '@react-three/drei';
import * as THREE from 'three';

export default function Environment3D() {
  const planetsRef = useRef<THREE.Group>(null);
  const auroresRef = useRef<THREE.Group>(null);

  // Animation des planètes et aurores
  useFrame(({ clock }) => {
    if (planetsRef.current) {
      planetsRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
    if (auroresRef.current) {
      auroresRef.current.children.forEach((aurora, i) => {
        const mesh = aurora as THREE.Mesh;
        if (mesh.material && !Array.isArray(mesh.material)) {
          (mesh.material as THREE.MeshBasicMaterial).opacity = 
            0.3 + Math.sin(clock.getElapsedTime() * 0.5 + i) * 0.2;
        }
      });
    }
  });

  return (
    <>
      {/* Ciel avec dégradé */}
      <Sky
        distance={450000}
        sunPosition={[100, 20, 100]}
        inclination={0.6}
        azimuth={0.25}
        turbidity={10}
        rayleigh={2}
      />

      {/* Étoiles */}
      <Stars
        radius={300}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Aurores boréales */}
      <group ref={auroresRef} position={[0, 30, -80]}>
        <AuroraEffect color="#00ff88" position={[-20, 0, 0]} />
        <AuroraEffect color="#0088ff" position={[0, 5, -10]} />
        <AuroraEffect color="#ff00ff" position={[20, 0, 0]} />
      </group>

      {/* Planètes lointaines (style Avatar) */}
      <group ref={planetsRef} position={[0, 80, -200]}>
        {/* Grande planète bleue */}
        <mesh position={[50, 20, 0]}>
          <sphereGeometry args={[15, 32, 32]} />
          <meshStandardMaterial
            color="#4488ff"
            emissive="#2244aa"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Planète avec anneaux */}
        <group position={[-60, -10, 20]}>
          <mesh>
            <sphereGeometry args={[12, 32, 32]} />
            <meshStandardMaterial
              color="#ffaa44"
              emissive="#aa6622"
              emissiveIntensity={0.4}
            />
          </mesh>
          <mesh rotation={[Math.PI / 4, 0, Math.PI / 6]}>
            <torusGeometry args={[18, 1, 2, 50]} />
            <meshStandardMaterial
              color="#cccccc"
              transparent
              opacity={0.7}
            />
          </mesh>
        </group>

        {/* Petite lune */}
        <mesh position={[0, 40, -30]}>
          <sphereGeometry args={[6, 32, 32]} />
          <meshStandardMaterial
            color="#dddddd"
            emissive="#666666"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>

      {/* Nuages */}
      <Cloud
        position={[-20, 15, -10]}
        speed={0.2}
        opacity={0.4}
        color="#ffffff"
        segments={20}
        bounds={[40, 5, 40]}
      />
      <Cloud
        position={[30, 18, -20]}
        speed={0.15}
        opacity={0.3}
        color="#ffffff"
        segments={15}
        bounds={[30, 4, 30]}
      />

      {/* Lumières */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[100, 100, 50]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={500}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <pointLight position={[0, 20, 0]} intensity={0.5} color="#fff8dc" />
      <hemisphereLight
        args={["#87ceeb", "#8b7355", 0.4]}
      />
    </>
  );
}

// Composant pour créer un effet d'aurore boréale
function AuroraEffect({ color, position }: { color: string; position: [number, number, number] }) {
  const geometry = new THREE.PlaneGeometry(30, 40, 20, 20);
  const vertices = geometry.attributes.position.array as Float32Array;

  // Déformer le plan pour créer un effet ondulant
  for (let i = 0; i < vertices.length; i += 3) {
    vertices[i + 2] = Math.sin(vertices[i] * 0.1) * Math.cos(vertices[i + 1] * 0.1) * 3;
  }
  geometry.attributes.position.needsUpdate = true;

  return (
    <mesh position={position} geometry={geometry}>
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.4}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
