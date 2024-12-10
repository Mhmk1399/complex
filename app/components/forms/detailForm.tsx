import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, DetailPageSection } from "@/lib/types";
import React from "react";
import MarginPaddingEditor from "../sections/editor";

interface DetailFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<DetailPageSection>>;
  userInputData: DetailPageSection;
  layout: Layout;
  selectedComponent: string;
}
interface BoxValues {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface MarginPaddingEditorProps {
  margin: BoxValues;
  padding: BoxValues;
  onChange: (type: "margin" | "padding", updatedValues: BoxValues) => void;
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
        value={value || "#000000"}
        onChange={onChange}
        className="border p-0.5 rounded-full"
      />
    </div>
  </>
);

export const DetailForm: React.FC<DetailFormProps> = ({
  setUserInputData,
  userInputData,
  layout,
  selectedComponent,
}) => {
  const [margin, setMargin] = React.useState<BoxValues>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });
  const [padding, setPadding] = React.useState<BoxValues>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });
  const [isStyleSettingsOpen, setIsStyleSettingsOpen] = useState(false);
  const [openColumns, setOpenColumns] = useState<Record<number, boolean>>({});
  const [isHeadingOpen, setIsHeadingOpen] = useState(false);
  const [isSpacingOpen, setIsSpacingOpen] = useState(false);

  const handleUpdate = (
    type: "margin" | "padding",
    updatedValues: BoxValues
  ) => {
    if (type === "margin") {
      setMargin(updatedValues);
      setUserInputData((prev: DetailPageSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          marginTop: updatedValues.top.toString(),

          marginBottom: updatedValues.bottom.toString(),
        },
      }));
    } else {
      setPadding(updatedValues);
      setUserInputData((prev: DetailPageSection) => ({
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

  // const handleBlockSettingChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  // ) => {
  //   const { name, value } = e.target;
  //   console.log("Block Setting Change:", { name, value });
  //   console.log("Previous State:", userInputData);
  //   setUserInputData((prev: DetailPageSection) => {
  //     const newState = {
  //       ...prev,
  //       blocks: {
  //         ...prev?.blocks,
  //         setting: {
  //           ...(prev?.setting || {}),
  //           [name]: value,
  //         },
  //       },
  //     };
  //     console.log("New State:", newState);
  //     return newState;
  //   });
  // };

  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log("Setting Change:", { name, value });
    console.log("Previous State:", userInputData);
    setUserInputData((prev: DetailPageSection) => {
      const newState = {
        ...prev,
        setting: {
          ...prev.setting,
          [name]: value,
        },
      };
      console.log("New State:", newState);
      return newState;
    });
  };

  return (
    <div className="p-4 max-w-4xl  my-4 rounded-lg bg-gray-200" dir="rtl">
      <h2 className="text-xl font-bold my-4">تنظیمات صفحه محصول</h2>
      <div className="grid grid-cols-1  gap-1">
        <button
          onClick={() => setIsStyleSettingsOpen(!isStyleSettingsOpen)}
          className="w-full flex justify-between bg-white  items-center p-4 my-6 hover:bg-gray-50 rounded-xl transition-all duration-200"
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
          <>
            <div className="mb-6 p-4 bg-gray-50 rounded-lg animate-slideDown ">
              <h3 className="font-semibold mb-3 text-sky-700">تنظیمات تصویر</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block mb-1">عرض تصویر</label>
                  <input
                    type="range"
                    min={100}
                    max={2000}
                    name="imageWidth"
                    value={userInputData?.setting?.imageWidth || "400"}
                    onChange={handleSettingChange}
                    className="w-full p-2 border rounded"
                  />
                  <div className="text-sm text-gray-700">
                    {userInputData?.setting?.imageWidth}px
                  </div>
                </div>
                <div>
                  <label className="block mb-1">ارتفاع تصویر</label>
                  <input
                    type="range"
                    name="imageHeight"
                    min={100}
                    max={2000}
                    value={userInputData?.setting?.imageHeight || "500"}
                    onChange={handleSettingChange}
                    className="w-full p-2 border rounded"
                  />
                  <div className="text-sm text-gray-700">
                    {userInputData?.setting?.imageHeight}px
                  </div>
                </div>
                <div>
                  <label className="block mb-1">گردی گوشه‌های تصویر</label>
                  <input
                    type="range"
                    name="imageRadius"
                    min={50}
                    max={500}
                    value={userInputData?.setting?.imageRadius || "40"}
                    onChange={handleSettingChange}
                    className="w-full p-2 border rounded"
                  />
                  <div className="text-sm text-gray-700">
                    {userInputData?.setting?.imageRadius}px
                  </div>
                </div>
              </div>
            </div>

            {/* Product Name Settings */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg animate-slideDown ">
              <h3 className="font-semibold mb-3 text-sky-700">
                تنظیمات نام محصول
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <ColorInput
                    label="رنگ نام محصول"
                    name="productNameColor"
                    value={
                      userInputData?.setting?.productNameColor || "#FCA311"
                    }
                    onChange={handleSettingChange}
                  />
                </div>
                <div>
                  <label className="block mb-1">اندازه فونت نام محصول</label>
                  <input
                    type="range"
                    name="productNameFontSize"
                    value={userInputData?.setting?.productNameFontSize || "30"}
                    onChange={handleSettingChange}
                    className="w-full p-2 border rounded"
                  />
                  <div className="text-sm text-gray-700">
                    {userInputData?.setting?.productNameFontSize}px
                  </div>
                </div>
                <div>
                  <label className="block mb-1">وزن فونت نام محصول</label>
                  <select
                    name="productNameFontWeight"
                    value={
                      userInputData?.setting?.productNameFontWeight || "bold"
                    }
                    onChange={handleSettingChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="normal">معمولی</option>
                    <option value="bold">ضخیم</option>
                    <option value="600">نیمه ضخیم</option>
                  </select>
                </div>
                <div>
                  <ColorInput
                    label="رنگ  توضیحات محصول"
                    name="descriptionColor"
                    value={
                      userInputData?.setting?.descriptionColor || "#FCA311"
                    }
                    onChange={handleSettingChange}
                  />
                </div>
                <div>
                  <label className="block mb-1">
                    اندازه فونت توضیحات محصول
                  </label>
                  <input
                    type="range"
                    name="descriptionFontSize"
                    value={userInputData?.setting?.descriptionFontSize || "30"}
                    onChange={handleSettingChange}
                    className="w-full p-2 border rounded"
                  />
                  <div className="text-sm text-gray-700">
                    {userInputData?.setting?.descriptionFontSize}px
                  </div>
                </div>
              </div>
            </div>

            {/* Price Settings */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-3 text-sky-700">تنظیمات قیمت</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <ColorInput
                    label="رنگ متن قیمت"
                    name="priceColor"
                    value={userInputData?.setting?.priceColor || "#FCA311"}
                    onChange={handleSettingChange}
                  />
                </div>
                <div>
                  <label className="block mb-1">اندازه فونت قیمت</label>
                  <input
                    type="range"
                    name="priceFontSize"
                    value={userInputData?.setting?.priceFontSize || "24"}
                    onChange={handleSettingChange}
                    className="w-full p-2 border rounded"
                  />
                  <div className="text-sm text-gray-700">
                    {userInputData?.setting?.priceFontSize}px
                  </div>
                </div>
              </div>
            </div>

            {/* STATUS Settings */}

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-3 text-sky-700">تنظیمات وضعیت</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <ColorInput
                    label="رنگ متن وضعیت"
                    name="statusColor"
                    value={userInputData?.setting?.statusColor || "#FCA311"}
                    onChange={handleSettingChange}
                  />
                </div>
                <div>
                  <label className="block mb-1">اندازه فونت وضعیت</label>
                  <input
                    type="range"
                    name="statusFontSize"
                    value={userInputData?.setting?.statusFontSize || "24"}
                    onChange={handleSettingChange}
                    className="w-full p-2 border rounded"
                  />
                  <div className="text-sm text-gray-700">
                    {userInputData?.setting?.statusFontSize}px
                  </div>
                </div>
              </div>
            </div>
            {/* /* {category setting} */}

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-3 text-sky-700">
                تنظیمات دسته بندی
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <ColorInput
                    label="رنگ متن دسته بندی"
                    name="categoryColor"
                    value={userInputData?.setting?.categoryColor || "#FCA311"}
                    onChange={handleSettingChange}
                  />
                </div>
                <div>
                  <label className="block mb-1">اندازه فونت دسته بندی</label>
                  <input
                    type="range"
                    name="categoryFontSize"
                    value={userInputData?.setting?.categoryFontSize || "24"}
                    onChange={handleSettingChange}
                    className="w-full p-2 border rounded"
                  />
                  <div className="text-sm text-gray-700">
                    {userInputData?.setting?.categoryFontSize}px
                  </div>
                </div>
              </div>
            </div>

            {/* Button Settings */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-3 text-sky-700">تنظیمات دکمه</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <ColorInput
                    label="  رنگ پس زمینه دکمه"
                    name="btnBackgroundColor"
                    value={
                      userInputData?.setting?.btnBackgroundColor || "#FCA311"
                    }
                    onChange={handleSettingChange}
                  />
                </div>
                <div>
                  <ColorInput
                    label="  رنگ  متن دکمه"
                    name="btnTextColor"
                    value={userInputData?.setting?.btnTextColor || "#FCA311"}
                    onChange={handleSettingChange}
                  />
                </div>
              </div>
            </div>

            {/* Background Settings */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-3 text-sky-700">
                تنظیمات پس‌زمینه
              </h3>
              <div>
                <ColorInput
                  label="رنگ   پس زمینه"
                  name="backgroundColor"
                  value={userInputData?.setting?.backgroundColor || "#FCA311"}
                  onChange={handleSettingChange}
                />
              </div>
            </div>
          </>
        )}
      </div>
      {/* Image Settings */}

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
