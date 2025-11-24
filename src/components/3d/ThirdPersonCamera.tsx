import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import * as THREE from 'three';

interface ThirdPersonCameraProps {
  target: React.RefObject<THREE.Group>;
  distance?: number;
  height?: number;
  smoothness?: number;
}

export default function ThirdPersonCamera({ 
  target, 
  distance: initialDistance = 8, 
  height = 3, 
  smoothness = 0.1 
}: ThirdPersonCameraProps) {
  const { camera } = useThree();
  const distance = useRef(initialDistance);
  const currentLookAt = useRef(new Vector3());
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const rotationAngle = useRef(0);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (event.buttons === 2) { // Clic droit maintenu
        mouseX.current = (event.movementX / window.innerWidth) * 2;
        mouseY.current = (event.movementY / window.innerHeight) * 2;
      }
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      distance.current += event.deltaY * 0.01;
      distance.current = Math.max(3, Math.min(20, distance.current));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  useFrame(() => {
    if (!target.current) return;

    // Rotation de la caméra avec la souris
    rotationAngle.current -= mouseX.current * 5;
    mouseX.current *= 0.95;
    mouseY.current *= 0.95;

    // Position cible du personnage
    const targetPosition = target.current.position;

    // Calcul de la position de la caméra
    const angleRad = rotationAngle.current * (Math.PI / 180);
    const offsetX = Math.sin(angleRad) * distance.current;
    const offsetZ = Math.cos(angleRad) * distance.current;

    const idealOffset = new Vector3(offsetX, height, offsetZ);
    const idealPosition = new Vector3().addVectors(targetPosition, idealOffset);

    // Interpolation douce
    camera.position.lerp(idealPosition, smoothness);

    // La caméra regarde le personnage
    const lookAtPosition = new Vector3(
      targetPosition.x,
      targetPosition.y + 1.5,
      targetPosition.z
    );
    currentLookAt.current.lerp(lookAtPosition, smoothness);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
