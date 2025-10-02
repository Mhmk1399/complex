import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, SlideSection, SlideBlock, AnimationEffect } from "@/lib/types";
import React from "react";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";
import ImageSelectorModal from "../sections/ImageSelectorModal";
import { animationService } from "@/services/animationService";
import { AnimationPreview } from "../animationPreview";
import { HiChevronDown, HiSparkles } from "react-icons/hi";
import { useSharedContext } from "@/app/contexts/SharedContext";
import {
  DynamicRangeInput,
  DynamicSelectInput,
  ColorInput,
} from "./DynamicInputs";

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

export const SlideForm: React.FC<SlideFormProps> = ({
  setUserInputData,
  userInputData,
  layout,
  selectedComponent,
}) => {
  const [isStyleSettingsOpen, setIsStyleSettingsOpen] = useState(false);
  const [isSpacingOpen, setIsSpacingOpen] = useState(false);
  const [isContentOpen, setIsContentOpen] = useState({});
  const [isAnimationOpen, setIsAnimationOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
  const [currentEditingIndex, setCurrentEditingIndex] = useState<number>(0);
  const { activeRoutes } = useSharedContext();
  const [useRouteSelectBtn, setUseRouteSelectBtn] = useState(false);
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
    setIsUpdating(true);

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
          marginLeft: updatedValues.left.toString(),
          marginRight: updatedValues.right.toString(),
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
    setUserInputData((prev: SlideSection) => {
      // Prevent deletion if only one slide remains
      if (prev.blocks.length <= 1) {
        return prev;
      }
      return {
        ...prev,
        blocks: prev.blocks.filter((_, i) => i !== index),
      };
    });
  };

  // Animation handlers for navigation buttons
  const handleNavAnimationToggle = (enabled: boolean) => {
    if (enabled) {
      const defaultConfig = animationService.getDefaultConfig("pulse");
      const defaultEffect: AnimationEffect = {
        type: "hover",
        animation: defaultConfig,
      };

      setUserInputData((prev) => ({
        ...prev,
        setting: {
          ...prev.setting,
          navAnimation: defaultEffect,
        },
      }));
    } else {
      setUserInputData((prev) => ({
        ...prev,
        setting: {
          ...prev.setting,
          navAnimation: undefined,
        },
      }));
    }
  };

  const handleNavAnimationChange = (field: string, value: string | number) => {
    setUserInputData((prev) => {
      const currentAnimation = prev.setting?.navAnimation;
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
        setting: {
          ...prev.setting,
          navAnimation: updatedAnimation,
        },
      };
    });
  };

  // Animation handlers for slide images
  const handleImageAnimationToggle = (enabled: boolean) => {
    if (enabled) {
      const defaultConfig = animationService.getDefaultConfig("glow");
      const defaultEffect: AnimationEffect = {
        type: "hover",
        animation: defaultConfig,
      };

      setUserInputData((prev) => ({
        ...prev,
        setting: {
          ...prev.setting,
          imageAnimation: defaultEffect,
        },
      }));
    } else {
      setUserInputData((prev) => ({
        ...prev,
        setting: {
          ...prev.setting,
          imageAnimation: undefined,
        },
      }));
    }
  };

  const handleImageAnimationChange = (
    field: string,
    value: string | number
  ) => {
    setUserInputData((prev) => {
      const currentAnimation = prev.setting?.imageAnimation;
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
        setting: {
          ...prev.setting,
          imageAnimation: updatedAnimation,
        },
      };
    });
  };

  // Animation handlers for slide buttons
  const handleBtnAnimationToggle = (enabled: boolean) => {
    if (enabled) {
      const defaultConfig = animationService.getDefaultConfig("brightness");
      const defaultEffect: AnimationEffect = {
        type: "hover",
        animation: defaultConfig,
      };

      setUserInputData((prev) => ({
        ...prev,
        setting: {
          ...prev.setting,
          btnAnimation: defaultEffect,
        },
      }));
    } else {
      setUserInputData((prev) => ({
        ...prev,
        setting: {
          ...prev.setting,
          btnAnimation: undefined,
        },
      }));
    }
  };

  const handleBtnAnimationChange = (field: string, value: string | number) => {
    setUserInputData((prev) => {
      const currentAnimation = prev.setting?.btnAnimation;
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
        setting: {
          ...prev.setting,
          btnAnimation: updatedAnimation,
        },
      };
    });
  };

  if (!userInputData?.blocks) {
    return null;
  }

  const handleTabChange = (
    tab: "content" | "style" | "spacing" | "animation"
  ) => {
    setIsContentOpen(tab === "content");
    setIsStyleSettingsOpen(tab === "style");
    setIsSpacingOpen(tab === "spacing");
    setIsAnimationOpen(tab === "animation");
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
                <div className="mb-6 animate-slideDown bg-white rounded-xl shadow-sm border border-gray-100 mt-4">
                  <button
                    onClick={() =>
                      setIsContentOpen((prev) => ({
                        ...prev,
                        [index]: !prev[index as keyof typeof prev],
                      }))
                    }
                    className="w-full  flex justify-between items-center p-2 hover: rounded-xl transition-all duration-200"
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
                            if (userInputData.blocks.length > 1) {
                              handleDeleteBlock(index);
                            }
                          }}
                          className={`p-1 rounded-full mr-16 transition-colors ${
                            userInputData.blocks.length <= 1
                              ? "bg-gray-100 cursor-not-allowed opacity-50"
                              : "hover:bg-red-100 cursor-pointer"
                          }`}
                        >
                          <svg
                            className={`w-5 h-5 ${
                              userInputData.blocks.length <= 1
                                ? "text-gray-400"
                                : "text-red-500"
                            }`}
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
                        <div className="flex flex-col gap-2">
                          <input
                            type="text"
                            value={block.imageSrc || ""}
                            onChange={(e) =>
                              handleBlockChange(e, index, "imageSrc")
                            }
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="آدرس تصویر"
                          />
                          <button
                            onClick={() => {
                              setCurrentEditingIndex(index);
                              setIsImageSelectorOpen(true);
                            }}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                            type="button"
                          >
                            انتخاب تصویر
                          </button>
                        </div>
                      </div>
                      <div className="p-3  rounded-lg">
                        <label className="block mb-2 text-sm font-bold text-gray-700">
                          متن جایگزین تصویر
                        </label>
                        <input
                          type="text"
                          placeholder="متن جایگزین تصویر"
                          value={block.imageAlt || ""}
                          onChange={(e) =>
                            handleBlockChange(e, index, "imageAlt")
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
                        <div className="mb-2">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={useRouteSelectBtn}
                              onChange={(e) =>
                                setUseRouteSelectBtn(e.target.checked)
                              }
                              className="rounded"
                            />
                            <span className="text-sm">
                              انتخاب از مسیرهای موجود
                            </span>
                          </label>
                        </div>
                        {useRouteSelectBtn ? (
                          <select
                            value={block?.btnLink ?? ""}
                            onChange={(
                              e: React.ChangeEvent<HTMLSelectElement>
                            ) => {
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
                            value={block?.btnLink ?? ""}
                            onChange={(e) =>
                              handleBlockChange(e, index, "btnLink")
                            }
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="آدرس لینک یا مسیر سفارشی"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </React.Fragment>
            ))}

            {/* Add Block Button - Outside of the map */}
            <button
              onClick={handelAddBlock}
              title="افزودن اسلاید"
              className="px-1 rounded-lg mb-3 w-full text-3xl group hover:font-extrabold transition-all"
            >
              +
              <div className="bg-blue-500 w-full pb-0.5 group-hover:bg-blue-600 group-hover:pb-1 transition-all"></div>
            </button>
          </>
        )}

        {isStyleSettingsOpen && (
          <div className="p-4 animate-slideDown">
            <div className="grid grid-cols-1 gap-6">
              {/* Text Settings */}
              <div className="space-y-4 rounded-lg">
                <h4 className="font-bold text-sky-700 mb-3">تنظیمات سربرگ</h4>
                <div className=" ">
                  <DynamicRangeInput
                    label="سایز"
                    name="textFontSize"
                    min={10}
                    max={100}
                    step={1}
                    value={userInputData?.setting?.textFontSize || 15}
                    onChange={handleSettingChange}
                    displayUnit="px"
                  />

                  <DynamicSelectInput
                    label="وزن متن"
                    name="textFontWeight"
                    value={userInputData?.setting?.textFontWeight ?? "400"}
                    options={[
                      { value: "bold", label: "ضخیم" },
                      { value: "normal", label: "نرمال" },
                    ]}
                    onChange={handleSettingChange}
                  />

                  <ColorInput
                    label="رنگ سربرگ"
                    name="textColor"
                    value={
                      userInputData?.setting?.textColor?.toString() ?? "#ffffff"
                    }
                    onChange={handleSettingChange}
                  />
                </div>
              </div>

              {/* Description Settings */}
              <div className="space-y-4 rounded-lg">
                <h4 className="font-bold text-sky-700 mb-3">تنظیمات توضیحات</h4>
                <div className=" ">
                  <DynamicRangeInput
                    label="سایز"
                    name="descriptionFontSize"
                    min={10}
                    max={100}
                    step={1}
                    value={userInputData?.setting?.descriptionFontSize || 15}
                    onChange={handleSettingChange}
                    displayUnit="px"
                  />

                  <DynamicSelectInput
                    label="وزن متن"
                    name="descriptionFontWeight"
                    value={
                      userInputData?.setting?.descriptionFontWeight ?? "400"
                    }
                    options={[
                      { value: "bold", label: "ضخیم" },
                      { value: "normal", label: "نرمال" },
                    ]}
                    onChange={handleSettingChange}
                  />

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

              {/* Image Settings */}
              <div className="space-y-4 rounded-lg">
                <h4 className="font-bold text-sky-700 mb-3">تنظیمات تصویر</h4>
                <div className=" ">
                  <DynamicRangeInput
                    label="عرض"
                    name="imageWidth"
                    min={10}
                    max={2000}
                    step={1}
                    value={userInputData?.setting?.imageWidth || 200}
                    onChange={handleSettingChange}
                    displayUnit="px"
                  />
                  <DynamicRangeInput
                    label="ارتفاع"
                    name="imageHeight"
                    min={10}
                    max={1000}
                    step={1}
                    value={userInputData?.setting?.imageHeight || 200}
                    onChange={handleSettingChange}
                    displayUnit="px"
                  />
                  <DynamicRangeInput
                    label="انحنا"
                    name="imageRadious"
                    min={0}
                    max={200}
                    step={1}
                    value={userInputData?.setting?.imageRadious || 15}
                    onChange={handleSettingChange}
                    displayUnit="px"
                  />

                  {/* Opacity Select as DynamicSelectInput */}
                  <DynamicSelectInput
                    label="شفافیت تصویر"
                    name="opacityImage"
                    value={
                      userInputData?.setting?.opacityImage?.toString() ?? "1"
                    }
                    options={Array.from({ length: 11 }, (_, i) => {
                      const value = (i / 10).toString();
                      return { value, label: value };
                    })}
                    onChange={handleSettingChange}
                  />

                  <DynamicSelectInput
                    label="رفتار تصویر"
                    name="imageBehavior"
                    value={
                      userInputData?.setting?.imageBehavior?.toString() ?? "1"
                    }
                    options={[
                      { value: "cover", label: "پوشش" },
                      { value: "contain", label: "شامل" },
                      { value: "fill", label: "کامل" },
                    ]}
                    onChange={handleSettingChange}
                  />
                </div>
              </div>

              {/* Button Settings */}
              <div className="space-y-4 rounded-lg">
                <h4 className="font-bold text-sky-700 mb-3">تنظیمات دکمه</h4>
                <div className=" ">
                  <DynamicRangeInput
                    label="عرض"
                    name="btnWidth"
                    min={0}
                    max={500}
                    step={1}
                    value={userInputData?.setting?.btnWidth || 100}
                    onChange={handleSettingChange}
                    displayUnit="px"
                  />
                  <DynamicRangeInput
                    label="انحنا"
                    name="btnRadius"
                    min={0}
                    max={20}
                    step={1}
                    value={userInputData?.setting?.btnRadius || 100}
                    onChange={handleSettingChange}
                    displayUnit="px"
                  />
                  <ColorInput
                    label="رنگ متن دکمه"
                    name="btnTextColor"
                    value={
                      userInputData?.setting?.btnTextColor?.toString() ??
                      "#ffffff"
                    }
                    onChange={handleSettingChange}
                  />

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
              </div>
              <div className="space-y-4 rounded-lg">
                <h4 className="font-bold text-sky-700 mb-3">
                  تنظیمات دکمه های ناوبری
                </h4>
                <div className=" ">
                  <ColorInput
                    label="رنگ دکمه"
                    name="navColor"
                    value={
                      userInputData?.setting?.navColor?.toString() ?? "#ffffff"
                    }
                    onChange={handleSettingChange}
                  />

                  <ColorInput
                    label="رنگ پس زمینه دکمه"
                    name="navBg"
                    value={
                      userInputData?.setting?.navBg?.toString() ?? "#ffffff"
                    }
                    onChange={handleSettingChange}
                  />
                  <DynamicRangeInput
                    label="انحنا"
                    name="navRadius"
                    min={0}
                    max={20}
                    step={1}
                    value={userInputData?.setting?.navRadius || 100}
                    onChange={handleSettingChange}
                    displayUnit="px"
                  />
                </div>
              </div>

              {/* Background Settings */}
              <div className="space-y-4 rounded-lg">
                <h4 className="font-bold text-sky-700 mb-3">
                  تنظیمات پس زمینه
                </h4>
                <div className="space-y-3">
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
              {/* ✅ New Shadow Settings */}
              <div className="space-y-4 rounded-lg">
                <h4 className="font-bold text-sky-700 my-3">تنظیمات سایه</h4>
                <DynamicRangeInput
                  label="افست افقی سایه"
                  name="shadowOffsetX"
                  min="-50"
                  max="50"
                  value={userInputData?.setting?.shadowOffsetX?.toString() ?? "0"}
                  onChange={handleSettingChange}
                />
                <DynamicRangeInput
                  label="افست عمودی سایه"
                  name="shadowOffsetY"
                  min="-50"
                  max="50"
                  value={userInputData?.setting?.shadowOffsetY?.toString() ?? "0"}
                  onChange={handleSettingChange}
                />
                <DynamicRangeInput
                  label="میزان بلور سایه"
                  name="shadowBlur"
                  min="0"
                  max="100"
                  value={userInputData?.setting?.shadowBlur?.toString() ?? "0"}
                  onChange={handleSettingChange}
                />
                <DynamicRangeInput
                  label="میزان گسترش سایه"
                  name="shadowSpread"
                  min="-20"
                  max="20"
                  value={userInputData?.setting?.shadowSpread?.toString() ?? "0"}
                  onChange={handleSettingChange}
                />
                <ColorInput
                  label="رنگ سایه"
                  name="shadowColor"
                  value={userInputData?.setting?.shadowColor?.toString() ?? "0"}
                  onChange={handleSettingChange}
                />
              </div>
            </div>
          </div>
        )}

        {isAnimationOpen && (
          <div className="space-y-4 animate-slideDown">
            <div className="rounded-lg flex flex-col gap-3 border border-gray-200 p-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <HiSparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-800">
                    انیمیشن تصویر
                  </span>
                </div>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!imageAnimation}
                    onChange={(e) =>
                      handleImageAnimationToggle(e.target.checked)
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-[42px] h-5 rounded-full transition-colors duration-200 ${
                      imageAnimation ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 mt-0.5 ${
                        imageAnimation ? "-translate-x-6" : "-translate-x-0.5"
                      }`}
                    />
                  </div>
                </label>
              </div>

              {imageAnimation && (
                <div className="space-y-4 p-4 bg-transparent border border-gray-200 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-700">
                    تنظیمات انیمیشن تصاویر
                  </h5>

                  {/* Trigger & Animation Type */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        تریگر
                      </label>
                      <select
                        value={imageAnimation.type}
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
                        value={imageAnimation.animation.type}
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
                      <div className="text-xs text-gray-500 mt-1">
                        {animationService.getAnimationPreview(
                          imageAnimation.animation.type
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
                            imageAnimation.animation.duration.replace("s", "")
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
                        value={imageAnimation.animation.iterationCount || "1"}
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
                          value={imageAnimation.animation.timing}
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
                      <AnimationPreview effects={[imageAnimation]} />
                    </div>
                  </div>
                </div>
              )}
              {!imageAnimation && (
                <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <HiSparkles className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  <p className="text-xs">انیمیشن تصویر غیرفعال</p>
                </div>
              )}
            </div>

            <div className="rounded-lg flex flex-col gap-3 border border-gray-200 p-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <HiSparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-800">
                    انیمیشن دکمه‌های قبل/بعد
                  </span>
                </div>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!navAnimation}
                    onChange={(e) => handleNavAnimationToggle(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-[42px] h-5 rounded-full transition-colors duration-200 ${
                      navAnimation ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 mt-0.5 ${
                        navAnimation ? "-translate-x-6" : "-translate-x-0.5"
                      }`}
                    />
                  </div>
                </label>
              </div>

              {navAnimation && (
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
                        value={navAnimation.type}
                        onChange={(e) =>
                          handleNavAnimationChange("type", e.target.value)
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
                        value={navAnimation.animation.type}
                        onChange={(e) =>
                          handleNavAnimationChange(
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
                      <div className="text-xs text-gray-500 mt-1">
                        {animationService.getAnimationPreview(
                          navAnimation.animation.type
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
                            navAnimation.animation.duration.replace("s", "")
                          ) || 1
                        }
                        onChange={(e) =>
                          handleNavAnimationChange(
                            "animation.duration",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        فعلی: {navAnimation.animation.duration}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        تکرار
                      </label>
                      <select
                        value={navAnimation.animation.iterationCount || "1"}
                        onChange={(e) =>
                          handleNavAnimationChange(
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
                          value={navAnimation.animation.timing}
                          onChange={(e) =>
                            handleNavAnimationChange(
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
                              (navAnimation.animation.delay || "0s").replace(
                                "s",
                                ""
                              )
                            ) || 0
                          }
                          onChange={(e) =>
                            handleNavAnimationChange(
                              "animation.delay",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          فعلی: {navAnimation.animation?.delay || "0s"}
                        </div>
                      </div>
                    </div>
                  </details>

                  {/* Mini Preview with Animation Info */}
                  <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
                    <div className="text-center mb-3">
                      <p className="text-xs text-gray-600 mb-2">پیش‌نمایش</p>
                      <AnimationPreview effects={[navAnimation]} />
                    </div>
                  </div>
                </div>
              )}

              {!navAnimation && (
                <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <HiSparkles className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  <p className="text-xs">انیمیشن دکمه‌های ناوبری غیرفعال </p>
                </div>
              )}
            </div>

            <div className="rounded-lg flex flex-col gap-3 border border-gray-200 p-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <HiSparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-800">
                    انیمیشن دکمه
                  </span>
                </div>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!btnAnimation} // Convert to boolean using double negation                    onChange={(e) => handleBtnAnimationToggle(e.target.checked)}
                    className="sr-only"
                    onChange={(e) => handleBtnAnimationToggle(e.target.checked)}
                  />
                  <div
                    className={`w-[42px] h-5 rounded-full transition-colors duration-200 ${
                      btnAnimation ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 mt-0.5 ${
                        btnAnimation ? "-translate-x-6" : "-translate-x-0.5"
                      }`}
                    />
                  </div>
                </label>
              </div>

              {btnAnimation && (
                <div className="space-y-4 p-4 bg-transparent border border-gray-200 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-700">
                    تنظیمات انیمیشن دکمه
                  </h5>

                  {/* Trigger & Animation Type */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        تریگر
                      </label>
                      <select
                        value={btnAnimation.type}
                        onChange={(e) =>
                          handleBtnAnimationChange("type", e.target.value)
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
                        value={btnAnimation.animation.type}
                        onChange={(e) =>
                          handleBtnAnimationChange(
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
                      <div className="text-xs text-gray-500 mt-1">
                        {animationService.getAnimationPreview(
                          btnAnimation.animation.type
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
                            btnAnimation.animation.duration.replace("s", "")
                          ) || 1
                        }
                        onChange={(e) =>
                          handleBtnAnimationChange(
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
                        value={btnAnimation.animation.iterationCount || "1"}
                        onChange={(e) =>
                          handleBtnAnimationChange(
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
                          value={btnAnimation.animation.timing}
                          onChange={(e) =>
                            handleBtnAnimationChange(
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
                      <AnimationPreview effects={[btnAnimation]} />
                    </div>
                  </div>
                </div>
              )}
              {!btnAnimation && (
                <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <HiSparkles className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  <p className="text-xs">انیمیشن دکمه غیرفعال</p>
                </div>
              )}
            </div>
          </div>
        )}

        {isSpacingOpen && (
          <div className="animate-slideDown">
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
          onSelectImage={(image) => {
            setUserInputData((prev: SlideSection) => {
              const blocks = [...prev.blocks];
              blocks[currentEditingIndex] = {
                ...blocks[currentEditingIndex],
                imageSrc: image.url,
              };
              return {
                ...prev,
                blocks,
              };
            });
            setIsImageSelectorOpen(false);
          }}
        />
      </div>
    </>
  );
};
