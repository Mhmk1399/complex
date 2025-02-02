import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, NewsLetterSection } from "@/lib/types";
import React from "react";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";
interface NewsLetterFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<NewsLetterSection>>;
  userInputData: NewsLetterSection;
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

export const NewsLetterForm: React.FC<NewsLetterFormProps> = ({
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
      setUserInputData((prev: NewsLetterSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          marginTop: updatedValues.top.toString(),
          marginBottom: updatedValues.bottom.toString(),
        },
      }));
    } else {
      setPadding(updatedValues);
      setUserInputData((prev: NewsLetterSection) => ({
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
    setUserInputData((prev: NewsLetterSection) => ({
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
    setUserInputData((prev: NewsLetterSection) => ({
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
      <h2 className="text-lg font-bold mb-4">تنظیمات خبرنامه</h2>

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
              value={userInputData?.blocks?.heading ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="rounded-lg">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              توضیحات
            </label>
            <textarea
              name="description"
              value={userInputData?.blocks?.description ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              rows={3}
            />
          </div>

          <div className="rounded-lg">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              متن دکمه
            </label>
            <input
              type="text"
              name="btnText"
              value={userInputData?.blocks?.btnText ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      )}

      {/* Style Settings */}

      {isStyleSettingsOpen && (
        <div className="p-4 border-t border-gray-100 space-y-6 animate-slideDown">
          {/* Heading Settings */}
          <div className="space-y-4">
            <div className="rounded-lg flex flex-col gap-3">
              <h4 className="font-semibold text-sky-700">تنظیمات سربرگ</h4>
              <div>
                <ColorInput
                  label="رنگ سربرگ"
                  name="headingColor"
                  value={
                    userInputData?.blocks?.setting?.headingColor?.toLocaleString() ??
                    "#ffffff"
                  }
                  onChange={handleBlockSettingChange}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  سایز سربرگ
                </label>
                <input
                  type="range"
                  name="headingFontSize"
                  value={
                    userInputData?.blocks?.setting?.headingFontSize?.toLocaleString() ??
                    "27px"
                  }
                  onChange={handleBlockSettingChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600 mt-1 block">
                  {userInputData?.blocks?.setting?.headingFontSize}px
                </span>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  وزن سربرگ
                </label>
                <select
                  name="headingFontWeight"
                  value={
                    userInputData?.blocks?.setting?.headingFontWeight?.toString() ??
                    "bold"
                  }
                  onChange={handleBlockSettingChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="normal">نرمال</option>
                  <option value="bold">ضخیم</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description Settings */}
          <div className="space-y-4">
            <div className="rounded-lg flex flex-col gap-3">
              <h4 className="font-semibold text-sky-700">تنظیمات توضیحات</h4>
              <div>
                <ColorInput
                  label="رنگ توضیحات"
                  name="descriptionColor"
                  value={
                    userInputData?.blocks?.setting?.descriptionColor?.toLocaleString() ??
                    "#e4e4e4"
                  }
                  onChange={handleBlockSettingChange}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  سایز توضیحات
                </label>
                <input
                  type="range"
                  name="descriptionFontSize"
                  value={
                    userInputData?.blocks?.setting?.descriptionFontSize?.toLocaleString() ??
                    "18px"
                  }
                  onChange={handleBlockSettingChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600 mt-1 block">
                  {userInputData?.blocks?.setting?.descriptionFontSize}px
                </span>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  وزن توضیحات
                </label>
                <select
                  name="descriptionFontWeight"
                  value={
                    userInputData?.blocks?.setting?.descriptionFontWeight?.toLocaleString() ??
                    "normal"
                  }
                  onChange={handleBlockSettingChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="normal">نرمال</option>
                  <option value="bold">ضخیم</option>
                </select>
              </div>
            </div>
          </div>

          {/* Button Settings */}
          <div className="space-y-4">
            <div className=" rounded-lg flex flex-col gap-3">
              <h4 className="font-semibold text-sky-700">تنظیمات دکمه</h4>
              <div>
                <ColorInput
                  label="رنگ پس زمینه دکمه"
                  name="btnBackgroundColor"
                  value={
                    userInputData?.blocks?.setting?.btnBackgroundColor?.toLocaleString() ??
                    "#ea7777"
                  }
                  onChange={handleBlockSettingChange}
                />
              </div>

              <div>
                <ColorInput
                  label="رنگ متن دکمه"
                  name="btnTextColor"
                  value={
                    userInputData?.blocks?.setting?.btnTextColor?.toLocaleString() ??
                    "#ffffff"
                  }
                  onChange={handleBlockSettingChange}
                />
              </div>
            </div>
          </div>

          {/* Background Settings */}
          <div className="space-y-4">
            <div className="rounded-lg flex flex-col gap-3">
              <h4 className="font-semibold text-sky-700">
                تنظیمات رنگ پس زمینه
              </h4>
              <ColorInput
                label="رنگ پس زمینه"
                name="formBackground"
                value={
                  userInputData?.blocks?.setting?.formBackground?.toLocaleString() ??
                  "#005002"
                }
                onChange={handleBlockSettingChange}
              />
            </div>
          </div>
        </div>
      )}

      {/* Spacing Settings Dropdown */}

      {isSpacingOpen && (
        <div className="p-4 border-t border-gray-100 animate-slideDown">
          <div className="rounded-lg flex items-center justify-center">
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
