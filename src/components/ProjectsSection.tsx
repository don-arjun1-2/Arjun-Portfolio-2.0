import React, { useState } from 'react';
import { ArrowUpRight, Cpu, Eye, Box, Smartphone, Check, Sparkles, Filter } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { Project, filterProjects } from '../utils/portfolioLogic';
import { ModelType } from './SpatialViewport';

interface ProjectsSectionProps {
  onSelectProject: (project: Project) => void;
  onInspect3D: (model: ModelType) => void;
}

export function ProjectsSection({ onSelectProject, onInspect3D }: ProjectsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const allProjects = PORTFOLIO_DATA.projects;
  const filteredProjects = filterProjects(allProjects, activeCategory);

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'arvr', label: 'AR/VR Simulation' },
    { id: 'blender', label: 'Digital Twin & 3D' },
    { id: 'ai', label: 'Autonomous Systems' },
    { id: 'mobile', label: 'Mobile Apps' },
  ];

  return (
    <section id="projects" className="py-16 px-6 max-w-7xl mx-auto border-t border-neutral-900">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">
            ENGINEERED SYSTEMS & PROTOTYPES
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
            Featured Projects
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 mt-2 max-w-xl">
            From spatial mock-interview chambers in Blender to autonomous aerial drone telemetry and collaborative student software.
          </p>
        </div>

        {/* Category Filter Tabs (Functional segmented buttons) */}
        <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-xl overflow-x-auto max-w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Bento Box Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => {
          const isWide = project.id === 'arvr-interviewer' && activeCategory === 'all';

          return (
            <div
              key={project.id}
              className={`group flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-neutral-900/70 border border-neutral-800/80 hover:border-neutral-700 transition-all duration-200 shadow-sm ${
                isWide ? 'md:col-span-2' : 'col-span-1'
              }`}
            >
              <div>
                {/* Unboxed Metadata Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-400 mb-3">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className="text-indigo-400 font-semibold">{project.categoryLabel}</span>
                    <span aria-hidden="true" className="text-neutral-700">·</span>
                    <span className="font-mono text-neutral-400">{project.timeline}</span>
                  </div>
                  <span className="text-neutral-400 font-mono text-[11px] truncate max-w-[200px]" title={project.role}>
                    {project.role}
                  </span>
                </div>

                {/* Project Title */}
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2 group-hover:text-indigo-300 transition-colors">
                  {project.title}
                </h3>

                {/* Tagline */}
                <p className="text-xs font-medium text-neutral-400 mb-3">
                  {project.tagline}
                </p>

                {/* Description */}
                <p className="text-sm text-neutral-300 leading-relaxed mb-5 line-clamp-3">
                  {project.description}
                </p>

                {/* Key Highlights list */}
                <ul className="space-y-1.5 mb-6 text-xs text-neutral-300">
                  {project.highlights.slice(0, isWide ? 3 : 2).map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-indigo-400 font-bold shrink-0">›</span>
                      <span className="leading-snug">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                {/* Tech Stack Unboxed Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5 pt-3 border-t border-neutral-800/60">
                  {project.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => onSelectProject(project)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <span>Read Architecture Specs</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  {project.modelType && (
                    <button
                      type="button"
                      onClick={() => onInspect3D(project.modelType!)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg transition-colors"
                      title="Load model into 3D Spatial Viewport"
                    >
                      <Cpu className="w-3 h-3 text-indigo-400" />
                      <span>3D View</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
