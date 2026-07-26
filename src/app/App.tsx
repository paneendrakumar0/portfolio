import React, { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from './components/Navigation';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy load section components for performance and smaller initial bundle size
const Home = lazy(() => import('./components/Home').then(m => ({ default: m.Home })));
const Achievements = lazy(() => import('./components/Achievements').then(m => ({ default: m.Achievements })));
const Projects = lazy(() => import('./components/Projects').then(m => ({ default: m.Projects })));
const Certifications = lazy(() => import('./components/Certifications').then(m => ({ default: m.Certifications })));
const Contact = lazy(() => import('./components/Contact').then(m => ({ default: m.Contact })));

const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
    <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
    <span className="font-mono text-xs tracking-widest text-cyan-400 animate-pulse">INITIALIZING MODULE...</span>
  </div>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState('Home');

  const renderPage = () => {
    switch (currentPage) {
      case 'Home':
        return <Home onNavigate={setCurrentPage} />;
      case 'Achievements':
        return <Achievements />;
      case 'Projects':
        return <Projects />;
      case 'Certifications':
        return <Certifications />;
      case 'Contact':
        return <Contact />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
      {/* 1. Navigation stays visible across all pages */}
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* 2. Main Content Area */}
      <main className="relative z-10 pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            // 3. Removed 'y' axis movement to stop side/bottom entry effect
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <ErrorBoundary key={currentPage}>
              <Suspense fallback={<PageLoader />}>
                {renderPage()}
              </Suspense>
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 4. Background Effects Layer (Static) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>
    </div>
  );
}