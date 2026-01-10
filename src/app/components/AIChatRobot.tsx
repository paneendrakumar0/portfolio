import React, { useState, useEffect, Suspense, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { ArrowRight, Code2, Bot, Popcorn, RefreshCw, Heart, Smile, Frown, Crosshair, Radio } from 'lucide-react';
import { ExpressiveRobot } from './ExpressiveRobot';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface HomeProps {
  onNavigate: (page: string) => void;
}

type RobotEmotion = 'Idle' | 'Dance' | 'Wave' | 'Jump' | 'Cry' | 'Laugh' | 'Sitting';

// --- NEW: 3D Drone Component ---
function DroneModel() {
  const mesh = useRef<THREE.Group>(null!);
  // CHANGED: Loading drone1.glb from public folder
  const { scene } = useGLTF('/drone1.glb');

  useFrame((state) => {
    if (!mesh.current) return;
    // Subtle hovering animation
    mesh.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    mesh.current.rotation.y += 0.01;
  });

  return <primitive ref={mesh} object={scene} scale={0.4} />;
}

// --- Interactive Drone Follower Container ---
function DroneFollower() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 25 });
  const rotateZ = useTransform(springX, [-200, 200], [-20, 20]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      // Offset so it follows the cursor
      mouseX.set(e.clientX - 100);
      mouseY.set(e.clientY - 100);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-40 h-40 z-50 pointer-events-none hidden lg:block"
      style={{ x: springX, y: springY, rotate: rotateZ }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 35 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} />
          <DroneModel />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}

// --- Cyber HUD and Grid ---
function CyberHUD({ x, y }: { x: number, y: number }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-20 font-mono text-[10px] text-cyan-500/40 uppercase tracking-widest p-10 hidden lg:block">
      <div className="absolute top-10 left-10 flex flex-col gap-2">
        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-cyan-500 animate-pulse" /> SYSTEM_ACTIVE</div>
        <div className="text-[8px] opacity-50">DRONE_LINK: drone1.glb // STABLE</div>
      </div>
      <div className="absolute bottom-10 left-10 flex gap-10 items-end">
        <div className="flex flex-col">
          <span className="opacity-50">UNIT_X</span>
          <span className="text-lg text-cyan-400 font-bold">{Math.round(x)}</span>
        </div>
        <div className="flex flex-col">
          <span className="opacity-50">UNIT_Y</span>
          <span className="text-lg text-cyan-400 font-bold">{Math.round(y)}</span>
        </div>
      </div>
    </div>
  );
}

export function Home({ onNavigate }: HomeProps) {
  const [robotState, setRobotState] = useState<RobotEmotion>('Sitting');
  const [showGreeting, setShowGreeting] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);
    
    const timer = setTimeout(() => {
      setShowGreeting(true);
      setRobotState('Wave');
    }, 1500);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      clearTimeout(timer);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#0a0a0a] text-white relative overflow-x-hidden selection:bg-cyan-500/30"
    >
      <DroneFollower />
      <CyberHUD x={mousePos.x} y={mousePos.y} />
      
      <div className="fixed inset-0 z-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 mb-32">
          
          {/* Left Side Content */}
          <div className="lg:w-1/2 space-y-12 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <div className="flex items-center gap-4 sm:gap-8 px-10 py-5 rounded-full border border-white/10 bg-white/5 backdrop-blur-2xl">
                <StatusItem icon={<Popcorn className="w-5 h-5" />} label="EAT" hoverColor="hover:text-cyan-400" />
                <StatusItem icon={<Code2 className="w-5 h-5" />} label="CODE" hoverColor="hover:text-purple-400" />
                <StatusItem icon={<Bot className="w-5 h-5" />} label="BUILD" hoverColor="hover:text-yellow-400" />
                <StatusItem icon={<RefreshCw className="w-5 h-5" />} label="REPEAT" hoverColor="hover:text-green-400" />
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9]">
                <span className="bg-gradient-to-br from-white via-white to-gray-500 bg-clip-text text-transparent">Paneendra</span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Kumar</span>
              </h1>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <button onClick={() => onNavigate('Projects')} className="group px-10 py-5 bg-white text-black rounded-2xl font-bold flex items-center gap-3">
                Explore Projects <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Right Side Robot */}
          <div className="lg:w-1/2 flex justify-center lg:justify-end relative">
            <div className="relative w-full max-w-xl aspect-square">
              <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/40 backdrop-blur-md">
                <ExpressiveRobot action={robotState} />
              </div>
              
              <div className="absolute -bottom-6 right-0 flex gap-3 z-20">
                <EmotionButton icon={<Heart className="w-5 h-5" />} onClick={() => setRobotState('Dance')} label="Dance" />
                <EmotionButton icon={<Smile className="w-5 h-5" />} onClick={() => setRobotState('Laugh')} label="Laugh" />
                <EmotionButton icon={<Frown className="w-5 h-5" />} onClick={() => setRobotState('Cry')} label="Sad" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

function EmotionButton({ icon, onClick, label }: { icon: React.ReactNode, onClick: () => void, label: string }) {
  return (
    <button onClick={onClick} className="w-12 h-12 bg-[#111] border border-white/10 rounded-xl flex items-center justify-center hover:text-cyan-400 transition-all">
      {icon}
    </button>
  );
}

function StatusItem({ icon, label, hoverColor }: { icon: React.ReactNode, label: string, hoverColor: string }) {
  return (
    <div className={`flex items-center gap-2 text-gray-500 ${hoverColor} transition-colors`}>
      {icon} <span className="text-[10px] font-black">{label}</span>
    </div>
  );
}