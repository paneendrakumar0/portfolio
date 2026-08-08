import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html, Stars, Environment, Line } from '@react-three/drei';
import * as THREE from 'three';

// Grouping skills by category to assign to different orbits
const orbitGroups = [
  {
    radius: 6,
    speed: 0.3,
    color: '#06b6d4', // Cyan
    items: [
      { id: 'python', name: 'Python', scale: 1.2, img: 'https://cdn.simpleicons.org/python/3776AB' },
      { id: 'cpp', name: 'C++', scale: 1.2, img: 'https://cdn.simpleicons.org/cplusplus/00599C' },
      { id: 'ros', name: 'ROS', scale: 1.2, img: 'https://cdn.simpleicons.org/ros/22314E' },
      { id: 'matlab', name: 'MATLAB', scale: 1.2, img: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Matlab_Logo.png' },
      { id: 'sql', name: 'SQL', scale: 1.2, img: 'https://cdn.simpleicons.org/mysql/4479A1' },
    ]
  },
  {
    radius: 10.5,
    speed: -0.2,
    color: '#a855f7', // Purple
    items: [
      { id: 'solidworks', name: 'SolidWorks', scale: 1.2, img: '/ICONS/SW.webp' },
      { id: 'ansys', name: 'Ansys', scale: 1.2, img: '/ICONS/ANSYS.webp' },
      { id: 'adams', name: 'MSC ADAMS', scale: 1.2, img: '/ICONS/MSCADAMS.webp' },
      { id: 'autocad', name: 'AutoCAD', scale: 1.2, img: '/ICONS/AUTOCAD.webp' },
      { id: 'fusion', name: 'Fusion 360', scale: 1.2, img: '/ICONS/FUSION.webp' },
    ]
  },
  {
    radius: 15,
    speed: 0.15,
    color: '#ec4899', // Pink
    items: [
      { id: 'tensorflow', name: 'TensorFlow', scale: 0.8, img: 'https://cdn.simpleicons.org/tensorflow/FF6F00' },
      { id: 'pytorch', name: 'PyTorch', scale: 0.8, img: 'https://cdn.simpleicons.org/pytorch/EE4C2C' },
      { id: 'scikit', name: 'Scikit-Learn', scale: 0.8, img: 'https://cdn.simpleicons.org/scikitlearn/F7931E' },
      { id: 'numpy', name: 'NumPy', scale: 0.8, img: 'https://cdn.simpleicons.org/numpy/013243' },
      { id: 'pandas', name: 'Pandas', scale: 0.8, img: 'https://cdn.simpleicons.org/pandas/150458' },
      { id: 'react', name: 'React', scale: 0.8, img: 'https://cdn.simpleicons.org/react/61DAFB' },
      { id: 'tailwind', name: 'Tailwind', scale: 0.7, img: 'https://cdn.simpleicons.org/tailwindcss/06B6D4' },
      { id: 'git', name: 'Git', scale: 0.9, img: 'https://cdn.simpleicons.org/git/F05032' },
      { id: 'linux', name: 'Linux', scale: 0.9, img: 'https://cdn.simpleicons.org/linux/FCC624' },
    ]
  }
];

function OrbitRing({ radius, color }: { radius: number, color: string }) {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return pts;
  }, [radius]);

  return (
    <Line points={points} color={color} opacity={0.2} transparent lineWidth={1} />
  );
}

function OrbitalGroup({ groupData }: { groupData: typeof orbitGroups[0] }) {
  const groupRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);

  useFrame((state, delta) => {
    if (groupRef.current && !isHovered) {
      groupRef.current.rotation.y += groupData.speed * delta;
    }
  });

  return (
    <group>
      <OrbitRing radius={groupData.radius} color={groupData.color} />
      <group ref={groupRef}>
        {groupData.items.map((skill, index) => {
          const angle = (index / groupData.items.length) * Math.PI * 2;
          const x = Math.cos(angle) * groupData.radius;
          const z = Math.sin(angle) * groupData.radius;
          return (
            <FloatingIcon 
              key={skill.id} 
              skill={skill} 
              position={[x, 0, z]} 
              onHoverChange={setIsHovered} 
            />
          );
        })}
      </group>
    </group>
  );
}

function FloatingIcon({ skill, position, onHoverChange }: { skill: any, position: [number, number, number], onHoverChange: (h: boolean) => void }) {
  const [hovered, setHover] = useState(false);
  
  const handlePointerEnter = () => {
    setHover(true);
    onHoverChange(true);
  };
  
  const handlePointerLeave = () => {
    setHover(false);
    onHoverChange(false);
  };

  const size = hovered ? skill.scale * 1.5 : skill.scale;

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={2}>
        <Html transform distanceFactor={15}>
          <div 
            className="flex flex-col items-center justify-center relative group"
            style={{ 
                width: `${90 * size}px`,
                height: `${90 * size}px`,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
            onMouseEnter={handlePointerEnter}
            onMouseLeave={handlePointerLeave}
          >
            <div className={`w-full h-full p-3 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl flex items-center justify-center transition-all duration-300 ${hovered ? 'border-cyan-400 bg-black/80 shadow-[0_0_30px_rgba(34,211,238,0.4)]' : ''}`}>
              <img 
                src={skill.img} 
                alt={skill.name} 
                className={`w-full h-full object-contain pointer-events-none transition-transform duration-300 ${hovered ? 'scale-110' : ''}`}
                style={{ filter: hovered ? 'drop-shadow(0 0 10px rgba(255,255,255,0.8))' : 'none' }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            
            {/* Glowing Label */}
            <div className={`absolute -bottom-12 transition-all duration-300 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
              <span className="bg-black/90 text-cyan-400 text-xs font-bold px-4 py-2 rounded-full border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.3)] tracking-widest uppercase whitespace-nowrap backdrop-blur-md">
                {skill.name}
              </span>
            </div>
          </div>
        </Html>
      </Float>
    </group>
  );
}

export function FloatingSkills() {
  return (
    <div className="w-full h-[700px] relative">
      <Canvas camera={{ position: [0, 8, 28], fov: 50 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={1.2} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        
        {/* Deep space background particles */}
        <Stars radius={100} depth={50} count={3000} factor={3} saturation={0} fade speed={1} />
        
        <group rotation={[0.2, 0, 0]}>
          {orbitGroups.map((group, i) => (
            <OrbitalGroup key={i} groupData={group} />
          ))}
          
          {/* Central Glowing Core */}
          <Float speed={3} rotationIntensity={1} floatIntensity={2}>
            <mesh>
              <icosahedronGeometry args={[1.5, 0]} />
              <meshBasicMaterial color="#082f49" wireframe />
            </mesh>
            <mesh>
              <sphereGeometry args={[1, 32, 32]} />
              <meshBasicMaterial color="#22d3ee" transparent opacity={0.2} />
            </mesh>
          </Float>
        </group>

        <Environment preset="city" />
        <CameraOscillator />
      </Canvas>
    </div>
  );
}

function CameraOscillator() {
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Gentle camera drift
    state.camera.position.x = Math.sin(t * 0.2) * 5;
    state.camera.position.y = 8 + Math.cos(t * 0.15) * 2;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}