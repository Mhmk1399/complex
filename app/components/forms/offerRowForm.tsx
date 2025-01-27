import { useCallback, useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, OfferRowBlock, OfferRowSection } from "@/lib/types";
import MarginPaddingEditor from "../sections/editor";
import debounce from "lodash/debounce"; // Add this import

interface OfferRowFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<OfferRowSection>>;
  userInputData: OfferRowSection;
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
  <div className="p-3 bg-gray-100 rounded-lg">
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

export const OfferRowForm: React.FC<OfferRowFormProps> = ({
  setUserInputData,
  userInputData,
  layout,
  selectedComponent,
}) => {
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
  const [isStyleSettingsOpen, setIsStyleSettingsOpen] = useState(false);
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [isSpacingOpen, setIsSpacingOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const initialData = Compiler(layout, selectedComponent)[0];
    setUserInputData(initialData);
  }, []);

  const handleSettingChange = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setUserInputData((prev: OfferRowSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          [name]: value,
        },
      }));
    }, 100),
    []
  );

  const handleUpdate = (
    type: "margin" | "padding",
    updatedValues: BoxValues
  ) => {
    if (type === "margin") {
      setMargin(updatedValues);
      setUserInputData((prev) => ({
        ...prev,
        setting: {
          ...prev.setting,
          marginTop: updatedValues.top.toString(),
          marginBottom: updatedValues.bottom.toString(),
        },
      }));
    } else {
      setPadding(updatedValues);
      setUserInputData((prev) => ({
        ...prev,
        setting: {
          ...prev.setting,
          paddingTop: updatedValues.top.toString(),
          paddingBottom: updatedValues.bottom.toString(),
        },
      }));
    }
  };

  return (
    <div
      className="p-3 max-w-4xl space-y-2 mx-4 bg-gray-100 rounded mt-4"
      dir="rtl"
    >
      <h2 className="text-xl font-bold my-4">تنظیمات پیشنهاد ویژه</h2>

      {/* Content Section */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <button
          onClick={() => setIsContentOpen(!isContentOpen)}
          className="w-full flex justify-between items-center p-4 hover:bg-gray-50 rounded-xl"
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
          <div className="p-4 border-t border-gray-100 space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg space-y-3">
              <input
                type="text"
                placeholder="عنوان اصلی"
                value={userInputData?.blocks?.setting?.titleText || ""}
                onChange={(e) => {
                  setUserInputData((prev) => ({
                    ...prev,
                    blocks: {
                      ...prev.blocks,
                      setting: {
                        ...prev.blocks.setting,
                        titleText: e.target.value,
                      },
                    },
                  }));
                }}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="متن دکمه"
                value={userInputData?.setting?.buttonText || ""}
                onChange={(e) => handleSettingChange(e)}
                name="buttonText"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="لینک دکمه"
                value={userInputData?.setting?.buttonLink || ""}
                onChange={(e) => handleSettingChange(e)}
                name="buttonLink"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        )}
      </div>

      {/* Style Settings */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <button
          onClick={() => setIsStyleSettingsOpen(!isStyleSettingsOpen)}
          className="w-full flex justify-between items-center p-4 hover:bg-gray-50 rounded-xl"
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
            <h3 className="font-semibold text-gray-700">تنظیمات ظاهری</h3>
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
          <div className="p-4 border-t border-gray-100">
            <div className="grid gap-4">
              <ColorInput
                label="رنگ عنوان"
                name="titleColor"
                value={userInputData?.blocks?.setting?.titleColor || "#000000"}
                onChange={(e) => {
                  if (isUpdating) return;
                  setIsUpdating(true);

                  setUserInputData((prev) => ({
                    ...prev,
                    blocks: {
                      ...prev.blocks,
                      setting: {
                        ...prev.blocks.setting,
                        titleColor: e.target.value,
                      },
                    },
                  }));

                  setTimeout(() => setIsUpdating(false), 100);
                }}
              />
              <ColorInput
                label="رنگ دکمه"
                name="buttonColor"
                value={userInputData?.blocks?.setting?.buttonColor || "#000000"}
                onChange={(e) => {
                  if (isUpdating) return;
                  setIsUpdating(true);

                  setUserInputData((prev) => ({
                    ...prev,
                    blocks: {
                      ...prev.blocks,
                      setting: {
                        ...prev.blocks.setting,
                        titleColor: e.target.value,
                      },
                    },
                  }));

                  setTimeout(() => setIsUpdating(false), 100);
                }}
              />
              <ColorInput
                label="رنگ متن دکمه"
                name="buttonTextColor"
                value={
                  userInputData?.blocks?.setting?.buttonTextColor || "#000000"
                }
                onChange={(e) => {
                  if (isUpdating) return;
                  setIsUpdating(true);

                  setUserInputData((prev) => ({
                    ...prev,
                    blocks: {
                      ...prev.blocks,
                      setting: {
                        ...prev.blocks.setting,
                        titleColor: e.target.value,
                      },
                    },
                  }));

                  setTimeout(() => setIsUpdating(false), 100);
                }}
              />
              <ColorInput
                label="رنگ شروع گرادیانت"
                name="gradientFromColor"
                value={userInputData?.setting.gradientFromColor}
                onChange={handleSettingChange}
              />
              <ColorInput
                label="رنگ پایان گرادیانت"
                name="gradientToColor"
                value={userInputData?.setting.gradientToColor}
                onChange={handleSettingChange}
              />
            </div>
          </div>
        )}
      </div>

      {/* Spacing Settings */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <button
          onClick={() => setIsSpacingOpen(!isSpacingOpen)}
          className="w-full flex justify-between items-center p-4 hover:bg-gray-50 rounded-xl"
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
          <div className="p-4 border-t border-gray-100">
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
