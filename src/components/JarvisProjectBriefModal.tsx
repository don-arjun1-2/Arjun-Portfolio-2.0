import React, { useEffect, useState, useRef } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Box,
  Zap,
  Radio,
  CheckCircle2,
  Sparkles,
  Terminal,
  Activity,
  Layers
} from 'lucide-react';
import { Project, getJarvisProjectBrief, JarvisProjectBrief } from '../utils/portfolioLogic';
import { ModelType } from './SpatialViewport';

interface JarvisProjectBriefModalProps {
  project: Project | null;
  onClose: () => void;
  onInspect3D?: (model: ModelType) => void;
}

export function JarvisProjectBriefModal({
  project,
  onClose,
  onInspect3D,
}: JarvisProjectBriefModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [brief, setBrief] = useState<JarvisProjectBrief | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (!project) return;
    const projectBrief = getJarvisProjectBrief(project.id);
    setBrief(projectBrief);
    setIsPlaying(true);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      synthRef.current.cancel();

      if (!isMuted) {
        const fullSpeech = `Here is the briefing on ${project.title}. ${projectBrief.voiceIntro} Technical summary: ${projectBrief.technicalSummary}`;
        const utterance = new SpeechSynthesisUtterance(fullSpeech);

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
  }, [project]);

  if (!project || !brief) return null;

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
      const fullSpeech = `${brief.voiceIntro} ${brief.technicalSummary}`;
      const utterance = new SpeechSynthesisUtterance(fullSpeech);
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
      aria-label={`JARVIS Voice Briefing for ${project.title}`}
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-neutral-950/85 backdrop-blur-xl animate-in fade-in duration-300"
      onClick={handleClose}
    >
      {/* Sci-Fi HUD Modal Card */}
      <div
        className="relative w-full max-w-2xl bg-neutral-950/95 border-2 border-cyan-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.3)] flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Holographic HUD Top Framing */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />

        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase font-bold flex items-center gap-2">
                <span>J.A.R.V.I.S. TACTICAL VOICE BRIEF</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                {project.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close JARVIS voice briefing"
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-xl border border-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-Time Hologram Waveform Animation */}
        <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 mb-6">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-300 mb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400 animate-spin" />
              <span className="font-semibold">VOICE SYNTHESIS PROTOCOL ACTIVE</span>
            </div>
            <span className="text-[11px] text-neutral-400 font-mono">{brief.systemStatus}</span>
          </div>

          {/* Equalizer Frequency Bars */}
          <div className="flex items-center justify-center gap-1.5 h-12 py-2">
            {[35, 65, 95, 45, 80, 100, 60, 90, 40, 75, 90, 50, 85, 30, 70, 95, 60, 40, 80, 55].map(
              (h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isPlaying ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'bg-neutral-700'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.max(20, (h * (i % 2 === 0 ? 1 : 0.75)))}%` : '15%',
                    transitionDelay: `${i * 30}ms`,
                  }}
                />
              )
            )}
          </div>
        </div>

        {/* JARVIS Dialogue Transcript */}
        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>JARVIS Vocal Telemetry:</span>
            </div>
            <p className="text-sm sm:text-base text-neutral-200 leading-relaxed italic">
              "{brief.voiceIntro}"
            </p>
          </div>

          {/* Technical Summary */}
          <div className="text-xs text-neutral-300 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-white font-medium">Core Engineering: </strong>
              {brief.technicalSummary}
            </span>
          </div>

          {/* Highlights checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
            {brief.highlights.map((hl, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-neutral-900/60 border border-cyan-900/40 text-[11px] font-mono text-neutral-300 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{hl}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-800/80">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleVoice}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 shadow-md transition-all active:scale-95"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause Voice' : 'Replay Voice Brief'}</span>
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
            {project.modelType && onInspect3D && (
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  onInspect3D(project.modelType!);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-cyan-300 bg-neutral-900 hover:bg-neutral-800 border border-cyan-500/30 rounded-xl transition-colors"
              >
                <Box className="w-3.5 h-3.5 text-cyan-400" />
                <span>Launch 3D Model</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl border border-neutral-800 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
