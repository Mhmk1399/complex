import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { BlogSection, BlogListFormProps } from "@/lib/types";
import React from "react";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";
// import { set } from "lodash";

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
  const [isStyleSettingsOpen, setIsStyleSettingsOpen] = useState(false);
  const [isSpacingOpen, setIsSpacingOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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
    const initialData = Compiler(layout, selectedComponent)[0];
    setUserInputData(initialData);
  }, []);

  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (isUpdating) return;
    setIsUpdating(true);
    const { name, value } = e.target;
    setUserInputData((prev: BlogSection) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value,
      },
    }));
    setTimeout(() => setIsUpdating(false), 100);
  };

  const handleTabChange = (tab: "content" | "style" | "spacing") => {
    setIsStyleSettingsOpen(tab === "style");
    setIsSpacingOpen(tab === "spacing");
  };

  return (
    <div className="p-3 max-w-4xl space-y-2 rounded" dir="rtl">
      <h3 className="text-lg font-bold mb-4">تنظیمات بلاگ</h3>

      {/* Tabs */}
      <TabButtons onTabChange={handleTabChange} />
      {isStyleSettingsOpen && (
        <>
          <div className="grid grid-cols-1 gap-4 p-4 animate-slideDown">
            <h3 className="text-lg font-semibold text-sky-700">تنظیمات بلاگ</h3>

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
                userInputData.setting.cardBackgroundColor?.toString() ??
                "#ffffff"
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
              value={userInputData.setting.buttonColor?.toString() ?? "#0070f3"}
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
  );
};

export default BlogListForm;
