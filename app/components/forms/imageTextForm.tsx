import { useEffect, useState } from "react";
import { Compiler } from "../compiler";
import { Layout, ImageTextSection } from "@/lib/types";
import MarginPaddingEditor from "../sections/editor";
import React from "react";
import { TabButtons } from "../tabButtons";
interface ImageTextFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<ImageTextSection>>;
  userInputData: ImageTextSection;
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

export const ImageTextForm: React.FC<ImageTextFormProps> = ({
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

  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = (
    type: "margin" | "padding",
    updatedValues: BoxValues
  ) => {
    if (type === "margin") {
      setMargin(updatedValues);
      setUserInputData((prev: ImageTextSection) => ({
        ...prev,
        setting: {
          ...prev.setting,
          marginTop: updatedValues.top.toString(),
          marginBottom: updatedValues.bottom.toString(),
        },
      }));
    } else {
      setPadding(updatedValues);
      setUserInputData((prev: ImageTextSection) => ({
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
  // Default values
  const defaultValues = {
    blocks: {
      imageSrc: "",
      imageAlt: "",
      heading: "",
      description: "",
      btnLink: "",
      btnText: "",
      setting: {
        headingColor: "#333333",
        headingFontSize: "50",
        headingFontWeight: "bold",
        descriptionColor: "#333333",
        descriptionFontSize: "20",
        descriptionFontWeight: "normal",
        btnTextColor: "#ffffff",
        btnBackgroundColor: "#000000",
        backgroundColorBox: "",
        backgroundBoxOpacity: "0.9",
        boxRadiuos: "20",
        opacityImage: "1",
        imageWidth: "850",
        imageHeight: "700",
      },
    },
    setting: {
      paddingTop: "20",
      paddingBottom: "20",
      marginTop: "10",
      marginBottom: "0",
    },
  };

  useEffect(() => {
    const initialData = {
      ...defaultValues,
      ...Compiler(layout, selectedComponent),
    };
    setUserInputData(initialData[0]);
  },);
  useEffect(() => {
    const initialData = {
      ...defaultValues,
      ...Compiler(layout, selectedComponent),
    };
    setUserInputData(initialData[0]);
  }, [ selectedComponent ]);

  const handleBlockChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev: ImageTextSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [name]: value,
      },
    }));
  };

  const handleBlockSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (isUpdating) return;
    setIsUpdating(true);
    const { name, value } = e.target;
    setUserInputData((prev: ImageTextSection) => ({
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

  const handleTabChange = (tab: "content" | "style" | "spacing") => {
    setIsContentOpen(tab === "content");
    setIsStyleSettingsOpen(tab === "style");
    setIsSpacingOpen(tab === "spacing");
  };
  useEffect(() => {
    setIsContentOpen(true);
  }, []);

  return (
    <div className="p-3 max-w-4xl space-y-2 rounded" dir="rtl">
      <h2 className="text-lg font-bold mb-4">تنظیمات عکس متن</h2>

      {/* Tabs */}
      <TabButtons onTabChange={handleTabChange} />

      {/* Content Section */}
      {isContentOpen && (
        <div className="p-4space-y-4 animate-slideDown">
          <div className=" rounded-lg">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              تصویر
            </label>
            <input
              type="text"
              name="imageSrc"
              value={userInputData?.blocks?.imageSrc ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className=" rounded-lg">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              متن جایگزین تصویر
            </label>
            <input
              type="text"
              name="imageAlt"
              value={userInputData?.blocks?.imageAlt ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className=" rounded-lg">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              سربرگ
            </label>
            <input
              type="text"
              name="heading"
              value={userInputData?.blocks?.heading ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className=" rounded-lg">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              توضیحات
            </label>
            <textarea
              name="description"
              value={userInputData?.blocks?.description ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              rows={4}
            />
          </div>

          <div className=" rounded-lg">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              لینک دکمه
            </label>
            <input
              type="text"
              name="btnLink"
              value={userInputData?.blocks?.btnLink ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="rounded-lg">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              متن دکمه
            </label>
            <input
              type="text"
              name="btnText"
              value={userInputData?.blocks?.btnText ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      )}

      {/* Style Settings */}

      {isStyleSettingsOpen && (
        <div className="p-4 border-t border-gray-100 space-y-6 animate-slideDown">
          {/* Heading Settings */}
          <div className="space-y-4">
            <div className="rounded-lg flex flex-col gap-3">
              <h4 className="font-bold text-sky-700">تنظیمات سربرگ</h4>
              <div>
                <ColorInput
                  label="رنگ سربرگ"
                  name="headingColor"
                  value={
                    userInputData?.blocks?.setting?.headingColor?.toString() ??
                    "#333333"
                  }
                  onChange={handleBlockSettingChange}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-bold text-gray-700">
                  سایز سربرگ
                </label>
                <input
                  type="range"
                  name="headingFontSize"
                  value={
                    userInputData?.blocks?.setting?.headingFontSize?.toLocaleString() ??
                    "50"
                  }
                  onChange={handleBlockSettingChange}
                  className="w-full p-2 border rounded"
                />
                <span className="text-sm text-gray-500">
                  {userInputData?.blocks?.setting?.headingFontSize}px
                </span>
              </div>

              <div>
                <label className="block mb-2 text-sm font-bold text-gray-700">
                  وزن سربرگ
                </label>
                <select
                  name="headingFontWeight"
                  value={
                    userInputData?.blocks?.setting?.headingFontWeight?.toString() ??
                    "0"
                  }
                  onChange={handleBlockSettingChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="bold">ضخیم</option>
                  <option value="normal">نرمال</option>
                </select>
              </div>
            </div>
          </div>
          {/* Description Settings */}
          <div className="space-y-4">
            <div className="rounded-lg flex flex-col gap-3">
              <h4 className="font-bold text-sky-700">تنظیمات توضیحات</h4>
              <div>
                <ColorInput
                  label="رنگ توضیحات"
                  name="descriptionColor"
                  value={
                    userInputData?.blocks?.setting?.descriptionColor?.toString() ??
                    "#333333"
                  }
                  onChange={handleBlockSettingChange}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-bold text-gray-700">
                  سایز توضیحات
                </label>
                <input
                  type="range"
                  name="descriptionFontSize"
                  value={
                    userInputData?.blocks?.setting?.descriptionFontSize?.toLocaleString() ??
                    "20"
                  }
                  onChange={handleBlockSettingChange}
                  className="w-full p-2 border rounded"
                />
                <span className="text-sm text-gray-500">
                  {userInputData?.blocks?.setting?.descriptionFontSize}px
                </span>
              </div>

              <div>
                <label className="block mb-2 text-sm font-bold text-gray-700">
                  وزن توضیحات
                </label>
                <select
                  name="descriptionFontWeight"
                  value={
                    userInputData?.blocks?.setting?.descriptionFontWeight?.toString() ??
                    "0"
                  }
                  onChange={handleBlockSettingChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="bold">ضخیم</option>
                  <option value="normal">نرمال</option>
                </select>
              </div>
            </div>
          </div>
          {/* Button Settings */}
          <div className="space-y-4">
            <div className="rounded-lg flex flex-col gap-3">
              <h4 className="font-bold text-sky-700">تنظیمات دکمه</h4>
              <div>
                <ColorInput
                  label="رنگ دکمه"
                  name="btnTextColor"
                  value={
                    userInputData?.blocks?.setting?.btnTextColor?.toString() ??
                    "#333333"
                  }
                  onChange={handleBlockSettingChange}
                />
              </div>

              <div>
                <ColorInput
                  label="رنگ پس زمینه دکمه"
                  name="btnBackgroundColor"
                  value={
                    userInputData?.blocks?.setting?.btnBackgroundColor?.toString() ??
                    "#333333"
                  }
                  onChange={handleBlockSettingChange}
                />
              </div>
            </div>
          </div>
          {/* Background Settings */}
          <div className="rounded-lg flex flex-col gap-3">
            <h4 className="font-bold text-sky-700">تنظیمات رنگ پس زمینه</h4>
            <ColorInput
              label="رنگ پس زمینه"
              name="background"
              value={
                userInputData?.blocks?.setting?.background?.toString() ??
                "#333333"
              }
              onChange={handleBlockSettingChange}
            />
          </div>

          <div className="rounded-lg flex flex-col gap-3">
            <h4 className="font-bold text-sky-700">تنظیمات کارت و تصویر</h4>
            <label className="block mb-1"> انحنای زوایای کارت </label>{" "}
            <input
              type="range"
              name="boxRadiuos"
              max={100}
              min={0}
              value={
                userInputData?.blocks?.setting?.boxRadiuos?.toLocaleString() ??
                "10"
              }
              onChange={handleBlockSettingChange}
              className=" p-1 border w-full rounded"
            />
            <span className="text-sm">
              {userInputData?.blocks?.setting?.boxRadiuos}px
            </span>{" "}
            <label className="block mb-1">عرض تصویر </label>{" "}
            <input
              type="range"
              name="imageWidth"
              value={
                userInputData?.blocks?.setting?.imageWidth?.toLocaleString() ??
                "300"
              }
              onChange={handleBlockSettingChange}
              className=" p-1 border w-full rounded"
            />{" "}
            <span className="text-sm">
              {" "}
              {userInputData?.blocks?.setting?.imageWidth}px{" "}
            </span>{" "}
            <label className="block mb-1">ارتفاع تصویر</label>{" "}
            <input
              type="range"
              name="imageHeight"
              value={
                userInputData?.blocks?.setting?.imageHeight?.toLocaleString() ??
                "300"
              }
              onChange={handleBlockSettingChange}
              className="w-full p-2 border rounded"
            />{" "}
            <span className="text-sm">
              {" "}
              {userInputData?.blocks?.setting?.imageHeight}px{" "}
            </span>{" "}
            <label className="block mb-1">شفافیت تصویر</label>{" "}
            <select
              name="opacityImage"
              value={
                userInputData?.blocks?.setting?.opacityImage?.toLocaleString() ??
                "1"
              }
              onChange={handleBlockSettingChange}
              className="w-full p-2 border rounded"
            >
              {" "}
              {Array.from({ length: 11 }, (_, i) => i / 10).map((value) => (
                <option key={value} value={value}>
                  {" "}
                  {value}{" "}
                </option>
              ))}{" "}
            </select>{" "}
          </div>
        </div>
      )}

      {isSpacingOpen && (
        <div className="p-4 border-t border-gray-100 animate-slideDown">
          <div className=" rounded-lg p-2 flex items-center justify-center">
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
