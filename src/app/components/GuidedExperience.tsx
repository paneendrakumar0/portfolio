import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Compass, X } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

interface GuidedExperienceProps {
  onNavigate: (page: string) => void;
  onClose: () => void;
}

interface TourStep {
  page: string;
  target: string;
  eyebrow: string;
  title: string;
  description: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    page: 'Home',
    target: 'home-hero',
    eyebrow: '01 · Positioning',
    title: 'Engineering that moves',
    description:
      'Start with the core direction: mechanical-engineering foundations applied to robotics, AI, simulation, and intelligent physical systems.',
  },
  {
    page: 'Home',
    target: 'recruiter-snapshot',
    eyebrow: '02 · Quick evaluation',
    title: 'The 30-second recruiter view',
    description:
      'Education, career direction, working style, technical strengths, résumé access, and contact routes are grouped here for fast evaluation.',
  },
  {
    page: 'Home',
    target: 'featured-work',
    eyebrow: '03 · Selected evidence',
    title: 'Begin with the strongest work',
    description:
      'These projects lead with measurable outcomes and open directly into detailed case studies with challenge, approach, role, and evidence.',
  },
  {
    page: 'Projects',
    target: 'project-archive',
    eyebrow: '04 · Engineering archive',
    title: 'Filter the complete body of work',
    description:
      'Search by technology, separate software from hardware, filter by discipline, or switch to the immersive project view.',
  },
  {
    page: 'Achievements',
    target: 'achievements-timeline',
    eyebrow: '05 · Milestones',
    title: 'Progress beyond repositories',
    description:
      'The achievement timeline adds competition results, practical milestones, and the broader progression behind the engineering work.',
  },
  {
    page: 'Certifications',
    target: 'certifications-library',
    eyebrow: '06 · Continued learning',
    title: 'Skills backed by coursework',
    description:
      'Certifications provide another layer of evidence for technical learning and complement the project-based proof.',
  },
  {
    page: 'Contact',
    target: 'contact-hub',
    eyebrow: '07 · Next step',
    title: 'Start a conversation',
    description:
      'Use the direct contact options to discuss internships, collaboration, freelance work, or a technical opportunity.',
  },
];

export function GuidedExperience({ onNavigate, onClose }: GuidedExperienceProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const highlightedElement = useRef<HTMLElement | null>(null);
  const step = TOUR_STEPS[stepIndex];
  const isFinalStep = stepIndex === TOUR_STEPS.length - 1;

  const removeHighlight = () => {
    highlightedElement.current?.classList.remove('portfolio-tour-highlight');
    highlightedElement.current = null;
  };

  const closeTour = (completed = false) => {
    removeHighlight();
    trackEvent(completed ? 'tour_complete' : 'tour_stop', {
      step: stepIndex + 1,
      total_steps: TOUR_STEPS.length,
    });
    onClose();
  };

  useEffect(() => {
    trackEvent('tour_start', { total_steps: TOUR_STEPS.length });
  }, []);

  useEffect(() => {
    removeHighlight();
    onNavigate(step.page);

    const focusTarget = window.setTimeout(() => {
      const target = document.getElementById(step.target);
      if (!target) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      highlightedElement.current = target;
      target.classList.add('portfolio-tour-highlight');
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 500);

    return () => {
      window.clearTimeout(focusTarget);
      removeHighlight();
    };
  }, [onNavigate, step]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeTour();
      if (event.key === 'ArrowLeft') setStepIndex((current) => Math.max(0, current - 1));
      if (event.key === 'ArrowRight' && !isFinalStep) {
        setStepIndex((current) => Math.min(TOUR_STEPS.length - 1, current + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFinalStep, stepIndex]);

  return (
    <AnimatePresence mode="wait">
      <motion.aside
        key={stepIndex}
        role="dialog"
        aria-label={`Guided portfolio experience, step ${stepIndex + 1} of ${TOUR_STEPS.length}`}
        initial={{ opacity: 0, x: -24, y: 12 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, x: -12 }}
        className="fixed inset-x-3 bottom-3 z-[85] overflow-hidden rounded-2xl border border-cyan-300/25 bg-[#080b12]/95 shadow-[0_20px_70px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-[430px]"
      >
        <div className="h-1 bg-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
            animate={{ width: `${((stepIndex + 1) / TOUR_STEPS.length) * 100}%` }}
          />
        </div>

        <div className="p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-2">
                <Compass className="h-5 w-5 text-cyan-300" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
                  {step.eyebrow}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Step {stepIndex + 1} of {TOUR_STEPS.length}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => closeTour()}
              aria-label="Exit guided experience"
              className="rounded-lg p-2 text-gray-500 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <h2 className="text-xl font-black text-white">{step.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-400">{step.description}</p>

          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
              disabled={stepIndex === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-bold text-gray-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            {isFinalStep ? (
              <button
                type="button"
                onClick={() => closeTour(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
              >
                Finish
                <Check className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  setStepIndex((current) => Math.min(TOUR_STEPS.length - 1, current + 1))
                }
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>

          <p className="mt-3 text-center text-[10px] text-gray-600">
            Use ← → to navigate · Esc to exit
          </p>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
