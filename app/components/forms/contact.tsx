import { useEffect } from "react";
import { Compiler } from "../compiler";
import { ContactFormDataSection, Layout } from "@/lib/types";

interface ContactFormProps {
  setUserInputData: React.Dispatch<
    React.SetStateAction<ContactFormDataSection>
  >;
  userInputData: ContactFormDataSection;
  layout: Layout;
}
const spacingLable = [
  {
    label: "قاصله درونی از بالا",
  },
  {
    label: "فاصله درونی از پایین",
  },
  {
    label: "فاصله بیرونی از بالا",
  },
  {
    label: "فاصله بیرونی از پایین",
  },
];

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

export const ContactForm: React.FC<ContactFormProps> = ({
  setUserInputData,
  userInputData,
  layout,
}) => {
  useEffect(() => {
    const initialData = Compiler(layout, "contact-form")[0];
    setUserInputData(initialData);
  }, []);

  const handleBlockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInputData((prev: ContactFormDataSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [name]: value,
      },
    }));
  };

  const handleBlockSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInputData((prev: ContactFormDataSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        setting: {
          ...prev?.blocks?.setting,
          [name]: value,
        },
      },
    }));
  };

  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInputData((prev: ContactFormDataSection) => ({
      ...prev,
      setting: {
        ...prev?.setting,
        [name]: value.includes("px") ? value : `${value}px`,
      },
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto" dir="rtl">
      <h2 className="text-xl font-bold mb-4">تنظیمات فرم ارتباط با ما</h2>

      {/* Content Section */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">محتوا</h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">سربرگ فرم</label>
            <input
              type="text"
              name="heading"
              value={userInputData?.blocks?.heading?.toString() ?? ""}
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
            name="headingColor"
            value={
              userInputData?.blocks?.setting?.headingColor?.toLocaleString() ??
              "#ffffff"
            }
            onChange={handleBlockSettingChange}
          />
          <ColorInput
            label="رنگ پس زمینه دکمه"
            name="btnBackgroundColor"
            value={
              userInputData?.blocks?.setting?.btnBackgroundColor?.toLocaleString() ??
              "#9c119c"
            }
            onChange={handleBlockSettingChange}
          />
          <ColorInput
            label="رنگ متن دکمه"
            name="btnTextColor"
            value={
              userInputData?.blocks?.setting?.btnTextColor?.toLocaleString() ??
              "#ffffff"
            }
            onChange={handleBlockSettingChange}
          />
          <ColorInput
            label="رنگ پس زمینه فرم"
            name="formBackground"
            value={
              userInputData?.blocks?.setting?.formBackground?.toLocaleString() ??
              "#11769c"
            }
            onChange={handleBlockSettingChange}
          />
        </div>

        <div className="mt-4  gap-4">
          <div>
            <label className="block mb-1">سایز سربرگ</label>
            <input
              type="range"
              name="headingFontSize"
              value={
                userInputData?.blocks?.setting?.headingFontSize?.toLocaleString() ??
                "25px"
              }
              onChange={handleBlockSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">وزن سربرگ</label>
            <select
              name="headingFontWeight"
              value={
                userInputData?.blocks?.setting?.headingFontWeight?.toLocaleString() ??
                "bold"
              }
              onChange={(e) =>
                handleBlockSettingChange(
                  e as unknown as React.ChangeEvent<HTMLInputElement>
                )
              }
              className="w-full p-2 border rounded"
            >
              <option value="normal">نرمال</option>
              <option value="bold">ضخیم</option>
              <option value="lighter">نازک</option>
            </select>
          </div>
        </div>
      </div>

      {/* Spacing Settings */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">تنظیمات فاصله</h3>
        <div className=" gap-4">
          {["paddingTop", "paddingBottom", "marginTop", "marginBottom"].map(
            (spacing, index) => (
              <div key={index}>
                <label className="block mb-1">
                  {spacingLable[index].label}
                </label>
                <input
                  type="range"
                  name={spacing}
                  min="0"
                  max="100"
                  value={parseInt(
                    userInputData?.setting?.[
                      spacing as keyof typeof userInputData.setting
                    ]?.toString() ?? "0"
                  )}
                  onChange={handleSettingChange}
                  className="w-full"
                />
                <span>
                  {userInputData?.setting?.[
                    spacing as keyof typeof userInputData.setting
                  ]?.toString() ?? "0px"}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
