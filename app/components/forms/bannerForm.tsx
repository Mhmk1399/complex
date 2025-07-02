import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, BannerSection } from "@/lib/types";
import React from "react";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";
interface BannerFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<BannerSection>>;
  userInputData: BannerSection;
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

export const BannerForm: React.FC<BannerFormProps> = ({
  setUserInputData,
  userInputData,
  layout,
  selectedComponent,
}) => {
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

  const handleUpdate = (
    type: "margin" | "padding",
    updatedValues: BoxValues
  ) => {
    if (type === "margin") {
      setMargin(updatedValues);
      setUserInputData((prev: BannerSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          marginTop: updatedValues.top.toString(),
          marginBottom: updatedValues.bottom.toString(),
        },
      }));
    } else {
      setPadding(updatedValues);
      setUserInputData((prev: BannerSection) => ({
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

  const handleBlockChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev: BannerSection) => ({
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
    setUserInputData((prev: BannerSection) => ({
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
    const { name, value } = e.target;
    setUserInputData((prev: BannerSection) => ({
      ...prev,
      setting: {
        ...prev.setting,
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
    <div className="p-3 max-w-4xl space-y-2 rounded" dir="rtl">
      <h2 className="text-lg font-bold mb-4">تنظیمات بنر</h2>

      {/* Tabs */}
      <TabButtons onTabChange={handleTabChange} />

      {/* Content Section */}
      {isContentOpen && (
        <div className="p-4 space-y-4 animate-slideDown">
          {/* Image Input */}
          <div className="rounded-lg">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              آپلود عکس
            </label>
            <input
              type="text"
              name="imageSrc"
              value={userInputData?.blocks?.imageSrc ?? "vg"}
              onChange={handleBlockChange}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="rounded-lg">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              لینک عکس
            </label>
            <input
              type="text"
              name="imageLink"
              value={userInputData?.blocks?.imageLink ?? "vg"}
              onChange={handleBlockChange}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Header Input */}
          <div className="rounded-lg">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              متن سربرگ
            </label>
            <input
              type="text"
              name="text"
              value={userInputData?.blocks?.text ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Description Textarea */}
          <div className="rounded-lg">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              متن توضیحات
            </label>
            <textarea
              name="description"
              value={userInputData?.blocks?.description ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              rows={3}
            />
          </div>
        </div>
      )}

      {/* Style Settings */}

      {isStyleSettingsOpen && (
        <>
          <div className="transition-all animate-slideDown  duration-300">
            <div className="">
              <div className="grid md:grid-cols-1 gap-4">
                {/* Color inputs with updated styling */}
                <div className="rounded-lg flex flex-col gap-3">
                  <h4 className="font-semibold text-sky-700 my-4">
                    تنظیمات سربرگ
                  </h4>
                  <ColorInput
                    label="رنگ سربرگ"
                    name="textColor"
                    value={
                      userInputData?.blocks?.setting?.textColor?.toString() ??
                      "#333333"
                    }
                    onChange={handleBlockSettingChange}
                  />
                  <label>سایز سربرگ</label>
                  <input
                    type="range"
                    className="w-full"
                    name="textFontSize"
                    value={
                      userInputData?.blocks?.setting?.textFontSize?.toString() ??
                      "18"
                    }
                    onChange={handleBlockSettingChange}
                  />
                  <div className="text-gray-500 text-sm">
                    {userInputData?.blocks?.setting?.textFontSize}
                    px
                  </div>
                  <label className="block mb-1">وزن سربرگ</label>
                  <select
                    name="textFontWeight"
                    value={
                      userInputData?.blocks?.setting?.textFontWeight?.toString() ??
                      "0"
                    }
                    onChange={handleBlockSettingChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="bold">ضخیم</option>
                    <option value="normal">نرمال</option>
                  </select>
                </div>
                <div className="rounded-lg flex flex-col gap-3">
                  <h4 className="font-semibold text-sky-700 my-4">
                    تنظیمات توضیحات
                  </h4>
                  <ColorInput
                    label="رنگ توضیحات"
                    name="descriptionColor"
                    value={
                      userInputData?.blocks?.setting?.descriptionColor?.toString() ??
                      "#333333"
                    }
                    onChange={handleBlockSettingChange}
                  />
                  <label>سایز توضیحات</label>
                  <input
                    type="range"
                    className="w-full"
                    name="descriptionFontSize"
                    value={
                      userInputData?.blocks?.setting?.descriptionFontSize?.toString() ??
                      "18"
                    }
                    onChange={handleBlockSettingChange}
                  />
                  <div className="text-gray-500 text-sm">
                    {userInputData?.blocks?.setting?.descriptionFontSize}
                    px
                  </div>
                  <label className="block mb-1">وزن توضیحات</label>
                  <select
                    name="descriptionFontWeight"
                    value={
                      userInputData?.blocks?.setting?.descriptionFontWeight?.toString() ??
                      "0"
                    }
                    onChange={handleBlockSettingChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="bold">ضخیم</option>
                    <option value="normal">نرمال</option>
                  </select>
                </div>
                {/* Repeat for other color inputs */}

                {/* Opacity select with new styling */}
                <div className="rounded-lg flex flex-col gap-3">
                  <h4 className="font-semibold text-sky-700 my-4">
                    تنظیمات تصویر
                  </h4>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    شفافیت تصویر
                  </label>
                  <select
                    name="opacityImage"
                    value={
                      userInputData?.blocks?.setting?.opacityImage?.toLocaleString() ??
                      "1"
                    }
                    onChange={handleBlockSettingChange}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    {Array.from({ length: 11 }, (_, i) => i / 10).map(
                      (value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      )
                    )}
                  </select>
                  <div className="mt-4 rounded-lg">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      رفتار عکس
                    </label>
                    <select
                      name="imageBehavior"
                      value={
                        userInputData?.setting?.imageBehavior?.toLocaleString() ??
                        "cover"
                      }
                      onChange={handleSettingChange}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      <option value="cover">پوشش</option>
                      <option value="contain">شامل</option>
                      <option value="fill">کامل</option>
                    </select>
                  </div>
                </div>
                <div className="rounded-lg flex flex-col gap-3">
                  <h4 className="font-semibold text-sky-700 my-4">
                    تنظیمات کادر
                  </h4>
                  <label className="block mb-2 text-base font-medium text-gray-800">
                    شفافیت کادر
                  </label>
                  <select
                    name="opacityTextBox"
                    value={
                      userInputData?.blocks?.setting?.opacityTextBox?.toLocaleString() ??
                      "1"
                    }
                    onChange={handleBlockSettingChange}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    {Array.from({ length: 11 }, (_, i) => i / 10).map(
                      (value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      )
                    )}
                  </select>

                  <ColorInput
                    label="رنگ پس زمینه کادر"
                    name="backgroundColorBox"
                    value={
                      userInputData?.blocks?.setting?.backgroundColorBox?.toString() ??
                      "#333333"
                    }
                    onChange={handleBlockSettingChange}
                  />

                  <label> انحنای زاویه کادر</label>
                  <input
                    className="w-full"
                    type="range"
                    name="backgroundBoxRadious"
                    value={
                      userInputData?.blocks?.setting?.backgroundBoxRadious?.toString() ??
                      "18"
                    }
                    onChange={handleBlockSettingChange}
                  />
                  <div className="text-gray-500 text-sm">
                    {userInputData?.blocks?.setting?.backgroundBoxRadious?.toString() ??
                      "18"}
                    px
                  </div>
                </div>
              </div>

              {/* Image behavior select */}
            </div>
          </div>
        </>
      )}

      {/* Spacing Settings Dropdown */}

      {isSpacingOpen && (
        <div className="p-4  animate-slideDown">
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
