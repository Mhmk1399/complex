import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, BrandsSection } from "@/lib/types";
import React from "react";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";

interface BrandsFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<BrandsSection>>;
  userInputData: BrandsSection;
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

export const BrandsForm: React.FC<BrandsFormProps> = ({
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
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [isSpacingOpen, setIsSpacingOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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

  const handleBrandChange = (index: number, field: string, value: string) => {
    if (isUpdating) return;
    setIsUpdating(true);
    setUserInputData((prev) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        brands: prev.blocks.brands.map((brand, i) =>
          i === index ? { ...brand, [field]: value } : brand
        ),
      },
    }));
    setTimeout(() => setIsUpdating(false), 100);
  };

  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (isUpdating) return;
    setIsUpdating(true);
    const { name, value } = e.target;
    setUserInputData((prev) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        setting: {
          ...prev.blocks.setting,
          [name]: value,
        },
      },
    }));
    setTimeout(() => setIsUpdating(false), 100);
  };

  const handleUpdate = (
    type: "margin" | "padding",
    updatedValues: BoxValues
  ) => {
    if (type === "margin") {
      setMargin(updatedValues);
      setUserInputData((prev) => ({
        ...prev,
        setting: {
          ...prev.setting,
          marginTop: updatedValues.top.toString(),
          marginBottom: updatedValues.bottom.toString(),
        },
      }));
    } else {
      setPadding(updatedValues);
      setUserInputData((prev) => ({
        ...prev,
        setting: {
          ...prev.setting,
          paddingTop: updatedValues.top.toString(),
          paddingBottom: updatedValues.bottom.toString(),
        },
      }));
    }
  };

  const handleTabChange = (tab: "content" | "style" | "spacing") => {
    setIsContentOpen(tab === "content");
    setIsStyleSettingsOpen(tab === "style");
    setIsSpacingOpen(tab === "spacing");
  };
  useEffect(() => {
    setIsContentOpen(true);
  }, []);

  return (
    <div className="p-3 max-w-4xl space-y-2 rounded" dir="rtl">
      <h2 className="text-lg font-bold mb-4">تنظیمات برندها</h2>

      {/* Tabs */}

      <TabButtons onTabChange={handleTabChange} />

      {/* Content Section */}

      {isContentOpen && (
        <div className="p-4 border-t border-gray-100 animate-slideDown">
          <input
            type="text"
            placeholder="عنوان"
            value={userInputData?.blocks?.heading || ""}
            onChange={(e) =>
              setUserInputData((prev) => ({
                ...prev,
                blocks: { ...prev.blocks, heading: e.target.value },
              }))
            }
            className="w-full p-2 border rounded mb-4"
          />

          {userInputData?.blocks?.brands.map((brand, index) => (
            <div
              key={brand.id}
              className="p-3 bg-gray-50 rounded-lg space-y-3 mb-4"
            >
              <h4 className="font-semibold">برند {index + 1}</h4>
              <input
                type="text"
                placeholder="نام برند"
                value={brand.name}
                onChange={(e) =>
                  handleBrandChange(index, "name", e.target.value)
                }
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="لوگو"
                value={brand.logo}
                onChange={(e) =>
                  handleBrandChange(index, "logo", e.target.value)
                }
                className="w-full p-2 border rounded"
              />
            </div>
          ))}
        </div>
      )}

      {/* Style Settings */}

      {isStyleSettingsOpen && (
        <div className="p-4 border-t border-gray-100 animate-slideDown">
          <div className="grid gap-4">
            <div className=" rounded-lg">
              <ColorInput
                label="رنگ عنوان"
                name="headingColor"
                value={userInputData?.blocks?.setting?.headingColor}
                onChange={handleSettingChange}
              />
              <div className="mt-3">
                <label className="block">سایز عنوان</label>
                <input
                  type="range"
                  name="headingFontSize"
                  value={userInputData?.blocks?.setting?.headingFontSize || 32}
                  onChange={handleSettingChange}
                  className="w-full"
                  min="24"
                  max="48"
                />
              </div>
            </div>

            <div className=" rounded-lg">
              <ColorInput
                label="رنگ نام برند"
                name="brandNameColor"
                value={userInputData?.blocks?.setting?.brandNameColor}
                onChange={handleSettingChange}
              />
              <div className="mt-3">
                <label className="block">سایز نام برند</label>
                <input
                  type="range"
                  name="brandNameFontSize"
                  value={
                    userInputData?.blocks?.setting?.brandNameFontSize || 16
                  }
                  onChange={handleSettingChange}
                  className="w-full"
                  min="12"
                  max="24"
                />
              </div>
            </div>

            <div className="rounded-lg">
              <label className="block mb-2">اندازه لوگو</label>
              <div className="flex gap-4">
                <input
                  type="number"
                  name="logoWidth"
                  placeholder="عرض"
                  value={userInputData?.blocks?.setting?.logoWidth || 96}
                  onChange={handleSettingChange}
                  className="w-1/2 p-2 border rounded"
                />
                <input
                  type="number"
                  name="logoHeight"
                  placeholder="ارتفاع"
                  value={userInputData?.blocks?.setting?.logoHeight || 96}
                  onChange={handleSettingChange}
                  className="w-1/2 p-2 border rounded"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacing Settings */}

      {isSpacingOpen && (
        <div className="p-4 border-t border-gray-100 animate-slideDown">
          <div className="bg-gray-50 rounded-lg flex items-center justify-center">
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
