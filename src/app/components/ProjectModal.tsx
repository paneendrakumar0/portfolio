import React, { useEffect } from 'react';
import { X, Github, ExternalLink, Calendar, Tag } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

// Define the shape of a project for type safety
export interface Project {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  category: 'Software' | 'Hardware';
  tech: string[];
  github: string;
  demo: string;
}

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [project]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          layoutId={`project-${project.id}`} // Connects to the grid card for seamless transition
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-purple-500/10 no-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all group"
          >
            <X className="w-5 h-5 text-gray-400 group-hover:text-white" />
          </button>

          {/* Hero Image Section */}
          <div className="relative h-64 md:h-96 w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10" />
            <motion.img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            />
            
            {/* Floating Category Badge */}
            <div className="absolute bottom-6 left-6 z-20">
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider border backdrop-blur-md ${
                project.category === 'Software' 
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' 
                  : 'bg-pink-500/20 border-pink-500/50 text-pink-400'
              }`}>
                {project.category}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="flex flex-col gap-6">
              
              {/* Title & Short Desc */}
              <div>
                <motion.h2 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2"
                >
                  {project.title}
                </motion.h2>
                <p className="text-gray-400 text-lg">{project.description}</p>
              </div>

              <div className="h-px w-full bg-white/10" />

              {/* Detailed Description */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="prose prose-invert max-w-none text-gray-300 leading-relaxed"
              >
                <p>{project.fullDescription}</p>
              </motion.div>

              {/* Tech Stack */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4" /> Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-md text-gray-300 text-sm hover:border-white/30 transition-colors cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Footer Actions */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
              >
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 hover:scale-[1.02] transition-all group"
                >
                  <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  View Source Code
                </a>
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all group"
                >
                  <ExternalLink className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                  Live Demo
                </a>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}