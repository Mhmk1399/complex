import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, Link, HeaderSection } from "@/lib/types";
import MarginPaddingEditor from "../sections/editor";
import React from "react";
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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [isSpacingOpen, setIsSpacingOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [dropdownAnimation, setDropdownAnimation] = useState(false);
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);

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

      // Update the form data with new JSON
      setUserInputData((prevData) => ({
        ...prevData,
        blocks: updatedJson.children.sections[0].blocks,
        setting: updatedJson.children.sections[0].setting,
      }));
    }
  };
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
  }, []);

  if (!isDataReady) {
    return (
      <div
        className="p-3 max-w-4xl mx-auto bg-gray-200 rounded-xl mt-4"
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
      megaMenu: null, // or provide a default value for megaMenu
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

  return (
    <div className="p-3 max-w-4xl space-y-2 mx-4 bg-gray-100 rounded mt-4" dir="rtl">
      <h2 className="text-lg font-bold my-4">تنظیمات نو بار</h2>
  
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => {
            setIsContentOpen(true);
            setIsStyleSettingsOpen(false);
            setIsSpacingOpen(false);
          }}
          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
            isContentOpen ? "bg-blue-500 text-white" : "bg-white text-gray-700"
          }`}
        >
          محتوا
        </button>
        <button
          onClick={() => {
            setIsStyleSettingsOpen(true);
            setIsContentOpen(false);
            setIsSpacingOpen(false);
          }}
          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
            isStyleSettingsOpen ? "bg-blue-500 text-white" : "bg-white text-gray-700"
          }`}
        >
          استایل
        </button>
        <button
          onClick={() => {
            setIsSpacingOpen(true);
            setIsContentOpen(false);
            setIsStyleSettingsOpen(false);
          }}
          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
            isSpacingOpen ? "bg-blue-500 text-white" : "bg-white text-gray-700"
          }`}
        >
          فاصله
        </button>
      </div>
  
      {/* Content Tab */}
      {isContentOpen && (
        <div className="bg-white rounded-lg p-4 animate-slideDown">
          <label className="block mb-1" htmlFor="imageLogo">
            لوگو
          </label>
          <input
            type="text"
            id="imageLogo"
            name="imageLogo"
            value={userInputData?.blocks?.imageLogo || ""}
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
        </div>
      )}
  
      {/* Style Tab */}
      {isStyleSettingsOpen && (
        <div className="bg-white rounded-lg p-4 animate-slideDown">
          <div className="grid md:grid-cols-2 grid-cols-2 gap-6">
            <ColorInput
              label="رنگ پس زمینه"
              name="bgColor"
              value={userInputData?.blocks?.setting?.bgColor?.toLocaleString()}
              onChange={handleBlockSettingChange}
            />
  
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
          </div>
        </div>
      )}
  
      {/* Space Tab */}
      {isSpacingOpen && (
        <div className="bg-white rounded-lg p-4 animate-slideDown">
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
  );
  
};
