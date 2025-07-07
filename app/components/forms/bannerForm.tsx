import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, BannerSection, AnimationEffect } from "@/lib/types";
import React from "react";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";
import { effectService } from "@/services/effectService";
import { AnimationPreview } from "../animationPreview";

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

export const BannerForm: React.FC<BannerFormProps> = ({
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

  const handleUpdate = (
    type: "margin" | "padding",
    updatedValues: BoxValues
  ) => {
    if (type === "margin") {
      setMargin(updatedValues);
      setUserInputData((prev: BannerSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
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
        ...prev.blocks,
        [name]: value,
      },
    }));
  };

  const [isUpdating, setIsUpdating] = useState(false);

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

  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev: BannerSection) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value,
      },
    }));
  };

  // Single Animation handlers
  const handleAnimationToggle = (enabled: boolean) => {
    if (enabled) {
      const defaultEffect = effectService.getDefaultEffectConfig('hover', 'pulse');
      setUserInputData((prev: BannerSection) => ({
        ...prev,
        blocks: {
          ...prev.blocks,
          setting: {
            ...prev.blocks.setting,
            animation: defaultEffect as AnimationEffect
          }
        }
      }));
    } else {
      setUserInputData((prev: BannerSection) => ({
        ...prev,
        blocks: {
          ...prev.blocks,
          setting: {
            ...prev.blocks.setting,
            animation: undefined
          }
        }
      }));
    }
  };

  const handleAnimationChange = (field: string, value: string | number) => {
    setUserInputData((prev: BannerSection) => {
      const currentAnimation = prev.blocks.setting.animation;
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
        blocks: {
          ...prev.blocks,
          setting: {
            ...prev.blocks.setting,
            animation: updatedAnimation
          }
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
                {/* Existing style settings... */}
                <div className="rounded-lg flex flex-col gap-3">
                  <h4 className="font-semibold text-sky-700 my-4">
                    تنظیمات سربرگ
                  </h4>
                  <ColorInput
                    label="رنگ سربرگ"
                    name="textColor"
                    value={
                      userInputData?.blocks?.setting?.textColor?.toString() ??
                      "#333333"
                    }
                    onChange={handleBlockSettingChange}
                  />
                  <label>سایز سربرگ</label>
                  <input
                    type="range"
                    className="w-full"
                    name="textFontSize"
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
                  <ColorInput
                    label="رنگ توضیحات"
                    name="descriptionColor"
                    value={
                      userInputData?.blocks?.setting?.descriptionColor?.toString() ??
                      "#333333"
                    }
                    onChange={handleBlockSettingChange}
                  />
                  <label>سایز توضیحات</label>
                  <input
                    type="range"
                    className="w-full"
                    name="descriptionFontSize"
                    value={
                      userInputData?.blocks?.setting?.descriptionFontSize?.toString() ??
                      "18"
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
                  <select
                    name="opacityImage"
                    value={
                      userInputData?.blocks?.setting?.opacityImage?.toString() ??
                      "1"
                    }
                    onChange={handleBlockSettingChange}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    {Array.from({ length: 11 }, (_, i) => i / 10).map(
                      (value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      )
                    )}
                  </select>
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
                </div>

                {/* Box Settings */}
                <div className="rounded-lg flex flex-col gap-3">
                  <h4 className="font-semibold text-sky-700 my-4">
                    تنظیمات کادر
                  </h4>
                  <label className="block mb-2 text-base font-medium text-gray-800">
                    شفافیت کادر
                  </label>
                  <select
                    name="opacityTextBox"
                    value={
                      userInputData?.blocks?.setting?.opacityTextBox?.toString() ??
                      "1"
                    }
                    onChange={handleBlockSettingChange}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    {Array.from({ length: 11 }, (_, i) => i / 10).map(
                      (value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      )
                    )}
                  </select>

                  <ColorInput
                    label="رنگ پس زمینه کادر"
                    name="backgroundColorBox"
                    value={
                      userInputData?.blocks?.setting?.backgroundColorBox?.toString() ??
                      "#333333"
                    }
                    onChange={handleBlockSettingChange}
                  />

                  <label>انحنای زاویه کادر</label>
                  <input
                    className="w-full"
                    type="range"
                    name="backgroundBoxRadious"
                    value={
                      userInputData?.blocks?.setting?.backgroundBoxRadious?.toString() ??
                      "18"
                    }
                    onChange={handleBlockSettingChange}
                  />
                  <div className="text-gray-500 text-sm">
                    {userInputData?.blocks?.setting?.backgroundBoxRadious?.toString() ??
                      "18"}
                    px
                  </div>
                </div>

                {/* Single Animation Settings - In Style Tab */}
                <div className="rounded-lg flex flex-col gap-3 border-t pt-4 mt-6">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-sky-700">تنظیمات انیمیشن</h4>
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
            </div>
          </div>
        </>
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
