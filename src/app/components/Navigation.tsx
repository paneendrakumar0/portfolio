import React, { useState } from 'react';
import { Sparkles, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = ['Home', 'Achievements', 'Projects', 'Certifications', 'Contact'];

  const handleStartTour = () => {
    // Close mobile menu if open
    setIsOpen(false);
    
    // Helper function for ultra-smooth scrolling
    const smoothScrollTo = (position: number) => {
      window.scrollTo({
        top: position,
        behavior: 'smooth',
      });
    };

    // --- PHASE 1: HOME OVERVIEW ---
    onNavigate('Home');
    setTimeout(() => smoothScrollTo(document.body.scrollHeight), 800);

    // --- PHASE 2: THE JOURNEY (ACHIEVEMENTS) ---
    setTimeout(() => {
      window.scrollTo(0, 0); 
      onNavigate('Achievements');
      setTimeout(() => smoothScrollTo(document.body.scrollHeight), 1000);
    }, 4500);

    // --- PHASE 3: THE BUILDS (PROJECTS) ---
    setTimeout(() => {
      window.scrollTo(0, 0);
      onNavigate('Projects');
      setTimeout(() => smoothScrollTo(document.body.scrollHeight / 2), 1200);
    }, 9000);

    // --- PHASE 4: VERIFICATION (CERTIFICATIONS) ---
    setTimeout(() => {
      window.scrollTo(0, 0);
      onNavigate('Certifications');
      setTimeout(() => smoothScrollTo(document.body.scrollHeight), 1200);
    }, 13000);

    // --- PHASE 5: DESTINATION (CONTACT & RESUME) ---
    setTimeout(() => {
      window.scrollTo(0, 0);
      onNavigate('Contact');
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      }, 1500);
    }, 17500);
  };

  const handleNavClick = (item: string) => {
    onNavigate(item);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* START TOUR BUTTON (Visible on all screens) */}
          <button 
            onClick={handleStartTour}
            className="group relative flex items-center gap-3 px-4 sm:px-6 py-2 bg-white/5 border border-cyan-500/30 rounded-full hover:bg-cyan-500/10 hover:border-cyan-500 transition-all duration-500 shadow-[0_0_15px_rgba(6,182,212,0.1)] z-50"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 group-hover:rotate-180 transition-transform duration-700" />
            <span className="text-[10px] sm:text-[11px] font-black text-white tracking-[0.2em] sm:tracking-[0.3em] uppercase whitespace-nowrap">
              Begin Experience
            </span>
            <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* DESKTOP NAV LINKS (Hidden on Mobile) */}
          <div className="hidden md:flex gap-2">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => onNavigate(item)}
                className={`px-5 py-2 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-500 ${
                  currentPage === item
                    ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* MOBILE HAMBURGER BUTTON (Visible only on Mobile) */}
          <button 
            className="md:hidden p-2 text-white z-50 relative"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 right-0 bg-black/95 backdrop-blur-2xl border-b border-white/10 p-6 md:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className={`w-full py-4 rounded-xl text-sm font-black tracking-[0.2em] uppercase transition-all duration-300 border border-transparent ${
                    currentPage === item
                      ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/10'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}