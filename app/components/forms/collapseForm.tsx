import React, { useEffect } from "react";
import { Compiler } from "../compiler";
import {
  Layout,
  CollapseSection,
  CollapseBlock,
  CollapseBlockSetting,
} from "@/lib/types";

interface CollapseFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<CollapseSection>>;
  userInputData: CollapseSection;
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
  <div className="mb-4">
    <label className="block mb-1" htmlFor={name}>
      {label}
    </label>
    <input
      type="color"
      id={name}
      name={name}
      value={value || "#000000"}
      onChange={onChange}
      className="border p-0.5 rounded-full"
    />
  </div>
);

export const CollapseForm: React.FC<CollapseFormProps> = ({
  setUserInputData,
  userInputData,
  layout,
  selectedComponent,
}) => {
  useEffect(() => {
    const initialData = Compiler(layout, selectedComponent)[0];
    setUserInputData(initialData);
  }, []);

  const handleBlockChange = (index: number, field: string, value: string) => {
    setUserInputData((prev: CollapseSection) => ({
      ...prev,
      blocks: prev.blocks.map((block: CollapseBlock, i: number) =>
        i === index ? { ...block, [field]: value } : block
      ),
    }));
  };

  const handleBlockSettingChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setUserInputData((prev: CollapseSection) => ({
      ...prev,
      blocks: prev.blocks.map((block: CollapseBlock, i: number) =>
        i === index
          ? {
              ...block,
              setting: { ...block.setting, [field]: value },
            }
          : block
      ),
    }));
  };

  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInputData((prev: CollapseSection) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value,
      },
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto" dir="rtl">
      <h2 className="text-xl font-bold mb-4">تنظیمات آکاردئون</h2>
      {/* Main Heading Settings */}
      <div className="mb-6">
        <h3 className=" mb-2">سربرگ</h3>
        <input
          type="text"
          value={userInputData?.blocks?.[0]?.heading ?? ""}
          onChange={(e) => handleBlockChange(0, "heading", e.target.value)}
          className="w-full p-2 border rounded"
        />
        {/* Font Weight Controls */}

        <div>
          <label className="block mb-1">وزن سربرگ</label>
          <select
            name="headingFontWeight"
            value={
              userInputData?.setting?.headingFontWeight?.toString() ?? "normal"
            }
            onChange={(e) =>
              handleSettingChange(
                e as unknown as React.ChangeEvent<HTMLInputElement>
              )
            }
            className="w-full p-2 border rounded"
          >
            <option value="normal">نرمال</option>
            <option value="bold">ضخیم</option>
            <option value="lighter">نازک</option>
            <option value="bolder">ضخیم تر</option>
          </select>
        </div>
      </div>
      {/* Collapse Items */}
      {[1, 2, 3, 4].map((num, index) => (
        <div key={num} className="mb-6 p-4 border rounded">
          <h3 className="font-semibold mb-2">آکاردئون {num}</h3>

          <div className="space-y-4">
            <div>
              <label className="block mb-1">عنوان</label>
              <input
                type="text"
                value={String(
                  userInputData?.blocks?.[index]?.[
                    `text${num}` as keyof CollapseBlock
                  ] ?? ""
                )}
                onChange={(e) =>
                  handleBlockChange(index, `text${num}`, e.target.value)
                }
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1">محتوا</label>
              <textarea
                value={String(
                  userInputData?.blocks?.[index]?.[
                    `content${num}` as keyof CollapseBlock
                  ] ?? ""
                )}
                onChange={(e) =>
                  handleBlockChange(index, `content${num}`, e.target.value)
                }
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-1 gap-4">
              <ColorInput
                label={`رنگ عنوان ${num}`}
                name={`textColor${num}`}
                value={String(
                  userInputData?.blocks?.[index]?.setting?.[
                    `textColor${num}` as keyof CollapseBlockSetting
                  ] ?? "#000000"
                )}
                onChange={(e) =>
                  handleBlockSettingChange(
                    index,
                    `textColor${num}`,
                    e.target.value
                  )
                }
              />
              <ColorInput
                label={`رنگ محتوا ${num}`}
                name={`contentColor${num}`}
                value={String(
                  userInputData?.blocks?.[index]?.setting?.[
                    `contentColor${num}` as keyof CollapseBlockSetting
                  ] ?? "#000000"
                )}
                onChange={(e) =>
                  handleBlockSettingChange(
                    index,
                    `contentColor${num}`,
                    e.target.value
                  )
                }
              />
            </div>
          </div>
        </div>
      ))}{" "}
      {/* Global Settings */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">تنظیمات فاصله</h3>
        <div className="grid md:grid-cols-1 gap-4">
          <ColorInput
            label="رنگ پس زمینه"
            name="background"
            value={userInputData?.setting?.background?.toString() ?? "#672f93"}
            onChange={handleSettingChange}
          />
          <ColorInput
            label="رنگ سربرگ"
            name="headingColor"
            value={
              userInputData?.setting?.headingColor?.toString() ?? "#ffffff"
            }
            onChange={handleSettingChange}
          />
        </div>

        {/* Spacing Settings */}
        <div className="mt-4 grid grid-cols-1 gap-4">
          {["paddingTop", "paddingBottom", "marginTop", "marginBottom"].map(
            (spacing, index) => (
              <div key={index}>
                <label className="block mb-1">
                  {" "}
                  {spacingLable[index].label}
                </label>
                <input
                  type="range"
                  name={spacing}
                  min="0"
                  max="100"
                  value={String(
                    userInputData?.setting?.[
                      spacing as keyof typeof userInputData.setting
                    ] ?? "0"
                  )}
                  onChange={handleSettingChange}
                  className="w-full"
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
