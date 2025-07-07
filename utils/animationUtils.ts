export class AnimationUtils {
  static getAnimationPreview(animationType: string): string {
    const previews: Record<string, string> = {
      pulse: '🫀 پالس',
      ping: '📡 پینگ',
      bgOpacity: '🌫️ شفافیت',
      scaleup: '🔍 بزرگ‌نمایی',
      scaledown: '🔎 کوچک‌نمایی'
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

  static generateAnimationCSS(effects: any[]): string {
    return effects.map(effect => {
      const { type, animation } = effect;
      const selector = type === 'hover' ? ':hover' : ':active';
      
      return `
        ${selector} {
          animation: ${animation.type} ${animation.duration} ${animation.timing} ${animation.delay || '0s'} ${animation.iterationCount || '1'};
        }
      `;
    }).join('\n');
  }
}
