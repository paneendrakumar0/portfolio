import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Stars, Line } from '@react-three/drei';
import * as THREE from 'three';

const skillsData = [
  // Core / AI / Robotics
  { id: 'python', name: 'Python', category: 'core', pos: [0, 1.5, 2], img: 'https://cdn.simpleicons.org/python/3776AB', scale: 1.2 },
  { id: 'cpp', name: 'C++', category: 'core', pos: [3, -0.5, 1], img: 'https://cdn.simpleicons.org/cplusplus/00599C', scale: 1.2 },
  { id: 'ros', name: 'ROS', category: 'core', pos: [-2.5, 1, 2.5], img: 'https://cdn.simpleicons.org/ros/22314E', scale: 1.2 },
  
  // AI / ML
  { id: 'tensorflow', name: 'TensorFlow', category: 'ai', pos: [1.5, 3.5, -1], img: 'https://cdn.simpleicons.org/tensorflow/FF6F00', scale: 1.0 },
  { id: 'pytorch', name: 'PyTorch', category: 'ai', pos: [-3, 3, -0.5], img: 'https://cdn.simpleicons.org/pytorch/EE4C2C', scale: 1.0 },
  { id: 'numpy', name: 'NumPy', category: 'data', pos: [-1, 4, -2.5], img: 'https://cdn.simpleicons.org/numpy/013243', scale: 0.9 },
  { id: 'pandas', name: 'Pandas', category: 'data', pos: [1, 5, -3], img: 'https://cdn.simpleicons.org/pandas/150458', scale: 0.9 },
  { id: 'scikit', name: 'Scikit-Learn', category: 'ai', pos: [3.5, 2.5, -2], img: 'https://cdn.simpleicons.org/scikitlearn/F7931E', scale: 0.9 },
  
  // Engineering / CAD
  { id: 'solidworks', name: 'SolidWorks', category: 'cad', pos: [4.5, 0, -1.5], img: '/ICONS/SW.webp', scale: 1.1 },
  { id: 'ansys', name: 'Ansys', category: 'cad', pos: [4, -2.5, 1.5], img: '/ICONS/ANSYS.webp', scale: 1.1 },
  { id: 'adams', name: 'MSC ADAMS', category: 'cad', pos: [6, -1.5, 0.5], img: '/ICONS/MSCADAMS.webp', scale: 1.1 },
  { id: 'autocad', name: 'AutoCAD', category: 'cad', pos: [5, -4, 0], img: '/ICONS/AUTOCAD.webp', scale: 1.0 },
  { id: 'fusion', name: 'Fusion 360', category: 'cad', pos: [2.5, -3.5, 2.5], img: '/ICONS/FUSION.webp', scale: 1.0 },
  
  // Web / Tools
  { id: 'react', name: 'React', category: 'web', pos: [-4.5, -1, 1], img: 'https://cdn.simpleicons.org/react/61DAFB', scale: 0.9 },
  { id: 'tailwind', name: 'Tailwind', category: 'web', pos: [-5, -3, 0], img: 'https://cdn.simpleicons.org/tailwindcss/06B6D4', scale: 0.8 },
  { id: 'git', name: 'Git', category: 'tools', pos: [-2, -2.5, 3], img: 'https://cdn.simpleicons.org/git/F05032', scale: 0.9 },
  { id: 'linux', name: 'Linux', category: 'tools', pos: [-3.5, -4, -1], img: 'https://cdn.simpleicons.org/linux/FCC624', scale: 0.9 },
  { id: 'sql', name: 'SQL', category: 'data', pos: [-2.5, -5, 1.5], img: 'https://cdn.simpleicons.org/mysql/4479A1', scale: 1.0 },
];

const connections = [
  ['python', 'ros'], ['python', 'tensorflow'], ['python', 'pytorch'], ['python', 'numpy'],
  ['cpp', 'ros'], ['cpp', 'solidworks'], ['cpp', 'python'],
  ['ros', 'linux'],
  ['tensorflow', 'pytorch'], ['tensorflow', 'scikit'], ['pytorch', 'numpy'], ['numpy', 'pandas'],
  ['solidworks', 'ansys'], ['solidworks', 'adams'], ['solidworks', 'autocad'], ['autocad', 'fusion'],
  ['react', 'tailwind'], ['react', 'git'], ['linux', 'git'], ['sql', 'python']
];

