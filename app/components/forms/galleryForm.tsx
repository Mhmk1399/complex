"use client";
import { useState, useEffect } from "react";
import { Layout, GallerySection, AnimationEffect } from "@/lib/types";
import { Compiler } from "../compiler";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";
import ImageSelectorModal from "../sections/ImageSelectorModal";
import { useSharedContext } from "@/app/contexts/SharedContext";
import { animationService } from "@/services/animationService";
import { AnimationPreview } from "../animationPreview";

interface GalleryFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<GallerySection>>;
  userInputData: GallerySection;
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
        className=" p-0.5 border rounded-md border-gray-200 w-8 h-8 bg-transparent "
      />
    </div>
  </>
);

export const GalleryForm: React.FC<GalleryFormProps> = ({
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
  const [isImagesOpen] = useState(false);
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [useRouteSelect, setUseRouteSelect] = useState<boolean[]>([]);

  const handleUpdate = (
    type: "margin" | "padding",
    updatedValues: BoxValues
  ) => {
    if (type === "margin") {
      setMargin(updatedValues);
      setUserInputData((prev: GallerySection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          marginTop: updatedValues.top.toString(),
          marginBottom: updatedValues.bottom.toString(),
        },
      }));
    } else {
      setPadding(updatedValues);
      setUserInputData((prev: GallerySection) => ({
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
    const initialData = Compiler(layout, selectedComponent);
    if (initialData && initialData[0]) {
      setUserInputData(initialData[0] as GallerySection);
      // Initialize useRouteSelect array based on existing images
      if (initialData[0]?.blocks?.images) {
        setUseRouteSelect(new Array(initialData[0].blocks.images.length).fill(false));
      }
    }
  }, [selectedComponent, layout, setUserInputData]);

  const handleBlockChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev) => ({
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
    setUserInputData((prev: GallerySection) => ({
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

  const handleImageChange = (index: number, field: string, value: string) => {
    setUserInputData((prev) => {
      const newImages = [...(prev.blocks.images || [])];
      newImages[index] = { ...newImages[index], [field]: value };
      return {
        ...prev,
        blocks: {
          ...prev.blocks,
          images: newImages,
        },
      };
    });
  };

  const addNewImage = () => {
    setUserInputData((prev) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        images: [
          ...(prev.blocks.images || []),
          { imageSrc: "", imageAlt: "", imageLink: "" },
        ],
      },
    }));
    // Add a new false value to useRouteSelect array
    setUseRouteSelect(prev => [...prev, false]);
  };

  const removeImage = (index: number) => {
    setUserInputData((prev) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        images: (prev.blocks.images || []).filter((_, i) => i !== index),
      },
    }));
    // Remove the corresponding useRouteSelect item
    setUseRouteSelect(prev => prev.filter((_, i) => i !== index));
  };

  // Animation handlers
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
            imageAnimation: updatedAnimation
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
    handleImageChange(currentSlideIndex, "imageSrc", image.fileUrl);
    handleImageChange(currentSlideIndex, "imageAlt", image.fileName);
    setIsImageSelectorOpen(false);
  };

  const handleRouteSelectToggle = (index: number, checked: boolean) => {
    setUseRouteSelect(prev => {
      const newArray = [...prev];
      newArray[index] = checked;
      return newArray;
    });
  };

  const handleRouteChange = (index: number, route: string) => {
    handleImageChange(index, "imageLink", route);
  };

  // Get current animation values for inputs
  const currentImageAnimation = userInputData?.blocks?.setting?.imageAnimation;
  const hasImageAnimation = !!currentImageAnimation;

  return (
    <div className="p-3 max-w-4xl space-y-2 rounded" dir="rtl">
      <h2 className="text-lg font-bold mb-4">تنظیمات گالری</h2>

      {/* Tabs */}
      <TabButtons onTabChange={handleTabChange} />

      {/* Content Section */}
      {isContentOpen && (
        <div className="p-4  animate-slideDown">
          <div className="space-y-4">
            <div>
              <label className="block mb-2">عنوان</label>
              <input
                type="text"
                name="title"
                value={userInputData?.blocks?.title || "عنوان"}
                onChange={handleBlockChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">توضیحات</label>
              <textarea
                name="description"
                value={userInputData?.blocks?.description || "توضیحات"}
                onChange={handleBlockChange}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>
            <div className=" border-t  border-gray-100 animate-slideDown">
              <button
                onClick={addNewImage}
                className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
              >
                افزودن تصویر جدید
              </button>

              {userInputData?.blocks?.images?.map((image, index) => (
                <div key={index} className="mb-4 p-4 border h-full rounded">
                  <div className="flex justify-between items-center mb-4">
                    <h4>تصویر {index + 1}</h4>
                    <button
                      onClick={() => removeImage(index)}
                      className="text-red-500"
                    >
                      حذف
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="آدرس تصویر"
                        value={image.imageSrc}
                        onChange={(e) =>
                          handleImageChange(index, "imageSrc", e.target.value)
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
                    <div>
                      <label className="block mb-2">متن جایگزین</label>
                      <input
                        type="text"
                        value={image.imageAlt || ""}
                        onChange={(e) =>
                          handleImageChange(index, "imageAlt", e.target.value)
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">لینک (اختیاری)</label>
                      <div className="mb-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={useRouteSelect[index] || false}
                            onChange={(e) => handleRouteSelectToggle(index, e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm">انتخاب از مسیرهای موجود</span>
                        </label>
                      </div>
                      {useRouteSelect[index] ? (
                        <select
                          value={image.imageLink || ""}
                          onChange={(e) => handleRouteChange(index, e.target.value)}
                          className="w-full p-2 border rounded"
                        >
                          <option value="">انتخاب مسیر</option>
                          {activeRoutes.map((route) => (
                            <option key={route} value={route}>
                              {route}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={image.imageLink || ""}
                          onChange={(e) =>
                            handleImageChange(index, "imageLink", e.target.value)
                          }
                          className="w-full p-2 border rounded"
                          placeholder="آدرس لینک یا مسیر سفارشی"
                        />
                      )}
                    </div>
                  </div>
                                  </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Images Section */}
      {isImagesOpen && (
        <div className="p-4  animate-slideDown">
          <button
            onClick={addNewImage}
            className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            افزودن تصویر جدید
          </button>

          {userInputData?.blocks?.images?.map((image, index) => (
            <div key={index} className="mb-6 p-4 border rounded">
              <div className="flex justify-between items-center mb-4">
                <h4>تصویر {index + 1}</h4>
                <button
                  onClick={() => removeImage(index)}
                  className="text-red-500"
                >
                  حذف
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">آدرس تصویر</label>
                  <input
                    type="text"
                    value={image.imageSrc || ""}
                    onChange={(e) =>
                      handleImageChange(index, "imageSrc", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2">متن جایگزین</label>
                  <input
                    type="text"
                    value={image.imageAlt || ""}
                    onChange={(e) =>
                      handleImageChange(index, "imageAlt", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2">لینک (اختیاری)</label>
                  <div className="mb-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={useRouteSelect[index] || false}
                        onChange={(e) => handleRouteSelectToggle(index, e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">انتخاب از مسیرهای موجود</span>
                    </label>
                  </div>
                  {useRouteSelect[index] ? (
                    <select
                      value={image.imageLink || ""}
                      onChange={(e) => handleRouteChange(index, e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">انتخاب مسیر</option>
                      {activeRoutes.map((route) => (
                        <option key={route} value={route}>
                          {route}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={image.imageLink || ""}
                      onChange={(e) =>
                        handleImageChange(index, "imageLink", e.target.value)
                      }
                      className="w-full p-2 border rounded"
                      placeholder="آدرس لینک یا مسیر سفارشی"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Style Settings */}
      {isStyleSettingsOpen && (
        <div className="p-4 animate-slideDown">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {/* Title Settings */}
            <div className="space-y-4">
              <h4 className="font-bold">تنظیمات عنوان</h4>
              <div className="flex items-center justify-center gap-4 p-4 rounded-lg border border-gray-300 shadow-sm">
                <input
                  type="range"
                  min="0"
                  max="100"
                  name="titleFontSize"
                  value={userInputData?.blocks?.setting?.titleFontSize || "25"}
                  onChange={handleBlockSettingChange}
                />
                <p className="text-sm text-gray-600 text-nowrap">
                  {userInputData?.blocks?.setting?.titleFontSize || "25"}px
                </p>
              </div>
              <div>
                <label className="block mb-2">وزن فونت عنوان</label>
                <select
                  name="titleFontWeight"
                  value={userInputData?.blocks?.setting?.titleFontWeight || "normal"}
                  onChange={handleBlockSettingChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="bold">ضخیم</option>
                  <option value="normal">نرمال</option>
                </select>
              </div>
              <div className="rounded-lg flex items-center justify-between ">
                <ColorInput
                  label="رنگ عنوان"
                  name="titleColor"
                  value={userInputData?.blocks?.setting?.titleColor || "#000000"}
                  onChange={handleBlockSettingChange}
                />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold">تنظیمات توضیحات</h4>
              <div className="flex items-center justify-center gap-4 p-4 rounded-lg border border-gray-300 shadow-sm">
                <input
                  type="range"
                  min="0"
                  max="100"
                  name="descriptionFontSize"
                  value={userInputData?.blocks?.setting?.descriptionFontSize || "16"}
                  onChange={handleBlockSettingChange}
                />
                <p className="text-sm text-gray-600 text-nowrap">
                  {userInputData?.blocks?.setting?.descriptionFontSize || "16"}px
                </p>
              </div>
              <div>
                <label className="block mb-2">وزن فونت توضیحات</label>
                <select
                  name="descriptionFontWeight"
                  value={userInputData?.blocks?.setting?.descriptionFontWeight || "normal"}
                  onChange={handleBlockSettingChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="bold">ضخیم</option>
                  <option value="normal">نرمال</option>
                </select>
              </div>
              <div className="rounded-lg flex items-center justify-between ">
                <ColorInput
                  label="رنگ توضیحات"
                  name="descriptionColor"
                  value={userInputData?.blocks?.setting?.descriptionColor || "#000000"}
                  onChange={handleBlockSettingChange}
                />
              </div>
            </div>

            {/* Grid Settings */}
            <div className="space-y-4">
              <h4 className="font-bold">تنظیمات شبکه</h4>
              <div>
                <label className="block mb-2">تعداد ستون‌ها</label>
                <input
                  type="number"
                  name="gridColumns"
                  min="1"
                  max="6"
                  value={userInputData?.blocks?.setting?.gridColumns || "3"}
                  onChange={handleBlockSettingChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="flex items-center justify-center gap-4 p-4 rounded-lg border border-gray-300 shadow-sm">
                <input
                  type="range"
                  min="0"
                  max="100"
                  name="gridGap"
                  value={userInputData?.blocks?.setting?.gridGap || "16"}
                  onChange={handleBlockSettingChange}
                />
                <p className="text-sm text-gray-600 text-nowrap">
                  {userInputData?.blocks?.setting?.gridGap || "16"}px
                </p>
              </div>
            </div>

            {/* Image Settings */}
            <div className="space-y-4">
              <h4 className="font-bold">تنظیمات تصاویر</h4>
              <div>
                <label className="block mb-2">ارتفاع تصاویر</label>
                <input
                  type="number"
                  name="imageHeight"
                  value={userInputData?.blocks?.setting?.imageHeight || "200"}
                  onChange={handleBlockSettingChange}
                  className="w-full p-2 border rounded"
                />
                <div className="text-gray-500">
                  {userInputData?.blocks?.setting?.imageHeight || "200"}px
                </div>
              </div>
              <div>
                <label className="block mb-2">عرض تصاویر</label>
                <input
                  type="number"
                  name="imageWidth"
                  value={userInputData?.blocks?.setting?.imageWidth || "200"}
                  onChange={handleBlockSettingChange}
                  className="w-full p-2 border rounded"
                />
                <div className="text-gray-500">
                  {userInputData?.blocks?.setting?.imageWidth || "200"}px
                </div>
              </div>

              <label className="block">گردی گوشه‌ها</label>

              <div className="flex items-center justify-center gap-4 p-4 rounded-lg border border-gray-300 shadow-sm">
                <input
                  type="range"
                  min="0"
                  max="100"
                  name="imageRadius"
                  value={userInputData?.blocks?.setting?.imageRadius || "8"}
                  onChange={handleBlockSettingChange}
                />
                <p className="text-sm text-gray-600 text-nowrap">
                  {userInputData?.blocks?.setting?.imageRadius || "8"}px
                </p>
              </div>
            </div>
            <div className="rounded-lg flex items-center justify-between ">
              <ColorInput
                label="رنگ پس زمینه"
                name="background"
                value={userInputData?.blocks?.setting?.background || "#ffffff"}
                onChange={handleBlockSettingChange}
              />
            </div>

            {/* Image Animation Settings */}
            <div className="rounded-lg flex flex-col gap-3 border-t pt-4 mt-6">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-sky-700">انیمیشن تصاویر</h4>
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
                  <h5 className="font-medium text-gray-700">تنظیمات انیمیشن تصاویر گالری</h5>

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
                      <div className="text-gray-500 text-xs mt-1">
                        فعلی: {currentImageAnimation.animation.duration}
                      </div>
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
                        value={parseFloat((currentImageAnimation.animation.delay || '0s').replace('s', '')) || 0}
                        onChange={(e) => handleImageAnimationChange('animation.delay', e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="text-gray-500 text-xs mt-1">
                        فعلی: {currentImageAnimation.animation?.delay || '0s'}
                      </div>
                    </div>

                    {/* Iteration Count */}
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        تعداد تکرار
                      </label>
                      <select
                        value={currentImageAnimation.animation.iterationCount || '1'}
                        onChange={(e) => handleImageAnimationChange('animation.iterationCount', e.target.value)}
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
                    <AnimationPreview effects={[currentImageAnimation]} />
                  </div>

                  {/* Animation Info */}
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <h6 className="font-medium text-blue-800 mb-2">اطلاعات انیمیشن</h6>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div>
                        <strong>CSS تولید شده:</strong>
                        <code className="block mt-1 p-2 bg-white rounded text-xs overflow-x-auto">
                          {animationService.generateCSS(currentImageAnimation.animation)}
                        </code>
                      </div>
                      <div className="mt-2">
                        <strong>وضعیت اعتبار:</strong>
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${
                          animationService.validateConfig(currentImageAnimation.animation)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {animationService.validateConfig(currentImageAnimation.animation) ? 'معتبر' : 'نامعتبر'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!hasImageAnimation && (
                <div className="text-center text-gray-500 py-8 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="mb-2">🖼️</div>
                  <div>انیمیشن تصاویر غیرفعال است</div>
                  <div className="text-sm mt-1">برای فعال کردن چک‌باکس بالا را انتخاب کنید</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spacing Settings */}
      {isSpacingOpen && (
        <div className="p-4 animate-slideDown">
          <div className=" rounded-lg p-2 flex items-center justify-center">
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

export default GalleryForm;

