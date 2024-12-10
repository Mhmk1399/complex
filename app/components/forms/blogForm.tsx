import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { BlogSection, BlogListFormProps } from "@/lib/types";
import React from "react";
import MarginPaddingEditor from "../sections/editor";

interface BoxValues {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface MarginPaddingEditorProps {
  margin: BoxValues;
  padding: BoxValues;
  onChange: (type: "margin" | "padding", updatedValues: BoxValues) => void;
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
    <label className="block mb-1" htmlFor={name}>
      {label}
    </label>
    <div className="flex flex-col gap-3 items-center">
      <input
        type="color"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="border p-0.5 rounded-full"
      />
    </div>
  </>
);

export const BlogListForm: React.FC<BlogListFormProps> = ({
  setUserInputData,
  userInputData,
  layout,
  selectedComponent,
}) => {
  const [inputText, setInputText] = useState("");
  const [json, setJson] = useState(null);

  const handleLiveInput = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    if (inputText.trim()) {
      const response = await fetch("/api/update-json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputText }),
      });

      const updatedJson = await response.json();
      setJson(updatedJson);

      setUserInputData((prevData) => ({
        ...prevData,
        blocks: updatedJson.children.sections[0].blocks,
        setting: updatedJson.children.sections[0].setting,
      }));
    }
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
  const [isStyleSettingsOpen, setIsStyleSettingsOpen] = useState(false);
  const [openColumns, setOpenColumns] = useState<Record<number, boolean>>({});
  const [isHeadingOpen, setIsHeadingOpen] = useState(false);
  const [isSpacingOpen, setIsSpacingOpen] = useState(false);

  const handleUpdate = (
    type: "margin" | "padding",
    updatedValues: BoxValues
  ) => {
    if (type === "margin") {
      setMargin(updatedValues);
      setUserInputData((prev: BlogSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          marginTop: updatedValues.top.toString(),

          marginBottom: updatedValues.bottom.toString(),
        },
      }));
    } else {
      setPadding(updatedValues);
      setUserInputData((prev: BlogSection) => ({
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
    const initialData = Compiler(layout, selectedComponent);
    setUserInputData(initialData[0]);
  }, [selectedComponent]);

  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev: BlogSection) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value,
      },
    }));
  };

  return (
    <div className="space-y-6 p-4 my-4 bg-gray-200 rounded-lg" dir="rtl">
      <h3 className="text-lg my-4 font-semibold">تنظیمات بلاگ</h3>
      <div className="bg-gray-50  rounded-lg shadow">
        <button
          onClick={() => setIsStyleSettingsOpen(!isStyleSettingsOpen)}
          className="w-full flex justify-between bg-white  items-center p-4 my-6 hover:bg-gray-50 rounded-xl transition-all duration-200"
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
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            <h3 className="font-semibold text-gray-700">تنظیمات استایل</h3>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isStyleSettingsOpen ? "rotate-180" : ""
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
        {isStyleSettingsOpen && (
          <>
            <div className="grid grid-cols-1 gap-4 p-4 animate-slideDown">
            <h3 className="text-lg font-semibold text-sky-700">تنظیمات بلاگ</h3>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={3}
                style={{ width: "100%" }}
                placeholder="یک جمله فارسی وارد کنید..."
              />
              <button
                onClick={handleLiveInput}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                تبدیل
              </button>

              <label htmlFor="gridColumns" className="block mb-2">
                تعداد ستون‌ها
              </label>
              <input
                type="number"
                name="gridColumns"
                value={userInputData.setting.gridColumns || 1}
                onChange={handleSettingChange}
                min="1"
                max="4"
                className="border p-2 rounded"
              />

              <ColorInput
                label="رنگ پس‌زمینه"
                name="backgroundColor"
                value={
                  userInputData.setting.backgroundColor?.toString() ?? "#ffffff"
                }
                onChange={handleSettingChange}
              />
              <ColorInput
                label="  رنگ پس‌زمینه کارت"
                name="cardBackgroundColor"
                value={
                  userInputData.setting.cardBackgroundColor?.toString() ?? "#ffffff"
                }
                onChange={handleSettingChange}
              />

              <ColorInput
                label="رنگ متن"
                name="textColor"
                value={userInputData.setting.textColor?.toString() ?? "#000000"}
                onChange={handleSettingChange}
              />
              <ColorInput
                label="رنگ پس‌زمینه دکمه"
                name="btnBackgroundColor"
                value={
                  userInputData.setting.btnBackgroundColor?.toString() ??
                  "#000000"
                }
                onChange={handleSettingChange}
              />

              <ColorInput
                label="رنگ دکمه"
                name="buttonColor"
                value={
                  userInputData.setting.buttonColor?.toString() ?? "#0070f3"
                }
                onChange={handleSettingChange}
              />

              <label htmlFor="borderRadius" className="block mb-2">
                گردی گوشه‌ها
              </label>
              <input
                type="range"
                name="cardBorderRadius"
                min="0"
                max="100"
                value={userInputData.setting.cardBorderRadius || 0}
                onChange={handleSettingChange}
                className="w-full"
              />
              <div className="text-sm text-gray-500">
              {userInputData.setting.cardBorderRadius}px
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Dropdown Header */}

        <button
          onClick={() => setIsSpacingOpen(!isSpacingOpen)}
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
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            <h3 className="font-semibold text-gray-700">تنظیمات فاصله</h3>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isSpacingOpen ? "rotate-180" : ""
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
    </div>
  );
};

export default BlogListForm;
