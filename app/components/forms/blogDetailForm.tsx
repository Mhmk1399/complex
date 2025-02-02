import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, BlogDetailSection } from "@/lib/types";
import React from "react";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";

interface BlogDetailFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<BlogDetailSection>>;
  userInputData: BlogDetailSection;
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

export const BlogDetailForm: React.FC<BlogDetailFormProps> = ({
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
  const [isSpacingOpen, setIsSpacingOpen] = useState(false);

  const handleUpdate = (
    type: "margin" | "padding",
    updatedValues: BoxValues
  ) => {
    if (type === "margin") {
      setMargin(updatedValues);
      setUserInputData((prev: BlogDetailSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          marginTop: updatedValues.top.toString(),

          marginBottom: updatedValues.bottom.toString(),
        },
      }));
    } else {
      setPadding(updatedValues);
      setUserInputData((prev: BlogDetailSection) => ({
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
      setUserInputData(initialData);
    }
  }, [selectedComponent]);

  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value,
      },
    }));
  };

  const handleTabChange = (tab: "content" | "style" | "spacing") => {
    setIsStyleSettingsOpen(tab === "style");
    setIsSpacingOpen(tab === "spacing");
  };

  return (
    <div className="p-3 max-w-4xl space-y-2 rounded" dir="rtl">
      <h2 className="text-lg font-bold mb-4">تنظیمات جزئیات بلاگ</h2>

      {/* Tabs */}
      <TabButtons onTabChange={handleTabChange} />

      {/* Title Settings */}

      {isStyleSettingsOpen && (
        <>
          <div className="p-4">
            <div className="grid grid-cols-1 gap-4  rounded-lg mb-4">
              <h3 className="font-semibold text-sky-700 py-4">تنظیمات عنوان</h3>
              <div>
                <ColorInput
                  label="رنگ عنوان"
                  name="titleColor"
                  value={userInputData?.setting?.titleColor || "#1A1A1A"}
                  onChange={handleSettingChange}
                />
              </div>
              <div>
                <label className="block mb-1">اندازه فونت عنوان</label>
                <input
                  type="range"
                  min="24"
                  max="72"
                  name="titleFontSize"
                  value={userInputData?.setting?.titleFontSize || "36"}
                  onChange={handleSettingChange}
                  className="w-full p-2 border rounded"
                />
                <div className="text-sm text-gray-500">
                  {userInputData?.setting?.titleFontSize}px
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4  mb-4  rounded-lg ">
              <h3 className="font-semibold text-sky-700 py-4 mb-3">
                تنظیمات محتوا
              </h3>
              <div>
                <ColorInput
                  label="رنگ متن محتوا"
                  name="contentColor"
                  value={userInputData?.setting?.contentColor || "#2C2C2C"}
                  onChange={handleSettingChange}
                />
              </div>
              <div>
                <label className="block mb-1">اندازه فونت محتوا</label>
                <input
                  type="range"
                  min="14"
                  max="24"
                  name="contentFontSize"
                  value={userInputData?.setting?.contentFontSize || "18"}
                  onChange={handleSettingChange}
                  className="w-full p-2 border rounded"
                />
                <div className="text-sm text-gray-500">
                  {userInputData?.setting?.contentFontSize}px
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4  rounded-lg ">
              <h3 className="font-semibold text-sky-700 py-4 mb-3">
                تنظیمات تصویر
              </h3>
              <div>
                <label className="block mb-1">ارتفاع تصویر کاور</label>
                <input
                  type="range"
                  min="200"
                  max="1000"
                  name="coverImageHeight"
                  value={userInputData?.setting?.coverImageHeight || "400"}
                  onChange={handleSettingChange}
                  className="w-full p-2 border rounded"
                />
                <div className="text-sm text-gray-500">
                  {userInputData?.setting?.coverImageHeight}px
                </div>
              </div>
              <div>
                <label className="block mb-1">عرض تصویر کاور</label>
                <input
                  type="range"
                  min="200"
                  max="1800"
                  name="coverImageWidth"
                  value={userInputData?.setting?.coverImageWidth || "400"}
                  onChange={handleSettingChange}
                  className="w-full p-2 border rounded"
                />
                <div className="text-sm text-gray-500">
                  {userInputData?.setting?.coverImageWidth}px
                </div>
              </div>
              <div>
                <label className="block mb-1">گردی گوشه‌های تصویر</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  name="imageRadius"
                  value={userInputData?.setting?.imageRadius || "10"}
                  onChange={handleSettingChange}
                  className="w-full p-2 border rounded"
                />
                <div className="text-sm text-gray-500">
                  {userInputData?.setting?.imageRadius}px
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4  mt-4  rounded-lg ">
              <h3 className="font-semibold text-sky-700 py-4 mb-3">
                تنظیمات اطلاعات نویسنده و تاریخ
              </h3>
              <div>
                <ColorInput
                  label="رنگ متن"
                  name="metaColor"
                  value={userInputData?.setting?.metaColor || "#666666"}
                  onChange={handleSettingChange}
                />
              </div>
              <div>
                <label className="block mb-1">اندازه فونت</label>
                <input
                  type="range"
                  min="12"
                  max="80"
                  name="metaFontSize"
                  value={userInputData?.setting?.metaFontSize || "14"}
                  onChange={handleSettingChange}
                  className="w-full p-2 border rounded"
                />
                <div className="text-sm text-gray-500">
                  {userInputData?.setting?.dateFontSize}px
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 mt-4  rounded-lg ">
              <h3 className="font-semibold text-sky-700 py-4 mb-3">
                تنظیمات پس‌زمینه
              </h3>
              <div>
                <ColorInput
                  label="رنگ پس‌زمینه"
                  name="backgroundColor"
                  value={userInputData?.setting?.backgroundColor || "#ffffff"}
                  onChange={handleSettingChange}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Spacing Settings */}

      {isSpacingOpen && (
        <div className="p-4 border-t border-gray-100 animate-slideDown">
          <div className=" rounded-lg p-2 flex items-center justify-center">
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
