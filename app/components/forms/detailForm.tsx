import { useEffect } from "react";
import { Compiler } from "../compiler";
import { Layout, DetailPageSection } from "@/lib/types";

interface DetailFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<DetailPageSection>>;
  userInputData: DetailPageSection;
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
    <div className="p-4 max-w-4xl mx-auto" dir="rtl">
      <h2 className="text-xl font-bold mb-4">تنظیمات صفحه محصول</h2>

      {/* Image Settings */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3">تنظیمات تصویر</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block mb-1">عرض تصویر</label>
            <input
              type="range"
              name="imageWidth"
              value={userInputData?.setting?.imageWidth || "400"}
              onChange={handleSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">ارتفاع تصویر</label>
            <input
              type="range"
              name="imageHeight"
              value={userInputData?.setting?.imageHeight || "500"}
              onChange={handleSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">گردی گوشه‌های تصویر</label>
            <input
              type="range"
              name="imageRadius"
              value={userInputData?.setting?.imageRadius || "40"}
              onChange={handleSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Product Name Settings */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3">تنظیمات نام محصول</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <ColorInput
              label="رنگ نام محصول"
              name="productNameColor"
              value={userInputData?.setting?.productNameColor || "#FCA311"}
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
          </div>
          <div>
            <label className="block mb-1">وزن فونت نام محصول</label>
            <select
              name="productNameFontWeight"
              value={userInputData?.setting?.productNameFontWeight || "bold"}
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
              value={userInputData?.setting?.descriptionColor || "#FCA311"}
              onChange={handleSettingChange}
            />
          </div>
          <div>
            <label className="block mb-1">اندازه فونت توضیحات محصول</label>
            <input
              type="range"
              name="descriptionFontSize"
              value={userInputData?.setting?.descriptionFontSize || "30"}
              onChange={handleSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Price Settings */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3">تنظیمات قیمت</h3>
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
          </div>
        </div>
      </div>

      {/* STATUS Settings */}

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3">تنظیمات وضعیت</h3>
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
          </div>
        </div>
      </div>
      {/* /* {category setting} */}

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3">تنظیمات دسته بندی</h3>
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
          </div>
        </div>
      </div>

      {/* Button Settings */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3">تنظیمات دکمه</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <ColorInput
              label="  رنگ پس زمینه دکمه"
              name="btnBackgroundColor"
              value={userInputData?.setting?.btnBackgroundColor || "#FCA311"}
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
        <h3 className="font-semibold mb-3">تنظیمات پس‌زمینه</h3>
        <div>
          <ColorInput
            label="رنگ   پس زمینه"
            name="backgroundColor"
            value={userInputData?.setting?.backgroundColor || "#FCA311"}
            onChange={handleSettingChange}
          />
        </div>
      </div>

      {/* Spacing Settings */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3">تنظیمات فاصله‌گذاری</h3>
        <div className="grid grid-cols-1 gap-4">
          {["paddingTop", "paddingBottom", "marginTop", "marginBottom"].map(
            (spacing, index) => (
              <div key={index}>
                <label className="block mb-1">
                  {spacing === "paddingTop"
                    ? "فاصله از بالا"
                    : spacing === "paddingBottom"
                    ? "فاصله از پایین"
                    : spacing === "marginTop"
                    ? "حاشیه از بالا"
                    : "حاشیه از پایین"}
                </label>
                <input
                  type="range"
                  name={spacing}
                  value={userInputData?.setting?.[spacing] || "20"}
                  onChange={handleSettingChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
