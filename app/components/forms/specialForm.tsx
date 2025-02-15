import { useEffect, useState } from "react";
import { Layout, ProductCardData, SpecialOfferSection } from "@/lib/types";
import React from "react";
import MarginPaddingEditor from "../sections/editor";
import { Compiler } from "../compiler";
import { TabButtons } from "../tabButtons";

interface SpecialFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<SpecialOfferSection>>;
  userInputData: SpecialOfferSection;
  layout: Layout;
  selectedComponent: string;
  actualName: string;
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

export const SpecialForm: React.FC<SpecialFormProps> = ({
  setUserInputData,
  userInputData,
  layout,
  selectedComponent,
  actualName,
}) => {
  const [isStyleSettingsOpen, setIsStyleSettingsOpen] = useState(false);
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [isSpacingOpen, setIsSpacingOpen] = useState(false);
  const [collections, setCollections] = useState<
    Array<{ name: string; _id: string }>
  >([]);

  useEffect(() => {
    const initialData = Compiler(layout, selectedComponent)[0];
    setUserInputData(initialData);
    console.log(setCollections);
  }, [layout, selectedComponent, setUserInputData]);

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
          marginLeft: updatedValues.left.toString(),
          marginRight: updatedValues.right.toString(),
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
          paddingLeft: updatedValues.left.toString(),
          paddingRight: updatedValues.right.toString(),
        },
      }));
    }
  };
  useEffect(() => {
    const fetchSpecialOffers = async () => {
      try {
        const sectionData = layout?.sections?.children?.sections.find(
          (section) => section.type === actualName
        ) as SpecialOfferSection;

        const collectionId = sectionData?.blocks?.setting?.selectedCollection;
        if (!collectionId) {
          console.log("No collection ID found");
          return;
        }

        const response = await fetch(`/api/collections/id`, {
          headers: {
            "Content-Type": "application/json",
            collectionId: collectionId,
          },
        });

        const data = await response.json();

        // Add null checks before accessing nested properties
        if (data && data.collections && data.collections.length > 0) {
          setSpecialOfferProducts(data.collections[0].products || []);
        } else {
          console.log("No products found in the collection");
          setSpecialOfferProducts([]);
        }
      } catch (error) {
        console.error("Error fetching special offers:", error);
        setSpecialOfferProducts([]); // Set to empty array on error
      }
    };

    fetchSpecialOffers();
  }, [actualName, layout]);

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
    setUserInputData((prev: SpecialOfferSection) => ({
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

  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (isUpdating) return;
    setIsUpdating(true);
    const { name, value } = e.target;
    setUserInputData((prev) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value,
      },
    }));
    setTimeout(() => setIsUpdating(false), 100);
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
      <h2 className="text-lg font-bold mb-4">تنظیمات پیشنهاد ویژه</h2>
      <TabButtons onTabChange={handleTabChange} />
      {/* Content Section */}

      {isContentOpen && (
        <div className="p-4 border-t border-gray-100">
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">
                عنوان بخش
              </label>
              <input
                type="text"
                name="textHeading"
                value={userInputData?.blocks?.textHeading || ""}
                onChange={handleBlockChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">
                انتخاب کالکشن
              </label>
              <select
                name="selectedCollection"
                value={userInputData?.blocks?.setting?.selectedCollection || ""}
                onChange={handleBlockSettingChange}
                className="w-full p-2 border rounded"
              >
                <option value="">انتخاب کنید</option>
                {collections.map((collection) => (
                  <option key={collection._id} value={collection._id}>
                    {collection.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Style Settings */}

      {isStyleSettingsOpen && (
        <div className="p-4 border-t border-gray-100 animate-slideDown">
          <div className="grid md:grid-cols-1 gap-4">
            <div className="rounded-lg">
              <h4 className="font-semibold text-sky-700 my-4">تنظیمات عنوان</h4>
              <ColorInput
                label="رنگ عنوان"
                name="headingColor"
                value={
                  userInputData?.blocks?.setting?.headingColor || "#FFFFFF"
                }
                onChange={handleBlockSettingChange}
              />
              <label>سایز عنوان</label>
              <input
                type="range"
                name="headingFontSize"
                value={userInputData?.blocks?.setting?.headingFontSize || "32"}
                onChange={handleBlockSettingChange}
                className="w-full"
              />
              <select
                name="headingFontWeight"
                value={
                  userInputData?.blocks?.setting?.headingFontWeight || "normal"
                }
                onChange={handleBlockSettingChange}
                className="w-full p-2 border rounded"
              >
                <option value="bold">ضخیم</option>
                <option value="normal">معمولی</option>
              </select>
            </div>

            <div className="p-3 rounded-lg">
              <h4 className="font-semibold text-sky-700 my-4">
                تنظیمات پس زمینه
              </h4>
              <ColorInput
                label="رنگ پس زمینه"
                name="backgroundColor"
                value={userInputData?.setting?.backgroundColor || "#ef394e"}
                onChange={handleSettingChange}
              />
            </div>
          </div>
        </div>
      )}

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
function setSpecialOfferProducts(products: ProductCardData[]) {
  console.log(products);
}
