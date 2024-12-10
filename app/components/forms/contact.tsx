import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { ContactFormDataSection, Layout } from "@/lib/types";
import MarginPaddingEditor from "../sections/editor";
import React from "react";

interface ContactFormProps {
  setUserInputData: React.Dispatch<
    React.SetStateAction<ContactFormDataSection>
  >;
  userInputData: ContactFormDataSection;
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
  <>
    <label className="block mb-1" htmlFor={name}>
      {label}
    </label>
    <div className="flex flex-col gap-3 items-center">
      <input
        type="color"
        id={name}
        name={name}
        value={value || "#000000"}
        onChange={onChange}
        className="border p-0.5 rounded-full"
      />
    </div>
  </>
);

export const ContactForm: React.FC<ContactFormProps> = ({
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
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [isSpacingOpen, setIsSpacingOpen] = useState(false);

  const handleUpdate = (
    type: "margin" | "padding",
    updatedValues: BoxValues
  ) => {
    if (type === "margin") {
      setMargin(updatedValues);
      setUserInputData((prev: ContactFormDataSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          marginTop: updatedValues.top.toString(),
          marginBottom: updatedValues.bottom.toString(),
        },
      }));
    } else {
      setPadding(updatedValues);
      setUserInputData((prev: ContactFormDataSection) => ({
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
  }, []);
  useEffect(() => {
    const initialData = Compiler(layout, selectedComponent)[0];
    setUserInputData(initialData);
  }, [selectedComponent]);
  const handleBlockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInputData((prev: ContactFormDataSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [name]: value,
      },
    }));
  };

  const handleBlockSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInputData((prev: ContactFormDataSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        setting: {
          ...prev?.blocks?.setting,
          [name]: value,
        },
      },
    }));
  };

  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInputData((prev: ContactFormDataSection) => ({
      ...prev,
      setting: {
        ...prev?.setting,
        [name]: value.includes("px") ? value : `${value}px`,
      },
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-200 rounded-xl my-4" dir="rtl">
      <h2 className="text-xl font-bold my-4">تنظیمات فرم ارتباط با ما</h2>

      {/* Content Section */}
      {/* Content Section */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Dropdown Header Button */}
        <button
          onClick={() => setIsContentOpen(!isContentOpen)}
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
            <h3 className="font-semibold text-gray-700">محتوا</h3>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isContentOpen ? "rotate-180" : ""
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
        {isContentOpen && (
          <div className="p-4 border-t border-gray-100 space-y-4 animate-slideDown">
            <div className="p-3 bg-gray-50 rounded-lg">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                سربرگ فرم
              </label>
              <input
                type="text"
                name="heading"
                value={userInputData?.blocks?.heading?.toString() ?? ""}
                onChange={handleBlockChange}
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        )}
      </div>

      {/* Style Settings */}

      {/* Style Settings Dropdown */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <button
          onClick={() => setIsStyleSettingsOpen(!isStyleSettingsOpen)}
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
          <div className="p-4 border-t border-gray-100 space-y-6 animate-slideDown">
            {/* Heading Settings */}
            <div className="space-y-4">
             
            <div className="p-3 bg-gray-100 rounded-lg flex flex-col gap-3">
            <h4 className="text-base font-semibold text-sky-600">
                تنظیمات سربرگ
              </h4>
                <div>
                  <ColorInput
                    label="رنگ سربرگ"
                    name="headingColor"
                    value={
                      userInputData?.blocks?.setting?.headingColor?.toLocaleString() ??
                      "#ffffff"
                    }
                    onChange={handleBlockSettingChange}
                  />
                  <span className="text-sm text-gray-600">
                    {userInputData?.blocks?.setting?.headingColor}
                  </span>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-bold text-gray-700">
                    سایز سربرگ
                  </label>
                  <input
                    type="range"
                    name="headingFontSize"
                    value={
                      userInputData?.blocks?.setting?.headingFontSize?.toLocaleString() ??
                      "25px"
                    }
                    onChange={handleBlockSettingChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">
                    {userInputData?.blocks?.setting?.headingFontSize}px
                  </span>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-bold text-gray-700">
                    وزن سربرگ
                  </label>
                  <select
                    name="headingFontWeight"
                    value={
                      userInputData?.blocks?.setting?.headingFontWeight?.toLocaleString() ??
                      "bold"
                    }
                    onChange={(e) =>
                      handleBlockSettingChange(
                        e as unknown as React.ChangeEvent<HTMLInputElement>
                      )
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="bold">ضخیم</option>
                    <option value="lighter">نازک</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Button Settings */}
            <div className="space-y-4">
             
            <div className="p-3 bg-gray-100 rounded-lg flex flex-col gap-3">
            <h4 className="text-base font-semibold text-sky-600">
                تنظیمات دکمه
              </h4>
                <div>
                  <ColorInput
                    label="رنگ پس زمینه دکمه"
                    name="btnBackgroundColor"
                    value={
                      userInputData?.blocks?.setting?.btnBackgroundColor?.toLocaleString() ??
                      "#9c119c"
                    }
                    onChange={handleBlockSettingChange}
                  />
                  <span className="text-sm text-gray-600">
                    {userInputData?.blocks?.setting?.btnBackgroundColor}
                  </span>
                </div>

                <div>
                  <ColorInput
                    label="رنگ متن دکمه"
                    name="btnTextColor"
                    value={
                      userInputData?.blocks?.setting?.btnTextColor?.toLocaleString() ??
                      "#ffffff"
                    }
                    onChange={handleBlockSettingChange}
                  />
                  <span className="text-sm text-gray-600">
                    {userInputData?.blocks?.setting?.btnTextColor}
                  </span>
                </div>
              </div>
            </div>

            {/* Background Settings */}
            <div className="space-y-4">
             
            <div className="p-3 bg-gray-100 rounded-lg flex flex-col gap-3">
            <h4 className="text-base font-semibold text-sky-600">
                تنظیمات رنگ پس زمینه
              </h4>
                <ColorInput
                  label="رنگ پس زمینه فرم"
                  name="formBackground"
                  value={
                    userInputData?.blocks?.setting?.formBackground?.toLocaleString() ??
                    "#11769c"
                  }
                  onChange={handleBlockSettingChange}
                />
                <span className="text-sm text-gray-600">
                  {userInputData?.blocks?.setting?.formBackground}
                </span>
              </div>
            </div>
          </div>
        )}
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
  );
};
