import { useEffect } from "react";
import { Compiler } from "../compiler";
import { Layout, ImageTextSection } from "@/lib/types";
interface ImageTextFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<ImageTextSection>>;
  userInputData: ImageTextSection;
  layout: Layout;
  selectedComponent: string;
}

export const ImageTextForm: React.FC<ImageTextFormProps> = ({
  setUserInputData,
  userInputData,
  layout,
  selectedComponent,
}) => {
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
  }, []);

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

  const handleBlockSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInputData((prev: ImageTextSection) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value,
      },
    }));
  };

  return (
    <div className="p-2 max-w-4xl mx-auto" dir="rtl">
      <hr />
      <h2 className="text-xl font-bold mb-4">تنظیمات عکس متن</h2>

      {/* Content Section */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">محتوا</h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">تصویر</label>
            <input
              type="text"
              name="imageSrc"
              value={userInputData?.blocks?.imageSrc ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">متن جایگزین تصویر</label>
            <input
              type="text"
              name="imageAlt"
              value={userInputData?.blocks?.imageAlt ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">سربرگ</label>
            <input
              type="text"
              name="heading"
              value={userInputData?.blocks?.heading ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">توضیحات</label>
            <textarea
              name="description"
              value={userInputData?.blocks?.description ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border rounded"
              rows={4}
            />
          </div>

          <div>
            <label className="block mb-1">لینک دکمه</label>
            <input
              type="text"
              name="btnLink"
              value={userInputData?.blocks?.btnLink ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">متن دکمه</label>
            <input
              type="text"
              name="btnText"
              value={userInputData?.blocks?.btnText ?? ""}
              onChange={handleBlockChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      <hr />

      {/* Style Settings */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">تنظیمات استایل</h3>
        <div className=" gap-4">
          <div>
            <label className="block mb-1">رنگ پس زمینه</label>
            <input
              type="color"
              name="background"
              value={
                userInputData?.blocks?.setting?.background?.toLocaleString() ??
                "#333"
              }
              onChange={handleBlockSettingChange}
              className=" p-1 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">رنگ سربرگ</label>
            <input
              type="color"
              name="headingColor"
              value={
                userInputData?.blocks?.setting?.headingColor?.toLocaleString() ??
                "#333"
              }
              onChange={handleBlockSettingChange}
              className=" p-1 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">سایز سربرگ</label>
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
          </div>

          <div>
            <label className="block mb-1">رنگ توضیحات</label>
            <input
              type="color"
              name="descriptionColor"
              value={
                userInputData?.blocks?.setting?.descriptionColor?.toLocaleString() ??
                "#333333"
              }
              onChange={handleBlockSettingChange}
              className=" p-1 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">سایز توضیحات</label>
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
          </div>

          <div>
            <label className="block mb-1">رنگ متن دکمه</label>
            <input
              type="color"
              name="btnTextColor"
              value={
                userInputData?.blocks?.setting?.btnTextColor?.toLocaleString() ??
                "#ffffff"
              }
              onChange={handleBlockSettingChange}
              className=" p-1 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">رنگ پس زمینه دکمه</label>
            <input
              type="color"
              name="btnBackgroundColor"
              value={
                userInputData?.blocks?.setting?.btnBackgroundColor?.toLocaleString() ??
                "#000000"
              }
              onChange={handleBlockSettingChange}
              className="p-1 border rounded"
            />
          </div>
        </div>
      </div>
      <hr />

      {/* Layout Settings */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">تنظیمات فاصله</h3>
        <div className=" gap-4">
          <div>
            <label className="block mb-1">فاصله درونی از بالا</label>
            <input
              type="range"
              name="paddingTop"
              value={userInputData?.setting?.paddingTop ?? "20"}
              onChange={handleSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">فاصله درونی از پایین </label>
            <input
              type="range"
              name="paddingBottom"
              value={userInputData?.setting?.paddingBottom ?? "20"}
              onChange={handleSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">فاصله بیرونی از بالا</label>
            <input
              type="range"
              name="marginTop"
              value={userInputData?.setting?.marginTop ?? "10"}
              onChange={handleSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">فاصله بیرونی از پایین</label>
            <input
              type="range"
              name="marginBottom"
              value={userInputData?.setting?.marginBottom ?? "0"}
              onChange={handleSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
