import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, StorySection } from "@/lib/types";
import React from "react";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";
import Link from "next/link";

interface StoryFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<StorySection>>;
  userInputData: StorySection;
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
        className=" p-0.5 border rounded-md border-gray-200 w-8 h-8 bg-transparent "
      />
    </div>
  </>
);

export const StoryForm: React.FC<StoryFormProps> = ({
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
  const [isUpdating, setIsUpdating] = useState(false);
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
    setUserInputData(initialData);
  }, []);

  const handleStoryChange = (index: number, field: string, value: string) => {
    if (isUpdating) return;
    setIsUpdating(true);
    setUserInputData((prev) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        stories: prev.blocks.stories.map((story, i) =>
          i === index ? { ...story, [field]: value } : story
        ),
      },
    }));
    setTimeout(() => setIsUpdating(false), 100);
  };
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
        },
      }));
    }
  };

  const handleSettingChange = (
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
      <h2 className="text-lg font-bold mb-4">تنظیمات استوری</h2>

      {/* Tabs */}
      <TabButtons onTabChange={handleTabChange} />

      {/* Style Settings */}
      {isContentOpen && (
        <div className=" rounded-lg p-4 animate-slideDown gap-2 flex flex-col">
          <p className="text-sm text-gray-500">
            محتوای این بخش از طریق پنل مدیریت سایت تعریف میشود.
          </p>
          <button className="bg-blue-500 mt-4 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl">
            <Link target="_blank" href="https://complex-dashboard.vercel.app/">
              ورود به پنل مدیریت
            </Link>
          </button>
        </div>
      )}
      {/* Style Tab */}
      {isStyleSettingsOpen && (
        <div className=" rounded-lg p-4 animate-slideDown">
          <div className="flex flex-col gap-4">
            <div className="rounded-lg inline-flex items-center justify-between gap-2">
              <ColorInput
                label="رنگ حلقه استوری"
                name="storyRingColor"
                value={userInputData?.blocks.setting.storyRingColor}
                onChange={handleSettingChange}
              />
            </div>
            <div className="rounded-lg inline-flex items-center justify-between gap-2">
              <ColorInput
                label="رنگ عنوان"
                name="titleColor"
                value={userInputData?.blocks.setting.titleColor}
                onChange={handleSettingChange}
              />
            </div>

            <label className="block mt-3">سایز عنوان</label>
            <div className="flex items-center justify-center gap-4 p-4 rounded-lg border border-gray-300 shadow-sm">
              <input
                type="range"
                min="0"
                max="100"
                name="titleFontSize"
                value={userInputData?.blocks.setting.titleFontSize}
                onChange={handleSettingChange}
              />
              <p className="text-sm text-gray-600 text-nowrap">
                {userInputData?.blocks.setting.titleFontSize}px
              </p>
            </div>
            <label htmlFor="" className="block mt-3">
              وزن فونت عنوان
            </label>
            <select
              name="titleFontWeight"
              value={userInputData?.blocks.setting.titleFontWeight}
              onChange={handleSettingChange}
              className="w-full p-2 border rounded mt-2"
            >
              <option value="normal">معمولی</option>
              <option value="bold">ضخیم</option>
            </select>
          </div>
        </div>
      )}

      {/* Spacing Settings */}
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
