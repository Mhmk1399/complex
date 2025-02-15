import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, SlideBannerSection } from "@/lib/types";
import React from "react";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";

interface SlideBannerFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<SlideBannerSection>>;
  userInputData: SlideBannerSection;
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
  <div className="flex flex-col gap-3">
    <label className="block mb-1">{label}</label>
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

export const SlideBannerForm: React.FC<SlideBannerFormProps> = ({
  setUserInputData,
  userInputData,
  layout,
  selectedComponent,
}) => {
  const [isStyleSettingsOpen, setIsStyleSettingsOpen] = useState(false);
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [isSpacingOpen, setIsSpacingOpen] = useState(false);
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
  const handleUpdate = (
    type: "margin" | "padding",
    updatedValues: BoxValues
  ) => {
    if (type === "margin") {
      setMargin(updatedValues);
      setUserInputData((prev: SlideBannerSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          marginTop: updatedValues.top.toString(),
          marginBottom: updatedValues.bottom.toString(),
        },
      }));
    } else {
      setPadding(updatedValues);
      setUserInputData((prev: SlideBannerSection) => ({
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
    const initialData = Compiler(layout, selectedComponent)[0];
    setUserInputData(initialData);
  });

  const handleSlideChange = (index: number, field: string, value: string) => {
    setUserInputData((prev: SlideBannerSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        slides: prev.blocks.slides.map((slide, i) =>
          i === index ? { ...slide, [field]: value } : slide
        ),
      },
    }));
  };

  const [isUpdating, setIsUpdating] = useState(false);

  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (isUpdating) return;
    setIsUpdating(true);

    const { name, value } = e.target;
    setUserInputData((prev: SlideBannerSection) => ({
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
      <h2 className="text-lg font-bold mb-4">تنظیمات اسلایدر</h2>
      <TabButtons onTabChange={handleTabChange} />
      {/* Content Section */}

      {isContentOpen && (
        <div className="p-4 border-t border-gray-100 animate-slideDown">
          {userInputData?.blocks?.slides?.map((slide, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">اسلاید {index + 1}</h4>
              <div className="space-y-2">
                <label
                  htmlFor="
                    "
                >
                  تصویر
                </label>
                <input
                  type="text"
                  placeholder="آدرس تصویر"
                  value={slide.imageSrc}
                  onChange={(e) =>
                    handleSlideChange(index, "imageSrc", e.target.value)
                  }
                  className="w-full mb-2 p-2 border rounded"
                />
                <label className="mt-2">متن جایگزین تصویر</label>
                <input
                  type="text"
                  placeholder="متن جایگزین تصویر"
                  value={slide.imageAlt}
                  onChange={(e) =>
                    handleSlideChange(index, "imageAlt", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Style Settings */}

      {isStyleSettingsOpen && (
        <div className="p-4 border-t border-gray-100 animate-slideDown">
          <div className="space-y-4">
            <div className=" rounded-lg">
              <label className="block mb-2">ارتفاع اسلایدر</label>
              <input
                type="range"
                name="height"
                min="150"
                max="1000"
                value={userInputData?.blocks?.setting?.height || "200"}
                onChange={handleSettingChange}
                className="w-full"
              />
              <span className="text-sm text-gray-500">
                {userInputData?.blocks?.setting?.height}px
              </span>
            </div>
            <div>
              <ColorInput
                label="رنگ فلش ها"
                name="bgArrow"
                value={
                  userInputData?.blocks?.setting?.bgArrow?.toString() ??
                  "#333333"
                }
                onChange={handleSettingChange}
              />
            </div>
            <div>
              <ColorInput
                label="رنگ نقطه‌های غیرفعال (در صورت نیاز)"
                name="inactiveDotColor"
                value={
                  userInputData?.blocks?.setting?.inactiveDotColor?.toString() ??
                  "#333333"
                }
                onChange={handleSettingChange}
              />
            </div>
            <div>
              <ColorInput
                label="رنگ نقطه‌ی فعال (در صورت نیاز)"
                name="activeDotColor"
                value={
                  userInputData?.blocks?.setting?.activeDotColor?.toString() ??
                  "#333333"
                }
                onChange={handleSettingChange}
              />
            </div>
          </div>
        </div>
      )}

      {/* Spacing Settings */}

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
  );
};
