import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { getRevealTransitionClasses, RevealDirection } from '../utils/portfolioLogic';

export interface RevealSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  direction?: RevealDirection;
  delayMs?: number;
  threshold?: number;
}

export function RevealSection({
  children,
  className = '',
  id,
  direction = 'up',
  delayMs = 0,
  threshold = 0.12,
}: RevealSectionProps) {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold,
    rootMargin: '0px 0px -50px 0px',
    triggerOnce: true,
  });

  const transformClasses = getRevealTransitionClasses(isVisible, direction);

  return (
    <div
      id={id}
      ref={ref}
      style={{
        transitionDuration: '800ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${delayMs}ms`,
      }}
      className={`transition-all duration-800 will-change-[transform,opacity] ${transformClasses} ${className}`}
    >
      {children}
    </div>
  );
}
