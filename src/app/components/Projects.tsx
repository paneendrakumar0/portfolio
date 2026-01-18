import React, { useRef, useState, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Image, Text, useScroll, ScrollControls, Environment, Stars, Sparkles, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Terminal, Rocket, X, Github, ExternalLink, Tag, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- TYPES & DATA ---
export interface Project {
  id: number;
  title: string;
  category: 'Software' | 'Hardware';
  tech: string[];
  image: string;
  description: string;
  fullDescription: string;
  stats: { label: string; value: string }[];
  github: string;
  demo: string;
  color: string;
}

const projects: Project[] = [
  { id: 1, title: 'Autonomous Delivery Bot', category: 'Hardware', tech: ['ROS 2', 'Lidar', 'Python', 'Raspberry Pi'], image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop', description: 'ROS-2 based indoor navigation robot.', fullDescription: 'This project represents a deep dive into hardware architecture. It overcomes significant challenges in latency and state management. The bot uses SLAM to navigate autonomously.', stats: [{ label: 'Ongoing', value: '100%' }, { label: 'Year', value: '2026' }], github: '#', demo: '#', color: '#fbbf24' },
  { id: 2, title: 'Hybrid Racing Controller', category: 'Hardware', tech: ['Arduino', 'Potentiometer', 'OpenCV', 'Python'], image: 'https://images.unsplash.com/photo-1593118247619-e2d6f056869e?q=80&w=1000&auto=format&fit=crop', description: 'Physical Wheel + AI Gestures.', fullDescription: 'A unique hybrid game controller combining hardware precision with CV gesture tracking.', stats: [{ label: 'Input Lag', value: '<20ms' }, { label: 'Year', value: '2026' }], github: 'https://github.com/paneendrakumar0/Hybrid-Racing-Sim', demo: '#', color: '#ef4444' },
  { id: 3, title: 'Robotic Hand Sim', category: 'Software', tech: ['ROS 2', 'Rviz2', 'OpenCV', 'URDF'], image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop', description: 'Vision-based Teleoperation.', fullDescription: 'A digital twin simulation of a robotic hand in Rviz2 using MediaPipe for hand tracking.', stats: [{ label: 'Joints', value: '21' }, { label: 'Year', value: '2026' }], github: 'https://github.com/paneendrakumar0/Robotic-Hand-Simulation-in-ROS2', demo: '#', color: '#8b5cf6' },
  { id: 4, title: 'Gesture Control Rover', category: 'Hardware', tech: ['OpenCV', 'Arduino', 'Python'], image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=1000&auto=format&fit=crop', description: 'Hand-tracking rover interface.', fullDescription: 'A 4-wheeled rover piloted purely by hand gestures transmitted via UDP.', stats: [{ label: 'Latency', value: '<50ms' }, { label: 'Year', value: '2025' }], github: '#', demo: '#', color: '#a78bfa' },
  { id: 5, title: 'Amazon Prime Clone', category: 'Software', tech: ['React', 'Firebase', 'Tailwind'], image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1000&auto=format&fit=crop', description: 'Pixel-perfect replica.', fullDescription: 'A responsive web application replicating core Prime Video functionality.', stats: [{ label: 'Completion', value: '100%' }, { label: 'Year', value: '2025' }], github: 'https://github.com/paneendrakumar0', demo: '#', color: '#22d3ee' },
  { id: 6, title: 'Waste AI Sorter', category: 'Hardware', tech: ['TensorFlow Lite', 'ESP32', 'Servos'], image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000&auto=format&fit=crop', description: 'IoT Bio/Non-Bio classification.', fullDescription: 'An intelligent waste bin using ESP32-CAM and TensorFlow Lite.', stats: [{ label: 'Accuracy', value: '94%' }, { label: 'Year', value: '2024' }], github: '#', demo: '#', color: '#f472b6' },
  { id: 7, title: 'Kanban Board', category: 'Software', tech: ['React', 'Drag & Drop API'], image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=1939&auto=format&fit=crop', description: 'Productivity tool.', fullDescription: 'A Trello-style task management app with fluid drag-and-drop.', stats: [{ label: 'Users', value: 'Active' }, { label: 'Year', value: '2025' }], github: '#', demo: '#', color: '#34d399' },
  { id: 8, title: 'Color Palette Gen', category: 'Software', tech: ['Algorithms', 'JavaScript'], image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop', description: 'Algorithmic color tool.', fullDescription: 'Generates harmonious color palettes based on math.', stats: [{ label: 'Colors', value: 'Infinite' }, { label: 'Year', value: '2024' }], github: '#', demo: '#', color: '#60a5fa' }
];

// --- COMPONENTS ---
function ProjectModal({ project, onClose }: { project: Project | null, onClose: () => void }) {
  useEffect(() => {
    if (project) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [project]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-xl" onClick={onClose}>
        <motion.div layoutId={`project-${project.id}`} initial={{ scale: 0.9, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 30, opacity: 0 }} className="relative bg-[#050505] border border-white/10 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 border border-white/10 hover:bg-white/20 transition-all text-white group"><X className="w-6 h-6 group-hover:rotate-90 transition-transform" /></button>
          <div className="relative h-48 md:h-96 w-full shrink-0">
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
            <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-80" />
            <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 z-20">
              <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider border backdrop-blur-md mb-2 md:mb-4 ${project.category === 'Software' ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'bg-amber-500/20 border-amber-500/50 text-amber-400'}`}>{project.category}</span>
              <h2 className="text-2xl md:text-5xl font-bold text-white tracking-tight">{project.title}</h2>
            </div>
          </div>
          <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar">
            <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
              <div className="flex-1 space-y-6">
                <div><h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-4">Overview</h3><p className="text-gray-300 text-base md:text-lg leading-relaxed">{project.fullDescription}</p></div>
                <div className="flex flex-wrap gap-4 pt-2">
                  <a href={project.github} target="_blank" rel="noreferrer" className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-semibold hover:bg-white/10 transition-all"><Github className="w-5 h-5" /> Code</a>
                  <a href={project.demo} target="_blank" rel="noreferrer" className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl text-white font-bold shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all"><ExternalLink className="w-5 h-5" /> Demo</a>
                </div>
              </div>
              <div className="w-full lg:w-80 space-y-6">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5"><h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Tag className="w-4 h-4" /> Tech</h3><div className="flex flex-wrap gap-2">{project.tech.map(t => (<span key={t} className="px-2 py-1 bg-black/40 border border-white/10 rounded-lg text-[10px] text-gray-300 font-mono">{t}</span>))}</div></div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5"><h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Layers className="w-4 h-4" /> Stats</h3><div className="grid grid-cols-2 gap-4">{project.stats.map((stat, i) => (<div key={i}><div className="text-xl font-bold text-white">{stat.value}</div><div className="text-[10px] uppercase tracking-wider text-gray-500">{stat.label}</div></div>))}</div></div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function RealSpaceship({ mode }: { mode: string }) {
  const group = useRef<THREE.Group>(null);
  const engineRef = useRef<THREE.PointLight>(null);
  // SSR Check for mobile to prevent build crashes
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  
  // Use a simple box as fallback if GLTF fails, or try loading your model
  // Note: Ensure /spaceship.glb exists in public folder
  const { scene } = useGLTF('/spaceship.glb'); 

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const mouseX = state.pointer.x;
    const mouseY = state.pointer.y;

    if (mode === 'fly') {
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -mouseX * 1.2, 0.1);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0.2 - mouseY * 0.8, 0.1);
      group.current.position.y = (isMobile ? -1 : -2) + Math.sin(t * 60) * 0.01;
    } else {
      group.current.position.y = -2 + Math.sin(t * 1.5) * 0.08;
      group.current.rotation.z = Math.sin(t * 0.8) * 0.03;
      group.current.rotation.x = 0.1; 
    }

    if (engineRef.current) {
      const targetColor = mode === 'fly' ? '#ff5500' : '#00aaff';
      engineRef.current.color.lerp(new THREE.Color(targetColor), 0.1);
      engineRef.current.intensity = THREE.MathUtils.lerp(engineRef.current.intensity, (mode === 'fly' ? 20 : 3) + Math.sin(t * 40) * 5, 0.2);
    }
  });

  return (
    <group ref={group} position={[0, -2, -3]}>
      <group rotation={[0, Math.PI, 0]} scale={isMobile ? [0.1, 0.1, 0.1] : [0.15, 0.15, 0.15]}> 
        <primitive object={scene} />
      </group>
      <pointLight ref={engineRef} position={[0, 1, 4]} distance={25} decay={2} />
      {mode === 'fly' && (
        <group position={[0, 0.5, 3.5]}>
          <Sparkles count={50} scale={[0.5, 0.5, 2]} size={20} speed={10} color="#ff4400" />
        </group>
      )}
    </group>
  );
}

function ProjectCard({ project, hovered, setHover, onOpen, scale = 1 }: any) {
  const mesh = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!mesh.current) return;
    const targetScale = scale * (hovered === project.id ? 1.1 : 1); 
    mesh.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
    mesh.current.lookAt(state.camera.position);
  });

  return (
    <group ref={mesh} onClick={(e) => { e.stopPropagation(); onOpen(project); }} onPointerOver={() => setHover(project.id)} onPointerOut={() => setHover(null)}>
      <mesh position={[0, 0, -0.05]}><planeGeometry args={[12, 7.5]} /><meshBasicMaterial color="#000" transparent opacity={0.8} /></mesh>
      <mesh position={[0, 0, -0.01]}><planeGeometry args={[11.8, 7.3]} /><meshBasicMaterial color={project.color} wireframe /></mesh>
      <Image url={project.image} scale={[11.6, 7.1]} transparent opacity={hovered === project.id ? 1 : 0.7} toneMapped={false} />
      <group position={[0, -4.5, 0]}>
        <Text fontSize={0.8} color="white" anchorX="center" anchorY="top" outlineWidth={0.04} outlineColor="black">{project.title}</Text>
      </group>
    </group>
  );
}

function AnimatedProject({ project, targetPos, hovered, setHover, onOpen, scale }: any) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if(!group.current) return;
    group.current.position.lerp(new THREE.Vector3(...targetPos), delta * 2.5);
  });
  return <group ref={group}><ProjectCard project={project} hovered={hovered} setHover={setHover} onOpen={onOpen} scale={scale} /></group>;
}

function Experience({ mode, isRearView, onOpenModal }: any) {
  const scroll = useScroll();
  const [hovered, setHover] = useState<number | null>(null);
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));
  
  // SSR Safe Mobile Check
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const { pointer } = state;

    if (mode === 'orbit') {
      const angle = t * 0.1;
      const radius = isMobile ? 25 : 22;
      state.camera.position.lerp(new THREE.Vector3(Math.sin(angle) * radius, 5, Math.cos(angle) * radius), delta);
      state.camera.lookAt(0, 0, 0);
    } 
    else if (mode === 'fly') {
      const depth = 5 - (scroll.offset * (isMobile ? 350 : 250)); 
      const steerX = pointer.x * (isMobile ? 10 : 15); 
      const steerY = pointer.y * (isMobile ? 6 : 8);
      const targetPos = new THREE.Vector3(steerX, steerY, depth);
      state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, isMobile ? 95 : 85, delta); 
      state.camera.updateProjectionMatrix();
      state.camera.position.lerp(targetPos, delta * 3);
      const lookZ = isRearView ? depth + 50 : depth - 50;
      lookTarget.current.lerp(new THREE.Vector3(steerX * 0.8, steerY * 0.8, lookZ), delta * 3);
      state.camera.lookAt(lookTarget.current);
    }
  });

  const targetPositions = useMemo(() => {
    return projects.map((project, i) => {
      if (mode === 'orbit') {
        const angle = (i / Math.min(projects.length, 6)) * Math.PI * 2;
        return [Math.sin(angle) * 18, 0, Math.cos(angle) * 18];
      } else {
        const side = project.category === 'Software' ? -1 : 1;
        // On mobile, increase vertical spacing (yOffset) to prevent stacking collisions
        const yOffset = isMobile ? (i % 2 === 0 ? 6 : -6) : 0;
        const xOffset = isMobile ? (side * 6) : (side * 15);
        return [xOffset, yOffset, -i * 50];
      }
    });
  }, [mode, isMobile]);

  return (
    <group>
      <ambientLight intensity={0.5} />
      {projects.map((project, i) => (
        <AnimatedProject key={i} project={project} targetPos={targetPositions[i]} hovered={hovered} setHover={setHover} onOpen={onOpenModal} scale={isMobile ? 0.6 : 1} />
      ))}
      <ThreeHUD mode={mode} isRearView={isRearView} />
      <Stars radius={200} count={isMobile ? 3000 : 10000} speed={mode === 'fly' ? 10 : 1} />
    </group>
  );
}

function ThreeHUD({ mode, isRearView }: any) {
  const { camera } = useThree();
  const group = useRef<THREE.Group>(null);
  const shipRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if(group.current) {
      group.current.position.copy(camera.position);
      group.current.rotation.copy(camera.rotation);
      group.current.translateZ(-4.5); 
      group.current.translateY(-1.8);
    }
    if(shipRef.current) {
      const targetY = isRearView ? -8 : 0; 
      shipRef.current.position.y = THREE.MathUtils.lerp(shipRef.current.position.y, targetY, delta * 5);
    }
  });
  return <group ref={group}><group ref={shipRef}><RealSpaceship mode={mode} /></group></group>;
}

export function Projects() {
  const [mode, setMode] = useState<'orbit' | 'fly'>('orbit'); 
  const [isRearView, setIsRearView] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="h-screen w-full bg-black relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full p-4 md:p-8 z-20 pointer-events-none">
        <h2 className="text-[10px] md:text-sm font-mono text-cyan-500 mb-1 tracking-widest uppercase flex items-center gap-2"><Terminal className="w-4 h-4" /> System.Space_Command</h2>
        <h1 className="text-2xl md:text-6xl font-black text-white tracking-tighter">MISSION <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-600">CONTROL</span></h1>
      </div>
      <AnimatePresence>
        {mode === 'orbit' && (
          // EDITED: Changed top-1/2 to top-[60%] for mobile to avoid text overlap
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 2 }} className="absolute top-[60%] md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
            <button onClick={() => setMode('fly')} className="group relative w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-cyan-500/50 flex items-center justify-center hover:scale-110 transition-all shadow-[0_0_30px_rgba(34,211,238,0.3)] bg-black/20 backdrop-blur-sm">
              <Rocket className="w-8 h-8 md:w-10 md:h-10 text-cyan-400 group-hover:rotate-45 transition-transform" />
              <span className="absolute -bottom-8 text-[10px] font-mono text-cyan-500 tracking-widest whitespace-nowrap">LAUNCH</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 15], fov: 60 }}>
        <Suspense fallback={null}>
          <ScrollControls pages={projects.length * 1.5} damping={0.1} enabled={mode === 'fly'}>
            <Experience mode={mode} isRearView={isRearView} onOpenModal={setSelectedProject} />
          </ScrollControls>
          <Environment preset="city" />
        </Suspense>
      </Canvas>
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}