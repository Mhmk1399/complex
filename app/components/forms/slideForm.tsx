import { useEffect, useState } from "react";
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

export const SlideForm: React.FC<SlideFormProps> = ({
  setUserInputData,
  userInputData,
  layout,
  selectedComponent,
}) => {

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const initialData = Compiler(layout, selectedComponent)[0];
    if (initialData) {
      setLoaded(true);
      setUserInputData(initialData);
    }
    
  }, []);
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

  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  {loaded && <div className="p-6 max-w-4xl mx-auto" dir="rtl">
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
                value={(userInputData?.blocks?.[index] as Block)?.btnText || ""}
                onChange={(e) => handleBlockChange(e, index, "btnText")}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1">لینک دکمه</label>
              <input
                type="text"
                value={(userInputData?.blocks?.[index] as Block)?.btnLink || ""}
                onChange={(e) => handleBlockChange(e, index, "btnLink")}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
      ))}
      {/* Style Settings */}
      <div className="mb-6">
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
    </div>
 } </>
  );
};
