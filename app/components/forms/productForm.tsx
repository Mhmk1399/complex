import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { ProductSection, Layout } from "@/lib/types";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";
import {
  ColorInput,
  DynamicRangeInput,
  DynamicSelectInput,
} from "./DynamicInputs";

interface ProductListProps {
  setUserInputData: React.Dispatch<React.SetStateAction<ProductSection>>;
  userInputData: ProductSection;
  layout: Layout;
  selectedComponent: string;
}
interface BoxValues {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export const ProductListForm: React.FC<ProductListProps> = ({
  setUserInputData,
  userInputData,
  layout,
  selectedComponent,
}) => {
  const [isStyleSettingsOpen, setIsStyleSettingsOpen] = useState(false);
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [isSpacingOpen, setIsSpacingOpen] = useState(false);
  const [isAnimationOpen, setIsAnimationOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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
      setUserInputData((prev: ProductSection) => ({
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
      setUserInputData((prev: ProductSection) => ({
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

  // Add this state to control updates

  // Modify your change handlers to include debouncing
  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (isUpdating) return;

    setIsUpdating(true);

    const { name, value } = e.target;
    setUserInputData((prev: ProductSection) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value,
      },
    }));

    // Reset the updating flag after a short delay
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
  useEffect(() => {
    setIsContentOpen(true);
  }, []);

  return (
    <div className="p-3 max-w-4xl space-y-2 rounded" dir="rtl">
      <h3 className="text-lg font-bold mb-4">تنظیمات فروشگاه</h3>

      {/* Tabs */}
      <TabButtons onTabChange={handleTabChange} />
      {isContentOpen && (
        <div className="p-4  animate-slideDown">
          <h3 className="text-lg font-semibold text-sky-700">تنظیمات محتوا</h3>
          <small>
            در صورت نیاز به افزودن محصولات، لطفاً از طریق تنظیمات فروشگاه در
            داشبورد اقدام کنید.
          </small>
          <br />
          <small className="text-red-600">
            در این قسمت فقط 7-8 عدد از محصولات نشون داده میشوند
          </small>
        </div>
      )}

      {isStyleSettingsOpen && (
        <>
          <div className="grid grid-cols-1 gap-4 p-4 animate-slideDown">
            <h3 className="font-semibold text-sky-700">تنظیمات عمومی</h3>

            <label htmlFor="gridColumns" className="block mb-2">
              تعداد ستون‌ها
            </label>
            <input
              type="number"
              name="gridColumns"
              max={4}
              value={userInputData.setting.gridColumns || 1}
              onChange={handleSettingChange}
              placeholder="Grid Columns"
              className="border p-2 rounded"
            />
            <div className="rounded-lg flex items-center justify-between ">
              {" "}
              <ColorInput
                label="رنگ پس‌زمینه"
                name="backgroundColor"
                value={
                  userInputData.setting.backgroundColor?.toString() ?? "#000000"
                }
                onChange={handleSettingChange}
              />
            </div>
            <h3 className="font-semibold text-sky-700">تنظیمات مرتب سازی</h3>

            <div className="rounded-lg flex items-center justify-between ">
              {" "}
              <ColorInput
                label="رنگ پس زمینه"
                name="filterRowBg"
                value={
                  userInputData?.setting?.filterRowBg?.toString() || "#000000"
                }
                onChange={handleSettingChange}
              />
            </div>

            <div className="rounded-lg flex items-center justify-between ">
              {" "}
              <ColorInput
                label="رنگ متن فیلتر"
                name="filterNameColor"
                value={
                  userInputData?.setting?.filterNameColor?.toString() ||
                  "#000000"
                }
                onChange={handleSettingChange}
              />
            </div>
            <h3 className="font-semibold text-sky-700">تنظیمات فیلتر کارت</h3>

            <div className="rounded-lg flex items-center justify-between ">
              {" "}
              <ColorInput
                label=" رنگ پس زمینه"
                name="filterCardBg"
                value={
                  userInputData?.setting?.filterCardBg?.toString() || "#000000"
                }
                onChange={handleSettingChange}
              />
            </div>

            <div className="rounded-lg flex items-center justify-between ">
              {" "}
              <ColorInput
                label=" رنگ پس زمینه دکمه"
                name="filterButtonBg"
                value={
                  userInputData?.setting?.filterButtonBg?.toString() ||
                  "#000000"
                }
                onChange={handleSettingChange}
              />
            </div>

            <div className="rounded-lg flex items-center justify-between ">
              {" "}
              <ColorInput
                label=" رنگ  متن دکمه"
                name="filterButtonTextColor"
                value={
                  userInputData?.setting?.filterButtonTextColor?.toString() ||
                  "#000000"
                }
                onChange={handleSettingChange}
              />
            </div>

            {/* Product Card Settings */}
            <div className="space-y-4 rounded-lg  ">
              <h4 className="font-bold text-sky-700 my-3">
                تنظیمات کارت محصول
              </h4>

              <DynamicRangeInput
                label="انحنای کارت"
                name="cardBorderRadius"
                min="0"
                max="50"
                value={
                  userInputData?.setting?.cardBorderRadius?.toString() ?? "10"
                }
                onChange={handleSettingChange}
              />

              <ColorInput
                label="رنگ پس‌زمینه  "
                name="cardBackground"
                value={
                  userInputData?.setting?.cardBackground?.toString() ??
                  "#ffffff"
                }
                onChange={handleSettingChange}
              />

              <DynamicRangeInput
                label="انحنای تصویر"
                name="imageRadius"
                min="0"
                max="50"
                value={userInputData?.setting?.imageRadius?.toString() ?? "8"}
                onChange={handleSettingChange}
              />
              

              <DynamicRangeInput
                label="اندازه فونت نام"
                name="nameFontSize"
                min="10"
                max="30"
                value={userInputData?.setting?.nameFontSize?.toString() ?? "18"}
                onChange={handleSettingChange}
              />
              <DynamicSelectInput
                label="وزن"
                name="nameFontWeight"
                value={userInputData?.setting?.nameFontWeight ?? "normal"}
                options={[
                  { value: "normal", label: "نرمال" },
                  { value: "bold", label: "ضخیم" },
                ]}
                onChange={handleSettingChange}
              />

              <ColorInput
                label="رنگ نام محصول"
                name="nameColor"
                value={
                  userInputData?.setting?.nameColor?.toString() ?? "#000000"
                }
                onChange={handleSettingChange}
              />

              <DynamicRangeInput
                label="اندازه فونت توضیحات"
                name="descriptionFontSize"
                min="8"
                max="40"
                value={
                  userInputData?.setting?.descriptionFontSize?.toString() ??
                  "14"
                }
                onChange={handleSettingChange}
              />
              <DynamicSelectInput
                label="وزن"
                name="descriptionFontWeight"
                value={
                  userInputData?.setting?.descriptionFontWeight ?? "normal"
                }
                options={[
                  { value: "normal", label: "نرمال" },
                  { value: "bold", label: "ضخیم" },
                ]}
                onChange={handleSettingChange}
              />

              <ColorInput
                label="رنگ توضیحات"
                name="descriptionColor"
                value={
                  userInputData?.setting?.descriptionColor?.toString() ??
                  "#666666"
                }
                onChange={handleSettingChange}
              />

              <DynamicRangeInput
                label="اندازه فونت قیمت"
                name="priceFontSize"
                min="10"
                max="25"
                value={
                  userInputData?.setting?.priceFontSize?.toString() ?? "16"
                }
                onChange={handleSettingChange}
              />

              <ColorInput
                label="رنگ قیمت"
                name="priceColor"
                value={
                  userInputData?.setting?.priceColor?.toString() ?? "#000000"
                }
                onChange={handleSettingChange}
              />

              <DynamicRangeInput
                label="انحنا دکمه سبد خرید"
                name="cartRadius"
                min="0"
                max="30"
                value={userInputData?.setting?.cartRadius?.toString() ?? "16"}
                onChange={handleSettingChange}
              />
              <ColorInput
                label="رنگ پس زمینه دکمه کارت"
                name="cartBakground"
                value={
                  userInputData?.setting?.cartBakground?.toString() ?? "#000000"
                }
                onChange={handleSettingChange}
              />
              <ColorInput
                label="رنگ متن دکمه کارت"
                name="cartColor"
                value={
                  userInputData?.setting?.cartColor?.toString() ?? "#000000"
                }
                onChange={handleSettingChange}
              />
            </div>

            {/* ✅ New Shadow Settings */}
            <div className="space-y-4 rounded-lg">
              <h4 className="font-bold text-sky-700 my-3">تنظیمات سایه</h4>
              <DynamicRangeInput
                label="افست افقی سایه"
                name="shadowOffsetX"
                min="-50"
                max="50"
                value={userInputData?.setting?.shadowOffsetX?.toString() ?? "0"}
                onChange={handleSettingChange}
              />
              <DynamicRangeInput
                label="افست عمودی سایه"
                name="shadowOffsetY"
                min="-50"
                max="50"
                value={userInputData?.setting?.shadowOffsetY?.toString() ?? "0"}
                onChange={handleSettingChange}
              />
              <DynamicRangeInput
                label="میزان بلور سایه"
                name="shadowBlur"
                min="0"
                max="100"
                value={userInputData?.setting?.shadowBlur?.toString() ?? "0"}
                onChange={handleSettingChange}
              />
              <DynamicRangeInput
                label="میزان گسترش سایه"
                name="shadowSpread"
                min="-20"
                max="20"
                value={userInputData?.setting?.shadowSpread?.toString() ?? "0"}
                onChange={handleSettingChange}
              />
              <ColorInput
                label="رنگ سایه"
                name="shadowColor"
                value={userInputData?.setting?.shadowColor?.toString() ?? "0"}
                onChange={handleSettingChange}
              />
            </div>
          </div>
        </>
      )}
      {isAnimationOpen && (
        <div className="p-4  animate-slideDown">
          <h3 className="text-lg font-semibold text-sky-700">
            تنظیمات انیمیشن
          </h3>
          <small>تنظیماتی برای انیمیشن وجود ندارد.</small>
        </div>
      )}

      {/* Spacing Tab */}
      {isSpacingOpen && (
        <div className="animate-slideDown">
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
export default ProductListForm;
