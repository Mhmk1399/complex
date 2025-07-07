import { AnimationConfig, animationService } from './animationService';

export interface AnimationEffect {
  type: 'hover' | 'click';
  animation: AnimationConfig;
}

export class EffectService {
  private effectTypes = ['hover', 'click'];

  getEffectTypes(): string[] {
    return this.effectTypes;
  }

  getAnimationTypes(): string[] {
    return animationService.getAnimationTypes();
  }

  getDefaultEffectConfig(type: 'hover' | 'click', animationType: string): AnimationEffect {
    return {
      type,
      animation: animationService.getDefaultConfig(animationType)
    };
  }

  validateEffect(effect: AnimationEffect): boolean {
    if (!this.effectTypes.includes(effect.type)) {
      return false;
    }

    return animationService.validateConfig(effect.animation);
  }

  generateEffectCSS(effect: AnimationEffect): string {
    const selector = effect.type === 'hover' ? ':hover' : ':active';
    const animationCSS = animationService.generateCSS(effect.animation);
    
    return `
      ${selector} {
        ${animationCSS}
      }
    `;
  }

  getEffectPreview(effect: AnimationEffect): string {
    const typePreview = effect.type === 'hover' ? '🖱️ هاور' : '👆 کلیک';
    const animationPreview = animationService.getAnimationPreview(effect.animation.type);
    
    return `${typePreview} - ${animationPreview}`;
  }
}

export const effectService = new EffectService();
