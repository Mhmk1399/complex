import { useRef, useCallback, useState, useEffect } from 'react';
import { AnimationEffect, AnimationState, UseAnimationReturn } from '@/lib/types';
import { animationService } from '@/services/animationService';

export const useAnimation = (
  effect?: AnimationEffect,
  options?: {
    respectReducedMotion?: boolean;
    autoCleanup?: boolean;
    onStart?: () => void;
    onEnd?: () => void;
  }
): UseAnimationReturn => {
  const elementRef = useRef<HTMLElement>(null);
  const [state, setState] = useState<AnimationState>({
    isPlaying: false,
    currentEffect: effect,
    progress: 0
  });
  const [animationId, setAnimationId] = useState<string>('');

  // Check for reduced motion preference
  const respectReducedMotion = options?.respectReducedMotion ?? true;
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  // Generate unique animation ID
  useEffect(() => {
    if (effect) {
      const id = `animation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setAnimationId(id);
    }
  }, [effect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationId && options?.autoCleanup !== false) {
        animationService.removeCSS(animationId);
      }
    };
  }, [animationId, options?.autoCleanup]);

  const trigger = useCallback((triggerType?: 'hover' | 'click') => {
    if (!effect || !elementRef.current || state.isPlaying) return;
    
    // Skip animation if user prefers reduced motion
    if (respectReducedMotion && prefersReducedMotion) {
      return;
    }

    // Check if trigger type matches
    if (triggerType && effect.type !== triggerType) return;

    const element = elementRef.current;
    const css = animationService.generateCSS(effect.animation, animationId);
    
    // Inject CSS
    animationService.injectCSS(css, animationId);
    
    // Update state
    setState((prev: AnimationState): AnimationState => ({
      ...prev,
      isPlaying: true,
      currentEffect: effect,
      startTime: Date.now()
    }));

    // Trigger start callback
    options?.onStart?.();

    // Apply animation class
    const animationClass = `animation-${animationId}`;
    element.classList.add(animationClass);

    // Calculate duration
    const duration = parseFloat(effect.animation.duration.replace('s', '')) * 1000;
    const delay = parseFloat((effect.animation.delay || '0s').replace('s', '')) * 1000;

    // Remove animation after completion
    setTimeout(() => {
      element.classList.remove(animationClass);
    setState((prev: AnimationState): AnimationState => ({
      ...prev,
      isPlaying: false,
      progress: 100
    }));
      
      // Trigger end callback
      options?.onEnd?.();
    }, duration + delay);

  }, [effect, animationId, state.isPlaying, respectReducedMotion, prefersReducedMotion, options]);

  const stop = useCallback(() => {
    if (!elementRef.current || !state.isPlaying) return;

    const element = elementRef.current;
    const animationClass = `animation-${animationId}`;
    
    element.classList.remove(animationClass);
    setState((prev: AnimationState) => ({
      ...prev,
      isPlaying: false
    }));
  }, [animationId, state.isPlaying]);

  const reset = useCallback(() => {
    setState({
      isPlaying: false,
      currentEffect: effect,
      progress: 0
    });
  }, [effect]);

  return {
    isAnimating: state.isPlaying,
    trigger,
    stop,
    reset,
    state
  };
};

// Hook for managing multiple animations
export const useAnimationSequence = (
  effects: AnimationEffect[],
  options?: {
    loop?: boolean;
    autoStart?: boolean;
    onComplete?: () => void;
  }
) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const currentEffect = effects[currentIndex];

  const { trigger, stop, state } = useAnimation(currentEffect, {
    onEnd: () => {
      const nextIndex = currentIndex + 1;
      
      if (nextIndex < effects.length) {
        setCurrentIndex(nextIndex);
      } else if (options?.loop) {
        setCurrentIndex(0);
      } else {
        setIsPlaying(false);
        options?.onComplete?.();
      }
    }
  });

  const start = useCallback(() => {
    setIsPlaying(true);
    setCurrentIndex(0);
    trigger();
  }, [trigger]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    stop();
  }, [stop]);

  const restart = useCallback(() => {
    setCurrentIndex(0);
    setIsPlaying(true);
    trigger();
  }, [trigger]);

  // Auto-start if enabled
  useEffect(() => {
    if (options?.autoStart && effects.length > 0) {
      start();
    }
  }, [options?.autoStart, effects.length, start]);

  return {
    start,
    pause,
    restart,
    isPlaying,
    currentIndex,
    currentEffect,
    progress: state.progress || 0
  };
};