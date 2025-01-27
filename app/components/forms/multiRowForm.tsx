import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, MultiRowSection } from "@/lib/types";
import React from "react";
import MarginPaddingEditor from "../sections/editor";

interface MultiRowFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<MultiRowSection>>;
  userInputData: MultiRowSection | undefined;
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
  <div className="flex flex-col gap-2">
    <label className="block mb-1" htmlFor={name}>
      {label}
    </label>
    <input
      type="color"
      id={name}
      name={name}
      value={value || "#000000"}
      onChange={onChange}
      className="border p-0.5 rounded-full"
    />
  </div>
);

export const MultiRowForm: React.FC<MultiRowFormProps> = ({
  setUserInputData,
  userInputData,
  layout,
  selectedComponent,
}) => {
  const [loaded, setLoaded] = useState(false);
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
  const [openRows, setOpenRows] = useState<Record<number, boolean>>({});
  const [isHeadingOpen, setIsHeadingOpen] = useState(false);
  const [isSpacingOpen, setIsSpacingOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [dropdownAnimation, setDropdownAnimation] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const handleAddRow = () => {
    setUserInputData((prev: MultiRowSection) => ({
      ...prev,
      blocks: [
        ...prev.blocks,
        {
          heading: `عنوان ${prev.blocks.length + 1}`,
          description: `توضیحات ${prev.blocks.length + 1}`,
          imageSrc: "/assets/images/banner1.jpg",
          imageAlt: "",
          btnLable: `دکمه ${prev.blocks.length + 1}`,
          btnLink: "#",
        },
      ],
    }));
  };

  const handleDeleteRow = (index: number) => {
    setUserInputData((prev: MultiRowSection) => ({
      ...prev,
      blocks: prev.blocks.filter((_, i) => i !== index),
    }));
  };

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
      setUserInputData((prev: MultiRowSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          marginTop: updatedValues.top.toString(),
          marginBottom: updatedValues.bottom.toString(),
        },
      }));
    } else {
      setPadding(updatedValues);
      setUserInputData((prev: MultiRowSection) => ({
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
    if (initialData) {
      setLoaded(true);
      setUserInputData(initialData);
    }
  }, []);
  useEffect(() => {
    const initialData = Compiler(layout, selectedComponent)[0];
    if (initialData) {
      setLoaded(true);
      setUserInputData(initialData);
    }
  }, [selectedComponent]);

  const handleBlockChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev: MultiRowSection) => ({
      ...prev,
      blocks: prev.blocks.map((block, i) =>
        i === index ? { ...block, [name]: value } : block
      ),
    }));
  };

  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (isUpdating) return;
    setIsUpdating(true);
    const { name, value } = e.target;
    setUserInputData((prev: MultiRowSection) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value,
      },
    }));
    setTimeout(() => setIsUpdating(false), 100);
  };

  return (
    <>
      {!loaded ? (
        <p>Loading...</p>
      ) : (
        <div
          className="p-3 max-w-4xl space-y-2 mx-4 bg-gray-100 rounded mt-4"
          dir="rtl"
        >
          <h2 className="text-xl font-bold my-4">ردیف ها</h2>

          {/* Title Settings */}
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <button
              onClick={() => setIsHeadingOpen(!isHeadingOpen)}
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
                <h3 className="font-semibold text-gray-700">سربرگ</h3>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                  isHeadingOpen ? "rotate-180" : ""
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

            {isHeadingOpen && (
              <div className="p-4 border-t border-gray-100 animate-slideDown">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    name="title"
                    value={userInputData?.title ?? ""}
                    onChange={(e) =>
                      setUserInputData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Main Title"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Row Content */}
          {userInputData?.blocks?.map((block, index) => (
            <div
              key={index}
              className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              {/* Row Header Button */}
              <button
                onClick={() =>
                  setOpenRows((prev) => ({
                    ...prev,
                    [index]: !prev[index],
                  }))
                }
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
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  <h3 className="font-semibold text-gray-700">
                    ردیف {index + 1}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRow(index);
                      }}
                      className="p-1 hover:bg-red-100 rounded-full cursor-pointer"
                    >
                      <svg
                        className="w-5 h-5 text-red-500"
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
                    </span>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    openRows[index] ? "rotate-180" : ""
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

              {/* Row Content */}
              {openRows[index] && (
                <div className="p-4 border-t border-gray-100 animate-slideDown">
                  <div className="space-y-4">
                    {/* Title Input */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <label className="block mb-2 text-sm font-bold text-gray-700">
                        عنوان
                      </label>
                      <input
                        type="text"
                        name="heading"
                        value={block.heading || ""}
                        onChange={(e) => handleBlockChange(e, index)}
                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>

                    {/* Description Textarea */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <label className="block mb-2 text-sm font-bold text-gray-700">
                        توضیحات
                      </label>
                      <textarea
                        name="description"
                        value={block.description || ""}
                        onChange={(e) => handleBlockChange(e, index)}
                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        rows={3}
                      />
                    </div>

                    {/* Image Input */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <label className="block mb-2 text-sm font-bold text-gray-700">
                        تصویر
                      </label>
                      <input
                        type="text"
                        name="imageSrc"
                        value={block.imageSrc || ""}
                        onChange={(e) => handleBlockChange(e, index)}
                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>

                    {/* Image Alt Input */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <label className="block mb-2 text-sm font-bold text-gray-700">
                        متن جایگزین تصویر
                      </label>
                      <input
                        type="text"
                        name="imageAlt"
                        value={block.imageAlt || ""}
                        onChange={(e) => handleBlockChange(e, index)}
                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>

                    {/* Button Label Input */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <label className="block mb-2 text-sm font-bold text-gray-700">
                        متن دکمه
                      </label>
                      <input
                        type="text"
                        name="btnLable"
                        value={block.btnLable || ""}
                        onChange={(e) => handleBlockChange(e, index)}
                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>

                    {/* Button Link Input */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <label className="block mb-2 text-sm font-bold text-gray-700">
                        لینک دکمه
                      </label>
                      <input
                        type="text"
                        name="btnLink"
                        value={block.btnLink || ""}
                        onChange={(e) => handleBlockChange(e, index)}
                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          <button
            onClick={handleAddRow}
            className="px-1 rounded-lg mb-3 w-full text-3xl group hover:font-extrabold transition-all"
          >
            +
            <div className="bg-blue-500 w-full pb-0.5 group-hover:bg-blue-600 group-hover:pb-1 transition-all"></div>
          </button>

          {/* Style Settings */}
          <div className="mb-6">
            <button
              onClick={() => setIsStyleSettingsOpen(!isStyleSettingsOpen)}
              className="w-full flex justify-between bg-white  items-center p-4 my-6 hover:bg-gray-50 rounded-xl transition-all duration-200"
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
                <div className="grid md:grid-cols-1 gap-4 animate-slideDown">
                  <h4 className="font-semibold my-2">تنظیمات سربرگ</h4>
                  <ColorInput
                    label="رنگ سربرگ"
                    name="titleColor"
                    value={userInputData?.setting?.titleColor ?? "#000000"}
                    onChange={handleSettingChange}
                  />
                  <div>
                    <label className="block mb-1">سایز سربرگ</label>
                    <input
                      type="range"
                      name="titleFontSize"
                      min="10"
                      max="50"
                      value={parseInt(
                        userInputData?.setting?.titleFontSize ?? "35"
                      )}
                      onChange={handleSettingChange}
                      className="w-full"
                    />
                    <div className="text-gray-500 text-sm">
                      {userInputData?.setting?.titleFontSize}px
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1">وزن سربرگ</label>
                    <select
                      name="titleFontWeight"
                      value={userInputData?.setting?.titleFontWeight ?? "bold"}
                      onChange={handleSettingChange}
                      className="w-full p-2 border rounded"
                    >
                      <option value="normal">نرمال</option>
                      <option value="bold">ضخیم</option>
                    </select>
                  </div>
                  <h4 className="font-semibold my-2">تنظیمات عنوان</h4>
                  <ColorInput
                    label="رنگ عنوان"
                    name="headingColor"
                    value={userInputData?.setting?.headingColor ?? "#fcbf49"}
                    onChange={handleSettingChange}
                  />
                  <div>
                    <label className="block mb-1">سایز عنوان</label>
                    <input
                      type="range"
                      name="headingFontSize"
                      min="10"
                      max="50"
                      value={parseInt(
                        userInputData?.setting?.headingFontSize ?? "35"
                      )}
                      onChange={handleSettingChange}
                      className="w-full"
                    />
                    <div className="text-gray-500 text-sm">
                      {userInputData?.setting?.headingFontSize}px
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1">وزن عنوان</label>
                    <select
                      name="headingFontWeight"
                      value={
                        userInputData?.setting?.headingFontWeight ?? "bold"
                      }
                      onChange={handleSettingChange}
                      className="w-full p-2 border rounded"
                    >
                      <option value="normal">نرمال</option>
                      <option value="bold">ضخیم</option>
                    </select>
                  </div>
                  <h4 className="font-semibold my-2">تنظیمات توضیحات</h4>
                  <ColorInput
                    label="رنگ توضیحات"
                    name="descriptionColor"
                    value={
                      userInputData?.setting?.descriptionColor ?? "#e4e4e4"
                    }
                    onChange={handleSettingChange}
                  />
                  <div>
                    <label className="block mb-1">سایز توضیحات</label>
                    <input
                      type="range"
                      name="descriptionFontSize"
                      min="10"
                      max="50"
                      value={parseInt(
                        userInputData?.setting?.descriptionFontSize ?? "35"
                      )}
                      onChange={handleSettingChange}
                      className="w-full"
                    />
                    <div className="text-gray-500 text-sm">
                      {userInputData?.setting?.descriptionFontSize}px
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1">وزن توضیحات</label>
                    <select
                      name="descriptionFontWeight"
                      value={
                        userInputData?.setting?.descriptionFontWeight ?? "bold"
                      }
                      onChange={handleSettingChange}
                      className="w-full p-2 border rounded"
                    >
                      <option value="normal">نرمال</option>
                      <option value="bold">ضخیم</option>
                    </select>
                  </div>
                  <h4 className="font-semibold my-2">تنظیمات پس زمینه</h4>
                  <ColorInput
                    label="رنگ پس زمینه"
                    name="backgroundColorMultiRow"
                    value={
                      userInputData?.setting?.backgroundColorMultiRow ??
                      "#8d99ae"
                    }
                    onChange={handleSettingChange}
                  />
                  <ColorInput
                    label="رنگ پس زمینه ردیف ها"
                    name="backgroundColorBox"
                    value={
                      userInputData?.setting?.backgroundColorBox ?? "#2b2d42"
                    }
                    onChange={handleSettingChange}
                  />
                  <h4 className="font-semibold my-2">تنظیمات دکمه </h4>
                  <ColorInput
                    label="رنگ متن دکمه"
                    name="btnColor"
                    value={userInputData?.setting?.btnColor ?? "#ffffff"}
                    onChange={handleSettingChange}
                  />
                  <ColorInput
                    label="رنگ پس زمینه دکمه"
                    name="btnBackgroundColor"
                    value={
                      userInputData?.setting?.btnBackgroundColor ?? "#bc4749"
                    }
                    onChange={handleSettingChange}
                  />
                  <div className="grid md:grid-cols-1 gap-4 mt-4">
                    <h4 className="font-semibold mb-2">تنظیمات تصویر</h4>
                    <div>
                      <label className="block mb-1">عرض تصویر</label>
                      <input
                        type="range"
                        name="imageWidth"
                        min="200"
                        max="1000"
                        value={parseInt(
                          userInputData?.setting?.imageWidth ?? "700"
                        )}
                        onChange={handleSettingChange}
                        className="w-full"
                      />
                      <div className="text-gray-500 text-sm">
                        {userInputData?.setting?.imageWidth}px
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1">ارتفاع تصویر</label>
                      <input
                        type="range"
                        name="imageHeight"
                        min="100"
                        max="500"
                        value={parseInt(
                          userInputData?.setting?.imageHeight ?? "300"
                        )}
                        onChange={handleSettingChange}
                        className="w-full"
                      />
                      <div className="text-gray-500 text-sm">
                        {userInputData?.setting?.imageHeight}px
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1">انحنا زوایای تصویر</label>
                      <input
                        type="range"
                        name="imageRadius"
                        min="0"
                        max="50"
                        value={parseInt(
                          userInputData?.setting?.imageRadius ?? "45"
                        )}
                        onChange={handleSettingChange}
                        className="w-full"
                      />
                      <div className="text-gray-500 text-sm">
                        {userInputData?.setting?.imageRadius}px
                      </div>
                    </div>
                  </div>

                  {/* Layout Settings */}
                  <div className="mt-4">
                    <label className="block mb-1">جایگاه تصویر</label>
                    <select
                      name="imageAlign"
                      value={userInputData?.setting?.imageAlign ?? "row"}
                      onChange={handleSettingChange}
                      className="w-full p-2 border rounded"
                    >
                      <option value="row">ردیف</option>
                      <option value="row-reverse">ردیف معکوس</option>
                    </select>
                  </div>
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

          {/* Spacing Settings */}
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
      )}
    </>
  );
};
