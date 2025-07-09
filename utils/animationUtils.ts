import { AnimationEffect, AnimationConfig } from '../lib/types';
export class AnimationUtils {
  static getAnimationPreview(animationType: string): string {
    const previews: Record<string, string> = {
      pulse: '🫀 پالس',
      glow: '✨ درخشش',
      brightness: '💡 روشنایی',
      blur: '🌫️ تاری',
      saturate: '🎨 اشباع',
      contrast: '🔳 کنتراست',
      opacity: '👻 شفافیت',
      shadow: '🌑 سایه'
    };

    return previews[animationType] || animationType;
  }

  static validateDuration(duration: string): boolean {
    const durationRegex = /^\d+(\.\d+)?(s|ms)$/;
    return durationRegex.test(duration);
  }

  static validateIterationCount(count: string): boolean {
    return count === 'infinite' || !isNaN(Number(count));
  }

static generateAnimationCSS(effects: AnimationEffect[]): string {
      return effects.map(effect => {
      const { type, animation } = effect;
      const selector = type === 'hover' ? ':hover' : ':active';
      
      // Generate keyframes based on animation type
      const keyframes = this.generateKeyframes(animation.type);
      
      return `
        ${selector} {
          animation: ${animation.type} ${animation.duration} ${animation.timing} ${animation.delay || '0s'} ${animation.iterationCount || '1'};
        }
        
        @keyframes ${animation.type} {
          ${keyframes}
        }
      `;
    }).join('\n');
  }

  static generateKeyframes(animationType: string): string {
    const keyframes: Record<string, string> = {
      pulse: `
        0%, 100% { 
          opacity: 1;
          filter: brightness(1);
        }
        50% { 
          opacity: 0.7;
          filter: brightness(1.3);
        }
      `,
      glow: `
        0%, 100% { 
          filter: brightness(1) drop-shadow(0 0 0px rgba(255, 255, 255, 0));
        }
        50% { 
          filter: brightness(1.2) drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
        }
      `,
      brightness: `
        0%, 100% { 
          filter: brightness(1);
        }
        50% { 
          filter: brightness(1.4);
        }
      `,
      blur: `
        0%, 100% { 
          filter: blur(0px);
        }
        50% { 
          filter: blur(2px);
        }
      `,
      saturate: `
        0%, 100% { 
          filter: saturate(1);
        }
        50% { 
          filter: saturate(1.8);
        }
      `,
      contrast: `
        0%, 100% { 
          filter: contrast(1);
        }
        50% { 
          filter: contrast(1.5);
        }
      `,
      opacity: `
        0% { 
          opacity: 1;
        }
        50% { 
          opacity: 0.4;
        }
        100% { 
          opacity: 1;
        }
      `,
      shadow: `
        0%, 100% { 
          filter: drop-shadow(0 0 0px rgba(0, 0, 0, 0));
        }
        50% { 
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        }
      `
    };

    return keyframes[animationType] || keyframes.pulse;
  }

static createAnimationCSS(config: {
  type: string;
  duration: string;
  timing: string;
  delay?: string;
  iterationCount?: string;
  intensity?: 'light' | 'normal' | 'strong';
}): string {
    const intensityMultiplier = {
      light: 0.5,
      normal: 1,
      strong: 1.5
    }[config.intensity || 'normal'];

    const keyframes = this.generateIntensityKeyframes(config.type, intensityMultiplier);
    
    return `
      @keyframes ${config.type} {
        ${keyframes}
      }
      
      .animation-${config.type} {
        animation: ${config.type} ${config.duration} ${config.timing} ${config.delay || '0s'} ${config.iterationCount || '1'};
        animation-fill-mode: both;
      }
    `;
  }

