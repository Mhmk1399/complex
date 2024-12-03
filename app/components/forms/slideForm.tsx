import { useEffect } from "react";
import { Compiler } from "../compiler";
import { Layout, SlideSection, SlideBlock } from "@/lib/types";

interface SlideFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<SlideSection>>;
  userInputData: SlideSection;
  layout: Layout;
  selectedComponent: string;
}

const spacingLable = [
  {
    label: "قاصله درونی از بالا",
  },
  {
    label: "فاصله درونی از پایین",
  },
  {
    label: "فاصله بیرونی از بالا",
  },
  {
    label: "فاصله بیرونی از پایین",
  },
];

interface Block {
  imageSrc?: string;
  text?: string;
  description?: string;
  btnText?: string;
  btnLink?: string;
  imageAlt?: string;
  setting?: Record<string, string>;
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

export const SlideForm: React.FC<SlideFormProps> = ({
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
  }, []);
  useEffect(() => {
    const initialData = Compiler(layout, selectedComponent)[0];
    if (initialData) {
      setUserInputData(initialData);
    }
  }, [selectedComponent]);
  const handleBlockChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    field: keyof SlideBlock
  ) => {
    const { value } = e.target;
    setUserInputData((prev: SlideSection) => ({
      ...prev,
      blocks: prev.blocks.map((block, i) =>
        i === index ? { ...block, [field]: value } : block
      ),
    }));
  };

  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev: SlideSection) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value,
      },
    }));
  };

  return (
    <>
      <div className="p-6 max-w-4xl mx-auto" dir="rtl">
        <h2 className="text-xl font-bold mb-4">تنظیمات اسلاید شو</h2>

        {/* Slides Content */}
        {[0, 1].map((index) => (
          <div key={index} className="mb-8 p-4 border rounded">
            <h3 className="font-semibold mb-4">اسلاید {index + 1}</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-1">تصویر</label>
                <input
                  type="text"
                  value={
                    (userInputData?.blocks?.[index] as Block)?.imageSrc || ""
                  }
                  onChange={(e) => handleBlockChange(e, index, "imageSrc")}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block mb-1">عنوان</label>
                <input
                  type="text"
                  value={(userInputData?.blocks?.[index] as Block)?.text || ""}
                  onChange={(e) => handleBlockChange(e, index, "text")}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block mb-1">توضیحات</label>
                <textarea
                  value={
                    (userInputData?.blocks?.[index] as Block)?.description || ""
                  }
                  onChange={(e) => handleBlockChange(e, index, "description")}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>

              <div>
                <label className="block mb-1">متن دکمه</label>
                <input
                  type="text"
                  value={
                    (userInputData?.blocks?.[index] as Block)?.btnText || ""
                  }
                  onChange={(e) => handleBlockChange(e, index, "btnText")}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block mb-1">لینک دکمه</label>
                <input
                  type="text"
                  value={
                    (userInputData?.blocks?.[index] as Block)?.btnLink || ""
                  }
                  onChange={(e) => handleBlockChange(e, index, "btnLink")}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="mb-6 bg-gray-100 p-4 rounded-xl">
          <h3 className="font-semibold mb-2">تنظیمات رنگ و سایز</h3>
          <div className="grid grid-cols-1 gap-4">
            <label className="block mb-1">سایز سربرگ</label>
            <input
              type="range"
              name="textFontSize"
              min="0"
              max="100"
              value={userInputData?.setting?.textFontSize || 15}
              onChange={handleSettingChange}
              className="w-full"
            />
            <label className="block mb-1">وزن متن سربرگ</label>
            <select
              name="textFontWeight"
              value={userInputData?.setting?.textFontWeight ?? "400"}
              onChange={handleSettingChange}
              className="w-full p-2 border rounded"
            >
              <option value="bold">ضخیم</option>
              <option value="normal">نرمال</option>
            </select>
            <ColorInput
              label="رنگ متن سربرگ"
              name="textColor"
              value={userInputData?.setting?.textColor?.toString() ?? "#ffffff"}
              onChange={handleSettingChange}
            />
            <label className="block mb-1">سایز سربرگ</label>
            <input
              type="range"
              name="descriptionFontSize"
              min="0"
              max="100"
              value={userInputData?.setting?.descriptionFontSize || 15}
              onChange={handleSettingChange}
              className="w-full"
            />
            <label className="block mb-1">وزن متن سربرگ</label>
            <select
              name="descriptionFontWeight"
              value={userInputData?.setting?.descriptionFontWeight ?? "400"}
              onChange={handleSettingChange}
              className="w-full p-2 border rounded"
            >
              <option value="bold">ضخیم</option>
              <option value="normal">نرمال</option>
            </select>
            <ColorInput
              label="رنگ متن سربرگ"
              name="descriptionColor"
              value={
                userInputData?.setting?.descriptionColor?.toString() ??
                "#ffffff"
              }
              onChange={handleSettingChange}
            />
          </div>
        </div>
      </div>

      {/* Style Settings */}
      <div className="mb-6 bg-gray-100 p-4 rounded-xl" dir="rtl">
        <h3 className="font-semibold mb-2">تنظیمات فاصله</h3>
        <div className="grid grid-cols-1 gap-4">
          {(
            [
              "paddingTop",
              "paddingBottom",
              "marginTop",
              "marginBottom",
            ] as const
          ).map((spacing, index) => (
            <div key={index}>
              <label className="block mb-1"> {spacingLable[index].label}</label>
              <input
                type="range"
                name={spacing}
                min="0"
                max="100"
                value={parseInt(userInputData?.setting?.[spacing] || "0")}
                onChange={handleSettingChange}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
