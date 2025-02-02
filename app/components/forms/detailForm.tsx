import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, DetailPageSection } from "@/lib/types";
import React from "react";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";
//

interface DetailFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<DetailPageSection>>;
  userInputData: DetailPageSection;
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

export const DetailForm: React.FC<DetailFormProps> = ({
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
      setUserInputData((prev: DetailPageSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          marginTop: updatedValues.top.toString(),

          marginBottom: updatedValues.bottom.toString(),
        },
      }));
    } else {
      setPadding(updatedValues);
      setUserInputData((prev: DetailPageSection) => ({
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
  }, []);
  useEffect(() => {
    const initialData = Compiler(layout, selectedComponent)[0];
    if (initialData) {
      setUserInputData(initialData);
    }
  }, [selectedComponent]);

  const [isUpdating, setIsUpdating] = useState(false);

  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (isUpdating) return;
    setIsUpdating(true);

    const { name, value } = e.target;
    setUserInputData((prev: DetailPageSection) => ({
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
      <h2 className="text-lg font-bold mb-4">تنظیمات صفحه محصول</h2>

      {/* Tabs */}
      <TabButtons onTabChange={handleTabChange} />

      {isStyleSettingsOpen && (
        <>
          <div className="mb-6  rounded-lg animate-slideDown ">
            <h3 className="font-semibold mb-3 text-sky-700">تنظیمات تصویر</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block mb-1">عرض تصویر</label>
                <input
                  type="range"
                  min={100}
                  max={2000}
                  name="imageWidth"
                  value={userInputData?.setting?.imageWidth || "400"}
                  onChange={handleSettingChange}
                  className="w-full p-2 border rounded"
                />
                <div className="text-sm text-gray-700">
                  {userInputData?.setting?.imageWidth}px
                </div>
              </div>
              <div>
                <label className="block mb-1">ارتفاع تصویر</label>
                <input
                  type="range"
                  name="imageHeight"
                  min={100}
                  max={2000}
                  value={userInputData?.setting?.imageHeight || "500"}
                  onChange={handleSettingChange}
                  className="w-full p-2 border rounded"
                />
                <div className="text-sm text-gray-700">
                  {userInputData?.setting?.imageHeight}px
                </div>
              </div>
              <div>
                <label className="block mb-1">گردی گوشه‌های تصویر</label>
                <input
                  type="range"
                  name="imageRadius"
                  min={0}
                  max={300}
                  value={userInputData?.setting?.imageRadius || "40"}
                  onChange={handleSettingChange}
                  className="w-full p-2 border rounded"
                />
                <div className="text-sm text-gray-700">
                  {userInputData?.setting?.imageRadius}px
                </div>
              </div>
            </div>
          </div>

          {/* Product Name Settings */}
          <div className="mb-6  rounded-lg animate-slideDown ">
            <h3 className="font-semibold mb-3 text-sky-700">
              تنظیمات نام محصول
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <ColorInput
                  label="رنگ نام محصول"
                  name="productNameColor"
                  value={userInputData?.setting?.productNameColor || "#000"}
                  onChange={handleSettingChange}
                />
              </div>
              <div>
                <label className="block mb-1">اندازه فونت نام محصول</label>
                <input
                  type="range"
                  name="productNameFontSize"
                  value={userInputData?.setting?.productNameFontSize || "30"}
                  onChange={handleSettingChange}
                  className="w-full p-2 border rounded"
                />
                <div className="text-sm text-gray-700">
                  {userInputData?.setting?.productNameFontSize}px
                </div>
              </div>
              <div>
                <label className="block mb-1">وزن فونت نام محصول</label>
                <select
                  name="productNameFontWeight"
                  value={
                    userInputData?.setting?.productNameFontWeight || "bold"
                  }
                  onChange={handleSettingChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="normal">معمولی</option>
                  <option value="bold">ضخیم</option>
                  <option value="600">نیمه ضخیم</option>
                </select>
              </div>
              <div>
                <ColorInput
                  label="رنگ  توضیحات محصول"
                  name="descriptionColor"
                  value={userInputData?.setting?.descriptionColor || "#FCA311"}
                  onChange={handleSettingChange}
                />
              </div>
              <div>
                <label className="block mb-1">اندازه فونت توضیحات محصول</label>
                <input
                  type="range"
                  name="descriptionFontSize"
                  value={userInputData?.setting?.descriptionFontSize || "30"}
                  onChange={handleSettingChange}
                  className="w-full p-2 border rounded"
                />
                <div className="text-sm text-gray-700">
                  {userInputData?.setting?.descriptionFontSize}px
                </div>
              </div>
            </div>
          </div>

          {/* Price Settings */}
          <div className="mb-6 rounded-lg">
            <h3 className="font-semibold mb-3 text-sky-700">تنظیمات قیمت</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <ColorInput
                  label="رنگ متن قیمت"
                  name="priceColor"
                  value={userInputData?.setting?.priceColor || "#FCA311"}
                  onChange={handleSettingChange}
                />
              </div>
              <div>
                <label className="block mb-1">اندازه فونت قیمت</label>
                <input
                  type="range"
                  name="priceFontSize"
                  value={userInputData?.setting?.priceFontSize || "24"}
                  onChange={handleSettingChange}
                  className="w-full p-2 border rounded"
                />
                <div className="text-sm text-gray-700">
                  {userInputData?.setting?.priceFontSize}px
                </div>
              </div>
            </div>
          </div>

          {/* STATUS Settings */}

          <div className="mb-6  rounded-lg">
            <h3 className="font-semibold mb-3 text-sky-700">تنظیمات وضعیت</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <ColorInput
                  label="رنگ متن وضعیت"
                  name="statusColor"
                  value={userInputData?.setting?.statusColor || "#FCA311"}
                  onChange={handleSettingChange}
                />
              </div>
              <div>
                <label className="block mb-1">اندازه فونت وضعیت</label>
                <input
                  type="range"
                  name="statusFontSize"
                  value={userInputData?.setting?.statusFontSize || "24"}
                  onChange={handleSettingChange}
                  className="w-full p-2 border rounded"
                />
                <div className="text-sm text-gray-700">
                  {userInputData?.setting?.statusFontSize}px
                </div>
              </div>
            </div>
          </div>
          {/* /* {category setting} */}

          <div className="mb-6  rounded-lg">
            <h3 className="font-semibold mb-3 text-sky-700">
              تنظیمات دسته بندی
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <ColorInput
                  label="رنگ متن دسته بندی"
                  name="categoryColor"
                  value={userInputData?.setting?.categoryColor || "#FCA311"}
                  onChange={handleSettingChange}
                />
              </div>
              <div>
                <label className="block mb-1">اندازه فونت دسته بندی</label>
                <input
                  type="range"
                  name="categoryFontSize"
                  value={userInputData?.setting?.categoryFontSize || "24"}
                  onChange={handleSettingChange}
                  className="w-full p-2 border rounded"
                />
                <div className="text-sm text-gray-700">
                  {userInputData?.setting?.categoryFontSize}px
                </div>
              </div>
            </div>
          </div>

          {/* Button Settings */}
          <div className="mb-6  rounded-lg">
            <h3 className="font-semibold mb-3 text-sky-700">تنظیمات دکمه</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <ColorInput
                  label="  رنگ پس زمینه دکمه"
                  name="btnBackgroundColor"
                  value={
                    userInputData?.setting?.btnBackgroundColor || "#FCA311"
                  }
                  onChange={handleSettingChange}
                />
              </div>
              <div>
                <ColorInput
                  label="  رنگ  متن دکمه"
                  name="btnTextColor"
                  value={userInputData?.setting?.btnTextColor || "#FCA311"}
                  onChange={handleSettingChange}
                />
              </div>
            </div>
          </div>

          {/* Background Settings */}
          <div className="mb-6 rounded-lg">
            <h3 className="font-semibold mb-3 text-sky-700">
              تنظیمات پس‌زمینه
            </h3>
            <div>
              <ColorInput
                label="رنگ   پس زمینه"
                name="backgroundColor"
                value={userInputData?.setting?.backgroundColor || "#FCA311"}
                onChange={handleSettingChange}
              />
            </div>
          </div>
          <div className="mb-6 rounded-lg">
            <h4 className="font-semibold mb-3 text-sky-700">تنظیمات باکس</h4>
            <div>
              <ColorInput
                label="رنگ پس زمینه باکس"
                name="backgroundColorBox"
                value={userInputData?.setting?.backgroundColorBox || "#FCA311"}
                onChange={handleSettingChange}
              />
            </div>
            <div>
              <label className="block mb-1">گردی گوشه‌های باکس</label>
              <input
                type="range"
                name="boxRadius"
                min={0}
                max={300}
                value={userInputData?.setting?.boxRadius || "40"}
                onChange={handleSettingChange}
                className="w-full p-2 border rounded"
              />
              <div className="text-sm text-gray-700">
                {userInputData?.setting?.imageRadius}px
              </div>
            </div>
          </div>
          <div className="mb-6 rounded-lg">
            <h4 className="font-semibold mb-3 text-sky-700">
              تنظیمات ویژگی ها
            </h4>
            <div>
              <ColorInput
                label="رنگ عنوان ویژگی"
                name="propertyKeyColor"
                value={userInputData?.setting?.propertyKeyColor || "#FCA311"}
                onChange={handleSettingChange}
              />
            </div>
            <div>
              <ColorInput
                label="رنگ متن ویژگی"
                name="propertyValueColor"
                value={userInputData?.setting?.propertyValueColor || "#FCA311"}
                onChange={handleSettingChange}
              />
             
            </div>
            <div>
              <ColorInput
                label="رنگ پس زمینه ویژگی"
                name="propertyBg"
                value={userInputData?.setting?.propertyBg || "#FCA311"}
                onChange={handleSettingChange}
              />
             
            </div>
          </div>
        </>
      )}

      {/* Spacing Settings */}
      {isSpacingOpen && (
        <div className="p-4 border-t border-gray-100 animate-slideDown">
          <div className="rounded-lg p-2 flex items-center justify-center">
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
