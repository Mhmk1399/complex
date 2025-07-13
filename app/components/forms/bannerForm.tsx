import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, BannerSection, AnimationEffect } from "@/lib/types";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";
import { animationService } from "@/services/animationService";
import { AnimationPreview } from "../animationPreview";
import { HiSparkles, HiChevronDown } from "react-icons/hi";

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

const ColorInput = ({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <>
    <label className="block mb-1">{label}</label>
    <div className="flex flex-col rounded-md gap-3 items-center">
      <input
        type="color"
        id={name}
        name={name}
        value={value || "#000000"}
        onChange={onChange}
        className=" p-0.5 border rounded-md border-gray-200 w-8 h-8 bg-transparent "
      />
    </div>
  </>
);

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
          <div className="rounded-lg">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              آپلود عکس
            </label>
            <input
              type="text"
              name="imageSrc"
              value={userInputData?.blocks?.imageSrc ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="rounded-lg">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              لینک عکس
            </label>
            <input
              type="text"
              name="imageLink"
              value={userInputData?.blocks?.imageLink ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

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
        </div>
      )}

      {/* Style Settings */}
      {isStyleSettingsOpen && (
        <>
          <div className="transition-all animate-slideDown duration-300">
            <div className="">
              <div className="grid md:grid-cols-1 gap-4">
                {/* Text Settings */}
                <div className="rounded-lg flex flex-col gap-3">
                  <h4 className="font-semibold text-sky-700 my-4">
                    تنظیمات سربرگ
                  </h4>
                  <div className="rounded-lg flex items-center justify-between ">
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

                  <label>سایز سربرگ</label>
                  <input
                    type="range"
                    className="w-full"
                    name="textFontSize"
                    min="12"
                    max="100"
                    value={
                      userInputData?.blocks?.setting?.textFontSize?.toString() ??
                      "18"
                    }
                    onChange={handleBlockSettingChange}
                  />
                  <div className="text-gray-500 text-sm">
                    {userInputData?.blocks?.setting?.textFontSize}px
                  </div>
                  <label className="block mb-1">وزن سربرگ</label>
                  <select
                    name="textFontWeight"
                    value={
                      userInputData?.blocks?.setting?.textFontWeight?.toString() ??
                      "bold"
                    }
                    onChange={handleBlockSettingChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="bold">ضخیم</option>
                    <option value="normal">نرمال</option>
                  </select>
                </div>

                <div className="rounded-lg flex flex-col gap-3">
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

                  <label>سایز توضیحات</label>
                  <input
                    type="range"
                    className="w-full"
                    name="descriptionFontSize"
                    min="10"
                    max="100"
                    value={
                      userInputData?.blocks?.setting?.descriptionFontSize?.toString() ??
                      "16"
                    }
                    onChange={handleBlockSettingChange}
                  />
                  <div className="text-gray-500 text-sm">
                    {userInputData?.blocks?.setting?.descriptionFontSize}px
                  </div>
                  <label className="block mb-1">وزن توضیحات</label>
                  <select
                    name="descriptionFontWeight"
                    value={
                      userInputData?.blocks?.setting?.descriptionFontWeight?.toString() ??
                      "normal"
                    }
                    onChange={handleBlockSettingChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="bold">ضخیم</option>
                    <option value="normal">نرمال</option>
                  </select>
                </div>

                {/* Image Settings */}
                <div className="rounded-lg flex flex-col gap-3">
                  <h4 className="font-semibold text-sky-700 my-4">
                    تنظیمات تصویر
                  </h4>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    شفافیت تصویر
                  </label>
                  <input
                    type="range"
                    name="opacityImage"
                    min="0"
                    max="1"
                    step="0.1"
                    value={
                      userInputData?.blocks?.setting?.opacityImage?.toString() ??
                      "1"
                    }
                    onChange={handleBlockSettingChange}
                    className="w-full"
                  />
                  <div className="text-gray-500 text-sm">
                    {userInputData?.blocks?.setting?.opacityImage || "1"}
                  </div>

                  <div className="mt-4 rounded-lg">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      رفتار عکس
                    </label>
                    <select
                      name="imageBehavior"
                      value={
                        userInputData?.blocks?.setting?.imageBehavior?.toString() ??
                        "cover"
                      }
                      onChange={handleBlockSettingChange}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      <option value="cover">پوشش</option>
                      <option value="contain">شامل</option>
                      <option value="fill">کامل</option>
                    </select>
                  </div>

                  <label>انحنای زاویه تصویر</label>
                  <input
                    className="w-full"
                    type="range"
                    name="imageRadious"
                    min="0"
                    max="50"
                    value={
                      userInputData?.blocks?.setting?.imageRadious?.toString() ??
                      "10"
                    }
                    onChange={handleBlockSettingChange}
                  />
                  <div className="text-gray-500 text-sm">
                    {userInputData?.blocks?.setting?.imageRadious?.toString() ??
                      "10"}
                    px
                  </div>
                </div>

                {/* Box Settings */}
                <div className="rounded-lg flex flex-col gap-3">
                  <h4 className="font-semibold text-sky-700 my-4">
                    تنظیمات کادر
                  </h4>
                  <label className="block mb-2 text-base font-medium text-gray-800">
                    شفافیت کادر
                  </label>
                  <input
                    type="range"
                    name="opacityTextBox"
                    min="0"
                    max="1"
                    step="0.1"
                    value={
                      userInputData?.blocks?.setting?.opacityTextBox?.toString() ??
                      "1"
                    }
                    onChange={handleBlockSettingChange}
                    className="w-full"
                  />
                  <div className="text-gray-500 text-sm">
                    {userInputData?.blocks?.setting?.opacityTextBox || "1"}
                  </div>
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

                  <label>انحنای زاویه کادر</label>
                  <input
                    className="w-full"
                    type="range"
                    name="backgroundBoxRadious"
                    min="0"
                    max="50"
                    value={
                      userInputData?.blocks?.setting?.backgroundBoxRadious?.toString() ??
                      "10"
                    }
                    onChange={handleBlockSettingChange}
                  />
                  <div className="text-gray-500 text-sm">
                    {userInputData?.blocks?.setting?.backgroundBoxRadious?.toString() ??
                      "10"}
                    px
                  </div>
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
        <div className="p-4 animate-slideDown">
          <div className="rounded-lg p-2 flex items-center justify-center">
            <MarginPaddingEditor
              margin={margin}
              padding={padding}
              onChange={handleUpdate}
            />
          </div>
        </div>
      )}
    </div>
  );
};
