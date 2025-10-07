import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, FooterSection } from "@/lib/types";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";
import {
  ColorInput,
  DynamicRangeInput,
  DynamicSelectInput,
} from "./DynamicInputs";

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

export const FooterForm: React.FC<FooterFormProps> = ({
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
      <h2 className="text-lg font-bold mb-4">تنظیمات فوتر</h2>

      {/* Tabs */}

      <TabButtons onTabChange={handleTabChange} />

      {/* Content Section */}
      {isContentOpen && (
        <div className="space-y-4 p-2 animate-slideDown">
          {/* Header Text Section */}
          <div className="bg-white rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <h4 className="font-medium text-gray-800 text-sm">محتوای متنی</h4>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  متن سربرگ
                </label>
                <input
                  type="text"
                  name="text"
                  value={userInputData?.blocks?.text || "متن سربلاک"}
                  onChange={handleBlockChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="عنوان اصلی سایت"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  توضیحات
                </label>
                <textarea
                  name="description"
                  value={
                    userInputData?.blocks?.description ||
                    "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است"
                  }
                  onChange={handleBlockChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                  rows={3}
                  placeholder="توضیحات کوتاه درباره سایت"
                />
              </div>
              {/* Links Management */}
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-800 text-sm">
                      لینک‌های پایین صفحه
                    </h4>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {userInputData?.blocks?.links?.length || 0} آیتم
                  </span>
                </div>

                <div className="space-y-3">
                  {userInputData?.blocks?.links?.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      <svg
                        className="w-8 h-8 mx-auto mb-2 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                      <p className="text-sm">هیچ لینکی اضافه نشده است</p>
                      <p className="text-xs text-gray-400 mt-1">
                        لینک جدید اضافه کنید
                      </p>
                    </div>
                  ) : (
                    userInputData?.blocks?.links?.map((link, index) => (
                      <div
                        key={index}
                        className="group bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-white border border-gray-300 rounded-md flex items-center justify-center mt-1">
                            <span className="text-xs font-medium text-gray-600">
                              {index + 1}
                            </span>
                          </div>

                          <div className="flex-1 space-y-2">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                عنوان لینک
                              </label>
                              <input
                                type="text"
                                value={link.label}
                                onChange={(e) => {
                                  setUserInputData((prev) => ({
                                    ...prev,
                                    blocks: {
                                      ...prev.blocks,
                                      links: prev.blocks.links?.map((l, i) =>
                                        i === index
                                          ? { ...l, label: e.target.value }
                                          : l
                                      ),
                                    },
                                  }));
                                }}
                                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                placeholder="مثل: درباره ما"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                آدرس لینک
                              </label>
                              <input
                                type="text"
                                value={link.url}
                                onChange={(e) => {
                                  setUserInputData((prev) => ({
                                    ...prev,
                                    blocks: {
                                      ...prev.blocks,
                                      links: prev.blocks.links?.map((l, i) =>
                                        i === index
                                          ? { ...l, url: e.target.value }
                                          : l
                                      ),
                                    },
                                  }));
                                }}
                                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                placeholder="https://example.com/about"
                              />
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setUserInputData((prev) => ({
                                ...prev,
                                blocks: {
                                  ...prev.blocks,
                                  links: prev.blocks.links?.filter(
                                    (_, i) => i !== index
                                  ),
                                },
                              }));
                            }}
                            className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md mt-1"
                            title="حذف لینک"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add New Link Button */}
                <div className="mt-3 pt-3 border-t border-gray-200">
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
                    className="w-full p-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    افزودن لینک جدید
                  </button>
                </div>

                {/* Quick Actions */}
                {(userInputData?.blocks?.links?.length ?? 0) > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setUserInputData((prev) => ({
                          ...prev,
                          blocks: {
                            ...prev.blocks,
                            links: [],
                          },
                        }));
                      }}
                      className="text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors duration-200"
                    >
                      پاک کردن همه لینک‌ها
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Social Links Section */}
          <div className="bg-white  rounded-lg p-3">
            <div className="flex items-center gap-2 mb-3">
              <h4 className="font-medium text-gray-800 text-sm">
                شبکه‌های اجتماعی
              </h4>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-sm"></div>
                    اینستاگرام
                  </span>
                </label>
                <input
                  type="text"
                  name="instagramLink"
                  value={userInputData?.blocks?.instagramLink ?? ""}
                  onChange={handleBlockChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="https://instagram.com/username"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                    تلگرام
                  </span>
                </label>
                <input
                  type="text"
                  name="telegramLink"
                  value={userInputData?.blocks?.telegramLink ?? ""}
                  onChange={handleBlockChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="https://t.me/username"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                    واتساپ
                  </span>
                </label>
                <input
                  type="text"
                  name="whatsappLink"
                  value={userInputData?.blocks?.whatsappLink ?? ""}
                  onChange={handleBlockChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="https://wa.me/phonenumber"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Style Settings */}
      {isStyleSettingsOpen && (
        <>
          <div className="grid md:grid-cols-1 gap-4 py-2 animate-slideDown">
            <h4 className="font-bold text-sky-700 mb-3">تنظیمات سربرگ</h4>
            <ColorInput
              label="رنگ سربرگ"
              name="textColor"
              value={userInputData?.blocks?.setting?.textColor ?? "#ffffff"}
              onChange={handleBlockSettingChange}
            />

            <DynamicRangeInput
              label="سایز متن"
              name="textFontSize"
              min="0"
              max="100"
              value={userInputData?.blocks?.setting?.textFontSize || "250"}
              onChange={handleBlockSettingChange}
            />
            <DynamicSelectInput
              label="وزن  "
              name="textFontWeight"
              value={userInputData?.blocks?.setting?.textFontWeight ?? "400"}
              options={[
                { value: "normal", label: "نرمال" },
                { value: "bold", label: "ضخیم" },
              ]}
              onChange={handleBlockSettingChange}
            />

            <h4 className="font-bold text-sky-700 mb-3">تنظیمات توضیحات</h4>
            <DynamicRangeInput
              label="سایز متن"
              name="descriptionFontSize"
              min="0"
              max="100"
              value={
                userInputData?.blocks?.setting?.descriptionFontSize || "250"
              }
              onChange={handleBlockSettingChange}
            />
            <DynamicSelectInput
              label="وزن  "
              name="descriptionFontWeight"
              value={
                userInputData?.blocks?.setting?.descriptionFontWeight ?? "400"
              }
              options={[
                { value: "normal", label: "نرمال" },
                { value: "bold", label: "ضخیم" },
              ]}
              onChange={handleBlockSettingChange}
            />
            <ColorInput
              label="رنگ "
              name="descriptionColor"
              value={
                userInputData?.blocks?.setting?.descriptionColor ?? "#ffffff"
              }
              onChange={handleBlockSettingChange}
            />
          </div>

          <h4 className="font-bold text-sky-700 mb-3">تنظیمات پس زمینه</h4>
          <DynamicRangeInput
            label="انحنا"
            name="bgRadius"
            min="0"
            max="50"
            value={userInputData?.blocks?.setting?.bgRadius || "250"}
            onChange={handleBlockSettingChange}
          />
          <ColorInput
            label="رنگ پس زمینه"
            name="backgroundColor"
            value={userInputData?.setting?.backgroundColor ?? "#fffffff"}
            onChange={handleSettingChange}
          />

          {/* Footer Links Section */}
          <h3 className="font-bold text-sky-700 mb-3">لینک‌های فوتر</h3>
          <div className="space-y-1 flex flex-col gap-2 p-4">
            <div className="rounded-lg flex items-center justify-between ">
              <ColorInput
                label="رنگ لینک‌ها"
                name="linkColor"
                value={userInputData?.blocks?.setting?.linkColor ?? "#ffffff"}
                onChange={handleBlockSettingChange}
              />
            </div>
          </div>
          {/* Trust Icons Settings */}
          <h4 className="font-bold text-sky-700 mb-3">تنظیمات دکمه اسکرول</h4>
          <div className="grid md:grid-cols-1 gap-4 p-4">
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
          <h4 className="font-bold text-sky-700 mb-3">
            تنظیمات لینک دسته بندی
          </h4>
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

          {/* ✅ New Shadow Settings */}
          <div className="  rounded-lg">
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
        </>
      )}

      {/* animation */}
      {isAnimationOpen && (
        <div className="animate-slideDown text-sm">
          <h3 className="font-semibold text-sky-700">
            تنظیمات انیمیشن
          </h3>
          <p>تنظیماتی برای انیمیشن وجود ندارد.</p>
        </div>
      )}

      {/* spacing */}
      {isSpacingOpen && (
        <div className="animate-slideDown">
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
