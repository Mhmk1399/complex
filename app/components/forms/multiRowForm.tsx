import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, MultiRowSection, AnimationEffect } from "@/lib/types";
import { useSharedContext } from "@/app/contexts/SharedContext";
import MarginPaddingEditor from "../sections/editor";
import { TabButtons } from "../tabButtons";
import ImageSelectorModal from "../sections/ImageSelectorModal";
import { animationService } from "@/services/animationService";
import { AnimationPreview } from "../animationPreview";
import { HiChevronDown, HiSparkles, HiTrash, HiPlus } from "react-icons/hi";
import {
  ColorInput,
  DynamicRangeInput,
  DynamicSelectInput,
} from "./DynamicInputs";

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

export const MultiRowForm: React.FC<MultiRowFormProps> = ({
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
  const [openRows, setOpenRows] = useState<Record<number, boolean>>({});
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [isSpacingOpen, setIsSpacingOpen] = useState(false);
  const [isAnimationOpen, setIsAnimationOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
  const [currentEditingIndex, setCurrentEditingIndex] = useState<number>(0);

  const handleAddRow = () => {
    setUserInputData((prev: MultiRowSection) => {
      const existingKeys = Object.keys(prev.blocks || {})
        .filter((key) => !isNaN(Number(key)))
        .map(Number);
      const nextIndex =
        existingKeys.length > 0 ? Math.max(...existingKeys) + 1 : 0;

      return {
        ...prev,
        blocks: {
          ...prev.blocks,
          [nextIndex]: {
            heading: `ردیف  ${nextIndex + 1}`,
            description: `لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد`,
            imageSrc: "/assets/images/banner1.jpg",
            imageAlt: "",
            btnLable: `دکمه ${nextIndex + 1}`,
            btnLink: "#",
          },
        },
      };
    });
  };

  const handleDeleteRow = (index: number) => {
    // Get all numeric keys (rows)
    const existingKeys = Object.keys(userInputData?.blocks || {})
      .filter((key) => !isNaN(Number(key)))
      .map(Number);

    // Prevent deleting if only one row remains
    if (existingKeys.length <= 1) {
      return;
    }

    setUserInputData((prev: MultiRowSection) => {
      const newBlocks = { ...prev.blocks };
      delete newBlocks[index];
      return {
        ...prev,
        blocks: newBlocks,
      };
    });

    // Clean up related states
    setOpenRows((prev) => {
      const newOpenRows = { ...prev };
      delete newOpenRows[index];
      return newOpenRows;
    });

    setUseRouteSelectBtns((prev) => {
      const newRouteSelect = { ...prev };
      delete newRouteSelect[index];
      return newRouteSelect;
    });
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
          marginLeft: updatedValues.left.toString(),
          marginRight: updatedValues.right.toString(),
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
      setUserInputData(initialData);
    }
  }, [selectedComponent]);

  const handleBlockChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    if (isUpdating) return;
    setIsUpdating(true);
    const { name, value } = e.target;
    setUserInputData((prev: MultiRowSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [index]: {
          ...prev.blocks[index],
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
    setUserInputData((prev: MultiRowSection) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value,
      },
    }));
    setTimeout(() => setIsUpdating(false), 100);
  };

  // Animation handlers for images
  const handleImageAnimationToggle = (enabled: boolean) => {
    if (enabled) {
      const defaultConfig = animationService.getDefaultConfig("pulse");
      const defaultEffect: AnimationEffect = {
        type: "hover",
        animation: defaultConfig,
      };

      setUserInputData((prev: MultiRowSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          imageAnimation: defaultEffect,
        },
      }));
    } else {
      setUserInputData((prev: MultiRowSection) => ({
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
    setUserInputData((prev: MultiRowSection) => {
      const currentAnimation = prev.setting?.imageAnimation;
      if (!currentAnimation) return prev;

      const updatedAnimation = { ...currentAnimation };

      if (field === "type") {
        updatedAnimation.type = value as "hover" | "click";
      } else if (field.startsWith("animation.")) {
        const animationField = field.split(".")[1];
        let processedValue = value;

        if (animationField === "duration" || animationField === "delay") {
          const numValue =
            typeof value === "string" ? parseFloat(value) : value;
          processedValue = `${numValue}s`;
        }

        const newAnimationConfig = {
          ...updatedAnimation.animation,
          [animationField]: processedValue,
        };

        if (animationService.validateConfig(newAnimationConfig)) {
          updatedAnimation.animation = newAnimationConfig;
        } else {
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

  // Animation handlers for buttons
  const handleButtonAnimationToggle = (enabled: boolean) => {
    if (enabled) {
      const defaultConfig = animationService.getDefaultConfig("pulse");
      const defaultEffect: AnimationEffect = {
        type: "hover",
        animation: defaultConfig,
      };

      setUserInputData((prev: MultiRowSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          buttonAnimation: defaultEffect,
        },
      }));
    } else {
      setUserInputData((prev: MultiRowSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          buttonAnimation: undefined,
        },
      }));
    }
  };

  const handleButtonAnimationChange = (
    field: string,
    value: string | number
  ) => {
    setUserInputData((prev: MultiRowSection) => {
      const currentAnimation = prev.setting?.buttonAnimation;
      if (!currentAnimation) return prev;

      const updatedAnimation = { ...currentAnimation };

      if (field === "type") {
        updatedAnimation.type = value as "hover" | "click";
      } else if (field.startsWith("animation.")) {
        const animationField = field.split(".")[1];
        let processedValue = value;

        if (animationField === "duration" || animationField === "delay") {
          const numValue =
            typeof value === "string" ? parseFloat(value) : value;
          processedValue = `${numValue}s`;
        }

        const newAnimationConfig = {
          ...updatedAnimation.animation,
          [animationField]: processedValue,
        };

        if (animationService.validateConfig(newAnimationConfig)) {
          updatedAnimation.animation = newAnimationConfig;
        } else {
          updatedAnimation.animation = animationService.getDefaultConfig(
            updatedAnimation.animation.type
          );
        }
      }

      return {
        ...prev,
        setting: {
          ...prev.setting,
          buttonAnimation: updatedAnimation,
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

  useEffect(() => {
    setIsContentOpen(true);
  }, []);

  // Get current animation values
  const currentImageAnimation = userInputData?.setting?.imageAnimation;
  const hasImageAnimation = !!currentImageAnimation;
  const currentButtonAnimation = userInputData?.setting?.buttonAnimation;
  const hasButtonAnimation = !!currentButtonAnimation;

  return (
    <>
      <div className="p-2 max-w-4xl space-y-2 rounded" dir="rtl">
        <h2 className="text-lg font-bold mb-4">ردیف ها</h2>

        {/* Tabs */}
        <TabButtons onTabChange={handleTabChange} />

        {isContentOpen && (
          <div className="p-2 animate-slideDown">
            {/* Main Title Section */}
            <div className="mb-6   rounded-xl  ">
              <label
                htmlFor="title"
                className="  mb-3 font-bold text-gray-800 flex items-center gap-2"
              >
                متن عنوان
              </label>
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                placeholder="عنوان اصلی بخش را وارد کنید"
              />
            </div>

            {/* Add New Row Button */}
            <div className="mb-6">
              <button
                onClick={handleAddRow}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg w-full justify-center"
              >
                <HiPlus className="w-5 h-5" />
                افزودن ردیف جدید
              </button>
            </div>

            {/* Rows Section Header */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-600"
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
                ردیف‌ها
              </h3>
              <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {
                  Object.keys(userInputData?.blocks || {}).filter(
                    (key) => !isNaN(Number(key))
                  ).length
                }{" "}
                ردیف
              </span>
            </div>

            {/* Rows List */}
            <div className="space-y-4">
              {userInputData?.blocks &&
                typeof userInputData.blocks === "object" &&
                Object.keys(userInputData.blocks)
                  .filter((key) => !isNaN(Number(key))) // Only get numeric keys
                  .map((key) => {
                    const block = userInputData.blocks[Number(key)];
                    const rowIndex = Number(key);
                    const totalRows = Object.keys(userInputData.blocks).filter(
                      (k) => !isNaN(Number(k))
                    ).length;

                    if (!block || typeof block !== "object") return null;

                    return (
                      <div
                        key={key}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                      >
                        {/* Row Header */}
                        <div className="flex justify-between items-center p-1 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                          <button
                            onClick={() =>
                              setOpenRows((prev) => ({
                                ...prev,
                                [rowIndex]: !prev[rowIndex],
                              }))
                            }
                            className="flex items-center gap-3 flex-1 text-left hover:bg-white/50 p-2 rounded-lg transition-colors"
                          >
                            <div>
                              <p className="text-sm text-gray-500 truncate max-w-xs">
                                {block.heading || "بدون عنوان"}
                              </p>
                            </div>
                            <svg
                              className={`w-5 h-5 text-gray-400 transition-transform duration-200 mr-auto ${
                                openRows[rowIndex] ? "rotate-180" : ""
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

                          {/* Delete Button - Only show if more than 1 row */}
                          <div className="flex items-center gap-2">
                            {totalRows > 1 ? (
                              <button
                                onClick={() => handleDeleteRow(rowIndex)}
                                className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors duration-200"
                                title="حذف ردیف"
                              >
                                <HiTrash className="w-4 h-4" />
                              </button>
                            ) : (
                              <span className="text-xs text-red-500 bg-gray-100 px-3 py-2 rounded-lg">
                                غیر قابل حذف
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Row Content */}
                        {openRows[rowIndex] && (
                          <div className="p-6 animate-slideDown">
                            <div className="grid gap-6">
                              {/* Image Preview */}
                              {block.imageSrc && (
                                <div className="mb-4">
                                  <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                                    <img
                                      src={block.imageSrc}
                                      alt={block.imageAlt || "پیش‌نمایش"}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.src =
                                          "/assets/images/placeholder.jpg";
                                      }}
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Form Fields Grid */}
                              <div className="grid md:grid-cols-1 gap-6">
                                {/* Title Input */}
                                <div className="space-y-2">
                                  <label className="block text-sm font-semibold text-gray-700">
                                    عنوان ردیف
                                  </label>
                                  <input
                                    type="text"
                                    name="heading"
                                    value={block.heading || ""}
                                    onChange={(e) =>
                                      handleBlockChange(e, rowIndex)
                                    }
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="عنوان این ردیف را وارد کنید"
                                  />
                                </div>
                              </div>

                              {/* Description Textarea */}
                              <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                  توضیحات
                                </label>
                                <textarea
                                  name="description"
                                  value={block.description || ""}
                                  onChange={(e) =>
                                    handleBlockChange(e, rowIndex)
                                  }
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                  rows={4}
                                  placeholder="توضیحات تفصیلی این ردیف را وارد کنید"
                                />
                              </div>
                              {/* Button Label Input */}
                              <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                  متن دکمه
                                </label>
                                <input
                                  type="text"
                                  name="btnLable"
                                  value={block.btnLable || ""}
                                  onChange={(e) =>
                                    handleBlockChange(e, rowIndex)
                                  }
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                  placeholder="متن روی دکمه"
                                />
                              </div>

                              {/* Image Section */}
                              <div className="grid md:grid-cols-1 gap-6">
                                <div className="space-y-2">
                                  <label className="block text-sm font-semibold text-gray-700">
                                    تصویر
                                  </label>
                                  <div className="flex flex-col gap-2">
                                    <input
                                      type="text"
                                      name="imageSrc"
                                      value={block.imageSrc || ""}
                                      onChange={(e) =>
                                        handleBlockChange(e, rowIndex)
                                      }
                                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                      placeholder="آدرس تصویر"
                                    />
                                    <button
                                      onClick={() => {
                                        setCurrentEditingIndex(rowIndex);
                                        setIsImageSelectorOpen(true);
                                      }}
                                      className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors whitespace-nowrap"
                                      type="button"
                                    >
                                      انتخاب فایل
                                    </button>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <label className="block text-sm font-semibold text-gray-700">
                                    متن جایگزین تصویر
                                  </label>
                                  <input
                                    type="text"
                                    name="imageAlt"
                                    value={block.imageAlt || ""}
                                    onChange={(e) =>
                                      handleBlockChange(e, rowIndex)
                                    }
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="توضیح کوتاه برای تصویر"
                                  />
                                </div>
                              </div>

                              {/* Button Link Section */}
                              <div className="space-y-3">
                                <label className="block text-sm font-semibold text-gray-700">
                                  لینک دکمه
                                </label>

                                {/* Route Selection Toggle */}
                                <div className="mb-3">
                                  <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={
                                        useRouteSelectBtns[rowIndex] || false
                                      }
                                      onChange={(e) =>
                                        setUseRouteSelectBtns((prev) => ({
                                          ...prev,
                                          [rowIndex]: e.target.checked,
                                        }))
                                      }
                                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-600">
                                      انتخاب از مسیرهای موجود
                                    </span>
                                  </label>
                                </div>

                                {/* Link Input */}
                                {useRouteSelectBtns[rowIndex] ? (
                                  <select
                                    value={block.btnLink || ""}
                                    onChange={(
                                      e: React.ChangeEvent<HTMLSelectElement>
                                    ) => {
                                      setUserInputData((prev) => ({
                                        ...prev,
                                        blocks: {
                                          ...prev.blocks,
                                          [rowIndex]: {
                                            ...prev.blocks[rowIndex],
                                            btnLink: e.target.value,
                                          },
                                        },
                                      }));
                                    }}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                                    value={block.btnLink || ""}
                                    onChange={(e) =>
                                      handleBlockChange(e, rowIndex)
                                    }
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="آدرس لینک یا مسیر سفارشی"
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
            </div>

            {/* Empty State */}
            {(!userInputData?.blocks ||
              Object.keys(userInputData.blocks).filter(
                (key) => !isNaN(Number(key))
              ).length === 0) && (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  هیچ ردیفی اضافه نشده است
                </h3>
                <p className="text-gray-500 mb-6">
                  برای شروع، اولین ردیف خود را اضافه کنید
                </p>
                <button
                  onClick={handleAddRow}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <HiPlus className="w-5 h-5" />
                  اولین ردیف را اضافه کنید
                </button>
              </div>
            )}
          </div>
        )}

        {/* Style Settings */}
        {isStyleSettingsOpen && (
          <>
            <div className="grid md:grid-cols-1 gap-4 animate-slideDown">
              {/* title */}
              <div>
                {" "}
                <h4 className="font-semibold text-sky-700">تنظیمات سربرگ</h4>
                <DynamicRangeInput
                  label="سایز"
                  name="titleFontSize"
                  min="0"
                  max="100"
                  value={userInputData?.setting?.titleFontSize || "250"}
                  onChange={handleSettingChange}
                />{" "}
                <DynamicSelectInput
                  label="وزن"
                  name="titleFontWeight"
                  value={userInputData?.setting?.titleFontWeight ?? "normal"}
                  options={[
                    { value: "normal", label: "نرمال" },
                    { value: "bold", label: "ضخیم" },
                  ]}
                  onChange={handleSettingChange}
                />
                <ColorInput
                  label="رنگ "
                  name="titleColor"
                  value={userInputData?.setting?.titleColor ?? "#000000"}
                  onChange={handleSettingChange}
                />
              </div>
              {/* heading */}
              <div>
                <h4 className="font-semibold my-2 text-sky-700">
                  تنظیمات عنوان
                </h4>
                <DynamicRangeInput
                  label="سایز"
                  name="headingFontSize"
                  min="0"
                  max="100"
                  value={userInputData?.setting?.headingFontSize || "250"}
                  onChange={handleSettingChange}
                />{" "}
                <DynamicSelectInput
                  label="وزن"
                  name="headingFontWeight"
                  value={userInputData?.setting?.headingFontWeight ?? "normal"}
                  options={[
                    { value: "normal", label: "نرمال" },
                    { value: "bold", label: "ضخیم" },
                  ]}
                  onChange={handleSettingChange}
                />
                <ColorInput
                  label="رنگ "
                  name="headingColor"
                  value={userInputData?.setting?.headingColor ?? "#000000"}
                  onChange={handleSettingChange}
                />
              </div>
              {/* description */}
              <div>
                {" "}
                <h4 className="font-semibold my-2 text-sky-700">
                  تنظیمات توضیحات
                </h4>
                <DynamicRangeInput
                  label="سایز"
                  name="descriptionFontSize"
                  min="0"
                  max="100"
                  value={userInputData?.setting?.descriptionFontSize || "250"}
                  onChange={handleSettingChange}
                />{" "}
                <DynamicSelectInput
                  label="وزن"
                  name="descriptionFontWeight"
                  value={
                    userInputData?.setting?.descriptionFontWeight ?? "normal"
                  }
                  options={[
                    { value: "normal", label: "نرمال" },
                    { value: "bold", label: "ضخیم" },
                  ]}
                  onChange={handleSettingChange}
                />
                <ColorInput
                  label="رنگ توضیحات"
                  name="descriptionColor"
                  value={userInputData?.setting?.descriptionColor ?? "#e4e4e4"}
                  onChange={handleSettingChange}
                />
              </div>
              {/* rows */}
              <div>
                {" "}
                <h4 className="font-semibold my-2 text-sky-700">
                  تنظیمات پس زمینه ردیف
                </h4>
                <DynamicRangeInput
                  label="انحنا"
                  name="rowRadius"
                  min="0"
                  max="100"
                  value={userInputData?.setting?.rowRadius || "20"}
                  onChange={handleSettingChange}
                />{" "}
                <ColorInput
                  label="رنگ پس زمینه"
                  name="backgroundColorBox"
                  value={
                    userInputData?.setting?.backgroundColorBox ?? "#2b2d42"
                  }
                  onChange={handleSettingChange}
                />
              </div>
              {/* background */}
              <div>
                <h4 className="font-semibold my-2 text-sky-700">
                  تنظیمات پس زمینه{" "}
                </h4>
                <DynamicRangeInput
                  label="انحنا"
                  name="formRadius"
                  min="0"
                  max="100"
                  value={userInputData?.setting?.formRadius || "20"}
                  onChange={handleSettingChange}
                />{" "}
                <ColorInput
                  label="رنگ پس زمینه"
                  name="backgroundColorMultiRow"
                  value={
                    userInputData?.setting?.backgroundColorMultiRow ?? "#8d99ae"
                  }
                  onChange={handleSettingChange}
                />
              </div>
              {/* button */}
              <div>
                <h4 className="font-semibold my-2 text-sky-700">
                  تنظیمات دکمه{" "}
                </h4>
                <DynamicRangeInput
                  label="عرض"
                  name="btnWidth"
                  min="0"
                  max="900"
                  value={userInputData?.setting?.btnWidth || "20"}
                  onChange={handleSettingChange}
                />{" "}
                <DynamicRangeInput
                  label="انحنا"
                  name="btnRadius"
                  min="0"
                  max="30"
                  value={userInputData?.setting?.btnRadius || "5"}
                  onChange={handleSettingChange}
                />{" "}
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
              </div>
              {/* Image */}
              <div>
                <h4 className="font-semibold my-2 text-sky-700">
                  تنظیمات تصویر
                </h4>
                <DynamicRangeInput
                  label="عرض"
                  name="imageWidth"
                  min="0"
                  max="2000"
                  value={userInputData?.setting?.imageWidth || "5"}
                  onChange={handleSettingChange}
                />{" "}
                <DynamicRangeInput
                  label="ارتفاع"
                  name="imageHeight"
                  min="0"
                  max="2000"
                  value={userInputData?.setting?.imageHeight || "5"}
                  onChange={handleSettingChange}
                />{" "}
                <DynamicRangeInput
                  label="انحنا"
                  name="imageRadius"
                  min="0"
                  max="200"
                  value={userInputData?.setting?.imageRadius || "5"}
                  onChange={handleSettingChange}
                />{" "}
                <DynamicSelectInput
                  label="وزن"
                  name="imageAlign"
                  value={userInputData?.setting?.imageAlign ?? "row"}
                  options={[
                    { value: "row", label: "ردیف" },
                    { value: "row-reverse", label: "ردیف معکوس" },
                  ]}
                  onChange={handleSettingChange}
                />
              </div>

              {/* ✅ New Shadow Settings */}
              <div className="rounded-lg">
                <h4 className="font-bold text-sky-700 my-3">تنظیمات سایه</h4>
                <DynamicRangeInput
                  label="افست افقی سایه"
                  name="shadowOffsetX"
                  min="-50"
                  max="50"
                  value={
                    userInputData?.setting?.shadowOffsetX?.toString() ?? "0"
                  }
                  onChange={handleSettingChange}
                />
                <DynamicRangeInput
                  label="افست عمودی سایه"
                  name="shadowOffsetY"
                  min="-50"
                  max="50"
                  value={
                    userInputData?.setting?.shadowOffsetY?.toString() ?? "0"
                  }
                  onChange={handleSettingChange}
                />
                <DynamicRangeInput
                  label="میزان بلور سایه"
                  name="shadowBlur"
                  min="0"
                  max="100"
                  value={userInputData?.setting?.shadowBlur?.toString() ?? "0"}
                  onChange={handleSettingChange}
                />
                <DynamicRangeInput
                  label="میزان گسترش سایه"
                  name="shadowSpread"
                  min="-20"
                  max="20"
                  value={
                    userInputData?.setting?.shadowSpread?.toString() ?? "0"
                  }
                  onChange={handleSettingChange}
                />
                <ColorInput
                  label="رنگ سایه"
                  name="shadowColor"
                  value={userInputData?.setting?.shadowColor?.toString() ?? "0"}
                  onChange={handleSettingChange}
                />
              </div>
            </div>
          </>
        )}

        {isAnimationOpen && (
          <div className="space-y-4 animate-slideDown">
            {" "}
            <div className="rounded-lg flex flex-col gap-3 border-t pt-4 mt-6">
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
                    onChange={(e) =>
                      handleImageAnimationToggle(e.target.checked)
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-[42px] h-5 rounded-full transition-colors duration-200 ${
                      hasImageAnimation ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 mt-0.5 ${
                        hasImageAnimation
                          ? "-translate-x-6"
                          : "-translate-x-0.5"
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
            {/* Button Animation Settings */}
            <div className="rounded-lg flex flex-col gap-3 border-t pt-4 mt-6">
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
                        hasButtonAnimation
                          ? "-translate-x-6"
                          : "-translate-x-0.5"
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
                          فعلی:{" "}
                          {currentButtonAnimation.animation?.delay || "0s"}
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
          </div>
        )}

        {/* Spacing Settings */}
        {isSpacingOpen && (
          <div className="animate-slideDown">
            <div className="rounded-lg flex items-center justify-center">
              <MarginPaddingEditor
                margin={margin}
                padding={padding}
                onChange={handleUpdate}
              />
            </div>
          </div>
        )}

        <ImageSelectorModal
          isOpen={isImageSelectorOpen}
          onClose={() => setIsImageSelectorOpen(false)}
          onSelectImage={(image) => {
            setUserInputData((prev: MultiRowSection) => ({
              ...prev,
              blocks: {
                ...prev.blocks,
                [currentEditingIndex]: {
                  ...prev.blocks[currentEditingIndex],
                  imageSrc: image.url,
                },
              },
            }));
            setIsImageSelectorOpen(false);
          }}
        />
      </div>
    </>
  );
};
