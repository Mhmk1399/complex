import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { ProductSection, Layout } from "@/lib/types";

interface ProductListProps {
  setUserInputData: React.Dispatch<React.SetStateAction<ProductSection>>;
  userInputData: ProductSection;
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
        value={value}
        onChange={onChange}
        className="border p-0.5 rounded-full"
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
  const [inputText, setInputText] = useState("");
  const [json, setJson] = useState(null);

  const handleLiveInput = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    
    if (inputText.trim()) {
      const response = await fetch('/api/update-json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputText }),
      });
      
      const updatedJson = await response.json();
      setJson(updatedJson);
      
      // Update the form data with new JSON
      setUserInputData(prevData => ({
        ...prevData,
        blocks: updatedJson.children.sections[0].blocks,
        setting: updatedJson.children.sections[0].setting
      }));
    }
  };

  useEffect(() => {
    const initialData = Compiler(layout, selectedComponent);
    setUserInputData(initialData[0]);
  }, []);
  useEffect(() => {
    const initialData = Compiler(layout, selectedComponent);
    setUserInputData(initialData[0]);
  }, [selectedComponent]);
  const handleBlockChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev: ProductSection) => ({
      ...prev,
      blocks: {
        ...prev?.blocks,
        [name]: value,
      },
    }));
  };
  const handleProductChange = (index: number, field: string, value: string) => {
    setUserInputData((prev) => ({
      ...prev,
      blocks: prev.blocks.map((block, i) =>
        i === index ? { ...block, [field]: value } : block
      ),
    }));
  };

  const handleBlockSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInputData((prev: ProductSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        setting: {
          ...prev.setting,
          [name]: value,
        },
      },
    }));
  };



  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev: ProductSection) => ({
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
        <h3 className="text-lg font-semibold mb-4">تنظیمات عمومی</h3>
        <div className="grid grid-cols-1 gap-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={3}
            style={{ width: "100%" }}
            placeholder="یک جمله فارسی وارد کنید..."
          />
          <button onClick={handleLiveInput} style={{ marginTop: "10px" }}>
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
            placeholder="Grid Columns"
            className="border p-2 rounded"
          />
          {/* <label htmlFor="backgroundColor" className="block mb-2">
            رنگ پس‌زمینه
          </label> */}
          <ColorInput
            label="رنگ پس‌زمینه"
            name="backgroundColor"
            value={
              userInputData.setting.backgroundColor?.toString() ?? "#000000"
            }
            onChange={handleSettingChange}
          />
          {/* <input
            type="text"
            name="backgroundColor"
            value={userInputData.setting.backgroundColor}
            onChange={handleSettingChange}
            placeholder="Background Color"
            className="border p-2 rounded"
          /> */}
          <label htmlFor="paddingTop" className="block mb-2">
            فاصله درونی از بالا
          </label>
          <input
            type="range"
            name="paddingTop"
            value={userInputData.setting.paddingTop || 10}
            onChange={handleSettingChange}
            placeholder="Padding Top"
            className="border p-2 rounded"
          />
          <label htmlFor="paddingTop" className="block mb-2">
            فاصله درونی از پایین
          </label>
          <input
            type="range"
            name="paddingBottom"
            value={userInputData.setting.paddingBottom || 10}
            onChange={handleSettingChange}
            placeholder="Padding Bottom"
            className="border p-2 rounded"
          />
        </div>
      </div>
    </div>
  );
};
export default ProductListForm;
