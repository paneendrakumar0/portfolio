import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { X, Github, ExternalLink, ArrowUpRight, Layers, Cpu, Code2, Terminal } from 'lucide-react';

// --- DATA: Your Projects ---
const projects = [
  {
    id: 1,
    title: 'Amazon Prime Clone',
    category: 'Software',
    tag: 'Frontend Engineering',
    image: 'https://th.bing.com/th/id/OIP.rnGvCcBXugH-POgrt9AIYQHaDs?w=302&h=174&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3',
    description: 'A pixel-perfect replication of the Prime Video interface with mock authentication and dynamic carousels.',
    tech: ['React', 'Firebase', 'Tailwind'],
    links: { github: 'https://github.com/paneendrakumar0/primeloginclone', demo: 'https://paneendrakumar0.github.io/primeloginclone/' },
    colSpan: 'md:col-span-2', // Wide card
  },
  {
    id: 2,
    title: 'Autonomous Delivery Bot',
    category: 'Hardware',
    tag: 'Robotics & AI',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop',
    description: 'ROS-2 based robot utilizing LIDAR for SLAM indoor navigation and dynamic obstacle avoidance.',
    tech: ['ROS 2', 'Raspberry Pi', 'LIDAR', 'Python'],
    links: { github: '#', demo: '#' },
    colSpan: 'md:col-span-1', // Standard card
  },
  {
    id: 3,
    title: 'Kanban Board',
    category: 'Software',
    tag: 'Productivity Tool',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=1939&auto=format&fit=crop',
    description: 'Drag-and-drop task management tool inspired by Trello. Features local persistence and smooth physics.',
    tech: ['HTML5 D&D', 'JavaScript', 'CSS Grid'],
    links: { github: 'https://github.com/paneendrakumar0/Kamban-board', demo: 'https://paneendrakumar0.github.io/Kamban-board/' },
    colSpan: 'md:col-span-1',
  },
  {
    id: 4,
    title: 'Gesture Controlled Bot',
    category: 'Hardware',
    tag: 'Hrdware Interface',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=2070&auto=format&fit=crop',
    description: 'A4 wheeled bot piloted by hand movements. Flex Sensors tracks changes and send it to the bot.',
    tech: ['Arduino', 'OpenCV', 'Python', 'UDP'],
    links: { github: '#', demo: '#' },
    colSpan: 'md:col-span-2',
  },
  {
    id: 5,
    title: 'Smart Waste Bin',
    category: 'Hardware',
    tag: 'IoT System',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop',
    description: 'AI-driven segregation using TensorFlow Lite on ESP32 to classify and sort waste automatically.',
    tech: ['ESP32', 'TinyML', 'C++', 'Servos'],
    links: { github: '#', demo: '#' },
    colSpan: 'md:col-span-1',
  },
  {
    id: 6,
    title: 'Color Palette Gen',
    category: 'Software',
    tag: 'Design Tool',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop',
    description: 'Harmonious palette generator using color theory mathematics. Instant HEX/RGB conversion.',
    tech: ['Vanilla JS', 'Math', 'CSS Variables'],
    links: { github: 'https://github.com/paneendrakumar0/paneendrakumar.colorpalette.io', demo: 'https://paneendrakumar0.github.io/paneendrakumar.colorpalette.io/' },
    colSpan: 'md:col-span-1',
  },
];

