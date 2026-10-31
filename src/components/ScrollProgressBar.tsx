import React, { useEffect, useState } from 'react';
import { calculateScrollProgress } from '../utils/portfolioLogic';

interface ScrollProgressBarProps {
  className?: string;
}

export function ScrollProgressBar({ className = '' }: ScrollProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const docElement = document.documentElement;
      const body = document.body;
      const scrollTop = window.scrollY || docElement.scrollTop || body.scrollTop || 0;
      const scrollHeight = Math.max(
        docElement.scrollHeight,
        body.scrollHeight,
        docElement.offsetHeight,
        body.offsetHeight
      );
      const clientHeight = window.innerHeight || docElement.clientHeight;

      const currentProgress = calculateScrollProgress(scrollTop, scrollHeight, clientHeight);
      setProgress(currentProgress);
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`fixed top-0 left-0 right-0 z-50 h-[3px] bg-neutral-900/40 pointer-events-none backdrop-blur-[1px] ${className}`}
    >
      {/* Animated gradient progress fill */}
      <div
        className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 shadow-[0_0_12px_rgba(6,182,212,0.8)] transition-all duration-150 ease-out relative"
        style={{ width: `${progress}%` }}
      >
        {/* Glowing leading edge pulse dot */}
        {progress > 0 && progress < 100 && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_#38bdf8] animate-pulse" />
        )}
      </div>
    </div>
  );
}
