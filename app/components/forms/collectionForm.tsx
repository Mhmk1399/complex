import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, CollectionSection } from "@/lib/types";

interface CollectionFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<CollectionSection>>;
  userInputData: CollectionSection | undefined;
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
  <div className="flex flex-col gap-2">
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

export const CollectionForm: React.FC<CollectionFormProps> = ({
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
  }, [selectedComponent]);

  const handleProductChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev: CollectionSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        products: prev.blocks.products.map((product, i) =>
          i === index ? { ...product, [name]: value } : product
        ),
      },
    }));
  };

  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev: CollectionSection) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value.includes("px") ? value : value,
      },
    }));
  };

  return (
    <>
      {!loaded ? (
        <p>Loading...</p>
      ) : (
        <div className="p-6 max-w-4xl mx-auto" dir="rtl">
          <h2 className="text-xl font-bold mb-4">تنظیمات مجموعه محصولات</h2>

          {/* Products */}
          {userInputData?.blocks?.products?.map((product, index) => (
            <div key={index} className="mb-6 p-4 border rounded">
              <h3 className="font-semibold mb-2">محصول {index + 1}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1">نام محصول</label>
                  <input
                    type="text"
                    name="name"
                    value={product.name || ""}
                    onChange={(e) => handleProductChange(e, index)}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1">قیمت</label>
                  <input
                    type="text"
                    name="price"
                    value={product.price || ""}
                    onChange={(e) => handleProductChange(e, index)}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1">آدرس تصویر</label>
                  <input
                    type="text"
                    name="imageSrc"
                    value={product.imageSrc || ""}
                    onChange={(e) => handleProductChange(e, index)}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1">متن جایگزین تصویر</label>
                  <input
                    type="text"
                    name="imageAlt"
                    value={product.imageAlt || ""}
                    onChange={(e) => handleProductChange(e, index)}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1">متن دکمه</label>
                  <input
                    type="text"
                    name="btnText"
                    value={product.btnText || ""}
                    onChange={(e) => handleProductChange(e, index)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Style Settings */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">تنظیمات ظاهری</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <ColorInput
                label="رنگ پس زمینه"
                name="backgroundColor"
                value={userInputData?.setting?.backgroundColor ?? "#ffffff"}
                onChange={handleSettingChange}
              />
              <ColorInput
                label="رنگ پس زمینه کارت"
                name="cardBackground"
                value={userInputData?.setting?.cardBackground ?? "#ffffff"}
                onChange={handleSettingChange}
              />
              <ColorInput
                label="رنگ نام محصول"
                name="productNameColor"
                value={userInputData?.setting?.productNameColor ?? "#000000"}
                onChange={handleSettingChange}
              />
              <ColorInput
                label="رنگ قیمت"
                name="priceColor"
                value={userInputData?.setting?.priceColor ?? "#000000"}
                onChange={handleSettingChange}
              />
              <ColorInput
                label="رنگ متن دکمه"
                name="btnTextColor"
                value={userInputData?.setting?.btnTextColor ?? "#ffffff"}
                onChange={handleSettingChange}
              />
              <ColorInput
                label="رنگ پس زمینه دکمه"
                name="btnBackgroundColor"
                value={userInputData?.setting?.btnBackgroundColor ?? "#000000"}
                onChange={handleSettingChange}
              />
            </div>

            {/* Grid Settings */}
            <div className="mt-4">
              <label className="block mb-1">تعداد ستون‌ها</label>
              <input
                type="range"
                name="gridColumns"
                min="1"
                max="4"
                value={userInputData?.setting?.gridColumns ?? 3}
                onChange={handleSettingChange}
                className="w-full"
              />
            </div>

            {/* Border Radius Settings */}
            <div className="mt-4">
              <label className="block mb-1">گردی گوشه‌های کارت</label>
              <input
                type="range"
                name="cardBorderRadius"
                min="0"
                max="30"
                value={parseInt(
                  userInputData?.setting?.cardBorderRadius ?? "8"
                )}
                onChange={handleSettingChange}
                className="w-full"
              />
            </div>

            <div className="mt-4">
              <label className="block mb-1">گردی گوشه‌های تصویر</label>
              <input
                type="range"
                name="imageRadius"
                min="0"
                max="30"
                value={parseInt(userInputData?.setting?.imageRadius ?? "8")}
                onChange={handleSettingChange}
                className="w-full"
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
      )}
    </>
  );
};
