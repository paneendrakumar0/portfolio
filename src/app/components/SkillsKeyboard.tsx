import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Image, Float, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';

// --- DATA: SKILL ICONS (Stable Links) ---
const skills = [
  { id: 'react', img: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg' },
  { id: 'ts', img: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg' },
  { id: 'js', img: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png' },
  { id: 'next', img: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg' },
  { id: 'node', img: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg' },
  { id: 'three', img: 'https://global.discourse-cdn.com/standard17/uploads/threejs/original/2X/e/e4f86d2200d2d35c30f7b1494e96b9595ebc2751.png' },
  { id: 'python', img: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg' },
  { id: 'aws', img: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg' },
  { id: 'git', img: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Git-logo.svg' },
  { id: 'tailwind', img: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg' },
  { id: 'figma', img: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg' },
  { id: 'docker', img: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_engine%29_logo.svg' },
  { id: 'cpp', img: 'https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg' },
  { id: 'ros', img: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/ROS_logo.svg' }, // Robotics
];

// --- INDIVIDUAL FLOATING ICON ---
function FloatingIcon({ url, index, total }: { url: string, index: number, total: number }) {
  const mesh = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);

  // 1. CALCULATE RANDOM POSITION (Spherical Cloud)
  const position = useMemo(() => {
    const phi = Math.acos(-1 + (2 * index) / total);
    const theta = Math.sqrt(total * Math.PI) * phi;
    const r = 6; // Radius of the cloud
    
    // Spread them out
    return new THREE.Vector3(
      r * Math.cos(theta) * Math.sin(phi) * 1.5, // Wider on X axis
      r * Math.sin(theta) * Math.sin(phi),
      r * Math.cos(phi)
    );
  }, [index, total]);

  // 2. ENTRANCE ANIMATION LOGIC
  // Determine if it comes from Left or Right side based on index
  const startX = index % 2 === 0 ? -25 : 25; 
  
  useFrame((state) => {
    if (!mesh.current) return;

    // A. Entrance Animation: Lerp from startX to actual position
    // We use a simple lerp that gets faster over time (ease-out feel)
    mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, position.x, 0.05);
    mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, position.y, 0.05);
    mesh.current.position.z = THREE.MathUtils.lerp(mesh.current.position.z, position.z, 0.05);

    // B. Look at Camera (Billboard effect)
    mesh.current.lookAt(state.camera.position);
    
    // C. Hover Scale
    const scale = hovered ? 1.5 : 1;
    mesh.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
  });

  return (
    <group 
      ref={mesh} 
      position={[startX, (Math.random() - 0.5) * 20, 0]} // STARTING POSITION (Off-screen)
    >
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Image 
          url={url} 
          transparent 
          scale={[1.2, 1.2]} // Size of icons
          opacity={0.9}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; setHover(true); }}
          onPointerOut={() => { document.body.style.cursor = 'auto'; setHover(false); }}
        />
      </Float>
    </group>
  );
}

// --- SCENE ---
function IconCloud() {
  return (
    <group>
      {skills.map((skill, i) => (
        <FloatingIcon key={skill.id} url={skill.img} index={i} total={skills.length} />
      ))}
    </group>
  );
}

// --- MAIN COMPONENT ---
export function FloatingSkills() {
  return (
    <div className="w-full h-[500px] relative">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }} gl={{ alpha: true }}>
        <color attach="background" args={['transparent']} />
        
        {/* Cinematic Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00d8ff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ff00ff" />
        
        {/* Stars for Space Vibe */}
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

        <IconCloud />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}