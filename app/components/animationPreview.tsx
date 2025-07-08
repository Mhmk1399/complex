import React, { useRef } from 'react';
import { AnimationEffect } from '@/lib/types';

interface AnimationPreviewProps {
  effects: AnimationEffect[];
}

export const AnimationPreview: React.FC<AnimationPreviewProps> = ({ effects }) => {
  const previewRef = useRef<HTMLDivElement>(null);

  if (!effects || effects.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        هیچ انیمیشنی تعریف نشده است
      </div>
    );
  }

  const getAnimationPreview = (type: string): string => {
    const previews: Record<string, string> = {
      pulse: '🫀 پالس - تغییر اندازه و شفافیت',
      ping: '📡 پینگ - موج انتشار',
      bgOpacity: '🌫️ شفافیت پس‌زمینه',
      scaleup: '🔍 بزرگ‌نمایی',
      scaledown: '🔎 کوچک‌نمایی',
      glow: '✨ درخشش',
      brightness: '💡 روشنایی',
      blur: '🌫️ تاری',
      saturate: '🎨 اشباع رنگ',
      contrast: '🔳 کنتراست',
      opacity: '👻 شفافیت',
      shadow: '🌑 سایه'
    };
    return previews[type] || type;
  };

  const handleMouseEnter = () => {
    if (!previewRef.current || !effects[0]) return;
    
    if (effects[0].type === 'hover') {
      const { animation } = effects[0];
      previewRef.current.style.animation = `preview-${animation.type} ${animation.duration} ${animation.timing} ${animation.delay || '0s'} ${animation.iterationCount || '1'}`;
    }
  };

  const handleMouseLeave = () => {
    if (!previewRef.current) return;
    
    if (effects[0]?.type === 'hover') {
      previewRef.current.style.animation = 'none';
    }
  };

  const handleClick = () => {
    if (!previewRef.current || !effects[0]) return;
    
    if (effects[0].type === 'click') {
      const { animation } = effects[0];
      previewRef.current.style.animation = 'none';
      // Force reflow
      previewRef.current.offsetHeight;
      setTimeout(() => {
        if (previewRef.current) {
          previewRef.current.style.animation = `preview-${animation.type} ${animation.duration} ${animation.timing} ${animation.delay || '0s'} ${animation.iterationCount || '1'}`;
        }
      }, 10);
    }
  };

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
              {getAnimationPreview(effect.animation.type)}
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
          ref={previewRef}
          className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded mx-auto cursor-pointer transition-all"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        />
      </div>

      <style jsx>{`
        @keyframes preview-pulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 1;
          }
          50% { 
            transform: scale(1.05);
            opacity: 0.8;
          }
        }
        
        @keyframes preview-ping {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%, 100% {
            transform: scale(1.1);
            opacity: 0;
          }
        }
        
        @keyframes preview-bgOpacity {
          0%, 100% { 
            opacity: 1;
          }
          50% { 
            opacity: 0.7;
          }
        }
        
        @keyframes preview-scaleup {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.1);
          }
        }
        
        @keyframes preview-scaledown {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(0.95);
          }
        }

        @keyframes preview-glow {
          0%, 100% { 
            filter: brightness(1) drop-shadow(0 0 0px rgba(255, 255, 255, 0));
          }
          50% { 
            filter: brightness(1.2) drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
          }
        }

        @keyframes preview-brightness {
          0%, 100% { 
            filter: brightness(1);
          }
          50% { 
            filter: brightness(1.4);
          }
        }

        @keyframes preview-blur {
          0%, 100% { 
            filter: blur(0px);
          }
          50% { 
            filter: blur(2px);
          }
        }

        @keyframes preview-saturate {
          0%, 100% { 
            filter: saturate(1);
          }
          50% { 
            filter: saturate(1.8);
          }
        }

        @keyframes preview-contrast {
          0%, 100% { 
            filter: contrast(1);
          }
          50% { 
            filter: contrast(1.5);
          }
        }

        @keyframes preview-opacity {
          0% { 
            opacity: 1;
          }
          50% { 
            opacity: 0.4;
          }
          100% { 
            opacity: 1;
          }
        }

        @keyframes preview-shadow {
          0%, 100% { 
            filter: drop-shadow(0 0 0px rgba(0, 0, 0, 0));
          }
          50% { 
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
          }
        }
      `}</style>
    </div>
  );
};
