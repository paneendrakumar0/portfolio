import React from 'react';
import { ArrowRight, Github } from 'lucide-react';
import { PROJECTS_DATA } from '../data/projects';
import { ProjectMedia } from './ProjectMedia';

interface FeaturedWorkProps {
  onNavigate: (page: string) => void;
}

export function FeaturedWork({ onNavigate }: FeaturedWorkProps) {
  const featuredProjects = PROJECTS_DATA.filter((project) => project.featured);

  const openCaseStudy = (slug: string) => {
    const url = new URL('/projects', window.location.origin);
    url.searchParams.set('project', slug);
    window.history.pushState({ page: 'Projects' }, '', url);
    onNavigate('Projects');
  };

  return (
    <section aria-labelledby="featured-work-title" className="py-16 md:py-20 border-t border-white/5">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-400 mb-3">Selected evidence</p>
          <h2 id="featured-work-title" className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Featured engineering work
          </h2>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('Projects')}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white"
        >
          Explore all case studies
          <ArrowRight aria-hidden="true" className="w-4 h-4" />
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {featuredProjects.map((project) => (
          <article key={project.id} className="group rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden hover:border-white/20 transition-colors">
            <ProjectMedia
              src={project.image}
              alt={project.imageAlt}
              color={project.color}
              className="h-48 w-full"
              imageClassName="group-hover:scale-105 transition-transform duration-500"
            />
            <div className="p-6">
              <div className="flex items-center justify-between gap-3 text-[10px] font-mono uppercase tracking-widest mb-3">
                <span style={{ color: project.color }}>{project.discipline}</span>
                <span className="text-gray-600">{project.year}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
              <p className="text-sm leading-relaxed text-gray-400 mb-5 line-clamp-3">{project.description}</p>

              <dl className="grid grid-cols-2 gap-3 mb-5">
                {project.stats.slice(0, 2).map((stat) => (
                  <div key={stat.label} className="rounded-lg bg-black/30 p-3">
                    <dt className="text-[9px] uppercase tracking-wider text-gray-600 mb-1">{stat.label}</dt>
                    <dd className="text-sm font-bold text-gray-200">{stat.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => openCaseStudy(project.slug)}
                  className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-cyan-300"
                >
                  View case study
                  <ArrowRight aria-hidden="true" className="w-4 h-4" />
                </button>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${project.title} source repository`}
                  className="rounded-lg border border-white/10 p-2 text-gray-500 hover:text-white hover:bg-white/5"
                >
                  <Github aria-hidden="true" className="w-4 h-4" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
