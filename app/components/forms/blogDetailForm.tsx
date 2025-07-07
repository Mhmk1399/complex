import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, BlogDetailSection, AnimationEffect } from "@/lib/types";
import React from "react";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";
import { effectService } from "@/services/effectService";
import { AnimationPreview } from "../animationPreview";

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
    <label className="block mb-1" htmlFor={name}>
      {label}
    </label>

    <div className="flex flex-col gap-3 items-center">
      <input
        type="color"
        id={name}
        name={name}
        value={value || "#000000"}
        onChange={onChange}
        className="border p-0.5 rounded-full"
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
  const [margin, setMargin] = React.useState<BoxValues>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });
  const [padding, setPadding] = React.useState<BoxValues>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });
  const [isStyleSettingsOpen, setIsStyleSettingsOpen] = useState(false);
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [isSpacingOpen, setIsSpacingOpen] = useState(false);
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

  // Animation handlers
  const handleAnimationToggle = (enabled: boolean) => {
    if (enabled) {
      const defaultEffect = effectService.getDefaultEffectConfig('hover', 'pulse');
      setUserInputData((prev: BlogDetailSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          animation: defaultEffect as AnimationEffect
        }
      }));
    } else {
      setUserInputData((prev: BlogDetailSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          animation: undefined
        }
      }));
    }
  };

  const handleAnimationChange = (field: string, value: string | number) => {
    setUserInputData((prev: BlogDetailSection) => {
      const currentAnimation = prev.setting.animation;
      if (!currentAnimation) return prev;

      let updatedAnimation = { ...currentAnimation };

      if (field === 'type') {
        updatedAnimation.type = value as 'hover' | 'click';
      } else if (field.startsWith('animation.')) {
        const animationField = field.split('.')[1];
        updatedAnimation.animation = {
          ...updatedAnimation.animation,
          [animationField]: animationField === 'duration' || animationField === 'delay' 
            ? `${value}s` 
            : value
        };
      }

      return {
        ...prev,
        setting: {
          ...prev.setting,
          animation: updatedAnimation
        }
      };
    });
  };

  const handleTabChange = (tab: "content" | "style" | "spacing") => {
    setIsContentOpen(tab === "content");
    setIsStyleSettingsOpen(tab === "style");
    setIsSpacingOpen(tab === "spacing");
  };

  useEffect(() => {
    setIsContentOpen(true);
  }, []);

  // Get current animation values for inputs
  const currentAnimation = userInputData?.setting?.animation;
  const hasAnimation = !!currentAnimation;

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
            <div>
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
            <div>
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
            <div>
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
            <div>
              <ColorInput
                label="رنگ پس‌زمینه"
                name="backgroundColor"
                value={userInputData?.setting?.backgroundColor || "#ffffff"}
                onChange={handleSettingChange}
              />
            </div>
          </div>

          {/* Animation Settings */}
          <div className="rounded-lg flex flex-col gap-3 border-t pt-4 mt-6">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-sky-700">تنظیمات انیمیشن تصویر</h4>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={hasAnimation}
                  onChange={(e) => handleAnimationToggle(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">فعال کردن انیمیشن</span>
              </label>
            </div>

            {hasAnimation && currentAnimation && (
              <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                <h5 className="font-medium text-gray-700">تنظیمات انیمیشن</h5>

                <div className="grid grid-cols-2 gap-4">
                  {/* Effect Type */}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      نوع افکت
                    </label>
                    <select
                      value={currentAnimation.type}
                      onChange={(e) => handleAnimationChange('type', e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {effectService.getEffectTypes().map(type => (
                        <option key={type} value={type}>
                          {type === 'hover' ? 'هاور' : 'کلیک'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Animation Type */}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      نوع انیمیشن
                    </label>
                    <select
                      value={currentAnimation.animation.type}
                      onChange={(e) => handleAnimationChange('animation.type', e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {effectService.getAnimationTypes().map(type => (
                        <option key={type} value={type}>
                          {type === 'pulse' && 'پالس'}
                          {type === 'ping' && 'پینگ'}
                          {type === 'bgOpacity' && 'شفافیت پس‌زمینه'}
                          {type === 'scaleup' && 'بزرگ‌نمایی'}
                          {type === 'scaledown' && 'کوچک‌نمایی'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Duration - Number Input */}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      مدت زمان (ثانیه)
                    </label>
                    <input
                      type="number"
                      min="0.1"
                      max="10"
                      step="0.1"
                      value={parseFloat(currentAnimation.animation.duration.replace('s', '')) || 1}
                      onChange={(e) => handleAnimationChange('animation.duration', e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="text-gray-500 text-xs mt-1">
                      نمایش: {currentAnimation.animation.duration}
                    </div>
                  </div>

                  {/* Timing Function */}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      تابع زمان‌بندی
                    </label>
                    <select
                      value={currentAnimation.animation.timing}
                      onChange={(e) => handleAnimationChange('animation.timing', e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="ease">ease</option>
                      <option value="ease-in">ease-in</option>
                      <option value="ease-out">ease-out</option>
                      <option value="ease-in-out">ease-in-out</option>
                      <option value="linear">linear</option>
                      <option value="cubic-bezier(0, 0, 0.2, 1)">cubic-bezier</option>
                    </select>
                  </div>

                  {/* Delay - Number Input */}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      تاخیر (ثانیه)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={parseFloat((currentAnimation.animation.delay || '0s').replace('s', '')) || 0}
                      onChange={(e) => handleAnimationChange('animation.delay', e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="text-gray-500 text-xs mt-1">
                      نمایش: {currentAnimation.animation?.delay || '0s'}
                    </div>
                  </div>

                  {/* Iteration Count */}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      تعداد تکرار
                    </label>
                    <select
                      value={currentAnimation.animation.iterationCount || '1'}
                      onChange={(e) => handleAnimationChange('animation.iterationCount', e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="infinite">بی‌نهایت</option>
                    </select>
                  </div>
                </div>

                {/* Animation Preview */}
                <AnimationPreview effects={[currentAnimation]} />
              </div>
            )}

            {!hasAnimation && (
              <div className="text-center text-gray-500 py-8 border border-gray-200 rounded-lg">
                انیمیشن غیرفعال است. برای فعال کردن چک‌باکس بالا را انتخاب کنید.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Spacing Settings */}
      {isSpacingOpen && (
        <div className="p-4 border-t border-gray-100 animate-slideDown">
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