function NetworkNode({ skill, isHovered, isRelated, onHover, onUnhover }: any) {
  const size = isHovered ? skill.scale * 1.5 : skill.scale;
  
  // Determine opacity based on interaction state
  // If ANY node is hovered, non-related nodes fade out
  const opacityClass = isHovered || isRelated ? 'opacity-100' : 'opacity-30';
  const zIndexClass = isHovered ? 'z-50' : 'z-10';
  const borderColor = isHovered ? 'border-cyan-400' : isRelated ? 'border-purple-400' : 'border-white/10';
  const glow = isHovered ? 'shadow-[0_0_30px_rgba(34,211,238,0.5)]' : isRelated ? 'shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'shadow-xl';

  return (
    <group position={skill.pos as [number, number, number]}>
      <Html transform distanceFactor={15} zIndexRange={[100, 0]}>
        <div 
          className={`flex flex-col items-center justify-center relative group transition-all duration-500 ease-out ${opacityClass} ${zIndexClass}`}
          style={{ 
              width: `${75 * size}px`,
              height: `${75 * size}px`,
              cursor: 'pointer',
          }}
          onMouseEnter={() => onHover(skill.id)}
          onMouseLeave={onUnhover}
        >
          {/* Glass Node Body */}
          <div className={`w-full h-full p-3 bg-black/60 backdrop-blur-md rounded-2xl border ${borderColor} ${glow} flex items-center justify-center transition-all duration-300 ${isHovered ? 'scale-110 bg-black/80' : ''}`}>
            <img 
              src={skill.img} 
              alt={skill.name} 
              className="w-full h-full object-contain pointer-events-none transition-transform duration-300"
              style={{ filter: isHovered || isRelated ? 'drop-shadow(0 0 10px rgba(255,255,255,0.8))' : 'none' }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
          
          {/* Futuristic Label */}
          <div className={`absolute -bottom-10 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
            <span className="bg-[#0a0a0a] text-cyan-400 text-xs font-bold px-3 py-1.5 rounded-full border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.4)] tracking-widest uppercase whitespace-nowrap">
              {skill.name}
            </span>
          </div>
        </div>
      </Html>
    </group>
  );
}

function NetworkLines({ activeNode }: { activeNode: string | null }) {
  const lineGeometry = useMemo(() => {
    return connections.map(([id1, id2]) => {
      const node1 = skillsData.find(s => s.id === id1);
      const node2 = skillsData.find(s => s.id === id2);
      if (!node1 || !node2) return null;
      
      const isHighlighted = activeNode === id1 || activeNode === id2;
      const isFaded = activeNode !== null && !isHighlighted;
      
      const color = isHighlighted ? '#22d3ee' : '#333333';
      const lineWidth = isHighlighted ? 2 : 1;
      const opacity = isFaded ? 0.1 : isHighlighted ? 0.8 : 0.3;

      return {
        points: [new THREE.Vector3(...node1.pos), new THREE.Vector3(...node2.pos)],
        color,
        lineWidth,
        opacity
      };
    }).filter(Boolean);
  }, [activeNode]);

  return (
    <group>
      {lineGeometry.map((line: any, i) => (
        <Line 
          key={i} 
          points={line.points} 
          color={line.color} 
          lineWidth={line.lineWidth} 
          transparent 
          opacity={line.opacity} 
        />
      ))}
    </group>
  );
}

function NeuralGraph() {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Determine related nodes for highlight logic
  const relatedNodes = useMemo(() => {
    if (!hoveredNode) return new Set<string>();
    const related = new Set<string>();
    related.add(hoveredNode);
    connections.forEach(([n1, n2]) => {
      if (n1 === hoveredNode) related.add(n2);
      if (n2 === hoveredNode) related.add(n1);
    });
    return related;
  }, [hoveredNode]);

  useFrame((state, delta) => {
    if (groupRef.current && !hoveredNode) {
      // Gentle, complex rotation to simulate a floating organism
      groupRef.current.rotation.y += delta * 0.05;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      groupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.15) * 0.05;
    } else if (groupRef.current && hoveredNode) {
      // Very slow drift when inspecting
      groupRef.current.rotation.y += delta * 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      <NetworkLines activeNode={hoveredNode} />
      {skillsData.map((skill) => (
        <NetworkNode 
          key={skill.id} 
          skill={skill} 
          isHovered={hoveredNode === skill.id}
          isRelated={hoveredNode !== null ? relatedNodes.has(skill.id) : true} // If nothing is hovered, everything is 'related' (visible)
          onHover={setHoveredNode}
          onUnhover={() => setHoveredNode(null)}
        />
      ))}
    </group>
  );
}

export function FloatingSkills() {
  return (
    <div className="w-full h-[700px] relative">
      {/* HUD Overlay Text */}
      <div className="absolute top-8 left-8 z-10 pointer-events-none hidden md:block">
        <div className="text-cyan-500/50 font-mono text-[10px] tracking-[0.3em] uppercase mb-1">System Architecture</div>
        <div className="text-white/40 font-mono text-xs">Neural Node Graph v2.0</div>
      </div>
      
      <Canvas camera={{ position: [0, 0, 16], fov: 45 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={1.5} />
        
        {/* Subtle background particles */}
        <Stars radius={50} depth={50} count={2000} factor={2} saturation={0} fade speed={0.5} />
        
        <NeuralGraph />
      </Canvas>
    </div>
  );
}