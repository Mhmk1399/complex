import { useEffect } from "react";
import { Compiler } from "../compiler";
import { Layout, MultiColumnBlock, MultiColumnSection } from "@/lib/types";

interface MultiColumnFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<MultiColumnSection>>;
  userInputData: MultiColumnSection;
  layout: Layout;
  selectedComponent: string;
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

export const MultiColumnForm: React.FC<MultiColumnFormProps> = ({
  setUserInputData,
  userInputData,
  layout,
  selectedComponent,
}) => {
  useEffect(() => {
    const initialData = Compiler(layout, selectedComponent)[0];
    setUserInputData(initialData);
  }, []);
  useEffect(() => {
    const initialData = Compiler(layout, selectedComponent)[0];
    setUserInputData(initialData);
  }, [selectedComponent]);
  const handleBlockChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    columnNum: number
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev: MultiColumnSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [columnNum - 1]: {
          ...prev.blocks[columnNum - 1],
          [`${name}${columnNum}`]: value,
        },
      },
    }));
  };

  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev: MultiColumnSection) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value,
      },
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto" dir="rtl">
      <h2 className="text-xl font-bold mb-4">تنظیمات ستون ها</h2>
      {/* Main Heading Settings */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">سربرگ</h3>
        <input
          type="text"
          name="heading"
          value={userInputData?.setting?.heading?.toLocaleString() ?? ""}
          onChange={handleSettingChange}
          className="w-full p-2 border rounded"
          placeholder="Main Heading"
        />
      </div>
      {/* Column Content */}
      {[1, 2, 3].map((columnNum) => (
        <div key={columnNum} className="mb-6 p-4 border rounded">
          <h3 className="font-semibold mb-2">ستون {columnNum}</h3>
          <div className="space-y-4">
            <div>
              <label className="block mb-1">عنوان</label>
              <input
                type="text"
                name="title"
                value={
                  userInputData?.blocks?.[columnNum - 1]?.[
                    `title${columnNum}` as keyof MultiColumnBlock
                  ] || ""
                }
                onChange={(e) => handleBlockChange(e, columnNum)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1">محنوا</label>
              <textarea
                name="description"
                value={
                  userInputData?.blocks?.[columnNum - 1]?.[
                    `description${columnNum}` as keyof MultiColumnBlock
                  ] || ""
                }
                onChange={(e) => handleBlockChange(e, columnNum)}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>

            <div>
              <label className="block mb-1">تصویر</label>
              <input
                type="text"
                name="imageSrc"
                value={
                  userInputData?.blocks?.[columnNum - 1]?.[
                    `imageSrc${columnNum}` as keyof MultiColumnBlock
                  ] || ""
                }
                onChange={(e) => handleBlockChange(e, columnNum)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1">متن دکمه</label>
              <input
                type="text"
                name="btnLable"
                value={
                  userInputData?.blocks?.[columnNum - 1]?.[
                    `btnLable${columnNum}` as keyof MultiColumnBlock
                  ] || ""
                }
                onChange={(e) => handleBlockChange(e, columnNum)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1">لینک دکمه</label>
              <input
                type="text"
                name="btnLink"
                value={
                  userInputData?.blocks?.[columnNum - 1]?.[
                    `btnLink${columnNum}` as keyof MultiColumnBlock
                  ] || ""
                }
                onChange={(e) => handleBlockChange(e, columnNum)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
      ))}{" "}
      {/* Style Settings */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">تنظیمات استایل</h3>
        <div className="grid md:grid-cols-1 gap-4">
          <ColorInput
            label="رنگ سربرگ"
            name="headingColor"
            value={userInputData?.setting?.headingColor ?? "#ffffff"}
            onChange={handleSettingChange}
          />
          <ColorInput
            label="رنگ عنوان"
            name="titleColor"
            value={
              userInputData?.setting?.titleColor?.toLocaleString() ?? "#ffa62b"
            }
            onChange={handleSettingChange}
          />
          <ColorInput
            label="رنگ محتوا"
            name="descriptionColor"
            value={
              userInputData?.setting?.descriptionColor?.toLocaleString() ??
              "#e4e4e4"
            }
            onChange={handleSettingChange}
          />
          <ColorInput
            label="رنگ پس زمینه"
            name="backgroundColorBox"
            value={
              userInputData?.setting?.backgroundColorBox?.toLocaleString() ??
              "#82c0cc"
            }
            onChange={handleSettingChange}
          />
          <ColorInput
            label="رنگ متن دکمه"
            name="btnColor"
            value={
              userInputData?.setting?.btnColor?.toLocaleString() ?? "#ffffff"
            }
            onChange={handleSettingChange}
          />
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

        {/* Image Settings */}
        <div className="mt-4 gap-4">
          <div className="cols-span-2">
            <label className="block mb-1">انحنای زوایا (px)</label>
            <input
              type="range"
              name="imageRadious"
              value={
                userInputData?.setting?.imageRadious?.replace("px", "") ?? "10"
              }
              onChange={handleSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      {/* Spacing Settings */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">تنظیمات فاصله</h3>
        <div className="grid grid-cols-1 gap-4">
          {(
            [
              "paddingTop",
              "paddingBottom",
              "marginTop",
              "marginBottom",
            ] as const
          ).map((spacing, index) => (
            <div key={index}>
              <label className="block mb-1"> {spacingLable[index].label}</label>
              <input
                type="range"
                name={spacing}
                min="0"
                max="100"
                value={parseInt(userInputData?.setting?.[spacing] ?? "0")}
                onChange={handleSettingChange}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
