import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, ImageTextSection, AnimationEffect } from "@/lib/types";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";
import ImageSelectorModal from "../sections/ImageSelectorModal";
import { animationService } from "@/services/animationService";
import { AnimationPreview } from "../animationPreview";
import { HiChevronDown, HiSparkles } from "react-icons/hi";

interface ImageTextFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<ImageTextSection>>;
  userInputData: ImageTextSection;
  layout: Layout;
  selectedComponent: string;
}

interface ImageFile {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  storeId: string;
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
        className="p-0.5 border rounded-md border-gray-200 w-8 h-8 bg-transparent"
      />
    </div>
  </>
);

export const ImageTextForm: React.FC<ImageTextFormProps> = ({
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
  }, [selectedComponent]);

  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (isUpdating) return;
    setIsUpdating(true);
    const { name, value } = e.target;
    setUserInputData((prev) => ({
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

  const handleContentChange = (field: string, value: string) => {
    if (isUpdating) return;
    setIsUpdating(true);
    setUserInputData((prev) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [field]: value,
      },
    }));
    setTimeout(() => setIsUpdating(false), 100);
  };

  const handleUpdate = (
    type: "margin" | "padding",
    updatedValues: BoxValues
  ) => {
    if (type === "margin") {
      setMargin(updatedValues);
      setUserInputData((prev) => ({
        ...prev,
        setting: {
          ...prev.setting,
          marginTop: updatedValues.top.toString(),
          marginBottom: updatedValues.bottom.toString(),
        },
      }));
    } else {
      setPadding(updatedValues);
      setUserInputData((prev) => ({
        ...prev,
        setting: {
          ...prev.setting,
          paddingTop: updatedValues.top.toString(),
          paddingBottom: updatedValues.bottom.toString(),
        },
      }));
    }
  };

  // Image Animation handlers
  const handleImageAnimationToggle = (enabled: boolean) => {
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
            imageAnimation: defaultEffect,
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
            imageAnimation: undefined,
          },
        },
      }));
    }
  };

  const handleImageAnimationChange = (
    field: string,
    value: string | number
  ) => {
    setUserInputData((prev) => {
      const currentAnimation = prev.blocks.setting.imageAnimation;
      if (!currentAnimation) return prev;

      const updatedAnimation = { ...currentAnimation };

      if (field === "type") {
        updatedAnimation.type = value as "hover" | "click";
      } else if (field.startsWith("animation.")) {
        const animationField = field.split(".")[1];
        let processedValue = value;

        if (animationField === "duration" || animationField === "delay") {
          const numValue =
            typeof value === "string" ? parseFloat(value) : value;
          processedValue = `${numValue}s`;
        }

        const newAnimationConfig = {
          ...updatedAnimation.animation,
          [animationField]: processedValue,
        };

        if (animationService.validateConfig(newAnimationConfig)) {
          updatedAnimation.animation = newAnimationConfig;
        } else {
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
            imageAnimation: updatedAnimation,
          },
        },
      };
    });
  };

  // Button Animation handlers
  const handleButtonAnimationToggle = (enabled: boolean) => {
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
            buttonAnimation: defaultEffect,
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
            buttonAnimation: undefined,
          },
        },
      }));
    }
  };

  const handleButtonAnimationChange = (
    field: string,
    value: string | number
  ) => {
    setUserInputData((prev) => {
      const currentAnimation = prev.blocks.setting.buttonAnimation;
      if (!currentAnimation) return prev;

      const updatedAnimation = { ...currentAnimation };

      if (field === "type") {
        updatedAnimation.type = value as "hover" | "click";
      } else if (field.startsWith("animation.")) {
        const animationField = field.split(".")[1];
        let processedValue = value;

        if (animationField === "duration" || animationField === "delay") {
          const numValue =
            typeof value === "string" ? parseFloat(value) : value;
          processedValue = `${numValue}s`;
        }

        const newAnimationConfig = {
          ...updatedAnimation.animation,
          [animationField]: processedValue,
        };

        if (animationService.validateConfig(newAnimationConfig)) {
          updatedAnimation.animation = newAnimationConfig;
        } else {
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
            buttonAnimation: updatedAnimation,
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

  const handleImageSelect = (image: ImageFile) => {
    handleContentChange("imageSrc", image.fileUrl);
    setIsImageSelectorOpen(false);
  };

  // Get current animation values
  const currentImageAnimation = userInputData?.blocks?.setting?.imageAnimation;
  const hasImageAnimation = !!currentImageAnimation;
  const currentButtonAnimation =
    userInputData?.blocks?.setting?.buttonAnimation;
  const hasButtonAnimation = !!currentButtonAnimation;

  return (
    <div className="p-3 max-w-4xl space-y-2 rounded" dir="rtl">
      <h2 className="text-lg font-bold mb-4">تنظیمات تصویر و متن</h2>

      {/* Tabs */}
      <TabButtons onTabChange={handleTabChange} />

      {/* Content Section */}
      {isContentOpen && (
        <div className="p-4 animate-slideDown">
          <div className="space-y-4">
            <div>
              <label className="block mb-2">عنوان</label>
              <input
                type="text"
                placeholder="عنوان"
                value={userInputData?.blocks?.heading || ""}
                onChange={(e) => handleContentChange("heading", e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-2">توضیحات</label>
              <textarea
                placeholder="توضیحات"
                value={userInputData?.blocks?.description || ""}
                onChange={(e) =>
                  handleContentChange("description", e.target.value)
                }
                className="w-full p-2 border rounded h-24"
              />
            </div>

            <div>
              <label className="block mb-2">متن دکمه</label>
              <input
                type="text"
                placeholder="متن دکمه"
                value={userInputData?.blocks?.btnText || ""}
                onChange={(e) => handleContentChange("btnText", e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-2">لینک دکمه</label>
              <input
                type="text"
                placeholder="لینک دکمه"
                value={userInputData?.blocks?.btnLink || ""}
                onChange={(e) => handleContentChange("btnLink", e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-2">تصویر</label>
              <button
                onClick={() => setIsImageSelectorOpen(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                انتخاب تصویر
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Style Settings */}
      {isStyleSettingsOpen && (
        <div className="p-4 animate-slideDown w-full">
          <div className="grid gap-4">
            {/* Text Styling */}
            <div className="space-y-4 w-full">
              <h3 className="font-semibold text-gray-700">تنظیمات متن</h3>

              <div className=" gap-4 w-full">
                <div className="rounded-lg flex items-center justify-between ">
                  {" "}
                  <ColorInput
                    label="رنگ عنوان"
                    name="headingColor"
                    value={userInputData?.blocks?.setting?.headingColor}
                    onChange={handleSettingChange}
                  />
                </div>

                <div className="w-full">
                  <label className="block mb-1">سایز عنوان</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    name="headingFontSize"
                    value={
                      userInputData?.blocks?.setting?.headingFontSize || "30"
                    }
                    onChange={handleSettingChange}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600">
                    {userInputData?.blocks?.setting?.headingFontSize || "30"}px
                  </p>
                </div>
              </div>

              <div className=" gap-4">
                <div className="rounded-lg flex items-center justify-between ">
                  <ColorInput
                    label="رنگ توضیحات"
                    name="descriptionColor"
                    value={userInputData?.blocks?.setting?.descriptionColor}
                    onChange={handleSettingChange}
                  />
                </div>

                <div className="w-full">
                  <label className="block mb-1">سایز توضیحات</label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    name="descriptionFontSize"
                    value={
                      userInputData?.blocks?.setting?.descriptionFontSize ||
                      "24"
                    }
                    onChange={handleSettingChange}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600">
                    {userInputData?.blocks?.setting?.descriptionFontSize ||
                      "24"}
                    px
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <ColorInput
                  label="رنگ متن دکمه"
                  name="btnTextColor"
                  value={userInputData?.blocks?.setting?.btnTextColor}
                  onChange={handleSettingChange}
                />

                <ColorInput
                  label="رنگ پس‌زمینه دکمه"
                  name="btnBackgroundColor"
                  value={userInputData?.blocks?.setting?.btnBackgroundColor}
                  onChange={handleSettingChange}
                />
              </div>
            </div>

            {/* Image Settings */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-gray-700">تنظیمات تصویر</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">عرض تصویر</label>
                  <input
                    type="range"
                    min="100"
                    max="800"
                    name="imageWidth"
                    value={userInputData?.blocks?.setting?.imageWidth || "500"}
                    onChange={handleSettingChange}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600">
                    {userInputData?.blocks?.setting?.imageWidth || "500"}px
                  </p>
                </div>

                <div>
                  <label className="block mb-1">ارتفاع تصویر</label>
                  <input
                    type="range"
                    min="100"
                    max="600"
                    name="imageHeight"
                    value={userInputData?.blocks?.setting?.imageHeight || "200"}
                    onChange={handleSettingChange}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600">
                    {userInputData?.blocks?.setting?.imageHeight || "200"}px
                  </p>
                </div>
              </div>

              <div>
                <label className="block mb-1">شفافیت تصویر</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  name="opacityImage"
                  value={userInputData?.blocks?.setting?.opacityImage || "1"}
                  onChange={handleSettingChange}
                  className="w-full"
                />
                <p className="text-sm text-gray-600">
                  {userInputData?.blocks?.setting?.opacityImage || "1"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation */}
      {isAnimationOpen && (
        <>
          <div className="space-y-4 animate-slideDown">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <HiSparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-800">
                  انیمیشن تصویر
                </span>
              </div>

              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasImageAnimation}
                  onChange={(e) => handleImageAnimationToggle(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-[42px] h-5 rounded-full transition-colors duration-200 ${
                    hasImageAnimation ? "bg-blue-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 mt-0.5 ${
                      hasImageAnimation ? "-translate-x-6" : "-translate-x-0.5"
                    }`}
                  />
                </div>
              </label>
            </div>

            {hasImageAnimation && currentImageAnimation && (
              <div className="space-y-4 p-4 bg-transparent border border-gray-200 rounded-lg">
                <h5 className="text-sm font-medium text-gray-700">
                  تنظیمات انیمیشن تصویر
                </h5>

                {/* Trigger & Animation Type */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      تریگر
                    </label>
                    <select
                      value={currentImageAnimation.type}
                      onChange={(e) =>
                        handleImageAnimationChange("type", e.target.value)
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
                      value={currentImageAnimation.animation.type}
                      onChange={(e) =>
                        handleImageAnimationChange(
                          "animation.type",
                          e.target.value
                        )
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
                        currentImageAnimation.animation.type
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
                          currentImageAnimation.animation.duration.replace(
                            "s",
                            ""
                          )
                        ) || 1
                      }
                      onChange={(e) =>
                        handleImageAnimationChange(
                          "animation.duration",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      تکرار
                    </label>
                    <select
                      value={
                        currentImageAnimation.animation.iterationCount || "1"
                      }
                      onChange={(e) =>
                        handleImageAnimationChange(
                          "animation.iterationCount",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
                        value={currentImageAnimation.animation.timing}
                        onChange={(e) =>
                          handleImageAnimationChange(
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
                      </select>
                    </div>
                  </div>
                </details>

                {/* Mini Preview */}
                <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-2">پیش‌نمایش</p>
                    <AnimationPreview effects={[currentImageAnimation]} />
                  </div>
                </div>
              </div>
            )}

            {!hasImageAnimation && (
              <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <HiSparkles className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                <p className="text-xs">انیمیشن تصویر غیرفعال است</p>
              </div>
            )}
          </div>

          {/* Button Animation Settings */}
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
                  checked={hasButtonAnimation}
                  onChange={(e) =>
                    handleButtonAnimationToggle(e.target.checked)
                  }
                  className="sr-only"
                />
                <div
                  className={`w-[42px] h-5 rounded-full transition-colors duration-200 ${
                    hasButtonAnimation ? "bg-blue-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 mt-0.5 ${
                      hasButtonAnimation ? "-translate-x-6" : "-translate-x-0.5"
                    }`}
                  />
                </div>
              </label>
            </div>

            {hasButtonAnimation && currentButtonAnimation && (
              <div className="space-y-4 p-4 bg-transparent border border-gray-200 rounded-lg">
                <h5 className="text-sm font-medium text-gray-700">
                  تنظیمات انیمیشن دکمه
                </h5>

                {/* Trigger & Animation Type */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      تریگر
                    </label>
                    <select
                      value={currentButtonAnimation.type}
                      onChange={(e) =>
                        handleButtonAnimationChange("type", e.target.value)
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
                      value={currentButtonAnimation.animation.type}
                      onChange={(e) =>
                        handleButtonAnimationChange(
                          "animation.type",
                          e.target.value
                        )
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
                        currentButtonAnimation.animation.type
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
                          currentButtonAnimation.animation.duration.replace(
                            "s",
                            ""
                          )
                        ) || 1
                      }
                      onChange={(e) =>
                        handleButtonAnimationChange(
                          "animation.duration",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      تکرار
                    </label>
                    <select
                      value={
                        currentButtonAnimation.animation.iterationCount || "1"
                      }
                      onChange={(e) =>
                        handleButtonAnimationChange(
                          "animation.iterationCount",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
                        value={currentButtonAnimation.animation.timing}
                        onChange={(e) =>
                          handleButtonAnimationChange(
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
                      </select>
                    </div>
                  </div>
                </details>

                {/* Mini Preview */}
                <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-2">پیش‌نمایش</p>
                    <AnimationPreview effects={[currentButtonAnimation]} />
                  </div>
                </div>
              </div>
            )}

            {!hasButtonAnimation && (
              <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <HiSparkles className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                <p className="text-xs">انیمیشن دکمه غیرفعال است</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Spacing Settings */}
      {isSpacingOpen && (
        <div className="p-4 animate-slideDown">
          <div className="bg-gray-50 rounded-lg flex items-center justify-center">
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
