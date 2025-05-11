"use client";
import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { CanvasEditorSection, CanvasElement } from "../sections/canvasEditor";
import { Layout } from "@/lib/types"

interface CanvasEditorFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<CanvasEditorSection>>;
  userInputData: CanvasEditorSection;
  layout: Layout;
  selectedComponent: string;
}

export const CanvasEditorForm: React.FC<CanvasEditorFormProps> = ({
  setUserInputData,
  userInputData,
  layout,
  selectedComponent,
}) => {
  const [activeTab, setActiveTab] = useState<"canvas" | "element">("canvas");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [elementType, setElementType] = useState<CanvasElement["type"]>("heading");

  // Check if we're editing a specific element
  useEffect(() => {
    if (selectedComponent.includes(":element:")) {
      const elementId = selectedComponent.split(":element:")[1];
      setSelectedElementId(elementId);
      setActiveTab("element");
    } else {
      setSelectedElementId(null);
      setActiveTab("canvas");
    }
  }, [selectedComponent]);

  // Get the section data from the layout
  const sectionData = layout?.sections?.children?.sections.find(
    (section) => section.type === selectedComponent.split(":element:")[0]
  ) as CanvasEditorSection;

  // Get the selected element if any
  const selectedElement = selectedElementId
    ? sectionData?.blocks?.elements?.find((el) => el.id === selectedElementId)
    : null;

  const initialDataLoaded = useRef(false);

  // Initialize form data only once
  useEffect(() => {
    if (sectionData && !initialDataLoaded.current) {
      setUserInputData(sectionData);
      initialDataLoaded.current = true;
    }
  }, [sectionData, setUserInputData]);

  // Reset the ref when the selected component changes
  useEffect(() => {
    initialDataLoaded.current = false;
  }, [selectedComponent]);

  // Handle canvas settings changes
  const handleCanvasSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev) => ({
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

  // Handle section settings changes
  const handleSectionSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserInputData((prev) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [name]: value,
      },
    }));
  };

  // Handle element changes
  const handleElementChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (!selectedElementId) return;

    setUserInputData((prev) => {
      const updatedElements = prev.blocks.elements.map((el) => {
        if (el.id === selectedElementId) {
          if (name.startsWith("style.")) {
            const styleProp = name.split(".")[1];
            return {
              ...el,
              style: {
                ...el.style,
                [styleProp]: styleProp.includes("fontSize") || 
                             styleProp.includes("width") || 
                             styleProp.includes("height") || 
                             styleProp.includes("x") || 
                             styleProp.includes("y") || 
                             styleProp.includes("borderRadius") || 
                             styleProp.includes("padding") || 
                             styleProp.includes("zIndex")
                  ? parseInt(value)
                  : value,
              },
            };
          } else {
            return {
              ...el,
              [name]: value,
            };
          }
        }
        return el;
      });

      return {
        ...prev,
        blocks: {
          ...prev.blocks,
          elements: updatedElements,
        },
      };
    });
  };

  // Add a new element
  const handleAddElement = () => {
    const newElement: CanvasElement = {
      id: uuidv4(),
      type: elementType,
      content: getDefaultContent(elementType),
      style: {
        x: 50,
        y: 50,
        width: getDefaultWidth(elementType),
        height: getDefaultHeight(elementType),
        fontSize: 16,
        fontWeight: "normal",
        color: "#000000",
        backgroundColor: elementType === "div" ? "#f3f4f6" : "transparent",
        borderRadius: 0,
        padding: 0,
        textAlign: "left",
        zIndex: 1,
      },
      href: elementType === "link" ? "#" : undefined,
      src: elementType === "image" ? "/assets/images/placeholder.jpg" : undefined,
      alt: elementType === "image" ? "Canvas image" : undefined,
    };

    setUserInputData((prev) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        elements: [...(prev.blocks.elements || []), newElement],
      },
    }));

    // Select the new element
    setSelectedElementId(newElement.id);
    setActiveTab("element");
  };

  // Delete the selected element
  const handleDeleteElement = () => {
    if (!selectedElementId) return;

    setUserInputData((prev) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        elements: prev.blocks.elements.filter((el) => el.id !== selectedElementId),
      },
    }));

    setSelectedElementId(null);
    setActiveTab("canvas");
  };

  // Helper functions for default values
  const getDefaultContent = (type: CanvasElement["type"]): string => {
    switch (type) {
      case "heading":
        return "عنوان جدید";
      case "paragraph":
        return "متن پاراگراف جدید";
      case "button":
        return "دکمه";
      case "link":
        return "لینک";
      case "div":
        return "";
      default:
        return "";
    }
  };

  const getDefaultWidth = (type: CanvasElement["type"]): number => {
    switch (type) {
      case "heading":
      case "paragraph":
        return 200;
      case "button":
        return 120;
      case "link":
        return 100;
      case "image":
        return 200;
      case "div":
        return 300;
      default:
        return 100;
    }
  };

  const getDefaultHeight = (type: CanvasElement["type"]): number => {
    switch (type) {
      case "heading":
        return 50;
      case "paragraph":
        return 100;
      case "button":
        return 40;
      case "link":
        return 30;
      case "image":
        return 150;
      case "div":
        return 200;
      default:
        return 50;
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow" dir="rtl">
      <div className="flex mb-4 border-b">
        <button
          className={`px-4 py-2 ${
            activeTab === "canvas"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("canvas")}
        >
          تنظیمات کانوا
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "element"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("element")}
          disabled={!selectedElementId}
        >
          تنظیمات المان
        </button>
      </div>

      {activeTab === "canvas" && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold mb-2">تنظیمات بخش</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                فاصله از بالا (px)
              </label>
              <input
                type="number"
                name="paddingTop"
                value={userInputData?.setting?.paddingTop || "0"}
                onChange={handleSectionSettingChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                فاصله از پایین (px)
              </label>
              <input
                type="number"
                name="paddingBottom"
                value={userInputData?.setting?.paddingBottom || "0"}
                onChange={handleSectionSettingChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                فاصله از راست (px)
              </label>
              <input
                type="number"
                name="paddingRight"
                value={userInputData?.setting?.paddingRight || "0"}
                onChange={handleSectionSettingChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                فاصله از چپ (px)
              </label>
              <input
                type="number"
                name="paddingLeft"
                value={userInputData?.setting?.paddingLeft || "0"}
                onChange={handleSectionSettingChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                حاشیه بالا (px)
              </label>
              <input
                type="number"
                name="marginTop"
                value={userInputData?.setting?.marginTop || "0"}
                onChange={handleSectionSettingChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                حاشیه پایین (px)
              </label>
              <input
                type="number"
                name="marginBottom"
                value={userInputData?.setting?.marginBottom || "0"}
                onChange={handleSectionSettingChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رنگ پس زمینه بخش
              </label>
              <input
                type="color"
                name="backgroundColor"
                value={userInputData?.setting?.backgroundColor || "#ffffff"}
                onChange={handleSectionSettingChange}
                className="w-full p-1 border rounded h-10"
              />
            </div>
          </div>

          <h3 className="text-lg font-bold mb-2 mt-6">تنظیمات کانوا</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                عرض کانوا
              </label>
              <input
                type="text"
                name="canvasWidth"
                value={userInputData?.blocks?.setting?.canvasWidth || "100%"}
                onChange={handleCanvasSettingChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ارتفاع کانوا
              </label>
              <input
                type="text"
                name="canvasHeight"
                value={userInputData?.blocks?.setting?.canvasHeight || "500px"}
                onChange={handleCanvasSettingChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رنگ پس زمینه کانوا
              </label>
              <input
                type="color"
                name="backgroundColor"
                value={userInputData?.blocks?.setting?.backgroundColor || "#ffffff"}
                onChange={handleCanvasSettingChange}
                className="w-full p-1 border rounded h-10"
              />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2">افزودن المان جدید</h3>
            <div className="flex items-center space-x-4 space-x-reverse">
              <select
                value={elementType}
                onChange={(e) => setElementType(e.target.value as CanvasElement["type"])}
                className="p-2 border rounded"
              >
                <option value="heading">عنوان</option>
                <option value="paragraph">پاراگراف</option>
                <option value="image">تصویر</option>
                <option value="button">دکمه</option>
                <option value="link">لینک</option>
                <option value="div">باکس</option>
              </select>
              <button
                onClick={handleAddElement}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                افزودن
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "element" && selectedElement && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">
              ویرایش المان: {getElementTypeName(selectedElement.type)}
            </h3>
            <button
              onClick={handleDeleteElement}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              حذف المان
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {(selectedElement.type === "heading" || 
              selectedElement.type === "paragraph" || 
              selectedElement.type === "button" || 
              selectedElement.type === "link") && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  متن
                </label>
                <textarea
                  name="content"
                  value={selectedElement.content}
                  onChange={handleElementChange}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>
            )}

            {selectedElement.type === "link" && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  آدرس لینک
                </label>
                <input
                  type="text"
                  name="href"
                  value={selectedElement.href || "#"}
                  onChange={handleElementChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            )}

            {selectedElement.type === "image" && (
              <>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    آدرس تصویر
                  </label>
                  <input
                    type="text"
                    name="src"
                    value={selectedElement.src || ""}
                    onChange={handleElementChange}
                    className="w-full p-2 border rounded"
                    placeholder="/assets/images/example.jpg"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    متن جایگزین
                  </label>
                  <input
                    type="text"
                    name="alt"
                    value={selectedElement.alt || ""}
                    onChange={handleElementChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                موقعیت X (px)
              </label>
              <input
                type="number"
                name="style.x"
                value={selectedElement.style.x}
                onChange={handleElementChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                موقعیت Y (px)
              </label>
              <input
                type="number"
                name="style.y"
                value={selectedElement.style.y}
                onChange={handleElementChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                عرض (px)
              </label>
              <input
                type="number"
                name="style.width"
                value={selectedElement.style.width}
                onChange={handleElementChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ارتفاع (px)
              </label>
              <input
                type="number"
                name="style.height"
                value={selectedElement.style.height}
                onChange={handleElementChange}
                className="w-full p-2 border rounded"
              />
            </div>

            {(selectedElement.type === "heading" || 
              selectedElement.type === "paragraph" || 
              selectedElement.type === "button" || 
              selectedElement.type === "link") && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    اندازه فونت (px)
                  </label>
                  <input
                    type="number"
                    name="style.fontSize"
                    value={selectedElement.style.fontSize || 16}
                    onChange={handleElementChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    وزن فونت
                  </label>
                  <select
                    name="style.fontWeight"
                    value={selectedElement.style.fontWeight || "normal"}
                    onChange={handleElementChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="normal">معمولی</option>
                    <option value="bold">ضخیم</option>
                    <option value="lighter">نازک</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    رنگ متن
                  </label>
                  <input
                    type="color"
                    name="style.color"
                    value={selectedElement.style.color || "#000000"}
                    onChange={handleElementChange}
                    className="w-full p-1 border rounded h-10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    تراز متن
                  </label>
                  <select
                    name="style.textAlign"
                    value={selectedElement.style.textAlign || "left"}
                    onChange={handleElementChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="right">راست</option>
                    <option value="center">وسط</option>
                    <option value="left">چپ</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رنگ پس زمینه
              </label>
              <input
                type="color"
                name="style.backgroundColor"
                value={selectedElement.style.backgroundColor || "#ffffff"}
                onChange={handleElementChange}
                className="w-full p-1 border rounded h-10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                گرد گوشه (px)
              </label>
              <input
                type="number"
                name="style.borderRadius"
                value={selectedElement.style.borderRadius || 0}
                onChange={handleElementChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                پدینگ (px)
              </label>
              <input
                type="number"
                name="style.padding"
                value={selectedElement.style.padding || 0}
                onChange={handleElementChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ترتیب لایه (z-index)
              </label>
              <input
                type="number"
                name="style.zIndex"
                value={selectedElement.style.zIndex || 1}
                onChange={handleElementChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get element type name in Persian
function getElementTypeName(type: CanvasElement["type"]): string {
  switch (type) {
    case "heading":
      return "عنوان";
    case "paragraph":
      return "پاراگراف";
    case "image":
      return "تصویر";
    case "button":
      return "دکمه";
    case "link":
      return "لینک";
    case "div":
      return "باکس";
    default:
      return "المان";
  }
}

export default CanvasEditorForm;