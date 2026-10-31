import React, { useEffect, useState, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Shield,
  CheckCircle2,
  Terminal,
  Activity,
  Radio,
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { JARVIS_BOOT_STEPS, getBootStepProgress } from '../utils/portfolioLogic';

interface JarvisWelcomeOverlayProps {
  onComplete: () => void;
}

export function JarvisWelcomeOverlay({ onComplete }: JarvisWelcomeOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const humOscRef = useRef<OscillatorNode | null>(null);
  const humGainRef = useRef<GainNode | null>(null);

  // Play continuous low-frequency sci-fi background hum
  const startLowFrequencyHum = () => {
    if (!isAudioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Create subtle dual-sub-frequency hum (55Hz base + 110Hz harmonic)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, ctx.currentTime); // 55 Hz sub-bass
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.025, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      humOscRef.current = osc;
      humGainRef.current = gain;
    } catch {
      // Audio autoplay policy fallback
    }
  };

  const stopLowFrequencyHum = () => {
    try {
      if (humGainRef.current && audioCtxRef.current) {
        humGainRef.current.gain.linearRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.4);
        setTimeout(() => {
          humOscRef.current?.stop();
          humOscRef.current?.disconnect();
          humOscRef.current = null;
        }, 400);
      }
    } catch {
      // fallback
    }
  };

  // Synthesize soft, futuristic JARVIS sci-fi chimes using Web Audio API
  const playSciFiTone = (freq: number, type: OscillatorType = 'sine', duration = 0.15) => {
    if (!isAudioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // Step progression sequence
  useEffect(() => {
    // Start ambient low-frequency reactor hum
    startLowFrequencyHum();

    // Play initial boot chime
    playSciFiTone(587.33, 'sine', 0.2); // D5
    setTimeout(() => playSciFiTone(880, 'sine', 0.25), 120); // A5

    const t1 = setTimeout(() => {
      setCurrentStep(1);
      playSciFiTone(784, 'triangle', 0.18); // G5
    }, 900);

    const t2 = setTimeout(() => {
      setCurrentStep(2);
      playSciFiTone(987.77, 'sine', 0.2); // B5
    }, 1900);

    const t3 = setTimeout(() => {
      setCurrentStep(3);
      // Dual harmonic welcome chime
      playSciFiTone(1046.5, 'sine', 0.35); // C6
      setTimeout(() => playSciFiTone(1318.5, 'sine', 0.4), 100); // E6

      // Voice synthesis greeting if available and permitted
      try {
        if ('speechSynthesis' in window && isAudioEnabled) {
          const utterance = new SpeechSynthesisUtterance('Welcome back, Arjun. All systems online.');
          utterance.rate = 1.05;
          utterance.pitch = 0.95;
          window.speechSynthesis.speak(utterance);
        }
      } catch {
        // Speech synthesis fallback
      }
    }, 3000);

    // Auto-complete sequence after showing final greeting
    const t4 = setTimeout(() => {
      handleDismiss();
    }, 9000);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      window.removeEventListener('keydown', handleKeyDown);
      stopLowFrequencyHum();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const handleDismiss = () => {
    stopLowFrequencyHum();
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  const activeStepData = JARVIS_BOOT_STEPS[currentStep] || JARVIS_BOOT_STEPS[0];
  const progressPercent = getBootStepProgress(currentStep, JARVIS_BOOT_STEPS.length);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="JARVIS System Boot Sequence"
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-all duration-500 bg-neutral-950/95 backdrop-blur-2xl ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Sci-Fi Backdrop with custom HUD image texture and radial dark vignette */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: `url('/assets/aistudio/file_00000000e83c8208a52b2a4ba944f902_4131373d.png')`,
        }}
      />
      <div className="absolute inset-0 bg-neutral-950/85 pointer-events-none" />

      {/* Cyber Grid Lines & Corner Framing */}
      <div className="absolute inset-4 sm:inset-8 border border-cyan-500/20 rounded-3xl pointer-events-none">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400 rounded-tl-xl" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400 rounded-tr-xl" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400 rounded-bl-xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400 rounded-br-xl" />
      </div>

      {/* Top Protocol Telemetry Bar */}
      <div className="absolute top-8 left-8 right-8 flex items-center justify-between text-xs font-mono text-cyan-400/90 pointer-events-auto">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-bold tracking-widest uppercase">J.A.R.V.I.S. PROTOCOL v4.2</span>
          <span className="text-neutral-600 hidden sm:inline">|</span>
          <span className="text-neutral-400 hidden sm:inline">STARK ARCHITECTURE · ARJUN EDITION</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-900/80 border border-cyan-500/30 text-cyan-300 hover:bg-neutral-800 transition-colors"
            title={isAudioEnabled ? 'Mute boot chimes' : 'Enable boot chimes'}
          >
            {isAudioEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[11px]">AUDIO ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-neutral-500" />
                <span className="text-[11px] text-neutral-500">MUTED</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="text-xs text-neutral-400 hover:text-white transition-colors"
          >
            Skip [ESC]
          </button>
        </div>
      </div>

      {/* Main Hologram Container */}
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center">
        {/* Holographic Arc Reactor Ring */}
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 mb-8 flex items-center justify-center">
          {/* Outer dashed spinning ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/40 animate-[spin_12s_linear_infinite]" />

          {/* Middle segmented counter-rotating ring */}
          <div className="absolute inset-2 rounded-full border border-cyan-400/30 border-t-cyan-400 border-b-cyan-400 animate-[spin_8s_linear_infinite_reverse]" />

          {/* Glowing pulse aura */}
          <div className="absolute inset-6 rounded-full bg-cyan-500/10 animate-ping opacity-30" />

          {/* Inner Core Arc Reactor */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-neutral-950 border-2 border-cyan-400/80 shadow-[0_0_40px_rgba(6,182,212,0.5)] flex flex-col items-center justify-center p-3">
            <div className="w-6 h-6 border-b-2 border-r-2 border-cyan-400 rotate-45 mb-1" />
            <span className="font-display font-extrabold text-sm tracking-widest text-cyan-300">
              ARJUN
            </span>
            <span className="text-[9px] font-mono tracking-wider text-cyan-400 uppercase">
              ONLINE
            </span>
          </div>

          {/* Radiating concentric brackets */}
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-12 border-l-2 border-cyan-400" />
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-2 h-12 border-r-2 border-cyan-400" />
        </div>

        {/* Audio Waveform Hologram Simulation (Matching background JARVIS visualizer) */}
        <div className="flex items-center gap-1.5 h-8 mb-6">
          {[40, 70, 30, 90, 60, 100, 45, 80, 95, 50, 85, 35, 75, 90, 60, 40].map((h, i) => (
            <div
              key={i}
              className="w-1 bg-cyan-400 rounded-full animate-pulse transition-all"
              style={{
                height: `${h}%`,
                animationDelay: `${i * 70}ms`,
                opacity: currentStep === 3 ? 1 : 0.6,
              }}
            />
          ))}
        </div>

        {/* Dynamic Holographic Dialogue Text */}
        <div className="space-y-3 min-h-[5.5rem] flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="tracking-widest uppercase font-semibold">[{activeStepData.system}]</span>
            <span className="text-neutral-500">::</span>
            <span className="text-cyan-200">{activeStepData.code}</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white font-display">
            {activeStepData.message}
          </h2>
        </div>

        {/* Progression Bar & Stage Indicators */}
        <div className="w-full max-w-md mt-6 mb-8">
          <div className="flex justify-between items-center text-[11px] font-mono text-neutral-400 mb-2">
            <span>INITIALIZING SPATIAL OS</span>
            <span className="text-cyan-300 font-bold">{progressPercent}%</span>
          </div>

          <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden border border-cyan-500/20">
            <div
              className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-300 h-1.5 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Step Nodes */}
          <div className="grid grid-cols-4 gap-2 mt-3">
            {JARVIS_BOOT_STEPS.map((s, idx) => {
              const isPassed = idx <= currentStep;
              return (
                <div
                  key={s.step}
                  className={`py-1 px-1.5 rounded text-[10px] font-mono text-center border transition-all ${
                    isPassed
                      ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
                      : 'bg-neutral-900/40 border-neutral-800 text-neutral-600'
                  }`}
                >
                  STEP 0{s.step}
                </div>
              );
            })}
          </div>
        </div>

        {/* Enter System Action */}
        <button
          type="button"
          onClick={handleDismiss}
          className="group relative inline-flex items-center gap-2.5 px-7 py-3 text-sm font-bold tracking-wider uppercase text-neutral-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:shadow-[0_0_35px_rgba(6,182,212,0.9)] transition-all hover:scale-105 active:scale-95"
        >
          <span>ENTER ARJUN'S WORKSPACE</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-[11px] font-mono text-neutral-500 mt-4">
          Press ESC or click anywhere to bypass boot sequence
        </p>
      </div>
    </div>
  );
}
