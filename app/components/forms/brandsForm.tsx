import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, BrandsSection } from "@/lib/types";
import React from "react";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";
import ImageSelectorModal from "../sections/ImageSelectorModal";

interface BrandsFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<BrandsSection>>;
  userInputData: BrandsSection;
  layout: Layout;
  selectedComponent: string;
}
interface ImageFile {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  storeId: string;
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
        className=" p-0.5 border  rounded-md border-gray-200 w-8 h-8 bg-transparent "
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
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
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
  }, [selectedComponent]); // Add dependency array

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
  const handleImageSelect = (image: ImageFile) => {
    handleBrandChange(currentSlideIndex, "logo", image.fileUrl);
    setIsImageSelectorOpen(false);
  };

  return (
    <div className="p-3 max-w-4xl space-y-2 rounded" dir="rtl">
      <h2 className="text-lg font-bold mb-4">تنظیمات برندها</h2>

      {/* Tabs */}

      <TabButtons onTabChange={handleTabChange} />

      {/* Content Section */}

      {isContentOpen && (
        <div className="p-4  animate-slideDown">
          <label htmlFor="">عنوان</label>
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
            className="w-full mt-2 p-2 border rounded mb-4"
          />

          {userInputData?.blocks?.brands.map((brand, index) => (
            <div
              key={brand.id}
              className="p-3 border-b border-gray-300  space-y-3 mb-4"
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
                placeholder="آدرس تصویر"
                value={brand.logo}
                onChange={(e) =>
                  handleBrandChange(index, "logo", e.target.value)
                }
                className="w-full hidden mb-2 p-2 border rounded"
              />
              <button
                onClick={() => {
                  setCurrentSlideIndex(index);
                  setIsImageSelectorOpen(true);
                }}
                className="px-4 py-2 mb-4 mt-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                انتخاب تصویر
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Style Settings */}

      {isStyleSettingsOpen && (
        <div className="p-4  animate-slideDown">
          <div className="grid gap-4">
            <div className="rounded-lg flex items-center justify-between ">
              <ColorInput
                label="رنگ عنوان"
                name="headingColor"
                value={userInputData?.blocks?.setting?.headingColor}
                onChange={handleSettingChange}
              />
            </div>
            <label htmlFor="">سایز عنوان کلی</label>
            <div className="flex items-center justify-center gap-4 p-4 rounded-lg border border-gray-300 shadow-sm">
              <input
                type="range"
                min="0"
                max="100"
                name="headingFontSize"
                value={userInputData?.blocks?.setting?.headingFontSize || "250"}
                onChange={handleSettingChange}
              />
              <p className="text-sm text-gray-600 text-nowrap">
                {userInputData?.blocks.setting.headingFontSize}px
              </p>
            </div>

            <div className="rounded-lg flex items-center justify-between ">
              <ColorInput
                label="رنگ نام برند"
                name="brandNameColor"
                value={userInputData?.blocks?.setting?.brandNameColor}
                onChange={handleSettingChange}
              />
            </div>
            <label htmlFor="">سایز عنوان برند</label>
            <div className="flex items-center justify-center gap-4 p-4 rounded-lg border border-gray-300 shadow-sm">
              <input
                type="range"
                min="0"
                max="100"
                name="brandNameFontSize"
                value={
                  userInputData?.blocks?.setting?.brandNameFontSize || "250"
                }
                onChange={handleSettingChange}
              />
              <p className="text-sm text-gray-600 text-nowrap">
                {userInputData?.blocks.setting.brandNameFontSize}px
              </p>
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
        <div className="p-4  animate-slideDown">
          <div className="bg-gray-50 rounded-lg flex items-center justify-center">
            <MarginPaddingEditor
              margin={margin}
              padding={padding}
              onChange={handleUpdate}
            />
          </div>
        </div>
      )}
      <ImageSelectorModal
        isOpen={isImageSelectorOpen}
        onClose={() => setIsImageSelectorOpen(false)}
        onSelectImage={handleImageSelect}
      />
    </div>
  );
};
