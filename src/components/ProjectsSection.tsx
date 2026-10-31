import React, { useState } from 'react';
import { ArrowUpRight, Cpu, Eye, Box, Smartphone, Check, Sparkles, Filter, Zap, Radio } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { Project, filterProjects } from '../utils/portfolioLogic';
import { ModelType } from './SpatialViewport';

interface ProjectsSectionProps {
  onSelectProject: (project: Project) => void;
  onInspect3D: (model: ModelType) => void;
  onJarvisBrief?: (project: Project) => void;
}

export function ProjectsSection({ onSelectProject, onInspect3D, onJarvisBrief }: ProjectsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const allProjects = PORTFOLIO_DATA.projects;
  const filteredProjects = filterProjects(allProjects, activeCategory, selectedTech);

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'arvr', label: 'AR/VR Simulation' },
    { id: 'blender', label: 'Digital Twin & 3D' },
    { id: 'ai', label: 'Autonomous Systems' },
    { id: 'mobile', label: 'Mobile Apps' },
  ];

  const handleTechClick = (tech: string) => {
    if (selectedTech?.toLowerCase() === tech.toLowerCase()) {
      setSelectedTech(null); // toggle off
    } else {
      setSelectedTech(tech);
    }
  };

  return (
    <section id="projects" className="py-16 px-6 max-w-7xl mx-auto border-t border-neutral-900">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
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

      {/* Active Technology Filter Tag Indicator Bar */}
      {selectedTech && (
        <div className="flex items-center justify-between gap-3 p-3 mb-8 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-cyan-400 uppercase font-semibold">Filtering by Technology:</span>
            <span className="px-2.5 py-1 rounded-md bg-cyan-400 text-neutral-950 font-mono font-bold shadow-[0_0_10px_rgba(6,182,212,0.5)]">
              {selectedTech}
            </span>
            <span className="text-neutral-400 hidden sm:inline">
              ({filteredProjects.length} {filteredProjects.length === 1 ? 'project matches' : 'projects match'})
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSelectedTech(null)}
            className="px-3 py-1 text-xs font-mono font-medium rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-cyan-300 hover:text-white transition-colors"
          >
            Clear Tech Filter ✕
          </button>
        </div>
      )}

      {/* Dynamic Bento Box Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => {
          const isWide = project.id === 'arvr-interviewer' && activeCategory === 'all';

          return (
            <div
              key={project.id}
              onClick={() => {
                if (onJarvisBrief) {
                  onJarvisBrief(project);
                } else {
                  onSelectProject(project);
                }
              }}
              className={`group relative overflow-hidden cursor-pointer flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-neutral-900/75 dark:bg-neutral-900/75 light:bg-white/90 border border-neutral-800/80 dark:border-neutral-800/80 light:border-slate-200 hover:border-cyan-400/70 hover:shadow-[0_0_35px_rgba(6,182,212,0.35),0_0_15px_rgba(99,102,241,0.25)] hover:-translate-y-1 transition-all duration-300 ${
                isWide ? 'md:col-span-2' : 'col-span-1'
              }`}
            >
              {/* Subtle Holographic Neon Top Edge Glow Accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-[0_0_10px_#22d3ee]" />

              {/* Ambient Radial Hover Backlight Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-cyan-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

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
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2 group-hover:text-cyan-300 transition-colors duration-200">
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
                {/* Tech Stack Clickable Filter Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5 pt-3 border-t border-neutral-800/60">
                  {project.techStack.map((tech, i) => {
                    const isSelected = selectedTech?.toLowerCase() === tech.toLowerCase();
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTechClick(tech);
                        }}
                        className={`text-[11px] font-mono px-2 py-0.5 rounded transition-all duration-150 cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-400 text-neutral-950 font-bold border border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.6)] scale-105'
                            : 'bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-cyan-500/60 text-neutral-300 hover:text-cyan-200'
                        }`}
                        title={`Filter gallery by ${tech}`}
                        aria-pressed={isSelected}
                      >
                        {tech}
                      </button>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2">
                  <div className="flex items-center gap-2">
                    {onJarvisBrief && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onJarvisBrief(project);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-cyan-300 hover:text-cyan-200 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 rounded-lg transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)] active:scale-95"
                        title="Touch to have JARVIS explain this project"
                      >
                        <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                        <span>JARVIS Brief</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject(project);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <span>Specs</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {project.modelType && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onInspect3D(project.modelType!);
                      }}
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

      {/* Empty State for zero matches */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12 px-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 text-neutral-400">
          <p className="text-sm font-mono mb-3">No projects match the selected criteria.</p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('all');
              setSelectedTech(null);
            }}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-400 hover:bg-cyan-300 text-neutral-950 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </section>
  );
}
