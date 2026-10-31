import React from 'react';
import { Home, Layers, Box, Zap, Download, Send, Mic, Bot } from 'lucide-react';

interface MobileBottomNavProps {
  onScrollTo: (elementId: string) => void;
  onOpenJarvis: () => void;
  onOpenInstall: () => void;
  onOpenLiveVoice?: () => void;
  onOpenChatbot?: () => void;
}

export function MobileBottomNav({
  onScrollTo,
  onOpenJarvis,
  onOpenInstall,
  onOpenLiveVoice,
  onOpenChatbot,
}: MobileBottomNavProps) {
  return (
    <nav
      aria-label="Mobile Navigation Dock"
      className="md:hidden fixed bottom-3 inset-x-3 z-40 max-w-md mx-auto"
    >
      <div className="flex items-center justify-around px-2 py-2 rounded-2xl bg-neutral-950/85 backdrop-blur-xl border border-cyan-500/35 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(6,182,212,0.15)] text-neutral-400">
        <button
          type="button"
          onClick={() => onScrollTo('home')}
          className="flex flex-col items-center justify-center w-14 h-12 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900/60 active:scale-95 transition-all"
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-mono tracking-tight">Home</span>
        </button>

        <button
          type="button"
          onClick={() => onScrollTo('projects')}
          className="flex flex-col items-center justify-center w-14 h-12 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900/60 active:scale-95 transition-all"
        >
          <Layers className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-mono tracking-tight">Projects</span>
        </button>

        {/* Center Glowing Live Voice Action */}
        {onOpenLiveVoice && (
          <button
            type="button"
            onClick={onOpenLiveVoice}
            className="flex flex-col items-center justify-center w-14 h-12 rounded-xl -mt-3 bg-gradient-to-b from-cyan-400 to-sky-500 text-neutral-950 font-bold shadow-[0_0_20px_rgba(6,182,212,0.7)] active:scale-90 transition-all border border-cyan-200"
            title="Live Voice Conversation"
          >
            <Mic className="w-4 h-4 fill-neutral-950 animate-pulse" />
            <span className="text-[9px] font-mono font-bold tracking-tight uppercase">VOICE</span>
          </button>
        )}

        {onOpenChatbot && (
          <button
            type="button"
            onClick={onOpenChatbot}
            className="flex flex-col items-center justify-center w-14 h-12 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900/60 active:scale-95 transition-all"
            title="Chat with J.A.R.V.I.S."
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] font-mono tracking-tight">Chat</span>
          </button>
        )}

        <button
          type="button"
          onClick={onOpenJarvis}
          className="flex flex-col items-center justify-center w-14 h-12 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900/60 active:scale-95 transition-all"
          title="Ask JARVIS Bio"
        >
          <Zap className="w-4 h-4 text-cyan-400" />
          <span className="text-[10px] font-mono tracking-tight">Bio</span>
        </button>

        <button
          type="button"
          onClick={() => onScrollTo('spatial-lab')}
          className="flex flex-col items-center justify-center w-14 h-12 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900/60 active:scale-95 transition-all"
        >
          <Box className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-mono tracking-tight">3D Lab</span>
        </button>

        <button
          type="button"
          onClick={onOpenInstall}
          className="flex flex-col items-center justify-center w-14 h-12 rounded-xl text-cyan-300 hover:text-cyan-200 hover:bg-cyan-950/40 active:scale-95 transition-all"
          title="Install Mobile App"
        >
          <Download className="w-4 h-4 mb-0.5 text-cyan-400" />
          <span className="text-[10px] font-mono tracking-tight">Install</span>
        </button>
      </div>
    </nav>
  );
}
