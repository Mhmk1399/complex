import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, ImageTextSection, AnimationEffect } from "@/lib/types";
import React from "react";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";
import ImageSelectorModal from "../sections/ImageSelectorModal";
import { animationService } from "@/services/animationService";
import { AnimationPreview } from "../animationPreview";

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
            imageAnimation: defaultEffect
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
            imageAnimation: undefined
          }
        }
      }));
    }
  };

  const handleImageAnimationChange = (field: string, value: string | number) => {
    setUserInputData((prev) => {
      const currentAnimation = prev.blocks.setting.imageAnimation;
      if (!currentAnimation) return prev;

      let updatedAnimation = { ...currentAnimation };

      if (field === 'type') {
        updatedAnimation.type = value as 'hover' | 'click';
      } else if (field.startsWith('animation.')) {
        const animationField = field.split('.')[1];
        let processedValue = value;
        
        if (animationField === 'duration' || animationField === 'delay') {
          const numValue = typeof value === 'string' ? parseFloat(value) : value;
          processedValue = `${numValue}s`;
        }
        
        const newAnimationConfig = {
          ...updatedAnimation.animation,
          [animationField]: processedValue
        };
        
        if (animationService.validateConfig(newAnimationConfig)) {
          updatedAnimation.animation = newAnimationConfig;
        } else {
          updatedAnimation.animation = animationService.getDefaultConfig(updatedAnimation.animation.type);
        }
      }

      return {
        ...prev,
        blocks: {
          ...prev.blocks,
          setting: {
            ...prev.blocks.setting,
            imageAnimation: updatedAnimation
          }
        }
      };
    });
  };

  // Button Animation handlers
  const handleButtonAnimationToggle = (enabled: boolean) => {
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
            buttonAnimation: defaultEffect
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
            buttonAnimation: undefined
          }
        }
      }));
    }
  };

  const handleButtonAnimationChange = (field: string, value: string | number) => {
    setUserInputData((prev) => {
      const currentAnimation = prev.blocks.setting.buttonAnimation;
      if (!currentAnimation) return prev;

      let updatedAnimation = { ...currentAnimation };

      if (field === 'type') {
        updatedAnimation.type = value as 'hover' | 'click';
      } else if (field.startsWith('animation.')) {
        const animationField = field.split('.')[1];
        let processedValue = value;
        
        if (animationField === 'duration' || animationField === 'delay') {
          const numValue = typeof value === 'string' ? parseFloat(value) : value;
          processedValue = `${numValue}s`;
        }
        
        const newAnimationConfig = {
          ...updatedAnimation.animation,
          [animationField]: processedValue
        };
        
        if (animationService.validateConfig(newAnimationConfig)) {
          updatedAnimation.animation = newAnimationConfig;
        } else {
          updatedAnimation.animation = animationService.getDefaultConfig(updatedAnimation.animation.type);
        }
      }

      return {
        ...prev,
        blocks: {
          ...prev.blocks,
          setting: {
            ...prev.blocks.setting,
            buttonAnimation: updatedAnimation
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

  const handleImageSelect = (image: ImageFile) => {
    handleContentChange("imageSrc", image.fileUrl);
    setIsImageSelectorOpen(false);
  };

  // Get current animation values
  const currentImageAnimation = userInputData?.blocks?.setting?.imageAnimation;
  const hasImageAnimation = !!currentImageAnimation;
  const currentButtonAnimation = userInputData?.blocks?.setting?.buttonAnimation;
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
                onChange={(e) => handleContentChange("description", e.target.value)}
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
        <div className="p-4 animate-slideDown">
          <div className="grid gap-4">
            {/* Text Styling */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700">تنظیمات متن</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <ColorInput
                  label="رنگ عنوان"
                  name="headingColor"
                  value={userInputData?.blocks?.setting?.headingColor}
                  onChange={handleSettingChange}
                />
                
                <div>
                  <label className="block mb-1">سایز عنوان</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    name="headingFontSize"
                    value={userInputData?.blocks?.setting?.headingFontSize || "30"}
                    onChange={handleSettingChange}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600">
                    {userInputData?.blocks?.setting?.headingFontSize || "30"}px
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <ColorInput
                  label="رنگ توضیحات"
                  name="descriptionColor"
                  value={userInputData?.blocks?.setting?.descriptionColor}
                  onChange={handleSettingChange}
                />
                
                <div>
                  <label className="block mb-1">سایز توضیحات</label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    name="descriptionFontSize"
                    value={userInputData?.blocks?.setting?.descriptionFontSize || "24"}
                    onChange={handleSettingChange}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600">
                    {userInputData?.blocks?.setting?.descriptionFontSize || "24"}px
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

            {/* Image Animation Settings */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-sky-700">انیمیشن تصویر</h4>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={hasImageAnimation}
                    onChange={(e) => handleImageAnimationToggle(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">فعال کردن انیمیشن</span>
                </label>
              </div>

              {hasImageAnimation && currentImageAnimation && (
                <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <h5 className="font-medium text-gray-700">تنظیمات انیمیشن تصویر</h5>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Effect Type */}
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        نوع تریگر
                      </label>
                      <select
                        value={currentImageAnimation.type}
                        onChange={(e) => handleImageAnimationChange('type', e.target.value)}
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
                        value={currentImageAnimation.animation.type}
                        onChange={(e) => handleImageAnimationChange('animation.type', e.target.value)}
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
                        {animationService.getAnimationPreview(currentImageAnimation.animation.type)}
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
                        value={parseFloat(currentImageAnimation.animation.duration.replace('s', '')) || 1}
                        onChange={(e) => handleImageAnimationChange('animation.duration', e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Timing Function */}
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        تابع زمان‌بندی
                      </label>
                      <select
                        value={currentImageAnimation.animation.timing}
                        onChange={(e) => handleImageAnimationChange('animation.timing', e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="ease">ease - طبیعی</option>
                        <option value="ease-in">ease-in - شروع آهسته</option>
                        <option value="ease-out">ease-out - پایان آهسته</option>
                        <option value="ease-in-out">ease-in-out - شروع و پایان آهسته</option>
                        <option value="linear">linear - خطی</option>
                      </select>
                    </div>
                  </div>

                  {/* Animation Preview */}
                  <div className="mt-4">
                    <AnimationPreview effects={[currentImageAnimation]} />
                  </div>
                </div>
              )}

              {!hasImageAnimation && (
                <div className="text-center text-gray-500 py-8 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="mb-2">🖼️</div>
                  <div>انیمیشن تصویر غیرفعال است</div>
                </div>
              )}
            </div>

            {/* Button Animation Settings */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-sky-700">انیمیشن دکمه</h4>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={hasButtonAnimation}
                    onChange={(e) => handleButtonAnimationToggle(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">فعال کردن انیمیشن</span>
                </label>
              </div>

              {hasButtonAnimation && currentButtonAnimation && (
                <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <h5 className="font-medium text-gray-700">تنظیمات انیمیشن دکمه</h5>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Effect Type */}
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        نوع تریگر
                      </label>
                      <select
                        value={currentButtonAnimation.type}
                        onChange={(e) => handleButtonAnimationChange('type', e.target.value)}
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
                        value={currentButtonAnimation.animation.type}
                        onChange={(e) => handleButtonAnimationChange('animation.type', e.target.value)}
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
                        {animationService.getAnimationPreview(currentButtonAnimation.animation.type)}
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
                        value={parseFloat(currentButtonAnimation.animation.duration.replace('s', '')) || 1}
                        onChange={(e) => handleButtonAnimationChange('animation.duration', e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Timing Function */}
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        تابع زمان‌بندی
                      </label>
                      <select
                        value={currentButtonAnimation.animation.timing}
                        onChange={(e) => handleButtonAnimationChange('animation.timing', e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="ease">ease - طبیعی</option>
                        <option value="ease-in">ease-in - شروع آهسته</option>
                        <option value="ease-out">ease-out - پایان آهسته</option>
                        <option value="ease-in-out">ease-in-out - شروع و پایان آهسته</option>
                        <option value="linear">linear - خطی</option>
                      </select>
                    </div>
                  </div>

                  {/* Animation Preview */}
                  <div className="mt-4">
                    <AnimationPreview effects={[currentButtonAnimation]} />
                  </div>
                </div>
              )}

              {!hasButtonAnimation && (
                <div className="text-center text-gray-500 py-8 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="mb-2">🔘</div>
                  <div>انیمیشن دکمه غیرفعال است</div>
                </div>
              )}
            </div>
          </div>
        </div>
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
