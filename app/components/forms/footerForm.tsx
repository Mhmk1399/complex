import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, FooterSection } from "@/lib/types";
import React from "react";
import MarginPaddingEditor from "../sections/editor";

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
    <label className="block mb-1" htmlFor={name}>
      {label}
    </label>
    <div className="flex flex-col gap-3 items-center">
      <input
        type="color"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="border p-0.5 rounded-full"
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

  const handleUpdate = (
    type: "margin" | "padding",
    updatedValues: BoxValues
  ) => {
    if (type === "margin") {
      setMargin(updatedValues);
      setUserInputData((prev: FooterSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          marginTop: updatedValues.top.toString(),
          marginBottom: updatedValues.bottom.toString(),
        },
      }));
    } else {
      setPadding(updatedValues);
      setUserInputData((prev: FooterSection) => ({
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
    if (layout && selectedComponent) { 
      const initialData = Compiler(layout, selectedComponent);
      if (initialData?.length) {
        setUserInputData(initialData[0]);
      }
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
    const { name, value } = e.target;
    setUserInputData((prev: FooterSection) => ({
      ...prev,
      blocks: {
        ...(prev?.blocks || {}),
        setting: {
          ...prev?.blocks?.setting,
          [name]: value,
        },
      },
    }));
  };

  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev: FooterSection) => ({
      ...prev,
      setting: {
        ...prev?.setting,
        [name]: value,
      },
    }));
  };

  return (
    <div
      className="p-2 max-w-4xl mx-auto bg-gray-200 rounded-xl my-4"
      dir="rtl"
    >
      <h2 className="text-xl font-bold my-4">تنظیمات فوتر</h2>

      {/* Content Section */}
      <div className="mb-6 bg-white  rounded-xl shadow-sm border border-gray-100 mt-4">
        <button
          onClick={() => setIsContentOpen(!isContentOpen)}
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <h3 className="font-semibold text-gray-700">محتوا</h3>
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
            <h3 className="font-semibold mb-2 p-4 animate-slideDown">محتوا</h3> 
            <div className="space-y-4 p-4 animate-slideDown">
              <div>
                <label className="block mb-1">متن</label>
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
                    userInputData?.blocks?.description ??
                    "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد"
                  }
                  onChange={handleBlockChange}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>

              <div>
                <label className="block mb-1">لینک لوگو</label>
                <input
                  type="text"
                  name="logo"
                  value={userInputData?.blocks?.logo ?? "لینک لوگو"}
                  onChange={handleBlockChange}
                  className="w-full p-2 border rounded"
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
                  value={
                    userInputData?.blocks?.telegramLink ?? "لینک پیام رسان"
                  }
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
      </div>

      {/* Style Settings */}
      <div className="mb-6 bg-white p-2 rounded-xl shadow-sm border border-gray-100 mt-4">
        <button
          onClick={() => setIsStyleSettingsOpen(!isStyleSettingsOpen)}
          className="w-full flex justify-between items-center p-2 hover:bg-gray-50 rounded-xl transition-all duration-200"
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
            <div className="grid md:grid-cols-1 gap-4  p-4 animate-slideDown">
              <h4 className="font-semibold mb-2">تنظیمات سربرگ</h4>
              <ColorInput
                label="رنگ سربرگ"
                name="textColor"
                value={userInputData?.blocks?.setting?.textColor ?? "#ffffff"}
                onChange={handleBlockSettingChange}
              />

              <label>سایز متن سربرگ</label>

              <input
                type="range"
                name="textFontSize"
                min="12"
                max="48"
                step="1"
                value={userInputData?.blocks?.setting?.textFontSize ?? "16"}
                onChange={handleBlockSettingChange}
              />
              <div className="text-gray-500 text-sm">
                {userInputData?.blocks?.setting?.textFontSize}px
              </div>
              <div>
                <label className="block mb-1">وزن متن سربرگ</label>
                <select
                  name="textFontWeight"
                  value={
                    userInputData?.blocks?.setting?.textFontWeight ?? "400"
                  }
                  onChange={handleBlockSettingChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="bold">ضخیم</option>
                  <option value="normal">نرمال</option>
                </select>
              </div>
              <h4 className="font-semibold mb-2">تنظیمات متن</h4>

              <label>سایز توضیحات</label>
              <input
                type="range"
                name="descriptionFontSize"
                min="12"
                max="48"
                step="1"
                value={
                  userInputData?.blocks?.setting?.descriptionFontSize ?? "16"
                }
                onChange={handleBlockSettingChange}
              />
              <div className="text-gray-500 text-sm">
                {userInputData?.blocks?.setting?.descriptionFontSize}px
              </div>

              <div>
                <label className="block mb-1">وزن متن توضیحات</label>
                <select
                  name="descriptionFontWeight"
                  value={
                    userInputData?.blocks?.setting?.descriptionFontWeight ??
                    "400"
                  }
                  onChange={handleBlockSettingChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="bold">ضخیم</option>
                  <option value="normal">نرمال</option>
                </select>
              </div>

              <ColorInput
                label="رنگ توضیحات"
                name="descriptionColor"
                value={
                  userInputData?.blocks?.setting?.descriptionColor ?? "#ffffff"
                }
                onChange={handleBlockSettingChange}
              />
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

              <ColorInput
                label="رنگ پس زمینه"
                name="backgroundColor"
                value={userInputData?.setting?.backgroundColor ?? "#fffffff"}
                onChange={handleSettingChange}
              />
            </div>

            {/* Spacing Settings */}

            {/* Footer Links Section */}
            <h3 className="font-semibold p-4">لینک‌های فوتر</h3>
            <div className="space-y-1 flex flex-col gap-2 p-4">
              <ColorInput
                label="رنگ لینک‌ها"
                name="linkColor"
                value={userInputData?.blocks?.setting?.linkColor ?? "#ffffff"}
                onChange={handleBlockSettingChange}
              />
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
                          links: prev.blocks.links?.filter(
                            (_, i) => i !== index
                          ),
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
          </>
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