export function Projects() {
  const [filter, setFilter] = useState('All');
  const [selectedId, setSelectedId] = useState(null);

  const filteredProjects = projects.filter(p => filter === 'All' || p.category === filter);

  return (
    <div className="min-h-screen bg-[#050505] text-white py-24 px-6 relative overflow-hidden">
      
      {/* Background Texture (Subtle Noise) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div>
                <h2 className="text-sm font-mono text-cyan-400 mb-4 tracking-wider uppercase flex items-center gap-2">
                    <Terminal className="w-4 h-4" /> System.Projects
                </h2>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                    Selected <span className="text-gray-500">Works</span>
                </h1>
            </div>

            {/* Glass Filter Tabs */}
            <div className="p-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md flex">
                {['All', 'Software', 'Hardware'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                            filter === tab ? 'text-black' : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        {filter === tab && (
                            <motion.div 
                                layoutId="active-pill"
                                className="absolute inset-0 bg-white rounded-full"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10">{tab}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* --- BENTO GRID --- */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode='popLayout'>
                {filteredProjects.map((project) => (
                    <TiltCard 
                        key={project.id} 
                        project={project} 
                        onClick={() => setSelectedId(project.id)} 
                    />
                ))}
            </AnimatePresence>
        </motion.div>

        {/* --- EXPANDED OVERLAY (MODAL) --- */}
        <AnimatePresence>
            {selectedId && (
                <ExpandedCard 
                    id={selectedId} 
                    onClose={() => setSelectedId(null)} 
                />
            )}
        </AnimatePresence>

      </div>
    </div>
  );
}

// --- COMPONENT: 3D TILT CARD ---
function TiltCard({ project, onClick }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [2, -2]); // Subtle tilt
    const rotateY = useTransform(x, [-100, 100], [-2, 2]);

    function handleMouseMove(event) {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(event.clientX - rect.left - rect.width / 2);
        y.set(event.clientY - rect.top - rect.height / 2);
    }

    return (
        <motion.div
            layoutId={`card-container-${project.id}`}
            className={`group relative rounded-3xl cursor-pointer ${project.colSpan} h-[340px] perspective-1000`}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            onClick={onClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
        >
            <motion.div 
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="w-full h-full relative overflow-hidden rounded-3xl bg-gray-900 border border-white/10 hover:border-white/20 transition-colors shadow-2xl"
            >
                {/* Background Image with Zoom Effect */}
                <div className="absolute inset-0">
                    <motion.img 
                        layoutId={`card-image-${project.id}`}
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-mono text-white border border-white/10">
                            {project.category}
                        </span>
                        <div className="p-2 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowUpRight className="w-5 h-5 text-white" />
                        </div>
                    </div>

                    <div>
                        <motion.h3 layoutId={`card-title-${project.id}`} className="text-2xl font-bold text-white mb-2">
                            {project.title}
                        </motion.h3>
                        <p className="text-gray-400 text-sm line-clamp-2">
                            {project.description}
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

// --- COMPONENT: EXPANDED FULLSCREEN CARD ---
function ExpandedCard({ id, onClose }) {
    const project = projects.find(p => p.id === id);

    return (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 md:p-8">
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
                layoutId={`card-container-${id}`}
                className="relative w-full max-w-5xl h-full max-h-[800px] bg-[#0a0a0a] rounded-3xl overflow-hidden border border-white/10 flex flex-col shadow-2xl"
            >
                {/* ... (Header image section same as before) ... */}
                <button onClick={onClose} className="absolute top-6 right-6 z-20 p-2 bg-black/50 rounded-full hover:bg-white/20 transition-colors">
                    <X className="w-6 h-6 text-white" />
                </button>

                <div className="relative h-1/2 w-full">
                      <motion.img 
                        layoutId={`card-image-${id}`}
                        src={project.image} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
                      
                      <div className="absolute bottom-8 left-8 md:left-12">
                        <motion.h2 layoutId={`card-title-${id}`} className="text-4xl md:text-6xl font-bold text-white mb-2">
                            {project.title}
                        </motion.h2>
                        <span className="text-cyan-400 font-mono text-lg">{project.tag}</span>
                      </div>
                </div>

                <div className="p-8 md:p-12 flex flex-col md:flex-row gap-12 h-1/2 overflow-y-auto">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-4">About the Project</h3>
                        <p className="text-gray-400 leading-relaxed text-lg mb-8">
                            {project.description} 
                            <br/><br/>
                            This project represents a deep dive into {project.category.toLowerCase()} architecture. 
                            It overcomes significant challenges in latency and state management to deliver 
                            a seamless user experience.
                        </p>
                        
                        <div className="flex gap-4">
                            {/* FIX: ADDED target="_blank" rel="noopener noreferrer" */}
                            <a 
                                href={project.links.github} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                            >
                                <Github className="w-5 h-5" /> Source
                            </a>
                            <a 
                                href={project.links.demo} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-500 transition-colors"
                            >
                                <ExternalLink className="w-5 h-5" /> Live Demo
                            </a>
                        </div>
                    </div>

                    {/* ... (Tech stack section same as before) ... */}
                    <div className="w-full md:w-1/3 space-y-8">
                        <div>
                            <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-4">Technologies</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.tech.map(t => (
                                    <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-4">Stats</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white/5 rounded-xl">
                                    <div className="text-2xl font-bold text-white">100%</div>
                                    <div className="text-xs text-gray-500">Completion</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl">
                                    <div className="text-2xl font-bold text-white">2026</div>
                                    <div className="text-xs text-gray-500">Year</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}