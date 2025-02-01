import { useEffect, useState } from "react";
import { Layout, ProductRowSection } from "@/lib/types";
import React from "react";
import MarginPaddingEditor from "../sections/editor";
import { Compiler } from "../compiler";
import { TabButtons } from "../tabButtons";

interface ProductRowFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<ProductRowSection>>;
  userInputData: ProductRowSection;
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

export const ProductRowForm: React.FC<ProductRowFormProps> = ({
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

  useEffect(() => {
    const initialData = Compiler(layout, selectedComponent)[0];
    setUserInputData(initialData);
  }, []);

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
          marginLeft: updatedValues.left.toString(),
          marginRight: updatedValues.right.toString(),
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
          paddingLeft: updatedValues.left.toString(),
          paddingRight: updatedValues.right.toString(),
        },
      }));
    }
  };

  const handleBlockChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [name]: value,
      },
    }));
  };

  const [isUpdating, setIsUpdating] = useState(false);
  const handleBlockSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (isUpdating) return;
    setIsUpdating(true);

    const { name, value } = e.target;
    setUserInputData((prev) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        setting: {
          ...prev.blocks.setting,
          [name]: value,
        },
      },
    }));

    setTimeout(() => setIsUpdating(false), 100);
  };

  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (isUpdating) return;
    setIsUpdating(true);
    const { name, value } = e.target;
    setUserInputData((prev) => ({
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
      <h2 className="text-lg font-bold mb-4">تنظیمات محصولات</h2>

      {/* Tabs */}

      <TabButtons onTabChange={handleTabChange} />

      {/* Content Section */}

      {isContentOpen && (
        <div className="p-4 border-t border-gray-100 animate-slideDown">
          <div className=" rounded-lg">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              عنوان بخش
            </label>
            <input
              type="text"
              name="textHeading"
              value={userInputData?.blocks?.textHeading || ""}
              onChange={handleBlockChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      )}

      {/* Style Settings */}

      {isStyleSettingsOpen && (
        <div className="p-4 border-t border-gray-100 animate-slideDown">
          <div className="grid grid-cols-1 gap-4">
            <div className=" rounded-lg">
              <h4 className="font-semibold text-sky-700 my-4">تنظیمات عنوان</h4>
              <ColorInput
                label="رنگ عنوان"
                name="headingColor"
                value={
                  userInputData?.blocks?.setting?.headingColor || "#000000"
                }
                onChange={handleBlockSettingChange}
              />
              <label>سایز عنوان</label>
              <input
                type="range"
                name="headingFontSize"
                min="16"
                max="100"
                value={userInputData?.blocks?.setting?.headingFontSize || "32"}
                onChange={handleBlockSettingChange}
                className="w-full"
              />
              <div className="text-gray-500">
                {userInputData?.blocks?.setting?.headingFontSize}px
              </div>
              <label
                htmlFor="
              "
                className="block my-2 text-sm "
              >
                وزن عنوان
              </label>
              <select
                name="headingFontWeight"
                value={
                  userInputData?.blocks?.setting?.headingFontWeight || "normal"
                }
                onChange={handleBlockSettingChange}
                className="w-full p-2 border rounded mt-2"
              >
                <option value="bold">ضخیم</option>
                <option value="normal">معمولی</option>
              </select>
            </div>

            <div className="p-3 bg-gray-100 rounded-lg">
              <h4 className="font-semibold text-sky-700 my-4">
                تنظیمات کارت محصول
              </h4>
              <ColorInput
                label="رنگ پس زمینه کارت"
                name="backgroundColor"
                value={userInputData?.setting.backgroundColor || "#FFFFFF"}
                onChange={handleSettingChange}
              />
            </div>
          </div>
        </div>
      )}

      {/* Spacing Settings */}

      {isSpacingOpen && (
        <div className="p-4 border-t border-gray-100 animate-slideDown">
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
  );
};
