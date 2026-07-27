import React, { useCallback, useEffect, useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { Navigation } from './components/Navigation';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AIChatWidget } from './components/AIChatWidget';
import { GuidedExperience } from './components/GuidedExperience';
import { initializeAnalytics, trackPageView } from './lib/analytics';

// Lazy load section components for performance and smaller initial bundle size
const Home = lazy(() => import('./components/Home').then(m => ({ default: m.Home })));
const Achievements = lazy(() => import('./components/Achievements').then(m => ({ default: m.Achievements })));
const Projects = lazy(() => import('./components/Projects').then(m => ({ default: m.Projects })));
const Certifications = lazy(() => import('./components/Certifications').then(m => ({ default: m.Certifications })));
const Contact = lazy(() => import('./components/Contact').then(m => ({ default: m.Contact })));

const PAGE_PATHS: Record<string, string> = {
  Home: '/',
  Achievements: '/achievements',
  Projects: '/projects',
  Certifications: '/certifications',
  Contact: '/contact',
};

const PAGE_TITLES: Record<string, string> = {
  Home: 'Paneendra Kumar | Robotics, AI & ML Portfolio',
  Achievements: 'Achievements | Paneendra Kumar',
  Projects: 'Projects | Paneendra Kumar',
  Certifications: 'Certifications | Paneendra Kumar',
  Contact: 'Contact | Paneendra Kumar',
};

function pageFromPath(pathname: string) {
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return Object.entries(PAGE_PATHS).find(([, path]) => path === normalizedPath)?.[0] ?? 'Home';
}

const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
    <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
    <span className="font-mono text-xs tracking-widest text-cyan-400 animate-pulse">INITIALIZING MODULE...</span>
  </div>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => pageFromPath(window.location.pathname));
  const [isTourActive, setIsTourActive] = useState(false);

  useEffect(() => initializeAnalytics(), []);

  const navigate = useCallback((page: string) => {
    const nextPage = PAGE_PATHS[page] ? page : 'Home';
    const nextPath = PAGE_PATHS[nextPage];

    if (window.location.pathname !== nextPath) {
      window.history.pushState({ page: nextPage }, '', nextPath);
    }

    setCurrentPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(pageFromPath(window.location.pathname));
      window.scrollTo({ top: 0 });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    document.title = PAGE_TITLES[currentPage] ?? PAGE_TITLES.Home;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        currentPage === 'Home'
          ? 'Explore Paneendra Kumar’s interactive portfolio spanning robotics, AI, machine learning, IoT, and software engineering.'
          : `Explore Paneendra Kumar’s ${currentPage.toLowerCase()} in robotics, AI, machine learning, IoT, and engineering.`,
      );
    trackPageView(currentPage, `${window.location.pathname}${window.location.search}`);
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'Home':
        return <Home onNavigate={navigate} />;
      case 'Achievements':
        return <Achievements />;
      case 'Projects':
        return <Projects />;
      case 'Certifications':
        return <Certifications />;
      case 'Contact':
        return <Contact />;
      default:
        return <Home onNavigate={navigate} />;
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only fixed top-3 left-3 z-[200] rounded-lg bg-cyan-400 px-4 py-2 font-bold text-black"
        >
          Skip to main content
        </a>
        {/* 1. Navigation stays visible across all pages */}
        <Navigation
          currentPage={currentPage}
          onNavigate={navigate}
          isTourActive={isTourActive}
          onToggleTour={() => setIsTourActive((current) => !current)}
          onStopTour={() => setIsTourActive(false)}
        />

        {/* 2. Main Content Area */}
        <main id="main-content" tabIndex={-1} className="relative z-10 pt-20 outline-none">
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

        <AIChatWidget currentPage={currentPage} onNavigate={navigate} />
        {isTourActive && (
          <GuidedExperience onNavigate={navigate} onClose={() => setIsTourActive(false)} />
        )}

        {/* 4. Background Effects Layer (Static) */}
        <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute inset-0 portfolio-noise opacity-60"></div>
        </div>
      </div>
    </MotionConfig>
  );
}
