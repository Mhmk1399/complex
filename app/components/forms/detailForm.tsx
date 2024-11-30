import { useEffect } from "react";
import { Compiler } from "../compiler";
import { Layout, DetailPageSection } from "@/lib/types";

interface DetailFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<DetailPageSection>>;
  userInputData: DetailPageSection;
  layout: Layout;
  selectedComponent: string;
}

export const DetailForm: React.FC<DetailFormProps> = ({
  setUserInputData,
  userInputData,
  layout,
  selectedComponent,
}) => {
  const defaultValues = {
    blocks: {
      imageSrc: [],
      imageAlt: [],
      name: "",
      description: "",
      category: "",
      price: "",
      status: "",
      discount: "",
      id: "",
      innventory: "",
      setting: {
        imageWidth: "500px",
        imageHeight: "500px",
        imageRadius: "20px",
        productNameColor: "#FCA311",
        productNameFontSize: "30px",
        productNameFontWeight: "bold",
        priceColor: "#2ECC71",
        priceFontSize: "24px",
        descriptionColor: "#333333",
        descriptionFontSize: "16px",
        btnBackgroundColor: "#3498DB",
        btnTextColor: "#FFFFFF",
      },
    },
    setting: {
      paddingTop: "20",
      paddingBottom: "20",
      marginTop: "10",
      marginBottom: "10",
      backgroundColor: "#FFFFFF",
    },
  };

  // useEffect(() => {
  //   const initialData = Compiler(layout, selectedComponent);
  //   setUserInputData(initialData[0]);
  // }, []);
  // useEffect(() => {
  //   const initialData = Compiler(layout, selectedComponent);
  //   setUserInputData(initialData[0]);
  // }, [selectedComponent]);
  useEffect(() => {
    const initialData = {
      ...defaultValues,
      ...Compiler(layout, selectedComponent)[0],
    };
    console.log(initialData);

    setUserInputData(initialData);
  }, []);



  const handleBlockChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev: DetailPageSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [name]: value,
      },
    }));
  };

  const handleBlockSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInputData((prev: DetailPageSection) => ({
      ...prev,
      blocks: {
        ...prev?.blocks,
        setting: {
          ...(prev?.setting || {}),
          [name]: value,
        },
      },
    }));
  };

  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInputData((prev: DetailPageSection) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value,
      },
    }));
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
              type="text"
              name="imageWidth"
              value={userInputData?.setting?.imageWidth || "300"}
              onChange={handleBlockSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">ارتفاع تصویر</label>
            <input
              type="text"
              name="imageHeight"
              value={userInputData?.setting?.imageHeight || "500"}
              onChange={handleBlockSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">گردی گوشه‌های تصویر</label>
            <input
              type="text"
              name="imageRadius"
              value={userInputData?.setting?.imageRadius || "20"}
              onChange={handleBlockSettingChange}
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
            <label className="block mb-1">رنگ نام محصول</label>
            <input
              type="color"
              name="productNameColor"
              value={userInputData?.setting?.productNameColor || "#FCA311"}
              onChange={handleBlockSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">اندازه فونت نام محصول</label>
            <input
              type="range"
              name="productNameFontSize"
              value={userInputData?.setting?.productNameFontSize || "30"}
              onChange={handleBlockSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">وزن فونت نام محصول</label>
            <select
              name="productNameFontWeight"
              value={userInputData?.setting?.productNameFontWeight || "bold"}
              onChange={handleBlockSettingChange}
              className="w-full p-2 border rounded"
            >
              <option value="normal">معمولی</option>
              <option value="bold">ضخیم</option>
              <option value="600">نیمه ضخیم</option>
            </select>
          </div>
        </div>
      </div>

      {/* Price Settings */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3">تنظیمات قیمت</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block mb-1">رنگ قیمت</label>
            <input
              type="color"
              name="priceColor"
              value={userInputData?.setting?.priceColor || "#2ECC71"}
              onChange={handleBlockSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">اندازه فونت قیمت</label>
            <input
              type="range"
              name="priceFontSize"
              value={userInputData?.setting?.priceFontSize || "24"}
              onChange={handleBlockSettingChange}
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
            <label className="block mb-1">رنگ پس‌زمینه دکمه</label>
            <input
              type="color"
              name="btnBackgroundColor"
              value={userInputData?.setting?.btnBackgroundColor || "#3498DB"}
              onChange={handleBlockSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">رنگ متن دکمه</label>
            <input
              type="color"
              name="btnTextColor"
              value={userInputData?.setting?.btnTextColor || "#FFFFFF"}
              onChange={handleBlockSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Background Settings */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3">تنظیمات پس‌زمینه</h3>
        <div>
          <label className="block mb-1">رنگ پس‌زمینه</label>
          <input
            type="color"
            name="backgroundColor"
            value={userInputData?.setting?.backgroundColor || "#FFFFFF"}
            onChange={handleSettingChange}
            className="w-full p-2 border rounded"
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
                  type="number"
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
