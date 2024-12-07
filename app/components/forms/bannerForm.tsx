import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, BannerSection } from "@/lib/types";
import React from "react";
import MarginPaddingEditor from "../sections/editor";
interface BannerFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<BannerSection>>;
  userInputData: BannerSection;
  layout: Layout;
  selectedComponent: string;
}
interface BoxValues {
  top: number;
  bottom: number;
}

interface MarginPaddingEditorProps {
  margin: BoxValues;
  padding: BoxValues;
  onChange: (type: "margin" | "padding", updatedValues: BoxValues) => void;
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

export const BannerForm: React.FC<BannerFormProps> = ({
  setUserInputData,
  userInputData,
  layout,
  selectedComponent,
}) => {
  const [margin, setMargin] = React.useState<BoxValues>({
    top: 0,
    bottom: 0,
  });
  const [padding, setPadding] = React.useState<BoxValues>({
    top: 0,
    bottom: 0,
  });
  const [activeMode, setActiveMode] = useState<"sm" | "lg">("sm");

  const handleModeChange = (mode: "sm" | "lg") => {
    setActiveMode(mode);
  };
  const handleUpdate = (
    type: "margin" | "padding",
    updatedValues: BoxValues
  ) => {
    if (type === "margin") setMargin(updatedValues);
    else setPadding(updatedValues);
  };
  useEffect(() => {
    const initialData = Compiler(layout, selectedComponent)[0];
    setUserInputData(initialData);

    
  }, []);
  console.log("log1", userInputData);

  // useEffect(() => {
  //   const initialData = Compiler(layout, selectedComponent)[0];
  //   setUserInputData(initialData);
  // }, [selectedComponent]);

  console.log("log2", userInputData);

  const handleBlockChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev: BannerSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [name]: value,
      },
    }));
  };

  const handleBlockSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev: BannerSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        setting: {
          ...prev.blocks.setting,
          [name]: value,
        },
      },
    }));
  };

  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInputData((prev: BannerSection) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value,
      },
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto" dir="rtl">
      <h2 className="text-xl font-bold mb-4 inline">تنظیمات بنر</h2>
      <div className="inline mr-3">
        <button
          className=" px-2 py-1 rounded-md"
          onClick={() => handleModeChange("sm")}
          style={{
            backgroundColor: activeMode === "sm" ? "blue" : "gray",
            color: "white",
          }}
        >
          SM
        </button>
        <button
          className="mx-2 px-2 py-1 rounded-md"
          onClick={() => handleModeChange("lg")}
          style={{
            backgroundColor: activeMode === "lg" ? "blue" : "gray",
            color: "white",
          }}
        >
          LG
        </button>
      </div>

      {/* Content Section */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">محتوا</h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">عکس</label>
            <input
              type="text"
              name="imageSrc"
              value={userInputData?.blocks?.imageSrc ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">سربرگ </label>

            <input
              type="text"
              name="text"
              value={userInputData?.blocks?.text ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">توضیحات</label>
            <textarea
              name="description"
              value={userInputData?.blocks?.description ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Style Settings */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">تنظیمات استایل</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <ColorInput
            label="رنگ سربرگ"
            name="textColor"
            value={
              userInputData?.blocks?.setting?.textColor?.toString() ?? "#333333"
            }
            onChange={handleBlockSettingChange}
          />
          <ColorInput
            label="رنگ توضیحات"
            name="descriptionColor"
            value={
              userInputData?.blocks?.setting?.descriptionColor?.toString() ??
              "#333333"
            }
            onChange={handleBlockSettingChange}
          />
          <ColorInput
            label="رنگ پس زمینه"
            name="backgroundColorBox"
            value={
              userInputData?.blocks?.setting?.backgroundColorBox?.toString() ??
              "#ffffff"
            }
            onChange={handleBlockSettingChange}
          />
        </div>

        <div className="mt-4">
          <label className="block mb-1">رفتار عکس</label>
          <select
            name="headingFontWeight"
            value={
              userInputData?.setting?.headingFontWeight?.toLocaleString() ??
              "normal"
            }
            onChange={() => handleSettingChange} // Remove the arrow function
            className="w-full p-2 border rounded"
          >
            <option value="cover">پوشش</option>
            <option value="contain">شامل</option>
            <option value="fill">کامل</option>
          </select>
        </div>
      </div>

      {/* Spacing Settings */}
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
            <div key={spacing}>
              <label className="block mb-1">{spacingLable[index].label}</label>
              <input
                type="range"
                name={spacing}
                min="0"
                max="100"
                value={userInputData?.setting?.[spacing]?.toString() ?? "0"}
                onChange={handleSettingChange}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </div>
      <div
        style={{ padding: "1rem", display: "flex", justifyContent: "center" }}
      >
        <MarginPaddingEditor
          margin={margin}
          padding={padding}
          onChange={handleUpdate}
        />
      </div>
    </div>
  );
};
