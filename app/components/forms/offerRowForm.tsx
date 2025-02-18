import { useEffect, useState } from "react";
import { Layout, OfferRowSection } from "@/lib/types";
import React from "react";
import MarginPaddingEditor from "../sections/editor";
import { Compiler } from "../compiler";
import { TabButtons } from "../tabButtons";

interface OfferRowFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<OfferRowSection>>;
  userInputData: OfferRowSection;
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

export const OfferRowForm: React.FC<OfferRowFormProps> = ({
  setUserInputData,
  userInputData,
  layout,
  selectedComponent,
}) => {
  const [isStyleSettingsOpen, setIsStyleSettingsOpen] = useState(false);
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [isSpacingOpen, setIsSpacingOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [collections, setCollections] = useState<
    Array<{ name: string; _id: string }>
  >([]);
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
    const initialData = Compiler(layout, selectedComponent)[0];
    setUserInputData(initialData);
  }, []);

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
        const response = await fetch("/api/collections", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("complexToken")}`,
          },
        });
        const data = await response.json();
        if (data.products.length > 0) {
          setCollections(data.products);
        }
        console.log(data.products);
      } catch (error) {
        console.error("Error fetching special offers:", error);
      }
    };

    fetchSpecialOffers();
  }, []);

  const handleBlockSettingChange = (
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

      {isContentOpen && (
        <div className="p-4 ">
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">
                عنوان بخش
              </label>
              <input
                type="text"
                name="titleText"
                value={userInputData?.blocks?.setting?.titleText || ""}
                onChange={handleBlockSettingChange}
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

      {isStyleSettingsOpen && (
        <div className="p-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-lg pr-3 inline-flex items-center justify-between gap-24">
              <ColorInput
                label="رنگ عنوان "
                name="titleColor"
                value={userInputData?.setting?.titleColor || "#ef394e"}
                onChange={handleBlockSettingChange}
              />
            </div>
            <div className="rounded-lg pr-3 inline-flex items-center justify-between gap-24">
              <ColorInput
                label="رنگ دکمه "
                name="buttonColor"
                value={userInputData?.blocks?.setting?.buttonColor || "#ef394e"}
                onChange={handleBlockSettingChange}
              />
            </div>
          </div>
        </div>
      )}

      {isSpacingOpen && (
        <div className="p-4 animate-slideDown">
          <div className=" rounded-lg flex items-center justify-center">
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

