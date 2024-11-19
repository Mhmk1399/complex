import { useEffect } from "react";
import { Compiler } from "../compiler";
import { Layout, RichTextSection } from "@/lib/types";


interface RichTextFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<RichTextSection>>;
  userInputData: RichTextSection;
  layout: Layout;
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

export const RichText: React.FC<RichTextFormProps> = ({
  setUserInputData,
  userInputData,
  layout,
}) => {
  useEffect(() => {
    const initialData = Compiler(layout, "rich-text");
    setUserInputData(initialData[0]);
  }, []);

  const handleBlockChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev: RichTextSection) => ({
      ...prev,
      blocks: {
        ...prev?.blocks,
        [name]: value,
      },
    }));
  };

  const handleBlockSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInputData((prev: RichTextSection) => ({
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

  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev: RichTextSection) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value,
      },
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto" dir="rtl">
      <h2 className="text-xl font-bold mb-4">تنظیمات باکس متن</h2>

      {/* Content Section */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">محتوا</h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">سربرگ</label>
            <input
              type="text"
              name="textHeading"
              value={userInputData?.blocks?.textHeading ?? ""}
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
              rows={3}
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
        </div>
      </div>

      {/* Style Settings */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">تنظیمات استایل</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <ColorInput
            label="رنگ سربرگ"
            name="textHeadingColor"
            value={
              userInputData?.blocks?.setting?.textHeadingColor?.toString() ??
              "#000000"
            }
            onChange={handleBlockSettingChange}
          />
          <ColorInput
            label="رنگ پس زمینه"
            name="background"
            value={
              userInputData?.blocks?.setting?.background?.toString() ??
              "#000000"
            }
            onChange={handleBlockSettingChange}
          />
          <ColorInput
            label="رنگ توضیحات"
            name="descriptionColor"
            value={
              userInputData?.blocks?.setting?.descriptionColor?.toString() ??
              "#000000"
            }
            onChange={handleBlockSettingChange}
          />

          <ColorInput
            label="رنگ متن دکمه"
            name="btnTextColor"
            value={
              userInputData?.blocks?.setting?.btnTextColor?.toString() ??
              "#ffffff"
            }
            onChange={handleBlockSettingChange}
          />

          <ColorInput
            label="رنگ پس زمینه دکمه"
            name="btnBackgroundColor"
            value={
              userInputData?.blocks?.setting?.btnBackgroundColor?.toString() ??
              "#000000"
            }
            onChange={handleBlockSettingChange}
          />
        </div>
      </div>

      {/* Spacing Settings */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">تنظیمات فاصله</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block mb-1">فاصله درونی از بالا</label>
            <input
              type="range"
              name="paddingTop"
              value={userInputData?.setting?.paddingTop?.toString() ?? "0"}
              onChange={handleSettingChange}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-1">فاصله درونی از پایین</label>
            <input
              type="range"
              name="paddingBottom"
              value={userInputData?.setting?.paddingBottom?.toString() ?? "0"}
              onChange={handleSettingChange}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-1">فاصله بیرونی از بالا</label>
            <input
              type="range"
              name="marginTop"
              value={userInputData?.setting?.marginTop?.toString() ?? "0"}
              onChange={handleSettingChange}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-1">فاصله بیرونی از پایین</label>
            <input
              type="range"
              name="marginBottom"
              value={userInputData?.setting?.marginBottom?.toString() ?? "0"}
              onChange={handleSettingChange}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
