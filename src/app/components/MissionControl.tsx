import React, { useRef, useState, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Image, Text, useScroll, ScrollControls, Environment, Stars, Sparkles, useGLTF, Html, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { Terminal, Rocket, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// We import the Project type to ensure type safety
import { Project } from './Projects'; 

// --- LOADING COMPONENT ---
function CanvasLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <span className="loading loading-spinner text-cyan-500 w-10 h-10"></span>
        <p className="mt-4 text-cyan-500 font-mono text-sm tracking-widest animate-pulse">
          INITIALIZING... {progress.toFixed(0)}%
        </p>
      </div>
    </Html>
  );
}

// --- 3D COMPONENTS ---
function RealSpaceship({ mode }: { mode: string }) {
  const group = useRef<THREE.Group>(null);
  const engineRef = useRef<THREE.PointLight>(null);
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  
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

function Experience({ projects, mode, isRearView, onOpenModal }: any) {
  const scroll = useScroll();
  const [hovered, setHover] = useState<number | null>(null);
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));
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
    return projects.map((project: Project, i: number) => {
      if (mode === 'orbit') {
        const angle = (i / Math.min(projects.length, 6)) * Math.PI * 2;
        return [Math.sin(angle) * 18, 0, Math.cos(angle) * 18];
      } else {
        const side = project.category === 'Software' ? -1 : 1;
        const yOffset = isMobile ? (i % 2 === 0 ? 6 : -6) : 0;
        const xOffset = isMobile ? (side * 6) : (side * 15);
        return [xOffset, yOffset, -i * 50];
      }
    });
  }, [mode, isMobile, projects]);

  return (
    <group>
      <ambientLight intensity={0.5} />
      {projects.map((project: Project, i: number) => (
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

// --- MAIN EXPORT ---
export default function MissionControl({ projects, onOpenModal }: { projects: Project[], onOpenModal: (p: Project) => void }) {
  const [mode, setMode] = useState<'orbit' | 'fly'>('orbit'); 
  const [isRearView, setIsRearView] = useState(false);

  return (
    <div className="h-screen w-full bg-black relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full p-4 md:p-8 z-20 pointer-events-none">
        <h2 className="text-[10px] md:text-sm font-mono text-cyan-500 mb-1 tracking-widest uppercase flex items-center gap-2"><Terminal className="w-4 h-4" /> System.Space_Command</h2>
        <h1 className="text-2xl md:text-6xl font-black text-white tracking-tighter">MISSION <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-600">CONTROL</span></h1>
      </div>
      <AnimatePresence>
        {mode === 'orbit' && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 2 }} className="absolute top-[60%] md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-auto">
            <button onClick={() => setMode('fly')} className="group relative w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-cyan-500/50 flex items-center justify-center hover:scale-110 transition-all shadow-[0_0_30px_rgba(34,211,238,0.3)] bg-black/20 backdrop-blur-sm cursor-pointer">
              <Rocket className="w-8 h-8 md:w-10 md:h-10 text-cyan-400 group-hover:rotate-45 transition-transform" />
              <span className="absolute -bottom-8 text-[10px] font-mono text-cyan-500 tracking-widest whitespace-nowrap">LAUNCH</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 15], fov: 60 }}>
        <Suspense fallback={<CanvasLoader />}>
          <ScrollControls pages={projects.length * 1.5} damping={0.1} enabled={mode === 'fly'}>
            <Experience projects={projects} mode={mode} isRearView={isRearView} onOpenModal={onOpenModal} />
          </ScrollControls>
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload('/spaceship.glb');