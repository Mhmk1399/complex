import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, Link, HeaderSection } from "@/lib/types";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";
import { ColorInput, DynamicRangeInput } from "./DynamicInputs";
import { useSharedContext } from "@/app/contexts/SharedContext";
import { FaEdit, FaTrash } from "react-icons/fa";

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
  const { activeRoutes, setActiveRoutes } = useSharedContext();
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
  const [customLinkName, setCustomLinkName] = useState("");
  const [customLinkUrl, setCustomLinkUrl] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(null);
  const [editingLinkName, setEditingLinkName] = useState("");

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

  const staticRoutes = [
    { name: "درباره ما", url: "/about" },
    { name: "ارتباط با ما", url: "/contact" },
    { name: "بلاگ", url: "/blogs" },
    { name: "فروشگاه", url: "/store" },
    { name: "دستهبندی کالاها", url: "/categories" },
  ];

  const urlToPersianNameMap: { [key: string]: string } = {
    "/": "خانه",
    "/about": "درباره ما",
    "/contact": "ارتباط با ما",
    "/blogs": "بلاگ",
    "/store": "فروشگاه",
    "/login": "ورود",
  };

  const handleLinkSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUrl = e.target.value;
    if (!selectedUrl) return;

    const newLink: Link = {
      name: urlToPersianNameMap[selectedUrl] || "نامشخص",
      url: selectedUrl,
      megaMenu: [],
    };

    setUserInputData((prev: HeaderSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        links: [...prev.blocks.links, newLink],
      },
    }));

    e.target.value = "";
  };

  const addCustomLink = () => {
    if (!customLinkName.trim() || !customLinkUrl.trim()) return;

    const newLink: Link = {
      name: customLinkName.trim(),
      url: customLinkUrl.trim(),
      megaMenu: [],
    };

    setUserInputData((prev: HeaderSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        links: [...prev.blocks.links, newLink],
      },
    }));

    setActiveRoutes((prev) => [...prev, customLinkUrl.trim()]);
    setCustomLinkName("");
    setCustomLinkUrl("");
  };

  const availableRoutes = [
    ...staticRoutes,
    ...activeRoutes
      .filter((route) => !staticRoutes.some((sr) => sr.url === route))
      .map((route) => ({ name: route, url: route })),
  ];

  const isStaticRoute = (url: string) => {
    return staticRoutes.some((route) => route.url === url);
  };
  const removeLink = (urlToRemove: string) => {
    if (isStaticRoute(urlToRemove)) return;

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

    setActiveRoutes((prev) => prev.filter((route) => route !== urlToRemove));
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

  const startEditingLink = (index: number, currentName: string) => {
    setEditingLinkIndex(index);
    setEditingLinkName(currentName);
    setShowEditModal(true);
  };

  const saveEditedLinkName = () => {
    if (!editingLinkName.trim() || editingLinkIndex === null) return;

    setUserInputData((prev: HeaderSection) => {
      const updatedLinks = [...prev.blocks.links];
      updatedLinks[editingLinkIndex] = {
        ...updatedLinks[editingLinkIndex],
        name: editingLinkName.trim(),
      };
      return {
        ...prev,
        blocks: {
          ...prev.blocks,
          links: updatedLinks,
        },
      };
    });

    setShowEditModal(false);
    setEditingLinkIndex(null);
    setEditingLinkName("");
  };

  const cancelEditingLink = () => {
    setShowEditModal(false);
    setEditingLinkIndex(null);
    setEditingLinkName("");
  };

  return (
    <div className="p-2 max-w-4xl space-y-2 rounded" dir="rtl">
      <h2 className="text-lg font-bold mb-4">تنظیمات نو بار</h2>

      {/* Tabs */}
      <TabButtons onTabChange={handleTabChange} />

      {/* Content Tab */}
      {isContentOpen && (
        <div className="space-y-6 p-2 animate-slideDown">
          {/* Announcement Section */}
          <div className="transition-shadow duration-200">
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
          <div className="   rounded-xl    transition-shadow duration-200">
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
                    value=""
                  >
                    <option value="">انتخاب کنید...</option>
                    {availableRoutes
                      .filter(
                        (route) =>
                          !userInputData.blocks.links.some(
                            (link) => link.url === route.url
                          )
                      )
                      .map((route, index) => (
                        <option key={`${route.url}-${index}`} value={route.url}>
                          {route.name}
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

              {/* Custom Link Section */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="text-sm font-medium text-blue-800 mb-3">
                  افزودن لینک سفارشی
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-blue-700 mb-1">
                      نام لینک
                    </label>
                    <input
                      type="text"
                      value={customLinkName}
                      onChange={(e) => setCustomLinkName(e.target.value)}
                      className="w-full p-2 text-sm border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="مثال: خدمات"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-blue-700 mb-1">
                      آدرس URL
                    </label>
                    <input
                      type="text"
                      value={customLinkUrl}
                      onChange={(e) => setCustomLinkUrl(e.target.value)}
                      className="w-full p-2 text-sm border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="مثال: /services"
                    />
                  </div>
                  <button
                    onClick={addCustomLink}
                    disabled={!customLinkName.trim() || !customLinkUrl.trim()}
                    className="w-full p-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    افزودن لینک
                  </button>
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

                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {userInputData.blocks.links.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      <div className="text-2xl mb-1">📄</div>
                      <p className="text-xs">هیچ آیتمی ندارید</p>
                    </div>
                  ) : (
                    userInputData.blocks.links.map((link, index) => (
                      <div
                        key={`${link.url}-${index}`}
                        className="group flex items-center bg-white hover:bg-gray-50 p-2 rounded border transition-colors"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div
                            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                              isStaticRoute(link.url)
                                ? "bg-blue-500"
                                : "bg-green-500"
                            }`}
                          ></div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <p
                                className="text-xs font-medium text-gray-800 truncate flex-1 cursor-pointer hover:text-blue-600"
                                onClick={() =>
                                  startEditingLink(index, link.name)
                                }
                                title={link.name}
                              >
                                {link.name}
                              </p>
                            </div>
                            <p
                              className="text-xs text-gray-500 truncate"
                              title={link.url}
                            >
                              {link.url}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1   transition-opacity">
                          <button
                            onClick={() => startEditingLink(index, link.name)}
                            className="text-blue-500 hover:text-blue-700 p-1 text-xs"
                            title="ویرایش"
                          >
                            <FaEdit className="w-3" />
                          </button>
                          <button
                            onClick={() => removeLink(link.url)}
                            disabled={isStaticRoute(link.url)}
                            className={`p-1 text-xs ${
                              isStaticRoute(link.url)
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-red-500 hover:text-red-700"
                            }`}
                            title={
                              isStaticRoute(link.url) ? "قابل حذف نیست" : "حذف"
                            }
                          >
                            <FaTrash />
                          </button>
                        </div>
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
        <div className="animate-slideDown">
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
        <div className="animate-slideDown text-sm">
          <h3 className="  font-semibold text-sky-700">
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

      {/* Edit Link Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 mx-4" dir="rtl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">ویرایش نام لینک</h3>
              <button
                onClick={cancelEditingLink}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نام جدید لینک
                </label>
                <input
                  type="text"
                  value={editingLinkName}
                  onChange={(e) => setEditingLinkName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="نام مورد نظر را وارد کنید"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEditedLinkName();
                    if (e.key === "Escape") cancelEditingLink();
                  }}
                  autoFocus
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={cancelEditingLink}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  لغو
                </button>
                <button
                  onClick={saveEditedLinkName}
                  disabled={!editingLinkName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  ذخیره
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
