import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, StorySection } from "@/lib/types";
import React from "react";
import MarginPaddingEditor from "../sections/editor";

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
  const [inputText, setInputText] = useState("");
  const [dropdownAnimation, setDropdownAnimation] = useState(false);
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

  const handleLiveInput = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    if (inputText.trim()) {
      const response = await fetch("/api/update-json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputText }),
      });

      const updatedJson = await response.json();

      setUserInputData((prevData) => ({
        ...prevData,
        blocks: updatedJson.children.sections[0].blocks,
        setting: updatedJson.children.sections[0].setting,
      }));
    }
  };

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

  return (
    <div
      className="p-3 max-w-4xl space-y-2 mx-4 bg-gray-100 rounded mt-4"
      dir="rtl"
    >
      <h2 className="text-xl font-bold my-4">تنظیمات استوری</h2>

      {/* Content Section */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <button
          onClick={() => setIsContentOpen(!isContentOpen)}
          className="w-full flex justify-between items-center p-4 hover:bg-gray-50 rounded-xl"
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <h3 className="font-semibold text-gray-700">محتوا</h3>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isContentOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isContentOpen && (
          <div className="p-4 border-t border-gray-100 space-y-4">
            {userInputData?.blocks.stories.map((story, index) => (
              <div
                key={story.id}
                className="p-3 bg-gray-50 rounded-lg space-y-3"
              >
                <h4 className="font-semibold">استوری {index + 1}</h4>
                <input
                  type="text"
                  placeholder="آدرس تصویر"
                  value={story.imageUrl}
                  onChange={(e) =>
                    handleStoryChange(index, "imageUrl", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="عنوان"
                  value={story.title}
                  onChange={(e) =>
                    handleStoryChange(index, "title", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
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
      </div>

      {/* Style Settings */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <button
          onClick={() => setIsStyleSettingsOpen(!isStyleSettingsOpen)}
          className="w-full flex justify-between items-center p-4 hover:bg-gray-50 rounded-xl"
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            <h3 className="font-semibold text-gray-700">تنظیمات ظاهری</h3>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isStyleSettingsOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isStyleSettingsOpen && (
          <div className="p-4 border-t border-gray-100">
            <div className="grid gap-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <ColorInput
                  label="رنگ حلقه استوری"
                  name="storyRingColor"
                  value={userInputData?.blocks.setting.storyRingColor}
                  onChange={handleSettingChange}
                />
              </div>

              <div className="p-3 bg-gray-100 rounded-lg">
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
      </div>
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <button
          onClick={() => setDropdownAnimation(!dropdownAnimation)}
          className="w-full flex justify-between items-center p-2 hover:bg-gray-50 rounded-xl"
        >
          <div className="flex items-center gap-2">
            <svg
              width="31px"
              height="40px"
              viewBox="-6.4 -6.4 76.80 76.80" /* ... keep svg content ... */
            />
            <h3 className="font-semibold text-gray-700">تنظیمات دستوری</h3>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              dropdownAnimation ? "rotate-180" : ""
            }`} /* ... */
          />
        </button>
        {dropdownAnimation && (
          <div className="flex flex-col gap-2 p-2 animate-slideDown">
            <h4 className="text-pink-500 font-semibold p-2 text-sm">
              هر تغییری که لازم دارید اعمال کنید بنویسید
            </h4>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="p-2 rounded-xl border-2 border-blue-300 focus:outline-none"
              rows={5}
              style={{ width: "100%" }}
              placeholder="یک جمله فارسی وارد کنید..."
            />
            <button
              onClick={handleLiveInput}
              className="mt-2 bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600"
            >
              تبدیل
            </button>
          </div>
        )}
      </div>

      {/* Spacing Settings */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <button
          onClick={() => setIsSpacingOpen(!isSpacingOpen)}
          className="w-full flex justify-between items-center p-4 hover:bg-gray-50 rounded-xl"
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            <h3 className="font-semibold text-gray-700">تنظیمات فاصله</h3>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isSpacingOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isSpacingOpen && (
          <div className="p-4 border-t border-gray-100">
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
    </div>
  );
};
