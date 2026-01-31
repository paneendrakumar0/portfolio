import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Cpu, Code2, ArrowUpRight } from 'lucide-react';
import { Project } from './Projects'; // We will define the interface in the parent

interface MinimalProjectsProps {
  projects: Project[];
  onOpenModal: (project: Project) => void;
}

export function MinimalProjects({ projects, onOpenModal }: MinimalProjectsProps) {
  // 1. Separate the data
  const hardware = projects.filter(p => p.category === 'Hardware');
  const software = projects.filter(p => p.category === 'Software');

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] pt-32 pb-20 px-4 md:px-12 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
            PROJECT <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">ARCHIVES</span>
          </h1>
          <p className="text-gray-400 font-mono text-sm max-w-xl">
            // FAST_ACCESS_MODE_ENABLED<br/>
            // SELECT A MODULE TO VIEW CLASSIFIED DATA.
          </p>
        </div>

        {/* The Grid Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          
          {/* COLUMN 1: HARDWARE (Industrial/Amber Theme) */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
              <Cpu className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-mono text-amber-500 tracking-widest uppercase">Hardware_Systems</h2>
            </div>
            
            {hardware.map((project, idx) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                index={idx} 
                theme="amber"
                onClick={() => onOpenModal(project)} 
              />
            ))}
          </div>

          {/* COLUMN 2: SOFTWARE (Digital/Cyan Theme) */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6 mt-8 md:mt-0">
              <Code2 className="w-5 h-5 text-cyan-500" />
              <h2 className="text-xl font-mono text-cyan-500 tracking-widest uppercase">Software_Arch</h2>
            </div>

            {software.map((project, idx) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                index={idx} 
                theme="cyan"
                onClick={() => onOpenModal(project)} 
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

// Sub-component for individual cards
const ProjectCard = ({ project, index, theme, onClick }: any) => {
  const isCyan = theme === 'cyan';
  const accentColor = isCyan ? 'text-cyan-400' : 'text-amber-400';
  const borderColor = isCyan ? 'group-hover:border-cyan-500/50' : 'group-hover:border-amber-500/50';
  const glow = isCyan ? 'group-hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.15)]' : 'group-hover:shadow-[0_0_30px_-5px_rgba(251,191,36,0.15)]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      onClick={onClick}
      className={`group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${borderColor} ${glow}`}
    >
      <div className="flex flex-col sm:flex-row h-full">
        {/* Image Thumbnail */}
        <div className="w-full sm:w-32 h-32 sm:h-auto relative shrink-0 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-r ${isCyan ? 'from-cyan-500/20' : 'from-amber-500/20'} to-transparent z-10 mix-blend-overlay`} />
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100"
          />
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-center">
          <div className="flex justify-between items-start mb-2">
            <h3 className={`text-lg font-bold text-white group-hover:text-white transition-colors`}>
              {project.title}
            </h3>
            <ArrowUpRight className={`w-5 h-5 ${accentColor} opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1 group-hover:-translate-y-1`} />
          </div>
          
          <p className="text-gray-400 text-sm line-clamp-2 mb-3">{project.description}</p>
          
          <div className="flex flex-wrap gap-2 mt-auto">
            {project.tech.slice(0, 3).map((t: string) => (
              <span key={t} className="px-2 py-1 text-[10px] uppercase font-mono bg-black/50 border border-white/5 rounded text-gray-400">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};