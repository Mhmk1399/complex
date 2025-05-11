"use client";
import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { CanvasEditorSection, CanvasElement } from "../sections/canvasEditor";
import { Layout } from "@/lib/types";
import { useCanvas } from "@/app/context/CanvasContext"; // Import the context

interface CanvasEditorFormProps {
  setUserInputData: React.Dispatch<React.SetStateAction<CanvasEditorSection>>;
  userInputData: CanvasEditorSection;
  layout: Layout;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
}

const CanvasEditorForm: React.FC<CanvasEditorFormProps> = ({
  setUserInputData,
  userInputData,
  layout,
  selectedComponent,
  setLayout,
  setSelectedComponent,

}) => {
  const [activeTab, setActiveTab] = useState<"canvas" | "element">("canvas");

  // Replace the local state with the context
  const { selectedElementId, setSelectedElementId } = useCanvas();
  const [elementType, setElementType] = useState<CanvasElement["type"]>("heading");
  const initialDataLoadedRef = useRef(false);
  const prevComponentRef = useRef(selectedComponent);

  // Get the base component name without element ID
  const baseComponentName = selectedComponent.split(":element:")[0];

  // Get the section data from the layout
  const sectionData = layout?.sections?.children?.sections.find(
    (section) => section.type === baseComponentName
  ) as CanvasEditorSection | undefined;

  // Initialize userInputData if it's not properly set
  useEffect(() => {
    if (!userInputData || !userInputData.setting || !userInputData.blocks || !userInputData.blocks.setting) {
      // Create default structure for userInputData
      const defaultData: CanvasEditorSection = {
        type: baseComponentName,
        setting: {
          paddingTop: "20",
          paddingBottom: "20",
          paddingLeft: "20",
          paddingRight: "20",
          marginTop: "30",
          marginBottom: "30",
          backgroundColor: "#ffffff"
        },
        blocks: {
          elements: [],
          setting: {
            canvasWidth: "100%",
            canvasHeight: "500px",
            backgroundColor: "#f9fafb",
            gridSize: 10,
            showGrid: true
          }
        }
      };
      
      setUserInputData(defaultData);
    }
  }, [userInputData, baseComponentName, setUserInputData]);

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

  // Get the selected element if any
  const selectedElement = selectedElementId && sectionData?.blocks?.elements
    ? sectionData.blocks.elements.find((el) => el.id === selectedElementId)
    : null;

  // Initialize form data from layout - only once when component mounts or when selectedComponent changes
  useEffect(() => {
    if (sectionData && (prevComponentRef.current !== selectedComponent || !initialDataLoadedRef.current)) {
      setUserInputData(sectionData);
      initialDataLoadedRef.current = true;
      prevComponentRef.current = selectedComponent;
    }
  }, [selectedComponent, sectionData, setUserInputData]);

  // Handle canvas settings changes
  const handleCanvasSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Update userInputData
    setUserInputData((prev) => {
      if (!prev) return prev;
      
      // Create a deep copy to avoid mutation
      const newData = JSON.parse(JSON.stringify(prev));
      
      if (!newData.blocks.setting) {
        newData.blocks.setting = {
          canvasWidth: "100%",
          canvasHeight: "500px",
          backgroundColor: "#f9fafb",
          gridSize: 10,
          showGrid: true
        };
      }
      
      if (name === "showGrid") {
        newData.blocks.setting[name] = (e.target as HTMLInputElement).checked;
      } else if (name === "gridSize") {
        newData.blocks.setting[name] = parseInt(value);
      } else {
        newData.blocks.setting[name] = value;
      }
      
      return newData;
    });
  };

  // Handle section settings changes
  const handleSectionSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Update userInputData
    setUserInputData((prev) => {
      if (!prev) return prev;
      
      // Create a deep copy to avoid mutation
      const newData = JSON.parse(JSON.stringify(prev));
      
      if (!newData.setting) {
        newData.setting = {
          paddingTop: "20",
          paddingBottom: "20",
          paddingLeft: "20",
          paddingRight: "20",
          marginTop: "30",
          marginBottom: "30",
          backgroundColor: "#ffffff"
        };
      }
      
      newData.setting[name] = value;
      
      return newData;
    });
  };

  // Handle element changes
const handleElementChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value, type } = e.target;
  
  if (!selectedElementId) return;

  // Create a deep copy of the current state
  const updatedData = JSON.parse(JSON.stringify(userInputData));
  
  // Find the element to update
  const elementIndex = updatedData.blocks.elements.findIndex(
    (el: CanvasElement) => el.id === selectedElementId
  );
  
  if (elementIndex === -1) return;
  
  // Update the appropriate property
  if (name.startsWith("style.")) {
    const styleProp = name.split(".")[1];
    
    // Convert numeric values
    const numericProps = ["fontSize", "width", "height", "x", "y", "borderRadius", "padding", "zIndex"];
    if (numericProps.includes(styleProp)) {
      updatedData.blocks.elements[elementIndex].style[styleProp] = parseInt(value);
    } else {
      updatedData.blocks.elements[elementIndex].style[styleProp] = value;
    }
  } else if (type === "checkbox") {
    updatedData.blocks.elements[elementIndex][name] = (e.target as HTMLInputElement).checked;
  } else {
    updatedData.blocks.elements[elementIndex][name] = value;
  }
  
  // Update the state
  setUserInputData(updatedData);
  
  // Also update the layout directly to ensure changes are reflected immediately
  if (sectionData) {
    const updatedLayout = JSON.parse(JSON.stringify(layout));
    const sectionIndex = updatedLayout.sections.children.sections.findIndex(
      (section: any) => section.type === baseComponentName
    );
    
    if (sectionIndex !== -1) {
      updatedLayout.sections.children.sections[sectionIndex].blocks.elements[elementIndex] = 
        updatedData.blocks.elements[elementIndex];
      setLayout(updatedLayout);
    }
  }
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
      textAlign: "right",
      zIndex: 1,
    },
    href: elementType === "link" ? "#" : undefined,
    src: elementType === "image" ? "/assets/images/placeholder.jpg" : undefined,
    alt: elementType === "image" ? "Canvas image" : undefined,
  };

  // Update userInputData
  setUserInputData((prev) => {
    if (!prev) return prev;
    
    // Create a deep copy to avoid mutation
    const newData = JSON.parse(JSON.stringify(prev));
    
    if (!newData.blocks) {
      newData.blocks = {
        elements: [],
        setting: {
          canvasWidth: "100%",
          canvasHeight: "500px",
          backgroundColor: "#f9fafb",
          gridSize: 10,
          showGrid: true
        }
      };
    }
    
    if (!newData.blocks.elements) {
      newData.blocks.elements = [];
    }
    
    newData.blocks.elements.push(newElement);
    
    return newData;
  });

  // Select the new element
  setSelectedElementId(newElement.id);
  setActiveTab("element");
};


