import { useCallback, useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, OfferRowSection } from "@/lib/types";
import MarginPaddingEditor from "../sections/editor";
import debounce from "lodash/debounce"; // Add this import
import { TabButtons } from "../tabButtons";

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
      if (isUpdating) return;

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
      <h2 className="text-lg font-bold mb-4">تنظیمات پیشنهاد ویژه</h2>
      {/* Tabs */}
      {/* Use the TabButtons component */}
      <TabButtons onTabChange={handleTabChange} />
      {/* Content Section */}

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

      {/* Style Settings */}

      {isStyleSettingsOpen && (
        <div className="p-4 border-t border-gray-100">
          <div className="grid gap-4">
            <ColorInput
              label="رنگ عنوان"
              name="titleColor"
              value={userInputData?.blocks?.setting?.titleColor || "#000000"}
              onChange={(e) => {
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
                setUserInputData((prev) => ({
                  ...prev,
                  blocks: {
                    ...prev.blocks,
                    setting: {
                      ...prev.blocks.setting,
                      buttonColor: e.target.value,
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
                setUserInputData((prev) => ({
                  ...prev,
                  blocks: {
                    ...prev.blocks,
                    setting: {
                      ...prev.blocks.setting,
                      buttonTextColor: e.target.value,
                    },
                  },
                }));
                setTimeout(() => setIsUpdating(false), 100);
              }}
            />

            <ColorInput
              label="رنگ شروع گرادیانت"
              name="gradientFromColor"
              value={userInputData?.setting?.gradientFromColor || "#000000"}
              onChange={(e) => {
                setUserInputData((prev) => ({
                  ...prev,
                  setting: {
                    ...prev.setting,
                    gradientFromColor: e.target.value,
                  },
                }));
                setTimeout(() => setIsUpdating(false), 100);
              }}
            />

            <ColorInput
              label="رنگ پایان گرادیانت"
              name="gradientToColor"
              value={userInputData?.setting?.gradientToColor || "#000000"}
              onChange={(e) => {
                setUserInputData((prev) => ({
                  ...prev,
                  setting: {
                    ...prev.setting,
                    gradientToColor: e.target.value,
                  },
                }));
                setTimeout(() => setIsUpdating(false), 100);
              }}
            />
          </div>
        </div>
      )}

      {/* Spacing Settings */}
      {isSpacingOpen && (
        <div className="bg-white rounded-lg p-4 animate-slideDown">
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
  );
};
