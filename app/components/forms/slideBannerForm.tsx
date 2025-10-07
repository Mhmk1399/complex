import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, SlideBannerSection, AnimationEffect } from "@/lib/types";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";
import ImageSelectorModal from "../sections/ImageSelectorModal";
import { animationService } from "@/services/animationService";
import { AnimationPreview } from "../animationPreview";
import { HiChevronDown, HiSparkles } from "react-icons/hi";
import { ColorInput, DynamicRangeInput } from "./DynamicInputs";

interface SlideBannerFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<SlideBannerSection>>;
  userInputData: SlideBannerSection;
  layout: Layout;
  selectedComponent: string;
}

interface BoxValues {
  top: number;
  bottom: number;
  left: number;
  right: number;
}
interface ImageData {
  id: string;
  filename: string;
  url: string;
  uploadedAt: string;
  size: number;
}

export const SlideBannerForm: React.FC<SlideBannerFormProps> = ({
  setUserInputData,
  userInputData,
  layout,
  selectedComponent,
}) => {
  const [isStyleSettingsOpen, setIsStyleSettingsOpen] = useState(false);
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [isSpacingOpen, setIsSpacingOpen] = useState(false);
  const [isAnimationOpen, setIsAnimationOpen] = useState(false);
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const [margin, setMargin] = useState<BoxValues>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });
  const [padding, setPadding] = useState<BoxValues>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  useEffect(() => {
    setMargin({
      top: Number(userInputData?.setting?.marginTop) || 0,
      bottom: Number(userInputData?.setting?.marginBottom) || 0,
      right: Number(userInputData?.setting?.marginRight) || 0,
      left: Number(userInputData?.setting?.marginLeft) || 0,
    });

    setPadding({
      top: Number(userInputData?.setting?.paddingTop) || 0,
      bottom: Number(userInputData?.setting?.paddingBottom) || 0,
      right: Number(userInputData?.setting?.paddingRight) || 0,
      left: Number(userInputData?.setting?.paddingLeft) || 0,
    });
  }, [userInputData?.setting]);

  const handleUpdate = (
    type: "margin" | "padding",
    updatedValues: BoxValues
  ) => {
    if (type === "margin") {
      setMargin(updatedValues);
      setUserInputData((prev: SlideBannerSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          marginTop: updatedValues.top.toString(),
          marginBottom: updatedValues.bottom.toString(),
          marginLeft: updatedValues.left.toString(),
          marginRight: updatedValues.right.toString(),
        },
      }));
    } else {
      setPadding(updatedValues);
      setUserInputData((prev: SlideBannerSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          paddingTop: updatedValues.top.toString(),
          paddingBottom: updatedValues.bottom.toString(),
          paddingLeft: updatedValues.left.toString(),
          paddingRight: updatedValues.right.toString(),
        },
      }));
    }
  };

  useEffect(() => {
    const initialData = Compiler(layout, selectedComponent)[0];
    setUserInputData(initialData);
  }, [selectedComponent]);

  const handleSlideChange = (index: number, field: string, value: string) => {
    setUserInputData((prev: SlideBannerSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        slides: prev.blocks.slides.map((slide, i) =>
          i === index ? { ...slide, [field]: value } : slide
        ),
      },
    }));
  };

  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (isUpdating) return;
    setIsUpdating(true);

    const { name, value } = e.target;
    setUserInputData((prev: SlideBannerSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        setting: {
          ...prev.blocks.setting,
          [name]: value,
        },
      },
    }));

    setTimeout(() => setIsUpdating(false), 100);
  };

  // Animation handlers
  const handleAnimationToggle = (enabled: boolean) => {
    if (enabled) {
      const defaultConfig = animationService.getDefaultConfig("pulse");
      const defaultEffect: AnimationEffect = {
        type: "hover",
        animation: defaultConfig,
      };

      setUserInputData((prev) => ({
        ...prev,
        blocks: {
          ...prev.blocks,
          setting: {
            ...prev.blocks.setting,
            navAnimation: defaultEffect,
          },
        },
      }));
    } else {
      setUserInputData((prev) => ({
        ...prev,
        blocks: {
          ...prev.blocks,
          setting: {
            ...prev.blocks.setting,
            navAnimation: undefined,
          },
        },
      }));
    }
  };

  const handleAnimationChange = (field: string, value: string | number) => {
    setUserInputData((prev) => {
      const currentAnimation = prev.blocks.setting.navAnimation;
      if (!currentAnimation) return prev;

      const updatedAnimation = { ...currentAnimation };

      if (field === "type") {
        updatedAnimation.type = value as "hover" | "click";
      } else if (field.startsWith("animation.")) {
        const animationField = field.split(".")[1];
        let processedValue = value;

        // Process duration and delay to ensure proper format
        if (animationField === "duration" || animationField === "delay") {
          const numValue =
            typeof value === "string" ? parseFloat(value) : value;
          processedValue = `${numValue}s`;
        }

        // Validate the animation config
        const newAnimationConfig = {
          ...updatedAnimation.animation,
          [animationField]: processedValue,
        };

        if (animationService.validateConfig(newAnimationConfig)) {
          updatedAnimation.animation = newAnimationConfig;
        } else {
          // If validation fails, revert to default
          updatedAnimation.animation = animationService.getDefaultConfig(
            updatedAnimation.animation.type
          );
        }
      }

      return {
        ...prev,
        blocks: {
          ...prev.blocks,
          setting: {
            ...prev.blocks.setting,
            navAnimation: updatedAnimation,
          },
        },
      };
    });
  };

  const handleTabChange = (
    tab: "content" | "style" | "spacing" | "animation"
  ) => {
    setIsContentOpen(tab === "content");
    setIsStyleSettingsOpen(tab === "style");
    setIsSpacingOpen(tab === "spacing");
    setIsAnimationOpen(tab === "animation");
  };

  useEffect(() => {
    setIsContentOpen(true);
  }, []);

  const handleImageSelect = (image: ImageData) => {
    handleSlideChange(currentSlideIndex, "imageSrc", image.url);
    handleSlideChange(currentSlideIndex, "imageAlt", image.filename);
    setIsImageSelectorOpen(false);
  };

  // Get current animation values for inputs
  const currentAnimation = userInputData?.blocks?.setting?.navAnimation;
  const hasAnimation = !!currentAnimation;

  return (
    <div className="p-2 max-w-4xl space-y-2 rounded" dir="rtl">
      <h2 className="text-lg font-bold mb-4">تنظیمات اسلایدر</h2>
      <TabButtons onTabChange={handleTabChange} />

      {/* Content Section */}
      {isContentOpen && (
        <div className="p-2 animate-slideDown">
          {userInputData?.blocks?.slides?.map((slide, index) => (
            <div key={index} className="mb-4 border-b border-gray-300">
              <h4 className="font-semibold mb-2">اسلاید {index + 1}</h4>
              <div className="space-y-2">
                <label>تصویر</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    readOnly
                    placeholder="آدرس تصویر"
                    value={slide.imageSrc}
                    onChange={(e) =>
                      handleSlideChange(index, "imageSrc", e.target.value)
                    }
                    className="w-full hidden mb-2 p-2 border rounded"
                  />
                  <button
                    onClick={() => {
                      setCurrentSlideIndex(index);
                      setIsImageSelectorOpen(true);
                    }}
                    className="px-4 py-2 mb-4 mt-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    انتخاب تصویر
                  </button>
                </div>
                <label className="mt-2">متن جایگزین تصویر</label>
                <input
                  type="text"
                  placeholder="متن جایگزین تصویر"
                  value={slide.imageAlt}
                  onChange={(e) =>
                    handleSlideChange(index, "imageAlt", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Style Settings */}
      {isStyleSettingsOpen && (
        <div className=" border-gray-100 animate-slideDown">
          <div className="space-y-4 rounded-lg">
            <h4 className="font-bold text-sky-700 mb-3">تنظیمات ارتفاع بنر</h4>
            <DynamicRangeInput
              label="ارتفاع بنر"
              name="height"
              min="50"
              max="1500"
              value={
                userInputData?.blocks?.setting?.height?.toString() ?? "300"
              }
              onChange={handleSettingChange}
            />
          </div>

          <div className="space-y-4 rounded-lg">
            <h4 className="font-bold text-sky-700 my-3">تنظیمات دکمه</h4>
            <DynamicRangeInput
              label="عرض دکمه"
              name="arrowWidth"
              min="0"
              max="100"
              value={
                userInputData?.blocks?.setting?.arrowWidth?.toString() ?? "30"
              }
              onChange={handleSettingChange}
            />
            <DynamicRangeInput
              label="ارتفاع دکمه"
              name="arrowHeight"
              min="0"
              max="100"
              value={
                userInputData?.blocks?.setting?.arrowHeight?.toString() ?? "30"
              }
              onChange={handleSettingChange}
            />
            <DynamicRangeInput
              label="انحنای دکمه"
              name="arrowRadius"
              min="0"
              max="50"
              value={
                userInputData?.blocks?.setting?.arrowRadius?.toString() ?? "5"
              }
              onChange={handleSettingChange}
            />
            <ColorInput
              label="رنگ دکمه"
              name="arrowColor"
              value={userInputData?.blocks?.setting?.arrowColor ?? "#000000"}
              onChange={handleSettingChange}
            />
            <ColorInput
              label="رنگ پس زمینه دکمه"
              name="bgArrow"
              value={userInputData?.blocks?.setting?.bgArrow ?? "#000000"}
              onChange={handleSettingChange}
            />
            <ColorInput
              label="رنگ پس زمینه با هاور"
              name="arrowBgHover"
              value={userInputData?.blocks?.setting?.arrowBgHover ?? "#000000"}
              onChange={handleSettingChange}
            />
            <ColorInput
              label="رنگ نقطه‌های غیرفعال"
              name="inactiveDotColor"
              value={
                userInputData?.blocks?.setting?.inactiveDotColor ?? "#000000"
              }
              onChange={handleSettingChange}
            />
            <ColorInput
              label="رنگ نقطه‌های فعال"
              name="activeDotColor"
              value={
                userInputData?.blocks?.setting?.activeDotColor ?? "#000000"
              }
              onChange={handleSettingChange}
            />
          </div>

          {/* ✅ New Shadow Settings */}
          <div className="space-y-4 rounded-lg">
            <h4 className="font-bold text-sky-700 my-3">تنظیمات سایه</h4>
            <DynamicRangeInput
              label="افست افقی سایه"
              name="shadowOffsetX"
              min="-50"
              max="50"
              value={
                userInputData?.blocks?.setting?.shadowOffsetX?.toString() ?? "0"
              }
              onChange={handleSettingChange}
            />
            <DynamicRangeInput
              label="افست عمودی سایه"
              name="shadowOffsetY"
              min="-50"
              max="50"
              value={
                userInputData?.blocks?.setting?.shadowOffsetY?.toString() ?? "4"
              }
              onChange={handleSettingChange}
            />
            <DynamicRangeInput
              label="میزان بلور سایه"
              name="shadowBlur"
              min="0"
              max="100"
              value={
                userInputData?.blocks?.setting?.shadowBlur?.toString() ?? "10"
              }
              onChange={handleSettingChange}
            />
            <DynamicRangeInput
              label="میزان گسترش سایه"
              name="shadowSpread"
              min="-20"
              max="20"
              value={
                userInputData?.blocks?.setting?.shadowSpread?.toString() ?? "0"
              }
              onChange={handleSettingChange}
            />
            <ColorInput
              label="رنگ سایه"
              name="shadowColor"
              value={
                userInputData?.blocks?.setting?.shadowColor ??
                "rgba(0,0,0,0.25)"
              }
              onChange={handleSettingChange}
            />
          </div>
        </div>
      )}

      {isAnimationOpen && (
        <div className="space-y-4 animate-slideDown">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <HiSparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-800">
                انیمیشن دکمه
              </span>
            </div>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={hasAnimation}
                onChange={(e) => handleAnimationToggle(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-[42px] h-5 rounded-full transition-colors duration-200 ${
                  hasAnimation ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 mt-0.5 ${
                    hasAnimation ? "-translate-x-6" : "-translate-x-0.5"
                  }`}
                />
              </div>
            </label>
          </div>

          {hasAnimation && currentAnimation && (
            <div className="space-y-4 p-4 bg-transparent border border-gray-200 rounded-lg">
              <h5 className="text-sm font-medium text-gray-700">
                تنظیمات انیمیشن دکمه‌های قبل/بعد
              </h5>

              {/* Trigger & Animation Type */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    تریگر
                  </label>
                  <select
                    value={currentAnimation.type}
                    onChange={(e) =>
                      handleAnimationChange("type", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="hover">هاور</option>
                    <option value="click">کلیک</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    نوع انیمیشن
                  </label>
                  <select
                    value={currentAnimation.animation.type}
                    onChange={(e) =>
                      handleAnimationChange("animation.type", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {animationService.getAnimationTypes().map((type) => (
                      <option key={type} value={type}>
                        {type === "pulse" && "پالس"}
                        {type === "glow" && "درخشش"}
                        {type === "brightness" && "روشنایی"}
                        {type === "blur" && "تاری"}
                        {type === "saturate" && "اشباع رنگ"}
                        {type === "contrast" && "کنتراست"}
                        {type === "opacity" && "شفافیت"}
                        {type === "shadow" && "سایه"}
                      </option>
                    ))}
                  </select>
                  <div className="text-xs text-gray-500 mt-1">
                    {animationService.getAnimationPreview(
                      currentAnimation.animation.type
                    )}
                  </div>
                </div>
              </div>

              {/* Timing Controls */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    مدت (ثانیه)
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={
                      parseFloat(
                        currentAnimation.animation.duration.replace("s", "")
                      ) || 1
                    }
                    onChange={(e) =>
                      handleAnimationChange(
                        "animation.duration",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    فعلی: {currentAnimation.animation.duration}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    تکرار
                  </label>
                  <select
                    value={currentAnimation.animation.iterationCount || "1"}
                    onChange={(e) =>
                      handleAnimationChange(
                        "animation.iterationCount",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="5">5</option>
                    <option value="infinite">∞</option>
                  </select>
                </div>
              </div>

              {/* Advanced Settings - Collapsible */}
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-xs font-medium text-gray-600 hover:text-gray-800 py-2">
                  <span>تنظیمات پیشرفته</span>
                  <HiChevronDown className="w-4 h-4 transform group-open:rotate-180 transition-transform" />
                </summary>

                <div className="mt-3 space-y-3 pt-3 border-t border-gray-200">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      تایمینگ
                    </label>
                    <select
                      value={currentAnimation.animation.timing}
                      onChange={(e) =>
                        handleAnimationChange(
                          "animation.timing",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="ease">ease</option>
                      <option value="ease-in">ease-in</option>
                      <option value="ease-out">ease-out</option>
                      <option value="ease-in-out">ease-in-out</option>
                      <option value="linear">linear</option>
                      <option value="cubic-bezier(0, 0, 0.2, 1)">
                        cubic-bezier
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      تاخیر (ثانیه)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={
                        parseFloat(
                          (currentAnimation.animation.delay || "0s").replace(
                            "s",
                            ""
                          )
                        ) || 0
                      }
                      onChange={(e) =>
                        handleAnimationChange("animation.delay", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      فعلی: {currentAnimation.animation?.delay || "0s"}
                    </div>
                  </div>
                </div>
              </details>

              {/* Mini Preview with Animation Info */}
              <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
                <div className="text-center mb-3">
                  <p className="text-xs text-gray-600 mb-2">پیش‌نمایش</p>
                  <AnimationPreview effects={[currentAnimation]} />
                </div>
              </div>
            </div>
          )}

          {!hasAnimation && (
            <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <HiSparkles className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <p className="text-xs">انیمیشن دکمه‌های ناوبری غیرفعال است</p>
            </div>
          )}
        </div>
      )}
      {/* Spacing Settings Dropdown */}
      {isSpacingOpen && (
        <div className="animate-slideDown">
          <div className="rounded-lg items-center justify-center">
            <MarginPaddingEditor
              margin={margin}
              padding={padding}
              onChange={handleUpdate}
            />
          </div>
        </div>
      )}

      <ImageSelectorModal
        isOpen={isImageSelectorOpen}
        onClose={() => setIsImageSelectorOpen(false)}
        onSelectImage={handleImageSelect}
      />
    </div>
  );
};
