import React, { useState, Suspense, lazy } from 'react';
import { MinimalProjects } from './MinimalProjects';
import { ProjectModal } from './ProjectModal';
import { Loader2, ToggleLeft, ToggleRight, Rocket } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// --- LAZY LOAD THE 3D VIEW ---
const MissionControl = lazy(() => import('./MissionControl'));

// --- DATA SOURCE ---
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

const PROJECTS_DATA: Project[] = [
  { 
    id: 1, 
    title: 'Voice-Controlled Mobile Manipulator', 
    category: 'Hardware', 
    tech: ['ROS 2', 'MoveIt 2', 'YOLOv8', 'Whisper AI', 'Raspberry Pi'], 
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop', 
    description: 'Autonomous mobile robot with a manipulator, controlled via voice commands.', 
    fullDescription: 'A sophisticated mobile manipulation platform designed for intuitive human-robot interaction. This system integrates Whisper AI for natural language processing, converting voice commands into autonomous navigation goals (Nav2) and manipulation tasks. It features a custom 4-DOF robotic arm controlled via MoveIt 2 and uses YOLOv8 computer vision to identify and interact with objects in real-time.', 
    stats: [
      { label: 'Status', value: 'Ongoing' },  // Added back
      { label: 'Year', value: '2026' },       // Added back
      { label: 'Navigation', value: 'SLAM' }, 
      { label: 'DOF', value: '4-Axis' }
    ], 
    github: '#', 
    demo: '#', 
    color: '#fbbf24' 
  },
  { id: 2, title: 'Hybrid Racing Controller', category: 'Hardware', tech: ['Arduino', 'Potentiometer', 'OpenCV', 'Python'], image: 'https://images.unsplash.com/photo-1593118247619-e2d6f056869e?q=80&w=1000&auto=format&fit=crop', description: 'Physical Wheel + AI Gestures.', fullDescription: 'A unique hybrid game controller combining hardware precision with CV gesture tracking.', stats: [{ label: 'Input Lag', value: '<20ms' }, { label: 'Year', value: '2026' }], github: 'https://github.com/paneendrakumar0/Hybrid-Racing-Sim', demo: '#', color: '#ef4444' },
  { id: 3, title: 'Robotic Hand Sim', category: 'Software', tech: ['ROS 2', 'Rviz2', 'OpenCV', 'URDF'], image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop', description: 'Vision-based Teleoperation.', fullDescription: 'A digital twin simulation of a robotic hand in Rviz2 using MediaPipe for hand tracking.', stats: [{ label: 'Joints', value: '21' }, { label: 'Year', value: '2026' }], github: 'https://github.com/paneendrakumar0/Robotic-Hand-Simulation-in-ROS2', demo: '#', color: '#8b5cf6' },
  { id: 4, title: 'Gesture Control Rover', category: 'Hardware', tech: ['OpenCV', 'Arduino', 'Python'], image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=1000&auto=format&fit=crop', description: 'Hand-tracking rover interface.', fullDescription: 'A 4-wheeled rover piloted purely by hand gestures transmitted via UDP.', stats: [{ label: 'Latency', value: '<50ms' }, { label: 'Year', value: '2025' }], github: '#', demo: '#', color: '#a78bfa' },
  { 
    id: 5, 
    title: 'Amazon Prime Clone', 
    category: 'Software', 
    tech: ['React', 'Firebase', 'Tailwind'], 
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop', 
    description: 'Pixel-perfect replica.', 
    fullDescription: 'A responsive web application replicating core Prime Video functionality.', 
    stats: [{ label: 'Completion', value: '100%' }, { label: 'Year', value: '2025' }], 
    github: 'https://github.com/paneendrakumar0', 
    demo: '#', 
    color: '#22d3ee' 
  },
  { id: 6, title: 'Waste AI Sorter', category: 'Hardware', tech: ['TensorFlow Lite', 'ESP32', 'Servos'], image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000&auto=format&fit=crop', description: 'IoT Bio/Non-Bio classification.', fullDescription: 'An intelligent waste bin using ESP32-CAM and TensorFlow Lite.', stats: [{ label: 'Accuracy', value: '94%' }, { label: 'Year', value: '2024' }], github: '#', demo: '#', color: '#f472b6' },
  { id: 7, title: 'Kanban Board', category: 'Software', tech: ['React', 'Drag & Drop API'], image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=1939&auto=format&fit=crop', description: 'Productivity tool.', fullDescription: 'A Trello-style task management app with fluid drag-and-drop.', stats: [{ label: 'Users', value: 'Active' }, { label: 'Year', value: '2025' }], github: '#', demo: '#', color: '#34d399' },
  { id: 8, title: 'Color Palette Gen', category: 'Software', tech: ['Algorithms', 'JavaScript'], image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop', description: 'Algorithmic color tool.', fullDescription: 'Generates harmonious color palettes based on math.', stats: [{ label: 'Colors', value: 'Infinite' }, { label: 'Year', value: '2024' }], github: '#', demo: '#', color: '#60a5fa' }
];

export function Projects() {
  const [is3DMode, setIs3DMode] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="relative bg-black min-h-screen font-sans selection:bg-cyan-500/30">
      
      {/* --- FLOATING TOGGLE SWITCH --- */}
      <div className="fixed top-24 right-4 md:right-8 z-50 flex items-center gap-3 bg-black/60 backdrop-blur-md p-2 pl-4 rounded-full border border-white/10 shadow-2xl">
        <span className={`text-[10px] font-bold tracking-widest ${!is3DMode ? 'text-white' : 'text-gray-500'}`}>
          LITE
        </span>
        
        <button 
          onClick={() => setIs3DMode(!is3DMode)}
          className="relative group flex items-center justify-center focus:outline-none"
        >
          {is3DMode ? (
             <div className="flex items-center gap-2">
                <ToggleRight className="w-8 h-8 text-cyan-500 fill-cyan-950" />
             </div>
          ) : (
             <div className="flex items-center gap-2">
                <ToggleLeft className="w-8 h-8 text-gray-400" />
             </div>
          )}
        </button>
        
        <span className={`text-[10px] font-bold tracking-widest flex items-center gap-1 ${is3DMode ? 'text-cyan-400' : 'text-gray-500'}`}>
          IMMERSIVE <Rocket className="w-3 h-3" />
        </span>
      </div>

      {/* --- CONDITIONAL RENDERING --- */}
      <AnimatePresence mode="wait">
        {is3DMode ? (
          <motion.div 
            key="3d"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen w-full"
          >
            <Suspense fallback={<LoadingScreen />}>
              <MissionControl 
                projects={PROJECTS_DATA} 
                onOpenModal={setSelectedProject} 
              />
            </Suspense>
          </motion.div>
        ) : (
          <motion.div 
            key="minimal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MinimalProjects 
              projects={PROJECTS_DATA} 
              onOpenModal={setSelectedProject} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- SHARED MODAL --- */}
      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />

    </div>
  );
}

// Simple Loading Screen
function LoadingScreen() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-black">
      <div className="relative">
        <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 animate-pulse" />
        <Loader2 className="w-12 h-12 text-cyan-500 animate-spin relative z-10" />
      </div>
      <p className="mt-6 text-cyan-500 font-mono text-sm tracking-[0.3em] animate-pulse">
        INITIALIZING MISSION CONTROL...
      </p>
    </div>
  );
}