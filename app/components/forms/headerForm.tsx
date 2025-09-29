import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, Link, HeaderSection } from "@/lib/types";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";
import { ColorInput, DynamicRangeInput } from "./DynamicInputs";

interface HeaderFormProps {
  layout: Layout;
  setUserInputData: React.Dispatch<React.SetStateAction<HeaderSection>>;
  userInputData: HeaderSection;
  selectedComponent: string;
}
interface BoxValues {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export const HeaderForm: React.FC<HeaderFormProps> = ({
  setUserInputData,
  userInputData,
  layout,
  selectedComponent,
}) => {
  // Add default values to prevent undefined values
  const defaultValues = {
    blocks: {
      imageLogo: "",
      imageAlt: "",
      setting: {
        titleColor: "#000000",
        backgroundColorNavbar: "#ffffff",
        itemColor: "#000000",
        itemHoverColor: "#000000",
        itemFontSize: "16",
        imageWidth: "100",
        imageHeight: "100",
      },
      links: [],
    },
    setting: {
      paddingTop: "0",
      paddingBottom: "0",
      marginBottom: "0",
    },
  };

  // Modify the useEffect to include default values to

  const [isDataReady, setIsDataReady] = useState(false);
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

  useEffect(() => {
    setIsContentOpen(true);
  }, []);

  useEffect(() => {
    const initialData = {
      ...defaultValues,
      ...Compiler(layout, selectedComponent),
    };
    setUserInputData(initialData);
    setIsDataReady(true);
  }, [selectedComponent]);

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
    const initialData = {
      ...defaultValues,
      ...Compiler(layout, selectedComponent),
    };
    setUserInputData(initialData);
    setIsDataReady(true);
  }, [selectedComponent]);

  if (!isDataReady) {
    return (
      <div
        className="p-3 max-w-4xl mx-auto bg-gray-50 rounded-xl mt-4"
        dir="rtl"
      >
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  const handleUpdate = (
    type: "margin" | "padding",
    updatedValues: BoxValues
  ) => {
    if (type === "margin") {
      setMargin(updatedValues);
      setUserInputData((prev: HeaderSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          marginTop: updatedValues.top.toString(),
          marginBottom: updatedValues.bottom.toString(),
        },
      }));
    } else {
      setPadding(updatedValues);
      setUserInputData((prev: HeaderSection) => ({
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

  // First, add this helper function at the top with the other interfaces

  const urlToPersianNameMap: { [key: string]: string } = {
    "/": "خانه",
    "/about": "درباره ",
    "/contact": "ارتباط  ",
    "/blog": "بلاگ",
    "/shop": "فروشگاه",
    "/login": "ورود",

    // Add more mappings as needed
  };

  const handleLinkSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUrl = e.target.value;

    const newLink: Link = {
      name: urlToPersianNameMap[selectedUrl] || "نامشخص", // Default to "نامشخص" if no mapping is found
      url: selectedUrl,
      megaMenu: [], // or provide a default value for megaMenu
    };

    setUserInputData((prev: HeaderSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        links: [...prev.blocks.links, newLink],
      },
    }));
  };

  const linkOptions = [
    { name: " خانه ", url: "/" },
    { name: " درباره  ", url: "/about" },
    { name: " ارتباط    ", url: "/contact" },
    { name: " بلاگ ", url: "/blog" },
    { name: " فروشگاه  ", url: "/shop" },
    { name: " ورود/عضویت  ", url: "/login" },
  ];
  const removeLink = (urlToRemove: string) => {
    setUserInputData((prev: HeaderSection) => {
      const indexToRemove = prev.blocks.links.findIndex(
        (link: Link) => link.url === urlToRemove
      );

      if (indexToRemove !== -1) {
        const updatedLinks = [...prev.blocks.links];
        updatedLinks.splice(indexToRemove, 1);
        return {
          ...prev,
          blocks: {
            ...prev.blocks,
            links: updatedLinks,
          },
        };
      }

      return prev;
    });
  };
  const handleBlockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isUpdating) return;
    setIsUpdating(true);
    const { name, value } = e.target;
    setUserInputData((prev: HeaderSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [name]: value,
      },
    }));
    setTimeout(() => setIsUpdating(false), 100);
  };

  const handleBlockSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isUpdating) return;
    setIsUpdating(true);
    const { name, value } = e.target;
    setUserInputData((prev: HeaderSection) => ({
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
  const handleAnnouncementChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
  const handleTabChange = (
    tab: "content" | "style" | "spacing" | "animation"
  ) => {
    setIsContentOpen(tab === "content");
    setIsStyleSettingsOpen(tab === "style");
    setIsSpacingOpen(tab === "spacing");
    setIsAnimationOpen(tab === "animation");
  };

  return (
    <div className="p-3 max-w-4xl space-y-2 rounded" dir="rtl">
      <h2 className="text-lg font-bold mb-4">تنظیمات نو بار</h2>

      {/* Tabs */}
      <TabButtons onTabChange={handleTabChange} />

      {/* Content Tab */}
      {isContentOpen && (
        <div className="space-y-6 animate-slideDown">
          {/* Logo Section */}
          <div className=" rounded-xl p-4  transition-shadow duration-200">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-semibold text-gray-800">تنظیمات لوگو</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="imageLogo"
                >
                  آدرس لوگو
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="imageLogo"
                    name="imageLogo"
                    value={
                      userInputData?.blocks?.imageLogo ||
                      "/assets/images/logo.webp"
                    }
                    onChange={handleBlockChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="آدرس تصویر لوگو را وارد کنید"
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="imageAlt"
                >
                  متن جایگزین تصویر
                </label>
                <input
                  type="text"
                  id="imageAlt"
                  name="imageAlt"
                  value={userInputData?.blocks?.imageAlt || "logo"}
                  onChange={handleBlockChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="متن جایگزین برای لوگو"
                />
              </div>
            </div>
          </div>

          {/* Announcement Section */}
          <div className=" rounded-xl p-4  transition-shadow duration-200">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-semibold text-gray-800">متن اطلاع‌رسانی</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                پیام اطلاع‌رسانی
              </label>
              <textarea
                name="announcementText"
                value={userInputData.blocks.setting?.announcementText || ""}
                onChange={handleAnnouncementChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                rows={3}
                placeholder="پیام اطلاع‌رسانی خود را وارد کنید..."
              />
              <p className="text-xs text-blue-500 mt-1">
                این متن در بالای صفحه نمایش داده می‌شود
              </p>
            </div>
          </div>

          {/* Navigation Items Section */}
          <div className="   rounded-xl p-4   transition-shadow duration-200">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-semibold text-gray-800">آیتم‌های منو</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="linkSelect"
                >
                  افزودن آیتم جدید
                </label>
                <div className="relative">
                  <select
                    id="linkSelect"
                    onChange={handleLinkSelect}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 appearance-none bg-white"
                    defaultValue=""
                  >
                    <option value="">انتخاب کنید...</option>
                    {linkOptions.map((link, index) => (
                      <option key={`${link.url}-${index}`} value={link.url}>
                        {link.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
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
                  </div>
                </div>
              </div>

              {/* Menu Items List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">
                    آیتم‌های منو ({userInputData.blocks.links.length})
                  </label>
                  {userInputData.blocks.links.length > 0 && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      فعال
                    </span>
                  )}
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {userInputData.blocks.links.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <svg
                        className="w-12 h-12 mx-auto mb-2 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 10h16M4 14h16M4 18h16"
                        />
                      </svg>
                      <p className="text-sm">هیچ آیتمی اضافه نشده است</p>
                      <p className="text-xs text-gray-400 mt-1">
                        از منوی بالا آیتم جدید اضافه کنید
                      </p>
                    </div>
                  ) : (
                    userInputData.blocks.links.map((link, index) => (
                      <div
                        key={`${link.url}-${index}`}
                        className="group flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-3 rounded-lg border border-gray-200 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {link.name}
                            </p>
                            <p className="text-xs text-gray-500">{link.url}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeLink(link.url)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                          title="حذف آیتم"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Style Tab */}
      {isStyleSettingsOpen && (
        <div className="rounded-lg p-2 animate-slideDown">
          <div className="grid md:grid-cols-1 grid-cols-1 gap-2">
            <h4 className="font-bold text-sky-700 mb-3">تنظیمات پس زمینه</h4>
            <DynamicRangeInput
              label="انحنا"
              name="bgRadius"
              min="0"
              max="30"
              value={userInputData?.blocks?.setting?.bgRadius || "25"}
              onChange={handleBlockSettingChange}
            />
            <ColorInput
              label="رنگ پس زمینه"
              name="bgColor"
              value={userInputData?.blocks?.setting?.bgColor?.toLocaleString()}
              onChange={handleBlockSettingChange}
            />
            <h4 className="font-bold text-sky-700 my-3">تنظیمات مگامنو</h4>
            <DynamicRangeInput
              label="انحنا"
              name="megaMenuRadius"
              min="0"
              max="70"
              value={userInputData?.blocks?.setting?.megaMenuRadius || "25"}
              onChange={handleBlockSettingChange}
            />
            <ColorInput
              label="رنگ پس زمینه دسته بندی"
              name="megaMenuBg"
              value={userInputData?.blocks?.setting?.megaMenuBg?.toLocaleString()}
              onChange={handleBlockSettingChange}
            />
            <ColorInput
              label="رنگ آیتم های دسته بندی"
              name="categoryItemColor"
              value={
                userInputData?.blocks?.setting?.categoryItemColor || "#374151"
              }
              onChange={handleBlockSettingChange}
            />

            <ColorInput
              label="رنگ هاور آیتم های دسته بندی"
              name="categoryItemHoverColor"
              value={
                userInputData?.blocks?.setting?.categoryItemHoverColor ||
                "#2563eb"
              }
              onChange={handleBlockSettingChange}
            />
            <h4 className="font-bold text-sky-700 my-3">تنظیمات منو اصلی</h4>
            <DynamicRangeInput
              label="فاصله بین آیتم ها"
              name="gap"
              min="0"
              max="40"
              value={userInputData?.blocks?.setting?.gap || "250"}
              onChange={handleBlockSettingChange}
            />
            <ColorInput
              label="رنگ آیتم ها"
              name="itemColor"
              value={userInputData?.blocks?.setting.itemColor?.toLocaleString()}
              onChange={handleBlockSettingChange}
            />
            <ColorInput
              label="رنگ آیتم های فعال"
              name="itemHoverColor"
              value={userInputData?.blocks?.setting.itemHoverColor?.toLocaleString()}
              onChange={handleBlockSettingChange}
            />
            <ColorInput
              label="پس زمینه موبایل"
              name="mobileBackground"
              value={userInputData?.blocks?.setting.mobileBackground?.toLocaleString()}
              onChange={handleBlockSettingChange}
            />
            <h4 className="font-bold text-sky-700 my-3">تنظیمات اطلاع رسانی</h4>
            <DynamicRangeInput
              label="سایز متن"
              name="announcementFontSize"
              min="0"
              max="40"
              value={
                userInputData?.blocks?.setting?.announcementFontSize || "250"
              }
              onChange={handleBlockSettingChange}
            />
            <div className="flex flex-col  gap-2">
              <ColorInput
                label="رنگ پس زمینه اطلاع رسانی"
                name="announcementBgColor"
                value={userInputData?.blocks?.setting.announcementBgColor?.toLocaleString()}
                onChange={handleBlockSettingChange}
              />

              <ColorInput
                label="رنگ متن اطلاع رسانی"
                name="announcementTextColor"
                value={userInputData?.blocks?.setting.announcementTextColor?.toLocaleString()}
                onChange={handleBlockSettingChange}
              />
            </div>
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
        </div>
      )}

      {isAnimationOpen && (
        <div className="animate-slideDown">
          <h3 className="text-lg font-semibold text-sky-700">
            تنظیمات انیمیشن
          </h3>
          <p>تنظیماتی برای انیمیشن وجود ندارد.</p>
        </div>
      )}

      {/* Space Tab */}
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
