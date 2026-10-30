import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Radio,
  Volume2,
  X,
  Sparkles,
  Zap,
  Activity,
  Terminal,
  MessageSquare,
  ShieldCheck,
  User,
  LogIn,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface LiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LiveVoiceModal({ isOpen, onClose }: LiveVoiceModalProps) {
  const { user, signInWithGoogle } = useAuth();
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'listening' | 'speaking' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userTranscript, setUserTranscript] = useState<string>('');
  const [modelTranscript, setModelTranscript] = useState<string>('');
  const [conversationLog, setConversationLog] = useState<{ speaker: 'user' | 'model'; text: string; time: string }[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const playbackContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorNodeRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionStartTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isOpen) {
      stopVoiceSession();
    }
  }, [isOpen]);

  const startVoiceSession = async () => {
    try {
      setStatus('connecting');
      setErrorMessage(null);
      sessionStartTimeRef.current = Date.now();

      // Establish WebSocket connection to backend live bridge
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      // 24kHz AudioContext for playing Gemini output PCM audio
      const playbackCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000,
      });
      playbackContextRef.current = playbackCtx;
      nextStartTimeRef.current = playbackCtx.currentTime;

      ws.onopen = async () => {
        console.log('[Live Voice] Connected to Live API WebSocket');
        await setupMicrophone(ws);
      };

      ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'session_ready') {
            setStatus('listening');
          } else if (data.type === 'audio' && data.audio) {
            setStatus('speaking');
            playAudioChunk(data.audio);
          } else if (data.type === 'transcript_model' && data.text) {
            setModelTranscript((prev) => prev + data.text);
          } else if (data.type === 'transcript_user' && data.text) {
            setUserTranscript((prev) => prev + data.text);
          } else if (data.type === 'turn_complete') {
            setStatus('listening');
            setModelTranscript((prev) => {
              if (prev.trim()) {
                setConversationLog((logs) => [
                  ...logs,
                  { speaker: 'model', text: prev.trim(), time: new Date().toLocaleTimeString() },
                ]);
              }
              return '';
            });
            setUserTranscript((prev) => {
              if (prev.trim()) {
                setConversationLog((logs) => [
                  ...logs,
                  { speaker: 'user', text: prev.trim(), time: new Date().toLocaleTimeString() },
                ]);
              }
              return '';
            });
          } else if (data.type === 'interrupted') {
            // Cancel current playback pipeline
            if (playbackContextRef.current) {
              playbackContextRef.current.close().catch(() => {});
              const newPlaybackCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
                sampleRate: 24000,
              });
              playbackContextRef.current = newPlaybackCtx;
              nextStartTimeRef.current = newPlaybackCtx.currentTime;
            }
            setStatus('listening');
          } else if (data.type === 'error') {
            setStatus('error');
            setErrorMessage(data.message);
          }
        } catch (e) {
          console.warn('[Live Voice] Failed to parse message:', e);
        }
      };

      ws.onerror = (err) => {
        console.error('[Live Voice] WebSocket error:', err);
        setStatus('error');
        setErrorMessage('Unable to connect to Voice Live API. Please ensure your microphone is enabled.');
      };

      ws.onclose = () => {
        if (status !== 'error') {
          setStatus('idle');
        }
      };
    } catch (err: any) {
      console.error('[Live Voice] Error starting session:', err);
      setStatus('error');
      setErrorMessage(err?.message || 'Microphone access denied or audio stream failed.');
    }
  };

  const setupMicrophone = async (ws: WebSocket) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        sampleRate: 16000,
        echoCancellation: true,
        noiseSuppression: true,
      },
    });
    mediaStreamRef.current = stream;

    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate: 16000,
    });
    audioContextRef.current = audioCtx;

    const source = audioCtx.createMediaStreamSource(stream);
    // Buffer size 4096 = ~256ms of 16kHz audio per chunk
    const processor = audioCtx.createScriptProcessor(4096, 1, 1);
    processorNodeRef.current = processor;

    processor.onaudioprocess = (e) => {
      if (ws.readyState !== WebSocket.OPEN) return;

      const inputData = e.inputBuffer.getChannelData(0);
      // Convert float32 array to 16-bit PCM little-endian
      const pcm16 = new Int16Array(inputData.length);
      for (let i = 0; i < inputData.length; i++) {
        const s = Math.max(-1, Math.min(1, inputData[i]));
        pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }

      // Convert Int16Array buffer to base64
      let binary = '';
      const bytes = new Uint8Array(pcm16.buffer);
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64Audio = window.btoa(binary);

      ws.send(JSON.stringify({ type: 'audio', audio: base64Audio }));
    };

    source.connect(processor);
    processor.connect(audioCtx.destination);
  };

  const playAudioChunk = (base64Data: string) => {
    const ctx = playbackContextRef.current;
    if (!ctx) return;

    try {
      const binaryString = window.atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Convert 16-bit PCM to Float32
      const int16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768.0;
      }

      const audioBuffer = ctx.createBuffer(1, float32.length, 24000);
      audioBuffer.getChannelData(0).set(float32);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      const currentTime = ctx.currentTime;
      if (nextStartTimeRef.current < currentTime) {
        nextStartTimeRef.current = currentTime;
      }

      source.start(nextStartTimeRef.current);
      nextStartTimeRef.current += audioBuffer.duration;
    } catch (err) {
      console.warn('[Live Voice] Playback decode error:', err);
    }
  };

  const stopVoiceSession = async () => {
    if (processorNodeRef.current) {
      processorNodeRef.current.disconnect();
      processorNodeRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (playbackContextRef.current) {
      playbackContextRef.current.close().catch(() => {});
      playbackContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // Persist session to Firestore if user is authenticated and conversation occurred
    if (user && conversationLog.length > 0 && sessionStartTimeRef.current > 0) {
      try {
        const duration = Math.round((Date.now() - sessionStartTimeRef.current) / 1000);
        await addDoc(collection(db, 'voice_sessions'), {
          sessionId: `sess_${Date.now()}`,
          userId: user.uid,
          userEmail: user.email || 'unknown',
          model: 'gemini-3.8-live',
          startedAt: new Date(sessionStartTimeRef.current).toISOString(),
          durationSeconds: duration,
          transcriptSummary: conversationLog.map((l) => `${l.speaker.toUpperCase()}: ${l.text}`).join('\n'),
        });
      } catch (err) {
        console.warn('Could not record voice session in Firestore:', err);
      }
    }

    setStatus('idle');
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Real-time Voice Conversation with gemini-3.8-live"
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-neutral-950/85 backdrop-blur-xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-neutral-950/95 border-2 border-cyan-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(6,182,212,0.35)] flex flex-col justify-between overflow-hidden max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Holographic Header Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase font-bold flex items-center gap-2">
                <span>GEMINI-3.8-LIVE · REAL-TIME VOICE</span>
                <span className={`w-2 h-2 rounded-full ${status === 'listening' || status === 'speaking' ? 'bg-cyan-400 animate-ping' : 'bg-neutral-600'}`} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                Talk with J.A.R.V.I.S.
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close voice modal"
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-xl border border-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth / Cloud Sync Bar */}
        <div className="flex items-center justify-between gap-2 p-3 mb-6 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs">
          {user ? (
            <div className="flex items-center gap-2 text-emerald-400 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">Connected: {user.displayName || user.email} · Firestore sync active</span>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full gap-2">
              <span className="text-neutral-400 text-[11px]">Sign in with Google to sync your voice conversation logs to Firestore</span>
              <button
                type="button"
                onClick={signInWithGoogle}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shrink-0"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Google Sign-In</span>
              </button>
            </div>
          )}
        </div>

        {/* Holographic Arc Voice Visualizer */}
        <div className="p-6 rounded-3xl bg-cyan-950/20 border border-cyan-500/30 flex flex-col items-center justify-center text-center mb-6 relative">
          <div className="w-24 h-24 rounded-full border-2 border-cyan-400/40 flex items-center justify-center mb-4 relative shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            {status === 'speaking' ? (
              <Volume2 className="w-10 h-10 text-cyan-400 animate-bounce" />
            ) : status === 'listening' ? (
              <Mic className="w-10 h-10 text-cyan-400 animate-pulse" />
            ) : (
              <MicOff className="w-10 h-10 text-neutral-500" />
            )}

            {/* Pulsing ring on active */}
            {(status === 'listening' || status === 'speaking') && (
              <div className="absolute inset-0 rounded-full border border-cyan-400 animate-ping opacity-60" />
            )}
          </div>

          <div className="text-sm font-mono font-bold text-cyan-300 uppercase tracking-widest mb-1">
            {status === 'idle' && 'VOICE ENGINE READY'}
            {status === 'connecting' && 'CONNECTING TO GEMINI-3.8-LIVE...'}
            {status === 'listening' && 'LISTENING · SPEAK FREELY'}
            {status === 'speaking' && 'J.A.R.V.I.S. TRANSMITTING AUDIO...'}
            {status === 'error' && 'CONNECTION ERROR'}
          </div>

          <p className="text-xs text-neutral-400 max-w-sm">
            {status === 'idle' && 'Tap "Start Live Voice" below to open a bidirectional low-latency audio stream with Gemini 3.8 Live.'}
            {status === 'listening' && 'Ask J.A.R.V.I.S. about Arjun’s projects, digital twins, internships, or contact info.'}
            {status === 'speaking' && 'Streaming 24kHz raw PCM voice response in real time.'}
          </p>

          {/* Equalizer Frequency Bars */}
          <div className="flex items-center justify-center gap-1.5 h-10 mt-4 w-full max-w-xs">
            {[45, 80, 100, 60, 90, 40, 75, 95, 50, 85, 30, 70, 95, 60, 40, 80, 55, 90, 70, 45].map(
              (h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    status === 'speaking' || status === 'listening'
                      ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                      : 'bg-neutral-800'
                  }`}
                  style={{
                    height:
                      status === 'speaking' || status === 'listening'
                        ? `${Math.max(15, h * (i % 2 === 0 ? 0.9 : 0.6))}%`
                        : '15%',
                  }}
                />
              )
            )}
          </div>
        </div>

        {/* Live Conversation Transcript Feed */}
        <div className="space-y-3 mb-6">
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Real-Time Dialogue Stream</span>
            </span>
            {conversationLog.length > 0 && (
              <span className="text-[11px] text-cyan-400">{conversationLog.length} turns recorded</span>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 max-h-48 overflow-y-auto space-y-3 font-sans text-xs sm:text-sm">
            {conversationLog.length === 0 && !userTranscript && !modelTranscript && (
              <p className="text-neutral-500 italic text-center py-4">
                No voice turns yet. Press Start Live Voice and speak into your microphone.
              </p>
            )}

            {conversationLog.map((log, index) => (
              <div
                key={index}
                className={`p-3 rounded-xl ${
                  log.speaker === 'user'
                    ? 'bg-neutral-950/80 border border-neutral-800 text-neutral-200'
                    : 'bg-cyan-950/30 border border-cyan-500/30 text-cyan-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1 font-mono text-[10px] text-neutral-400">
                  <span className="font-bold text-cyan-400">
                    {log.speaker === 'user' ? 'YOU (VOICE INPUT)' : 'J.A.R.V.I.S. (GEMINI-3.8-LIVE)'}
                  </span>
                  <span>{log.time}</span>
                </div>
                <p className="leading-relaxed">{log.text}</p>
              </div>
            ))}

            {/* Currently streaming turn */}
            {(userTranscript || modelTranscript) && (
              <div className="p-3 rounded-xl bg-cyan-950/50 border border-cyan-400/50 text-cyan-100 animate-pulse">
                <div className="font-mono text-[10px] text-cyan-300 font-bold mb-1">
                  STREAMING TRANSCRIPT:
                </div>
                {userTranscript && <p className="mb-1">You: {userTranscript}</p>}
                {modelTranscript && <p>J.A.R.V.I.S.: {modelTranscript}</p>}
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono">
              Error: {errorMessage}
            </div>
          )}
        </div>

        {/* Action Controls Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-800/80">
          <div className="flex items-center gap-2">
            {status === 'idle' || status === 'error' ? (
              <button
                type="button"
                onClick={startVoiceSession}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-cyan-400 hover:bg-cyan-300 text-neutral-950 shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all active:scale-95"
              >
                <Mic className="w-4 h-4 text-neutral-950" />
                <span>Start Live Voice</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopVoiceSession}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-500 text-white shadow-md transition-all active:scale-95"
              >
                <MicOff className="w-4 h-4" />
                <span>End Conversation</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setConversationLog([]);
                setUserTranscript('');
                setModelTranscript('');
              }}
              className="p-2.5 text-neutral-400 hover:text-white bg-neutral-900 rounded-xl border border-neutral-800 transition-colors"
              title="Clear transcript"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
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
