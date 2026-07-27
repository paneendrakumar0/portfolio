import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Sparkles, Square, X } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isTourActive: boolean;
  onToggleTour: () => void;
  onStopTour: () => void;
}

const NAV_ITEMS = ['Home', 'Achievements', 'Projects', 'Certifications', 'Contact'];

export function Navigation({
  currentPage,
  onNavigate,
  isTourActive,
  onToggleTour,
  onStopTour,
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (item: string) => {
    onStopTour();
    onNavigate(item);
    setIsOpen(false);
  };

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-20 items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onToggleTour();
            }}
            aria-pressed={isTourActive}
            aria-label={isTourActive ? 'Stop guided portfolio experience' : 'Begin guided portfolio experience'}
            className={`group relative z-50 flex items-center gap-3 rounded-full bg-white/5 px-4 py-2 transition-all duration-300 sm:px-6 ${
              isTourActive
                ? 'border border-pink-500/60 hover:bg-pink-500/10'
                : 'border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:border-cyan-500 hover:bg-cyan-500/10'
            }`}
          >
            {isTourActive ? (
              <Square className="h-4 w-4 text-pink-400" />
            ) : (
              <Sparkles className="h-4 w-4 text-cyan-400 transition-transform duration-700 group-hover:rotate-180" />
            )}
            <span className="whitespace-nowrap text-[10px] font-black uppercase tracking-[0.2em] text-white sm:text-[11px] sm:tracking-[0.3em]">
              {isTourActive ? 'Exit Experience' : 'Guided Experience'}
            </span>
          </button>

          <div className="hidden gap-2 md:flex">
            {NAV_ITEMS.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => handleNavClick(item)}
                aria-current={currentPage === item ? 'page' : undefined}
                className={`rounded-xl px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  currentPage === item
                    ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                    : 'text-gray-500 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="relative z-50 p-2 text-white md:hidden"
            onClick={() => setIsOpen((current) => !current)}
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            id="mobile-navigation"
            className="absolute left-0 right-0 top-20 border-b border-white/10 bg-black/95 p-6 shadow-2xl backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col gap-4">
              {NAV_ITEMS.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => handleNavClick(item)}
                  aria-current={currentPage === item ? 'page' : undefined}
                  className={`w-full rounded-xl border border-transparent py-4 text-sm font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                    currentPage === item
                      ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                      : 'text-gray-400 hover:border-white/10 hover:bg-white/5 hover:text-white'
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
