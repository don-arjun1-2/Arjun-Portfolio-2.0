import React from 'react';
import { X, ExternalLink, Cpu, CheckCircle2, Layers, Calendar, UserCheck, ArrowRight, Zap, Radio } from 'lucide-react';
import { Project } from '../utils/portfolioLogic';
import { ModelType } from './SpatialViewport';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onInspect3D: (model: ModelType) => void;
  onTriggerJarvisBrief?: (project: Project) => void;
}

export function ProjectModal({ project, onClose, onInspect3D, onTriggerJarvisBrief }: ProjectModalProps) {
  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-6 sm:p-8 text-neutral-100">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
          aria-label="Close project modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Metadata (Zero-pill format) */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
          <span className="text-indigo-400 font-medium">{project.categoryLabel}</span>
          <span aria-hidden="true">·</span>
          <span>Timeline: {project.timeline}</span>
          <span aria-hidden="true">·</span>
          <span>{project.role}</span>
        </div>

        {/* Title & Tagline */}
        <h2 id="project-modal-title" className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2 font-display">
          {project.title}
        </h2>
        <p className="text-sm sm:text-base text-neutral-300 mb-6">
          {project.tagline}
        </p>

        {/* JARVIS Vocal Briefing Banner */}
        {onTriggerJarvisBrief && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 mb-6 rounded-xl bg-cyan-950/40 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <div className="flex items-center gap-2.5 text-xs text-cyan-300">
              <Zap className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" />
              <span>J.A.R.V.I.S. is primed to explain this project's architecture aloud.</span>
            </div>
            <button
              type="button"
              onClick={() => onTriggerJarvisBrief(project)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold text-neutral-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <span>Play Voice Brief</span>
            </button>
          </div>
        )}

        {/* Detailed Narrative */}
        <div className="space-y-6 text-sm text-neutral-300">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Project Overview & Mission
            </h3>
            <p className="leading-relaxed bg-neutral-950/60 p-4 rounded-xl border border-neutral-800">
              {project.description}
            </p>
          </div>

          {/* Key Architectural Highlights */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
              Technical Highlights & Deliverables
            </h3>
            <ul className="space-y-2.5">
              {project.highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Impact Statement */}
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-900/50">
            <span className="block text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
              Measurable Impact
            </span>
            <p className="text-indigo-200/90 leading-relaxed">
              {project.impact}
            </p>
          </div>

          {/* Tech Stack Unboxed */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Technologies & Tools
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-neutral-800 border border-neutral-700 text-neutral-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-5 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
          {project.modelType ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onInspect3D(project.modelType!);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Inspect in 3D Spatial Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white bg-neutral-800 rounded-lg transition-colors"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
}
