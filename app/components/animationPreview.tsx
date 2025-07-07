import React from 'react';
import { AnimationEffect } from '@/services/effectService';
import { animationService } from '@/services/animationService';

interface AnimationPreviewProps {
  effects: AnimationEffect[];
}

export const AnimationPreview: React.FC<AnimationPreviewProps> = ({ effects }) => {
  if (!effects || effects.length === 0) {
    return null;
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <h6 className="font-medium text-gray-700 mb-3">پیش‌نمایش انیمیشن</h6>
      
      <div className="space-y-2">
        {effects.map((effect, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {effect.type === 'hover' ? '🖱️ هاور' : '👆 کلیک'}
            </span>
            <span className="text-blue-600">
              {animationService.getAnimationPreview(effect.animation.type)}
            </span>
            <span className="text-gray-500">
              {effect.animation.duration}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-white rounded border-2 border-dashed border-gray-300">
        <div className="text-center text-gray-500 text-sm mb-2">
          نمونه تست (روی مربع زیر {effects[0]?.type === 'hover' ? 'هاور کنید' : 'کلیک کنید'})
        </div>
        <div 
          className="w-16 h-16 bg-blue-500 rounded mx-auto cursor-pointer transition-all"
          style={{
            animation: effects[0]?.type === 'hover' ? 'none' : undefined
          }}
          onMouseEnter={(e) => {
            if (effects[0]?.type === 'hover') {
              const { animation } = effects[0];
              e.currentTarget.style.animation = `${animation.type} ${animation.duration} ${animation.timing} ${animation.delay || '0s'} ${animation.iterationCount || '1'}`;
            }
          }}
          onMouseLeave={(e) => {
            if (effects[0]?.type === 'hover') {
              e.currentTarget.style.animation = 'none';
            }
          }}
          onClick={(e) => {
            if (effects[0]?.type === 'click') {
              const { animation } = effects[0];
              e.currentTarget.style.animation = 'none';
              setTimeout(() => {
                e.currentTarget.style.animation = `${animation.type} ${animation.duration} ${animation.timing} ${animation.delay || '0s'} ${animation.iterationCount || '1'}`;
              }, 10);
            }
          }}
        />
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 1;
          }
          50% { 
            transform: scale(1.05);
            opacity: 0.8;
          }
        }
        
        @keyframes ping {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%, 100% {
            transform: scale(1.1);
            opacity: 0;
          }
        }
        
        @keyframes bgOpacity {
          0%, 100% { 
            opacity: 1;
          }
          50% { 
            opacity: 0.7;
          }
        }
        
        @keyframes scaleup {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.1);
          }
        }
        
        @keyframes scaledown {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(0.95);
          }
        }
      `}</style>
    </div>
  );
};
