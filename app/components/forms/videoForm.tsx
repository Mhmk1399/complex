import { useEffect } from "react";
import { Compiler } from "../compiler";
import { VideoFormProps, VideoSection } from "@/lib/types";

const spacingLable = [
  {
    label: "قاصله درونی از بالا",
  },
  {
    label: "فاصله درونی از پایین",
  },
  {
    label: "فاصله بیرونی از بالا",
  },
  {
    label: "فاصله بیرونی از پایین",
  },
];

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
    <div className="flex flex-row gap-6 items-center">
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
  </>
);

export const VideoForm: React.FC<VideoFormProps> = ({
  setUserInputData,
  userInputData,
  layout,
}) => {
  useEffect(() => {
    const initialData = Compiler(layout, "video")[0];
    setUserInputData(initialData);
  }, []);

  const handleBlockChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev: VideoSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [name]: value,
      },
    }));
  };

  const handleBlockSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const inputValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setUserInputData((prev: VideoSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        setting: {
          ...prev.blocks.setting,
          [name]: inputValue,
        },
      },
    }));
  };

  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInputData((prev: VideoSection) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value,
      },
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto" dir="rtl">
      <h2 className="text-xl font-bold mb-4">تنظیمات ویدیو</h2>

      {/* Content Section */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">محتوا</h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">سربرگ</label>
            <input
              type="text"
              name="heading"
              value={userInputData.blocks.heading ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">وبدیو</label>
            <input
              type="text"
              name="videoUrl"
              value={userInputData.blocks.videoUrl ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">متن جایگزین ویدیو</label>
            <input
              type="text"
              name="videoAlt"
              value={userInputData.blocks.videoAlt ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Style Settings */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">تنظیمات استایل</h3>
        <div className=" space-y-4">
          <ColorInput
            label="رنگ سربرگ"
            name="headingColor"
            value={
              userInputData.blocks.setting?.headingColor?.toString() ??
              "#000000"
            }
            onChange={handleBlockSettingChange}
          />
          <ColorInput
            label="رنگ پس زمینه"
            name="backgroundVideoSection"
            value={
              userInputData.blocks.setting?.backgroundVideoSection?.toString() ??
              "#e4e4e4"
            }
            onChange={handleBlockSettingChange}
          />

          <div>
            <label className="block mb-1">سایز سربرگ</label>
            <input
              type="range"
              name="headingFontSize"
              value={
                userInputData.blocks.setting?.headingFontSize?.toString() ??
                "30px"
              }
              onChange={handleBlockSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">وزن سربرک</label>
            <select
              name="headingFontWeight"
              value={
                userInputData.blocks.setting?.headingFontWeight?.toString() ??
                "bold"
              }
              onChange={handleBlockSettingChange}
              className="w-full p-2 border rounded"
            >
              <option value="normal">نرمال</option>
              <option value="bold">ضخیم</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">عرض ویدیو</label>
            <input
              type="range"
              name="videoWidth"
              value={
                userInputData.blocks.setting?.videoWidth?.toString() ?? "1000px"
              }
              onChange={handleBlockSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">انحنای زوایا</label>
            <input
              type="range"
              name="videoRadious"
              value={
                userInputData.blocks.setting?.videoRadious?.toString() ?? "20px"
              }
              onChange={handleBlockSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">پوستر ویدیو</label>
            <input
              type="text"
              name="videoPoster"
              value={
                userInputData.blocks.setting?.videoPoster?.toString() ?? ""
              }
              onChange={handleBlockSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Video Controls */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="videoLoop"
              checked={userInputData.blocks.setting?.videoLoop ?? true}
              onChange={handleBlockSettingChange}
              className="mr-2"
            />
            <label> تکرار </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="videoMute"
              checked={userInputData.blocks.setting?.videoMute ?? false}
              onChange={handleBlockSettingChange}
              className="mr-2"
            />
            <label>بیصدا</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="videoAutoplay"
              checked={userInputData.blocks.setting?.videoAutoplay ?? true}
              onChange={handleBlockSettingChange}
              className="mr-2"
            />
            <label>پخش خودکار</label>
          </div>
        </div>
      </div>

      {/* Spacing Settings */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">تنظیمات فاصله</h3>
        <div className="grid grid-cols-1 gap-4">
          {["paddingTop", "paddingBottom", "marginTop", "marginBottom"].map(
            (spacing, index) => (
              <div key={index}>
                <label className="block mb-1">
                  {spacingLable[index].label}
                </label>
                <input
                  type="range"
                  name={spacing}
                  min="0"
                  max="100"
                  value={
                    userInputData.setting?.[
                      spacing as keyof typeof userInputData.setting
                    ]?.toString() ?? "0"
                  }
                  onChange={handleSettingChange}
                  className="w-full"
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
