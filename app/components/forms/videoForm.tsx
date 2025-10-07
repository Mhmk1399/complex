import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { VideoFormProps, VideoSection } from "@/lib/types";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";
import {
  ColorInput,
  DynamicCheckboxInput,
  DynamicRangeInput,
  DynamicSelectInput,
} from "./DynamicInputs";

interface BoxValues {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export const VideoForm: React.FC<VideoFormProps> = ({
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
  const [isAnimationOpen, setIsAnimationOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = (
    type: "margin" | "padding",
    updatedValues: BoxValues
  ) => {
    if (type === "margin") {
      setMargin(updatedValues);
      setUserInputData((prev: VideoSection) => ({
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
      setUserInputData((prev: VideoSection) => ({
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
    setUserInputData(initialData);
  }, []);
  useEffect(() => {
    const initialData = Compiler(layout, selectedComponent)[0];
    setUserInputData(initialData);
  }, [selectedComponent]);

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
    if (isUpdating) return;
    setIsUpdating(true);
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
    setTimeout(() => setIsUpdating(false), 100);
  };

  const handleTabChange = (
    tab: "content" | "style" | "spacing" | "animation"
  ) => {
    setIsContentOpen(tab === "content");
    setIsStyleSettingsOpen(tab === "style");
    setIsSpacingOpen(tab === "spacing");
    setIsAnimationOpen(tab === "animation");
  };

  useEffect(() => {
    setIsContentOpen(true);
  }, []);

  return (
    <div className="p-2 max-w-4xl space-y-2 rounded" dir="rtl">
      <h2 className="text-lg font-bold mb-4">تنظیمات ویدیو</h2>

      {/* Tabs */}
      <TabButtons onTabChange={handleTabChange} />

      {/* Content Settings */}

      {isContentOpen && (
        <div className="p-2 space-y-4 animate-slideDown">
          <div className=" rounded-lg">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              سربرگ
            </label>
            <input
              type="text"
              name="heading"
              value={userInputData.blocks.heading ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div className=" rounded-lg">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              توضیحات
            </label>
            <input
              type="text"
              name="descrption"
              value={userInputData.blocks.descrption ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className=" rounded-lg">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              ویدیو
            </label>
            <input
              type="text"
              name="videoUrl"
              value={userInputData.blocks.videoUrl ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className=" rounded-lg">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              متن جایگزین ویدیو
            </label>
            <input
              type="text"
              placeholder="متن جایگزین ویدیو"
              name="videoAlt"
              value={userInputData.blocks.videoAlt ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      )}

      {/* Style Settings */}

      {isStyleSettingsOpen && (
        <div className="space-y-6 animate-slideDown">
          {/* Heading Settings */}
          <div className=" rounded-lg flex flex-col gap-3">
            <h4 className="text-base font-bold text-sky-700">تنظیمات سربرگ</h4>
            <ColorInput
              label="رنگ سربرگ"
              name="headingColor"
              value={userInputData.blocks.setting?.headingColor ?? "#000000"}
              onChange={handleBlockSettingChange}
            />

            <DynamicRangeInput
              label="سایز سربرگ"
              name="headingFontSize"
              min={10}
              max={100}
              step={1}
              value={userInputData.blocks.setting?.headingFontSize ?? 30}
              onChange={handleBlockSettingChange}
              displayUnit="px"
            />

            <DynamicSelectInput
              label="وزن سربرگ"
              name="headingFontWeight"
              value={userInputData.blocks.setting?.headingFontWeight ?? "bold"}
              options={[
                { value: "normal", label: "نرمال" },
                { value: "bold", label: "ضخیم" },
              ]}
              onChange={handleBlockSettingChange}
            />
          </div>
          {/* description Settings */}
          <div className=" rounded-lg flex flex-col gap-3">
            <h4 className="text-base font-bold text-sky-700">
              تنظیمات توضیحات
            </h4>
            <ColorInput
              label="رنگ توضیحات"
              name="descrptionColor"
              value={userInputData.blocks.setting?.descrptionColor ?? "#000000"}
              onChange={handleBlockSettingChange}
            />

            <DynamicRangeInput
              label="سایز توضیحات"
              name="descrptionFontSize"
              min={10}
              max={100}
              step={1}
              value={userInputData.blocks.setting?.descrptionFontSize ?? 30}
              onChange={handleBlockSettingChange}
              displayUnit="px"
            />

            <DynamicSelectInput
              label="وزن توضیحات"
              name="descrptionFontWeight"
              value={
                userInputData.blocks.setting?.descrptionFontWeight ?? "bold"
              }
              options={[
                { value: "normal", label: "نرمال" },
                { value: "bold", label: "ضخیم" },
              ]}
              onChange={handleBlockSettingChange}
            />
          </div>

          {/* Video Settings */}
          <div className="space-y-4">
            <div className=" rounded-lg flex flex-col gap-3">
              <h4 className="text-base font-bold text-sky-700 mb-4">
                تنظیمات ویدیو
              </h4>
              <DynamicRangeInput
                label="عرض ویدیو"
                name="videoWidth"
                min={100}
                max={2000}
                step={10}
                value={userInputData.blocks.setting?.videoWidth ?? 600}
                onChange={handleBlockSettingChange}
                displayUnit="px"
              />
              <DynamicRangeInput
                label="ارتفاع ویدیو"
                name="videoHeight"
                min={100}
                max={2000}
                step={10}
                value={userInputData.blocks.setting?.videoHeight ?? 600}
                onChange={handleBlockSettingChange}
                displayUnit="px"
              />

              <DynamicRangeInput
                label="انحنای زوایا"
                name="videoRadious"
                min={0}
                max={50}
                step={1}
                value={userInputData.blocks.setting?.videoRadious ?? 20}
                onChange={handleBlockSettingChange}
                displayUnit="px"
              />

              <label className="block mb-2 text-sm font-bold text-gray-700">
                پوستر ویدیو
              </label>
              <input
                type="text"
                name="videoPoster"
                value={
                  userInputData.blocks.setting?.videoPoster?.toString() ?? ""
                }
                onChange={handleBlockSettingChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />

              <h4 className="font-bold text-base text-sky-700 mb-3">
                تنظیمات کنترل ویدیو
              </h4>
              <div className="grid grid-cols-1 gap-1">
                <DynamicCheckboxInput
                  label="تکرار"
                  name="videoLoop"
                  checked={userInputData.blocks.setting?.videoLoop ?? true}
                  onChange={handleBlockSettingChange}
                />

                <DynamicCheckboxInput
                  label="بیصدا"
                  name="videoMute"
                  checked={userInputData.blocks.setting?.videoMute ?? false}
                  onChange={handleBlockSettingChange}
                />

                <DynamicCheckboxInput
                  label="پخش خودکار"
                  name="videoAutoplay"
                  checked={userInputData.blocks.setting?.videoAutoplay ?? true}
                  onChange={handleBlockSettingChange}
                />
              </div>
            </div>

            <div className="rounded-lg flex flex-col gap-3">
              <h4 className="font-bold text-sky-700 mb-3">تنظیمات پس زمینه</h4>
              <ColorInput
                label="رنگ پس‌زمینه ویدیو"
                name="backgroundVideoSection"
                value={
                  userInputData.blocks.setting?.backgroundVideoSection ??
                  "#e4e4e4"
                }
                onChange={handleBlockSettingChange}
              />
              <DynamicRangeInput
                label="انحنا"
                name="radius"
                min={0}
                max={200}
                step={10}
                value={userInputData.blocks.setting?.radius ?? 600}
                onChange={handleBlockSettingChange}
                displayUnit="px"
              />
            </div>
            {/* ✅ New Shadow Settings */}
            <div className="space-y-4 rounded-lg">
              <h4 className="font-bold text-sky-700 my-3">تنظیمات سایه</h4>
              <DynamicRangeInput
                label="افست افقی سایه"
                name="shadowOffsetX"
                min="-50"
                max="50"
                value={userInputData?.setting?.shadowOffsetX?.toString() ?? "0"}
                onChange={handleBlockSettingChange}
              />
              <DynamicRangeInput
                label="افست عمودی سایه"
                name="shadowOffsetY"
                min="-50"
                max="50"
                value={userInputData?.setting?.shadowOffsetY?.toString() ?? "0"}
                onChange={handleBlockSettingChange}
              />
              <DynamicRangeInput
                label="میزان بلور سایه"
                name="shadowBlur"
                min="0"
                max="100"
                value={userInputData?.setting?.shadowBlur?.toString() ?? "0"}
                onChange={handleBlockSettingChange}
              />
              <DynamicRangeInput
                label="میزان گسترش سایه"
                name="shadowSpread"
                min="-20"
                max="20"
                value={userInputData?.setting?.shadowSpread?.toString() ?? "0"}
                onChange={handleBlockSettingChange}
              />
              <ColorInput
                label="رنگ سایه"
                name="shadowColor"
                value={userInputData?.setting?.shadowColor?.toString() ?? "0"}
                onChange={handleBlockSettingChange}
              />
            </div>
          </div>
        </div>
      )}

      {/* animation settings */}

      {isAnimationOpen && (
        <div className="animate-slideDown">
          <h3 className="text-lg font-semibold text-sky-700">
            تنظیمات انیمیشن
          </h3>
          <p>تنظیماتی برای انیمیشن وجود ندارد.</p>
        </div>
      )}

      {/* Spacing Settings Dropdown */}

      {isSpacingOpen && (
        <div className="animate-slideDown">
          <div className="rounded-lg p-2 flex items-center justify-center">
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
