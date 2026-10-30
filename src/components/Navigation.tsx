import React, { useState } from 'react';
import { Menu, X, FileText, Send, Zap, Smartphone, Download, Mic, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { useAuth } from '../hooks/useAuth';

interface NavigationProps {
  onOpenResume: () => void;
  onOpenContact: () => void;
  onReplayJarvis?: () => void;
  onOpenInstall?: () => void;
  onOpenLiveVoice?: () => void;
}

export function Navigation({
  onOpenResume,
  onOpenContact,
  onReplayJarvis,
  onOpenInstall,
  onOpenLiveVoice,
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, signInWithGoogle, signOut } = useAuth();

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
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {onOpenLiveVoice && (
            <button
              type="button"
              onClick={onOpenLiveVoice}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold text-neutral-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 rounded-lg transition-all shadow-[0_0_15px_rgba(6,182,212,0.5)] active:scale-95"
              title="Start real-time voice conversation with gemini-3.8-live"
            >
              <Mic className="w-3.5 h-3.5 fill-neutral-950 animate-pulse" />
              <span>Live Voice</span>
            </button>
          )}

          {onOpenInstall && (
            <button
              type="button"
              onClick={onOpenInstall}
              className="hidden xl:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-mono font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/40 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
              title="Convert / Install as Mobile App"
            >
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Install App</span>
            </button>
          )}

          {/* Firebase Google Auth Button */}
          {user ? (
            <div className="flex items-center gap-2 bg-neutral-900/80 border border-neutral-700/80 rounded-lg px-2.5 py-1">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-5 h-5 rounded-full" />
              ) : (
                <UserIcon className="w-4 h-4 text-cyan-400" />
              )}
              <span className="text-[11px] font-mono text-neutral-200 hidden md:inline truncate max-w-[90px]">
                {user.displayName?.split(' ')[0] || 'User'}
              </span>
              <button
                type="button"
                onClick={signOut}
                title="Sign out of Firebase"
                className="text-neutral-400 hover:text-red-400 ml-1 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={signInWithGoogle}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-lg transition-colors whitespace-nowrap shadow-sm"
              title="Sign in with Google to enable Firestore sync"
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {onReplayJarvis && (
            <button
              type="button"
              onClick={onReplayJarvis}
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-mono font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/40 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
              title="Replay J.A.R.V.I.S. Welcome Sequence"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>JARVIS HUD</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenContact}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Contact</span>
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

          {onOpenLiveVoice && (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLiveVoice();
              }}
              className="flex items-center gap-2 py-2 px-3 rounded-lg bg-cyan-400 text-neutral-950 text-xs font-mono font-bold"
            >
              <Mic className="w-4 h-4 fill-neutral-950" />
              <span>Start Live Voice (gemini-3.8-live)</span>
            </button>
          )}

          {onOpenInstall && (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenInstall();
              }}
              className="flex items-center gap-2 py-2 px-3 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-medium"
            >
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span>Install Mobile Application (PWA)</span>
            </button>
          )}

          {user ? (
            <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs">
              <span className="text-emerald-400 font-mono truncate">{user.displayName || user.email}</span>
              <button
                type="button"
                onClick={signOut}
                className="text-neutral-400 hover:text-red-400 font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                signInWithGoogle();
              }}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs font-medium"
            >
              <LogIn className="w-4 h-4 text-indigo-400" />
              <span>Sign in with Google</span>
            </button>
          )}

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
