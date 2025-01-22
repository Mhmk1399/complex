import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, SlideBannerSection } from "@/lib/types";
import React from "react";
import MarginPaddingEditor from "../sections/editor";

interface SlideBannerFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<SlideBannerSection>>;
  userInputData: SlideBannerSection;
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
  <div className="flex flex-col gap-3">
    <label className="block mb-1">{label}</label>
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

export const SlideBannerForm: React.FC<SlideBannerFormProps> = ({
  setUserInputData,
  userInputData,
  layout,
  selectedComponent,
}) => {
  const [isStyleSettingsOpen, setIsStyleSettingsOpen] = useState(false);
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [isSpacingOpen, setIsSpacingOpen] = useState(false);
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
  const handleUpdate = (
    type: "margin" | "padding",
    updatedValues: BoxValues
  ) => {
    if (type === "margin") {
      setMargin(updatedValues);
      setUserInputData((prev: SlideBannerSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          marginTop: updatedValues.top.toString(),
          marginBottom: updatedValues.bottom.toString(),
        },
      }));
    } else {
      setPadding(updatedValues);
      setUserInputData((prev: SlideBannerSection) => ({
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
    const initialData = Compiler(layout, selectedComponent)[0];
    setUserInputData(initialData);
  }, []);

  const handleSlideChange = (index: number, field: string, value: string) => {
    setUserInputData((prev: SlideBannerSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        slides: prev.blocks.slides.map((slide, i) =>
          i === index ? { ...slide, [field]: value } : slide
        ),
      },
    }));
  };

  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev: SlideBannerSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        setting: {
          ...prev.blocks.setting,
          [name]: value,
        },
      },
    }));
  };

//   const handleSpacingUpdate = (
//     type: "margin" | "padding",
//     updatedValues: BoxValues
//   ) => {
//     if (type === "margin") {
//       setMargin(updatedValues);
//       setUserInputData((prev: SlideBannerSection) => ({
//         ...prev,
//         setting: {
//           ...prev.setting,
//           marginTop: updatedValues.top.toString(),
//           marginBottom: updatedValues.bottom.toString(),
//         },
//       }));
//     } else {
//       setPadding(updatedValues);
//       setUserInputData((prev: SlideBannerSection) => ({
//         ...prev,
//         setting: {
//           ...prev.setting,
//           paddingTop: updatedValues.top.toString(),
//           paddingBottom: updatedValues.bottom.toString(),
//           paddingLeft: updatedValues.left.toString(),
//           paddingRight: updatedValues.right.toString(),
//         },
//       }));
//     }
//   };

  return (
    <div
      className="p-3 max-w-4xl mx-auto bg-gray-200 rounded-xl my-4"
      dir="rtl"
    >
      <h2 className="text-xl font-bold my-4">تنظیمات اسلایدر</h2>

      {/* Content Section */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
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

        {isContentOpen && (
          <div className="p-4 border-t border-gray-100 animate-slideDown">
            {userInputData?.blocks?.slides?.map((slide, index) => (
              <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">اسلاید {index + 1}</h4>
                <div className="space-y-2">
                  <label
                    htmlFor="
                    "
                  >
                    تصویر
                  </label>
                  <input
                    type="text"
                    placeholder="آدرس تصویر"
                    value={slide.imageSrc}
                    onChange={(e) =>
                      handleSlideChange(index, "imageSrc", e.target.value)
                    }
                    className="w-full mb-2 p-2 border rounded"
                  />
                  <label className="mt-2">متن جایگزین تصویر</label>
                  <input
                    type="text"
                    placeholder="متن جایگزین تصویر"
                    value={slide.imageAlt}
                    onChange={(e) =>
                      handleSlideChange(index, "imageAlt", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Style Settings */}
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
          <div className="p-4 border-t border-gray-100 animate-slideDown">
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <label className="block mb-2">ارتفاع اسلایدر</label>
                <input
                  type="range"
                  name="height"
                  min="200"
                  max="800"
                  value={userInputData?.blocks?.setting?.height || "200"}
                  onChange={handleSettingChange}
                  className="w-full"
                />
                <span className="text-sm text-gray-500">
                  {userInputData?.blocks?.setting?.height}px
                </span>
              </div>
              <div>
                <ColorInput
                  label="رنگ فلش ها"
                  name="bgArrow"
                  value={
                    userInputData?.blocks?.setting?.bgArrow?.toString() ??
                    "#333333"
                  }
                  onChange={handleSettingChange}
                />
              </div>
              <div>
                <ColorInput
                  label="رنگ نقطه‌های غیرفعال (در صورت نیاز)"
                  name="inactiveDotColor"
                  value={
                    userInputData?.blocks?.setting?.inactiveDotColor?.toString() ??
                    "#333333"
                  }
                  onChange={handleSettingChange}
                />
              </div>
              <div>
                <ColorInput
                  label="رنگ نقطه‌ی فعال (در صورت نیاز)"
                  name="activeDotColor"
                  value={
                    userInputData?.blocks?.setting?.activeDotColor?.toString() ??
                    "#333333"
                  }
                  onChange={handleSettingChange}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Spacing Settings */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
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
