import { useEffect, useState } from "react";
import { Layout, SpecialOfferSection } from "@/lib/types";
import React from "react";
import MarginPaddingEditor from "../sections/editor";
import { Compiler } from "../compiler";

interface SpecialFormProps {
    setUserInputData: React.Dispatch<React.SetStateAction<SpecialOfferSection>>;
    userInputData: SpecialOfferSection;
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
                value={value || "#000000"}
                onChange={onChange}
                className="border p-0.5 rounded-full"
            />
        </div>
    </>
);

export const SpecialForm: React.FC<SpecialFormProps> = ({
    setUserInputData,
    userInputData,
    layout,
    selectedComponent,
}) => {
    const [isStyleSettingsOpen, setIsStyleSettingsOpen] = useState(false);
    const [isContentOpen, setIsContentOpen] = useState(false);
    const [isSpacingOpen, setIsSpacingOpen] = useState(false);
    const [inputText, setInputText] = useState("");
    const [dropdownAnimation, setDropdownAnimation] = useState(false);
    useEffect(() => {
        const initialData = Compiler(layout, selectedComponent)[0];
        setUserInputData(initialData);
    }, []);

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

    const handleUpdate = (type: "margin" | "padding", updatedValues: BoxValues) => {
        if (type === "margin") {
            setMargin(updatedValues);
            setUserInputData((prev) => ({
                ...prev,
                setting: {
                    ...prev.setting,
                    marginTop: updatedValues.top.toString(),
                    marginBottom: updatedValues.bottom.toString(),
                    marginLeft: updatedValues.left.toString(),
                    marginRight: updatedValues.right.toString(),
                },
            }));
        } else {
            setPadding(updatedValues);
            setUserInputData((prev) => ({
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

    const handleLiveInput = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        console.log("Sending input:", inputText);

        if (!inputText?.trim()) {
            console.log("Input is empty");
            return;
        }

        try {
            const requestBody = {
                userInput: inputText,
            };
            console.log("Request body:", requestBody);

            const response = await fetch("/api/handleInputs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            const result = await response.json();
            console.log("API response:", result);

            if (result.success && result.data) {
                setUserInputData((prevData) => ({
                    ...prevData,
                    blocks: {
                        ...prevData.blocks,
                        setting: {
                            ...prevData.blocks.setting,
                            ...result.data.blocks.setting,
                        },
                    },
                }));
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };
    const handleBlockChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUserInputData((prev) => ({
            ...prev,
            blocks: {
                ...prev.blocks,
                [name]: value,
            },
        }));
    };

    const[isUpdating, setIsUpdating] = useState(false);
      const handleBlockSettingChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      ) => {
        if (isUpdating) return;
        setIsUpdating(true);
        
        const { name, value } = e.target;
        setUserInputData((prev: SpecialOfferSection) => ({
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

    const handleSettingChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        if (isUpdating) return;
        setIsUpdating(true);
        const { name, value } = e.target;
        setUserInputData((prev) => ({
            ...prev,
            setting: {
                ...prev.setting,
                [name]: value,
            },
        }));
        setTimeout(() => setIsUpdating(false), 100);
    };

    return (
        <div className="p-3 max-w-4xl mx-auto bg-gray-200 rounded-xl my-4" dir="rtl">
            <h2 className="text-xl font-bold my-4">تنظیمات پیشنهاد ویژه</h2>

            {/* Content Section */}
            <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <button
          onClick={() => setIsContentOpen(!isContentOpen)}
          className="w-full flex justify-between items-center p-4 hover:bg-gray-50 rounded-xl"
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
                    <div className="p-4 border-t border-gray-100">
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <label className="block mb-2 text-sm font-bold text-gray-700">
                                عنوان بخش
                            </label>
                            <input
                                type="text"
                                name="textHeading"
                                value={userInputData?.blocks?.textHeading || ""}
                                onChange={handleBlockChange}
                                className="w-full p-2 border rounded"
                            />

                        </div>
                    </div>
                )}
            </div>

            {/* Style Settings */}
            <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <button
          onClick={() => setIsStyleSettingsOpen(!isStyleSettingsOpen)}
          className="w-full flex justify-between items-center p-4 hover:bg-gray-50 rounded-xl"
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
            <h3 className="font-semibold text-gray-700">تنظیمات ظاهری</h3>
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
                    <div className="p-4 border-t border-gray-100">
                        <div className="grid md:grid-cols-1 gap-4">
                            <div className="p-3 bg-gray-100 rounded-lg">
                                <h4 className="font-semibold text-sky-700 my-4">تنظیمات عنوان</h4>
                                <ColorInput
                                    label="رنگ عنوان"
                                    name="headingColor"
                                    value={userInputData?.blocks?.setting?.headingColor || "#FFFFFF"}
                                    onChange={handleBlockSettingChange}
                                />
                                <label>سایز عنوان</label>
                                <input
                                    type="range"
                                    name="headingFontSize"
                                    value={userInputData?.blocks?.setting?.headingFontSize || "32"}
                                    onChange={handleBlockSettingChange}
                                    className="w-full"
                                />
                                <select
                                    name="headingFontWeight"
                                    value={userInputData?.blocks?.setting?.headingFontWeight || "normal"}
                                    onChange={handleBlockSettingChange}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="bold">ضخیم</option>
                                    <option value="normal">معمولی</option>
                                </select>
                            </div>

                            <div className="p-3 bg-gray-100 rounded-lg">
                                <h4 className="font-semibold text-sky-700 my-4">تنظیمات پس زمینه</h4>
                                <ColorInput
                                    label="رنگ پس زمینه"
                                    name="backgroundColor"
                                    value={userInputData?.setting?.backgroundColor || "#ef394e"}
                                    onChange={handleSettingChange}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Spacing Settings */}
            <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <button
                    onClick={() => setIsSpacingOpen(!isSpacingOpen)}
                    className="w-full flex justify-between items-center p-4 hover:bg-gray-50 rounded-xl"
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
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isSpacingOpen ? "rotate-180" : ""
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

                {isSpacingOpen && (
                    <div className="p-4 border-t border-gray-100">
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
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${dropdownAnimation ? "rotate-180" : ""
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
        </div>
    );
};
