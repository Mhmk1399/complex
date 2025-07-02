import React, { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import {
  Layout,
  CollapseSection,
  CollapseBlock,
  CollapseBlockSetting,
} from "@/lib/types";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";
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
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = (
    type: "margin" | "padding", // Add padding type here
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
          ...prev.blocks[0]?.setting, // Copy settings from first block as template

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
    setUserInputData((prev: CollapseSection) => {
      // Remove the block at the specified index
      const safeBlocks = Array.isArray(prev.blocks) ? prev.blocks : [];
      const updatedBlocks = safeBlocks.filter((_, i) => i !== index);

      // Reindex the remaining blocks to maintain consistent numbering
      const reindexedBlocks = updatedBlocks.map((block, newIndex) => {
        const newBlockNumber = newIndex + 1;
        const oldBlockNumber = prev.blocks.findIndex((b) => b === block) + 1;

        const reindexedBlock: CollapseBlock = {
          setting: { ...block.setting }, // Create a copy of the individual block's settings
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
            (reindexedBlock as unknown as Record<string, string>)[textKey] = textValue;
          }
        }

        if (originalContentKey && block[originalContentKey]) {
          const contentValue = block[originalContentKey];
          if (typeof contentValue === "string") {
            const contentKey = `content${newBlockNumber}` as keyof Pick<
              CollapseBlock,
              "content1" | "content2" | "content3" | "content4"
            >;
            (reindexedBlock as unknown as Record<string, string>)[contentKey] = contentValue;
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
                (newSetting as unknown as Record<string, unknown>)[newKey] = settingValue;
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

    // Close any open accordions that might be out of range
    setOpenAccordions((prev) => {
      const updated = { ...prev };
      // Remove accordion states for indices that no longer exist
      Object.keys(updated).forEach((key) => {
        const idx = parseInt(key);
        if (idx >= userInputData.blocks.length - 1) {
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

  const handleTabChange = (tab: "content" | "style" | "spacing") => {
    setIsContentOpen(tab === "content");
    setIsStyleSettingsOpen(tab === "style");
    setIsSpacingOpen(tab === "spacing");
  };

  useEffect(() => {
    setIsContentOpen(true);
  }, []);

  return (
    <>
      <div className="p-3 max-w-4xl space-y-2 rounded" dir="rtl">
        <h2 className="text-lg font-bold mb-4">تنظیمات آکاردئون</h2>

        {/* Tabs */}
        <TabButtons onTabChange={handleTabChange} />

        {isContentOpen && (
          <div className="p-4 ">
            <div className=" rounded-lg">
              <label htmlFor="" className="block mb-2 font-bold">
                متن سربرگ
              </label>
              <input
                type="text"
                value={userInputData?.blocks?.[0]?.heading ?? ""}
                onChange={(e) =>
                  handleBlockChange(0, "heading", e.target.value)
                }
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <br />
            {Array.isArray(userInputData?.blocks) &&
              userInputData.blocks.map((block, index) => {
                return (
                  <div
                    key={index}
                    className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100"
                  >
                    {/* Accordion Header Button */}
                    <button
                      onClick={() =>
                        setOpenAccordions((prev) => ({
                          ...prev,
                          [index]: !prev[index],
                        }))
                      }
                      className="w-full flex justify-between items-center p-4 hover:bg-gray-50 rounded-xl transition-all duration-200"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <h3 className="font-semibold text-gray-700">
                          آکاردئون {index + 1}
                        </h3>
                        <div className="flex items-center gap-2 mr-12">
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteBlock(index);
                            }}
                            className="p-1 hover:bg-red-100 rounded-full cursor-pointer"
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

                    {/* Accordion Content */}
                    {openAccordions[index] && (
                      <div className=" border-b border-gray-100 space-y-4">
                        {/* Title Input */}
                        <div className="  rounded-lg">
                          <label className="block mb-2 text-sm font-bold text-gray-700">
                            عنوان
                          </label>
                          <input
                            type="text"
                            value={String(
                              block[`text${index + 1}` as keyof typeof block] ||
                                ""
                            )}
                            onChange={(e) =>
                              handleBlockChange(
                                index,
                                `text${index + 1}`,
                                e.target.value
                              )
                            }
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                        </div>

                        {/* Content Textarea */}
                        <div className="p-3  rounded-lg">
                          <label className="block mb-2 text-sm font-bold text-gray-700">
                            محتوا
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
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            rows={3}
                          />
                        </div>

                        {/* Color Settings */}
                        <div className=" rounded-lg space-y-4">
                          <div className="rounded-lg flex items-center justify-between ">
                            <ColorInput
                              label={`رنگ عنوان ${index + 1}`}
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
                          <br />
                          <label>سایز عنوان {index + 1}</label>

                          <div className="flex items-center justify-center gap-4 p-4 rounded-lg border border-gray-300 shadow-sm">
                            <input
                              type="range"
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
                            />
                            <p className="text-sm text-gray-600 text-nowrap">
                              {String(
                                userInputData?.blocks?.[index]?.setting?.[
                                  `textFontSize${
                                    index + 1
                                  }` as keyof CollapseBlockSetting
                                ] ?? "16"
                              )}
                              px
                            </p>
                          </div>
                          <br />
                          <label>وزن عنوان {index + 1}</label>
                          <select
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
                            className="w-full p-2 border rounded"
                          >
                            <option value="light">نازک</option>
                            <option value="bold">ضخیم</option>
                          </select>
                          <div className="rounded-lg flex items-center justify-between ">
                            <ColorInput
                              label={`رنگ محتوا ${index + 1}`}
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
                          <br />
                          <label>سایز محتوا {index + 1}</label>
                          <div className="flex items-center justify-center gap-4 p-4 rounded-lg border border-gray-300 shadow-sm">
                            <input
                              type="range"
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
                            />
                            <p className="text-sm text-gray-600 text-nowrap">
                              {String(
                                userInputData?.blocks?.[index]?.setting?.[
                                  `contentFontSize${
                                    index + 1
                                  }` as keyof CollapseBlockSetting
                                ] ?? "14"
                              )}
                              px
                            </p>
                          </div>

                          <br />
                          <label>وزن محتوا {index + 1}</label>
                          <select
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
                            className="w-full p-2 border rounded"
                          >
                            <option value="light">نازک</option>
                            <option value="bold">ضخیم</option>
                          </select>
                        </div>

                      
                      </div>
                    )}
                  </div>
                );
              })}
            {/* Add Block Button */}
            <button
              onClick={handleAddBlock}
              className="px-1 rounded-lg mb-3 w-full text-3xl group hover:font-extrabold transition-all"
            >
              +
              <div className="bg-blue-500 w-full pb-0.5 group-hover:bg-blue-600 group-hover:pb-1 transition-all"></div>
            </button>
          </div>
        )}

        {/* Collapse Items */}

        {isStyleSettingsOpen && (
          <div className="p-4  animate-slideDown">
            <div className="rounded-lg flex items-center justify-between ">
              <ColorInput
                label="رنگ سربرگ"
                name="headingColor"
                value={
                  userInputData?.setting?.headingColor?.toString() ?? "#333333"
                }
                onChange={handleSettingChange}
              />
            </div>
            <br />
            <label htmlFor="">سایز سربرگ</label>
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
            <br />
            <div>
              <label className="block mb-1">وزن سربرگ</label>
              <select
                name="headingFontWeight"
                value={
                  userInputData?.setting?.headingFontWeight?.toString() ??
                  "normal"
                }
                onChange={(e) =>
                  handleSettingChange(
                    e as unknown as React.ChangeEvent<HTMLInputElement>
                  )
                }
                className="w-full p-2 border rounded"
              >
                <option value="bold">ضخیم</option>
                <option value="lighter">نازک</option>
              </select>
            </div>
            <br />
            <div className="rounded-lg flex items-center justify-between ">
              <ColorInput
                label="رنگ پس زمینه"
                name="background"
                value={
                  userInputData?.setting?.background?.toString() ?? "#333333"
                }
                onChange={handleSettingChange}
              />
            </div>
          </div>
        )}

        {/* Spacing Settings Dropdown */}

        {isSpacingOpen && (
          <div className="p-4  animate-slideDown">
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
