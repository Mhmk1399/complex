import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, MultiRowSection, AnimationEffect } from "@/lib/types";
import { useSharedContext } from "@/app/contexts/SharedContext";
import React from "react";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";
import ImageSelectorModal from "../sections/ImageSelectorModal";
import { animationService } from "@/services/animationService";
import { AnimationPreview } from "../animationPreview";

interface MultiRowFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<MultiRowSection>>;
  userInputData: MultiRowSection | undefined;
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

export const MultiRowForm: React.FC<MultiRowFormProps> = ({
  setUserInputData,
  userInputData,
  layout,
  selectedComponent,
}) => {
  const { activeRoutes } = useSharedContext();
  const [useRouteSelectBtns, setUseRouteSelectBtns] = useState<Record<number, boolean>>({});
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
  const [openRows, setOpenRows] = useState<Record<number, boolean>>({});
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [isSpacingOpen, setIsSpacingOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
  const [currentEditingIndex, setCurrentEditingIndex] = useState<number>(0);

  const handleAddRow = () => {
    setUserInputData((prev: MultiRowSection) => {
      const existingKeys = Object.keys(prev.blocks || {})
        .filter((key) => !isNaN(Number(key)))
        .map(Number);
      const nextIndex =
        existingKeys.length > 0 ? Math.max(...existingKeys) + 1 : 0;

      return {
        ...prev,
        blocks: {
          ...prev.blocks,
          [nextIndex]: {
            heading: `ردیف  ${nextIndex + 1}`,
            description: `لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد`,
            imageSrc: "/assets/images/banner1.jpg",
            imageAlt: "",
            btnLable: `دکمه ${nextIndex + 1}`,
            btnLink: "#",
          },
        },
      };
    });
  };

  const handleDeleteRow = (index: number) => {
    setUserInputData((prev: MultiRowSection) => {
      const newBlocks = { ...prev.blocks };
      delete newBlocks[index];
      return {
        ...prev,
        blocks: newBlocks,
      };
    });
  };

  const handleUpdate = (
    type: "margin" | "padding",
    updatedValues: BoxValues
  ) => {
    if (type === "margin") {
      setMargin(updatedValues);
      setUserInputData((prev: MultiRowSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          marginTop: updatedValues.top.toString(),
          marginBottom: updatedValues.bottom.toString(),
        },
      }));
    } else {
      setPadding(updatedValues);
      setUserInputData((prev: MultiRowSection) => ({
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
    console.log(initialData)
    if (initialData) {
      setUserInputData(initialData);
    }
  }, [selectedComponent]);

  const handleBlockChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    if (isUpdating) return;
    setIsUpdating(true);
    const { name, value } = e.target;
    setUserInputData((prev: MultiRowSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [index]: {
          ...prev.blocks[index],
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
    setUserInputData((prev: MultiRowSection) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value,
      },
    }));
    setTimeout(() => setIsUpdating(false), 100);
  };

  // Animation handlers for images
  const handleImageAnimationToggle = (enabled: boolean) => {
    if (enabled) {
      const defaultConfig = animationService.getDefaultConfig('pulse');
      const defaultEffect: AnimationEffect = {
        type: 'hover',
        animation: defaultConfig
      };
      
      setUserInputData((prev: MultiRowSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          imageAnimation: defaultEffect
        }
      }));
    } else {
      setUserInputData((prev: MultiRowSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          imageAnimation: undefined
        }
      }));
    }
  };

  const handleImageAnimationChange = (field: string, value: string | number) => {
    setUserInputData((prev: MultiRowSection) => {
      const currentAnimation = prev.setting?.imageAnimation;
      if (!currentAnimation) return prev;

      const updatedAnimation = { ...currentAnimation };

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
        setting: {
          ...prev.setting,
          imageAnimation: updatedAnimation
        }
      };
    });
  };

  // Animation handlers for buttons
  const handleButtonAnimationToggle = (enabled: boolean) => {
    if (enabled) {
      const defaultConfig = animationService.getDefaultConfig('pulse');
      const defaultEffect: AnimationEffect = {
        type: 'hover',
        animation: defaultConfig
      };
      
      setUserInputData((prev: MultiRowSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          buttonAnimation: defaultEffect
        }
      }));
    } else {
      setUserInputData((prev: MultiRowSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          buttonAnimation: undefined
        }
      }));
    }
  };

  const handleButtonAnimationChange = (field: string, value: string | number) => {
    setUserInputData((prev: MultiRowSection) => {
      const currentAnimation = prev.setting?.buttonAnimation;
      if (!currentAnimation) return prev;

      const updatedAnimation = { ...currentAnimation };

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
        setting: {
          ...prev.setting,
          buttonAnimation: updatedAnimation
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

  // Get current animation values
  const currentImageAnimation = userInputData?.setting?.imageAnimation;
  const hasImageAnimation = !!currentImageAnimation;
  const currentButtonAnimation = userInputData?.setting?.buttonAnimation;
  const hasButtonAnimation = !!currentButtonAnimation;

  return (
    <>
      <div className="p-3 max-w-4xl space-y-2 rounded" dir="rtl">
        <h2 className="text-lg font-bold mb-4">ردیف ها</h2>

        {/* Tabs */}
        <TabButtons onTabChange={handleTabChange} />

        {isContentOpen && (
          <div className="p-4 animate-slideDown">
            <div className="rounded-lg">
              <label htmlFor="" className="block mb-2 font-bold">
                متن سربرگ
              </label>
              <input
                type="text"
                name="title"
                value={userInputData?.title ?? ""}
                onChange={(e) =>
                  setUserInputData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Main Title"
              />
            </div>
            <br />
            <label htmlFor="" className="block mb-2 font-bold">
              ردیف ها
            </label>
            {userInputData?.blocks &&
              typeof userInputData.blocks === "object" &&
              Object.keys(userInputData.blocks)
                .filter((key) => !isNaN(Number(key))) // Only get numeric keys
                .map((key) => {
                  const block = userInputData.blocks[Number(key)];
                  if (!block || typeof block !== "object") return null;

                  return (
                    <div
                      key={key}
                      className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100"
                    >
                      {/* Row Header Button */}
                      <button
                        onClick={() =>
                          setOpenRows((prev) => ({
                            ...prev,
                            [Number(key)]: !prev[Number(key)],
                          }))
                        }
                        className="w-full flex justify-between items-center p-4 hover:bg-gray-50 rounded-xl transition-all duration-200"
                      >
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-5 h-5 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 6h16M4 12h16M4 18h16"
                            />
                          </svg>
                          <h3 className="font-semibold text-nowrap text-gray-700">
                            ردیف {Number(key) + 1}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteRow(Number(key));
                              }}
                              className="p-1 hover:bg-red-100 mr-10 rounded-full cursor-pointer"
                            >
                              <svg
                                className="w-5 h-5 text-red-500"
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
                            </span>
                          </div>
                        </div>
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                            openRows[Number(key)] ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {/* Row Content */}
                      {openRows[Number(key)] && (
                        <div className="p-4 animate-slideDown">
                          <div className="space-y-4">
                            {/* Title Input */}
                            <div className="p-3 rounded-lg">
                              <label className="block mb-2 text-sm font-bold text-gray-700">
                                عنوان
                              </label>
                              <input
                                type="text"
                                name="heading"
                                value={block.heading || ""}
                                onChange={(e) =>
                                  handleBlockChange(e, Number(key))
                                }
                                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              />
                            </div>

                            {/* Description Textarea */}
                            <div className="p-3 rounded-lg">
                              <label className="block mb-2 text-sm font-bold text-gray-700">
                                توضیحات
                              </label>
                              <textarea
                                name="description"
                                value={block.description || ""}
                                onChange={(e) =>
                                  handleBlockChange(e, Number(key))
                                }
                                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                rows={3}
                              />
                            </div>

                            {/* Image Input */}
                            <div className="p-3 rounded-lg">
                              <label className="block mb-2 text-sm font-bold text-gray-700">
                                تصویر
                              </label>
                              <div className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  name="imageSrc"
                                  value={block.imageSrc || ""}
                                  onChange={(e) =>
                                    handleBlockChange(e, Number(key))
                                  }
                                  className="w-full p-2 border hidden border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                />
                                <button
                                  onClick={() => {
                                    setCurrentEditingIndex(Number(key));
                                    setIsImageSelectorOpen(true);
                                  }}
                                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                                  type="button"
                                >
                                  انتخاب تصویر
                                </button>
                              </div>
                            </div>

                            {/* Image Alt Input */}
                            <div className="p-3 rounded-lg">
                              <label className="block mb-2 text-sm font-bold text-gray-700">
                                متن جایگزین تصویر
                              </label>
                              <input
                                type="text"
                                name="imageAlt"
                                value={block.imageAlt || ""}
                                onChange={(e) =>
                                  handleBlockChange(e, Number(key))
                                }
                                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              />
                            </div>

                            {/* Button Label Input */}
                            <div className="p-3 rounded-lg">
                              <label className="block mb-2 text-sm font-bold text-gray-700">
                                متن دکمه
                              </label>
                              <input
                                type="text"
                                name="btnLable"
                                value={block.btnLable || ""}
                                onChange={(e) =>
                                  handleBlockChange(e, Number(key))
                                }
                                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              />
                            </div>

                            {/* Button Link Input */}
                            <div className="p-3 rounded-lg">
                              <label className="block mb-2 text-sm font-bold text-gray-700">
                                لینک دکمه
                              </label>
                              <div className="mb-2">
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={useRouteSelectBtns[Number(key)] || false}
                                    onChange={(e) =>
                                      setUseRouteSelectBtns(prev => ({
                                        ...prev,
                                        [Number(key)]: e.target.checked
                                      }))
                                    }
                                    className="rounded"
                                  />
                                  <span className="text-sm">انتخاب از مسیرهای موجود</span>
                                </label>
                              </div>
                              {useRouteSelectBtns[Number(key)] ? (
                                <select
                                  value={block.btnLink || ""}
                                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                    setUserInputData(prev => ({
                                      ...prev,
                                      blocks: {
                                        ...prev.blocks,
                                        [Number(key)]: {
                                          ...prev.blocks[Number(key)],
                                          btnLink: e.target.value
                                        }
                                      }
                                    }));
                                  }}
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
                                  value={block.btnLink || ""}
                                  onChange={(e) => handleBlockChange(e, Number(key))}
                                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                  placeholder="آدرس لینک یا مسیر سفارشی"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            <button
              onClick={handleAddRow}
              className="px-1 rounded-lg mb-3 w-full text-3xl group hover:font-extrabold transition-all"
            >
              +
              <div className="bg-blue-500 w-full pb-0.5 group-hover:bg-blue-600 group-hover:pb-1 transition-all"></div>
            </button>
          </div>
        )}

        {/* Style Settings */}
        {isStyleSettingsOpen && (
          <>
            <div className="grid md:grid-cols-1 gap-4 animate-slideDown">
              <h4 className="font-semibold my-2">تنظیمات سربرگ</h4>
              <div className="rounded-lg flex items-center justify-between ">
                <ColorInput
                  label="رنگ سربرگ"
                  name="titleColor"
                  value={userInputData?.setting?.titleColor ?? "#000000"}
                  onChange={handleSettingChange}
                />
              </div>
              <label className="block mb-1">سایز سربرگ</label>

              <div className="flex items-center justify-center gap-4 p-4 rounded-lg border border-gray-300 shadow-sm">
                <input
                  type="range"
                  min="0"
                  max="100"
                  name="titleFontSize"
                  value={userInputData?.setting?.titleFontSize || "250"}
                  onChange={handleSettingChange}
                />
                <p className="text-sm text-gray-600 text-nowrap">
                  {userInputData?.setting?.titleFontSize}px
                </p>
              </div>
              <div>
                <label className="block mb-1">وزن سربرگ</label>
                <select
                  name="titleFontWeight"
                  value={userInputData?.setting?.titleFontWeight ?? "normal"}
                  onChange={handleSettingChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="normal">نرمال</option>
                  <option value="bold">ضخیم</option>
                </select>
              </div>
              <h4 className="font-semibold my-2">تنظیمات عنوان</h4>
              <div className="rounded-lg flex items-center justify-between ">
                <ColorInput
                  label="رنگ عنوان"
                  name="headingColor"
                  value={userInputData?.setting?.headingColor ?? "#fcbf49"}
                  onChange={handleSettingChange}
                />
              </div>
              <label className="block mb-1">سایز عنوان</label>
              <div className="flex items-center justify-center gap-4 p-4 rounded-lg border border-gray-300 shadow-sm">
                <input
                  type="range"
                  min="0"
                  max="100"
                  name="headingFontSize"
                  value={userInputData?.setting?.headingFontSize || "250"}
                  onChange={handleSettingChange}
                />
                <p className="text-sm text-gray-600 text-nowrap">
                  {userInputData?.setting?.headingFontSize}px
                </p>
              </div>
              <div>
                <label className="block mb-1">وزن عنوان</label>
                <select
                  name="headingFontWeight"
                  value={userInputData?.setting?.headingFontWeight ?? "bold"}
                  onChange={handleSettingChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="normal">نرمال</option>
                  <option value="bold">ضخیم</option>
                </select>
              </div>
              <h4 className="font-semibold my-2">تنظیمات توضیحات</h4>
              <div className="rounded-lg flex items-center justify-between ">
                <ColorInput
                  label="رنگ توضیحات"
                  name="descriptionColor"
                  value={userInputData?.setting?.descriptionColor ?? "#e4e4e4"}
                  onChange={handleSettingChange}
                />
              </div>
              <label className="block mb-1">سایز توضیحات</label>
              <div className="flex items-center justify-center gap-4 p-4 rounded-lg border border-gray-300 shadow-sm">
                <input
                  type="range"
                  min="0"
                  max="100"
                  name="descriptionFontSize"
                  value={userInputData?.setting?.descriptionFontSize || "250"}
                  onChange={handleSettingChange}
                />
                <p className="text-sm text-gray-600 text-nowrap">
                  {userInputData?.setting?.descriptionFontSize}px
                </p>
              </div>
              <div>
                <label className="block mb-1">وزن توضیحات</label>
                <select
                  name="descriptionFontWeight"
                  value={
                    userInputData?.setting?.descriptionFontWeight ?? "bold"
                  }
                  onChange={handleSettingChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="normal">نرمال</option>
                  <option value="bold">ضخیم</option>
                </select>
              </div>
              <h4 className="font-semibold my-2">تنظیمات پس زمینه</h4>
              <div className="rounded-lg flex items-center justify-between ">
                <ColorInput
                  label="رنگ پس زمینه"
                  name="backgroundColorMultiRow"
                  value={
                    userInputData?.setting?.backgroundColorMultiRow ?? "#8d99ae"
                  }
                  onChange={handleSettingChange}
                />
              </div>
              <div className="rounded-lg flex items-center justify-between ">
                <ColorInput
                  label="رنگ پس زمینه ردیف ها"
                  name="backgroundColorBox"
                  value={
                    userInputData?.setting?.backgroundColorBox ?? "#2b2d42"
                  }
                  onChange={handleSettingChange}
                />
              </div>
              <h4 className="font-semibold my-2">تنظیمات دکمه </h4>
              <div className="rounded-lg flex items-center justify-between ">
                <ColorInput
                  label="رنگ متن دکمه"
                  name="btnColor"
                  value={userInputData?.setting?.btnColor ?? "#ffffff"}
                  onChange={handleSettingChange}
                />
              </div>
              <div className="rounded-lg flex items-center justify-between ">
                <ColorInput
                  label="رنگ پس زمینه دکمه"
                  name="btnBackgroundColor"
                  value={
                    userInputData?.setting?.btnBackgroundColor ?? "#bc4749"
                  }
                  onChange={handleSettingChange}
                />
              </div>
              <div className="grid md:grid-cols-1 gap-4 mt-4">
                <h4 className="font-semibold mb-2">تنظیمات تصویر</h4>
                <label className="block ">عرض تصویر</label>
                <div className="flex items-center justify-center gap-4 p-4 rounded-lg border border-gray-300 shadow-sm">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    name="imageWidth"
                    value={parseInt(
                      userInputData?.setting?.imageWidth ?? "700"
                    )}
                    onChange={handleSettingChange}
                  />
                  <p className="text-sm text-gray-600 text-nowrap">
                    {userInputData?.setting?.imageWidth}px
                  </p>
                </div>
                <label className="block">ارتفاع تصویر</label>
                <div className="flex items-center justify-center gap-4 p-4 rounded-lg border border-gray-300 shadow-sm">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    name="imageHeight"
                    value={parseInt(
                      userInputData?.setting?.imageHeight ?? "300"
                    )}
                    onChange={handleSettingChange}
                  />
                  <p className="text-sm text-gray-600 text-nowrap">
                    {userInputData?.setting?.imageHeight}px
                  </p>
                </div>
                <label className="block">انحنا زوایای تصویر</label>
                <div className="flex items-center justify-center gap-4 p-4 rounded-lg border border-gray-300 shadow-sm">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    name="imageRadius"
                    value={parseInt(
                      userInputData?.setting?.imageRadius ?? "45"
                    )}
                    onChange={handleSettingChange}
                  />
                  <p className="text-sm text-gray-600 text-nowrap">
                    {userInputData?.setting?.imageRadius}px
                  </p>
                </div>
              </div>

              {/* Layout Settings */}
              <div className="mt-4">
                <label className="block mb-1">جایگاه تصویر</label>
                <select
                  name="imageAlign"
                  value={userInputData?.setting?.imageAlign ?? "row"}
                  onChange={handleSettingChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="row">ردیف</option>
                  <option value="row-reverse">ردیف معکوس</option>
                </select>
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
                    <h5 className="font-medium text-gray-700">تنظیمات انیمیشن تصاویر</h5>

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
                      <h6 className="font-medium text-blue-800 mb-2">اطلاعات انیمیشن تصاویر</h6>
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

              {/* Button Animation Settings */}
              <div className="rounded-lg flex flex-col gap-3 border-t pt-4 mt-6">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-sky-700">انیمیشن دکمه‌ها</h4>
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
                    <h5 className="font-medium text-gray-700">تنظیمات انیمیشن دکمه‌ها</h5>

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
                        <div className="text-gray-500 text-xs mt-1">
                          فعلی: {currentButtonAnimation.animation.duration}
                        </div>
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
                          value={parseFloat((currentButtonAnimation.animation.delay || '0s').replace('s', '')) || 0}
                          onChange={(e) => handleButtonAnimationChange('animation.delay', e.target.value)}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="text-gray-500 text-xs mt-1">
                          فعلی: {currentButtonAnimation.animation?.delay || '0s'}
                        </div>
                      </div>

                      {/* Iteration Count */}
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          تعداد تکرار
                        </label>
                        <select
                          value={currentButtonAnimation.animation.iterationCount || '1'}
                          onChange={(e) => handleButtonAnimationChange('animation.iterationCount', e.target.value)}
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
                      <AnimationPreview effects={[currentButtonAnimation]} />
                    </div>

                    {/* Animation Info */}
                    <div className="mt-3 p-3 bg-green-50 rounded-lg">
                      <h6 className="font-medium text-green-800 mb-2">اطلاعات انیمیشن دکمه‌ها</h6>
                      <div className="text-sm text-green-700 space-y-1">
                        <div>
                          <strong>CSS تولید شده:</strong>
                          <code className="block mt-1 p-2 bg-white rounded text-xs overflow-x-auto">
                            {animationService.generateCSS(currentButtonAnimation.animation)}
                          </code>
                        </div>
                        <div className="mt-2">
                          <strong>وضعیت اعتبار:</strong>
                          <span className={`ml-2 px-2 py-1 rounded text-xs ${
                            animationService.validateConfig(currentButtonAnimation.animation)
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {animationService.validateConfig(currentButtonAnimation.animation) ? 'معتبر' : 'نامعتبر'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!hasButtonAnimation && (
                  <div className="text-center text-gray-500 py-8 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="mb-2">🔘</div>
                    <div>انیمیشن دکمه‌ها غیرفعال است</div>
                    <div className="text-sm mt-1">برای فعال کردن چک‌باکس بالا را انتخاب کنید</div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Spacing Settings */}
        {isSpacingOpen && (
          <div className="p-4 animate-slideDown">
            <div className="rounded-lg flex items-center justify-center">
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
          onSelectImage={(image) => {
            setUserInputData((prev: MultiRowSection) => ({
              ...prev,
              blocks: {
                ...prev.blocks,
                [currentEditingIndex]: {
                  ...prev.blocks[currentEditingIndex],
                  imageSrc: image.fileUrl,
                },
              },
            }));
            setIsImageSelectorOpen(false);
          }}
        />
      </div>
    </>
  );
};
