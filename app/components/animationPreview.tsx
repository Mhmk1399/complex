import React, { useRef, useState } from "react";
import { AnimationEffect } from "@/lib/types";
import {
  HiPlay,
  HiRefresh,
  HiSparkles,
} from "react-icons/hi";

interface AnimationPreviewProps {
  effects: AnimationEffect[];
}

export const AnimationPreview: React.FC<AnimationPreviewProps> = ({
  effects,
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!effects || effects.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <HiSparkles className="w-6 h-6 text-gray-400" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600">
              هیچ انیمیشنی تعریف نشده است
            </p>
            <p className="text-xs text-gray-500">ابتدا یک انیمیشن اضافه کنید</p>
          </div>
        </div>
      </div>
    );
  }

  // const getAnimationPreview = (
  //   type: string
  // ): { icon: string; name: string; description: string } => {
  //   const previews: Record<
  //     string,
  //     { icon: string; name: string; description: string }
  //   > = {
  //     pulse: { icon: "🫀", name: "پالس", description: "تغییر اندازه و شفافیت" },
  //     ping: { icon: "📡", name: "پینگ", description: "موج انتشار" },
  //     bgOpacity: {
  //       icon: "🌫️",
  //       name: "شفافیت پس‌زمینه",
  //       description: "تغییر شفافیت",
  //     },
  //     scaleup: { icon: "🔍", name: "بزرگ‌نمایی", description: "افزایش اندازه" },
  //     scaledown: { icon: "🔎", name: "کوچک‌نمایی", description: "کاهش اندازه" },
  //     glow: { icon: "✨", name: "درخشش", description: "افکت نورانی" },
  //     brightness: { icon: "💡", name: "روشنایی", description: "تغییر نور" },
  //     blur: { icon: "🌫️", name: "تاری", description: "محو کردن" },
  //     saturate: { icon: "🎨", name: "اشباع رنگ", description: "تقویت رنگ‌ها" },
  //     contrast: { icon: "🔳", name: "کنتراست", description: "تضاد رنگی" },
  //     opacity: { icon: "👻", name: "شفافیت", description: "تغییر شفافیت کلی" },
  //     shadow: { icon: "🌑", name: "سایه", description: "افکت سایه" },
  //   };
  //   return (
  //     previews[type] || {
  //       icon: "⚡",
  //       name: type,
  //       description: "انیمیشن سفارشی",
  //     }
  //   );
  // };

  const handleMouseEnter = () => {
    if (!previewRef.current || !effects[0]) return;

    if (effects[0].type === "hover") {
      const { animation } = effects[0];
      previewRef.current.style.animation = `preview-${animation.type} ${
        animation.duration
      } ${animation.timing} ${animation.delay || "0s"} ${
        animation.iterationCount || "1"
      }`;
      setIsPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    if (!previewRef.current) return;

    if (effects[0]?.type === "hover") {
      previewRef.current.style.animation = "none";
      setIsPlaying(false);
    }
  };

  const handleClick = () => {
    if (!previewRef.current || !effects[0]) return;

    if (effects[0].type === "click") {
      const { animation } = effects[0];
      previewRef.current.style.animation = "none";
      setIsPlaying(false);

      // Force reflow to restart animation
      void previewRef.current.offsetHeight;

      setTimeout(() => {
        if (previewRef.current) {
          previewRef.current.style.animation = `preview-${animation.type} ${
            animation.duration
          } ${animation.timing} ${animation.delay || "0s"} ${
            animation.iterationCount || "1"
          }`;
          setIsPlaying(true);

          // Reset playing state after animation
          const duration =
            parseFloat(animation.duration.replace("s", "")) * 1000;
          const delay =
            parseFloat((animation.delay || "0s").replace("s", "")) * 1000;
          setTimeout(() => setIsPlaying(false), duration + delay);
        }
      }, 10);
    }
  };

  const handleManualPlay = () => {
    if (!previewRef.current || !effects[0]) return;

    const { animation } = effects[0];
    previewRef.current.style.animation = "none";
    setIsPlaying(false);

    void previewRef.current.offsetHeight;

    setTimeout(() => {
      if (previewRef.current) {
        previewRef.current.style.animation = `preview-${animation.type} ${
          animation.duration
        } ${animation.timing} ${animation.delay || "0s"} ${
          animation.iterationCount || "1"
        }`;
        setIsPlaying(true);

        const duration = parseFloat(animation.duration.replace("s", "")) * 1000;
        const delay =
          parseFloat((animation.delay || "0s").replace("s", "")) * 1000;
        setTimeout(() => setIsPlaying(false), duration + delay);
      }
    }, 10);
  };

  // Generate CSS styles
  const animationStyles = `
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
  `;

  const currentEffect = effects[0];
  // const animationInfo = getAnimationPreview(currentEffect.animation.type);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-4 border-b border-gray-200">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-1">
            <h6 className="font-semibold text-xs text-nowrap text-gray-800">
              پیش‌نمایش انیمیشن
            </h6>
          </div>

          <button
            onClick={handleManualPlay}
            disabled={isPlaying}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              isPlaying
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`}
          >
            {isPlaying ? (
              <>
                در حال اجرا
                <HiRefresh className="w-3 h-3 animate-spin" />
              </>
            ) : (
              <>
                اجرا
                <HiPlay className="w-3 h-3" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Animation Details */}
      {/* <div className="p-6 space-y-4">
        {effects.map((effect, index) => {
          const info = getAnimationPreview(effect.animation.type);
          return (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{info.icon}</span>
                  <div>
                    <h6 className="font-medium text-gray-800">{info.name}</h6>
                    <p className="text-sm text-gray-600">{info.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  {effect.type === "hover" ? (
                    <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-md">
                      <HiCursorClick className="w-3 h-3" />
                      هاور
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
                      <HiCursorClick className="w-3 h-3" />
                      کلیک
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-gray-500 mb-1">مدت زمان</p>
                  <p className="font-medium text-gray-800">
                    {effect.animation.duration}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 mb-1">تایمینگ</p>
                  <p className="font-medium text-gray-800">
                    {effect.animation.timing}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 mb-1">تکرار</p>
                  <p className="font-medium text-gray-800">
                    {effect.animation.iterationCount === "infinite"
                      ? "بی‌نهایت"
                      : `${effect.animation.iterationCount || "1"} بار`}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div> */}

      {/* Interactive Preview */}
      <div className="border-t border-gray-200 bg-gray-50 p-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
            <HiSparkles className="w-4 h-4" />
            <span>
              نمونه تست - روی مربع زیر{" "}
              {currentEffect.type === "hover" ? "هاور کنید" : "کلیک کنید"}
            </span>
          </div>

          <div className="flex justify-center">
            <div
              ref={previewRef}
              className={`w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl ${
                isPlaying ? "ring-4 ring-blue-200" : ""
              }`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
            />
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  isPlaying ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              <span>{isPlaying ? "در حال اجرا" : "آماده"}</span>
            </div>
            <div className="w-px h-4 bg-gray-300" />
            <div className="flex items-center gap-1">
              <span>تریگر:</span>
              <span className="font-medium">
                {currentEffect.type === "hover" ? "هاور" : "کلیک"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
