import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, StorySection } from "@/lib/types";
import React from "react";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";

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
          {userInputData?.blocks.stories.map((story, index) => (
            <div
              key={story.id}
              className=" rounded-lg p-2  bg-gray-50 space-y-3"
            >
              <h4 className="font-semibold">استوری {index + 1}</h4>
              <label htmlFor="" className="block mb-1">
                آدرس تصویر:
              </label>
              <input
                type="text"
                placeholder="آدرس تصویر"
                value={story.imageUrl}
                onChange={(e) =>
                  handleStoryChange(index, "imageUrl", e.target.value)
                }
                className="w-full p-2 border rounded"
              />
              <label htmlFor="" className="block mb-1">
                عنوان:
              </label>
              <input
                type="text"
                placeholder="عنوان"
                value={story.title}
                onChange={(e) =>
                  handleStoryChange(index, "title", e.target.value)
                }
                className="w-full p-2 border rounded"
              />
              <label htmlFor="" className="block mb-1">
                لینک:
              </label>
              <input
                type="text"
                placeholder="لینک"
                value={story.link}
                onChange={(e) =>
                  handleStoryChange(index, "link", e.target.value)
                }
                className="w-full p-2 border rounded"
              />
            </div>
          ))}
        </div>
      )}
      {/* Style Tab */}
      {isStyleSettingsOpen && (
        <div className=" rounded-lg p-4 animate-slideDown">
          <div className="flex flex-col gap-4">
            <div className="  rounded-lg">
              <ColorInput
                label="رنگ حلقه استوری"
                name="storyRingColor"
                value={userInputData?.blocks.setting.storyRingColor}
                onChange={handleSettingChange}
              />
            </div>
            <div className="  rounded-lg">
              <ColorInput
                label="رنگ عنوان"
                name="titleColor"
                value={userInputData?.blocks.setting.titleColor}
                onChange={handleSettingChange}
              />
              <label className="block mt-3">سایز عنوان</label>
              <input
                type="range"
                name="titleFontSize"
                value={userInputData?.blocks.setting.titleFontSize}
                onChange={handleSettingChange}
                className="w-full"
                min="12"
                max="24"
              />
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
        </div>
      )}

      {/* Spacing Settings */}
      <div className="mb-6  rounded-xl shadow-sm border border-gray-100">
        {isSpacingOpen && (
          <div className="p-4 border-t border-gray-100">
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
    </div>
  );
};
