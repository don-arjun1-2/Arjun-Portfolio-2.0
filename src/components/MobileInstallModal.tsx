import React from 'react';
import { X, Smartphone, Download, Share2, PlusSquare, CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface MobileInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileInstallModal({ isOpen, onClose }: MobileInstallModalProps) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Install Arjun AR/VR Mobile Application"
      className="fixed inset-0 z-[140] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-neutral-950/85 backdrop-blur-xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-neutral-950/95 border-t sm:border border-cyan-500/50 rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(6,182,212,0.35)] flex flex-col overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Swipe / Sheet Handle Indicator */}
        <div className="w-12 h-1.5 bg-neutral-700/80 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Holographic Top Accents */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-cyan-500/40 p-2 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <img src="/icon.svg" alt="App Icon" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold flex items-center gap-1.5">
                <span>MOBILE APPLICATION CONVERSION</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                Install Arjun AR/VR
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close install modal"
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-xl border border-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status & Capabilities List */}
        <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 mb-6">
          <p className="text-xs sm:text-sm text-neutral-200 mb-3 leading-relaxed">
            Convert this portfolio into a standalone mobile application on your smartphone home screen with zero app store downloads.
          </p>

          <div className="space-y-2 text-xs text-neutral-300 font-mono">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Full-screen standalone native experience</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Offline-ready caching & instant launch</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Instant J.A.R.V.I.S. voice briefings & 3D digital twins</span>
            </div>
          </div>
        </div>

        {/* Installation Instructions / Action */}
        {isInstalled ? (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm flex items-center gap-2.5 mb-6">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Application is already installed and running in mobile standalone mode!</span>
          </div>
        ) : isIOS ? (
          <div className="space-y-3 mb-6 p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800">
            <div className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5 uppercase font-mono">
              <Share2 className="w-3.5 h-3.5" />
              <span>iOS Safari Installation Steps:</span>
            </div>
            <ol className="text-xs text-neutral-300 space-y-2 list-decimal list-inside pl-1">
              <li>
                Tap the Safari <strong className="text-white">Share button</strong> (box with arrow pointing up <span className="text-cyan-400">⎋</span>) at the bottom toolbar.
              </li>
              <li>
                Scroll down the share sheet and tap <strong className="text-white">"Add to Home Screen"</strong> (<span className="text-cyan-400">⊞</span>).
              </li>
              <li>
                Tap <strong className="text-white">"Add"</strong> in the top-right corner to launch Arjun AR/VR as a mobile app.
              </li>
            </ol>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {isInstallable ? (
              <button
                type="button"
                onClick={handleInstallClick}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold tracking-wider uppercase text-neutral-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:shadow-[0_0_35px_rgba(6,182,212,0.9)] transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Install App to Home Screen</span>
              </button>
            ) : (
              <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 text-xs text-neutral-300 space-y-2">
                <p className="font-semibold text-cyan-300">To install on your mobile device:</p>
                <p>Tap your browser's menu (⋮ or Share) and select <strong className="text-white">"Install application"</strong> or <strong className="text-white">"Add to Home screen"</strong>.</p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-800/80 text-xs text-neutral-400">
          <span className="font-mono text-[11px]">VERSION: 2.1.0 · PWA COMPLIANT</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
