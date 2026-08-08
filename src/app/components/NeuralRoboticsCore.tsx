import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Icosahedron, Sphere, MeshDistortMaterial, Points, PointMaterial, Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Core() {
  const coreRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.2;
      coreRef.current.rotation.x += delta * 0.1;
    }
  });

  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Icosahedron ref={coreRef} args={[1, 1]} scale={1.8}>
          <MeshDistortMaterial
            color="#06b6d4" 
            envMapIntensity={1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            metalness={0.8}
            roughness={0.2}
            distort={0.4}
            speed={2}
            wireframe
          />
        </Icosahedron>
        
        {/* Inner solid glowing core */}
        <Sphere args={[1.2, 32, 32]}>
          <meshBasicMaterial color="#082f49" transparent opacity={0.7} />
        </Sphere>
      </Float>
      
      {/* Surrounding particle field */}
      <ParticleRing />
    </group>
  );
}

function ParticleRing() {
  const ref = useRef<THREE.Points>(null);
  
  // Generate random points in a sphere
  const particles = useMemo(() => {
    const temp = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = 3 + Math.random() * 2; // Radius between 3 and 5
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      temp[i * 3] = x;
      temp[i * 3 + 1] = y;
      temp[i * 3 + 2] = z;
    }
    return temp;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#22d3ee" size={0.03} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </group>
  );
}

export function NeuralRoboticsCore() {
  return (
    <div className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing z-0">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#06b6d4" />
        <Core />
        <Environment preset="city" />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
      </Canvas>
    </div>
  );
}
