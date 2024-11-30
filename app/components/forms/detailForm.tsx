import { useEffect } from "react";
import { Compiler } from "../compiler";
import {
  Layout,
  DetailPageSection,

} from "@/lib/types";

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

  useEffect(() => {
    const initialData = Compiler(layout, selectedComponent)[0];
    setUserInputData({
      ...defaultValues,
      ...initialData,
    });
  }, [selectedComponent]);

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
        setting: {
          ...prev.setting,
          [name]: value,
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
    <div className="p-2 max-w-4xl mx-auto" dir="rtl">
      <h2 className="text-xl font-bold mb-4">تنظیمات صفحه محصول</h2>

      {/* Product Content Section */}

      {/* Style Settings */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">تنظیمات ظاهری</h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">رنگ نام محصول</label>
            <input
              type="color"
              name="productNameColor"
              value={
                userInputData?.setting?.productNameColor ?? "#FCA311"
              }
              onChange={handleBlockSettingChange}
              className="p-1 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">سایز نام محصول</label>
            <input
              type="range"
              name="productNameFontSize"
              min="12"
              max="60"
              value={parseInt(
                userInputData?.setting?.productNameFontSize ?? "30"
              )}
              onChange={handleBlockSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">رنگ قیمت</label>
            <input
              type="color"
              name="priceColor"
              value={userInputData?.setting?.priceColor ?? "#2ECC71"}
              onChange={handleBlockSettingChange}
              className="p-1 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">رنگ دکمه</label>
            <input
              type="color"
              name="btnBackgroundColor"
              value={
                userInputData?.setting?.btnBackgroundColor ?? "#3498DB"
              }
              onChange={handleBlockSettingChange}
              className="p-1 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Layout Settings */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">تنظیمات چیدمان</h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">فاصله از بالا</label>
            <input
              type="range"
              name="paddingTop"
              min="0"
              max="100"
              value={userInputData?.setting?.paddingTop ?? "20"}
              onChange={handleSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">فاصله از پایین</label>
            <input
              type="range"
              name="paddingBottom"
              min="0"
              max="100"
              value={userInputData?.setting?.paddingBottom ?? "20"}
              onChange={handleSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
