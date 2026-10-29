import React, { useState } from 'react';
import { Menu, X, FileText, Send, Zap } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

interface NavigationProps {
  onOpenResume: () => void;
  onOpenContact: () => void;
  onReplayJarvis?: () => void;
}

export function Navigation({ onOpenResume, onOpenContact, onReplayJarvis }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/90 border-b border-neutral-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#home"
          className="text-lg font-bold tracking-tight text-white hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0"
        >
          {PORTFOLIO_DATA.personal.name}
          <span className="text-neutral-500 font-normal text-sm ml-2 hidden sm:inline">
            · AR/VR Developer
          </span>
        </a>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav
          className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-300"
          aria-label="Main navigation"
        >
          <a
            href="#projects"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Projects
          </a>
          <a
            href="#spatial-lab"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            3D Spatial Lab
          </a>
          <a
            href="#experience"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Experience
          </a>
          <a
            href="#skills"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Skills
          </a>
          <a
            href="#education"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Education
          </a>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {onReplayJarvis && (
            <button
              type="button"
              onClick={onReplayJarvis}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-mono font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/40 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
              title="Replay J.A.R.V.I.S. Welcome Sequence"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="hidden sm:inline">JARVIS HUD</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenResume}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>Resume (PDF)</span>
          </button>

          <button
            type="button"
            onClick={onOpenContact}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Get in Touch</span>
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-800 bg-neutral-950 px-6 py-4 flex flex-col gap-3">
          <a
            href="#projects"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-neutral-300 hover:text-white py-1"
          >
            Projects
          </a>
          <a
            href="#spatial-lab"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-neutral-300 hover:text-white py-1"
          >
            3D Spatial Lab
          </a>
          <a
            href="#experience"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-neutral-300 hover:text-white py-1"
          >
            Experience & Internships
          </a>
          <a
            href="#skills"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-neutral-300 hover:text-white py-1"
          >
            Technical Skills & Languages
          </a>
          <a
            href="#education"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-neutral-300 hover:text-white py-1"
          >
            Education & Awards
          </a>
          <div className="pt-2 border-t border-neutral-800 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenResume();
              }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-700 rounded-lg"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Resume PDF</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
