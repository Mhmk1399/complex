import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, BannerSection, AnimationEffect } from "@/lib/types";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";
import ImageSelectorModal from "../sections/ImageSelectorModal";
import { animationService } from "@/services/animationService";
import { AnimationPreview } from "../animationPreview";
import { HiSparkles, HiChevronDown } from "react-icons/hi";
import {
  DynamicRangeInput,
  DynamicSelectInput,
  ColorInput,
} from "./DynamicInputs";

interface BannerFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<BannerSection>>;
  userInputData: BannerSection;
  layout: Layout;
  selectedComponent: string;
}

interface BoxValues {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export const BannerForm: React.FC<BannerFormProps> = ({
  setUserInputData,
  userInputData,
  layout,
  selectedComponent,
}) => {
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
  const [isStyleSettingsOpen, setIsStyleSettingsOpen] = useState(false);
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [isSpacingOpen, setIsSpacingOpen] = useState(false);
  const [isAnimationOpen, setIsAnimationOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);

  const handleUpdate = (
    type: "margin" | "padding",
    updatedValues: BoxValues
  ) => {
    if (type === "margin") {
      setMargin(updatedValues);
      setUserInputData((prev: BannerSection) => ({
        ...prev,
        setting: {
          ...prev?.setting,
          marginTop: updatedValues.top.toString(),
          marginBottom: updatedValues.bottom.toString(),
          marginLeft: updatedValues.left.toString(),
          marginRight: updatedValues.right.toString(),
        },
      }));
    } else {
      setPadding(updatedValues);
      setUserInputData((prev: BannerSection) => ({
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

  useEffect(() => {
    const initialData = Compiler(layout, selectedComponent)[0];
    setUserInputData(initialData);
  }, []);

  const handleBlockChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev: BannerSection) => ({
      ...prev,
      blocks: {
        ...prev?.blocks,
        [name]: value,
      },
    }));
  };

  const handleBlockSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (isUpdating) return;
    setIsUpdating(true);
    const { name, value } = e.target;
    setUserInputData((prev: BannerSection) => ({
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

  // Enhanced Animation handlers with validation
  const handleAnimationToggle = (enabled: boolean) => {
    if (enabled) {
      const defaultConfig = animationService.getDefaultConfig("pulse");
      const defaultEffect: AnimationEffect = {
        type: "hover",
        animation: defaultConfig,
      };

      setUserInputData((prev: BannerSection) => ({
        ...prev,
        blocks: {
          ...prev.blocks,
          setting: {
            ...prev.blocks.setting,
            animation: defaultEffect,
          },
        },
      }));
    } else {
      setUserInputData((prev: BannerSection) => ({
        ...prev,
        blocks: {
          ...prev.blocks,
          setting: {
            ...prev.blocks.setting,
            animation: undefined,
          },
        },
      }));
    }
  };

  const handleAnimationChange = (field: string, value: string | number) => {
    setUserInputData((prev: BannerSection) => {
      const currentAnimation = prev.blocks.setting.animation;
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
            animation: updatedAnimation,
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

  // Get current animation values for inputs
  const currentAnimation = userInputData?.blocks?.setting?.animation;
  const hasAnimation = !!currentAnimation;

  return (
    <div className="p-3 max-w-4xl space-y-2 rounded" dir="rtl">
      <h2 className="text-lg font-bold mb-4">تنظیمات بنر</h2>

      {/* Tabs */}
      <TabButtons onTabChange={handleTabChange} />

      {/* Content Section */}
      {isContentOpen && (
        <div className="p-4 space-y-4 animate-slideDown">
          {/* Image Input */}
          {/* Header Input */}
          <div className="rounded-lg">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              متن سربرگ
            </label>
            <input
              type="text"
              name="text"
              value={userInputData?.blocks?.text ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Description Textarea */}
          <div className="rounded-lg">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              متن توضیحات
            </label>
            <textarea
              name="description"
              value={userInputData?.blocks?.description ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              rows={3}
            />
          </div>
          <div className="rounded-lg">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              آپلود عکس
            </label>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                name="imageSrc"
                value={userInputData?.blocks?.imageSrc ?? ""}
                onChange={handleBlockChange}
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="آدرس تصویر"
              />
              <button
                onClick={() => setIsImageSelectorOpen(true)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                type="button"
              >
                انتخاب تصویر
              </button>
            </div>
          </div>
          <div className="rounded-lg">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              متن جایگزین عکس
            </label>
            <input
              type="text"
              name="imageAlt"
              value={userInputData?.blocks?.imageAlt ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      )}

      {/* Style Settings */}
      {isStyleSettingsOpen && (
        <>
          <div className="transition-all animate-slideDown duration-300">
            <div className="">
              <div className="grid md:grid-cols-1 gap-4">
                {/* Text Settings */}
                <div className="flex flex-col gap-3 px-2 border-gray-400 border-b-2 pb-2">
                  <h4 className="font-semibold text-sky-700 my-4">
                    تنظیمات سربرگ
                  </h4>
                  <div className="rounded-lg flex items-center justify-between mb-2 ">
                    {" "}
                    <ColorInput
                      label="رنگ سربرگ"
                      name="textColor"
                      value={
                        userInputData?.blocks?.setting?.textColor?.toString() ??
                        "#333333"
                      }
                      onChange={handleBlockSettingChange}
                    />
                  </div>

                  <DynamicRangeInput
                    label="سایز سربرگ"
                    name="textFontSize"
                    min="12"
                    max="100"
                    value={
                      userInputData?.blocks?.setting?.textFontSize?.toString() ??
                      "18"
                    }
                    onChange={handleBlockSettingChange}
                  />
                  <DynamicSelectInput
                    label="وزن سربرگ"
                    name="textFontWeight"
                    value={
                      userInputData?.blocks?.setting?.textFontWeight?.toString() ??
                      "bold"
                    }
                    options={[
                      { value: "bold", label: "ضخیم" },
                      { value: "normal", label: "نرمال" },
                    ]}
                    onChange={handleBlockSettingChange}
                  />
                </div>

                <div className="flex flex-col gap-3 px-2 border-gray-400 border-b-2 pb-2">
                  <h4 className="font-semibold text-sky-700 my-4">
                    تنظیمات توضیحات
                  </h4>
                  <div className="rounded-lg flex items-center justify-between ">
                    {" "}
                    <ColorInput
                      label="رنگ توضیحات"
                      name="descriptionColor"
                      value={
                        userInputData?.blocks?.setting?.descriptionColor?.toString() ??
                        "#333333"
                      }
                      onChange={handleBlockSettingChange}
                    />
                  </div>

                  <DynamicRangeInput
                    label="سایز توضیحات"
                    name="descriptionFontSize"
                    min="0"
                    max="100"
                    value={
                      userInputData?.blocks?.setting?.descriptionFontSize?.toString() ??
                      "16"
                    }
                    onChange={handleBlockSettingChange}
                  />
                  <DynamicSelectInput
                    label="وزن توضیحات"
                    name="descriptionFontWeight"
                    value={
                      userInputData?.blocks?.setting?.descriptionFontWeight?.toString() ??
                      "normal"
                    }
                    options={[
                      { value: "bold", label: "ضخیم" },
                      { value: "normal", label: "نرمال" },
                    ]}
                    onChange={handleBlockSettingChange}
                  />
                </div>

                {/* Image Settings */}
                <div className="flex flex-col gap-3 px-2 border-gray-400 border-b-2 pb-2">
                  <h4 className="font-semibold text-sky-700 my-4">
                    تنظیمات تصویر
                  </h4>
                  <DynamicRangeInput
                    label="شفافیت تصویر"
                    name="opacityImage"
                    min="0"
                    max="1"
                    step="0.1"
                    value={
                      userInputData?.blocks?.setting?.opacityImage?.toString() ??
                      "1"
                    }
                    onChange={handleBlockSettingChange}
                    displayUnit=""
                  />

                  <div className="mt-4 rounded-lg">
                    <DynamicSelectInput
                      label="رفتار عکس"
                      name="imageBehavior"
                      value={
                        userInputData?.blocks?.setting?.imageBehavior?.toString() ??
                        "cover"
                      }
                      options={[
                        { value: "cover", label: "پوشش" },
                        { value: "contain", label: "شامل" },
                        { value: "fill", label: "کامل" },
                      ]}
                      onChange={handleBlockSettingChange}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <DynamicRangeInput
                    label="انحنای زاویه تصویر"
                    name="imageRadious"
                    min="0"
                    max="200"
                    step={5}
                    value={
                      userInputData?.blocks?.setting?.imageRadious?.toString() ??
                      "10"
                    }
                    onChange={handleBlockSettingChange}
                  />
                </div>

                {/* Box Settings */}
                <div className="flex flex-col gap-3 px-2 border-gray-400 border-b-2 pb-2">
                  <h4 className="font-semibold text-sky-700 my-4">
                    تنظیمات کادر
                  </h4>

                  <DynamicRangeInput
                    label="عرض کادر"
                    name="boxWidth"
                    min="0"
                    max="1500"
                    step="10"
                    value={
                      userInputData?.blocks?.setting?.boxWidth?.toString() ??
                      "1"
                    }
                    onChange={handleBlockSettingChange}
                    displayUnit=""
                  />
                  <DynamicRangeInput
                    label="ارتفاع کادر"
                    name="boxHeight"
                    min="0"
                    max="500"
                    step="10"
                    value={
                      userInputData?.blocks?.setting?.boxHeight?.toString() ??
                      "1"
                    }
                    onChange={handleBlockSettingChange}
                    displayUnit=""
                  />
                  <div className="rounded-lg flex items-center justify-between ">
                    <ColorInput
                      label="رنگ پس زمینه کادر"
                      name="backgroundColorBox"
                      value={
                        userInputData?.blocks?.setting?.backgroundColorBox?.toString() ??
                        "#333333"
                      }
                      onChange={handleBlockSettingChange}
                    />
                  </div>
                  <DynamicRangeInput
                    label="حاشیه"
                    name="border"
                    min="0"
                    max="30"
                    step="1"
                    value={
                      userInputData?.blocks?.setting?.border?.toString() ?? "1"
                    }
                    onChange={handleBlockSettingChange}
                    displayUnit=""
                  />
                  <div className="rounded-lg flex items-center justify-between ">
                    <ColorInput
                      label="رنگ حاشیه"
                      name="borderColor"
                      value={
                        userInputData?.blocks?.setting?.borderColor?.toString() ??
                        "#333333"
                      }
                      onChange={handleBlockSettingChange}
                    />
                  </div>

                  <DynamicRangeInput
                    label="انحنای زاویه کادر"
                    name="backgroundBoxRadious"
                    min="0"
                    max="200"
                    value={
                      userInputData?.blocks?.setting?.backgroundBoxRadious?.toString() ??
                      "10"
                    }
                    onChange={handleBlockSettingChange}
                  />
                  <DynamicRangeInput
                    label="شفافیت کادر"
                    name="opacityTextBox"
                    min="0"
                    max="1"
                    step="0.1"
                    value={
                      userInputData?.blocks?.setting?.opacityTextBox?.toString() ??
                      "1"
                    }
                    onChange={handleBlockSettingChange}
                    displayUnit=""
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
                      userInputData?.blocks?.setting?.shadowOffsetX?.toString() ??
                      "0"
                    }
                    onChange={handleBlockSettingChange}
                  />
                  <DynamicRangeInput
                    label="افست عمودی سایه"
                    name="shadowOffsetY"
                    min="-50"
                    max="50"
                    value={
                      userInputData?.blocks?.setting?.shadowOffsetY?.toString() ??
                      "4"
                    }
                    onChange={handleBlockSettingChange}
                  />
                  <DynamicRangeInput
                    label="میزان بلور سایه"
                    name="shadowBlur"
                    min="0"
                    max="100"
                    value={
                      userInputData?.blocks?.setting?.shadowBlur?.toString() ??
                      "10"
                    }
                    onChange={handleBlockSettingChange}
                  />
                  <DynamicRangeInput
                    label="میزان گسترش سایه"
                    name="shadowSpread"
                    min="-20"
                    max="20"
                    value={
                      userInputData?.blocks?.setting?.shadowSpread?.toString() ??
                      "0"
                    }
                    onChange={handleBlockSettingChange}
                  />
                  <ColorInput
                    label="رنگ سایه"
                    name="shadowColor"
                    value={
                      userInputData?.blocks?.setting?.shadowColor ??
                      "rgba(0,0,0,0.25)"
                    }
                    onChange={handleBlockSettingChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Animation */}
      {isAnimationOpen && (
        <div className="space-y-4 animate-slideDown">
          {/* Header with Toggle */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <HiSparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-800">انیمیشن</span>
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
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
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
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
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
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  />
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
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
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
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="ease">ease</option>
                      <option value="ease-in">ease-in</option>
                      <option value="ease-out">ease-out</option>
                      <option value="linear">linear</option>
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
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </details>

              {/* Mini Preview */}
              <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-2">پیش‌نمایش</p>
                  <AnimationPreview effects={[currentAnimation]} />
                </div>
              </div>
            </div>
          )}

          {!hasAnimation && (
            <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <HiSparkles className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <p className="text-xs">انیمیشن غیرفعال</p>
            </div>
          )}
        </div>
      )}

      {/* Spacing Settings Dropdown */}
      {isSpacingOpen && (
        <div className="animate-slideDown">
          <div className="rounded-lg p-2 flex items-center justify-center">
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
        onSelectImage={(image) => {
          setUserInputData((prev: BannerSection) => ({
            ...prev,
            blocks: {
              ...prev.blocks,
              imageSrc: image.url,
            },
          }));
          setIsImageSelectorOpen(false);
        }}
      />
    </div>
  );
};
