import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, CollectionSection } from "@/lib/types";
import MarginPaddingEditor from "../sections/editor";
import React from "react";
import { TabButtons } from "../tabButtons";

interface CollectionFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<CollectionSection>>;
  userInputData: CollectionSection | undefined;
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
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [isSpacingOpen, setIsSpacingOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = (
    type: "margin" | "padding",
    updatedValues: BoxValues
  ) => {
    if (type === "margin") {
      setMargin(updatedValues);
      setUserInputData((prev: CollectionSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          marginTop: updatedValues.top.toString(),
          marginBottom: updatedValues.bottom.toString(),
        },
      }));
    } else {
      setPadding(updatedValues);
      setUserInputData((prev: CollectionSection) => ({
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
  },);

  useEffect(() => {
    const initialData = Compiler(layout, selectedComponent)[0];
    if (initialData) {
      setLoaded(true);
      setUserInputData(initialData);
    }
  }, [ selectedComponent ]);

  // const handleProductChange = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   index: number
  // ) => {
  //   const { name, value } = e.target;
  //   setUserInputData((prev: CollectionSection) => ({
  //     ...prev,
  //     blocks: {
  //       ...prev.blocks,
  //       products: prev.blocks.products.map((product, i) =>
  //         i === index ? { ...product, [name]: value } : product
  //       ),
  //     },
  //   }));
  // };

  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (isUpdating) return;
    setIsUpdating(true);
    const { name, value } = e.target;
    setUserInputData((prev: CollectionSection) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value,
      },
    }));
    setTimeout(() => setIsUpdating(false), 100);
  };

  const handleBlockChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev: CollectionSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [name]: value,
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

  return (
    <>
      {!loaded ? (
        <p>Loading...</p>
      ) : (
        <div className="p-3 max-w-4xl space-y-2 rounded" dir="rtl">
          <h2 className="text-lg font-bold mb-4">تنظیمات کالکشن</h2>

          {/* Tabs */}
          <TabButtons onTabChange={handleTabChange} />

          {/* Content Section */}

          {isContentOpen && (
            <div className="p-4 space-y-4 animate-slideDown">
              <div className=" rounded-lg">
                <label className="block mb-2 text-sm font-bold text-gray-700">
                  سربرگ
                </label>
                <input
                  type="text"
                  name="heading"
                  value={userInputData?.blocks?.heading || ""}
                  onChange={handleBlockChange}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          )}

          {/* Style Settings */}

          {isStyleSettingsOpen && (
            <>
              <div className="grid md:grid-cols-1 p-4 gap-4 animate-slideDown">
                <h4 className="font-semibold mb-2">تنظیمات سربرگ مجموعه</h4>
                <label> سایز سربرگ</label>
                <input
                  type="range"
                  name="headingFontSize"
                  value={userInputData?.setting?.headingFontSize || 24}
                  onChange={handleSettingChange}
                />
                <div className="text-gray-500 text-sm">
                  {userInputData?.setting?.headingFontSize}px
                </div>
                <label> سایز فونت سربرگ</label>
                <select
                  name="headingFontWeight"
                  value={userInputData?.setting?.headingFontWeight || "normal"}
                  onChange={handleSettingChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="normal">نرمال</option>
                  <option value="bold">ضخیم</option>
                </select>
                <ColorInput
                  label="رنگ سربرگ"
                  name="headingColor"
                  value={userInputData?.setting?.headingColor || "#000000"}
                  onChange={handleSettingChange}
                />
              </div>
              <h4 className="font-semibold my-4 pr-2">تنظیمات ظاهری</h4>
              <div className="grid md:grid-cols-1 p-4 gap-4">
                <ColorInput
                  label="رنگ پس زمینه"
                  name="backgroundColor"
                  value={userInputData?.setting?.backgroundColor || "#ffffff"}
                  onChange={handleSettingChange}
                />
                <ColorInput
                  label="رنگ نام محصول"
                  name="productNameColor"
                  value={userInputData?.setting?.productNameColor || "#000000"}
                  onChange={handleSettingChange}
                />
                <ColorInput
                  label="رنگ قیمت"
                  name="priceColor"
                  value={userInputData?.setting?.priceColor || "#000000"}
                  onChange={handleSettingChange}
                />
                <ColorInput
                  label="رنگ متن دکمه"
                  name="btnTextColor"
                  value={userInputData?.setting?.btnTextColor || "#ffffff"}
                  onChange={handleSettingChange}
                />
                <ColorInput
                  label="رنگ پس زمینه دکمه"
                  name="btnBackgroundColor"
                  value={
                    userInputData?.setting?.btnBackgroundColor || "#000000"
                  }
                  onChange={handleSettingChange}
                />
              </div>

              {/* Grid Settings
            <div className="mt-4">
              <label className="block mb-1">تعداد ستون‌ها</label>
              <input
                type="range"
                name="gridColumns"
                min="1"
                max="4"
                value={userInputData?.setting?.gridColumns || 3}
                onChange={handleSettingChange}
                className="w-full"
              />
            </div> */}

              {/* Border Radius Settings */}
           
              <div className=" p-4">
                <label className="block mb-1">گردی گوشه‌های تصویر</label>
                <input
                  type="range"
                  name="imageRadius"
                  min="0"
                  max="30"
                  value={parseInt(userInputData?.setting?.imageRadius || "8")}
                  onChange={handleSettingChange}
                  className="w-full"
                />
              </div>
            </>
          )}

          {/* Spacing Settings */}

          {isSpacingOpen && (
            <div className="p-4 border-t border-gray-100 animate-slideDown">
              <div className=" rounded-lg p-2 flex items-center justify-center">
                <MarginPaddingEditor
                  margin={margin}
                  padding={padding}
                  onChange={handleUpdate}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
