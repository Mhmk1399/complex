import  { useEffect, useState } from "react";
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

  // Modify the useEffect to include default values

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
 console.log(userInputData);
 
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
      <div className="p-3 max-w-4xl mx-auto bg-gray-200 rounded-xl mt-4" dir="rtl">
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

    const newLink = {
      name: urlToPersianNameMap[selectedUrl] || "نامشخص", // Default to "نامشخص" if no mapping is found
      url: selectedUrl,
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

 

  return (
    <div
      className="p-3 max-w-4xl mx-auto bg-gray-200 rounded-xl mt-4"
      dir="rtl"
    >
      <h2 className="text-xl font-bold my-4">تنظیمات نو بار</h2>

      <div className="mb-6 bg-white rounded-lg">
        <button
          onClick={() => setIsContentOpen(!isContentOpen)}
          className="w-full flex justify-between items-center p-3 bg-white hover:bg-gray-50 rounded-xl transition-all duration-200"
        >
          <div className="flex items-center gap-2 ">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <h3 className="font-semibold mb-2">لوگو </h3>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isContentOpen ? "rotate-180" : ""
            }`}
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
        </button>
        {isContentOpen && (
          <>
            <div className="p-4 animate-slideDown">
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

              <label className="block " htmlFor="imageAlt">
                متن جایگزین تصویر
              </label>
              <input
                type="text"
                id="imageAlt"
                name="imageAlt"
                value={userInputData?.blocks?.imageAlt}
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
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block mb-1" htmlFor="marginLeft">
                    جابجایی لوگو به چپ
                  </label>
                  <input
                    type="range"
                    id="marginLeft"
                    name="marginLeft"
                    min="-200"
                    max="200"
                    value={userInputData?.blocks?.setting.marginLeft || 0}
                    onChange={handleBlockSettingChange}
                    className="w-full p-2 border rounded"
                  />
                  <div className="text-gray-500 text-sm mt-1">
                    {userInputData?.blocks?.setting?.marginLeft || 0}px
                  </div>
                </div>

                <div>
                  <label className="block mb-1" htmlFor="marginRight">
                    جابجایی لوگو به راست
                  </label>
                  <input
                    type="range"
                    id="marginRight"
                    name="marginRight"
                    min="-200"
                    max="200"
                    value={userInputData?.blocks?.setting.marginRight || 0}
                    onChange={handleBlockSettingChange}
                    className="w-full p-2 border rounded"
                  />
                  <div className="text-gray-500 text-sm mt-1">
                    {userInputData?.blocks?.setting?.marginRight || 0}px
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Style Settings */}

      <div className="mb-6 bg-white rounded-lg">
        <button
          onClick={() => setIsStyleSettingsOpen(!isStyleSettingsOpen)}
          className="w-full flex justify-between items-center p-4 hover:bg-gray-50 rounded-xl transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            <h3 className="font-semibold text-gray-700">تنظیمات استایل</h3>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isStyleSettingsOpen ? "rotate-180" : ""
            }`}
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
        </button>
        {isStyleSettingsOpen && (
          <>
            <div className="grid md:grid-cols-2 grid-cols-2 gap-6 p-4 animate-slideDown">
              <ColorInput
                label="رنگ عنوان"
                name="titleColor"
                value={userInputData?.blocks?.setting?.titleColor?.toLocaleString()}
                onChange={handleBlockSettingChange}
              />

              <ColorInput
                label="رنگ پس زمینه"
                name="backgroundColorNavbar"
                value={userInputData?.blocks?.setting?.backgroundColorNavbar?.toLocaleString()}
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
            </div>
          </>
        )}
      </div>

      {/* Navigation Links */}

      <div className="mb-6 bg-white rounded-lg">
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="w-full flex justify-between items-center p-4 hover:bg-gray-50 rounded-xl transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            <svg
              fill="#3b82f6 "
              width="24px"
              height="24px"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <rect
                  x="19"
                  y="18.92"
                  width="60"
                  height="16"
                  rx="4"
                  ry="4"
                ></rect>
                <rect
                  x="19"
                  y="40.92"
                  width="27"
                  height="16"
                  rx="4"
                  ry="4"
                ></rect>
                <rect
                  x="19"
                  y="62.92"
                  width="27"
                  height="16"
                  rx="4"
                  ry="4"
                ></rect>
                <rect
                  x="52"
                  y="40.92"
                  width="27"
                  height="16"
                  rx="4"
                  ry="4"
                ></rect>
                <rect
                  x="52"
                  y="62.92"
                  width="27"
                  height="16"
                  rx="4"
                  ry="4"
                ></rect>
              </g>
            </svg>
            <h3 className="font-semibold text-gray-700">آیتم های سربرگ</h3>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isFormOpen ? "rotate-180" : ""
            }`}
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
        </button>

        {isFormOpen && (
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

            <div className="space-y-2">
              {userInputData.blocks.links.map((link, index) => (
                <div
                  key={`${link.url}-${index}`}
                  className="flex items-center justify-between bg-gray-100 p-2 rounded"
                >
                  <span>
                    {link.name} - {link.url}
                  </span>
                  <button
                    onClick={() => removeLink(link.url)}
                    className="text-red-500 hover:text-red-700"
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>


      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <button
          onClick={() => setDropdownAnimation(!dropdownAnimation)}
          className="w-full flex justify-between items-center p-2 hover:bg-gray-50 rounded-xl transition-all duration-200"
        >
          <div className="flex items-center gap-2 ">
            <svg
              width="31px"
              height="40px"
              viewBox="-6.4 -6.4 76.80 76.80"
              xmlns="http://www.w3.org/2000/svg"
              strokeWidth="2.56"
              stroke="#3b82f6 "
              fill="none"
              transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)"
              className="mr-1"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
                stroke="#CCCCCC"
                strokeWidth="0.128"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <circle cx="34.52" cy="11.43" r="5.82"></circle>
                <circle cx="53.63" cy="31.6" r="5.82"></circle>
                <circle cx="34.52" cy="50.57" r="5.82"></circle>
                <circle cx="15.16" cy="42.03" r="5.82"></circle>
                <circle cx="15.16" cy="19.27" r="5.82"></circle>
                <circle cx="34.51" cy="29.27" r="4.7"></circle>
                <line x1="20.17" y1="16.3" x2="28.9" y2="12.93"></line>
                <line x1="38.6" y1="15.59" x2="49.48" y2="27.52"></line>
                <line x1="50.07" y1="36.2" x2="38.67" y2="46.49"></line>
                <line x1="18.36" y1="24.13" x2="30.91" y2="46.01"></line>
                <line x1="20.31" y1="44.74" x2="28.7" y2="48.63"></line>
                <line x1="17.34" y1="36.63" x2="31.37" y2="16.32"></line>
                <line x1="20.52" y1="21.55" x2="30.34" y2="27.1"></line>
                <line x1="39.22" y1="29.8" x2="47.81" y2="30.45"></line>
                <line x1="34.51" y1="33.98" x2="34.52" y2="44.74"></line>
              </g>
            </svg>
            <h3 className="font-semibold text-gray-700">تنظیمات دستوری</h3>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              dropdownAnimation ? "rotate-180" : ""
            }`}
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
        </button>
        {dropdownAnimation && (
          <>
            <div className="flex flex-col gap-2 p-2 animate-slideDown">
              <h4 className="text-pink-500 font-semibold p-2 text-sm">
                هر تغییری که لازم دارید اعمال کنید بنویسید
              </h4>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="p-2 rounded-xl border-2 border-blue-300  focus:outline-none"
                rows={5}
                style={{ width: "100%" }}
                placeholder="یک جمله فارسی وارد کنید..."
              />
              <button
                onClick={handleLiveInput}
                style={{
                  marginTop: "10px",
                  backgroundColor: "#007bff",
                  color: "white",
                  borderRadius: "5px",
                  padding: "5px",
                }}
              >
                تبدیل
              </button>
            </div>
          </>
        )}
      </div>

          
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Dropdown Header */}

        <button
          onClick={() => setIsSpacingOpen(!isSpacingOpen)}
          className="w-full flex justify-between items-center p-4 hover:bg-gray-50 rounded-xl transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            <h3 className="font-semibold text-gray-700">تنظیمات فاصله</h3>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isSpacingOpen ? "rotate-180" : ""
            }`}
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
        </button>

        {/* Dropdown Content */}
        {isSpacingOpen && (
          <div className="p-4 border-t border-gray-100 animate-slideDown">
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
    </div>
  );
};
