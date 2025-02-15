import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, Link, HeaderSection } from "@/lib/types";
import MarginPaddingEditor from "../sections/editor";
import React from "react";
import { TabButtons } from "../tabButtons";
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
          className="border  p-0.5 rounded-full"
        />
      </div>
    </>
  );

  // Modify the useEffect to include default values to

  const [isDataReady, setIsDataReady] = React.useState(false);
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
  });

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
    const { name, value } = e.target;
    setUserInputData((prev: HeaderSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [name]: value,
      },
    }));
  };

  const handleBlockSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };
  const handleAnnouncementChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
  };
  const handleTabChange = (tab: "content" | "style" | "spacing") => {
    setIsContentOpen(tab === "content");
    setIsStyleSettingsOpen(tab === "style");
    setIsSpacingOpen(tab === "spacing");
  };

  return (
    <div className="p-3 max-w-4xl space-y-2 rounded" dir="rtl">
      <h2 className="text-lg font-bold mb-4">تنظیمات نو بار</h2>

      {/* Tabs */}
      {/* Use the TabButtons component */}
      <TabButtons onTabChange={handleTabChange} />

      {/* Content Tab */}
      {isContentOpen && (
        <div className="bg-white/20  shadow-lg rounded-lg p-4 animate-slideDown">
          <label className="block mb-1" htmlFor="imageLogo">
            لوگو
          </label>
          <input
            type="text"
            id="imageLogo"
            name="imageLogo"
            value={
              userInputData?.blocks?.imageLogo || "/assets/images/logo.webp"
            }
            onChange={handleBlockChange}
            className="w-full p-2 border rounded mb-2"
          />

          <label className="block" htmlFor="imageAlt">
            متن جایگزین تصویر
          </label>
          <input
            type="text"
            id="imageAlt"
            name="imageAlt"
            value={userInputData?.blocks?.imageAlt || "logo"}
            onChange={handleBlockChange}
            className="w-full p-2 border rounded"
          />
          <label className="block my-2" htmlFor="imageWidth">
            عرض لوگو
          </label>
          <input
            type="range"
            id="imageWidth"
            name="imageWidth"
            value={userInputData?.blocks?.setting?.imageWidth?.toLocaleString()}
            onChange={handleBlockSettingChange}
            className="p-2 w-full border rounded"
          />
          <div className="text-gray-500 text-sm">
            {userInputData?.blocks?.setting?.imageWidth}px
          </div>

          <label className="block mb-1" htmlFor="imageHeight">
            ارتفاع لوگو
          </label>
          <input
            type="range"
            id="imageHeight"
            name="imageHeight"
            value={userInputData?.blocks?.setting.imageHeight?.toLocaleString()}
            onChange={handleBlockSettingChange}
            className="p-2 w-full border rounded"
          />
          <div className="text-gray-500 text-sm">
            {userInputData?.blocks?.setting?.imageHeight}px
          </div>
          <div>
            <label className="block mb-2">متن اطلاع‌رسانی</label>
            <textarea
              name="announcementText"
              value={userInputData.blocks.setting?.announcementText || ""}
              onChange={handleAnnouncementChange}
              className="w-full p-2 border rounded"
              rows={2}
            />
          </div>
          <div className="p-4 space-y-4 animate-slideDown">
            <h3 className="font-semibold mb-2">آیتم های سربرگ</h3>
            <label className="block mb-1" htmlFor="linkSelect">
              یک آیتم را انتخاب کنید
            </label>
            <select
              id="linkSelect"
              onChange={handleLinkSelect}
              className="w-full p-2 border rounded mb-4"
              defaultValue=""
            >
              <option value="">انتخاب کنید</option>
              {linkOptions.map((link, index) => (
                <option key={`${link.url}-${index}`} value={link.url}>
                  {link.name}
                </option>
              ))}
            </select>

            <div className="space-y-1">
              {userInputData.blocks.links.map((link, index) => (
                <div
                  key={`${link.url}-${index}`}
                  className="flex items-center justify-between bg-gray-50 p-1 rounded"
                >
                  <span className="text-sm">
                    {link.name} - {link.url}
                  </span>
                  <button
                    onClick={() => removeLink(link.url)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Style Tab */}
      {isStyleSettingsOpen && (
        <div className="bg-white rounded-lg p-4 animate-slideDown">
          <div className="grid md:grid-cols-1 grid-cols-1 gap-2">
            <ColorInput
              label="رنگ پس زمینه"
              name="bgColor"
              value={userInputData?.blocks?.setting?.bgColor?.toLocaleString()}
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
            <div>
              <label className="block mb-2">سایز متن آیتم های دسته بندی</label>
              <input
                type="range"
                name="categoryItemSize"
                min="12"
                max="24"
                value={userInputData?.blocks?.setting?.categoryItemSize || "14"}
                onChange={handleBlockSettingChange}
                className="w-full"
              />
              <span className="text-sm text-gray-500">
                {userInputData?.blocks?.setting?.categoryItemSize || "14"}px
              </span>
            </div>

            <ColorInput
              label="رنک آیتم ها"
              name="itemColor"
              value={userInputData?.blocks?.setting.itemColor?.toLocaleString()}
              onChange={handleBlockSettingChange}
            />

            <ColorInput
              label="رنگ آیتم ها در صورت رفتن موس بر روی آنها"
              name="itemHoverColor"
              value={userInputData?.blocks?.setting.itemHoverColor?.toLocaleString()}
              onChange={handleBlockSettingChange}
            />

            <label className="block mb-1" htmlFor="titleFontSize">
              سایز عنوان
            </label>
            <input
              type="range"
              id="itemFontSize"
              name="itemFontSize"
              value={userInputData?.blocks?.setting?.itemFontSize?.toLocaleString()}
              onChange={handleBlockSettingChange}
              className="p-2 border rounded"
            />
            <div className="text-gray-500 text-sm -mt-5">
              {userInputData?.blocks?.setting?.itemFontSize}px
            </div>
            <br />
            <label className="block mb-1" htmlFor="titleFontSize">
              فاصله بین عنوان ها
            </label>
            <input
              type="range"
              id="gap"
              name="gap"
              value={userInputData?.blocks?.setting?.gap?.toLocaleString()}
              onChange={handleBlockSettingChange}
              className="p-2 border rounded"
            />
            <div className="text-gray-500 text-sm -mt-5">
              {userInputData?.blocks?.setting?.gap}px
            </div>
            <br />
            <div className="flex flex-col  gap-2">
              <div>
                <ColorInput
                  label="رنگ پس زمینه اطلاع رسانی"
                  name="announcementBgColor"
                  value={userInputData?.blocks?.setting.announcementBgColor?.toLocaleString()}
                  onChange={handleBlockSettingChange}
                />
              </div>

              <div>
                <ColorInput
                  label="رنک متن اطلاع رسانی"
                  name="announcementTextColor"
                  value={userInputData?.blocks?.setting.announcementTextColor?.toLocaleString()}
                  onChange={handleBlockSettingChange}
                />
              </div>
              <div>
                <label className="block mb-2">اندازه فونت اطلاع رسانی</label>
                <input
                  type="range"
                  name="announcementFontSize"
                  min="12"
                  max="80"
                  value={
                    userInputData.blocks.setting?.announcementFontSize || "14"
                  }
                  onChange={handleBlockSettingChange}
                  className="w-full"
                />
                <span className="text-sm text-gray-500">
                  {userInputData.blocks.setting?.announcementFontSize || "14"}px
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Space Tab */}
      {isSpacingOpen && (
        <div className="p-4 border-t border-gray-100 animate-slideDown">
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
  );
};
