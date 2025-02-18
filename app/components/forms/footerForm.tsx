import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, FooterSection } from "@/lib/types";
import React from "react";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";

interface FooterFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<FooterSection>>;
  userInputData: FooterSection;
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

export const FooterForm: React.FC<FooterFormProps> = ({
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
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = (
    type: "margin" | "padding",
    updatedValues: BoxValues
  ) => {
    if (type === "margin") {
      setMargin(updatedValues);
      setUserInputData((prev: FooterSection) => ({
        ...prev,
        setting: {
          ...(prev.setting || {}), // Provide fallback empty object
          marginTop: updatedValues.top.toString(),
          marginBottom: updatedValues.bottom.toString(),
        },
      }));
    } else {
      setPadding(updatedValues);
      setUserInputData((prev: FooterSection) => ({
        ...prev,
        setting: {
          ...(prev.setting || {}), // Provide fallback empty object
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
    const initialData = Compiler(layout, selectedComponent);
    if (initialData) {
      // Ensure a default setting object exists
      setUserInputData({
        ...initialData,
        setting: initialData.setting || {
          marginTop: "0",
          marginBottom: "0",
          paddingTop: "0",
          paddingBottom: "0",
        },
        blocks: initialData.blocks || {},
      });
    }
  }, [selectedComponent]);

  const handleBlockChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev) => ({
      ...prev,
      blocks: {
        ...prev?.blocks,
        [name]: value,
      },
    }));
  };

  const handleBlockSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (isUpdating) return;
    setIsUpdating(true);
    const { name, value } = e.target;
    setUserInputData((prev: FooterSection) => ({
      ...prev,
      blocks: {
        ...(prev?.blocks || {}),
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
    setUserInputData((prev: FooterSection) => ({
      ...prev,
      setting: {
        ...prev?.setting,
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
      <h2 className="text-lg font-bold mb-4">تنظیمات فوتر</h2>

      {/* Tabs */}

      <TabButtons onTabChange={handleTabChange} />

      {/* Content Section */}

      {isContentOpen && (
        <>
          <div className="space-y-4 p-4 animate-slideDown">
            <div>
              <label className="block mb-1">متن سربرگ</label>
              <input
                type="text"
                name="text"
                value={userInputData?.blocks?.text || "متن سربلاک"}
                onChange={handleBlockChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1">توضیحات</label>
              <textarea
                name="description"
                value={
                  userInputData?.blocks?.description ||
                  "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد"
                }
                onChange={handleBlockChange}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>

            <div>
              <label className="block mb-1">لینک اینستاگرام</label>
              <input
                type="text"
                name="instagramLink"
                value={
                  userInputData?.blocks?.instagramLink ?? "لینک اینستاگرام"
                }
                onChange={handleBlockChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1">لینک تلگرام</label>
              <input
                type="text"
                name="telegramLink"
                value={userInputData?.blocks?.telegramLink ?? "لینک  تلگرام"}
                onChange={handleBlockChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1">لینک واتساپ</label>
              <input
                type="text"
                name="whatsappLink"
                value={userInputData?.blocks?.whatsappLink ?? "لینک واتساپ"}
                onChange={handleBlockChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </>
      )}

      {/* Style Settings */}

      {isStyleSettingsOpen && (
        <>
          <div className="grid md:grid-cols-1 gap-4  p-4 animate-slideDown">
            <h4 className="font-semibold mb-2">تنظیمات سربرگ</h4>
            <div className="rounded-lg flex items-center justify-between ">
              <ColorInput
                label="رنگ سربرگ"
                name="textColor"
                value={userInputData?.blocks?.setting?.textColor ?? "#ffffff"}
                onChange={handleBlockSettingChange}
              />
            </div>

            <label>سایز متن سربرگ</label>
            <div className="flex items-center justify-center gap-4 p-4 rounded-lg border border-gray-300 shadow-sm">
              <input
                type="range"
                min="0"
                max="100"
                name="textFontSize"
                value={userInputData?.blocks?.setting?.textFontSize || "250"}
                onChange={handleBlockSettingChange}
              />
              <p className="text-sm text-gray-600 text-nowrap">
                {userInputData?.blocks.setting.textFontSize}px
              </p>
            </div>
            <div>
              <label className="block mb-1">وزن متن سربرگ</label>
              <select
                name="textFontWeight"
                value={userInputData?.blocks?.setting?.textFontWeight ?? "400"}
                onChange={handleBlockSettingChange}
                className="w-full p-2 border rounded"
              >
                <option value="bold">ضخیم</option>
                <option value="normal">نرمال</option>
              </select>
            </div>
            <h4 className="font-semibold mb-2">تنظیمات متن</h4>
            <div className="rounded-lg flex items-center justify-between ">
              <ColorInput
                label="رنگ توضیحات"
                name="descriptionColor"
                value={
                  userInputData?.blocks?.setting?.descriptionColor ?? "#ffffff"
                }
                onChange={handleBlockSettingChange}
              />
            </div>
            <label>سایز توضیحات</label>
            <div className="flex items-center justify-center gap-4 p-4 rounded-lg border border-gray-300 shadow-sm">
              <input
                type="range"
                min="0"
                max="100"
                name="descriptionFontSize"
                value={
                  userInputData?.blocks?.setting?.descriptionFontSize || "250"
                }
                onChange={handleBlockSettingChange}
              />
              <p className="text-sm text-gray-600 text-nowrap">
                {userInputData?.blocks.setting.descriptionFontSize}px
              </p>
            </div>

            <div>
              <label className="block mb-1">وزن متن توضیحات</label>
              <select
                name="descriptionFontWeight"
                value={
                  userInputData?.blocks?.setting?.descriptionFontWeight ?? "400"
                }
                onChange={handleBlockSettingChange}
                className="w-full p-2 border rounded"
              >
                <option value="bold">ضخیم</option>
                <option value="normal">نرمال</option>
              </select>
            </div>

            <h4 className="font-semibold">تنظیمات لوگو</h4>
          </div>

          <div className="grid md:grid-cols-1 p-4 gap-4 ">
            <div>
              <label className="block mb-1">عرض لوگو</label>
              <input
                type="number"
                name="logoWidth"
                value={userInputData?.blocks?.setting?.logoWidth ?? "100"}
                onChange={handleBlockSettingChange}
                className="w-full p-2 border rounded"
              />
              <div className="text-gray-500 text-sm">
                {userInputData?.blocks?.setting?.logoWidth}px
              </div>
            </div>
            <div>
              <label className="block mb-1">ارتفاع لوگو</label>
              <input
                type="number"
                name="logoHeight"
                value={userInputData?.blocks?.setting?.logoHeight ?? "100"}
                onChange={handleBlockSettingChange}
                className="w-full p-2 border rounded"
              />
              <div className="text-gray-500 text-sm">
                {userInputData?.blocks?.setting?.logoHeight}px
              </div>
            </div>
            <h4 className="font-semibold mb-2">تنظیمات پس زمینه</h4>
            <div className="rounded-lg flex items-center justify-between ">
              <ColorInput
                label="رنگ پس زمینه"
                name="backgroundColor"
                value={userInputData?.setting?.backgroundColor ?? "#fffffff"}
                onChange={handleSettingChange}
              />
            </div>
          </div>

          {/* Spacing Settings */}

          {/* Footer Links Section */}
          <h3 className="font-semibold p-4">لینک‌های فوتر</h3>
          <div className="space-y-1 flex flex-col gap-2 p-4">
            <div className="rounded-lg flex items-center justify-between ">
              <ColorInput
                label="رنگ لینک‌ها"
                name="linkColor"
                value={userInputData?.blocks?.setting?.linkColor ?? "#ffffff"}
                onChange={handleBlockSettingChange}
              />
            </div>

            {userInputData?.blocks?.links?.map((link, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-1">
                  <label className="block mb-1">عنوان لینک {index + 1}</label>
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => {
                      setUserInputData((prev) => ({
                        ...prev,
                        blocks: {
                          ...prev.blocks,
                          links: prev.blocks.links?.map((l, i) =>
                            i === index ? { ...l, label: e.target.value } : l
                          ),
                        },
                      }));
                    }}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-1">آدرس لینک {index + 1}</label>
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => {
                      setUserInputData((prev) => ({
                        ...prev,
                        blocks: {
                          ...prev.blocks,
                          links: prev.blocks.links?.map((l, i) =>
                            i === index ? { ...l, url: e.target.value } : l
                          ),
                        },
                      }));
                    }}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <button
                  onClick={() => {
                    setUserInputData((prev) => ({
                      ...prev,
                      blocks: {
                        ...prev.blocks,
                        links: prev.blocks.links?.filter((_, i) => i !== index),
                      },
                    }));
                  }}
                  className="self-end p-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  حذف
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                setUserInputData((prev) => ({
                  ...prev,
                  blocks: {
                    ...prev.blocks,
                    links: [
                      ...(prev.blocks.links || []),
                      { label: "", url: "" },
                    ],
                  },
                }));
              }}
              className=" px-4 py-2 transition-all duration-300 ease-in-out mx-auto bg-blue-500 text-white rounded hover:bg-green-600"
            >
              افزودن لینک جدید
            </button>
          </div>
          {/* Trust Icons Settings */}
          <h4 className="font-semibold mb-2 ">تنظیمات آیکون‌های اعتماد</h4>
          <div className="grid md:grid-cols-1 gap-4 p-4">
            <div className="rounded-lg flex items-center justify-between ">
              <ColorInput
                label="رنگ پس زمینه آیکون"
                name="trustIconBackground"
                value={
                  userInputData?.blocks?.setting?.trustIconBackground ??
                  "#f8f9fa"
                }
                onChange={handleBlockSettingChange}
              />
            </div>
            <div className="rounded-lg flex items-center justify-between ">
              <ColorInput
                label="رنگ آیکون"
                name="trustIconColor"
                value={userInputData?.blocks?.setting?.trustIconColor ?? "red"}
                onChange={handleBlockSettingChange}
              />
            </div>
            <div className="flex items-center justify-center gap-4 p-4 rounded-lg border border-gray-300 shadow-sm">
              <input
                type="range"
                min="0"
                max="100"
                name="trustItemSize"
                value={userInputData?.blocks?.setting?.trustItemSize || "16"}
                onChange={handleBlockSettingChange}
              />
              <p className="text-sm text-gray-600 text-nowrap">
                {userInputData?.blocks.setting.trustItemSize}px
              </p>
            </div>
            <div className="rounded-lg flex items-center justify-between ">
              <ColorInput
                label="رنگ متن آیتم‌ها"
                name="trustItemColor"
                value={userInputData?.blocks?.setting?.trustItemColor ?? "#333"}
                onChange={handleBlockSettingChange}
              />
            </div>
            <div className="rounded-lg flex items-center justify-between ">
              <ColorInput
                label="رنگ دکمه اسکرول"
                name="scrollButtonColor"
                value={
                  userInputData?.blocks?.setting?.scrollButtonColor ?? "#000"
                }
                onChange={handleBlockSettingChange}
              />
            </div>
            <div className="rounded-lg flex items-center justify-between ">
              <ColorInput
                label="پس زمینه دکمه اسکرول"
                name="scrollButtonBg"
                value={
                  userInputData?.blocks?.setting?.scrollButtonBg ??
                  "transparent"
                }
                onChange={handleBlockSettingChange}
              />
            </div>
          </div>
          {/* End of Trust Icons Settings */}
          <h4 className="font-semibold mb-2 ">تنظیمات لینک دسته بندی</h4>
          <div className="rounded-lg flex px-4 items-center justify-between ">
            <ColorInput
              label="رنگ لینک  "
              name="categoryColor"
              value={userInputData?.blocks?.setting?.categoryColor ?? "#333"}
              onChange={handleBlockSettingChange}
            />
          </div>
          <div className="rounded-lg px-4 flex items-center justify-between ">
            <ColorInput
              label="رنگ پس زمینه   "
              name="categoryBg"
              value={userInputData?.blocks?.setting?.categoryBg ?? "#333"}
              onChange={handleBlockSettingChange}
            />
          </div>
        </>
      )}

      {/* Dropdown Header */}

      {/* Dropdown Content */}
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