  static generateIntensityKeyframes(type: string, intensity: number): string {
    const keyframes: Record<string, (intensity: number) => string> = {
      pulse: (i) => `
        0%, 100% { 
          opacity: 1;
          filter: brightness(1);
        }
        50% { 
          opacity: ${Math.max(0.3, 1 - (0.4 * i))};
          filter: brightness(${1 + (0.3 * i)});
        }
      `,
      glow: (i) => `
        0%, 100% { 
          filter: brightness(1) drop-shadow(0 0 0px rgba(255, 255, 255, 0));
        }
        50% { 
          filter: brightness(${1 + (0.2 * i)}) drop-shadow(0 0 ${8 * i}px rgba(255, 255, 255, 0.6));
        }
      `,
      brightness: (i) => `
        0%, 100% { 
          filter: brightness(1);
        }
        50% { 
          filter: brightness(${1 + (0.4 * i)});
        }
      `,
      blur: (i) => `
        0%, 100% { 
          filter: blur(0px);
        }
        50% { 
          filter: blur(${2 * i}px);
        }
      `,
      saturate: (i) => `
        0%, 100% { 
          filter: saturate(1);
        }
        50% { 
          filter: saturate(${1 + (0.8 * i)});
        }
      `,
      contrast: (i) => `
        0%, 100% { 
          filter: contrast(1);
        }
        50% { 
          filter: contrast(${1 + (0.5 * i)});
        }
      `,
      opacity: (i) => `
        0% { 
          opacity: 1;
        }
        50% { 
          opacity: ${Math.max(0.2, 1 - (0.6 * i))};
        }
        100% { 
          opacity: 1;
        }
      `,
      shadow: (i) => `
        0%, 100% { 
          filter: drop-shadow(0 0 0px rgba(0, 0, 0, 0));
        }
        50% { 
          filter: drop-shadow(0 ${4 * i}px ${8 * i}px rgba(0, 0, 0, ${0.3 * i}));
        }
      `
    };

    return keyframes[type] ? keyframes[type](intensity) : keyframes.pulse(intensity);
  }

static optimizeAnimations(animations: AnimationEffect[]): AnimationEffect[] {    // Remove duplicate animations
    const uniqueAnimations = animations.filter((animation, index, self) => 
      index === self.findIndex(a => 
        a.type === animation.type && 
        a.animation.type === animation.animation.type
      )
    );

    // Sort by performance impact (lighter animations first)
    const performanceOrder = ['opacity', 'brightness', 'contrast', 'saturate', 'blur', 'shadow', 'glow', 'pulse'];
    
    return uniqueAnimations.sort((a, b) => {
      const aIndex = performanceOrder.indexOf(a.animation.type);
      const bIndex = performanceOrder.indexOf(b.animation.type);
      return aIndex - bIndex;
    });
  }

  static detectReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

static createResponsiveAnimation(
  config: AnimationConfig & { intensity?: 'light' | 'normal' | 'strong' }, 
  breakpoints: Record<string, Partial<AnimationConfig>>
): string {    let css = this.createAnimationCSS(config);
    
    Object.entries(breakpoints).forEach(([breakpoint, breakpointConfig]) => {
      const mediaQuery = this.getMediaQuery(breakpoint);
      const breakpointCSS = this.createAnimationCSS({
        ...config,
        ...breakpointConfig
      });
      
      css += `
        @media ${mediaQuery} {
          ${breakpointCSS}
        }
      `;
    });
    
    return css;
  }

  static getMediaQuery(breakpoint: string): string {
    const queries: Record<string, string> = {
      sm: '(max-width: 640px)',
      md: '(max-width: 768px)',
      lg: '(max-width: 1024px)',
      xl: '(max-width: 1280px)',
      '2xl': '(max-width: 1536px)'
    };
    
    return queries[breakpoint] || queries.md;
  }

static validateAnimationConfig(config: AnimationEffect): { isValid: boolean; errors: string[] } {    const errors: string[] = [];
    
    if (!config.type) {
      errors.push('Animation type is required');
    }
    
    if (!config.animation) {
      errors.push('Animation configuration is required');
    }
    
    if (config.animation && !config.animation.type) {
      errors.push('Animation type is required');
    }
    
    if (config.animation && !this.validateDuration(config.animation.duration)) {
      errors.push('Invalid duration format');
    }
    
    if (config.animation && config.animation.delay && !this.validateDuration(config.animation.delay)) {
      errors.push('Invalid delay format');
    }
    
    if (config.animation && config.animation.iterationCount && !this.validateIterationCount(config.animation.iterationCount)) {
      errors.push('Invalid iteration count');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
