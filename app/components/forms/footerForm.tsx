import { use, useEffect } from "react";
import { Compiler } from "../compiler";
import { Layout, FooterSection } from "@/lib/types";

interface FooterFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<FooterSection>>;
  userInputData: FooterSection;
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
        ...prev.blocks,
        [name]: value,
      },
      // type: "Footer",
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
    <div className="p-6 max-w-4xl mx-auto" dir="rtl">
      <h2 className="text-xl font-bold mb-4">تنظیمات فوتر</h2>

      {/* Content Section */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">محتوا</h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">متن</label>
            <input
              type="text"
              name="text"
              value={userInputData?.blocks?.text}
              onChange={handleBlockChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">توضیحات</label>
            <textarea
              name="description"
              value={userInputData?.blocks?.description ?? "توضیحات فوتر"}
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
              value={userInputData?.blocks?.instagramLink ?? "لینک اینستاگرام"}
              onChange={handleBlockChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">لینک تلگرام</label>
            <input
              type="text"
              name="telegramLink"
              value={userInputData?.blocks?.telegramLink ?? "لینک پیام رسان"}
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
      </div>

      {/* Style Settings */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">تنظیمات استایل</h3>
        <div className="grid md:grid-cols-1 gap-4">
          <ColorInput
            label="رنگ پس زمینه"
            name="backgroundColor"
            value={userInputData?.setting?.backgroundColor ?? "#fffffff"}
            onChange={handleSettingChange}
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
          <div>
            <label className="block mb-1">وزن متن سربرگ</label>
            <select
              name="textFontWeight"
              value={userInputData?.blocks?.setting?.textFontWeight ?? "400"}
              onChange={handleBlockSettingChange}
              className="w-full p-2 border rounded"
            >
              <option value="bold">ضخیم</option>
              <option value="normal">نرمال</option>
            </select>
          </div>
          <ColorInput
            label="رنگ متن"
            name="textColor"
            value={userInputData?.blocks?.setting?.textColor ?? "#ffffff"}
            onChange={handleBlockSettingChange}
          />
          <label>سایز توضیحات</label>
          <input
            type="range"
            name="descriptionFontSize"
            min="12"
            max="48"
            step="1"
            value={userInputData?.blocks?.setting?.descriptionFontSize ?? "16"}
            onChange={handleBlockSettingChange}
          />
          <div>
            <label className="block mb-1">وزن متن سربرگ</label>
            <select
              name="descriptionFontWeight"
              value={
                userInputData?.blocks?.setting?.descriptionFontWeight ?? "400"
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
       
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block mb-1">عرض لوگو</label>
            <input
              type="number"
              name="logoWidth"
              value={userInputData?.blocks?.setting?.logoWidth ?? "100"}
              onChange={handleBlockSettingChange}
              className="w-full p-2 border rounded"
            />
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
          </div>
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
              value={userInputData?.setting?.paddingTop ?? "20"}
              onChange={handleSettingChange}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-1">فاصله درونی از پایین</label>
            <input
              type="range"
              name="paddingBottom"
              value={userInputData?.setting?.paddingBottom ?? "20"}
              onChange={handleSettingChange}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-1">فاصله بیرونی از بالا</label>
            <input
              type="range"
              name="marginTop"
              value={userInputData?.setting?.marginTop ?? "10"}
              onChange={handleSettingChange}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-1">فاصله بیرونی از پایین</label>
            <input
              type="range"
              name="marginBottom"
              value={userInputData?.setting?.marginBottom ?? "0"}
              onChange={handleSettingChange}
              className="w-full"
            />
          </div>
        </div>
      </div>
      {/* Footer Links Section */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">لینک‌های فوتر</h3>
        <div className="space-y-4">
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
                      links: prev.blocks.links?.filter((_, i) => i !== index),
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
                  links: [...(prev.blocks.links || []), { label: "", url: "" }],
                },
              }));
            }}
            className="w-full p-2 bg-green-500 text-white rounded hover:bg-blue-600"
          >
            افزودن لینک جدید
          </button>
        </div>
      </div>
    </div>
  );
};
