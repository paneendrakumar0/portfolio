import React from 'react';
import {
  ArrowUpRight,
  Code2,
  Cpu,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import {
  Project,
  ProjectCategory,
  ProjectDiscipline,
} from '../data/projects';
import { ProjectMedia } from './ProjectMedia';

interface MinimalProjectsProps {
  projects: Project[];
  totalProjects: number;
  search: string;
  category: 'All' | ProjectCategory;
  discipline: 'All' | ProjectDiscipline;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: 'All' | ProjectCategory) => void;
  onDisciplineChange: (value: 'All' | ProjectDiscipline) => void;
  onClearFilters: () => void;
  onOpenModal: (project: Project) => void;
}

const categories: Array<'All' | ProjectCategory> = ['All', 'Hardware', 'Software'];
const disciplines: Array<'All' | ProjectDiscipline> = [
  'All',
  'Robotics',
  'AI / ML',
  'Simulation',
  'Web',
];

export function MinimalProjects({
  projects,
  totalProjects,
  search,
  category,
  discipline,
  onSearchChange,
  onCategoryChange,
  onDisciplineChange,
  onClearFilters,
  onOpenModal,
}: MinimalProjectsProps) {
  const hardware = projects.filter((project) => project.category === 'Hardware');
  const software = projects.filter((project) => project.category === 'Software');
  const hasFilters = Boolean(search) || category !== 'All' || discipline !== 'All';

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] pt-32 pb-20 px-4 md:px-12 relative overflow-hidden">
      <div aria-hidden="true" className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        <div className="mb-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-300 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Verified builds
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
            PROJECT <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">ARCHIVES</span>
          </h1>
          <p className="text-gray-400 leading-relaxed max-w-2xl">
            Search the systems I have designed, simulated, tested, and documented. Every source link below points to a public repository or working demo.
          </p>
        </div>

        <section aria-label="Project filters" className="mb-12 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:p-5 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <label className="relative flex-1">
              <span className="sr-only">Search projects</span>
              <Search aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="search"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search ROS 2, simulation, computer vision..."
                className="w-full rounded-xl border border-white/10 bg-black/50 py-3 pl-11 pr-4 text-sm text-white placeholder:text-gray-600 focus:border-cyan-500"
              />
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <SlidersHorizontal aria-hidden="true" className="w-4 h-4 text-gray-500 mr-1" />
              {categories.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onCategoryChange(option)}
                  aria-pressed={category === option}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
                    category === option
                      ? 'bg-white text-black'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/5 pt-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-600 mr-1">Focus</span>
            {disciplines.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onDisciplineChange(option)}
                aria-pressed={discipline === option}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  discipline === option
                    ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300'
                    : 'border-white/10 text-gray-500 hover:border-white/20 hover:text-white'
                }`}
              >
                {option}
              </button>
            ))}

            <span className="ml-auto text-xs text-gray-500" aria-live="polite">
              Showing {projects.length} of {totalProjects}
            </span>
          </div>
        </section>

        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-20 text-center">
            <Search aria-hidden="true" className="w-10 h-10 text-gray-700 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">No matching projects</h2>
            <p className="text-sm text-gray-500 mb-6">Try a different technology or clear the active filters.</p>
            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-black hover:bg-cyan-300"
            >
              <X aria-hidden="true" className="w-4 h-4" />
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            <ProjectColumn
              title="Hardware_Systems"
              icon={<Cpu aria-hidden="true" className="w-5 h-5 text-amber-500" />}
              projects={hardware}
              theme="amber"
              onOpenModal={onOpenModal}
            />
            <ProjectColumn
              title="Software_Arch"
              icon={<Code2 aria-hidden="true" className="w-5 h-5 text-cyan-500" />}
              projects={software}
              theme="cyan"
              onOpenModal={onOpenModal}
            />
          </div>
        )}

        {hasFilters && projects.length > 0 && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={onClearFilters}
              className="text-sm text-gray-500 underline underline-offset-4 hover:text-white"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface ProjectColumnProps {
  title: string;
  icon: React.ReactNode;
  projects: Project[];
  theme: 'amber' | 'cyan';
  onOpenModal: (project: Project) => void;
}

function ProjectColumn({
  title,
  icon,
  projects,
  theme,
  onOpenModal,
}: ProjectColumnProps) {
  if (projects.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
        {icon}
        <h2 className={`text-xl font-mono tracking-widest uppercase ${theme === 'cyan' ? 'text-cyan-500' : 'text-amber-500'}`}>
          {title}
        </h2>
      </div>

      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          theme={theme}
          onClick={() => onOpenModal(project)}
        />
      ))}
    </section>
  );
}

interface ProjectCardProps {
  project: Project;
  theme: 'amber' | 'cyan';
  onClick: () => void;
}

function ProjectCard({ project, theme, onClick }: ProjectCardProps) {
  const isCyan = theme === 'cyan';
  const accentColor = isCyan ? 'text-cyan-400' : 'text-amber-400';
  const borderColor = isCyan ? 'hover:border-cyan-500/50' : 'hover:border-amber-500/50';
  const glow = isCyan ? 'hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.15)]' : 'hover:shadow-[0_0_30px_-5px_rgba(251,191,36,0.15)]';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open case study for ${project.title}`}
      className={`group relative w-full text-left bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${borderColor} ${glow}`}
    >
      <div className="flex flex-col sm:flex-row h-full">
        <ProjectMedia
          src={project.image}
          alt={project.imageAlt}
          color={project.color}
          className="w-full sm:w-40 h-40 sm:h-auto shrink-0"
          imageClassName="group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
        />

        <div className="p-5 flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2 text-[10px] font-mono uppercase tracking-widest">
            <span className={accentColor}>{project.discipline}</span>
            <span className="text-gray-700">/</span>
            <span className="text-gray-500">{project.status}</span>
          </div>

          <div className="flex justify-between items-start gap-4 mb-2">
            <h3 className="text-lg font-bold text-white">{project.title}</h3>
            <ArrowUpRight className={`w-5 h-5 shrink-0 ${accentColor} opacity-40 group-hover:opacity-100 transition-all group-hover:translate-x-1 group-hover:-translate-y-1`} />
          </div>

          <p className="text-gray-400 text-sm line-clamp-2 mb-4">{project.description}</p>

          <div className="flex flex-wrap gap-2 mt-auto">
            {project.tech.slice(0, 3).map((technology) => (
              <span key={technology} className="px-2 py-1 text-[10px] uppercase font-mono bg-black/50 border border-white/5 rounded text-gray-400">
                {technology}
              </span>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}
