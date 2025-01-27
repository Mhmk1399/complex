"use client";
import { useState, useEffect } from "react";
import { Layout, GallerySection } from "@/lib/types";
import { Compiler } from "../compiler";
import MarginPaddingEditor from "../sections/editor";

interface GalleryFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<GallerySection>>;
  userInputData: GallerySection;
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
        name={name}
        value={value}
        onChange={onChange}
        className="border p-0.5 rounded-full"
      />
    </div>
  </>
);

export const GalleryForm: React.FC<GalleryFormProps> = ({
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
  const [isImagesOpen, setIsImagesOpen] = useState(false);

  const handleUpdate = (
    type: "margin" | "padding",
    updatedValues: BoxValues
  ) => {
    if (type === "margin") {
      setMargin(updatedValues);
      setUserInputData((prev: GallerySection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          marginTop: updatedValues.top.toString(),
          marginBottom: updatedValues.bottom.toString(),
        },
      }));
    } else {
      setPadding(updatedValues);
      setUserInputData((prev: GallerySection) => ({
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
    const initialData = Compiler(layout, selectedComponent);
    setUserInputData(initialData[0]);
  }, [selectedComponent]);

  const handleBlockChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [name]: value,
      },
    }));
  };
  const [isUpdating, setIsUpdating] = useState(false);
  const handleBlockSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (isUpdating) return;
    setIsUpdating(true);

    const { name, value } = e.target;
    setUserInputData((prev: GallerySection) => ({
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

  const handleImageChange = (index: number, field: string, value: string) => {
    setUserInputData((prev) => {
      const newImages = [...(prev.blocks.images || [])];
      newImages[index] = { ...newImages[index], [field]: value };
      return {
        ...prev,
        blocks: {
          ...prev.blocks,
          images: newImages,
        },
      };
    });
  };

  const addNewImage = () => {
    setUserInputData((prev) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        images: [
          ...(prev.blocks.images || []),
          { imageSrc: "", imageAlt: "", imageLink: "" },
        ],
      },
    }));
  };

  const removeImage = (index: number) => {
    setUserInputData((prev) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        images: prev.blocks.images.filter((_, i) => i !== index),
      },
    }));
  };

  return (
    <div
      className="p-3 max-w-4xl space-y-2 mx-4 bg-gray-100 rounded mt-4"
      dir="rtl"
    >
      <h2 className="text-xl font-bold mb-4">تنظیمات گالری</h2>

      {/* Content Section */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <button
          onClick={() => setIsContentOpen(!isContentOpen)}
          className="w-full flex justify-between items-center p-4 hover:bg-gray-50 rounded-xl transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <h3 className="font-semibold text-gray-700">سربرگ</h3>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isContentOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isContentOpen && (
          <div className="p-4 border-t border-gray-100 animate-slideDown">
            <div className="space-y-4">
              <div>
                <label className="block mb-2">عنوان</label>
                <input
                  type="text"
                  name="title"
                  value={userInputData?.blocks?.title || ""}
                  onChange={handleBlockChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">توضیحات</label>
                <textarea
                  name="description"
                  value={userInputData?.blocks?.description || ""}
                  onChange={handleBlockChange}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Images Section */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <button
          onClick={() => setIsImagesOpen(!isImagesOpen)}
          className="w-full flex justify-between items-center p-4 hover:bg-gray-50 rounded-xl"
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-semibold">تصاویر</span>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isImagesOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isImagesOpen && (
          <div className="p-4 border-t border-gray-100 animate-slideDown">
            <button
              onClick={addNewImage}
              className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              افزودن تصویر جدید
            </button>

            {userInputData?.blocks?.images?.map((image, index) => (
              <div key={index} className="mb-6 p-4 border rounded">
                <div className="flex justify-between items-center mb-4">
                  <h4>تصویر {index + 1}</h4>
                  <button
                    onClick={() => removeImage(index)}
                    className="text-red-500"
                  >
                    حذف
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2">آدرس تصویر</label>
                    <input
                      type="text"
                      value={image.imageSrc || ""}
                      onChange={(e) =>
                        handleImageChange(index, "imageSrc", e.target.value)
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">متن جایگزین</label>
                    <input
                      type="text"
                      value={image.imageAlt || ""}
                      onChange={(e) =>
                        handleImageChange(index, "imageAlt", e.target.value)
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">لینک (اختیاری)</label>
                    <input
                      type="text"
                      value={image.imageLink || ""}
                      onChange={(e) =>
                        handleImageChange(index, "imageLink", e.target.value)
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Style Settings */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <button
          onClick={() => setIsStyleSettingsOpen(!isStyleSettingsOpen)}
          className="w-full flex justify-between items-center p-4 hover:bg-gray-50 rounded-xl transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            <h3 className="font-semibold text-gray-700">تنظیمات استایل</h3>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isStyleSettingsOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isStyleSettingsOpen && (
          <div className="p-4 border-t border-gray-100 animate-slideDown">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              {/* Title Settings */}
              <div className="space-y-4">
                <h4 className="font-bold">تنظیمات عنوان</h4>
                <div>
                  <label className="block mb-2">سایز فونت عنوان</label>
                  <input
                    type="range"
                    name="titleFontSize"
                    min="16"
                    max="48"
                    value={
                      userInputData?.blocks?.setting?.titleFontSize || "24"
                    }
                    onChange={handleBlockSettingChange}
                    className="w-full"
                  />
                  <div className="text-gray-500">
                    {userInputData?.blocks?.setting?.titleFontSize}px
                  </div>
                </div>
                <div>
                  <label className="block mb-2">وزن فونت عنوان</label>
                  <select
                    name="titleFontWeight"
                    value={
                      userInputData?.blocks?.setting?.titleFontWeight?.toString() ??
                      "0"
                    }
                    onChange={handleBlockSettingChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="bold">ضخیم</option>
                    <option value="normal">نرمال</option>
                  </select>
                </div>
                <ColorInput
                  label="رنگ عنوان"
                  name="titleColor"
                  value={
                    userInputData?.blocks?.setting?.titleColor || "#000000"
                  }
                  onChange={handleBlockSettingChange}
                />
              </div>
              <div className="space-y-4">
                <h4 className="font-bold">تنظیمات توضیحات</h4>
                <div>
                  <label className="block mb-2">سایز فونت توضیحات</label>
                  <input
                    type="range"
                    name="descriptionFontSize"
                    min="16"
                    max="48"
                    value={
                      userInputData?.blocks?.setting?.descriptionFontSize ||
                      "24"
                    }
                    onChange={handleBlockSettingChange}
                    className="w-full"
                  />
                  <div className="text-gray-500">
                    {userInputData?.blocks?.setting?.descriptionFontSize}px
                  </div>
                </div>
                <div>
                  <label className="block mb-2">وزن فونت توضیحات</label>
                  <select
                    name="descriptionFontWeight"
                    value={
                      userInputData?.blocks?.setting?.descriptionFontWeight?.toString() ??
                      "0"
                    }
                    onChange={handleBlockSettingChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="bold">ضخیم</option>
                    <option value="normal">نرمال</option>
                  </select>
                </div>
                <ColorInput
                  label="رنگ توضیحات"
                  name="descriptionColor"
                  value={
                    userInputData?.blocks?.setting?.descriptionColor ||
                    "#000000"
                  }
                  onChange={handleBlockSettingChange}
                />
              </div>

              {/* Grid Settings */}
              <div className="space-y-4">
                <h4 className="font-bold">تنظیمات شبکه</h4>
                <div>
                  <label className="block mb-2">تعداد ستون‌ها</label>
                  <input
                    type="number"
                    name="gridColumns"
                    min="1"
                    max="6"
                    value={userInputData?.blocks?.setting?.gridColumns || "3"}
                    onChange={handleBlockSettingChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2">فاصله بین تصاویر</label>
                  <input
                    type="range"
                    name="gridGap"
                    value={userInputData?.blocks?.setting?.gridGap || "20"}
                    onChange={handleBlockSettingChange}
                    className="w-full p-2 border rounded"
                  />
                  <div className="text-gray-500">
                    {userInputData?.blocks?.setting?.gridGap}px
                  </div>
                </div>
              </div>

              {/* Image Settings */}
              <div className="space-y-4">
                <h4 className="font-bold">تنظیمات تصاویر</h4>
                <div>
                  <label className="block mb-2">ارتفاع تصاویر</label>
                  <input
                    type="number"
                    name="imageHeight"
                    value={userInputData?.blocks?.setting?.imageHeight || "200"}
                    onChange={handleBlockSettingChange}
                    className="w-full p-2 border rounded"
                  />
                  <div className="text-gray-500">
                    {userInputData?.blocks?.setting?.imageHeight}px
                  </div>
                </div>
                <div>
                  <label className="block mb-2">عرض تصاویر</label>
                  <input
                    type="number"
                    name="imageWidth"
                    value={userInputData?.blocks?.setting?.imageWidth || "200"}
                    onChange={handleBlockSettingChange}
                    className="w-full p-2 border rounded"
                  />
                  <div className="text-gray-500">
                    {userInputData?.blocks?.setting?.imageWidth}px
                  </div>
                </div>
                <div>
                  <label className="block mb-2">گردی گوشه‌ها</label>
                  <input
                    type="range"
                    name="imageRadius"
                    value={userInputData?.blocks?.setting?.imageRadius || "8"}
                    onChange={handleBlockSettingChange}
                    className="w-full p-2 border rounded"
                  />
                  <div className="text-gray-500">
                    {userInputData?.blocks?.setting?.imageRadius}px
                  </div>
                </div>
              </div>
              <ColorInput
                label="رنگ پس زمینه"
                name="background"
                value={userInputData?.blocks?.setting?.background || "#000000"}
                onChange={handleBlockSettingChange}
              />
            </div>
          </div>
        )}
      </div>

      {/* Spacing Settings */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Dropdown Header */}

        <button
          onClick={() => setIsSpacingOpen(!isSpacingOpen)}
          className="w-full flex justify-between items-center p-4 hover:bg-gray-50 rounded-xl transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            <h3 className="font-semibold text-gray-700">تنظیمات فاصله</h3>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isSpacingOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown Content */}
        {isSpacingOpen && (
          <div className="p-4 border-t border-gray-100 animate-slideDown">
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
    </div>
  );
};

export default GalleryForm;
