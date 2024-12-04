import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { BlogSection, BlogListFormProps } from "@/lib/types";

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
  const [inputText, setInputText] = useState("");
  const [json, setJson] = useState(null);

  const handleLiveInput = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    if (inputText.trim()) {
      const response = await fetch("/api/update-json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputText }),
      });

      const updatedJson = await response.json();
      setJson(updatedJson);

      setUserInputData((prevData) => ({
        ...prevData,
        blocks: updatedJson.children.sections[0].blocks,
        setting: updatedJson.children.sections[0].setting,
      }));
    }
  };

  useEffect(() => {
    const initialData = Compiler(layout, selectedComponent);
    setUserInputData(initialData[0]);
  }, [selectedComponent]);

  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev: BlogSection) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value,
      },
    }));
  };

  return (
    <div className="space-y-6 p-4" dir="rtl">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">تنظیمات بلاگ</h3>
        <div className="grid grid-cols-1 gap-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={3}
            style={{ width: "100%" }}
            placeholder="یک جمله فارسی وارد کنید..."
          />
          <button
            onClick={handleLiveInput}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            تبدیل
          </button>

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
            label="رنگ متن"
            name="textColor"
            value={userInputData.setting.textColor?.toString() ?? "#000000"}
            onChange={handleSettingChange}
          />
          <ColorInput
            label="رنگ پس‌زمینه دکمه"
            name="btnBackgroundColor"
            value={
              userInputData.setting.btnBackgroundColor?.toString() ?? "#000000"
            }
            onChange={handleSettingChange}
          />

          <ColorInput
            label="رنگ دکمه"
            name="buttonColor"
            value={userInputData.setting.buttonColor?.toString() ?? "#0070f3"}
            onChange={handleSettingChange}
          />

          <div className="space-y-4">
            <div>
              <label htmlFor="paddingTop" className="block mb-2">
                فاصله از بالا
              </label>
              <input
                type="range"
                name="paddingTop"
                min="0"
                max="100"
                value={userInputData.setting.paddingTop || 0}
                onChange={handleSettingChange}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="paddingBottom" className="block mb-2">
                فاصله از پایین
              </label>
              <input
                type="range"
                name="paddingBottom"
                min="0"
                max="100"
                value={userInputData.setting.paddingBottom || 0}
                onChange={handleSettingChange}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="marginTop" className="block mb-2">
                حاشیه از بالا
              </label>
              <input
                type="range"
                name="marginTop"
                min="0"
                max="100"
                value={userInputData.setting.marginTop || 0}
                onChange={handleSettingChange}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="marginBottom" className="block mb-2">
                حاشیه از پایین
              </label>
              <input
                type="range"
                name="marginBottom"
                min="0"
                max="100"
                value={userInputData.setting.marginBottom || 0}
                onChange={handleSettingChange}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="borderRadius" className="block mb-2">
                گردی گوشه‌ها
              </label>
              <input
                type="range"
                name="cardBorderRadius"
                min="0"
                max="30"
                value={userInputData.setting.cardBorderRadius || 0}
                onChange={handleSettingChange}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogListForm;
