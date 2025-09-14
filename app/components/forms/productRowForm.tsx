import { useEffect, useState } from "react";
import { Layout, ProductRowSection, AnimationEffect } from "@/lib/types";
import MarginPaddingEditor from "../sections/editor";
import { Compiler } from "../compiler";
import { TabButtons } from "../tabButtons";
import { animationService } from "@/services/animationService";
import { AnimationPreview } from "../animationPreview";
import { HiChevronDown, HiSparkles } from "react-icons/hi";
import { createApiService } from "@/lib/api-factory";

interface ProductRowFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<ProductRowSection>>;
  userInputData: ProductRowSection;
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

export const ProductRowForm: React.FC<ProductRowFormProps> = ({
  setUserInputData,
  userInputData,
  layout,
  selectedComponent,
}) => {
  const [isStyleSettingsOpen, setIsStyleSettingsOpen] = useState(false);
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [isSpacingOpen, setIsSpacingOpen] = useState(false);
  const [isAnimationOpen, setIsAnimationOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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

  useEffect(() => {
    const initialData = Compiler(layout, selectedComponent)[0];
    setUserInputData(initialData);
  }, [selectedComponent]);



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

  const api = createApiService({
    baseUrl: '/api',
    headers: {
      'Content-Type': 'application/json',
      Authorization: typeof window !== 'undefined' ? localStorage.getItem('complexToken') || '' : ''
    }
  });

  const { data: collectionsData, error: collectionsError } = api.useGet('/collections', {
    revalidateOnFocus: false,
    refreshInterval: 60000
  });

  const collections = collectionsData?.product || [];
  const collectionsErrorMessage = collectionsError ? "خطا در بارگذاری کالکشنها. لطفاً کالکشن را در داشبورد اضافه کنید." : 
    (collections.length === 0 ? "هیچ کالکشنی یافت نشد" : null);

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

  const handleBlockSettingChange = (
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
            navAnimation: defaultEffect,
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
            navAnimation: undefined,
          },
        },
      }));
    }
  };

  const handleAnimationChange = (field: string, value: string | number) => {
    setUserInputData((prev) => {
      const currentAnimation = prev.blocks?.setting?.navAnimation;
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
            navAnimation: updatedAnimation,
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
  const currentAnimation = userInputData?.blocks?.setting?.navAnimation;
  const hasAnimation = !!currentAnimation;

  return (
    <div className="p-3 max-w-4xl space-y-2 rounded" dir="rtl">
      <h2 className="text-lg font-bold mb-4">تنظیمات محصولات</h2>
      <TabButtons onTabChange={handleTabChange} />

      {/* Content Section */}
      {isContentOpen && (
        <div className="p-4 animate-slideDown">
          <div className="p-3  rounded-lg">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              عنوان بخش
            </label>
            <input
              type="text"
              name="textHeading"
              value={userInputData?.blocks?.textHeading || ""}
              onChange={handleBlockChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mt-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              انتخاب کالکشن
            </label>
            <select
              name="selectedCollection"
              value={userInputData?.blocks?.setting?.selectedCollection || ""}
              onChange={handleBlockSettingChange}
              className="w-full p-2 border rounded"
            >
              <option value="">انتخاب کنید</option>
              {collections && collections.length > 0 ? (
                collections.map((collection) => (
                  <option key={collection._id} value={collection._id}>
                    {collection.name}
                  </option>
                ))
              ) : (
                <option disabled>هیچ کالکشنی موجود نیست</option>
              )}
            </select>
            {collectionsErrorMessage && (
              <p className="mt-2 text-sm text-red-600">{collectionsErrorMessage}</p>
            )}
          </div>
        </div>
      )}

      {/* Style Settings */}
      {isStyleSettingsOpen && (
        <div className="p-4 animate-slideDown">
          <div className="grid md:grid-cols-1 gap-4">
            <div className="p-3 rounded-lg">
              <h4 className="font-semibold text-sky-700 my-4">تنظیمات عنوان</h4>
              <div className="rounded-lg mb-2 flex items-center justify-between ">
                <ColorInput
                  label="رنگ عنوان"
                  name="headingColor"
                  value={
                    userInputData?.blocks?.setting?.headingColor || "#000000"
                  }
                  onChange={handleBlockSettingChange}
                />
              </div>
              <label>سایز عنوان</label>

              <div className="flex items-center justify-center mt-2 mb-2 rounded-lg w-full shadow-sm">
                <input
                  type="range"
                  min="10"
                  max="100"
                  name="headingFontSize"
                  className="w-full"
                  value={
                    userInputData?.blocks?.setting?.headingFontSize || "250"
                  }
                  onChange={handleBlockSettingChange}
                />
              </div>
              <p className="text-sm text-gray-600 text-nowrap">
                {userInputData?.blocks.setting.headingFontSize}px
              </p>
              <br />
              <label htmlFor="">وزن فونت عنوان</label>
              <select
                name="headingFontWeight"
                value={
                  userInputData?.blocks?.setting?.headingFontWeight || "normal"
                }
                onChange={handleBlockSettingChange}
                className="w-full p-2  border rounded mt-2"
              >
                <option value="bold">ضخیم</option>
                <option value="normal">معمولی</option>
              </select>
            </div>

            <div className="p-3 rounded-lg">
              <h4 className="font-semibold text-sky-700 my-4">
                تنظیمات کارت محصول
              </h4>
              <div className="rounded-lg flex items-center justify-between ">
                <ColorInput
                  label="رنگ پس زمینه کارت"
                  name="backgroundColor"
                  value={userInputData?.setting.backgroundColor || "#FFFFFF"}
                  onChange={handleSettingChange}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation */}
      {isAnimationOpen && (
        <div className="space-y-4 animate-slideDown">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <HiSparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-800">
                انیمیشن دکمه ها
              </span>
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
              <h5 className="text-sm font-medium text-gray-700">
                تنظیمات انیمیشن دکمه‌های قبل/بعد
              </h5>

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
                      currentAnimation.animation.type
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
                  <div className="text-xs text-gray-500 mt-1">
                    فعلی: {currentAnimation.animation.duration}
                  </div>
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
                    <div className="text-xs text-gray-500 mt-1">
                      فعلی: {currentAnimation.animation?.delay || "0s"}
                    </div>
                  </div>
                </div>
              </details>

              {/* Mini Preview with Animation Info */}
              <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
                <div className="text-center mb-3">
                  <p className="text-xs text-gray-600 mb-2">پیش‌نمایش</p>
                  <AnimationPreview effects={[currentAnimation]} />
                </div>
              </div>
            </div>
          )}

          {!hasAnimation && (
            <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <HiSparkles className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <p className="text-xs">انیمیشن دکمه‌های ناوبری غیرفعال است</p>
            </div>
          )}
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
    </div>
  );
};
