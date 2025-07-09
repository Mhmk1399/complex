import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, SlideSection, SlideBlock, AnimationEffect } from "@/lib/types";
import React from "react";
import MarginPaddingEditor from "../sections/editor";
import { useCallback } from "react";
import debounce from "lodash/debounce";
import { TabButtons } from "../tabButtons";
import { animationService } from "@/services/animationService";
import { AnimationPreview } from "../animationPreview";

interface SlideFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<SlideSection>>;
  userInputData: SlideSection;
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
}) => {
  const [localValue, setLocalValue] = useState(value);

  const debouncedOnChange = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e);
    }, 100),
    []
  );

  return (
    <>
      <label className="block mb-1" htmlFor={name}>
        {label}
      </label>
      <div className="flex flex-col gap-3 items-center">
        <input
          type="color"
          id={name}
          name={name}
          value={localValue}
          onChange={(e) => {
            setLocalValue(e.target.value);
            debouncedOnChange(e);
          }}
          className="border p-0.5 rounded-full"
        />
      </div>
    </>
  );
};

export const SlideForm: React.FC<SlideFormProps> = ({
  setUserInputData,
  userInputData,
  layout,
  selectedComponent,
}) => {
  const [isStyleSettingsOpen, setIsStyleSettingsOpen] = useState(false);
  const [isSpacingOpen, setIsSpacingOpen] = useState(false);
  const [isContentOpen, setIsContentOpen] = useState({});
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

  const normalizeBlocks = (data: SlideSection) => {
    if (Array.isArray(data.blocks)) {
      return data;
    }
    const blocksArray = Object.values(data.blocks).filter(
      (block) => block !== null && typeof block === "object"
    ) as SlideBlock[];
    return {
      ...data,
      blocks: blocksArray,
    };
  };

  useEffect(() => {
    const initialData = Compiler(layout, selectedComponent)[0];
    console.log(initialData);
    if (initialData) {
      setUserInputData(normalizeBlocks(initialData));
    }
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

  useEffect(() => {
    setIsContentOpen(true);
  }, []);

  const handelAddBlock = () => {
    setUserInputData((prev: SlideSection) => {
      // Get the current number of blocks to create the next index
      const nextIndex = prev.blocks.length;

      // Create a new block with default values
      const newBlock = {
        imageSrc: "/assets/images/banner1.jpg",
        text: ` اسلاید ${nextIndex + 1}`,
        description: `لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد`,
        btnText: `دکمه ${nextIndex + 1}`,
        btnLink: "#",
        imageAlt: "",
      };

      // Return updated state with the new block added
      return {
        ...prev,
        blocks: [...prev.blocks, newBlock],
      };
    });
  };

  const handleBlockChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    field: keyof SlideBlock
  ) => {
    const { value } = e.target;
    setUserInputData((prev: SlideSection) => {
      const blocks: SlideBlock[] = Array.isArray(prev.blocks)
        ? prev.blocks
        : Object.values(prev.blocks).filter(
            (block): block is SlideBlock =>
              block !== null && typeof block === "object"
          );
      return {
        ...prev,
        blocks: blocks.map((block, i) =>
          i === index && typeof block === "object" && block !== null
            ? { ...block, [field]: value }
            : block
        ),
      };
    });
  };

  const handleSettingChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    if (isUpdating) return;

    const { name, value } = e.target;
    setUserInputData((prev: SlideSection) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value,
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
      setUserInputData((prev: SlideSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          marginTop: updatedValues.top.toString(),
          marginBottom: updatedValues.bottom.toString(),
        },
      }));
    } else {
      setPadding(updatedValues);
      setUserInputData((prev: SlideSection) => ({
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

  const handleDeleteBlock = (index: number) => {
    setUserInputData((prev: SlideSection) => ({
      ...prev,
      blocks: prev.blocks.filter((_, i) => i !== index),
    }));
  };

  // Animation handlers for navigation buttons
  const handleNavAnimationToggle = (enabled: boolean) => {
    if (enabled) {
      const defaultConfig = animationService.getDefaultConfig('pulse');
      const defaultEffect: AnimationEffect = {
        type: 'hover',
        animation: defaultConfig
      };
      
      setUserInputData((prev) => ({
        ...prev,
        setting: {
          ...prev.setting,
          navAnimation: defaultEffect
        }
      }));
    } else {
      setUserInputData((prev) => ({
        ...prev,
        setting: {
          ...prev.setting,
          navAnimation: undefined
        }
      }));
    }
  };

  const handleNavAnimationChange = (field: string, value: string | number) => {
    setUserInputData((prev) => {
      const currentAnimation = prev.setting?.navAnimation;
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
        setting: {
          ...prev.setting,
          navAnimation: updatedAnimation
        }
      };
    });
  };

  // Animation handlers for slide images
  const handleImageAnimationToggle = (enabled: boolean) => {
    if (enabled) {
      const defaultConfig = animationService.getDefaultConfig('glow');
      const defaultEffect: AnimationEffect = {
        type: 'hover',
        animation: defaultConfig
      };
      
      setUserInputData((prev) => ({
        ...prev,
        setting: {
          ...prev.setting,
          imageAnimation: defaultEffect
        }
      }));
    } else {
      setUserInputData((prev) => ({
        ...prev,
        setting: {
          ...prev.setting,
          imageAnimation: undefined
        }
      }));
    }
  };

  const handleImageAnimationChange = (field: string, value: string | number) => {
    setUserInputData((prev) => {
      const currentAnimation = prev.setting?.imageAnimation;
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
        setting: {
          ...prev.setting,
          imageAnimation: updatedAnimation
        }
      };
    });
  };

  // Animation handlers for slide buttons
  const handleBtnAnimationToggle = (enabled: boolean) => {
    if (enabled) {
      const defaultConfig = animationService.getDefaultConfig('brightness');
      const defaultEffect: AnimationEffect = {
        type: 'hover',
        animation: defaultConfig
      };
      
      setUserInputData((prev) => ({
        ...prev,
        setting: {
          ...prev.setting,
          btnAnimation: defaultEffect
        }
      }));
    } else {
      setUserInputData((prev) => ({
        ...prev,
        setting: {
          ...prev.setting,
          btnAnimation: undefined
        }
      }));
    }
  };

  const handleBtnAnimationChange = (field: string, value: string | number) => {
    setUserInputData((prev) => {
      const currentAnimation = prev.setting?.btnAnimation;
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
        setting: {
          ...prev.setting,
          btnAnimation: updatedAnimation
        }
      };
    });
  };

  if (!userInputData?.blocks) {
    return null;
  }

  const handleTabChange = (tab: "content" | "style" | "spacing") => {
    setIsContentOpen(tab === "content");
    setIsStyleSettingsOpen(tab === "style");
    setIsSpacingOpen(tab === "spacing");
  };

  // Get current animation values
  const navAnimation = userInputData?.setting?.navAnimation;
  const imageAnimation = userInputData?.setting?.imageAnimation;
  const btnAnimation = userInputData?.setting?.btnAnimation;

  return (
    <>
      <div className="p-3 max-w-4xl space-y-2 rounded" dir="rtl">
        <h2 className="text-lg font-bold mb-4">تنظیمات اسلاید شو</h2>

        {/* Tabs */}
        <TabButtons onTabChange={handleTabChange} />

        {isContentOpen && (
          <>
            {Object.values(userInputData.blocks).map((block, index) => (
              <React.Fragment key={index}>
                <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 mt-4">
                  <button
                    onClick={() =>
                      setIsContentOpen((prev) => ({
                        ...prev,
                        [index]: !prev[index as keyof typeof prev],
                      }))
                    }
                    className="w-full flex justify-between items-center p-4 hover: rounded-xl transition-all duration-200"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      <h3 className="font-semibold text-nowrap text-gray-700">
                        اسلاید {index + 1}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBlock(index);
                          }}
                          className="p-1 hover:bg-red-100 rounded-full mr-16 cursor-pointer"
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
                        isContentOpen[index as keyof typeof isContentOpen]
                          ? "rotate-180"
                          : ""
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

                  {isContentOpen[index as keyof typeof isContentOpen] && (
                    <div className="p-4 border-t border-gray-100 space-y-4 animate-slideDown">
                      <div className="p-3  rounded-lg">
                        <label className="block mb-2 text-sm font-bold text-gray-700">
                          تصویر
                        </label>
                        <input
                          type="text"
                          value={block.imageSrc || ""}
                          onChange={(e) =>
                            handleBlockChange(e, index, "imageSrc")
                          }
                          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>

                      <div className="p-3  rounded-lg">
                        <label className="block mb-2 text-sm font-bold text-gray-700">
                          عنوان
                        </label>
                        <input
                          type="text"
                          value={block.text || ""}
                          onChange={(e) => handleBlockChange(e, index, "text")}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>

                      <div className="p-3  rounded-lg">
                        <label className="block mb-2 text-sm font-bold text-gray-700">
                          توضیحات
                        </label>
                        <textarea
                          value={block.description || ""}
                          onChange={(e) =>
                            handleBlockChange(e, index, "description")
                          }
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
                          value={block.btnText || ""}
                          onChange={(e) =>
                            handleBlockChange(e, index, "btnText")
                          }
                          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>

                      <div className="p-3  rounded-lg">
                        <label className="block mb-2 text-sm font-bold text-gray-700">
                          لینک دکمه
                        </label>
                        <input
                          type="text"
                          value={block.btnLink || ""}
                          onChange={(e) =>
                            handleBlockChange(e, index, "btnLink")
                          }
                          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </React.Fragment>
            ))}

            {/* Add Block Button - Outside of the map */}
            <button
              onClick={handelAddBlock}
              className="px-1 rounded-lg mb-3 w-full text-3xl group hover:font-extrabold transition-all"
            >
              +
              <div className="bg-blue-500 w-full pb-0.5 group-hover:bg-blue-600 group-hover:pb-1 transition-all"></div>
            </button>
          </>
        )}

        {isStyleSettingsOpen && (
          <div className="p-4 border-t border-gray-100 animate-slideDown">
            <div className="grid grid-cols-1 gap-6">
              {/* Text Settings */}
              <div className="space-y-4 rounded-lg">
                <h4 className="font-bold text-sky-700 mb-3">تنظیمات سربرگ</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">
                      سایز
                    </label>
                    <input
                      type="range"
                      name="textFontSize"
                      value={userInputData?.setting?.textFontSize || 15}
                      onChange={handleSettingChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {userInputData?.setting?.textFontSize || 15}px
                    </div>
                  </div>

                  <div>
                    <label className="text-lg text-gray-600 mb-1 block">
                      وزن متن
                    </label>
                    <select
                      name="textFontWeight"
                      value={userInputData?.setting?.textFontWeight ?? "400"}
                      onChange={handleSettingChange}
                      className="w-full p-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="bold">ضخیم</option>
                      <option value="normal">نرمال</option>
                    </select>
                  </div>

                  <div className="p-3 rounded-lg">
                    <ColorInput
                      label="رنگ سربرگ"
                      name="textColor"
                      value={
                        userInputData?.setting?.textColor?.toString() ??
                        "#ffffff"
                      }
                      onChange={handleSettingChange}
                    />
                  </div>
                </div>
              </div>

              {/* Description Settings */}
              <div className="space-y-4 rounded-lg">
                <h4 className="font-bold text-sky-700 mb-3">تنظیمات توضیحات</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">
                      سایز
                    </label>
                    <input
                      type="range"
                      name="descriptionFontSize"
                      min="0"
                      max="100"
                      value={userInputData?.setting?.descriptionFontSize || 15}
                      onChange={handleSettingChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {userInputData?.setting?.descriptionFontSize || 15}px
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">
                      وزن متن
                    </label>
                    <select
                      name="descriptionFontWeight"
                      value={
                        userInputData?.setting?.descriptionFontWeight ?? "400"
                      }
                      onChange={handleSettingChange}
                      className="w-full p-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="bold">ضخیم</option>
                      <option value="normal">نرمال</option>
                    </select>
                  </div>

                  <div className="p-3  rounded-lg">
                    <ColorInput
                      label="رنگ سربرگ"
                      name="descriptionColor"
                      value={
                        userInputData?.setting?.descriptionColor?.toString() ??
                        "#ffffff"
                      }
                      onChange={handleSettingChange}
                    />
                  </div>
                </div>
              </div>

              {/* Image Settings */}
              <div className="space-y-4 rounded-lg">
                <h4 className="font-bold text-sky-700 mb-3">تنظیمات تصویر</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">
                      انحنای تصویر
                    </label>
                    <input
                      type="range"
                      name="imageRadious"
                      value={userInputData?.setting?.imageRadious || 15}
                      onChange={handleSettingChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {userInputData?.setting?.imageRadious || 15}px
                    </div>
                  </div>

                  <div className="p-3  rounded-lg">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      شفافیت تصویر
                    </label>
                    <select
                      name="opacityImage"
                      value={
                        userInputData?.setting?.opacityImage?.toLocaleString() ??
                        "1"
                      }
                      onChange={handleSettingChange}
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
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">
                      رفتار تصویر
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        name="imageBehavior"
                        value={
                          userInputData?.setting?.imageBehavior?.toLocaleString() ??
                          "cover"
                        }
                        onChange={handleSettingChange}
                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      >
                        <option value="cover">پوشش</option>
                        <option value="contain">شامل</option>
                        <option value="fill">کامل</option>
                      </select>
                    </div>
                  </div>

                  {/* Image Animation Settings */}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-medium text-gray-700">انیمیشن تصاویر</h5>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!!imageAnimation}
                          onChange={(e) => handleImageAnimationToggle(e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">فعال کردن انیمیشن</span>
                      </label>
                    </div>

                    {imageAnimation && (
                      <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Effect Type */}
                          <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                              نوع تریگر
                            </label>
                            <select
                              value={imageAnimation.type}
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
                              value={imageAnimation.animation.type}
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
                              {animationService.getAnimationPreview(imageAnimation.animation.type)}
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
                              value={parseFloat(imageAnimation.animation.duration.replace('s', '')) || 1}
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
                              value={imageAnimation.animation.timing}
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
                          <AnimationPreview effects={[imageAnimation]} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Button Settings */}
              <div className="space-y-4 rounded-lg">
                <h4 className="font-bold text-sky-700 mb-3">تنظیمات دکمه</h4>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg">
                    <ColorInput
                      label="رنگ متن دکمه"
                      name="btnTextColor"
                      value={
                        userInputData?.setting?.btnTextColor?.toString() ??
                        "#ffffff"
                      }
                      onChange={handleSettingChange}
                    />
                  </div>

                  <div className="p-3  rounded-lg">
                    <ColorInput
                      label="رنگ پس زمینه دکمه"
                      name="btnBackgroundColor"
                      value={
                        userInputData?.setting?.btnBackgroundColor?.toString() ??
                        "#ffffff"
                      }
                      onChange={handleSettingChange}
                    />
                  </div>

                  {/* Button Animation Settings */}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-medium text-gray-700">انیمیشن دکمه‌ها</h5>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!!btnAnimation}
                          onChange={(e) => handleBtnAnimationToggle(e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">فعال کردن انیمیشن</span>
                      </label>
                    </div>

                    {btnAnimation && (
                      <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Effect Type */}
                          <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                              نوع تریگر
                            </label>
                            <select
                              value={btnAnimation.type}
                              onChange={(e) => handleBtnAnimationChange('type', e.target.value)}
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
                              value={btnAnimation.animation.type}
                              onChange={(e) => handleBtnAnimationChange('animation.type', e.target.value)}
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
                              {animationService.getAnimationPreview(btnAnimation.animation.type)}
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
                              value={parseFloat(btnAnimation.animation.duration.replace('s', '')) || 1}
                              onChange={(e) => handleBtnAnimationChange('animation.duration', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                          {/* Timing Function */}
                          <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                              تابع زمان‌بندی
                            </label>
                            <select
                              value={btnAnimation.animation.timing}
                              onChange={(e) => handleBtnAnimationChange('animation.timing', e.target.value)}
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
                          <AnimationPreview effects={[btnAnimation]} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation Animation Settings */}
              <div className="space-y-4 rounded-lg border-t pt-6 mt-6">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sky-700">انیمیشن دکمه‌های ناوبری</h4>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!navAnimation}
                      onChange={(e) => handleNavAnimationToggle(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">فعال کردن انیمیشن</span>
                  </label>
                </div>

                {navAnimation && (
                  <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                    <h5 className="font-medium text-gray-700">تنظیمات انیمیشن دکمه‌های قبل/بعد</h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Effect Type */}
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          نوع تریگر
                        </label>
                        <select
                          value={navAnimation.type}
                          onChange={(e) => handleNavAnimationChange('type', e.target.value)}
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
                          value={navAnimation.animation.type}
                          onChange={(e) => handleNavAnimationChange('animation.type', e.target.value)}
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
                          {animationService.getAnimationPreview(navAnimation.animation.type)}
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
                          value={parseFloat(navAnimation.animation.duration.replace('s', '')) || 1}
                          onChange={(e) => handleNavAnimationChange('animation.duration', e.target.value)}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="text-gray-500 text-xs mt-1">
                          فعلی: {navAnimation.animation.duration}
                        </div>
                      </div>

                      {/* Timing Function */}
                      <div>
                                                <label className="block mb-1 text-sm font-medium text-gray-700">
                          تابع زمان‌بندی
                        </label>
                        <select
                          value={navAnimation.animation.timing}
                          onChange={(e) => handleNavAnimationChange('animation.timing', e.target.value)}
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
                          value={parseFloat((navAnimation.animation.delay || '0s').replace('s', '')) || 0}
                          onChange={(e) => handleNavAnimationChange('animation.delay', e.target.value)}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="text-gray-500 text-xs mt-1">
                          فعلی: {navAnimation.animation?.delay || '0s'}
                        </div>
                      </div>

                      {/* Iteration Count */}
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          تعداد تکرار
                        </label>
                        <select
                          value={navAnimation.animation.iterationCount || '1'}
                          onChange={(e) => handleNavAnimationChange('animation.iterationCount', e.target.value)}
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
                      <AnimationPreview effects={[navAnimation]} />
                    </div>

                    {/* Animation Info */}
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <h6 className="font-medium text-blue-800 mb-2">اطلاعات انیمیشن</h6>
                      <div className="text-sm text-blue-700 space-y-1">
                        <div>
                          <strong>CSS تولید شده:</strong>
                          <code className="block mt-1 p-2 bg-white rounded text-xs overflow-x-auto">
                            {animationService.generateCSS(navAnimation.animation)}
                          </code>
                        </div>
                        <div className="mt-2">
                          <strong>وضعیت اعتبار:</strong>
                          <span className={`ml-2 px-2 py-1 rounded text-xs ${
                            animationService.validateConfig(navAnimation.animation)
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {animationService.validateConfig(navAnimation.animation) ? 'معتبر' : 'نامعتبر'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!navAnimation && (
                  <div className="text-center text-gray-500 py-8 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="mb-2">⚡</div>
                    <div>انیمیشن دکمه‌های ناوبری غیرفعال است</div>
                    <div className="text-sm mt-1">برای فعال کردن چک‌باکس بالا را انتخاب کنید</div>
                  </div>
                )}
              </div>

              {/* Background Settings */}
              <div className="space-y-4 rounded-lg">
                <h4 className="font-bold text-sky-700 mb-3">
                  تنظیمات پس زمینه
                </h4>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg">
                    <ColorInput
                      label="رنگ  پس زمینه"
                      name="backgroundColorBox"
                      value={
                        userInputData?.setting?.backgroundColorBox?.toString() ??
                        "#ffffff"
                      }
                      onChange={handleSettingChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isSpacingOpen && (
          <div className="p-4 border-t border-gray-100 animate-slideDown">
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
    </>
  );
};

