import React, { useEffect, useState, useRef } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Radio,
  CheckCircle2,
  Sparkles,
  Terminal,
  Activity,
  Layers,
  GraduationCap,
  MapPin,
  FileText,
  Box,
  ArrowRight
} from 'lucide-react';
import { getJarvisAboutBrief, JarvisAboutBrief } from '../utils/portfolioLogic';

interface JarvisAboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreProjects?: () => void;
  onOpenResume?: () => void;
  onLaunchSpatialLab?: () => void;
}

export function JarvisAboutModal({
  isOpen,
  onClose,
  onExploreProjects,
  onOpenResume,
  onLaunchSpatialLab,
}: JarvisAboutModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const brief = getJarvisAboutBrief();
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (!isOpen) {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      return;
    }

    setIsPlaying(true);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      synthRef.current.cancel();

      if (!isMuted) {
        const utterance = new SpeechSynthesisUtterance(brief.voiceScript);
        const voices = synthRef.current.getVoices();
        const preferredVoice = voices.find(
          (v) =>
            v.name.toLowerCase().includes('daniel') ||
            v.name.toLowerCase().includes('uk') ||
            v.name.toLowerCase().includes('english') ||
            v.lang.startsWith('en')
        );
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        utterance.rate = 1.02;
        utterance.pitch = 0.95;

        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);

        synthRef.current.speak(utterance);
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    onClose();
  };

  const handleToggleVoice = () => {
    if (!synthRef.current) return;

    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(brief.voiceScript);
      utterance.rate = 1.02;
      utterance.pitch = 0.95;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      synthRef.current.speak(utterance);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="JARVIS Briefing: About Arjun A"
      className="fixed inset-0 z-[130] flex items-center justify-center p-4 sm:p-6 bg-neutral-950/85 backdrop-blur-xl animate-in fade-in duration-300"
      onClick={handleClose}
    >
      {/* Sci-Fi Hologram HUD Card */}
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-neutral-950/95 border-2 border-cyan-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(6,182,212,0.35)] flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Holographic HUD Top & Corner Framing */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent pointer-events-none" />
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />

        {/* Header Row */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase font-bold flex items-center gap-2">
                <span>J.A.R.V.I.S. PERSONNEL DOSSIER</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
                About Arjun A
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close JARVIS dossier"
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-xl border border-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-Time Hologram Waveform */}
        <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 mb-6">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-300 mb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400 animate-spin" />
              <span className="font-semibold">JARVIS AUDIO SYNTHESIS TRANSMITTING</span>
            </div>
            <span className="text-[11px] text-cyan-400/90 font-mono">STATUS: {brief.status}</span>
          </div>

          {/* Equalizer Frequency Bars */}
          <div className="flex items-center justify-center gap-1.5 h-12 py-2">
            {[45, 80, 100, 60, 90, 40, 75, 95, 50, 85, 30, 70, 95, 60, 40, 80, 55, 90, 70, 45].map(
              (h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isPlaying ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'bg-neutral-700'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.max(20, (h * (i % 2 === 0 ? 1 : 0.8)))}%` : '15%',
                    transitionDelay: `${i * 30}ms`,
                  }}
                />
              )
            )}
          </div>
        </div>

        {/* JARVIS Vocal Narration Card */}
        <div className="space-y-4 mb-6">
          <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800/90 shadow-inner">
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5" />
              <span>JARVIS Vocal Narration:</span>
            </div>
            <p className="text-sm sm:text-base text-neutral-200 leading-relaxed italic">
              "{brief.voiceScript}"
            </p>
          </div>

          {/* Quick Telemetry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {brief.systemTelemetry.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between"
              >
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  {item.label}
                </span>
                <span className="text-xs font-semibold text-cyan-300 leading-snug">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Core Highlights */}
          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20">
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Verified Engineering Strengths:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {brief.coreHighlights.map((hl, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs text-neutral-200"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Controls & Navigation Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-800/80">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleVoice}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 shadow-md transition-all active:scale-95"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause Voice' : 'Replay Voice Bio'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (synthRef.current) {
                  synthRef.current.cancel();
                  setIsPlaying(false);
                }
              }}
              className="p-2 text-neutral-400 hover:text-white bg-neutral-900 rounded-xl border border-neutral-800 transition-colors"
              title="Stop voice"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onExploreProjects && (
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  onExploreProjects();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-200 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 rounded-xl transition-colors"
              >
                <span>View Projects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {onOpenResume && (
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  onOpenResume();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-200 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 rounded-xl transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Resume (PDF)</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleClose}
              className="px-3.5 py-2 text-xs font-medium text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl border border-neutral-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
