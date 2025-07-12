import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, RichTextSection, AnimationEffect } from "@/lib/types";
import MarginPaddingEditor from "../sections/editor";
import { useSharedContext } from "@/app/contexts/SharedContext";
import React from "react";
import { TabButtons } from "../tabButtons";
import { animationService } from "@/services/animationService";
import { AnimationPreview } from "../animationPreview";

interface RichTextFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<RichTextSection>>;
  userInputData: RichTextSection;
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
        value={value}
        onChange={onChange}
        className="border p-0.5 rounded-full"
      />
    </div>
  </>
);

export const RichText: React.FC<RichTextFormProps> = ({
  setUserInputData,
  userInputData,
  layout,
  selectedComponent,
}) => {
  const { activeRoutes } = useSharedContext();
  const [useRouteSelectBtn, setUseRouteSelectBtn] = useState(false);
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
      setUserInputData((prev: RichTextSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          marginTop: updatedValues.top.toString(),
          marginBottom: updatedValues.bottom.toString(),
        },
      }));
    } else {
      setPadding(updatedValues);
      setUserInputData((prev: RichTextSection) => ({
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
    setUserInputData((prev: RichTextSection) => ({
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
    setUserInputData((prev: RichTextSection) => ({
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

  // Animation handlers for button
  const handleAnimationToggle = (enabled: boolean) => {
    if (enabled) {
      const defaultConfig = animationService.getDefaultConfig('pulse');
      const defaultEffect: AnimationEffect = {
        type: 'hover',
        animation: defaultConfig
      };
      
      setUserInputData((prev) => ({
        ...prev,
        blocks: {
          ...prev.blocks,
          setting: {
            ...prev.blocks.setting,
            btnAnimation: defaultEffect
          }
        }
      }));
    } else {
      setUserInputData((prev) => ({
        ...prev,
        blocks: {
          ...prev.blocks,
          setting: {
            ...prev.blocks.setting,
            btnAnimation: undefined
          }
        }
      }));
    }
  };

  const handleAnimationChange = (field: string, value: string | number) => {
    setUserInputData((prev) => {
      const currentAnimation = prev.blocks.setting.btnAnimation;
      if (!currentAnimation) return prev;

      const updatedAnimation = { ...currentAnimation };

      if (field === 'type') {
        updatedAnimation.type = value as 'hover' | 'click';
      } else if (field.startsWith('animation.')) {
        const animationField = field.split('.')[1];
        let processedValue = value;
        
        // Process duration and delay to ensure proper format
        if (animationField === 'duration' || animationField === 'delay') {
          const numValue = typeof value === 'string' ? parseFloat(value) : value;
          processedValue = `${numValue}s`;
        }
        
        // Validate the animation config
        const newAnimationConfig = {
          ...updatedAnimation.animation,
          [animationField]: processedValue
        };
        
        if (animationService.validateConfig(newAnimationConfig)) {
          updatedAnimation.animation = newAnimationConfig;
        } else {
          // If validation fails, revert to default
          updatedAnimation.animation = animationService.getDefaultConfig(updatedAnimation.animation.type);
        }
      }

      return {
        ...prev,
        blocks: {
          ...prev.blocks,
          setting: {
            ...prev.blocks.setting,
            btnAnimation: updatedAnimation
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
  const currentAnimation = userInputData?.blocks?.setting?.btnAnimation;
  const hasAnimation = !!currentAnimation;

  return (
    <div className="p-3 max-w-4xl space-y-2 rounded" dir="rtl">
      <h2 className="text-xl font-bold mb-4">تنظیمات باکس متن</h2>
      {/* Content Section */}

      {/* Tabs */}
      <TabButtons onTabChange={handleTabChange} />

      {/* Dropdown Content */}
      {isContentOpen && (
        <div className="p-4 border-t border-gray-100 space-y-4 animate-slideDown">
          <div className="p-3  rounded-lg">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              سربرگ
            </label>
            <input
              type="text"
              name="textHeading"
              value={userInputData?.blocks?.textHeading ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="p-3  rounded-lg">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              توضیحات
            </label>
            <textarea
              name="description"
              value={userInputData?.blocks?.description ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              rows={3}
            />
          </div>

          <div className="p-3  rounded-lg">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              متن دکمه
            </label>
            <input
              type="text"
              name="btnText"
              value={userInputData?.blocks?.btnText ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="p-3  rounded-lg">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              لینک دکمه
            </label>
            <div className="mb-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={useRouteSelectBtn}
                  onChange={(e) => setUseRouteSelectBtn(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">انتخاب از مسیرهای موجود</span>
              </label>
            </div>
            {useRouteSelectBtn ? (
              <select
                value={userInputData?.blocks?.btnLink ?? ""}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setUserInputData((prev) => ({
                    ...prev,
                    blocks: {
                      ...prev.blocks,
                      btnLink: e.target.value,
                    },
                  }));
                }}
                name="btnLink"
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="">انتخاب مسیر</option>
                {activeRoutes.map((route: string) => (
                  <option key={route} value={route}>
                    {route}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                name="btnLink"
                value={userInputData?.blocks?.btnLink ?? ""}
                onChange={handleBlockChange}
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="آدرس لینک یا مسیر سفارشی"
              />
            )}
          </div>
        </div>
      )}

      {/* Style Settings */}
      {isStyleSettingsOpen && (
        <div className="p-4 border-t border-gray-100 animate-slideDown">
          <div className="grid md:grid-cols-1 gap-4">
            <div className="p-3 -gray-100 rounded-lg flex flex-col gap-3">
              <h4 className="font-bold text-sky-700">تنظیمات سربرگ</h4>
              {/* Header Settings */}

              <label className="block mb-2 text-sm font-bold text-gray-700">
                سایز سربرگ
              </label>
              <input
                type="range"
                name="textHeadingFontSize"
                value={
                  userInputData?.blocks?.setting?.textHeadingFontSize?.toString() ??
                  "0"
                }
                onChange={handleBlockSettingChange}
                className="w-full"
              />
              <span className="text-sm">
                {userInputData?.blocks?.setting?.textHeadingFontSize}px
              </span>

              <label className="block mb-2 text-sm font-bold text-gray-700">
                وزن سربرگ
              </label>
              <select
                name="textHeadingFontWeight"
                value={
                  userInputData?.blocks?.setting?.textHeadingFontWeight?.toString() ??
                  "0"
                }
                onChange={handleBlockSettingChange}
                className="w-full p-2 border border-gray-200 rounded-lg"
              >
                <option value="bold">ضخیم</option>
                <option value="normal">نرمال</option>
              </select>

              <ColorInput
                label="رنگ سربرگ"
                name="textHeadingColor"
                value={
                  userInputData?.blocks?.setting?.textHeadingColor?.toString() ??
                  "#000000"
                }
                onChange={handleBlockSettingChange}
              />
            </div>
            {/* Description Settings */}{" "}
            <div className="p-3 -gray-100 rounded-lg flex flex-col gap-3">
              <h4 className="font-bold text-sky-700">تنظیمات توضیحات</h4>

              <label className="block mb-2 text-sm font-bold text-gray-700">
                سایز توضیحات
              </label>
              <input
                type="range"
                name="descriptionFontSize"
                value={
                  userInputData?.blocks?.setting?.descriptionFontSize?.toString() ??
                  "0"
                }
                onChange={handleBlockSettingChange}
                className="w-full"
              />
              <span className="text-sm">
                {userInputData?.blocks?.setting?.descriptionFontSize}px
              </span>

              <label className="block mb-2 text-sm font-bold text-gray-700">
                وزن توضیحات
              </label>
              <select
                name="descriptionFontWeight"
                value={
                  userInputData?.blocks?.setting?.descriptionFontWeight?.toString() ??
                  "0"
                }
                onChange={handleBlockSettingChange}
                className="w-full p-2 border border-gray-200 rounded-lg"
              >
                <option value="bold">ضخیم</option>
                <option value="normal">نرمال</option>
              </select>
              <ColorInput
                label="رنگ توضیحات"
                name="descriptionColor"
                value={
                  userInputData?.blocks?.setting?.descriptionColor?.toString() ??
                  "#000000"
                }
                onChange={handleBlockSettingChange}
              />
            </div>
            {/* Background and Button Colors */}
            <div className="p-3 -gray-100 rounded-lg flex flex-col gap-3">
              <h4 className="font-bold text-sky-700">تنظیمات رنگ ها</h4>
              <ColorInput
                label="رنگ پس زمینه"
                name="background"
                value={
                  userInputData?.blocks?.setting?.background?.toString() ??
                  "#000000"
                }
                onChange={handleBlockSettingChange}
              />

              <ColorInput
                label="رنگ متن دکمه"
                name="btnTextColor"
                value={
                  userInputData?.blocks?.setting?.btnTextColor?.toString() ??
                  "#ffffff"
                }
                onChange={handleBlockSettingChange}
              />

              <ColorInput
                label="رنگ پس زمینه دکمه"
                name="btnBackgroundColor"
                value={
                  userInputData?.blocks?.setting?.btnBackgroundColor?.toString() ??
                  "#000000"
                }
                onChange={handleBlockSettingChange}
              />
            </div>
            {/* Line Colors */}
            <div className="p-3 -gray-100 rounded-lg flex flex-col gap-3">
              <h4 className="font-bold text-sky-700"> تنظیمات خط</h4>
              <ColorInput
                label="رنگ خط"
                name="lineColor"
                value={
                  userInputData?.blocks?.setting?.lineColor?.toString() ??
                  "#000000"
                }
                onChange={handleBlockSettingChange}
              />
              <label className="block mb-2 text-sm font-bold text-gray-700">
                عرض خط
              </label>
              <input
                type="range"
                min={0}
                max={2000}
                name="lineWidth"
                value={
                  userInputData?.blocks?.setting?.lineWidth?.toString() ?? "500"
                }
                onChange={handleBlockSettingChange}
                className="w-full"
              />
              <span className="text-sm">
                {userInputData?.blocks?.setting?.lineWidth}px
              </span>
              <label className="block mb-2 text-sm font-bold text-gray-700">
                قطر خط
              </label>
              <input
                type="range"
                min={0}
                max={200}
                name="lineHeight"
                value={
                  userInputData?.blocks?.setting?.lineHeight?.toString() ?? "0"
                }
                onChange={handleBlockSettingChange}
                className="w-full"
              />
              <span className="text-sm">
                {userInputData?.blocks?.setting?.lineHeight}px
              </span>
              <label className="block mb-2 text-sm font-bold text-gray-700">
                فاصله از بالا
              </label>
              <input
                type="range"
                min={-100}
                max={100}
                name="lineTop"
                value={
                  userInputData?.blocks?.setting?.lineTop?.toString() ?? "0"
                }
                onChange={handleBlockSettingChange}
                className="w-full"
              />
              <span className="text-sm">
                {userInputData?.blocks?.setting?.lineTop}px
              </span>
              <label className="block mb-2 text-sm font-bold text-gray-700">
                فاصله از پایین
              </label>
              <input
                type="range"
                min={-100}
                max={100}
                name="lineBottom"
                value={
                  userInputData?.blocks?.setting?.lineBottom?.toString() ?? "0"
                }
                onChange={handleBlockSettingChange}
                className="w-full"
              />
              <span className="text-sm">
                {userInputData?.blocks?.setting?.lineBottom}px
              </span>
            </div>

            {/* Button Animation Settings */}
            <div className="rounded-lg flex flex-col gap-3 border-t pt-4 mt-6">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-sky-700">انیمیشن دکمه</h4>
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
                <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <h5 className="font-medium text-gray-700">تنظیمات انیمیشن دکمه</h5>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Effect Type */}
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        نوع تریگر
                      </label>
                      <select
                        value={currentAnimation.type}
                        onChange={(e) => handleAnimationChange('type', e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="hover">هاور (Hover)</option>
                        <option value="click">کلیک (Click)</option>
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
                        {animationService.getAnimationTypes().map(type => (
                          <option key={type} value={type}>
                            {type === 'pulse' && 'پالس'}
                            {type === 'glow' && 'درخشش'}
                            {type === 'brightness' && 'روشنایی'}
                            {type === 'blur' && 'تاری'}
                            {type === 'saturate' && 'اشباع رنگ'}
                            {type === 'contrast' && 'کنتراست'}
                            {type === 'opacity' && 'شفافیت'}
                            {type === 'shadow' && 'سایه'}
                          </option>
                        ))}
                      </select>
                      <div className="text-xs text-gray-500 mt-1">
                        {animationService.getAnimationPreview(currentAnimation.animation.type)}
                      </div>
                    </div>

                    {/* Duration */}
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
                        فعلی: {currentAnimation.animation.duration}
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
                        <option value="ease">ease - طبیعی</option>
                        <option value="ease-in">ease-in - شروع آهسته</option>
                        <option value="ease-out">ease-out - پایان آهسته</option>
                        <option value="ease-in-out">ease-in-out - شروع و پایان آهسته</option>
                        <option value="linear">linear - خطی</option>
                        <option value="cubic-bezier(0, 0, 0.2, 1)">cubic-bezier - سفارشی</option>
                      </select>
                    </div>

                    {/* Delay */}
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
                        فعلی: {currentAnimation.animation?.delay || '0s'}
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
                        <option value="1">1 بار</option>
                        <option value="2">2 بار</option>
                        <option value="3">3 بار</option>
                        <option value="5">5 بار</option>
                        <option value="infinite">بی‌نهایت</option>
                      </select>
                    </div>
                  </div>

                  {/* Animation Preview */}
                  <div className="mt-4">
                    <AnimationPreview effects={[currentAnimation]} />
                  </div>

                  {/* Animation Info */}
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <h6 className="font-medium text-blue-800 mb-2">اطلاعات انیمیشن</h6>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div>
                        <strong>CSS تولید شده:</strong>
                        <code className="block mt-1 p-2 bg-white rounded text-xs overflow-x-auto">
                          {animationService.generateCSS(currentAnimation.animation)}
                        </code>
                      </div>
                      <div className="mt-2">
                        <strong>وضعیت اعتبار:</strong>
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${
                          animationService.validateConfig(currentAnimation.animation)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {animationService.validateConfig(currentAnimation.animation) ? 'معتبر' : 'نامعتبر'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!hasAnimation && (
                <div className="text-center text-gray-500 py-8 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="mb-2">⚡</div>
                  <div>انیمیشن دکمه غیرفعال است</div>
                  <div className="text-sm mt-1">برای فعال کردن چک‌باکس بالا را انتخاب کنید</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spacing Settings */}
      {isSpacingOpen && (
        <div className="p-4  animate-slideDown">
          <div className=" rounded-lg p-2 flex items-center justify-center">
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
