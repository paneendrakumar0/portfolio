import React, { lazy, Suspense, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Rocket, ToggleLeft, ToggleRight } from 'lucide-react';
import { MinimalProjects } from './MinimalProjects';
import { ProjectModal } from './ProjectModal';
import {
  PROJECTS_DATA,
  Project,
  ProjectCategory,
  ProjectDiscipline,
} from '../data/projects';
import { trackEvent } from '../lib/analytics';

const MissionControl = lazy(() => import('./MissionControl'));

export function Projects() {
  const [is3DMode, setIs3DMode] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'All' | ProjectCategory>('All');
  const [discipline, setDiscipline] = useState<'All' | ProjectDiscipline>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(() => {
    const requestedSlug = new URLSearchParams(window.location.search).get('project');
    return PROJECTS_DATA.find((project) => project.slug === requestedSlug) ?? null;
  });

  const filteredProjects = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return PROJECTS_DATA.filter((project) => {
      const matchesCategory = category === 'All' || project.category === category;
      const matchesDiscipline = discipline === 'All' || project.discipline === discipline;
      const searchableText = [
        project.title,
        project.description,
        project.role,
        project.discipline,
        ...project.tech,
      ]
        .join(' ')
        .toLowerCase();

      return (
        matchesCategory &&
        matchesDiscipline &&
        (!normalizedSearch || searchableText.includes(normalizedSearch))
      );
    });
  }, [category, discipline, search]);

  const openProject = (project: Project) => {
    const url = new URL(window.location.href);
    url.searchParams.set('project', project.slug);
    window.history.replaceState(window.history.state, '', url);
    setSelectedProject(project);
    trackEvent('project_open', {
      project: project.slug,
      discipline: project.discipline,
      source: is3DMode ? 'immersive' : 'grid',
    });
  };

  const closeProject = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('project');
    window.history.replaceState(window.history.state, '', url);
    setSelectedProject(null);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setDiscipline('All');
  };

  return (
    <div id="project-archive" className="relative bg-black min-h-screen font-sans selection:bg-cyan-500/30">
      <div className="fixed top-24 right-4 md:right-8 z-40 flex items-center gap-3 bg-black/80 backdrop-blur-md p-2 pl-4 rounded-full border border-white/10 shadow-2xl">
        <span className={`text-[10px] font-bold tracking-widest ${!is3DMode ? 'text-white' : 'text-gray-500'}`}>
          LITE
        </span>

        <button
          type="button"
          onClick={() =>
            setIs3DMode((current) => {
              trackEvent('project_mode_change', { mode: current ? 'grid' : 'immersive' });
              return !current;
            })
          }
          aria-label={is3DMode ? 'Switch to accessible project grid' : 'Switch to immersive 3D project view'}
          aria-pressed={is3DMode}
          className="relative group flex items-center justify-center rounded-full focus-visible:outline-offset-4"
        >
          {is3DMode ? (
            <ToggleRight className="w-8 h-8 text-cyan-500 fill-cyan-950" />
          ) : (
            <ToggleLeft className="w-8 h-8 text-gray-400" />
          )}
        </button>

        <span className={`text-[10px] font-bold tracking-widest flex items-center gap-1 ${is3DMode ? 'text-cyan-400' : 'text-gray-500'}`}>
          IMMERSIVE <Rocket aria-hidden="true" className="w-3 h-3" />
        </span>
      </div>

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
              <MissionControl projects={filteredProjects} onOpenModal={openProject} />
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
              projects={filteredProjects}
              totalProjects={PROJECTS_DATA.length}
              search={search}
              category={category}
              discipline={discipline}
              onSearchChange={setSearch}
              onCategoryChange={setCategory}
              onDisciplineChange={setDiscipline}
              onClearFilters={clearFilters}
              onOpenModal={openProject}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ProjectModal project={selectedProject} onClose={closeProject} />
    </div>
  );
}

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
