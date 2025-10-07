import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { BlogSection, BlogListFormProps } from "@/lib/types";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";
import { ColorInput, DynamicRangeInput } from "./DynamicInputs";

interface BoxValues {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export const BlogListForm: React.FC<BlogListFormProps> = ({
  setUserInputData,
  userInputData,
  layout,
  selectedComponent,
}) => {
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [isStyleSettingsOpen, setIsStyleSettingsOpen] = useState(false);
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
      setUserInputData((prev: BlogSection) => ({
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

  const handleTabChange = (
    tab: "content" | "style" | "spacing" | "animation"
  ) => {
    setIsContentOpen(tab === "content");
    setIsStyleSettingsOpen(tab === "style");
    setIsSpacingOpen(tab === "spacing");
    setIsAnimationOpen(tab === "animation");
  };

  return (
    <div className="p-2 max-w-4xl space-y-2 rounded" dir="rtl">
      <h3 className="text-lg font-bold mb-4">تنظیمات بلاگ</h3>

      {/* Tabs */}
      <TabButtons onTabChange={handleTabChange} />

      {isContentOpen && (
        <div className="p-2 animate-slideDown">
          <h3 className="text-lg font-semibold text-sky-700">تنظیمات محتوا</h3>
          <small>
            در صورت نیاز به افزودن بلاگ لطفاً از طریق تنظیمات بلاگ در
            داشبورد اقدام کنید.
          </small>
        </div>
      )}

      {isStyleSettingsOpen && (
        <>
          <div className="grid grid-cols-1  animate-slideDown">
            <h3 className="font-bold text-sky-700 my-3">تنظیمات پس زمینه</h3>
            {/* background */}
            <div>
              {" "}
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
                className="border w-full mb-2 p-2 rounded"
              />
              <DynamicRangeInput
                label="انحنا"
                name="Radius"
                min="0"
                max="100"
                value={userInputData?.setting?.Radius?.toString() ?? "0"}
                onChange={handleSettingChange}
              />
              <ColorInput
                label="رنگ پس‌زمینه"
                name="backgroundColor"
                value={
                  userInputData.setting.backgroundColor?.toString() ?? "#ffffff"
                }
                onChange={handleSettingChange}
              />
            </div>

            {/* card */}
            <div>
              <h3 className="font-bold text-sky-700 my-3">تنظیمات کارت</h3>
              <DynamicRangeInput
                label="انحنا"
                name="cardBorderRadius"
                min="0"
                max="100"
                value={userInputData.setting.cardBorderRadius || 0}
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
            </div>

            <div>
              <h3 className="font-bold text-sky-700 my-3">تنظیمات دکمه</h3>
              <ColorInput
                label="رنگ پس‌زمینه دکمه"
                name="btnBackgroundColor"
                value={
                  userInputData.setting.btnBackgroundColor?.toString() ??
                  "#000000"
                }
                onChange={handleSettingChange}
              />{" "}
              <ColorInput
                label="رنگ دکمه"
                name="buttonColor"
                value={
                  userInputData.setting.buttonColor?.toString() ?? "#0070f3"
                }
                onChange={handleSettingChange}
              />
              <DynamicRangeInput
                label="انحنا"
                name="btnRadius"
                min="0"
                max="30"
                value={userInputData.setting.btnRadius || 0}
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
        <div className="text-sm  animate-slideDown">
          <h3 className="font-semibold text-sky-700">
            تنظیمات انیمیشن
          </h3>
          <p>تنظیماتی برای انیمیشن وجود ندارد.</p>
        </div>
      )}

      {/* Dropdown Content */}
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

export default BlogListForm;
