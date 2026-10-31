import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, Sparkles, Terminal, RefreshCw, Loader2, ArrowDown, Volume2, VolumeX } from 'lucide-react';
import {
  ChatMessage,
  createChatMessage,
  JARVIS_CHAT_STARTERS,
  getSoundProfile,
  SciFiSoundType,
} from '../utils/portfolioLogic';

interface JarvisChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLiveVoice?: () => void;
}

export function JarvisChatModal({ isOpen, onClose, onOpenLiveVoice }: JarvisChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init_jarvis',
      role: 'assistant',
      content:
        'Greetings. I am J.A.R.V.I.S., an intelligent assistant configured for Arjun A\'s engineering portfolio. How may I assist you with Arjun\'s AR/VR projects, 3D digital twins, autonomous systems, or background?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play subtle sci-fi audio feedback for UI actions and JARVIS replies
  const playSciFiSound = (type: SciFiSoundType) => {
    if (!isSoundEnabled) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const profile = getSoundProfile(type);
      profile.frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = profile.waveform;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const startTime = ctx.currentTime + idx * 0.06;
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(profile.initialGain, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + profile.duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + profile.duration);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  };

  useEffect(() => {
    if (isOpen) {
      playSciFiSound('low_hum');
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 150);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    // Play subtle transmission blip
    playSciFiSound('send_blip');

    const userMessage = createChatMessage('user', text);
    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setInput('');
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned error ${res.status}`);
      }

      const data = await res.json();
      const replyText = data.reply || 'I am processing Arjun\'s telemetry. Please try again.';
      const assistantMessage = createChatMessage('assistant', replyText);
      setMessages((prev) => [...prev, assistantMessage]);
      // Play harmonic sci-fi chime upon receiving J.A.R.V.I.S. response
      playSciFiSound('receive_chime');
    } catch (err: any) {
      console.error('JARVIS Chat error:', err);
      playSciFiSound('system_alert');
      setError('Connection interrupted. Please try again or switch to Live Voice.');
      const fallbackMsg = createChatMessage(
        'assistant',
        'Apologies, my link to the central neural network was momentarily interrupted. Please repeat your query, or connect via Live Voice.'
      );
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `init_${Date.now()}`,
        role: 'assistant',
        content:
          'Memory matrix cleared. I am J.A.R.V.I.S., at your service. What would you like to explore regarding Arjun A\'s engineering work?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setError(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="jarvis-chat-title"
    >
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Chat Deck Window */}
      <div className="relative w-full max-w-2xl h-[85vh] max-h-[720px] flex flex-col bg-neutral-950 border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden text-neutral-100 z-10">
        {/* Top Header Deck */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-neutral-900/90 border-b border-cyan-500/30 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.4)]">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="jarvis-chat-title" className="text-sm font-bold tracking-wider font-mono text-white flex items-center gap-1.5">
                  <span>J.A.R.V.I.S.</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                    CHATBOT · gemini-3.8-flash
                  </span>
                </h2>
              </div>
              <p className="text-[11px] font-mono text-cyan-400/80">
                Arjun A Portfolio Assistant · Systems Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenLiveVoice && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLiveVoice();
                }}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 transition-colors"
                title="Switch to Real-Time Live Voice with J.A.R.V.I.S."
              >
                <span>Live Voice</span>
              </button>
            )}

            {/* Sci-Fi Audio FX Toggle */}
            <button
              type="button"
              onClick={() => {
                const nextState = !isSoundEnabled;
                setIsSoundEnabled(nextState);
                if (nextState) {
                  playSciFiSound('send_blip');
                }
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                isSoundEnabled
                  ? 'text-cyan-400 hover:text-cyan-200 hover:bg-cyan-950/40'
                  : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800'
              }`}
              title={isSoundEnabled ? 'Mute Sci-Fi Audio Feedback' : 'Enable Sci-Fi Audio Feedback'}
              aria-label={isSoundEnabled ? 'Mute audio' : 'Enable audio'}
            >
              {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={handleResetChat}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
              title="Reset conversation history"
              aria-label="Reset conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
              title="Close J.A.R.V.I.S. Chat"
              aria-label="Close J.A.R.V.I.S. Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* System Status HUD Bar */}
        <div className="px-5 py-1.5 bg-neutral-900/50 border-b border-neutral-800/80 flex items-center justify-between text-[11px] font-mono text-neutral-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>NEURAL CHAT MATRIX</span>
          </div>
          <div className="flex items-center gap-3">
            <span>SUBJECT: ARJUN A</span>
            <span className="hidden sm:inline text-neutral-600">|</span>
            <span className="hidden sm:inline text-emerald-400">ENCRYPTION: QUANTUM</span>
          </div>
        </div>

        {/* Scrollable Conversation Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 font-sans">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center mt-0.5">
                    <Bot className="w-4 h-4 text-cyan-400" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md'
                      : 'bg-neutral-900/90 border border-neutral-800/90 text-neutral-200 shadow-[0_4px_15px_rgba(0,0,0,0.3)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 text-[10px] font-mono mb-1.5 opacity-60">
                    <span className="font-bold">{isUser ? 'YOU' : 'J.A.R.V.I.S.'}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>

                {isUser && (
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-500/40 flex items-center justify-center mt-0.5">
                    <User className="w-4 h-4 text-indigo-300" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Assistant Typing / Reasoning Indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center">
                <Bot className="w-4 h-4 text-cyan-400 animate-spin" />
              </div>
              <div className="bg-neutral-900/90 border border-neutral-800/90 rounded-2xl px-4 py-3 text-sm text-cyan-300 font-mono flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>J.A.R.V.I.S. is synthesizing response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Starters */}
        {messages.length <= 2 && (
          <div className="px-5 py-2 border-t border-neutral-900 bg-neutral-950/80 shrink-0">
            <div className="text-[11px] font-mono text-neutral-400 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Prompt suggestions for J.A.R.V.I.S.:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {JARVIS_CHAT_STARTERS.map((starter, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSend(starter)}
                  disabled={isLoading}
                  className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-cyan-500/40 text-neutral-300 hover:text-cyan-200 transition-colors text-left disabled:opacity-50"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3.5 sm:p-4 bg-neutral-900/90 border-t border-neutral-800/90 backdrop-blur-md shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask J.A.R.V.I.S. about Arjun's projects, digital twins, stack..."
                disabled={isLoading}
                className="w-full pl-3.5 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700/80 focus:border-cyan-400 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 font-sans transition-all disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:bg-neutral-800 text-neutral-950 disabled:text-neutral-500 font-semibold text-sm transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:shadow-none flex items-center gap-1.5 shrink-0 cursor-pointer disabled:cursor-not-allowed"
              title="Send message to J.A.R.V.I.S."
              aria-label="Send message to J.A.R.V.I.S."
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>

          {error && (
            <p className="text-xs text-rose-400 font-mono mt-2">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
