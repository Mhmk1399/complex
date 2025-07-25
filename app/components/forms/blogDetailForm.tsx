import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, BlogDetailSection, AnimationEffect } from "@/lib/types";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";
import { AnimationPreview } from "../animationPreview";
import { HiSparkles, HiChevronDown } from "react-icons/hi";
interface BlogDetailFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<BlogDetailSection>>;
  userInputData: BlogDetailSection;
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

export const BlogDetailForm: React.FC<BlogDetailFormProps> = ({
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
      setUserInputData((prev: BlogDetailSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          marginTop: updatedValues.top.toString(),
          marginBottom: updatedValues.bottom.toString(),
        },
      }));
    } else {
      setPadding(updatedValues);
      setUserInputData((prev: BlogDetailSection) => ({
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
    if (initialData) {
      setUserInputData(initialData);
    }
  }, [selectedComponent]);

  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (isUpdating) return;
    setIsUpdating(true);
    const { name, value } = e.target;
    setUserInputData((prev) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value,
      },
    }));
    setTimeout(() => setIsUpdating(false), 100);
  };

  // Animation handlers - same as banner form
  const handleAnimationToggle = (enabled: boolean) => {
    if (enabled) {
      const defaultEffect: AnimationEffect = {
        type: "hover",
        animation: {
          type: "pulse",
          duration: "1s",
          timing: "ease-in-out",
          delay: "0s",
          iterationCount: "1",
        },
      };

      setUserInputData((prev: BlogDetailSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          animation: defaultEffect,
        },
      }));
    } else {
      setUserInputData((prev: BlogDetailSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          animation: undefined,
        },
      }));
    }
  };

  const handleAnimationChange = (field: string, value: string | number) => {
    setUserInputData((prev: BlogDetailSection) => {
      const currentAnimation = prev.setting.animation;
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

        updatedAnimation.animation = {
          ...updatedAnimation.animation,
          [animationField]: processedValue,
        };
      }

      return {
        ...prev,
        setting: {
          ...prev.setting,
          animation: updatedAnimation,
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
  const currentAnimation = userInputData?.setting?.animation;
  const hasAnimation = !!currentAnimation;

  // Animation types - same as banner
  const animationTypes = ["pulse", "ping", "bgOpacity", "scaleup", "scaledown"];
  const effectTypes = ["hover", "click"];

  return (
    <div className="p-3 max-w-4xl space-y-2 rounded" dir="rtl">
      <h2 className="text-lg font-bold mb-4">تنظیمات جزئیات بلاگ</h2>

      {/* Tabs */}
      <TabButtons onTabChange={handleTabChange} />

      {/* Content Settings */}
      {isContentOpen && (
        <div className="p-4 space-y-4 animate-slideDown">
          <div className="rounded-lg">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              آپلود تصویر کاور
            </label>
            <input
              type="text"
              name="coverImage"
              value={userInputData?.setting?.coverImage || ""}
              onChange={handleSettingChange}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="لینک تصویر کاور"
            />
          </div>
        </div>
      )}

      {/* Style Settings */}
      {isStyleSettingsOpen && (
        <div className="p-4 animate-slideDown">
          <div className="grid grid-cols-1 gap-4 rounded-lg mb-4">
            <h3 className="font-semibold text-sky-700 py-4">تنظیمات عنوان</h3>
            <div className="rounded-lg flex items-center justify-between ">
              <ColorInput
                label="رنگ عنوان"
                name="titleColor"
                value={userInputData?.setting?.titleColor || "#1A1A1A"}
                onChange={handleSettingChange}
              />
            </div>
            <div>
              <label className="block mb-1">اندازه فونت عنوان</label>
              <input
                type="range"
                min="10"
                max="100"
                name="titleFontSize"
                value={userInputData?.setting?.titleFontSize || "36"}
                onChange={handleSettingChange}
                className="w-full p-1 border rounded"
              />
              <div className="text-sm text-gray-500">
                {userInputData?.setting?.titleFontSize}px
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-4 rounded-lg">
            <h3 className="font-semibold text-sky-700 py-4 mb-3">
              تنظیمات محتوا
            </h3>
            <div className="rounded-lg flex items-center justify-between ">
              <ColorInput
                label="رنگ متن محتوا"
                name="contentColor"
                value={userInputData?.setting?.contentColor || "#2C2C2C"}
                onChange={handleSettingChange}
              />
            </div>
            <div>
              <label className="block mb-1">اندازه فونت محتوا</label>
              <input
                type="range"
                min="14"
                max="100"
                name="contentFontSize"
                value={userInputData?.setting?.contentFontSize || "18"}
                onChange={handleSettingChange}
                className="w-full p-1 border rounded"
              />
              <div className="text-sm text-gray-500">
                {userInputData?.setting?.contentFontSize}px
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 rounded-lg">
            <h3 className="font-semibold text-sky-700 py-4 mb-3">
              تنظیمات تصویر
            </h3>
            <div>
              <label className="block mb-1">ارتفاع تصویر کاور</label>
              <input
                type="range"
                min="200"
                max="1000"
                name="coverImageHeight"
                value={userInputData?.setting?.coverImageHeight || "400"}
                onChange={handleSettingChange}
                className="w-full p-1 border rounded"
              />
              <div className="text-sm text-gray-500">
                {userInputData?.setting?.coverImageHeight}px
              </div>
            </div>
            <div>
              <label className="block mb-1">عرض تصویر کاور</label>
              <input
                type="range"
                min="200"
                max="1800"
                name="coverImageWidth"
                value={userInputData?.setting?.coverImageWidth || "400"}
                onChange={handleSettingChange}
                className="w-full p-1 border rounded"
              />
              <div className="text-sm text-gray-500">
                {userInputData?.setting?.coverImageWidth}px
              </div>
            </div>
            <div>
              <label className="block mb-1">گردی گوشه‌های تصویر</label>
              <input
                type="range"
                min="0"
                max="100"
                name="imageRadius"
                value={userInputData?.setting?.imageRadius || "10"}
                onChange={handleSettingChange}
                className="w-full p-1 border rounded"
              />
              <div className="text-sm text-gray-500">
                {userInputData?.setting?.imageRadius}px
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-4 rounded-lg">
            <h3 className="font-semibold text-sky-700 py-4 mb-3">
              تنظیمات اطلاعات نویسنده و تاریخ
            </h3>
            <div className="rounded-lg flex items-center justify-between ">
              <ColorInput
                label="رنگ متن"
                name="metaColor"
                value={userInputData?.setting?.metaColor || "#666666"}
                onChange={handleSettingChange}
              />
            </div>
            <div>
              <label className="block mb-1">اندازه فونت</label>
              <input
                type="range"
                min="10"
                max="100"
                name="metaFontSize"
                value={userInputData?.setting?.metaFontSize || "14"}
                onChange={handleSettingChange}
                className="w-full p-1 border rounded"
              />
              <div className="text-sm text-gray-500">
                {userInputData?.setting?.metaFontSize}px
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-4 rounded-lg">
            <h3 className="font-semibold text-sky-700 py-4 mb-3">
              تنظیمات پس‌زمینه
            </h3>
            <div className="rounded-lg flex items-center justify-between ">
              <ColorInput
                label="رنگ پس‌زمینه"
                name="backgroundColor"
                value={userInputData?.setting?.backgroundColor || "#ffffff"}
                onChange={handleSettingChange}
              />
            </div>
          </div>
        </div>
      )}

      {/* Animation */}
      {isAnimationOpen && (
        <div className="rounded-lg flex flex-col gap-3 border-t pt-4 mt-6">
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
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {effectTypes.map((type) => (
                      <option key={type} value={type}>
                        {type === "hover" ? "هاور" : "کلیک"}
                      </option>
                    ))}
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
                    {animationTypes.map((type) => (
                      <option key={type} value={type}>
                        {type === "pulse" && "پالس"}
                        {type === "ping" && "پینگ"}
                        {type === "bgOpacity" && "شفافیت پس‌زمینه"}
                        {type === "scaleup" && "بزرگ‌نمایی"}
                        {type === "scaledown" && "کوچک‌نمایی"}
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
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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

      {/* Spacing Settings */}
      {isSpacingOpen && (
        <div className="p-4  animate-slideDown">
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
