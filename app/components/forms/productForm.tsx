import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { ProductSection, Layout } from "@/lib/types";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";

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
    <label className="block mb-1">{label}</label>
    <div className="flex flex-col rounded-md gap-3 items-center">
      <input
        type="color"
        id={name}
        name={name}
        value={value || "#000000"}
        onChange={onChange}
        className=" p-0.5 border rounded-md border-gray-200 w-8 h-8 bg-transparent "
      />
    </div>
  </>
);

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
          <p>تنظیماتی برای انیمیشن وجود ندارد.</p>
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

            <div className="rounded-lg flex items-center justify-between ">
              {" "}
              <ColorInput
                label="رنگ فیلتر"
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

            <div className="rounded-lg flex items-center justify-between ">
              {" "}
              <ColorInput
                label=" رنگ پس زمینه فیلتر کارت"
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

      {/* Spacing Tab */}
      {isSpacingOpen && (
        <div className="p-4  animate-slideDown">
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
