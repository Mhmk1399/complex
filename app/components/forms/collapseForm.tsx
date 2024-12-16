import React, { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import {
  Layout,
  CollapseSection,
  CollapseBlock,
  CollapseBlockSetting,
} from "@/lib/types";
import MarginPaddingEditor from "../sections/editor";
interface BoxValues {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface MarginPaddingEditorProps {
  margin: BoxValues;
  padding: BoxValues;
  onChange: (type: "margin" | "padding", updatedValues: BoxValues) => void;
}

interface CollapseFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<CollapseSection>>;
  userInputData: CollapseSection;
  layout: Layout;
  selectedComponent: string;
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
  <div className="mb-4">
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

export const CollapseForm: React.FC<CollapseFormProps> = ({
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
  const [openAccordions, setOpenAccordions] = useState<Record<number, boolean>>(
    {}
  );
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [isSpacingOpen, setIsSpacingOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [json, setJson] = useState(null);
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
      setJson(updatedJson);

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
      setUserInputData((prev: CollapseSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          marginTop: updatedValues.top.toString(),
          marginBottom: updatedValues.bottom.toString(),
        },
      }));
    } else {
      setPadding(updatedValues);
      setUserInputData((prev: CollapseSection) => ({
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

  const handleBlockChange = (index: number, field: string, value: string) => {
    setUserInputData((prev: CollapseSection) => ({
      ...prev,
      blocks: prev.blocks.map((block: CollapseBlock, i: number) =>
        i === index ? { ...block, [field]: value } : block
      ),
    }));
  };
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isUpdating) return;
    setIsUpdating(true);
    
    const { name, value } = e.target;
    setUserInputData((prev: CollapseSection) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value,
      },
    }));
  
    setTimeout(() => setIsUpdating(false), 100);
  };
  const handleBlockSettingChange = (index: number, field: string, value: string) => {
    if (isUpdating) return;
    setIsUpdating(true);
  
    setUserInputData((prev: CollapseSection) => ({
      ...prev,
      blocks: prev.blocks.map((block: CollapseBlock, i: number) =>
        i === index
          ? {
              ...block,
              setting: { ...block.setting, [field]: value },
            }
          : block
      ),
    }));
  
    setTimeout(() => setIsUpdating(false), 100);
  };
  

  return (
    <>
      {!loaded ? (
        <p>Loading...</p>
      ) : (
        <div
          className="p-2 max-w-4xl mx-auto my-4 rounded-xl bg-gray-200"
          dir="rtl"
        >
          <h2 className="text-xl font-bold my-4">تنظیمات آکاردئون</h2>
          {/* Main Heading Settings */}
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Header Button */}
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
                <h3 className="font-semibold text-gray-700">سربرگ</h3>
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

            {/* Content */}
            {isContentOpen && (
              <div className="p-4 border-t border-gray-100">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    value={userInputData?.blocks?.[0]?.heading ?? ""}
                    onChange={(e) =>
                      handleBlockChange(0, "heading", e.target.value)
                    }
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                <ColorInput
                  label="رنگ سربرگ"
                  name="headingColor"
                  value={
                    userInputData?.setting?.headingColor?.toString() ??
                    "#333333"
                  }
                  onChange={handleSettingChange}
                />
                <div className="text-sm text-gray-500">
                  {userInputData?.setting?.headingColor?.toString() ??
                    "#333333"}
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <label>سایز سربرگ</label>
                  <input
                    type="range"
                    name="headingFontSize"
                    value={
                      userInputData?.setting?.headingFontSize?.toString() ??
                      "18"
                    }
                    onChange={handleSettingChange}
                  />
                  <div className="text-sm text-gray-500">
                    {userInputData?.setting?.headingFontSize?.toString() ??
                      "18px"}
                    px
                  </div>
                </div>
                <div>
                  <label className="block mb-1">وزن سربرگ</label>
                  <select
                    name="headingFontWeight"
                    value={
                      userInputData?.setting?.headingFontWeight?.toString() ??
                      "normal"
                    }
                    onChange={(e) =>
                      handleSettingChange(
                        e as unknown as React.ChangeEvent<HTMLInputElement>
                      )
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="bold">ضخیم</option>
                    <option value="lighter">نازک</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Collapse Items */}
          {[1, 2, 3, 4].map((num, index) => (
            <div
              key={num}
              className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              {/* Accordion Header Button */}
              <button
                onClick={() =>
                  setOpenAccordions((prev) => ({
                    ...prev,
                    [num]: !prev[num],
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
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  <h3 className="font-semibold text-gray-700">
                    آکاردئون {num}
                  </h3>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    openAccordions[num] ? "rotate-180" : ""
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

              {/* Accordion Content */}
              {openAccordions[num] && (
                <div className="p-4 border-t border-gray-100 space-y-4">
                  {/* Title Input */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <label className="block mb-2 text-sm font-bold text-gray-700">
                      عنوان
                    </label>
                    <input
                      type="text"
                      value={String(
                        userInputData?.blocks?.[index]?.[
                          `text${num}` as keyof CollapseBlock
                        ] ?? ""
                      )}
                      onChange={(e) =>
                        handleBlockChange(index, `text${num}`, e.target.value)
                      }
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>

                  {/* Content Textarea */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <label className="block mb-2 text-sm font-bold text-gray-700">
                      محتوا
                    </label>
                    <textarea
                      value={String(
                        userInputData?.blocks?.[index]?.[
                          `content${num}` as keyof CollapseBlock
                        ] ?? ""
                      )}
                      onChange={(e) =>
                        handleBlockChange(
                          index,
                          `content${num}`,
                          e.target.value
                        )
                      }
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      rows={3}
                    />
                  </div>

                  {/* Color Settings */}
                  <div className="p-3 bg-gray-50 rounded-lg space-y-4">
                    <ColorInput
                      label={`رنگ عنوان ${num}`}
                      name={`textColor${num}`}
                      value={String(
                        userInputData?.blocks?.[index]?.setting?.[
                          `textColor${num}` as keyof CollapseBlockSetting
                        ] ?? "#000000"
                      )}
                      onChange={(e) =>
                        handleBlockSettingChange(
                          index,
                          `textColor${num}`,
                          e.target.value
                        )
                      }
                    />
                    <span className="text-gray-500 text-sm">
                      {String(
                        userInputData?.blocks?.[index]?.setting?.[
                          `textColor${num}` as keyof CollapseBlockSetting
                        ] ?? "#000000"
                      )}
                    </span>
                    <br />
                    <label>سایز عنوان {num}</label>
                    <input
                      type="range"
                      name={`textFontSize${num}`}
                      min="1"
                      max="100"
                      value={String(
                        userInputData?.blocks?.[index]?.setting?.[
                          `textFontSize${num}` as keyof CollapseBlockSetting
                        ] ?? "#000000"
                      )}
                      onChange={(e) =>
                        handleBlockSettingChange(
                          index,
                          `textFontSize${num}`,
                          e.target.value
                        )
                      }
                    />
                    <br />
                    <span className="text-gray-500 text-sm">
                      {String(
                        userInputData?.blocks?.[index]?.setting?.[
                          `textFontSize${num}` as keyof CollapseBlockSetting
                        ] ?? "#000000"
                      )}
                      px
                    </span>
                    <br />
                    <label>وزن عنوان {num}</label>
                    <select
                      name={`textFontWeight${num}`}
                      value={
                        userInputData?.blocks?.[index]?.setting?.[
                          `textFontWeight${num}` as keyof CollapseBlockSetting
                        ]?.toString() ?? "small"
                      }
                      onChange={(e) =>
                        handleBlockSettingChange(
                          index,
                          `textFontWeight${num}`,
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded"
                    >
                      <option value="light">نازک</option>
                      <option value="bold">ضخیم</option>
                    </select>
                    <ColorInput
                      label={`رنگ محتوا ${num}`}
                      name={`contentColor${num}`}
                      value={String(
                        userInputData?.blocks?.[index]?.setting?.[
                          `contentColor${num}` as keyof CollapseBlockSetting
                        ] ?? "#000000"
                      )}
                      onChange={(e) =>
                        handleBlockSettingChange(
                          index,
                          `contentColor${num}`,
                          e.target.value
                        )
                      }
                    />
                    <span className="text-gray-500 text-sm">
                      {String(
                        userInputData?.blocks?.[index]?.setting?.[
                          `contentColor${num}` as keyof CollapseBlockSetting
                        ] ?? "#000000"
                      )}
                    </span>
                    <br />
                    <label>سایز محتوا {num}</label>
                    <input
                      type="range"
                      name={`contentFontSize${num}`}
                      min="1"
                      max="100"
                      value={String(
                        userInputData?.blocks?.[index]?.setting?.[
                          `contentFontSize${num}` as keyof CollapseBlockSetting
                        ] ?? "#000000"
                      )}
                      onChange={(e) =>
                        handleBlockSettingChange(
                          index,
                          `contentFontSize${num}`,
                          e.target.value
                        )
                      }
                    />
                    <br />
                    <span className="text-gray-500 text-sm">
                      {String(
                        userInputData?.blocks?.[index]?.setting?.[
                          `contentFontSize${num}` as keyof CollapseBlockSetting
                        ] ?? "#000000"
                      )}
                      px
                    </span>
                    <br />
                    <label>وزن عنوان {num}</label>
                    <select
                      name={`contentFontWeight${num}`}
                      value={
                        userInputData?.blocks?.[index]?.setting?.[
                          `contentFontWeight${num}` as keyof CollapseBlockSetting
                        ]?.toString() ?? "small"
                      }
                      onChange={(e) =>
                        handleBlockSettingChange(
                          index,
                          `contentFontWeight${num}`,
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded"
                    >
                      <option value="light">نازک</option>
                      <option value="bold">ضخیم</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}

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

          {/* Spacing Settings Dropdown */}

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
