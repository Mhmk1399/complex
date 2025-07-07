export interface AnimationConfig {
  type: string;
  duration: string;
  timing: string;
  delay?: string;
  iterationCount?: string;
}

export class AnimationService {
  private animationTypes = ['pulse', 'ping', 'bgOpacity', 'scaleup', 'scaledown'];
  private timingFunctions = ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'];

  getAnimationTypes(): string[] {
    return this.animationTypes;
  }

  getTimingFunctions(): string[] {
    return this.timingFunctions;
  }

  getDefaultConfig(type: string): AnimationConfig {
    const defaults: Record<string, AnimationConfig> = {
      pulse: {
        type: 'pulse',
        duration: '1s',
        timing: 'ease-in-out',
        delay: '0s',
        iterationCount: '1'
      },
      ping: {
        type: 'ping',
        duration: '1s',
        timing: 'cubic-bezier(0, 0, 0.2, 1)',
        delay: '0s',
        iterationCount: '1'
      },
      bgOpacity: {
        type: 'bgOpacity',
        duration: '0.5s',
        timing: 'ease-in-out',
        delay: '0s',
        iterationCount: '1'
      },
      scaleup: {
        type: 'scaleup',
        duration: '0.3s',
        timing: 'ease-out',
        delay: '0s',
        iterationCount: '1'
      },
      scaledown: {
        type: 'scaledown',
        duration: '0.3s',
        timing: 'ease-out',
        delay: '0s',
        iterationCount: '1'
      }
    };

    return defaults[type] || defaults.pulse;
  }

  validateConfig(config: AnimationConfig): boolean {
    // Validate animation type
    if (!this.animationTypes.includes(config.type)) {
      return false;
    }

    // Validate duration format
    if (!this.validateDuration(config.duration)) {
      return false;
    }

    // Validate timing function
    if (!this.timingFunctions.includes(config.timing)) {
      return false;
    }

    // Validate delay if provided
    if (config.delay && !this.validateDuration(config.delay)) {
      return false;
    }

    // Validate iteration count
    if (config.iterationCount && !this.validateIterationCount(config.iterationCount)) {
      return false;
    }

    return true;
  }

  private validateDuration(duration: string): boolean {
    const durationRegex = /^\d+(\.\d+)?s$/;
    return durationRegex.test(duration);
  }

  private validateIterationCount(count: string): boolean {
    return count === 'infinite' || (!isNaN(Number(count)) && Number(count) > 0);
  }

  generateCSS(config: AnimationConfig): string {
    return `animation: ${config.type} ${config.duration} ${config.timing} ${config.delay || '0s'} ${config.iterationCount || '1'};`;
  }

  getAnimationPreview(type: string): string {
    const previews: Record<string, string> = {
      pulse: '🫀 پالس - تغییر اندازه و شفافیت',
      ping: '📡 پینگ - موج انتشار',
      bgOpacity: '🌫️ شفافیت پس‌زمینه',
      scaleup: '🔍 بزرگ‌نمایی',
      scaledown: '🔎 کوچک‌نمایی'
    };

    return previews[type] || type;
  }
}

export const animationService = new AnimationService();
