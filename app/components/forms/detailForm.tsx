import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, DetailPageSection } from "@/lib/types";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";
import {
  ColorInput,
  DynamicRangeInput,
  DynamicSelectInput,
} from "./DynamicInputs";
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

export const DetailForm: React.FC<DetailFormProps> = ({
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
  const [isSpacingOpen, setIsSpacingOpen] = useState(false);
  const [isAnimationOpen, setIsAnimationOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isContentOpen, setIsContentOpen] = useState(false);

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
          marginLeft: updatedValues.left.toString(),
          marginRight: updatedValues.right.toString(),
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
    setUserInputData(initialData);
  }, []);

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
  const handleTabChange = (
    tab: "content" | "style" | "spacing" | "animation"
  ) => {
    setIsContentOpen(tab === "content");
    setIsStyleSettingsOpen(tab === "style");
    setIsSpacingOpen(tab === "spacing");
    setIsAnimationOpen(tab === "animation");
  };

  return (
    <div className="p-3 max-w-4xl space-y-2 rounded" dir="rtl">
      <h2 className="text-lg font-bold mb-4">تنظیمات صفحه محصول</h2>

      {/* Tabs */}
      <TabButtons onTabChange={handleTabChange} />
      {isContentOpen && (
        <div className="p-4  animate-slideDown">
          <h3 className="text-lg font-semibold text-sky-700">تنظیمات محتوا</h3>
          <small>تنظیماتی برای محتوا وجود ندارد</small>
        </div>
      )}
      {isStyleSettingsOpen && (
        <>
          {/* image setting */}
          <div className="mb-6  rounded-lg animate-slideDown ">
            <h3 className="font-semibold mb-3 text-sky-700">تنظیمات تصویر</h3>
            <DynamicRangeInput
              label="انحنا"
              name="imageRadius"
              min="0"
              max="50"
              value={userInputData?.setting?.imageRadius || "40"}
              onChange={handleSettingChange}
            />
          </div>

          {/* Product and description Settings */}
          <div className="mb-6 rounded-lg animate-slideDown ">
            <h3 className="font-semibold my-3 text-sky-700">
              تنظیمات نام محصول
            </h3>
            <div className="grid grid-cols-1 ">
              <DynamicRangeInput
                label="سایز"
                name="productNameFontSize"
                min="0"
                max="50"
                value={userInputData?.setting?.productNameFontSize || "40"}
                onChange={handleSettingChange}
              />
              <DynamicSelectInput
                label="وزن توضیحات"
                name="productNameFontWeight"
                value={userInputData?.setting?.productNameFontWeight || "bold"}
                options={[
                  { value: "bold", label: "ضخیم" },
                  { value: "normal", label: "نرمال" },
                ]}
                onChange={handleSettingChange}
              />
              <ColorInput
                label="رنگ"
                name="productNameColor"
                value={userInputData?.setting?.productNameColor || "#000"}
                onChange={handleSettingChange}
              />

              <h3 className="font-semibold my-3 text-sky-700">
                تنظیمات توضیحات محصول
              </h3>
              <DynamicRangeInput
                label="سایز"
                name="descriptionFontSize"
                min="0"
                max="50"
                value={userInputData?.setting?.descriptionFontSize || "40"}
                onChange={handleSettingChange}
              />
              <DynamicSelectInput
                label="وزن توضیحات"
                name="descriptionFontWeight"
                value={userInputData?.setting?.descriptionFontWeight || "bold"}
                options={[
                  { value: "bold", label: "ضخیم" },
                  { value: "normal", label: "نرمال" },
                ]}
                onChange={handleSettingChange}
              />
              <ColorInput
                label="رنگ"
                name="descriptionColor"
                value={userInputData?.setting?.descriptionColor || "#000"}
                onChange={handleSettingChange}
              />
            </div>
          </div>

          {/* Price Settings */}
          <div className="mb-6 rounded-lg">
            <h3 className="font-semibold mb-3 text-sky-700">تنظیمات قیمت</h3>
            <DynamicRangeInput
              label="سایز"
              name="priceFontSize"
              min="0"
              max="50"
              value={userInputData?.setting?.priceFontSize || "40"}
              onChange={handleSettingChange}
            />
            <ColorInput
              label="رنگ متن قیمت"
              name="priceColor"
              value={userInputData?.setting?.priceColor || "#FCA311"}
              onChange={handleSettingChange}
            />
          </div>

          {/* STATUS Settings */}
          <div className="mb-6 rounded-lg">
            <h3 className="font-semibold mb-3 text-sky-700">تنظیمات وضعیت</h3>
            <DynamicRangeInput
              label="سایز"
              name="statusFontSize"
              min="0"
              max="50"
              value={userInputData?.setting?.statusFontSize || "40"}
              onChange={handleSettingChange}
            />
            <ColorInput
              label="رنگ متن وضعیت"
              name="statusColor"
              value={userInputData?.setting?.statusColor || "#FCA311"}
              onChange={handleSettingChange}
            />
          </div>

          {/* /* {category setting} */}
          <div className="mb-6  rounded-lg">
            <h3 className="font-semibold mb-3 text-sky-700">
              تنظیمات دسته بندی
            </h3>
            <DynamicRangeInput
              label="سایز"
              name="categoryFontSize"
              min="0"
              max="50"
              value={userInputData?.setting?.categoryFontSize || "40"}
              onChange={handleSettingChange}
            />
            <ColorInput
              label="رنگ متن دسته بندی"
              name="categoryColor"
              value={userInputData?.setting?.categoryColor || "#FCA311"}
              onChange={handleSettingChange}
            />
          </div>

          {/* Button Settings */}
          <div className="mb-6 rounded-lg">
            <h3 className="font-semibold mb-3 text-sky-700">تنظیمات دکمه</h3>
            <DynamicRangeInput
              label="انحنا"
              name="btnRadius"
              min="0"
              max="30"
              value={userInputData?.setting?.btnRadius || "40"}
              onChange={handleSettingChange}
            />
            <ColorInput
              label="رنگ پس زمینه"
              name="btnBackgroundColor"
              value={userInputData?.setting?.btnBackgroundColor || "#FCA311"}
              onChange={handleSettingChange}
            />
            <ColorInput
              label="رنگ متن"
              name="btnTextColor"
              value={userInputData?.setting?.btnTextColor || "#FCA311"}
              onChange={handleSettingChange}
            />
          </div>

          {/* Background Settings */}
          <div className="mb-6 rounded-lg">
            <h3 className="font-semibold mb-3 text-sky-700">
              تنظیمات پس‌زمینه
            </h3>
            <DynamicRangeInput
              label="انحنا"
              name="Radius"
              min="0"
              max="100"
              value={userInputData?.setting?.Radius || "40"}
              onChange={handleSettingChange}
            />
            <ColorInput
              label="رنگ   پس زمینه"
              name="backgroundColor"
              value={userInputData?.setting?.backgroundColor || "#FCA311"}
              onChange={handleSettingChange}
            />
          </div>

          {/* Box Settings */}
          <div className="mb-6 rounded-lg">
            <h4 className="font-semibold mb-3 text-sky-700">تنظیمات باکس</h4>
            <DynamicRangeInput
              label="انحنا"
              name="boxRadius"
              min="0"
              max="50"
              value={userInputData?.setting?.boxRadius || "40"}
              onChange={handleSettingChange}
            />
            <ColorInput
              label="رنگ پس زمینه باکس"
              name="backgroundColorBox"
              value={userInputData?.setting?.backgroundColorBox || "#FCA311"}
              onChange={handleSettingChange}
            />
          </div>

          {/* properties settings */}
          <div className="mb-6 rounded-lg">
            <h4 className="font-semibold mb-3 text-sky-700">
              تنظیمات ویژگی ها
            </h4>
            <DynamicRangeInput
              label="انحنا"
              name="propertyRadius"
              min="0"
              max="50"
              value={userInputData?.setting?.propertyRadius || "40"}
              onChange={handleSettingChange}
            />
            <ColorInput
              label="رنگ عنوان ویژگی"
              name="propertyKeyColor"
              value={userInputData?.setting?.propertyKeyColor || "#FCA311"}
              onChange={handleSettingChange}
            />
            <ColorInput
              label="رنگ متن ویژگی"
              name="propertyValueColor"
              value={userInputData?.setting?.propertyValueColor || "#FCA311"}
              onChange={handleSettingChange}
            />
            <ColorInput
              label="رنگ پس زمینه ویژگی"
              name="propertyBg"
              value={userInputData?.setting?.propertyBg || "#FCA311"}
              onChange={handleSettingChange}
            />
          </div>
        </>
      )}

      {isAnimationOpen && (
        <div className="p-4  animate-slideDown">
          <h3 className="text-lg font-semibold text-sky-700">
            تنظیمات انیمیشن
          </h3>
          <p>تنظیماتی برای انیمیشن وجود ندارد.</p>
        </div>
      )}

      {/* Spacing Settings */}
      {isSpacingOpen && (
        <div className="animate-slideDown">
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
