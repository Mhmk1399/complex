import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, MultiColumnSection, AnimationEffect } from "@/lib/types";
import MarginPaddingEditor from "../sections/editor";
import { useSharedContext } from "@/app/contexts/SharedContext";
import { animationService } from "@/services/animationService";
import { AnimationPreview } from "../animationPreview";
import { TabButtons } from "../tabButtons";
import { HiChevronDown, HiSparkles } from "react-icons/hi";
// Add index signature to allow string and number keys
export interface MultiColumnBlock {
  [key: string]: string | undefined;
}
interface MultiColumnFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<MultiColumnSection>>;
  userInputData: MultiColumnSection;
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
    <label className="block mb-1">{label}</label>
    <div className="flex flex-col rounded-md gap-3 items-center">
      <input
        type="color"
        id={name}
        name={name}
        value={value || "#000000"}
        onChange={onChange}
        className=" p-0.5 border rounded-md border-gray-200 w-8 h-8 bg-transparent "
      />
    </div>
  </>
);

export const MultiColumnForm: React.FC<MultiColumnFormProps> = ({
  setUserInputData,
  userInputData,
  layout,
  selectedComponent,
}) => {
  const { activeRoutes } = useSharedContext();
  const [useRouteSelectBtns, setUseRouteSelectBtns] = useState<
    Record<number, boolean>
  >({});
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
  const [openColumns, setOpenColumns] = useState<Record<number, boolean>>({});
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [isSpacingOpen, setIsSpacingOpen] = useState(false);
  const [isAnimationOpen, setIsAnimationOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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
    console.log(initialData);
    if (initialData) {
      setUserInputData(initialData);
    }
  }, [selectedComponent]);
  useEffect(() => {
    setIsContentOpen(true);
  }, []);

  const handleAddColumn = () => {
    setUserInputData((prev: MultiColumnSection) => {
      // استخراج کلیدهای عددی معتبر از بلاک‌ها
      const blockKeys = Object.keys(prev.blocks)
        .map((key) => Number(key))
        .filter((n) => !isNaN(n));

      const newIndex = blockKeys.length === 0 ? 0 : Math.max(...blockKeys) + 1;
      const newColumnNum = newIndex + 1;

      const newBlock: MultiColumnBlock = {
        [`title${newColumnNum}`]: `ستون ${newColumnNum}`,
        [`description${newColumnNum}`]: `لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد`,
        [`imageSrc${newColumnNum}`]: "",
        [`btnLable${newColumnNum}`]: `دکمه ${newColumnNum}`,
        [`btnLink${newColumnNum}`]: "#",
      };

      return {
        ...prev,
        blocks: {
          ...prev.blocks,
          [newIndex]: newBlock, // 👈 این کلید عددی هست و در UI نمایش داده می‌شه
        },
      };
    });
  };

  const handleDeleteColumn = (columnIndex: number) => {
    setUserInputData((prev: MultiColumnSection) => {
      const newBlocks = { ...prev.blocks };
      delete newBlocks[columnIndex];

      return {
        ...prev,
        blocks: newBlocks,
      };
    });
  };

  const handleBlockChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const { name, value } = e.target;

    setUserInputData((prev: MultiColumnSection) => {
      const updatedBlocks = { ...prev.blocks };
      const block = updatedBlocks[index];

      if (!block) return prev;

      const updatedBlock: MultiColumnBlock = {
        ...block,
        [name + (index + 1)]: value, // کلید باید درست ساخته بشه
      };

      updatedBlocks[index] = updatedBlock;

      return {
        ...prev,
        blocks: updatedBlocks,
      };
    });
  };

  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (isUpdating) return;
    setIsUpdating(true);
    const { name, value } = e.target;
    setUserInputData((prev: MultiColumnSection) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value,
      },
    }));
    setTimeout(() => setIsUpdating(false), 100);
  };

  const handleUpdate = (
    type: "margin" | "padding",
    updatedValues: BoxValues
  ) => {
    if (type === "margin") {
      setMargin(updatedValues);
      setUserInputData((prev: MultiColumnSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          marginTop: updatedValues.top.toString(),

          marginBottom: updatedValues.bottom.toString(),
        },
      }));
    } else {
      setPadding(updatedValues);
      setUserInputData((prev: MultiColumnSection) => ({
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

  // Animation handlers for buttons
  const handleButtonAnimationToggle = (enabled: boolean) => {
    if (enabled) {
      const defaultConfig = animationService.getDefaultConfig("pulse");
      const defaultEffect: AnimationEffect = {
        type: "hover",
        animation: defaultConfig,
      };

      setUserInputData((prev: MultiColumnSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          btnAnimation: defaultEffect,
        },
      }));
    } else {
      setUserInputData((prev: MultiColumnSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          btnAnimation: undefined,
        },
      }));
    }
  };

  const handleButtonAnimationChange = (
    field: string,
    value: string | number
  ) => {
    setUserInputData((prev: MultiColumnSection) => {
      const currentAnimation = prev.setting?.btnAnimation;
      if (!currentAnimation) return prev;

      const updatedAnimation = { ...currentAnimation };

      if (field === "type") {
        updatedAnimation.type = value as "hover" | "click";
      } else if (field.startsWith("animation.")) {
        const animationField = field.split(".")[1];
        let processedValue = value;

        // Process duration and delay to ensure proper format
        if (animationField === "duration" || animationField === "delay") {
          const numValue =
            typeof value === "string" ? parseFloat(value) : value;
          processedValue = `${numValue}s`;
        }

        // Validate the animation config
        const newAnimationConfig = {
          ...updatedAnimation.animation,
          [animationField]: processedValue,
        };

        if (animationService.validateConfig(newAnimationConfig)) {
          updatedAnimation.animation = newAnimationConfig;
        } else {
          // If validation fails, revert to default
          updatedAnimation.animation = animationService.getDefaultConfig(
            updatedAnimation.animation.type
          );
        }
      }

      return {
        ...prev,
        setting: {
          ...prev.setting,
          btnAnimation: updatedAnimation,
        },
      };
    });
  };

  // Animation handlers for images
  const handleImageAnimationToggle = (enabled: boolean) => {
    if (enabled) {
      const defaultConfig = animationService.getDefaultConfig("glow");
      const defaultEffect: AnimationEffect = {
        type: "hover",
        animation: defaultConfig,
      };

      setUserInputData((prev: MultiColumnSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          imageAnimation: defaultEffect,
        },
      }));
    } else {
      setUserInputData((prev: MultiColumnSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          imageAnimation: undefined,
        },
      }));
    }
  };

  const handleImageAnimationChange = (
    field: string,
    value: string | number
  ) => {
    setUserInputData((prev: MultiColumnSection) => {
      const currentAnimation = prev.setting?.imageAnimation;
      if (!currentAnimation) return prev;

      const updatedAnimation = { ...currentAnimation };

      if (field === "type") {
        updatedAnimation.type = value as "hover" | "click";
      } else if (field.startsWith("animation.")) {
        const animationField = field.split(".")[1];
        let processedValue = value;

        // Process duration and delay to ensure proper format
        if (animationField === "duration" || animationField === "delay") {
          const numValue =
            typeof value === "string" ? parseFloat(value) : value;
          processedValue = `${numValue}s`;
        }

        // Validate the animation config
        const newAnimationConfig = {
          ...updatedAnimation.animation,
          [animationField]: processedValue,
        };

        if (animationService.validateConfig(newAnimationConfig)) {
          updatedAnimation.animation = newAnimationConfig;
        } else {
          // If validation fails, revert to default
          updatedAnimation.animation = animationService.getDefaultConfig(
            updatedAnimation.animation.type
          );
        }
      }

      return {
        ...prev,
        setting: {
          ...prev.setting,
          imageAnimation: updatedAnimation,
        },
      };
    });
  };

  const handleTabChange = (
    tab: "content" | "style" | "spacing" | "animation"
  ) => {
    setIsContentOpen(tab === "content");
    setIsStyleSettingsOpen(tab === "style");
    setIsSpacingOpen(tab === "spacing");
    setIsAnimationOpen(tab === "animation");
  };

  // Get current animation values
  const currentButtonAnimation = userInputData?.setting?.btnAnimation;
  const hasButtonAnimation = !!currentButtonAnimation;
  const currentImageAnimation = userInputData?.setting?.imageAnimation;
  const hasImageAnimation = !!currentImageAnimation;

  return (
    <div className="p-3 max-w-4xl space-y-2 rounded" dir="rtl">
      <h2 className="text-lg font-bold mb-4">تنظیمات ستون ها</h2>

      {/* Tabs - Updated to include animation tab */}
      <TabButtons onTabChange={handleTabChange} />

      {/* Main Heading Settings */}

      {isContentOpen && (
        <div className="p-4 animate-slideDown">
          <div className=" rounded-lg">
            <label htmlFor="" className="block mb-2 font-bold">
              متن سربرگ
            </label>
            <input
              type="text"
              name="heading"
              value={userInputData?.setting?.heading?.toString() ?? ""}
              onChange={handleSettingChange}
              placeholder="Main Heading"
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <br />
          {userInputData?.blocks &&
            typeof userInputData.blocks === "object" &&
            Object.entries(userInputData.blocks).map(([key, block]) => {
              const index = Number(key);
              const titleKey = `title${index + 1}`;
              const descKey = `description${index + 1}`;
              const btnLabelKey = `btnLable${index + 1}`;

              if (!block) return null;
              return (
                <div
                  key={key}
                  className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100"
                >
                  <button
                    onClick={() =>
                      setOpenColumns((prev) => ({
                        ...prev,
                        [Number(key)]: !prev[Number(key)],
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
                        ستون {Number(key) + 1}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteColumn(Number(key));
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
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                          openColumns[Number(key)] ? "rotate-180" : ""
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
                    </div>
                  </button>

                  {openColumns[Number(key) as number] && (
                    <div className="p-4 border-t border-gray-100 space-y-4 animate-slideDown">
                      {/* Column Content */}
                      <label>عنوان ستون</label>
                      <input
                        type="text"
                        name="title"
                        value={(block as MultiColumnBlock)[titleKey]}
                        onChange={(e) => handleBlockChange(e, index)}
                      />

                      <br />
                      <br />
                      <label className="">توضیحات ستون</label>
                      <input
                        type="text"
                        name="description"
                        value={(block as MultiColumnBlock)[descKey]}
                        onChange={(e) => handleBlockChange(e, index)}
                      />
                      <br />
                      <br />
                      <label>متن دکمه</label>

                      <input
                        type="text"
                        className="w-full p-2 border border-gray-200 rounded-lg"
                        placeholder="متن دکمه"
                        name="btnLable"
                        value={(block as MultiColumnBlock)[btnLabelKey]}
                        onChange={(e) => handleBlockChange(e, index)}
                      />
                      <br />
                      <br />
                      <label>لینک دکمه</label>
                      <div className="mb-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={useRouteSelectBtns[Number(key)] || false}
                            onChange={(e) =>
                              setUseRouteSelectBtns((prev) => ({
                                ...prev,
                                [Number(key)]: e.target.checked,
                              }))
                            }
                            className="rounded"
                          />

                          <span className="text-sm">
                            انتخاب از مسیرهای موجود
                          </span>
                        </label>
                      </div>
                      {useRouteSelectBtns[Number(key)] ? (
                        <select
                          value={
                            (userInputData.blocks as MultiColumnBlock[])[
                              Number(key) - 1
                            ]?.[
                              `btnLink${Number(key)}` as keyof MultiColumnBlock
                            ] || ""
                          }
                          onChange={(
                            e: React.ChangeEvent<HTMLSelectElement>
                          ) => {
                            setUserInputData((prev) => ({
                              ...prev,
                              blocks: {
                                ...prev.blocks,
                                [Number(key) - 1]: {
                                  ...prev.blocks[Number(key) - 1],
                                  [`btnLink${Number(key)}`]: e.target.value,
                                },
                              },
                            }));
                          }}
                          className="w-full p-2 border border-gray-200 rounded-lg"
                        >
                          <option value="">انتخاب مسیر</option>
                          {activeRoutes.map((route: string) => (
                            <option key={route} value={route}>
                              {route}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          name="btnLink"
                          value={
                            (userInputData?.blocks as MultiColumnBlock[])[
                              Number(key) - 1
                            ]?.[
                              `btnLink${Number(key)}` as keyof MultiColumnBlock
                            ] || ""
                          }
                          onChange={(e) => handleBlockChange(e, Number(key))}
                          className="w-full p-2 border border-gray-200 rounded-lg"
                          placeholder="آدرس لینک یا مسیر سفارشی"
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          <button
            onClick={handleAddColumn}
            className="px-1 rounded-lg mb-3 w-full text-3xl group hover:font-extrabold transition-all"
          >
            +
            <div className="bg-blue-500 w-full pb-0.5 group-hover:bg-blue-600 group-hover:pb-1 transition-all"></div>
          </button>
        </div>
      )}

      {/* Style Settings */}

      {isStyleSettingsOpen && (
        <>
          <div className="grid md:grid-cols-1 rounded-xl gap-4 p-2 animate-slideDown">
            <h4 className="font-semibold mb-2 text-sky-700">تنظیمات سربرگ</h4>
            <div className="rounded-lg flex items-center justify-between ">
              <ColorInput
                label="رنگ سربرگ"
                name="headingColor"
                value={userInputData?.setting?.headingColor ?? "#ffffff"}
                onChange={handleSettingChange}
              />
            </div>
            <div className="flex items-center justify-center gap-4 p-4 rounded-lg border border-gray-300 shadow-sm">
              <input
                type="range"
                min="0"
                max="100"
                name="headingFontSize"
                value={userInputData?.setting?.headingFontSize || "250"}
                onChange={handleSettingChange}
              />
              <p className="text-sm text-gray-600 text-nowrap">
                {userInputData?.setting?.headingFontSize}px
              </p>
            </div>
            <div className="p-3 rounded-lg">
              <label className="block mb-1">وزن سربرگ</label>
              <select
                name="headingFontWeight"
                value={
                  userInputData?.setting?.headingFontWeight?.toString() ?? "0"
                }
                onChange={handleSettingChange}
                className="w-full p-2 border rounded"
              >
                <option value="bold">ضخیم</option>
                <option value="normal">نرمال</option>
              </select>
            </div>
            <h4 className="font-semibold mb-2"> تنظیمات عنوان</h4>
            <div className="rounded-lg flex items-center justify-between ">
              <ColorInput
                label="رنگ عنوان"
                name="titleColor"
                value={
                  userInputData?.setting?.titleColor?.toLocaleString() ??
                  "#ffa62b"
                }
                onChange={handleSettingChange}
              />
            </div>

            <div className="flex items-center justify-center gap-4 p-4 rounded-lg border border-gray-300 shadow-sm">
              <input
                type="range"
                min="0"
                max="100"
                name="titleFontSize"
                value={userInputData?.setting?.titleFontSize || "250"}
                onChange={handleSettingChange}
              />
              <p className="text-sm text-gray-600 text-nowrap">
                {userInputData?.setting?.titleFontSize}px
              </p>
            </div>
            <div className="p-3 rounded-lg">
              <label className="block mb-1">وزن سربرگ</label>
              <select
                name="titleFontWeight"
                value={
                  userInputData?.setting?.titleFontWeight?.toString() ?? "0"
                }
                onChange={handleSettingChange}
                className="w-full p-2 border rounded"
              >
                <option value="bold">ضخیم</option>
                <option value="normal">نرمال</option>
              </select>
            </div>
            <h4 className="font-semibold mb-2"> تنظیمات محتوا</h4>
            <div className="rounded-lg flex items-center justify-between ">
              <ColorInput
                label="رنگ محتوا"
                name="descriptionColor"
                value={
                  userInputData?.setting?.descriptionColor?.toLocaleString() ??
                  "#ffa62b"
                }
                onChange={handleSettingChange}
              />
            </div>
            <div className="flex items-center justify-center gap-4 p-4 rounded-lg border border-gray-300 shadow-sm">
              <input
                type="range"
                min="0"
                max="100"
                name="descriptionFontSize"
                value={userInputData?.setting?.descriptionFontSize || "250"}
                onChange={handleSettingChange}
              />
              <p className="text-sm text-gray-600 text-nowrap">
                {userInputData?.setting?.descriptionFontSize}px
              </p>
            </div>
            <div className="p-3 rounded-lg">
              <label className="block mb-1">وزن محتوا</label>
              <select
                name="descriptionFontWeight"
                value={
                  userInputData?.setting?.descriptionFontWeight?.toString() ??
                  "0"
                }
                onChange={handleSettingChange}
                className="w-full p-2 border rounded"
              >
                <option value="bold">ضخیم</option>
                <option value="normal">نرمال</option>
              </select>
            </div>
            <h4 className="font-semibold mb-2"> تنظیمات دکمه</h4>
            <div className="rounded-lg flex items-center justify-between ">
              <ColorInput
                label="رنگ متن دکمه"
                name="btnColor"
                value={
                  userInputData?.setting?.btnColor?.toLocaleString() ??
                  "#ffffff"
                }
                onChange={handleSettingChange}
              />
            </div>
            <div className="rounded-lg flex items-center justify-between ">
              <ColorInput
                label="رنگ پس زمینه دکمه"
                name="btnBackgroundColor"
                value={
                  userInputData?.setting?.btnBackgroundColor?.toLocaleString() ??
                  "#16697a"
                }
                onChange={handleSettingChange}
              />
            </div>
            <h4 className="font-semibold mb-2">تنظیمات پس زمینه</h4>
            <div className="rounded-lg flex items-center justify-between ">
              <ColorInput
                label="رنگ پس زمینه"
                name="backgroundColorBox"
                value={
                  userInputData?.setting?.backgroundColorBox?.toLocaleString() ??
                  "#82c0cc"
                }
                onChange={handleSettingChange}
              />
            </div>

            <h4 className="font-semibold my-6">تنظیمات تصویر</h4>
            <label htmlFor="">انحنای تصویر</label>
            <div className="flex items-center justify-center gap-4 p-4 rounded-lg border border-gray-300 shadow-sm">
              <input
                type="range"
                min="0"
                max="100"
                name="imageRadious"
                value={userInputData?.setting?.imageRadious || "250"}
                onChange={handleSettingChange}
              />
              <p className="text-sm text-gray-600 text-nowrap">
                {userInputData?.setting?.imageRadious}px
              </p>
            </div>
          </div>
        </>
      )}

      {/* Animation Settings */}
      {isAnimationOpen && (
        <div className="space-y-4 animate-slideDown">
          {/* Button Animation Settings */}
          <div className="rounded-lg flex flex-col gap-3 border border-gray-200 p-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <HiSparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-800">
                  انیمیشن دکمه
                </span>
              </div>

              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasButtonAnimation}
                  onChange={(e) =>
                    handleButtonAnimationToggle(e.target.checked)
                  }
                  className="sr-only"
                />
                <div
                  className={`w-[42px] h-5 rounded-full transition-colors duration-200 ${
                    hasButtonAnimation ? "bg-blue-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 mt-0.5 ${
                      hasButtonAnimation ? "-translate-x-6" : "-translate-x-0.5"
                    }`}
                  />
                </div>
              </label>
            </div>

            {hasButtonAnimation && currentButtonAnimation && (
              <div className="space-y-4 p-4 bg-transparent border border-gray-200 rounded-lg">
                <h5 className="text-sm font-medium text-gray-700">
                  تنظیمات انیمیشن دکمه‌ها
                </h5>

                {/* Trigger & Animation Type */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      تریگر
                    </label>
                    <select
                      value={currentButtonAnimation.type}
                      onChange={(e) =>
                        handleButtonAnimationChange("type", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="hover">هاور</option>
                      <option value="click">کلیک</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      نوع انیمیشن
                    </label>
                    <select
                      value={currentButtonAnimation.animation.type}
                      onChange={(e) =>
                        handleButtonAnimationChange(
                          "animation.type",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {animationService.getAnimationTypes().map((type) => (
                        <option key={type} value={type}>
                          {type === "pulse" && "پالس"}
                          {type === "glow" && "درخشش"}
                          {type === "brightness" && "روشنایی"}
                          {type === "blur" && "تاری"}
                          {type === "saturate" && "اشباع رنگ"}
                          {type === "contrast" && "کنتراست"}
                          {type === "opacity" && "شفافیت"}
                          {type === "shadow" && "سایه"}
                        </option>
                      ))}
                    </select>
                    <div className="text-xs text-gray-500 mt-1">
                      {animationService.getAnimationPreview(
                        currentButtonAnimation.animation.type
                      )}
                    </div>
                  </div>
                </div>

                {/* Timing Controls */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      مدت (ثانیه)
                    </label>
                    <input
                      type="number"
                      min="0.1"
                      max="10"
                      step="0.1"
                      value={
                        parseFloat(
                          currentButtonAnimation.animation.duration.replace(
                            "s",
                            ""
                          )
                        ) || 1
                      }
                      onChange={(e) =>
                        handleButtonAnimationChange(
                          "animation.duration",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      فعلی: {currentButtonAnimation.animation.duration}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      تکرار
                    </label>
                    <select
                      value={
                        currentButtonAnimation.animation.iterationCount || "1"
                      }
                      onChange={(e) =>
                        handleButtonAnimationChange(
                          "animation.iterationCount",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="5">5</option>
                      <option value="infinite">∞</option>
                    </select>
                  </div>
                </div>

                {/* Advanced Settings - Collapsible */}
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer text-xs font-medium text-gray-600 hover:text-gray-800 py-2">
                    <span>تنظیمات پیشرفته</span>
                    <HiChevronDown className="w-4 h-4 transform group-open:rotate-180 transition-transform" />
                  </summary>

                  <div className="mt-3 space-y-3 pt-3 border-t border-gray-200">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        تایمینگ
                      </label>
                      <select
                        value={currentButtonAnimation.animation.timing}
                        onChange={(e) =>
                          handleButtonAnimationChange(
                            "animation.timing",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="ease">ease</option>
                        <option value="ease-in">ease-in</option>
                        <option value="ease-out">ease-out</option>
                        <option value="ease-in-out">ease-in-out</option>
                        <option value="linear">linear</option>
                        <option value="cubic-bezier(0, 0, 0.2, 1)">
                          cubic-bezier
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        تاخیر (ثانیه)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={
                          parseFloat(
                            (
                              currentButtonAnimation.animation.delay || "0s"
                            ).replace("s", "")
                          ) || 0
                        }
                        onChange={(e) =>
                          handleButtonAnimationChange(
                            "animation.delay",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        فعلی: {currentButtonAnimation.animation?.delay || "0s"}
                      </div>
                    </div>
                  </div>
                </details>

                {/* Mini Preview with Animation Info */}
                <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
                  <div className="text-center mb-3">
                    <p className="text-xs text-gray-600 mb-2">پیش‌نمایش</p>
                    <AnimationPreview effects={[currentButtonAnimation]} />
                  </div>
                </div>
              </div>
            )}

            {!hasButtonAnimation && (
              <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <HiSparkles className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                <p className="text-xs">انیمیشن دکمه‌ها غیرفعال است</p>
              </div>
            )}
          </div>

          {/* Image Animation Settings */}
          <div className="rounded-lg flex flex-col gap-3 border border-gray-200 p-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <HiSparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-800">
                  انیمیشن تصویر
                </span>
              </div>

              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasImageAnimation}
                  onChange={(e) => handleImageAnimationToggle(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-[42px] h-5 rounded-full transition-colors duration-200 ${
                    hasImageAnimation ? "bg-blue-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 mt-0.5 ${
                      hasImageAnimation ? "-translate-x-6" : "-translate-x-0.5"
                    }`}
                  />
                </div>
              </label>
            </div>

            {hasImageAnimation && currentImageAnimation && (
              <div className="space-y-4 p-4 bg-transparent border border-gray-200 rounded-lg">
                <h5 className="text-sm font-medium text-gray-700">
                  تنظیمات انیمیشن تصاویر
                </h5>

                {/* Trigger & Animation Type */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      تریگر
                    </label>
                    <select
                      value={currentImageAnimation.type}
                      onChange={(e) =>
                        handleImageAnimationChange("type", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="hover">هاور</option>
                      <option value="click">کلیک</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      نوع انیمیشن
                    </label>
                    <select
                      value={currentImageAnimation.animation.type}
                      onChange={(e) =>
                        handleImageAnimationChange(
                          "animation.type",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {animationService.getAnimationTypes().map((type) => (
                        <option key={type} value={type}>
                          {type === "pulse" && "پالس"}
                          {type === "glow" && "درخشش"}
                          {type === "brightness" && "روشنایی"}
                          {type === "blur" && "تاری"}
                          {type === "saturate" && "اشباع رنگ"}
                          {type === "contrast" && "کنتراست"}
                          {type === "opacity" && "شفافیت"}
                          {type === "shadow" && "سایه"}
                        </option>
                      ))}
                    </select>
                    <div className="text-xs text-gray-500 mt-1">
                      {animationService.getAnimationPreview(
                        currentImageAnimation.animation.type
                      )}
                    </div>
                  </div>
                </div>

                {/* Timing Controls */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      مدت (ثانیه)
                    </label>
                    <input
                      type="number"
                      min="0.1"
                      max="10"
                      step="0.1"
                      value={
                        parseFloat(
                          currentImageAnimation.animation.duration.replace(
                            "s",
                            ""
                          )
                        ) || 1
                      }
                      onChange={(e) =>
                        handleImageAnimationChange(
                          "animation.duration",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      فعلی: {currentImageAnimation.animation.duration}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      تکرار
                    </label>
                    <select
                      value={
                        currentImageAnimation.animation.iterationCount || "1"
                      }
                      onChange={(e) =>
                        handleImageAnimationChange(
                          "animation.iterationCount",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="5">5</option>
                      <option value="infinite">∞</option>
                    </select>
                  </div>
                </div>

                {/* Advanced Settings - Collapsible */}
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer text-xs font-medium text-gray-600 hover:text-gray-800 py-2">
                    <span>تنظیمات پیشرفته</span>
                    <HiChevronDown className="w-4 h-4 transform group-open:rotate-180 transition-transform" />
                  </summary>

                  <div className="mt-3 space-y-3 pt-3 border-t border-gray-200">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        تایمینگ
                      </label>
                      <select
                        value={currentImageAnimation.animation.timing}
                        onChange={(e) =>
                          handleImageAnimationChange(
                            "animation.timing",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="ease">ease</option>
                        <option value="ease-in">ease-in</option>
                        <option value="ease-out">ease-out</option>
                        <option value="ease-in-out">ease-in-out</option>
                        <option value="linear">linear</option>
                        <option value="cubic-bezier(0, 0, 0.2, 1)">
                          cubic-bezier
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        تاخیر (ثانیه)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={
                          parseFloat(
                            (
                              currentImageAnimation.animation.delay || "0s"
                            ).replace("s", "")
                          ) || 0
                        }
                        onChange={(e) =>
                          handleImageAnimationChange(
                            "animation.delay",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        فعلی: {currentImageAnimation.animation?.delay || "0s"}
                      </div>
                    </div>
                  </div>
                </details>

                {/* Mini Preview with Animation Info */}
                <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
                  <div className="text-center mb-3">
                    <p className="text-xs text-gray-600 mb-2">پیش‌نمایش</p>
                    <AnimationPreview effects={[currentImageAnimation]} />
                  </div>
                </div>
              </div>
            )}

            {!hasImageAnimation && (
              <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <HiSparkles className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                <p className="text-xs">انیمیشن تصاویر غیرفعال است</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Spacing Settings Dropdown */}

      {isSpacingOpen && (
        <div className="p-4 animate-slideDown">
          <div className="rounded-lg flex items-center justify-center">
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
