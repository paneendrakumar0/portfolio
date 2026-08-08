import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html, Stars, Environment } from '@react-three/drei';
import * as THREE from 'three';

// --- UPDATED SKILLS DATA (Gazebo & MoveIt Removed) ---
const skills = [
  // --- Engineering, Design & Simulation (Core Skills - Scale 1.2) ---
  { id: 'solidworks', name: 'SolidWorks', scale: 1.2, img: '/ICONS/SW.webp' },
  { id: 'ansys', name: 'Ansys', scale: 1.2, img: '/ICONS/ANSYS.webp' },
  { id: 'adams', name: 'MSC ADAMS', scale: 1.2, img: '/ICONS/MSCADAMS.webp' },
  { id: 'autocad', name: 'AutoCAD', scale: 1.2, img: '/ICONS/AUTOCAD.webp' },
  { id: 'fusion', name: 'Fusion 360', scale: 1.2, img: '/ICONS/FUSION.webp' },

  // --- Robotics & Programming (Core Skills - Scale 1.2) ---
  { id: 'python', name: 'Python', scale: 1.2, img: 'https://cdn.simpleicons.org/python/3776AB' },
  { id: 'cpp', name: 'C++', scale: 1.2, img: 'https://cdn.simpleicons.org/cplusplus/00599C' },
  { id: 'ros', name: 'ROS', scale: 1.2, img: 'https://cdn.simpleicons.org/ros/22314E' },
  { id: 'matlab', name: 'MATLAB', scale: 1.2, img: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Matlab_Logo.png' },
  { id: 'sql', name: 'SQL', scale: 1.2, img: 'https://cdn.simpleicons.org/mysql/4479A1' },
  { id: 'html', name: 'HTML', scale: 1.2, img: 'https://cdn.simpleicons.org/html5/E34F26' },
  { id: 'css', name: 'CSS', scale: 1.2, img: '/ICONS/CSS.webp' },
  { id: 'js', name: 'JavaScript', scale: 1.2, img: 'https://cdn.simpleicons.org/javascript/F7DF1E' },
  
  // --- AI, Tools & Web Libraries (Smaller Hierarchy - Scale 0.7 to 0.9) ---
  { id: 'tensorflow', name: 'TensorFlow', scale: 0.8, img: 'https://cdn.simpleicons.org/tensorflow/FF6F00' },
  { id: 'pytorch', name: 'PyTorch', scale: 0.8, img: 'https://cdn.simpleicons.org/pytorch/EE4C2C' },
  { id: 'numpy', name: 'NumPy', scale: 0.8, img: 'https://cdn.simpleicons.org/numpy/013243' },
  { id: 'pandas', name: 'Pandas', scale: 0.8, img: 'https://cdn.simpleicons.org/pandas/150458' },
  { id: 'scikit', name: 'Scikit-Learn', scale: 0.8, img: 'https://cdn.simpleicons.org/scikitlearn/F7931E' },
  { id: 'react', name: 'React', scale: 0.8, img: 'https://cdn.simpleicons.org/react/61DAFB' },
  { id: 'tailwind', name: 'Tailwind', scale: 0.7, img: 'https://cdn.simpleicons.org/tailwindcss/06B6D4' },
  { id: 'git', name: 'Git', scale: 0.9, img: 'https://cdn.simpleicons.org/git/F05032' },
  { id: 'linux', name: 'Linux', scale: 0.9, img: 'https://cdn.simpleicons.org/linux/FCC624' },
];

function FloatingIcon({ skill, index, total }: { skill: any, index: number, total: number }) {
  const [hovered, setHover] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  const position = useMemo(() => {
    const phi = Math.acos(-1 + (2 * index) / total);
    const theta = Math.sqrt(total * Math.PI) * phi;
    const r = 9.5; // Radius of the sphere
    return new THREE.Vector3(
      r * Math.cos(theta) * Math.sin(phi) * 1.7, // Widescreen X-stretch
      r * Math.sin(theta) * Math.sin(phi),
      r * Math.cos(phi)
    );
  }, [index, total]);

  const initialX = index % 2 === 0 ? -70 : 70; 

  useFrame(() => {
    if (!groupRef.current) return;
    // Entrance Animation Lerp
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, position.x, 0.04);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, position.y, 0.04);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, position.z, 0.04);
  });

  const size = hovered ? skill.scale * 1.3 : skill.scale;

  return (
    <group ref={groupRef} position={[initialX, 0, 0]}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
        <Html transform distanceFactor={10}>
          <div 
            className="flex flex-col items-center justify-center"
            style={{ 
                width: `${90 * size}px`,
                height: `${90 * size}px`,
                cursor: 'pointer',
                transition: 'transform 0.3s ease'
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <div className={`w-full h-full p-3 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl flex items-center justify-center transition-all ${hovered ? 'border-cyan-400 bg-black/60 shadow-cyan-500/20 scale-110' : ''}`}>
              <img 
                src={skill.img} 
                alt={skill.name} 
                className="w-full h-full object-contain pointer-events-none"
                style={{ filter: hovered ? 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' : 'none' }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            {hovered && (
              <span className="absolute -bottom-10 bg-black/80 text-cyan-400 text-[10px] font-bold px-3 py-1 rounded-full border border-cyan-500/30 tracking-widest uppercase whitespace-nowrap">
                {skill.name}
              </span>
            )}
          </div>
        </Html>
      </Float>
    </group>
  );
}

export function FloatingSkills() {
  return (
    <div className="w-full h-[600px] relative">
      <Canvas camera={{ position: [0, 0, 22], fov: 50 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={1.2} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        
        <group>
          {skills.map((skill, i) => (
            <FloatingIcon key={skill.id} skill={skill} index={i} total={skills.length} />
          ))}
        </group>

        <Environment preset="city" />
        <CloudRotator />
      </Canvas>
    </div>
  );
}

function CloudRotator() {
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // SPEED: 0.45 (slightly faster oscillation)
    // AMPLITUDE: 9 (Even wider horizontal swing for high impact)
    state.camera.position.x = Math.sin(t * 0.45) * 9;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}