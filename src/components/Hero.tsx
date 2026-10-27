import React from 'react';
import { FileText, ArrowRight, MapPin, GraduationCap, Sparkles } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { SpatialViewport, ModelType } from './SpatialViewport';

interface HeroProps {
  onOpenResume: () => void;
  onExploreProjects: () => void;
  onSelectModel: (model: ModelType) => void;
}

export function Hero({ onOpenResume, onExploreProjects, onSelectModel }: HeroProps) {
  const { personal, stats } = PORTFOLIO_DATA;

  return (
    <section id="home" className="pt-8 pb-16 px-6 max-w-7xl mx-auto">
      {/* 2-Column Split Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        {/* Left Column: Typographic Hierarchy */}
        <div className="lg:col-span-6 flex flex-col justify-between py-2">
          <div className="space-y-5">
            {/* Editorial Kicker */}
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
              <span className="text-indigo-400 font-semibold tracking-wide">AR/VR & SPATIAL SYSTEMS</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span>B.E. COMPUTER SCIENCE 2026</span>
            </div>

            {/* Dominant Headline */}
            <h1
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-white leading-[1.1] font-display"
              style={{ textWrap: 'balance' }}
            >
              Engineering Immersive Realities, 3D Digital Twins & Autonomous Systems.
            </h1>

            {/* Lead Copy */}
            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-normal">
              Final-year Computer Science Engineering student at Akshaya College of Engineering and Technology, Coimbatore.
              Transforming complex spatial concepts into intuitive, user-friendly solutions across AR/VR pipelines,
              real-time Blender environments, and mobile platforms.
            </p>

            {/* Trust Markers */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-neutral-400 pt-1">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                <span>{personal.location}</span>
              </span>
              <span aria-hidden="true" className="text-neutral-700">·</span>
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-neutral-500" />
                <span>Akshaya College of Eng & Tech</span>
              </span>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="button"
                onClick={onExploreProjects}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md transition-colors"
              >
                <span>View Featured Projects</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenResume}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 rounded-lg transition-colors"
              >
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Official Resume (PDF)</span>
              </button>
            </div>
          </div>

          {/* Quick Jump Links */}
          <div className="pt-6 mt-6 border-t border-neutral-800/80 flex items-center gap-4 text-xs text-neutral-400">
            <span className="font-medium text-neutral-300">Quick Jump:</span>
            <a href="#projects" className="hover:text-indigo-400 transition-colors">ARVR Interviewer</a>
            <span aria-hidden="true" className="text-neutral-700">·</span>
            <a href="#experience" className="hover:text-indigo-400 transition-colors">Praya Labs Intern</a>
            <span aria-hidden="true" className="text-neutral-700">·</span>
            <a href="#skills" className="hover:text-indigo-400 transition-colors">Technical Stack</a>
          </div>
        </div>

        {/* Right Column: Interactive 3D Spatial Canvas */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <SpatialViewport
            initialModel="headset"
            onModelSelect={onSelectModel}
            className="w-full h-full shadow-2xl"
          />
        </div>
      </div>

      {/* Full-Width Key Metrics Strip Below Split */}
      <div className="mt-12 pt-8 border-t border-neutral-800/90 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col space-y-1">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono tabular-nums">
              {stat.value}
            </span>
            <span className="text-xs font-semibold text-neutral-200 uppercase tracking-wider">
              {stat.label}
            </span>
            <span className="text-xs text-neutral-400 leading-snug">
              {stat.detail}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
