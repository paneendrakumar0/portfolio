import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows } from '@react-three/drei';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import * as THREE from 'three';

function DroneModel({ springX, springY }: { springX: any, springY: any }) {
  const mesh = useRef<THREE.Group>(null!);
  // Ensure dji_mavic_2_pro.glb is in your /public folder
  const { scene } = useGLTF('/drone2.glb');
  const [rotors, setRotors] = useState<THREE.Object3D[]>([]);

  useEffect(() => {
    const found: THREE.Object3D[] = [];
    scene.traverse((node) => {
      // 1. FIX WHITE TEXTURES: Ensure materials react to light
      if ((node as THREE.Mesh).isMesh) {
        const material = node.material as THREE.MeshStandardMaterial;
        material.roughness = 0.3;
        material.metalness = 0.7;
        node.castShadow = true;
      }

      // 2. MAVIC NAMING: DJI models usually use "propeller"
      const name = node.name.toLowerCase();
      if (name.includes('propeller') || name.includes('rotor') || name.includes('blade')) {
        found.push(node);
      }
    });
    setRotors(found);
  }, [scene]);

  useFrame((state) => {
    if (!mesh.current) return;

    // Fast Propeller Spin
    rotors.forEach((rotor) => {
      rotor.rotation.y += 1.2; 
    });

    // Flight Tilt Physics
    const velX = springX.getVelocity() / 1500;
    const velY = springY.getVelocity() / 1500;
    
    mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, -Math.PI / 2 + velY, 0.1);
    mesh.current.rotation.z = THREE.MathUtils.lerp(mesh.current.rotation.z, -velX, 0.1);

    // Realistic Hover
    mesh.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.1;
  });

  return (
    <primitive 
      ref={mesh} 
      object={scene} 
      scale={0.2} // Small Mavic size
      rotation={[-Math.PI / 2, 0, 0]} 
    />
  );
}

export function DroneFollower() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 40); 
      mouseY.set(e.clientY - 40);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-48 h-48 z-15 pointer-events-none hidden lg:block"
      style={{ x: springX, y: springY }}
    >
      <Canvas camera={{ position: [0, 3, 0], fov: 35 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} /> 
          <spotLight position={[10, 10, 10]} intensity={2.5} penumbra={1} />
          <pointLight position={[-5, 5, -5]} intensity={1.5} color="#22d3ee" />
          
          <DroneModel springX={springX} springY={springY} />
          <Environment preset="city" />
          <ContactShadows position={[0, -0.6, 0]} opacity={0.5} scale={6} blur={2.5} far={1} />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}

useGLTF.preload('/drone2.glb');