import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, MultiRowSection } from "@/lib/types";
import React from "react";
import MarginPaddingEditor from "../sections/editor";

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

export const MultiRowForm: React.FC<MultiRowFormProps> = ({
  setUserInputData,
  userInputData,
  layout,
  selectedComponent,
}) => {
  const [loaded, setLoaded] = useState(false);
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
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [isSpacingOpen, setIsSpacingOpen] = useState(false);

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
    if (initialData) {
      setLoaded(true);
      setUserInputData(initialData);
    }
  }, []);
  useEffect(() => {
    const initialData = Compiler(layout, selectedComponent)[0];
    if (initialData) {
      setLoaded(true);
      setUserInputData(initialData);
    }
  }, [selectedComponent]);

  const handleBlockChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev: MultiRowSection) => ({
      ...prev,
      blocks: prev.blocks.map((block, i) =>
        i === index ? { ...block, [name]: value } : block
      ),
    }));
  };

  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev: MultiRowSection) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value.includes("px") ? value : `${value}`,
      },
    }));
  };

  return (
    <>
      {!loaded ? (
        <p>Loading...</p>
      ) : (
        <div className="p-6 max-w-4xl mx-auto" dir="rtl">
          <h2 className="text-xl font-bold mb-4">ردیف ها</h2>

          {/* Title Settings */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">سربرگ</h3>
            <input
              type="text"
              name="title"
              value={userInputData?.title ?? ""}
              onChange={(e) =>
                setUserInputData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full p-2 border rounded"
              placeholder="Main Title"
            />
          </div>

          {/* Row Content */}
          {userInputData?.blocks?.map((block, index) => (
            <div key={index} className="mb-6 p-4 border rounded">
              <h3 className="font-semibold mb-2">ردیف {index + 1}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1">عنوان</label>
                  <input
                    type="text"
                    name="heading"
                    value={block.heading || ""}
                    onChange={(e) => handleBlockChange(e, index)}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1">توضیحات</label>
                  <textarea
                    name="description"
                    value={block.description || ""}
                    onChange={(e) => handleBlockChange(e, index)}
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block mb-1">تصویر</label>
                  <input
                    type="text"
                    name="imageSrc"
                    value={block.imageSrc || ""}
                    onChange={(e) => handleBlockChange(e, index)}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1">متن جایگزین تصویر</label>
                  <input
                    type="text"
                    name="imageAlt"
                    value={block.imageAlt || ""}
                    onChange={(e) => handleBlockChange(e, index)}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1">متن دکمه</label>
                  <input
                    type="text"
                    name="btnLable"
                    value={block.btnLable || ""}
                    onChange={(e) => handleBlockChange(e, index)}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1">لینک دکمه</label>
                  <input
                    type="text"
                    name="btnLink"
                    value={block.btnLink || ""}
                    onChange={(e) => handleBlockChange(e, index)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Style Settings */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">تنظیمات استایل</h3>
            <div className="grid md:grid-cols-1 gap-4">
              <ColorInput
                label="رنگ سربرگ"
                name="titleColor"
                value={userInputData?.setting?.titleColor ?? "#000000"}
                onChange={handleSettingChange}
              />
              <ColorInput
                label="رنگ عنوان"
                name="headingColor"
                value={userInputData?.setting?.headingColor ?? "#fcbf49"}
                onChange={handleSettingChange}
              />
              <ColorInput
                label="رنگ توضیحات"
                name="descriptionColor"
                value={userInputData?.setting?.descriptionColor ?? "#e4e4e4"}
                onChange={handleSettingChange}
              />
              <ColorInput
                label="رنگ پس زمینه"
                name="backgroundColorMultiRow"
                value={
                  userInputData?.setting?.backgroundColorMultiRow ?? "#8d99ae"
                }
                onChange={handleSettingChange}
              />
              <ColorInput
                label="رنگ پس زمینه ردیف ها"
                name="backgroundColorBox"
                value={userInputData?.setting?.backgroundColorBox ?? "#2b2d42"}
                onChange={handleSettingChange}
              />
              <ColorInput
                label="رنگ متن دکمه"
                name="btnColor"
                value={userInputData?.setting?.btnColor ?? "#ffffff"}
                onChange={handleSettingChange}
              />
              <ColorInput
                label="رنگ پس زمینه دکمه"
                name="btnBackgroundColor"
                value={userInputData?.setting?.btnBackgroundColor ?? "#bc4749"}
                onChange={handleSettingChange}
              />
            </div>

            {/* Font Settings */}
            <div className="grid md:grid-cols-1 gap-4 mt-4">
              <div>
                <label className="block mb-1">سایز سربرگ</label>
                <input
                  type="range"
                  name="titleFontSize"
                  min="10"
                  max="50"
                  value={parseInt(
                    userInputData?.setting?.titleFontSize ?? "35"
                  )}
                  onChange={handleSettingChange}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block mb-1">وزن سربرگ</label>
                <select
                  name="titleFontWeight"
                  value={userInputData?.setting?.titleFontWeight ?? "bold"}
                  onChange={handleSettingChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="normal">نرمال</option>
                  <option value="bold">ضخیم</option>
                </select>
              </div>
            </div>

            {/* Image Settings */}
            <div className="grid md:grid-cols-1 gap-4 mt-4">
              <div>
                <label className="block mb-1">عرض تصویر</label>
                <input
                  type="range"
                  name="imageWidth"
                  min="200"
                  max="1000"
                  value={parseInt(userInputData?.setting?.imageWidth ?? "700")}
                  onChange={handleSettingChange}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block mb-1">ارتفاع تصویر</label>
                <input
                  type="range"
                  name="imageHeight"
                  min="100"
                  max="500"
                  value={parseInt(userInputData?.setting?.imageHeight ?? "300")}
                  onChange={handleSettingChange}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block mb-1">انحنا زوایای تصویر</label>
                <input
                  type="range"
                  name="imageRadius"
                  min="0"
                  max="50"
                  value={parseInt(userInputData?.setting?.imageRadius ?? "45")}
                  onChange={handleSettingChange}
                  className="w-full"
                />
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
          </div>

          {/* Spacing Settings */}
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
      )}
    </>
  );
};
