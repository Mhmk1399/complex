import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, ImageTextSection, AnimationEffect } from "@/lib/types";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";
import ImageSelectorModal from "../sections/ImageSelectorModal";
import { animationService } from "@/services/animationService";
import { AnimationPreview } from "../animationPreview";
import { HiChevronDown, HiSparkles } from "react-icons/hi";
import {
  ColorInput,
  DynamicRangeInput,
  DynamicSelectInput,
} from "./DynamicInputs";
import { useSharedContext } from "@/app/contexts/SharedContext";

interface ImageTextFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<ImageTextSection>>;
  userInputData: ImageTextSection;
  layout: Layout;
  selectedComponent: string;
}

interface BoxValues {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export const ImageTextForm: React.FC<ImageTextFormProps> = ({
  setUserInputData,
  userInputData,
  layout,
  selectedComponent,
}) => {
  // Get activeRoutes from context
  const { activeRoutes } = useSharedContext();

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
  const [useRouteSelect, setUseRouteSelect] = useState(false);

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
          marginLeft: updatedValues.left.toString(),
          marginRight: updatedValues.right.toString(),
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
          paddingLeft: updatedValues.left.toString(),
          paddingRight: updatedValues.right.toString(),
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

  const handleImageSelect = (image: any) => {
    handleContentChange("imageSrc", image.url);
    setIsImageSelectorOpen(false);
  };

  // Handle route selection toggle
  const handleRouteSelectToggle = (checked: boolean) => {
    setUseRouteSelect(checked);
  };

  // Handle route change
  const handleRouteChange = (route: string) => {
    handleContentChange("btnLink", route);
  };

  // Get current animation values
  const currentImageAnimation = userInputData?.blocks?.setting?.imageAnimation;
  const hasImageAnimation = !!currentImageAnimation;
  const currentButtonAnimation =
    userInputData?.blocks?.setting?.buttonAnimation;
  const hasButtonAnimation = !!currentButtonAnimation;

  return (
    <div className="p-2 max-w-4xl space-y-2 rounded" dir="rtl">
      <h2 className="text-lg font-bold mb-4">تنظیمات تصویر و متن</h2>

      {/* Tabs */}
      <TabButtons onTabChange={handleTabChange} />

      {/* Content Section */}
      {isContentOpen && (
        <div className="p-2 animate-slideDown">
          {/* Main Content Section */}
          <div className="mb-6 p-4 ">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
              محتوای اصلی
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  عنوان
                </label>
                <input
                  type="text"
                  placeholder="عنوان بخش را وارد کنید"
                  value={userInputData?.blocks?.heading || ""}
                  onChange={(e) =>
                    handleContentChange("heading", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  توضیحات
                </label>
                <textarea
                  placeholder="توضیحات تفصیلی را وارد کنید"
                  value={userInputData?.blocks?.description || ""}
                  onChange={(e) =>
                    handleContentChange("description", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all h-24 resize-none"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  متن دکمه
                </label>
                <input
                  type="text"
                  placeholder="متن روی دکمه"
                  value={userInputData?.blocks?.btnText || ""}
                  onChange={(e) =>
                    handleContentChange("btnText", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Button Link Section */}
          <div className="mb-6 p-4 ">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
              تنظیمات لینک دکمه
            </h3>

            <div className="space-y-4">
              {/* Route Selection Toggle */}
              <div className="mb-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useRouteSelect}
                    onChange={(e) => handleRouteSelectToggle(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">
                    انتخاب از مسیرهای موجود
                  </span>
                </label>
              </div>

              {/* Link Input */}
              {useRouteSelect ? (
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    انتخاب مسیر
                  </label>
                  <select
                    value={userInputData?.blocks?.btnLink || ""}
                    onChange={(e) => handleRouteChange(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="">انتخاب مسیر</option>
                    {activeRoutes.map((route) => (
                      <option key={route} value={route}>
                        {route}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    لینک سفارشی
                  </label>
                  <input
                    type="text"
                    placeholder="آدرس لینک یا مسیر سفارشی"
                    value={userInputData?.blocks?.btnLink || ""}
                    onChange={(e) =>
                      handleContentChange("btnLink", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Image Section */}
          <div className="mb-6 p-4 ">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
              تنظیمات تصویر
            </h3>

            {/* Image Preview */}
            {userInputData?.blocks?.imageSrc && (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  پیش‌نمایش تصویر
                </label>
                <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 group">
                  <img
                    src={userInputData.blocks.imageSrc}
                    alt="پیش‌نمایش"
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "/assets/images/placeholder.jpg";
                    }}
                  />
                </div>
              </div>
            )}

            {/* No Image State */}
            {!userInputData?.blocks?.imageSrc && (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  انتخاب تصویر
                </label>
                <div
                  onClick={() => setIsImageSelectorOpen(true)}
                  className="w-full h-40 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-all duration-200"
                >
                  <svg
                    className="w-12 h-12 text-gray-400 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-gray-500 text-sm text-center">
                    کلیک کنید تا تصویر انتخاب کنید
                  </p>
                </div>
              </div>
            )}

            {/* Image Selection Button */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIsImageSelectorOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {userInputData?.blocks?.imageSrc
                  ? "تغییر تصویر"
                  : "انتخاب تصویر"}
              </button>

              {userInputData?.blocks?.imageSrc && (
                <button
                  onClick={() => handleContentChange("imageSrc", "")}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  حذف تصویر
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Style Settings */}
      {isStyleSettingsOpen && (
        <div className="p-4 animate-slideDown w-full">
          <div className="grid gap-6">
            {/* Text Styling */}
            <div className="space-y-4 ">
              {/* heading */}
              <div className="grid md:grid-cols-1 gap-4 w-full">
                <h3 className="font-semibold text-sky-800 flex items-center gap-2">
                  تنظیمات متن
                </h3>
                <DynamicRangeInput
                  label="سایز عنوان"
                  name="headingFontSize"
                  min="10"
                  max="100"
                  value={
                    userInputData?.blocks?.setting?.headingFontSize || "30"
                  }
                  onChange={handleSettingChange}
                />
                <DynamicSelectInput
                  label="وزن"
                  name="headingFontWeight"
                  options={[
                    { value: "normal", label: "نرمال" },
                    { value: "bold", label: "ضخیم" },
                  ]}
                  value={
                    userInputData?.blocks?.setting?.headingFontWeight || "30"
                  }
                  onChange={handleSettingChange}
                />
                <ColorInput
                  label="رنگ عنوان"
                  name="headingColor"
                  value={
                    userInputData?.blocks?.setting?.headingColor || "#000000"
                  }
                  onChange={handleSettingChange}
                />
              </div>
              {/* description */}
              <div className="grid md:grid-cols-1 gap-4">
                <h3 className="font-semibold text-sky-800 flex items-center gap-2">
                  تنظیمات توضیحات
                </h3>

                <DynamicRangeInput
                  label="سایز  "
                  name="descriptionFontSize"
                  min="10"
                  max="50"
                  value={
                    userInputData?.blocks?.setting?.descriptionFontSize || "16"
                  }
                  onChange={handleSettingChange}
                />
                <DynamicSelectInput
                  label="وزن"
                  name="descriptionFontWeight"
                  options={[
                    { value: "normal", label: "نرمال" },
                    { value: "bold", label: "ضخیم" },
                  ]}
                  value={
                    userInputData?.blocks?.setting?.descriptionFontWeight ||
                    "30"
                  }
                  onChange={handleSettingChange}
                />
                <ColorInput
                  label="رنگ  "
                  name="descriptionColor"
                  value={
                    userInputData?.blocks?.setting?.descriptionColor ||
                    "#666666"
                  }
                  onChange={handleSettingChange}
                />
              </div>
            </div>
            {/* Button Styling */}
            <div className="space-y-4 ">
              <h3 className="font-semibold text-sky-800 flex items-center gap-2">
                تنظیمات دکمه
              </h3>

              <div className="grid grid-cols-1 gap-4">
                <DynamicRangeInput
                  label="عرض  "
                  name="btnWidth"
                  min="10"
                  max="1200"
                  value={userInputData?.blocks?.setting?.btnWidth || "16"}
                  onChange={handleSettingChange}
                />
                <DynamicRangeInput
                  label="انحنا  "
                  name="btnRadiuos"
                  min="0"
                  max="30"
                  value={userInputData?.blocks?.setting?.btnRadiuos || "16"}
                  onChange={handleSettingChange}
                />
                <ColorInput
                  label="رنگ متن دکمه"
                  name="btnTextColor"
                  value={
                    userInputData?.blocks?.setting?.btnTextColor || "#ffffff"
                  }
                  onChange={handleSettingChange}
                />

                <ColorInput
                  label="رنگ پس‌زمینه دکمه"
                  name="btnBackgroundColor"
                  value={
                    userInputData?.blocks?.setting?.btnBackgroundColor ||
                    "#3b82f6"
                  }
                  onChange={handleSettingChange}
                />
              </div>
            </div>
            {/* background Styling */}
            <div className="space-y-4 ">
              <h3 className="font-semibold text-sky-800 flex items-center gap-2">
                تنظیمات پس زمینه
              </h3>

              <div className="grid grid-cols-1 gap-4">
                <DynamicRangeInput
                  label="انحنا "
                  name="boxRadiuos"
                  min="0"
                  max="200"
                  value={userInputData?.blocks?.setting?.boxRadiuos || "16"}
                  onChange={handleSettingChange}
                />

                <ColorInput
                  label="رنگ"
                  name="background"
                  value={
                    userInputData?.blocks?.setting?.background || "#ffffff"
                  }
                  onChange={handleSettingChange}
                />
              </div>
            </div>
            {/* Image Settings */}
            <div className="space-y-4 ">
              <h3 className="font-semibold text-sky-800 flex items-center gap-2">
                تنظیمات تصویر
              </h3>

              <DynamicRangeInput
                label="عرض تصویر"
                name="imageWidth"
                min="100"
                max="1400"
                value={userInputData?.blocks?.setting?.imageWidth || "500"}
                onChange={handleSettingChange}
              />

              <DynamicRangeInput
                label="ارتفاع تصویر"
                name="imageHeight"
                min="100"
                max="600"
                value={userInputData?.blocks?.setting?.imageHeight || "300"}
                onChange={handleSettingChange}
              />

              <DynamicRangeInput
                label="شفافیت تصویر"
                name="opacityImage"
                min="0"
                max="1"
                step="0.1"
                value={userInputData?.blocks?.setting?.opacityImage || "1"}
                onChange={handleSettingChange}
                displayUnit=""
              />

              <DynamicRangeInput
                label="انحنای گوشه‌ها"
                name="imageRadius"
                min="0"
                max="50"
                value={userInputData?.blocks?.setting?.imageRadius || "8"}
                onChange={handleSettingChange}
              />
            </div>
          </div>
          {/* ✅ New Shadow Settings */}
          <div className="rounded-lg">
            <h4 className="font-bold text-sky-700 my-3">تنظیمات سایه</h4>
            <DynamicRangeInput
              label="افست افقی سایه"
              name="shadowOffsetX"
              min="-50"
              max="50"
              value={userInputData?.blocks?.setting?.shadowOffsetX?.toString() ?? "0"}
              onChange={handleSettingChange}
            />
            <DynamicRangeInput
              label="افست عمودی سایه"
              name="shadowOffsetY"
              min="-50"
              max="50"
              value={userInputData?.blocks?.setting?.shadowOffsetY?.toString() ?? "0"}
              onChange={handleSettingChange}
            />
            <DynamicRangeInput
              label="میزان بلور سایه"
              name="shadowBlur"
              min="0"
              max="100"
              value={userInputData?.blocks?.setting?.shadowBlur?.toString() ?? "0"}
              onChange={handleSettingChange}
            />
            <DynamicRangeInput
              label="میزان گسترش سایه"
              name="shadowSpread"
              min="-20"
              max="20"
              value={userInputData?.blocks?.setting?.shadowSpread?.toString() ?? "0"}
              onChange={handleSettingChange}
            />
            <ColorInput
              label="رنگ سایه"
              name="shadowColor"
              value={userInputData?.blocks?.setting?.shadowColor?.toString() ?? "0"}
              onChange={handleSettingChange}
            />
          </div>
        </div>
      )}

      {/* Animation Settings */}
      {isAnimationOpen && (
        <div className="space-y-6 animate-slideDown">
          {/* Image Animation */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <HiSparkles className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
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
              <div className="space-y-4 p-4 bg-white border border-gray-200 rounded-lg">
                <h5 className="text-sm font-medium text-gray-700">
                  تنظیمات انیمیشن تصویر
                </h5>

                {/* Trigger & Animation Type */}
                <div className="grid grid-cols-2 gap-3">
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
              <div className="text-center py-6 text-gray-500 bg-white rounded-lg border-2 border-dashed border-gray-300">
                <HiSparkles className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                <p className="text-xs">انیمیشن تصویر غیرفعال است</p>
              </div>
            )}
          </div>

          {/* Button Animation Settings */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <HiSparkles className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">
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
                    hasButtonAnimation ? "bg-green-500" : "bg-gray-300"
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
              <div className="space-y-4 p-4 bg-white border border-gray-200 rounded-lg">
                <h5 className="text-sm font-medium text-gray-700">
                  تنظیمات انیمیشن دکمه
                </h5>

                {/* Trigger & Animation Type */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      تریگر
                    </label>
                    <select
                      value={currentButtonAnimation.type}
                      onChange={(e) =>
                        handleButtonAnimationChange("type", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500"
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
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500"
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
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500"
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
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500"
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
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500"
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
              <div className="text-center py-6 text-gray-500 bg-white rounded-lg border-2 border-dashed border-gray-300">
                <HiSparkles className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                <p className="text-xs">انیمیشن دکمه غیرفعال است</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Spacing Settings */}
      {isSpacingOpen && (
        <div className="p-4 animate-slideDown">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
              تنظیمات فاصله‌گذاری
            </h3>
            <MarginPaddingEditor
              margin={margin}
              padding={padding}
              onChange={handleUpdate}
            />
          </div>
        </div>
      )}

      {/* Image Selector Modal */}
      <ImageSelectorModal
        isOpen={isImageSelectorOpen}
        onClose={() => setIsImageSelectorOpen(false)}
        onSelectImage={handleImageSelect}
      />
    </div>
  );
};
