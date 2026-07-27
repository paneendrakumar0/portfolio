import React, { useEffect, useRef, useState } from 'react';
import {
  BriefcaseBusiness,
  CheckCircle2,
  CopyCheck,
  ExternalLink,
  Github,
  Layers,
  Share2,
  Tag,
  Target,
  Workflow,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Project } from '../data/projects';
import { ProjectMedia } from './ProjectMedia';
import { trackEvent } from '../lib/analytics';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [shareComplete, setShareComplete] = useState(false);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    if (project) {
      document.body.style.overflow = 'hidden';
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      previouslyFocused?.focus();
    };
  }, [project]);

  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, project]);

  useEffect(() => setShareComplete(false), [project]);

  if (!project) return null;

  const shareProject = async () => {
    const shareUrl = new URL('/projects', window.location.origin);
    shareUrl.searchParams.set('project', project.slug);
    const shareData = {
      title: `${project.title} | Paneendra Kumar`,
      text: project.description,
      url: shareUrl.toString(),
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
      }
      setShareComplete(true);
      trackEvent('project_share', { project: project.slug });
      window.setTimeout(() => setShareComplete(false), 2500);
    } catch (error) {
      if ((error as DOMException).name !== 'AbortError') {
        console.error('Unable to share project:', error);
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-md"
        onClick={onClose}
        role="presentation"
      >
        <motion.article
          layoutId={`project-${project.id}`}
          initial={{ scale: 0.96, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.96, y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl shadow-purple-500/10 no-scrollbar"
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          aria-describedby="project-modal-description"
        >
          <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
            <button
              type="button"
              onClick={shareProject}
              aria-label={`Share ${project.title}`}
              className="p-2.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all"
            >
              {shareComplete
                ? <CopyCheck aria-hidden="true" className="w-5 h-5 text-green-400" />
                : <Share2 aria-hidden="true" className="w-5 h-5 text-gray-300" />}
            </button>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close project details"
              className="p-2.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all"
            >
              <X aria-hidden="true" className="w-5 h-5 text-gray-300" />
            </button>
          </div>

          <div className="relative h-64 md:h-[420px] w-full overflow-hidden rounded-t-3xl">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/20 z-10 pointer-events-none" />
            <ProjectMedia
              src={project.image}
              alt={project.imageAlt}
              color={project.color}
              className="w-full h-full"
              imageClassName="transition-transform duration-700 hover:scale-[1.02]"
              eager
            />

            <div className="absolute bottom-6 left-6 z-20 flex flex-wrap gap-2">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md ${
                project.category === 'Software'
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                  : 'bg-amber-500/20 border-amber-500/50 text-amber-300'
              }`}>
                {project.category}
              </span>
              <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-white/20 bg-black/50 text-white backdrop-blur-md">
                {project.discipline}
              </span>
            </div>
          </div>

          <div className="p-6 md:p-10">
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">
                <span>{project.year}</span>
                <span aria-hidden="true">•</span>
                <span>{project.status}</span>
              </div>
              <h2
                id="project-modal-title"
                className="text-3xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-4"
              >
                {project.title}
              </h2>
              <p id="project-modal-description" className="text-gray-300 text-lg leading-relaxed max-w-3xl">
                {project.fullDescription}
              </p>
            </header>

            <div className="grid lg:grid-cols-[1fr_280px] gap-10">
              <div className="space-y-8">
                <CaseStudySection icon={<Target />} title="Engineering challenge">
                  <p>{project.challenge}</p>
                </CaseStudySection>

                <CaseStudySection icon={<Workflow />} title="Approach">
                  <p>{project.approach}</p>
                </CaseStudySection>

                <CaseStudySection icon={<CheckCircle2 />} title="Evidence & outcomes">
                  <ul className="space-y-3">
                    {project.outcomes.map((outcome) => (
                      <li key={outcome} className="flex gap-3">
                        <CheckCircle2 aria-hidden="true" className="w-5 h-5 shrink-0 mt-0.5 text-green-400" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </CaseStudySection>

                <CaseStudySection icon={<Tag />} title="Technologies used">
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((technology) => (
                      <span
                        key={technology}
                        className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-md text-gray-300 text-sm"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
                </CaseStudySection>
              </div>

              <aside className="space-y-5">
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                  <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <BriefcaseBusiness aria-hidden="true" className="w-4 h-4" />
                    My role
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-300">{project.role}</p>
                </div>

                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                  <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Layers aria-hidden="true" className="w-4 h-4" />
                    Project evidence
                  </h3>
                  <dl className="space-y-3">
                    {project.stats.map((stat) => (
                      <div key={stat.label} className="flex justify-between gap-4 items-center border-b border-white/5 pb-3 last:border-0 last:pb-0">
                        <dt className="text-xs uppercase text-gray-500">{stat.label}</dt>
                        <dd className="text-sm font-bold text-white text-right">{stat.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('project_source_click', { project: project.slug })}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-cyan-300 transition-colors"
                >
                  <Github aria-hidden="true" className="w-5 h-5" />
                  View source
                </a>

                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('project_demo_click', { project: project.slug })}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-shadow"
                  >
                    <ExternalLink aria-hidden="true" className="w-5 h-5" />
                    Open live demo
                  </a>
                )}
              </aside>
            </div>
          </div>
        </motion.article>
      </motion.div>
    </AnimatePresence>
  );
}

interface CaseStudySectionProps {
  icon: React.ReactElement;
  title: string;
  children: React.ReactNode;
}

function CaseStudySection({ icon, title, children }: CaseStudySectionProps) {
  return (
    <section>
      <h3 className="text-sm font-mono text-cyan-300 uppercase tracking-widest mb-3 flex items-center gap-2">
        {React.cloneElement(icon, {
          'aria-hidden': true,
          className: 'w-4 h-4',
        })}
        {title}
      </h3>
      <div className="text-gray-300 leading-relaxed">{children}</div>
    </section>
  );
}
