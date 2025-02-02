import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, SlideSection, SlideBlock } from "@/lib/types";
import React from "react";
import MarginPaddingEditor from "../sections/editor";
import { useCallback } from "react";
import debounce from "lodash/debounce";
import { TabButtons } from "../tabButtons";

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

  useEffect(() => {
    const initialData = Compiler(layout, selectedComponent)[0];
    if (initialData) {
      setUserInputData(initialData);
    }
  }, [selectedComponent]);
  useEffect(() => {
    setIsContentOpen(true);
  }, []);

  const handelAddBlock = () => {
    setUserInputData((prev: SlideSection) => {
      // Get the last block from the array
      const lastBlock = prev.blocks[prev.blocks.length - 1];

      // Create a deep copy of the last block
      const newBlock = JSON.parse(JSON.stringify(lastBlock));

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
    setUserInputData((prev: SlideSection) => ({
      ...prev,
      blocks: prev.blocks.map((block, i) =>
        i === index ? { ...block, [field]: value } : block
      ),
    }));
  };
  const [isUpdating, setIsUpdating] = useState(false);

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
  const handleDeleteBlock = (index: number) => {
    setUserInputData((prev: SlideSection) => ({
      ...prev,
      blocks: prev.blocks.filter((_, i) => i !== index),
    }));
  };
  if (!userInputData?.blocks) {
    return null;
  }

  const handleTabChange = (tab: "content" | "style" | "spacing") => {
    setIsContentOpen(tab === "content");
    setIsStyleSettingsOpen(tab === "style");
    setIsSpacingOpen(tab === "spacing");
  };

  return (
    <>
      <div className="p-3 max-w-4xl space-y-2 rounded" dir="rtl">
        <h2 className="text-lg font-bold mb-4">تنظیمات اسلاید شو</h2>

        {/* Tabs */}
        <TabButtons onTabChange={handleTabChange} />

        {isContentOpen &&
          Array.isArray(userInputData?.blocks) &&
          userInputData.blocks.map((block, index) => (
            <React.Fragment key={index}>
              <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 mt-4">
                <button
                  onClick={() =>
                    setIsContentOpen((prev) => ({
                      ...prev,
                      [index]: !prev[index as keyof typeof prev],
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <h3 className="font-semibold text-gray-700">
                      اسلاید {index + 1}
                    </h3>
                    <div className="flex items-center gap-2">
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
                    <div className="p-3 bg-gray-50 rounded-lg">
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

                    <div className="p-3 bg-gray-50 rounded-lg">
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

                    <div className="p-3 bg-gray-50 rounded-lg">
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

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <label className="block mb-2 text-sm font-bold text-gray-700">
                        متن دکمه
                      </label>
                      <input
                        type="text"
                        value={block.btnText || ""}
                        onChange={(e) => handleBlockChange(e, index, "btnText")}
                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <label className="block mb-2 text-sm font-bold text-gray-700">
                        لینک دکمه
                      </label>
                      <input
                        type="text"
                        value={block.btnLink || ""}
                        onChange={(e) => handleBlockChange(e, index, "btnLink")}
                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={handelAddBlock}
                className="px-1 rounded-lg mb-3 w-full text-3xl group hover:font-extrabold transition-all"
              >
                +
                <div className="bg-blue-500 w-full pb-0.5 group-hover:bg-blue-600 group-hover:pb-1 transition-all"></div>
              </button>
            </React.Fragment>
          ))}

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
                </div>
              </div>
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
                </div>
              </div>
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

        {/* Dropdown Content */}
        {isSpacingOpen && (
          <div className="p-4 border-t border-gray-100 animate-slideDown">
            <div className="bg-gray-50 rounded-lg p-2 flex items-center justify-center">
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
