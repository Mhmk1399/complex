import React, { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import {
  Layout,
  CollapseSection,
  CollapseBlock,
  CollapseBlockSetting,
  AnimationEffect,
} from "@/lib/types";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";
import { animationService } from "@/services/animationService";
import { AnimationPreview } from "../animationPreview";
import { HiChevronDown, HiSparkles, HiTrash, HiPlus } from "react-icons/hi";
import {
  ColorInput,
  DynamicRangeInput,
  DynamicSelectInput,
} from "./DynamicInputs";
interface BoxValues {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface CollapseFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<CollapseSection>>;
  userInputData: CollapseSection & { blocks?: CollapseBlock[] };
  layout: Layout;
  selectedComponent: string;
}

export const CollapseForm: React.FC<CollapseFormProps> = ({
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
  const [openAccordions, setOpenAccordions] = useState<Record<number, boolean>>(
    {}
  );
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
      setUserInputData((prev: CollapseSection) => ({
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
      setUserInputData((prev: CollapseSection) => ({
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

  const handleAddBlock = () => {
    setUserInputData((prev: CollapseSection) => {
      const prevBlocks = Array.isArray(prev.blocks) ? prev.blocks : [];
      const newBlockNumber = prevBlocks.length + 1;

      const newBlock: CollapseBlock = {
        [`text${newBlockNumber}`]: `سوال متداول ${newBlockNumber}`,
        [`content${newBlockNumber}`]: `لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد ${newBlockNumber}`,
        setting: {
          // Copy default settings from existing block or provide defaults
          ...prev.blocks[0]?.setting,

          // Override with block-specific properties
          [`textColor${newBlockNumber}`]: "#ffffff",
          [`textFontSize${newBlockNumber}`]: "20",
          [`textFontWeight${newBlockNumber}`]: "bold",
          [`contentColor${newBlockNumber}`]: "#FCA311",
          [`contentFontSize${newBlockNumber}`]: "16",
          [`contentFontWeight${newBlockNumber}`]: "normal",
        },
        links: [],
      };

      return {
        ...prev,
        blocks: [...(Array.isArray(prev.blocks) ? prev.blocks : []), newBlock],
      };
    });
  };

  const handleDeleteBlock = (index: number) => {
    // Prevent deleting if only one block remains
    const safeBlocks = Array.isArray(userInputData?.blocks)
      ? userInputData.blocks
      : [];
    if (safeBlocks.length <= 1) {
      return;
    }

    setUserInputData((prev: CollapseSection) => {
      // Remove the block at the specified index
      const safeBlocks = Array.isArray(prev.blocks) ? prev.blocks : [];
      const updatedBlocks = safeBlocks.filter((_, i) => i !== index);

      // Reindex the remaining blocks to maintain consistent numbering
      const reindexedBlocks = updatedBlocks.map((block, newIndex) => {
        const newBlockNumber = newIndex + 1;
        const oldBlockNumber = prev.blocks.findIndex((b) => b === block) + 1;

        const reindexedBlock: CollapseBlock = {
          setting: { ...block.setting },
          links: block.links || [],
        };

        // Find the original text and content values from the block
        const originalTextKey = Object.keys(block).find((key) =>
          key.startsWith("text")
        ) as keyof CollapseBlock | undefined;

        const originalContentKey = Object.keys(block).find((key) =>
          key.startsWith("content")
        ) as keyof CollapseBlock | undefined;

        // Preserve the original values but with new keys - with proper type checking
        if (originalTextKey && block[originalTextKey]) {
          const textValue = block[originalTextKey];
          if (typeof textValue === "string") {
            const textKey = `text${newBlockNumber}` as keyof Pick<
              CollapseBlock,
              "text1" | "text2" | "text3" | "text4"
            >;
            (reindexedBlock as unknown as Record<string, string>)[textKey] =
              textValue;
          }
        }

        if (originalContentKey && block[originalContentKey]) {
          const contentValue = block[originalContentKey];
          if (typeof contentValue === "string") {
            const contentKey = `content${newBlockNumber}` as keyof Pick<
              CollapseBlock,
              "content1" | "content2" | "content3" | "content4"
            >;
            (reindexedBlock as unknown as Record<string, string>)[contentKey] =
              contentValue;
          }
        }

        // Handle heading if it exists
        if (block.heading) {
          reindexedBlock.heading = block.heading;
        }

        // Reindex the setting keys while preserving values
        if (block.setting) {
          const newSetting = { ...block.setting };

          // Update setting keys that contain the old block number
          Object.keys(block.setting).forEach((key) => {
            if (key.includes(`${oldBlockNumber}`)) {
              const newKey = key.replace(
                `${oldBlockNumber}`,
                `${newBlockNumber}`
              );
              const settingValue =
                block.setting[key as keyof CollapseBlockSetting];
              if (settingValue !== undefined) {
                (newSetting as unknown as Record<string, unknown>)[newKey] =
                  settingValue;
              }
            }
          });

          // Clean up old numbered keys that don't match the new block number
          Object.keys(newSetting).forEach((key) => {
            const match = key.match(/(\d+)$/);
            if (
              match &&
              parseInt(match[1]) !== newBlockNumber &&
              parseInt(match[1]) === oldBlockNumber
            ) {
              delete (newSetting as unknown as Record<string, unknown>)[key];
            }
          });

          reindexedBlock.setting = newSetting;
        }

        return reindexedBlock;
      });

      return {
        ...prev,
        blocks: reindexedBlocks,
      };
    });

    // Clean up open accordions that might be out of range
    setOpenAccordions((prev) => {
      const updated = { ...prev };
      // Remove accordion states for indices that no longer exist
      Object.keys(updated).forEach((key) => {
        const idx = parseInt(key);
        if (idx >= (userInputData?.blocks?.length || 0) - 1) {
          delete updated[idx];
        }
      });
      return updated;
    });
  };

  useEffect(() => {
    const initialData = Compiler(layout, selectedComponent)[0];
    if (initialData) {
      const defaultBlocks = [1, 2, 3, 4].map((num) => ({
        [`text${num}`]: `سوال متداول ${num}`,
        [`content${num}`]: `پاسخ سوال متداول ${num}`,
        setting: {
          [`textColor${num}`]: "#ffffff",
          [`textFontSize${num}`]: "20",
          [`textFontWeight${num}`]: "bold",
          [`contentColor${num}`]: "#FCA311",
          [`contentFontSize${num}`]: "16",
          [`contentFontWeight${num}`]: "normal",
        },
        links: [],
      }));

      setUserInputData({
        ...initialData,
        heading: "آکاردئون های متداول",
        blocks:
          Array.isArray(initialData?.blocks) && initialData.blocks.length > 0
            ? initialData.blocks
            : defaultBlocks,
      });
    }
  }, [selectedComponent]);

  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isUpdating) return;
    setIsUpdating(true);

    const { name, value } = e.target;
    setUserInputData((prev: CollapseSection) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value,
      },
    }));

    setTimeout(() => setIsUpdating(false), 100);
  };

  const handleBlockSettingChange = (
    index: number,
    field: string,
    value: string
  ) => {
    if (isUpdating) return;
    setIsUpdating(true);

    setUserInputData((prev: CollapseSection) => ({
      ...prev,
      blocks: (Array.isArray(prev?.blocks) ? prev.blocks : []).map(
        (block: CollapseBlock, i: number) => {
          if (i === index) {
            return {
              ...block,
              setting: { ...block.setting, [field]: value },
            };
          }
          return block;
        }
      ),
    }));

    setTimeout(() => setIsUpdating(false), 100);
  };

  const handleBlockChange = (index: number, field: string, value: string) => {
    if (isUpdating) return;
    setIsUpdating(true);

    setUserInputData((prev: CollapseSection) => ({
      ...prev,
      blocks: (Array.isArray(prev?.blocks) ? prev.blocks : []).map(
        (block: CollapseBlock, i: number) => {
          if (i === index) {
            return { ...block, [field]: value };
          }
          return block;
        }
      ),
    }));

    setTimeout(() => setIsUpdating(false), 100);
  };

  // Global animation handlers for all accordion headers
  const handleAnimationToggle = (enabled: boolean) => {
    if (enabled) {
      const defaultConfig = animationService.getDefaultConfig("pulse");
      const defaultEffect: AnimationEffect = {
        type: "hover",
        animation: defaultConfig,
      };

      setUserInputData((prev: CollapseSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          headerAnimation: defaultEffect,
        },
      }));
    } else {
      setUserInputData((prev: CollapseSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          headerAnimation: undefined,
        },
      }));
    }
  };

  const handleAnimationChange = (field: string, value: string | number) => {
    setUserInputData((prev: CollapseSection) => {
      const currentAnimation = prev.setting?.headerAnimation;
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
        setting: {
          ...prev.setting,
          headerAnimation: updatedAnimation,
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
  const currentAnimation = userInputData?.setting?.headerAnimation;
  const hasAnimation = !!currentAnimation;

  return (
    <>
      <div className="p-2 max-w-4xl space-y-2 rounded" dir="rtl">
        <h2 className="text-lg font-bold mb-4">تنظیمات آکاردئون</h2>

        {/* Tabs */}
        <TabButtons onTabChange={handleTabChange} />
        {/* content Settings */}
        {isContentOpen && (
          <div className="p-2 animate-slideDown">
            {/* Main Heading Section */}
            <div className="mb-6   rounded-xl  ">
              <label className="  mb-3 font-bold text-gray-800 flex items-center gap-2">
                متن سربرگ
              </label>
              <input
                type="text"
                value={userInputData?.blocks?.[0]?.heading ?? ""}
                onChange={(e) =>
                  handleBlockChange(0, "heading", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                placeholder="عنوان اصلی بخش را وارد کنید"
              />
            </div>

            {/* Add New Block Button */}
            <div className="mb-6">
              <button
                onClick={handleAddBlock}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg w-full justify-center"
              >
                <HiPlus className="w-5 h-5" />
                افزودن آکاردئون جدید
              </button>
            </div>

            {/* Accordions Section Header */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
                آکاردئون‌ها
              </h3>
              <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {Array.isArray(userInputData?.blocks)
                  ? userInputData.blocks.length
                  : 0}{" "}
                آیتم
              </span>
            </div>

            {/* Accordions List */}
            <div className="space-y-4">
              {Array.isArray(userInputData?.blocks) &&
                userInputData.blocks.map((block, index) => {
                  const totalBlocks = userInputData.blocks?.length || 0;

                  return (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                    >
                      {/* Accordion Header */}
                      <div className="flex justify-between items-center p-1 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        <button
                          onClick={() =>
                            setOpenAccordions((prev) => ({
                              ...prev,
                              [index]: !prev[index],
                            }))
                          }
                          className="flex items-center gap-3 flex-1 text-left hover:bg-white/50 p-2 rounded-lg transition-colors"
                        >
                          <div>
                            <p className="text-sm text-gray-500 truncate max-w-xs">
                              {String(
                                block[
                                  `text${index + 1}` as keyof typeof block
                                ] || "بدون عنوان"
                              )}
                            </p>
                          </div>
                          <svg
                            className={`w-5 h-5 text-gray-400 transition-transform duration-200 mr-auto ${
                              openAccordions[index] ? "rotate-180" : ""
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

                        {/* Delete Button - Only show if more than 1 block */}
                        <div className="flex items-center gap-2">
                          {totalBlocks > 1 ? (
                            <button
                              onClick={() => handleDeleteBlock(index)}
                              className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors duration-200"
                              title="حذف آکاردئون"
                            >
                              <HiTrash className="w-4 h-4" />
                            </button>
                          ) : (
                            <span className="text-xs text-red-500 bg-gray-100 px-3 py-2 rounded-lg">
                              غیر قابل
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Accordion Content */}
                      {openAccordions[index] && (
                        <div className="p-6 animate-slideDown">
                          <div className="space-y-6">
                            {/* Title Input */}
                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-gray-700">
                                عنوان آکاردئون
                              </label>
                              <input
                                type="text"
                                value={String(
                                  block[
                                    `text${index + 1}` as keyof typeof block
                                  ] || ""
                                )}
                                onChange={(e) =>
                                  handleBlockChange(
                                    index,
                                    `text${index + 1}`,
                                    e.target.value
                                  )
                                }
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="عنوان این آکاردئون را وارد کنید"
                              />
                            </div>

                            {/* Content Textarea */}
                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-gray-700">
                                محتوای آکاردئون
                              </label>
                              <textarea
                                value={String(
                                  block[
                                    `content${index + 1}` as keyof typeof block
                                  ] || ""
                                )}
                                onChange={(e) =>
                                  handleBlockChange(
                                    index,
                                    `content${index + 1}`,
                                    e.target.value
                                  )
                                }
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                rows={4}
                                placeholder="محتوای تفصیلی این آکاردئون را وارد کنید"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>

            {/* Empty State */}
            {(!userInputData?.blocks || userInputData.blocks.length === 0) && (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  هیچ آکاردئونی اضافه نشده است
                </h3>
                <p className="text-gray-500 mb-6">
                  برای شروع، اولین آکاردئون خود را اضافه کنید
                </p>
                <button
                  onClick={handleAddBlock}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <HiPlus className="w-5 h-5" />
                  اولین آکاردئون را اضافه کنید
                </button>
              </div>
            )}
          </div>
        )}

        {/* Style Settings */}
        {isStyleSettingsOpen && (
          <div className="p-4 animate-slideDown">
            <div className="space-y-6">
              {/* Header Settings */}
              <div>
                <h4 className="font-semibold mb-2 text-sky-700">
                  تنظیمات سربرگ
                </h4>
                <DynamicRangeInput
                  label="سایز"
                  name="headingFontSize"
                  min="0"
                  max="100"
                  value={userInputData?.setting?.headingFontSize || "250"}
                  onChange={handleSettingChange}
                />{" "}
                <DynamicSelectInput
                  label="وزن"
                  name="headingFontWeight"
                  value={userInputData?.setting?.headingFontWeight ?? "normal"}
                  options={[
                    { value: "normal", label: "نرمال" },
                    { value: "bold", label: "ضخیم" },
                  ]}
                  onChange={(e) =>
                    handleSettingChange(
                      e as unknown as React.ChangeEvent<HTMLInputElement>
                    )
                  }
                />
                <ColorInput
                  label="رنگ سربرگ"
                  name="headingColor"
                  value={
                    userInputData?.setting?.headingColor?.toString() ??
                    "#333333"
                  }
                  onChange={handleSettingChange}
                />
              </div>
              {/* background */}
              <div>
                <h4 className="font-semibold mb-2 text-sky-700">
                  تنظیمات پس زمینه
                </h4>
                <DynamicRangeInput
                  label="انحنا"
                  name="formRadius"
                  min="0"
                  max="100"
                  value={userInputData?.setting?.formRadius || "250"}
                  onChange={handleSettingChange}
                />{" "}
                <ColorInput
                  label="رنگ پس زمینه"
                  name="background"
                  value={
                    userInputData?.setting?.background?.toString() ?? "#333333"
                  }
                  onChange={handleSettingChange}
                />
              </div>

              {/* Individual Accordion Settings */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sky-700 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 font-semibold mb-2 text-sky-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                    />
                  </svg>
                  تنظیمات هر آکاردئون
                </h4>

                {Array.isArray(userInputData?.blocks) &&
                  userInputData.blocks.map((block, index) => (
                    <div
                      key={index}
                      className="bg-white border border-blue-200 rounded-lg p-2 shadow-sm"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <h5 className="font-bold text-gray-700">
                          آکاردئون {index + 1}
                        </h5>
                      </div>

                      <div className="grid md:grid-cols-1 gap-6">
                        {/* Title Settings */}
                        <div className="space-y-4">
                          <h6 className="font-medium text-gray-600 border-b pb-2">
                            تنظیمات عنوان
                          </h6>

                          <div className="rounded-lg flex flex-col items-center justify-between">
                            <DynamicRangeInput
                              label="سایز"
                              min="0"
                              max="100"
                              name={`textFontSize${index + 1}`}
                              value={String(
                                userInputData?.blocks?.[index]?.setting?.[
                                  `textFontSize${
                                    index + 1
                                  }` as keyof CollapseBlockSetting
                                ] ?? "16"
                              )}
                              onChange={(e) =>
                                handleBlockSettingChange(
                                  index,
                                  `textFontSize${index + 1}`,
                                  e.target.value
                                )
                              }
                            />{" "}
                            <DynamicSelectInput
                              label="وزن"
                              options={[
                                { value: "normal", label: "نرمال" },
                                { value: "bold", label: "ضخیم" },
                              ]}
                              name={`textFontWeight${index + 1}`}
                              value={
                                userInputData?.blocks?.[index]?.setting?.[
                                  `textFontWeight${
                                    index + 1
                                  }` as keyof CollapseBlockSetting
                                ]?.toString() ?? "normal"
                              }
                              onChange={(e) =>
                                handleBlockSettingChange(
                                  index,
                                  `textFontWeight${index + 1}`,
                                  e.target.value
                                )
                              }
                            />
                            <ColorInput
                              label={`رنگ عنوان`}
                              name={`textColor${index + 1}`}
                              value={String(
                                userInputData?.blocks?.[index]?.setting?.[
                                  `textColor${
                                    index + 1
                                  }` as keyof CollapseBlockSetting
                                ] ?? "#000000"
                              )}
                              onChange={(e) =>
                                handleBlockSettingChange(
                                  index,
                                  `textColor${index + 1}`,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>

                        {/* Content Settings */}
                        <div className="space-y-4">
                          <h6 className="font-medium text-gray-600 border-b pb-2">
                            تنظیمات محتوا
                          </h6>

                          <div className="rounded-lg flex flex-col items-center justify-between">
                            <DynamicRangeInput
                              label="سایز"
                              min="0"
                              max="100"
                              name={`contentFontSize${index + 1}`}
                              value={String(
                                userInputData?.blocks?.[index]?.setting?.[
                                  `contentFontSize${
                                    index + 1
                                  }` as keyof CollapseBlockSetting
                                ] ?? "14"
                              )}
                              onChange={(e) =>
                                handleBlockSettingChange(
                                  index,
                                  `contentFontSize${index + 1}`,
                                  e.target.value
                                )
                              }
                            />{" "}
                            <DynamicSelectInput
                              label="وزن"
                              options={[
                                { value: "normal", label: "نرمال" },
                                { value: "bold", label: "ضخیم" },
                              ]}
                              name={`contentFontWeight${index + 1}`}
                              value={
                                userInputData?.blocks?.[index]?.setting?.[
                                  `contentFontWeight${
                                    index + 1
                                  }` as keyof CollapseBlockSetting
                                ]?.toString() ?? "normal"
                              }
                              onChange={(e) =>
                                handleBlockSettingChange(
                                  index,
                                  `contentFontWeight${index + 1}`,
                                  e.target.value
                                )
                              }
                            />
                            <ColorInput
                              label={`رنگ محتوا`}
                              name={`contentColor${index + 1}`}
                              value={String(
                                userInputData?.blocks?.[index]?.setting?.[
                                  `contentColor${
                                    index + 1
                                  }` as keyof CollapseBlockSetting
                                ] ?? "#000000"
                              )}
                              onChange={(e) =>
                                handleBlockSettingChange(
                                  index,
                                  `contentColor${index + 1}`,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            {/* ✅ New Shadow Settings */}
            <div className="rounded-lg">
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
        )}

        {/* animation Settings */}
        {isAnimationOpen && (
          <div className="space-y-4 animate-slideDown">
            {/* Header with Toggle */}{" "}
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <HiSparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-800">
                  انیمیشن
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
                  تنظیمات انیمیشن سربرگ‌ها
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
                          handleAnimationChange(
                            "animation.delay",
                            e.target.value
                          )
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
                <p className="text-xs">انیمیشن غیرفعال است</p>
              </div>
            )}
          </div>
        )}

        {/* Spacing Settings Dropdown */}
        {isSpacingOpen && (
          <div className="animate-slideDown">
            <div className="bg-gray-50 rounded-lg flex items-center justify-center">
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
