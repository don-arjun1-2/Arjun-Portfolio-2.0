import React from 'react';
import { FileText, ArrowRight, MapPin, GraduationCap, Sparkles, Box, ShieldCheck, Terminal, Compass, Zap } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

interface HeroProps {
  onOpenResume: () => void;
  onExploreProjects: () => void;
  onOpenJarvisAbout?: () => void;
}

export function Hero({ onOpenResume, onExploreProjects, onOpenJarvisAbout }: HeroProps) {
  const { personal, stats } = PORTFOLIO_DATA;

  return (
    <section id="home" className="pt-8 pb-16 px-6 max-w-7xl mx-auto">
      {/* Command Deck Hero Layout */}
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center bg-neutral-950/65 backdrop-blur-md p-8 sm:p-12 rounded-3xl border border-cyan-500/20 shadow-2xl shadow-cyan-950/40">
        {/* Editorial & Cyber Status Kicker */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-6 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-semibold tracking-wider">USER: ARJUN</span>
          <span aria-hidden="true" className="text-cyan-700">·</span>
          <span>STATUS: ONLINE</span>
          <span aria-hidden="true" className="text-cyan-700">·</span>
          <span className="text-neutral-300">B.E. COMPUTER SCIENCE 2026</span>
        </div>

        {/* Dominant Headline */}
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] font-display mb-6"
          style={{ textWrap: 'balance' }}
        >
          Engineering Immersive Realities, 3D Digital Twins & Autonomous Systems.
        </h1>

        {/* Lead Copy */}
        <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-normal max-w-3xl mb-6">
          Final-year Computer Science Engineering student at Akshaya College of Engineering and Technology, Coimbatore.
          Transforming complex spatial concepts into intuitive, user-friendly solutions across AR/VR pipelines,
          real-time Blender environments, and mobile platforms.
        </p>

        {/* Trust Markers */}
        <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-4 text-xs text-neutral-400 mb-8">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>{personal.location}</span>
          </span>
          <span aria-hidden="true" className="text-neutral-700">·</span>
          <span className="inline-flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Akshaya College of Eng & Tech</span>
          </span>
          <span aria-hidden="true" className="text-neutral-700">·</span>
          <span className="inline-flex items-center gap-1.5 font-mono text-neutral-300">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>AR/VR Developer & Systems Engineer</span>
          </span>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {onOpenJarvisAbout && (
            <button
              type="button"
              onClick={onOpenJarvisAbout}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-neutral-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:shadow-[0_0_35px_rgba(6,182,212,0.9)] transition-all hover:scale-[1.03] active:scale-[0.97]"
              title="Have J.A.R.V.I.S. verbally explain about Arjun"
            >
              <Zap className="w-4 h-4 text-neutral-950 fill-neutral-950 animate-pulse" />
              <span>Ask JARVIS About Arjun</span>
            </button>
          )}

          <button
            type="button"
            onClick={onExploreProjects}
            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>View Featured Projects</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#spatial-lab"
            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-cyan-300 bg-neutral-900/80 hover:bg-neutral-800/90 border border-cyan-500/30 hover:border-cyan-400/60 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm shadow-md"
          >
            <Box className="w-4 h-4 text-cyan-400" />
            <span>3D Spatial Lab Workstation</span>
          </a>

          <button
            type="button"
            onClick={onOpenResume}
            className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-neutral-200 bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/80 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm"
          >
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Resume (PDF)</span>
          </button>
        </div>

        {/* Quick Jump Links */}
        <div className="pt-4 border-t border-neutral-800/80 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-neutral-400">
          <span className="font-medium text-neutral-300">Quick Jump:</span>
          <a href="#projects" className="hover:text-cyan-400 transition-colors">ARVR Interviewer</a>
          <span aria-hidden="true" className="text-neutral-700">·</span>
          <a href="#spatial-lab" className="hover:text-cyan-400 transition-colors">Digital Twin 3D View</a>
          <span aria-hidden="true" className="text-neutral-700">·</span>
          <a href="#experience" className="hover:text-cyan-400 transition-colors">Praya Labs Intern</a>
          <span aria-hidden="true" className="text-neutral-700">·</span>
          <a href="#skills" className="hover:text-cyan-400 transition-colors">Technical Stack</a>
        </div>
      </div>

      {/* Full-Width Key Metrics Strip */}
      <div className="mt-14 pt-8 border-t border-neutral-800/80 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="flex flex-col space-y-1 p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/70 backdrop-blur-sm"
          >
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono tabular-nums">
              {stat.value}
            </span>
            <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">
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
