import React, { useEffect } from "react";
import { Compiler } from "../compiler";
import { FooterFormProps, FooterSection, FooterLink } from "@/lib/types";

export const FooterForm: React.FC<FooterFormProps> = ({
  setUserInputData,
  userInputData,
  layout,
  selectedComponent,
}) => {
  useEffect(() => {
    const initialData = Compiler(layout, "sectionFooter");
    setUserInputData(initialData);
    console.log(initialData);
  }, []);

  const handleBlockChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev: FooterSection) => ({
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
    const { name, value } = e.target;
    setUserInputData((prev: FooterSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        setting: {
          ...prev.blocks.setting,
          [name]: value.includes("px") ? value : `${value}px`,
        },
      },
    }));
  };

  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInputData((prev: FooterSection) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value.includes("px") ? value : `${value}px`,
      },
    }));
  };

  const handleAddLink = () => {
    setUserInputData((prev: FooterSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        links: [...(prev.blocks.links || []), { url: "", label: "" }],
      },
    }));
  };

  const handleLinkChange = (
    index: number,
    field: "url" | "label",
    value: string
  ) => {
    setUserInputData((prev: FooterSection) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        links: prev.blocks.links
          ? prev.blocks.links.map((link, i) =>
              i === index ? { ...link, [field]: value } : link
            )
          : [],
      },
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto" dir="rtl">
      <h2 className="text-xl font-bold mb-4">تنظیمات قسمت پایین سایت</h2>

      {/* Content Section */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">محتوا</h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">سربرگ</label>
            <input
              type="text"
              name="text"
              value={userInputData?.blocks?.text || ""}
              onChange={handleBlockChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">توضیحات</label>
            <textarea
              name="description"
              value={userInputData?.blocks?.description || ""}
              onChange={handleBlockChange}
              className="w-full p-2 border rounded"
              rows={4}
            />
          </div>

          <div>
            <label className="block mb-1">لوگو</label>
            <input
              type="text"
              name="logo"
              value={userInputData?.blocks?.logo || ""}
              onChange={handleBlockChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">لینک شبکه های اجتماعی</h3>
        <div className="space-y-4">
          {["instagramLink", "telegramLink", "whatsappLink"].map((social) => (
            <div key={social}>
              <label className="block mb-1">
                {social.replace("Link", "").toUpperCase()}
              </label>
              <input
                type="text"
                name={social}
                value={
                  (userInputData?.blocks?.[
                    social as keyof typeof userInputData.blocks
                  ] as string) || ""
                }
                onChange={handleBlockChange}
                className="w-full p-2 border rounded"
              />
            </div>
          ))}{" "}
        </div>
      </div>

      {/* Footer Links */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">لینک های قسمت پایین سایت</h3>
        <button
          onClick={handleAddLink}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          افزودن لینک
        </button>
        <div className="space-y-4">
          {userInputData?.blocks?.links?.map(
            (link: FooterLink, index: number) => (
              <div key={index} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="آدرس"
                  value={link.url}
                  onChange={(e) =>
                    handleLinkChange(index, "url", e.target.value)
                  }
                  className="flex-1 p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="متن"
                  value={link.label}
                  onChange={(e) =>
                    handleLinkChange(index, "label", e.target.value)
                  }
                  className="flex-1 p-2 border rounded"
                />
              </div>
            )
          )}
        </div>
      </div>

      {/* Style Settings */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">تنظیمات استایل</h3>
        <div className="grid grid-cols-1 gap-4">
          {[
            { name: "textColor", label: "رنگ عنوان", type: "color" },
            { name: "descriptionColor", label: "رنگ توضیحات", type: "color" },
            { name: "linkColor", label: "رنگ لینک ها", type: "color" },
            { name: "backgroundColor", label: "رنگ پس زمینه", type: "color" },
            { name: "textFontSize", label: "سایز عنوان", type: "range" },
            {
              name: "descriptionFontSize",
              label: "سایز توضیحات",
              type: "range",
            },
            { name: "logoWidth", label: "عرض لوگو", type: "range" },
            { name: "logoHeight", label: "ارتفاع لوگو", type: "range" },
            { name: "logoRadius", label: "انحنای زوایای لوگو", type: "range" },
          ].map((setting) => (
            <div key={setting.name}>
              <label className="block mb-1">{setting.label}</label>
              <input
                type={setting.type}
                name={setting.name}
                value={
                  userInputData?.blocks?.setting?.[
                    setting.name as keyof typeof userInputData.blocks.setting
                  ] || ""
                }
                onChange={handleBlockSettingChange}
                className="w-full p-2 border rounded"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Layout Settings */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">تنظیمات فاصله</h3>
        <div className="grid grid-cols-1 gap-4">
          {[
            { name: "paddingTop", label: "فاصله درونی از  بالا" },
            { name: "paddingBottom", label: "فاصله درونی از پایین" },
            { name: "marginTop", label: "فاصله بیرونی از بالا" },
            { name: "marginBottom", label: "فاصله بیرونی از پایین" },
          ].map((setting) => (
            <div key={setting.name}>
              <label className="block mb-1">{setting.label}</label>
              <input
                type="range"
                name={setting.name}
                value={parseInt(
                  String(
                    userInputData?.setting?.[
                      setting.name as keyof typeof userInputData.setting
                    ]
                  ) || "0"
                )}
                onChange={handleSettingChange}
                className="w-full"
                min="0"
                max="100"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
