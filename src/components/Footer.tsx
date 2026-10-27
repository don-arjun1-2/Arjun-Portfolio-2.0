import React from 'react';
import { ArrowUp, FileText, Mail, Phone } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

interface FooterProps {
  onOpenResume: () => void;
}

export function Footer({ onOpenResume }: FooterProps) {
  const { personal } = PORTFOLIO_DATA;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-neutral-950 border-t border-neutral-900 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-neutral-400">
        <div>
          <span className="font-bold text-white text-sm">{personal.name}</span>
          <span className="mx-2">·</span>
          <span>Final-Year B.E. Computer Science & Engineering</span>
          <p className="mt-1 text-neutral-400">
            Akshaya College of Engineering and Technology, Coimbatore, Tamil Nadu
          </p>
        </div>

        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={onOpenResume}
            className="hover:text-white transition-colors"
          >
            Curriculum Vitae (PDF)
          </button>
          <a
            href={`mailto:${personal.emails.primary}`}
            className="hover:text-white transition-colors"
          >
            Email
          </a>
          <a
            href="#projects"
            className="hover:text-white transition-colors"
          >
            Projects
          </a>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors border border-neutral-800"
            aria-label="Scroll back to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