// Delete the selected element
const handleDeleteElement = () => {
  if (!selectedElementId) return;

  // Update userInputData
  const updatedUserData = JSON.parse(JSON.stringify(userInputData));
  if (updatedUserData.blocks && updatedUserData.blocks.elements) {
    updatedUserData.blocks.elements = updatedUserData.blocks.elements.filter(
      (el: CanvasElement) => el.id !== selectedElementId
    );
    setUserInputData(updatedUserData);
  }

  // Also update the layout
  const updatedLayout = JSON.parse(JSON.stringify(layout));
  const sectionIndex = updatedLayout.sections.children.sections.findIndex(
    (section: any) => section.type === baseComponentName
  );
  
  if (sectionIndex !== -1 && 
      updatedLayout.sections.children.sections[sectionIndex].blocks && 
      updatedLayout.sections.children.sections[sectionIndex].blocks.elements) {
    updatedLayout.sections.children.sections[sectionIndex].blocks.elements = 
      updatedLayout.sections.children.sections[sectionIndex].blocks.elements.filter(
        (el: CanvasElement) => el.id !== selectedElementId
      );
    setLayout(updatedLayout);
  }

  // Reset selection using the context
  setSelectedElementId(null);
  setActiveTab("canvas");
  setSelectedComponent(baseComponentName);
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

  // If userInputData is not yet initialized, show loading
  if (!userInputData || !userInputData.setting || !userInputData.blocks || !userInputData.blocks.setting) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4" dir="rtl">
      <div className="mb-4">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 ${
              activeTab === "canvas" ? "border-b-2 border-blue-500" : ""
            }`}
            onClick={() => setActiveTab("canvas")}
          >
            تنظیمات کانوا
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "element" ? "border-b-2 border-blue-500" : ""
            } ${!selectedElementId ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => {
              if (selectedElementId) setActiveTab("element");
            }}
            disabled={!selectedElementId}
          >
            تنظیمات المان
          </button>
        </div>
      </div>

      {activeTab === "canvas" && (
        <div>
          <h3 className="text-lg font-bold mb-4">تنظیمات کانوا</h3>
          
          <div className="mb-4">
            <label className="block mb-2">پس‌زمینه کانوا</label>
            <input
              type="color"
              name="backgroundColor"
              value={userInputData.blocks.setting.backgroundColor || "#f9fafb"}
              onChange={handleCanvasSettingChange}
              className="w-full p-1 border rounded"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2">ارتفاع کانوا</label>
            <input
              type="text"
              name="canvasHeight"
              value={userInputData.blocks.setting.canvasHeight || "500px"}
              onChange={handleCanvasSettingChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2">نمایش خطوط راهنما</label>
            <input
              type="checkbox"
              name="showGrid"
              checked={userInputData.blocks.setting.showGrid || false}
              onChange={handleCanvasSettingChange}
              className="mr-2"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2">اندازه خطوط راهنما</label>
            <input
              type="number"
              name="gridSize"
              value={userInputData.blocks.setting.gridSize || 10}
              onChange={handleCanvasSettingChange}
              className="w-full p-2 border rounded"
              min="5"
              max="50"
            />
          </div>
          
          <h3 className="text-lg font-bold mb-4 mt-8">تنظیمات بخش</h3>
          
          <div className="mb-4">
            <label className="block mb-2">پس‌زمینه بخش</label>
            <input
              type="color"
              name="backgroundColor"
              value={userInputData.setting.backgroundColor || "#ffffff"}
              onChange={handleSectionSettingChange}
              className="w-full p-1 border rounded"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block mb-2">فاصله از بالا</label>
              <input
                type="number"
                name="paddingTop"
                value={userInputData.setting.paddingTop || "20"}
                onChange={handleSectionSettingChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2">فاصله از پایین</label>
              <input
                type="number"
                name="paddingBottom"
                value={userInputData.setting.paddingBottom || "20"}
                onChange={handleSectionSettingChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2">فاصله از راست</label>
              <input
                type="number"
                name="paddingRight"
                value={userInputData.setting.paddingRight || "20"}
                onChange={handleSectionSettingChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2">فاصله از چپ</label>
              <input
                type="number"
                name="paddingLeft"
                value={userInputData.setting.paddingLeft || "20"}
                onChange={handleSectionSettingChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2">حاشیه بالا</label>
              <input
                type="number"
                name="marginTop"
                value={userInputData.setting.marginTop || "30"}
                onChange={handleSectionSettingChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2">حاشیه پایین</label>
              <input
                type="number"
                name="marginBottom"
                value={userInputData.setting.marginBottom || "30"}
                onChange={handleSectionSettingChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-4">افزودن المان جدید</h3>
            <div className="flex items-center mb-4">
              <select
                value={elementType}
                onChange={(e) => setElementType(e.target.value as CanvasElement["type"])}
                className="p-2 border rounded mr-2"
              >
                <option value="heading">عنوان</option>
                <option value="paragraph">پاراگراف</option>
                <option value="button">دکمه</option>
                <option value="link">لینک</option>
                <option value="image">تصویر</option>
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
        <div>
          <h3 className="text-lg font-bold mb-4">تنظیمات المان</h3>
          
          <div className="mb-4">
            <label className="block mb-2">نوع المان</label>
            <div className="p-2 border rounded bg-gray-100">
              {selectedElement.type === "heading" && "عنوان"}
              {selectedElement.type === "paragraph" && "پاراگراف"}
              {selectedElement.type === "button" && "دکمه"}
              {selectedElement.type === "link" && "لینک"}
              {selectedElement.type === "image" && "تصویر"}
              {selectedElement.type === "div" && "باکس"}
            </div>
          </div>
          
          {selectedElement.type !== "image" && selectedElement.type !== "div" && (
            <div className="mb-4">
              <label className="block mb-2">متن</label>
              <textarea
                name="content"
                value={selectedElement.content || ""}
                onChange={handleElementChange}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>
          )}
          
          {selectedElement.type === "image" && (
            <>
              <div className="mb-4">
                <label className="block mb-2">آدرس تصویر</label>
                <input
                  type="text"
                  name="src"
                  value={selectedElement.src || ""}
                  onChange={handleElementChange}
                  className="w-full p-2 border rounded"
                  placeholder="/assets/images/example.jpg"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">متن جایگزین</label>
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
          
          {selectedElement.type === "link" && (
            <div className="mb-4">
              <label className="block mb-2">آدرس لینک</label>
              <input
                type="text"
                name="href"
                value={selectedElement.href || "#"}
                onChange={handleElementChange}
                className="w-full p-2 border rounded"
              />
            </div>
          )}
          
          <h4 className="font-bold mt-6 mb-4">استایل</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block mb-2">موقعیت X</label>
              <input
                type="number"
                name="style.x"
                value={selectedElement.style.x}
                onChange={handleElementChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2">موقعیت Y</label>
              <input
                type="number"
                name="style.y"
                value={selectedElement.style.y}
                onChange={handleElementChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2">عرض</label>
              <input
                type="number"
                name="style.width"
                value={selectedElement.style.width}
                onChange={handleElementChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2">ارتفاع</label>
              <input
                type="number"
                name="style.height"
                value={selectedElement.style.height}
                onChange={handleElementChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
       
{selectedElement.type === "button" && (
  <div className="mb-4">
    <label className="block mb-2">آدرس لینک</label>
    <input
      type="text"
      name="href"
      value={selectedElement.href || "#"}
      onChange={handleElementChange}
      className="w-full p-2 border rounded"
      placeholder="https://example.com"
    />
  </div>
)}

          {selectedElement.type !== "image" && selectedElement.type !== "div" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block mb-2">اندازه فونت</label>
                <input
                  type="number"
                  name="style.fontSize"
                  value={selectedElement.style.fontSize || 16}
                  onChange={handleElementChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-2">وزن فونت</label>
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
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block mb-2">رنگ متن</label>
              <input
                type="color"
                name="style.color"
                value={selectedElement.style.color || "#000000"}
                onChange={handleElementChange}
                className="w-full p-1 border rounded"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2">رنگ پس‌زمینه</label>
              <input
                type="color"
                name="style.backgroundColor"
                value={selectedElement.style.backgroundColor || "transparent"}
                onChange={handleElementChange}
                className="w-full p-1 border rounded"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2">گردی گوشه‌ها</label>
              <input
                type="number"
                name="style.borderRadius"
                value={selectedElement.style.borderRadius || 0}
                onChange={handleElementChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2">پدینگ</label>
              <input
                type="number"
                name="style.padding"
                value={selectedElement.style.padding || 0}
                onChange={handleElementChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2">ترتیب نمایش (z-index)</label>
              <input
                type="number"
                name="style.zIndex"
                value={selectedElement.style.zIndex || 1}
                onChange={handleElementChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2">تراز متن</label>
              <select
                name="style.textAlign"
                value={selectedElement.style.textAlign || "right"}
                onChange={handleElementChange}
                className="w-full p-2 border rounded"
              >
                <option value="right">راست</option>
                <option value="center">وسط</option>
                <option value="left">چپ</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6">
  <button
    onClick={handleDeleteElement}
    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
  >
    حذف المان
  </button>
</div>

        </div>
      )}
    </div>
  );
};

export default CanvasEditorForm;
