import { useEffect } from "react";
import { Compiler } from "../compiler";
import { Layout, BlogDetailSection } from "@/lib/types";

interface BlogDetailFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<BlogDetailSection>>;
  userInputData: BlogDetailSection;
  layout: Layout;
  selectedComponent: string;
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

  return (
    <div className="p-4 max-w-4xl mx-auto" dir="rtl">
      <h2 className="text-xl font-bold mb-4">تنظیمات جزئیات بلاگ</h2>

      {/* Title Settings */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3">تنظیمات عنوان</h3>
        <div className="grid grid-cols-1 gap-4">
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
          </div>
        </div>
      </div>

      {/* Content Settings */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3">تنظیمات محتوا</h3>
        <div className="grid grid-cols-1 gap-4">
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
          </div>
        </div>
      </div>

      {/* Image Settings */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3">تنظیمات تصویر</h3>
        <div className="grid grid-cols-1 gap-4">
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
          </div>
        </div>
      </div>

      {/* Meta Information Settings */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3">تنظیمات اطلاعات نویسنده و تاریخ</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <ColorInput
              label="رنگ متن"
              name="metaColor"
              value={userInputData?.setting?.dateColor || "#666666"}
              onChange={handleSettingChange}
            />
          </div>
          <div>
            <label className="block mb-1">اندازه فونت</label>
            <input
              type="range"
              min="12"
              max="18"
              name="metaFontSize"
              value={userInputData?.setting?.dateFontSize || "14"}
              onChange={handleSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Background Settings */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3">تنظیمات پس‌زمینه</h3>
        <div>
          <ColorInput
            label="رنگ پس‌زمینه"
            name="backgroundColor"
            value={userInputData?.setting?.backgroundColor || "#ffffff"}
            onChange={handleSettingChange}
          />
        </div>
      </div>

      {/* Spacing Settings */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3">تنظیمات فاصله‌گذاری</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block mb-1">فاصله داخلی از بالا</label>
            <input
              type="range"
              min="20"
              max="80"
              name="paddingTop"
              value={userInputData?.setting?.paddingTop || "40"}
              onChange={handleSettingChange}
              className="w-full p-2 border rounded"
            />
            <label className="block mb-1">فاصله داخلی از پایین</label>
            <input
              type="range"
              min="20"
              max="80"
              name="paddingBottom"
              value={userInputData?.setting?.paddingBottom || "40"}
              onChange={handleSettingChange}
              className="w-full p-2 border rounded"
            />
            <label className="block mb-1">فاصله بیرونی از پایین</label>
            <input
              type="range"
              min="20"
              max="80"
              name="marginBottom"
              value={userInputData?.setting?.marginBottom || "40"}
              onChange={handleSettingChange}
              className="w-full p-2 border rounded"
            />
            <label className="block mb-1">فاصله بیرونی از بالا</label>
            <input
              type="range"
              min="20"
              max="80"
              name="marginTop"
              value={userInputData?.setting?.marginTop || "40"}
              onChange={handleSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
