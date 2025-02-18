"use client";
import { useState, useEffect } from "react";
import { Layout, GallerySection } from "@/lib/types";
import { Compiler } from "../compiler";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";
import ImageSelectorModal from "../sections/ImageSelectorModal";

interface GalleryFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<GallerySection>>;
  userInputData: GallerySection;
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
        className=" p-0.5 border rounded-md border-gray-200 w-8 h-8 bg-transparent "
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
  const [isImagesOpen] = useState(false);
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

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

  const handleTabChange = (tab: "content" | "style" | "spacing") => {
    setIsContentOpen(tab === "content");
    setIsStyleSettingsOpen(tab === "style");
    setIsSpacingOpen(tab === "spacing");
  };
  useEffect(() => {
    setIsContentOpen(true);
  }, []);

  const handleImageSelect = (image: ImageFile) => {
    handleImageChange(currentSlideIndex, "imageSrc", image.fileUrl);
    handleImageChange(currentSlideIndex, "imageAlt", image.fileName);
    setIsImageSelectorOpen(false);
  };

  return (
    <div className="p-3 max-w-4xl space-y-2 rounded" dir="rtl">
      <h2 className="text-lg font-bold mb-4">تنظیمات گالری</h2>

      {/* Tabs */}

      <TabButtons onTabChange={handleTabChange} />

      {/* Content Section */}

      {isContentOpen && (
        <div className="p-4  animate-slideDown">
          <div className="space-y-4">
            <div>
              <label className="block mb-2">عنوان</label>
              <input
                type="text"
                name="title"
                value={userInputData?.blocks?.title || "عنوان"}
                onChange={handleBlockChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">توضیحات</label>
              <textarea
                name="description"
                value={userInputData?.blocks?.description || "توضیحات"}
                onChange={handleBlockChange}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>
            <div className=" border-t  border-gray-100 animate-slideDown">
              <button
                onClick={addNewImage}
                className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
              >
                افزودن تصویر جدید
              </button>

              {userInputData?.blocks?.images?.map((image, index) => (
                <div key={index} className="mb-4 p-4 border h-full rounded">
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
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="آدرس تصویر"
                        value={image.imageSrc}
                        onChange={(e) =>
                          handleImageChange(index, "imageSrc", e.target.value)
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
          </div>
        </div>
      )}

      {/* Images Section */}

      {isImagesOpen && (
        <div className="p-4  animate-slideDown">
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

      {/* Style Settings */}

      {isStyleSettingsOpen && (
        <div className="p-4 animate-slideDown">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {/* Title Settings */}
            <div className="space-y-4">
              <h4 className="font-bold">تنظیمات عنوان</h4>
              <div className="flex items-center justify-center gap-4 p-4 rounded-lg border border-gray-300 shadow-sm">
                <input
                  type="range"
                  min="0"
                  max="100"
                  name="titleFontSize"
                  value={userInputData?.blocks?.setting?.titleFontSize || "250"}
                  onChange={handleBlockSettingChange}
                />
                <p className="text-sm text-gray-600 text-nowrap">
                  {userInputData?.blocks.setting.titleFontSize}px
                </p>
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
              <div className="rounded-lg flex items-center justify-between ">
                <ColorInput
                  label="رنگ عنوان"
                  name="titleColor"
                  value={
                    userInputData?.blocks?.setting?.titleColor || "#000000"
                  }
                  onChange={handleBlockSettingChange}
                />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold">تنظیمات توضیحات</h4>
              <div className="flex items-center justify-center gap-4 p-4 rounded-lg border border-gray-300 shadow-sm">
                <input
                  type="range"
                  min="0"
                  max="100"
                  name="descriptionFontSize"
                  value={
                    userInputData?.blocks?.setting?.descriptionFontSize || "250"
                  }
                  onChange={handleBlockSettingChange}
                />
                <p className="text-sm text-gray-600 text-nowrap">
                  {userInputData?.blocks.setting.descriptionFontSize}px
                </p>
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
              <div className="rounded-lg flex items-center justify-between ">
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

              <div className="flex items-center justify-center gap-4 p-4 rounded-lg border border-gray-300 shadow-sm">
                <input
                  type="range"
                  min="0"
                  max="100"
                  name="gridGap"
                  value={userInputData?.blocks?.setting?.gridGap || "250"}
                  onChange={handleBlockSettingChange}
                />
                <p className="text-sm text-gray-600 text-nowrap">
                  {userInputData?.blocks.setting.gridGap}px
                </p>
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

              <label className="block">گردی گوشه‌ها</label>

              <div className="flex items-center justify-center gap-4 p-4 rounded-lg border border-gray-300 shadow-sm">
                <input
                  type="range"
                  min="0"
                  max="100"
                  name="imageRadius"
                  value={userInputData?.blocks?.setting?.imageRadius || "250"}
                  onChange={handleBlockSettingChange}
                />
                <p className="text-sm text-gray-600 text-nowrap">
                  {userInputData?.blocks.setting.imageRadius}px
                </p>
              </div>
            </div>
            <div className="rounded-lg flex items-center justify-between ">
              <ColorInput
                label="رنگ پس زمینه"
                name="background"
                value={userInputData?.blocks?.setting?.background || "#000000"}
                onChange={handleBlockSettingChange}
              />
            </div>
          </div>
        </div>
      )}

      {/* Spacing Settings */}

      {isSpacingOpen && (
        <div className="p-4 animate-slideDown">
          <div className=" rounded-lg p-2 flex items-center justify-center">
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

export default GalleryForm;
