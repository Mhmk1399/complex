import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, MultiColumnBlock, MultiColumnSection } from "@/lib/types";
import MarginPaddingEditor from "../sections/editor";
import React from "react";
import { TabButtons } from "../tabButtons";

interface MultiColumnFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<MultiColumnSection>>;
  userInputData: MultiColumnSection;
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
  <div className="flex flex-col gap-2">
    <label className="block mb-1" htmlFor={name}>
      {label}
    </label>
    <input
      type="color"
      id={name}
      name={name}
      value={value || "#000000"}
      onChange={onChange}
      className="border p-0.5 rounded-full"
    />
  </div>
);

export const MultiColumnForm: React.FC<MultiColumnFormProps> = ({
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
  const [openColumns, setOpenColumns] = useState<Record<number, boolean>>({});
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [isSpacingOpen, setIsSpacingOpen] = useState(false);

  const handleAddColumn = () => {
    setUserInputData((prev: MultiColumnSection) => {
      const newColumnNum = Object.keys(prev.blocks).length + 1;

      const newBlock: MultiColumnBlock = {
        [`title${newColumnNum}`]: `عنوان ${newColumnNum}`,
        [`description${newColumnNum}`]: `محتوای ${newColumnNum}`,
        [`imageSrc${newColumnNum}`]: "",
        [`btnLable${newColumnNum}`]: `دکمه ${newColumnNum}`,
        [`btnLink${newColumnNum}`]: "#",
      };

      return {
        ...prev,
        blocks: {
          ...prev.blocks,
          [newColumnNum - 1]: newBlock,
        },
      };
    });
  };

  const handleDeleteColumn = (columnIndex: number) => {
    setUserInputData((prev: MultiColumnSection) => {
      const newBlocks = { ...prev.blocks };
      delete newBlocks[columnIndex];

      // Reindex remaining blocks
      const reindexedBlocks = Object.values(newBlocks).reduce(
        (acc, block, idx) => {
          acc[idx] = block;
          return acc;
        },
        {} as typeof prev.blocks
      );

      return {
        ...prev,
        blocks: reindexedBlocks,
      };
    });
  };

  const handleUpdate = (
    type: "margin" | "padding",
    updatedValues: BoxValues
  ) => {
    if (type === "margin") {
      setMargin(updatedValues);
      setUserInputData((prev: MultiColumnSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          marginTop: updatedValues.top.toString(),

          marginBottom: updatedValues.bottom.toString(),
        },
      }));
    } else {
      setPadding(updatedValues);
      setUserInputData((prev: MultiColumnSection) => ({
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
  });
  useEffect(() => {
    const initialData = Compiler(layout, selectedComponent)[0];
    if (initialData) {
      setUserInputData({
        ...initialData,
        blocks: initialData.blocks || {}, // Ensure blocks is never undefined
      });
    }
  }, [selectedComponent]);
  const handleBlockChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    columnNum: number
  ) => {
    const { name, value } = e.target;
    const fieldName = `${name}${columnNum}` as keyof MultiColumnBlock;

    setUserInputData((prev: MultiColumnSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [columnNum - 1]: {
          ...prev.blocks[columnNum - 1],
          [fieldName]: value,
        },
      },
    }));
  };

  const [isUpdating, setIsUpdating] = useState(false);

  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (isUpdating) return;
    setIsUpdating(true);

    const { name, value } = e.target;
    setUserInputData((prev: MultiColumnSection) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value,
      },
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
    <div className="p-3 max-w-4xl space-y-2 rounded" dir="rtl">
      <h2 className="text-lg font-bold mb-4">تنظیمات ستون ها</h2>

      {/* Tabs */}
      <TabButtons onTabChange={handleTabChange} />

      {/* Main Heading Settings */}

      {isContentOpen && (
        <div className="p-4 animate-slideDown">
          <div className=" rounded-lg">
            <label htmlFor="" className="block mb-2 font-bold">
              متن سربرگ
            </label>
            <input
              type="text"
              name="heading"
              value={userInputData?.setting?.heading?.toString() ?? ""}
              onChange={handleSettingChange}
              placeholder="Main Heading"
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <br />
          {userInputData?.blocks &&
            Object.keys(userInputData.blocks).map((columnKey) => {
              const columnNum = parseInt(columnKey) + 1;
              return (
                <div
                  key={columnKey}
                  className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100"
                >
                  <button
                    onClick={() =>
                      setOpenColumns((prev) => ({
                        ...prev,
                        [columnNum]: !prev[columnNum],
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
                      <h3 className="font-semibold text-gray-700">
                        ستون {columnNum}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteColumn(parseInt(columnKey));
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
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                          openColumns[columnNum] ? "rotate-180" : ""
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
                    </div>
                  </button>

                  {openColumns[columnNum as number] && (
                    <div className="p-4 border-t border-gray-100 space-y-4 animate-slideDown">
                      {/* Column Content */}
                      <label> title</label>
                      <input
                        type="text"
                        name="title"
                        value={
                          userInputData?.blocks[columnNum - 1]?.[
                            `title${columnNum}` as keyof MultiColumnBlock
                          ] || ""
                        }
                        onChange={(e) => handleBlockChange(e, columnNum)}
                        className="w-full p-2 border border-gray-200 rounded-lg"
                        placeholder="Title"
                      />
                      <label> Description </label>
                      <input
                        type="text"
                        name="description"
                        value={
                          userInputData?.blocks[columnNum - 1]?.[
                            `description${columnNum}` as keyof MultiColumnBlock
                          ] || ""
                        }
                        onChange={(e) => handleBlockChange(e, columnNum)}
                        className="w-full p-2 border border-gray-200 rounded-lg"
                        placeholder="Description"
                      />
                      <label> btn Lable </label>
                      <input
                        type="text"
                        name="btnLable"
                        value={
                          userInputData?.blocks[columnNum - 1]?.[
                            `btnLable${columnNum}` as keyof MultiColumnBlock
                          ] || ""
                        }
                        onChange={(e) => handleBlockChange(e, columnNum)}
                        className="w-full p-2 border border-gray-200 rounded-lg"
                        placeholder=" btn Lable"
                      />
                      <label> btn Link </label>
                      <input
                        type="text"
                        name="btnLink"
                        value={
                          userInputData?.blocks[columnNum - 1]?.[
                            `btnLink${columnNum}` as keyof MultiColumnBlock
                          ] || ""
                        }
                        onChange={(e) => handleBlockChange(e, columnNum)}
                        className="w-full p-2 border border-gray-200 rounded-lg"
                        placeholder="btn Link"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          <button
            onClick={handleAddColumn}
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
          <div className="grid md:grid-cols-1 rounded-xl gap-4 p-2 animate-slideDown">
            <h4 className="font-semibold mb-2 text-sky-700">تنظیمات سربرگ</h4>
            <ColorInput
              label="رنگ سربرگ"
              name="headingColor"
              value={userInputData?.setting?.headingColor ?? "#ffffff"}
              onChange={handleSettingChange}
            />
            <div className="text-sm text-gray-600">
              {userInputData?.setting?.headingColor?.toLocaleString() ??
                "#ffa62b"}
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <label>سایز سربرگ</label>
              <input
                type="range"
                name="headingFontSize"
                value={
                  userInputData?.setting?.headingFontSize?.toString() ?? "18"
                }
                onChange={handleSettingChange}
              />
              <div className="text-sm text-gray-600">
                {userInputData?.setting?.headingFontSize?.toString() ?? "18px"}
                px
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <label className="block mb-1">وزن سربرگ</label>
              <select
                name="headingFontWeight"
                value={
                  userInputData?.setting?.headingFontWeight?.toString() ?? "0"
                }
                onChange={handleSettingChange}
                className="w-full p-2 border rounded"
              >
                <option value="bold">ضخیم</option>
                <option value="normal">نرمال</option>
              </select>
            </div>
            <h4 className="font-semibold mb-2"> تنظیمات عنوان</h4>
            <ColorInput
              label="رنگ عنوان"
              name="titleColor"
              value={
                userInputData?.setting?.titleColor?.toLocaleString() ??
                "#ffa62b"
              }
              onChange={handleSettingChange}
            />
            <div className="text-sm text-gray-600">
              {userInputData?.setting?.titleColor?.toLocaleString() ??
                "#ffa62b"}
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <label>سایز سربرگ</label>
              <input
                type="range"
                name="titleFontSize"
                value={
                  userInputData?.setting?.titleFontSize?.toString() ?? "18"
                }
                onChange={handleSettingChange}
              />
              <div className="text-sm text-gray-600 ">
                {userInputData?.setting?.titleFontSize?.toString() ?? "18px"}
                px
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <label className="block mb-1">وزن سربرگ</label>
              <select
                name="titleFontWeight"
                value={
                  userInputData?.setting?.titleFontWeight?.toString() ?? "0"
                }
                onChange={handleSettingChange}
                className="w-full p-2 border rounded"
              >
                <option value="bold">ضخیم</option>
                <option value="normal">نرمال</option>
              </select>
            </div>
            <h4 className="font-semibold mb-2"> تنظیمات محتوا</h4>
            <ColorInput
              label="رنگ محتوا"
              name="descriptionColor"
              value={
                userInputData?.setting?.descriptionColor?.toLocaleString() ??
                "#ffa62b"
              }
              onChange={handleSettingChange}
            />
            <div className="text-sm text-gray-600">
              {userInputData?.setting?.descriptionColor?.toLocaleString() ??
                "#ffa62b"}
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <label>سایز محتوا</label>
              <input
                type="range"
                name="descriptionFontSize"
                value={
                  userInputData?.setting?.descriptionFontSize?.toString() ??
                  "18"
                }
                onChange={handleSettingChange}
              />
              <div className="text-sm text-gray-600 ">
                {userInputData?.setting?.descriptionFontSize?.toString() ??
                  "18px"}
                px
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <label className="block mb-1">وزن محتوا</label>
              <select
                name="descriptionFontWeight"
                value={
                  userInputData?.setting?.descriptionFontWeight?.toString() ??
                  "0"
                }
                onChange={handleSettingChange}
                className="w-full p-2 border rounded"
              >
                <option value="bold">ضخیم</option>
                <option value="normal">نرمال</option>
              </select>
            </div>
            <h4 className="font-semibold mb-2"> تنظیمات دکمه</h4>

            <ColorInput
              label="رنگ متن دکمه"
              name="btnColor"
              value={
                userInputData?.setting?.btnColor?.toLocaleString() ?? "#ffffff"
              }
              onChange={handleSettingChange}
            />
            <ColorInput
              label="رنگ پس زمینه دکمه"
              name="btnBackgroundColor"
              value={
                userInputData?.setting?.btnBackgroundColor?.toLocaleString() ??
                "#16697a"
              }
              onChange={handleSettingChange}
            />
            <h4 className="font-semibold mb-2">تنظیمات پس زمینه</h4>
            <ColorInput
              label="رنگ پس زمینه"
              name="backgroundColorBox"
              value={
                userInputData?.setting?.backgroundColorBox?.toLocaleString() ??
                "#82c0cc"
              }
              onChange={handleSettingChange}
            />

            <h4 className="font-semibold my-6">تنظیمات تصویر</h4>
            <div className="cols-span-1">
              <label className="block mb-1">انحنای زوایا تصویر</label>
              <input
                type="range"
                name="imageRadious"
                value={
                  userInputData?.setting?.imageRadious?.replace("px", "") ??
                  "10"
                }
                onChange={handleSettingChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </>
      )}

      {/* Spacing Settings Dropdown */}

      {isSpacingOpen && (
        <div className="p-4 border-t border-gray-100 animate-slideDown">
          <div className=" rounded-lg flex items-center justify-center">
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
