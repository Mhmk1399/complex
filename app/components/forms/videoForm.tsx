import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { VideoFormProps, VideoSection } from "@/lib/types";
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
    <div className="flex flex-row gap-6 items-center">
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
  </>
);

export const VideoForm: React.FC<VideoFormProps> = ({
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
      setUserInputData((prev: VideoSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          marginTop: updatedValues.top.toString(),
          marginBottom: updatedValues.bottom.toString(),
        },
      }));
    } else {
      setPadding(updatedValues);
      setUserInputData((prev: VideoSection) => ({
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

  const handleBlockChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev: VideoSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [name]: value,
      },
    }));
  };

  const handleBlockSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const inputValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setUserInputData((prev: VideoSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        setting: {
          ...prev.blocks.setting,
          [name]: inputValue,
        },
      },
    }));
  };

  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInputData((prev: VideoSection) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value,
      },
    }));
  };

  return (
    <div
      className="p-6 max-w-4xl mx-auto bg-gray-200 rounded-xl my-4"
      dir="rtl"
    >
      <h2 className="text-xl font-bold my-4">تنظیمات ویدیو</h2>

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
                سربرگ
              </label>
              <input
                type="text"
                name="heading"
                value={userInputData.blocks.heading ?? ""}
                onChange={handleBlockChange}
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                ویدیو
              </label>
              <input
                type="text"
                name="videoUrl"
                value={userInputData.blocks.videoUrl ?? ""}
                onChange={handleBlockChange}
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                متن جایگزین ویدیو
              </label>
              <input
                type="text"
                name="videoAlt"
                value={userInputData.blocks.videoAlt ?? ""}
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
            <div className="p-3 bg-gray-100 rounded-lg flex flex-col gap-3">
              <h4 className="text-base font-bold text-sky-700">
                تنظیمات سربرگ
              </h4>
              <div className="p-3 rounded-lg">
                <ColorInput
                  label="رنگ سربرگ"
                  name="headingColor"
                  value={
                    userInputData.blocks.setting?.headingColor?.toString() ??
                    "#000000"
                  }
                  onChange={handleBlockSettingChange}
                />
                <span className="text-sm text-gray-600" dir="ltr">
                  {userInputData.blocks.setting?.headingColor?.toString()}
                </span>
              </div>

              <div className="p-3  rounded-lg">
                <label className="block mb-2 text-sm font-bold text-gray-700">
                  سایز سربرگ
                </label>
                <input
                  type="range"
                  name="headingFontSize"
                  value={
                    userInputData.blocks?.setting?.headingFontSize?.toString() ??
                    "30px"
                  }
                  onChange={handleBlockSettingChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-500">
                  {userInputData.blocks?.setting?.headingFontSize}px
                </span>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <label className="block mb-2 text-sm font-bold text-gray-700">
                  وزن سربرگ
                </label>
                <select
                  name="headingFontWeight"
                  value={
                    userInputData.blocks.setting?.headingFontWeight?.toString() ??
                    "bold"
                  }
                  onChange={handleBlockSettingChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="normal">نرمال</option>
                  <option value="bold">ضخیم</option>
                </select>
              </div>
            </div>

            {/* Video Settings */}
            <div className="space-y-4">
              <div className="p-3 bg-gray-100 rounded-lg flex flex-col gap-3">
                <h4 className="text-base font-bold text-sky-700 mb-4">
                  تنظیمات ویدیو
                </h4>
                <label className="block mb-2 text-sm font-bold text-gray-700">
                  عرض ویدیو
                </label>
                <input
                  type="range"
                  name="videoWidth"
                  max={1000}
                  value={
                    userInputData.blocks?.setting?.videoWidth?.toString() ??
                    "1000px"
                  }
                  onChange={handleBlockSettingChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-500">
                  {userInputData.blocks?.setting?.videoWidth}px
                </span>

                <label className="block mb-2 text-sm font-bold text-gray-700">
                  انحنای زوایا
                </label>
                <input
                  type="range"
                  name="videoRadious"
                  value={
                    userInputData.blocks.setting?.videoRadious?.toString() ??
                    "20px"
                  }
                  onChange={handleBlockSettingChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-500">
                  {userInputData.blocks.setting?.videoRadious}px
                </span>

                <label className="block mb-2 text-sm font-bold text-gray-700">
                  پوستر ویدیو
                </label>
                <input
                  type="text"
                  name="videoPoster"
                  value={
                    userInputData.blocks.setting?.videoPoster?.toString() ?? ""
                  }
                  onChange={handleBlockSettingChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />

                <h4 className="font-bold text-gray-700 mb-3">
                  تنظیمات کنترل ویدیو
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="videoLoop"
                      checked={userInputData.blocks.setting?.videoLoop ?? true}
                      onChange={handleBlockSettingChange}
                      className="mr-2"
                    />
                    <label className="text-sm font-medium">تکرار</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="videoMute"
                      checked={userInputData.blocks.setting?.videoMute ?? false}
                      onChange={handleBlockSettingChange}
                      className="mr-2"
                    />
                    <label className="text-sm font-medium">بیصدا</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="videoAutoplay"
                      checked={
                        userInputData.blocks.setting?.videoAutoplay ?? true
                      }
                      onChange={handleBlockSettingChange}
                      className="mr-2"
                    />
                    <label className="text-sm font-medium">پخش خودکار</label>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-100 rounded-lg flex flex-col gap-3">
                <h4 className="font-bold text-sky-700 mb-3">
                  تنظیمات پس زمینه
                </h4>
                <ColorInput
                  label="رنگ پس زمینه"
                  name="backgroundVideoSection"
                  value={
                    userInputData.blocks.setting?.backgroundVideoSection?.toString() ??
                    "#e4e4e4"
                  }
                  onChange={handleBlockSettingChange}
                />
                <div className="text-sm text-gray-600">
                  {userInputData.blocks.setting?.backgroundVideoSection}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Spacing Settings Dropdown */}

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
