"use client";
import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Layout, AnimationEffect } from "@/lib/types"; // Add AnimationEffect import
import { useCanvas } from "@/app/contexts/CanvasContext";
import { effectService } from "@/services/effectService"; // Remove AnimationEffect from here
import { animationService } from "@/services/animationService";

// Import the types from the canvas editor component
import { CanvasEditorSection, CanvasElement } from "@/lib/types"; // Import from types instead


// Add a ColorInput component similar to richTextForm
const ColorInput = ({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
}) => (
  <>
    <label className="block mb-2" htmlFor={name}>
      {label}
    </label>
    <div className="flex flex-col gap-3 items-center">
      <input
        type="color"
        id={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="w-full p-1 border rounded"
      />
    </div>
  </>
);

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
  const [canvasBackgroundColor, setCanvasBackgroundColor] = useState(
    userInputData?.blocks?.setting?.backgroundColor || "#f9fafb"
  );
  const [sectionBackgroundColor, setSectionBackgroundColor] = useState(
    userInputData?.setting?.backgroundColor || "#ffffff"
  );
  const { selectedElementId, setSelectedElementId } = useCanvas();
  const [elementType, setElementType] = useState<CanvasElement["type"]>("heading");
  const initialDataLoadedRef = useRef(false);
  const prevComponentRef = useRef(selectedComponent);

  // Animation states
  const [animationType, setAnimationType] = useState<'hover' | 'click' | 'scroll' | 'load'>('hover');
  const [animationEffect, setAnimationEffect] = useState<string>('pulse');
  const [animationDuration, setAnimationDuration] = useState<string>('1s');
  const [animationTiming, setAnimationTiming] = useState<string>('ease-in-out');
  const [animationDelay, setAnimationDelay] = useState<string>('0s');
  const [animationIterationCount, setAnimationIterationCount] = useState<string>('1');
  const [animationIntensity, setAnimationIntensity] = useState<'light' | 'normal' | 'strong'>('normal');

  // Get the base component name without element ID
  const baseComponentName = selectedComponent.split(":element:")[0];

  const handleCanvasBackgroundColorChange = (name: string, value: string) => {
    setCanvasBackgroundColor(value);
    
    // Use setTimeout to debounce the update
    setTimeout(() => {
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

        newData.blocks.setting.backgroundColor = value;

        return newData;
      });
    }, 100);
  };

  const handleSectionBackgroundColorChange = (name: string, value: string) => {
    setSectionBackgroundColor(value);
    
    // Use setTimeout to debounce the update
    setTimeout(() => {
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

        newData.setting.backgroundColor = value;

        return newData;
      });
    }, 100);
  };

  // Get the section data from the layout
  const sectionData = layout?.sections?.children?.sections.find(
    (section) => section.type === baseComponentName
  ) as CanvasEditorSection | undefined;

  // In the useEffect for initializing userInputData
  useEffect(() => {
    if (sectionData && (prevComponentRef.current !== selectedComponent || !initialDataLoadedRef.current)) {
      // Important: Make a deep copy to avoid reference issues
      const sectionDataCopy = JSON.parse(JSON.stringify(sectionData));

      // Ensure the elements array exists
      if (!sectionDataCopy.blocks.elements) {
        sectionDataCopy.blocks.elements = [];
      }

      // Set the user input data with the copied section data
      setUserInputData(sectionDataCopy);
      
      // Set the color state values
      setCanvasBackgroundColor(sectionDataCopy.blocks.setting?.backgroundColor || "#f9fafb");
      setSectionBackgroundColor(sectionDataCopy.setting?.backgroundColor || "#ffffff");
      
      initialDataLoadedRef.current = true;
      prevComponentRef.current = selectedComponent;
    }
  }, [selectedComponent, sectionData, setUserInputData]);

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
  }, [selectedComponent, setSelectedElementId]);

  // Get the selected element if any
  const selectedElement = selectedElementId && sectionData?.blocks?.elements
    ? sectionData.blocks.elements.find((el) => el.id === selectedElementId)
    : null;

  // Initialize animation states when element is selected
  useEffect(() => {
    if (selectedElement && selectedElement.animation) {
      const animation = selectedElement.animation;
      setAnimationType(animation.type);
      setAnimationEffect(animation.animation.type);
      setAnimationDuration(animation.animation.duration);
      setAnimationTiming(animation.animation.timing);
      setAnimationDelay(animation.animation.delay || '0s');
      setAnimationIterationCount(animation.animation.iterationCount || '1');
      setAnimationIntensity(animation.animation.intensity || 'normal');
    } else {
      // Reset to defaults
      setAnimationType('hover');
      setAnimationEffect('pulse');
      setAnimationDuration('1s');
      setAnimationTiming('ease-in-out');
      setAnimationDelay('0s');
      setAnimationIterationCount('1');
      setAnimationIntensity('normal');
    }
  }, [selectedElement]);

  // Handle canvas settings changes
  const handleCanvasSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement;

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

  // Handle animation changes
  const handleAnimationChange = (property: string, value: string) => {
    if (!selectedElementId) return;

    // Create animation effect object
    const animationEffect: AnimationEffect = {
      type: animationType as 'hover' | 'click',
      animation: {
        type: property === 'effect' ? value : "",
        duration: property === 'duration' ? value : animationDuration,
        timing: property === 'timing' ? value : animationTiming,
        delay: property === 'delay' ? value : animationDelay,
        iterationCount: property === 'iterationCount' ? value : animationIterationCount,
        intensity: property === 'intensity' ? value as 'light' | 'normal' | 'strong' : animationIntensity,
      }
    };

    // Update local state
    switch (property) {
      case 'type':
        setAnimationType(value as 'hover' | 'click');
        animationEffect.type = value as 'hover' | 'click';
        break;
      case 'effect':
        setAnimationEffect(value);
        animationEffect.animation.type = value;
        break;
      case 'duration':
        setAnimationDuration(value);
        animationEffect.animation.duration = value;
        break;
      case 'timing':
        setAnimationTiming(value);
        animationEffect.animation.timing = value;
        break;
      case 'delay':
        setAnimationDelay(value);
        animationEffect.animation.delay = value;
        break;
      case 'iterationCount':
        setAnimationIterationCount(value);
        animationEffect.animation.iterationCount = value;
        break;
      case 'intensity':
        setAnimationIntensity(value as 'light' | 'normal' | 'strong');
        animationEffect.animation.intensity = value as 'light' | 'normal' | 'strong';
        break;
    }

    // Update userInputData
    setUserInputData((prev) => {
      if (!prev) return prev;

      const newData = JSON.parse(JSON.stringify(prev));
      const elementIndex = newData.blocks.elements.findIndex(
        (el: CanvasElement) => el.id === selectedElementId
      );

      if (elementIndex === -1) return prev;

      newData.blocks.elements[elementIndex].animation = animationEffect;

      return newData;
    });

    // Also update the layout directly
    if (sectionData) {
      const updatedLayout = JSON.parse(JSON.stringify(layout));
      const sectionIndex = updatedLayout.sections.children.sections.findIndex(
        (section: { type: string }) => section.type === baseComponentName
      );

      if (sectionIndex !== -1) {
        const elementIndex = updatedLayout.sections.children.sections[sectionIndex].blocks.elements.findIndex(
          (el: CanvasElement) => el.id === selectedElementId
        );

        if (elementIndex !== -1) {
          updatedLayout.sections.children.sections[sectionIndex].blocks.elements[elementIndex].animation = animationEffect;
          setLayout(updatedLayout);
        }
      }
    }
  };

  // Function to convert hex to rgba
  const hexToRgba = (hex: string, opacity: number): string => {
    // Remove the hash if it exists
    hex = hex.replace('#', '');

    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Return rgba string
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Function to extract hex and opacity from rgba
  const rgbaToHexAndOpacity = (rgba: string): { hex: string, opacity: number } => {
    // Default values
    let hex = '#000000';
    let opacity = 1;

    // Check if it's an rgba value
    const rgbaMatch = rgba.match(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/);
    if (rgbaMatch) {
      const r = parseInt(rgbaMatch[1]);
      const g = parseInt(rgbaMatch[2]);
      const b = parseInt(rgbaMatch[3]);
      opacity = parseFloat(rgbaMatch[4]);

      // Convert to hex
      hex = '#' +
        r.toString(16).padStart(2, '0') +
        g.toString(16).padStart(2, '0') +
        b.toString(16).padStart(2, '0');
    } else {
      // If it's a hex value, just return it with opacity 1
      hex = rgba.startsWith('#') ? rgba : '#000000';
    }

    return { hex, opacity };
  };

  // Add state for opacity values
  const [textColorOpacity, setTextColorOpacity] = useState(1);
  const [bgColorOpacity, setBgColorOpacity] = useState(1);

  // Update the useEffect that sets up the selected element
  useEffect(() => {
    if (selectedElement) {
      // Extract opacity values from colors if they're rgba
      if (selectedElement.style.color) {
        const {  opacity } = rgbaToHexAndOpacity(selectedElement.style.color);
        setTextColorOpacity(opacity);
      } else {
        setTextColorOpacity(1);
      }

      if (selectedElement.style.backgroundColor) {
        const {  opacity } = rgbaToHexAndOpacity(selectedElement.style.backgroundColor);
        setBgColorOpacity(opacity);
      } else {
        setBgColorOpacity(1);
      }
    }
  }, [selectedElement]);

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
        (section: { type: string }) => section.type === baseComponentName
      );

      if (sectionIndex !== -1) {
        updatedLayout.sections.children.sections[sectionIndex].blocks.elements[elementIndex] =
          updatedData.blocks.elements[elementIndex];
        setLayout(updatedLayout);
      }
    }
  };

  // Modified color change handler with setTimeout to prevent infinite loops
  const handleColorChange = (name: string, value: string) => {
    if (!selectedElementId) return;

    // Use setTimeout to debounce the update
    setTimeout(() => {
      // Get the current element
      const element = userInputData.blocks.elements.find(
        (el: CanvasElement) => el.id === selectedElementId
      );

      if (!element) return;

      // Create a deep copy of the current state
      const updatedData = JSON.parse(JSON.stringify(userInputData));
      
      // Find the element to update
      const elementIndex = updatedData.blocks.elements.findIndex(
        (el: CanvasElement) => el.id === selectedElementId
      );

      if (elementIndex === -1) return;

      // Update the color based on the name
      if (name === 'style.color') {
        // Apply the current opacity to the new color
        const newColor = hexToRgba(value, textColorOpacity);
        updatedData.blocks.elements[elementIndex].style.color = newColor;
      } else if (name === 'style.backgroundColor') {
        // Apply the current opacity to the new color
        const newColor = hexToRgba(value, bgColorOpacity);
        updatedData.blocks.elements[elementIndex].style.backgroundColor = newColor;
      }

      // Update the state
      setUserInputData(updatedData);

      // Also update the layout directly
      if (sectionData) {
        const updatedLayout = JSON.parse(JSON.stringify(layout));
        const sectionIndex = updatedLayout.sections.children.sections.findIndex(
          (section: { type: string }) => section.type === baseComponentName
        );

        if (sectionIndex !== -1) {
          updatedLayout.sections.children.sections[sectionIndex].blocks.elements[elementIndex] =
            updatedData.blocks.elements[elementIndex];
          setLayout(updatedLayout);
        }
      }
    },100);
  };

  // Add handlers for opacity changes with setTimeout
  const handleTextColorOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const opacity = parseFloat(e.target.value);
    setTextColorOpacity(opacity);

    if (!selectedElementId) return;

    // Use setTimeout to debounce the update
    setTimeout(() => {
      // Get the current color
      const element = userInputData.blocks.elements.find(
        (el: CanvasElement) => el.id === selectedElementId
      );

      if (!element) return;

      // Extract the hex part
      const { hex } = rgbaToHexAndOpacity(element.style.color || '#000000');

      // Create a deep copy of the current state
      const updatedData = JSON.parse(JSON.stringify(userInputData));
      
      // Find the element to update
      const elementIndex = updatedData.blocks.elements.findIndex(
        (el: CanvasElement) => el.id === selectedElementId
      );

      if (elementIndex === -1) return;

      // Create the new rgba color
      const newColor = hexToRgba(hex, opacity);
      updatedData.blocks.elements[elementIndex].style.color = newColor;

      // Update the state
      setUserInputData(updatedData);

      // Also update the layout directly
      if (sectionData) {
        const updatedLayout = JSON.parse(JSON.stringify(layout));
        const sectionIndex = updatedLayout.sections.children.sections.findIndex(
          (section: { type: string }) => section.type === baseComponentName
        );

        if (sectionIndex !== -1) {
          updatedLayout.sections.children.sections[sectionIndex].blocks.elements[elementIndex] =
            updatedData.blocks.elements[elementIndex];
          setLayout(updatedLayout);
        }
      }
    }, 200);
  };

  const handleBgColorOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const opacity = parseFloat(e.target.value);
    setBgColorOpacity(opacity);

    if (!selectedElementId) return;

    // Use setTimeout to debounce the update
    setTimeout(() => {
      // Get the current color
      const element = userInputData.blocks.elements.find(
        (el: CanvasElement) => el.id === selectedElementId
      );

      if (!element) return;

      // Extract the hex part
      const { hex } = rgbaToHexAndOpacity(element.style.backgroundColor || '#ffffff');

      // Create a deep copy of the current state
      const updatedData = JSON.parse(JSON.stringify(userInputData));
      
      // Find the element to update
      const elementIndex = updatedData.blocks.elements.findIndex(
        (el: CanvasElement) => el.id === selectedElementId
      );

      if (elementIndex === -1) return;

      // Create the new rgba color
      const newColor = hexToRgba(hex, opacity);
      updatedData.blocks.elements[elementIndex].style.backgroundColor = newColor;

      // Update the state
      setUserInputData(updatedData);

      // Also update the layout directly
      if (sectionData) {
        const updatedLayout = JSON.parse(JSON.stringify(layout));
        const sectionIndex = updatedLayout.sections.children.sections.findIndex(
          (section: { type: string }) => section.type === baseComponentName
        );

        if (sectionIndex !== -1) {
          updatedLayout.sections.children.sections[sectionIndex].blocks.elements[elementIndex] =
            updatedData.blocks.elements[elementIndex];
          setLayout(updatedLayout);
        }
      }
    }, 200);
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
      href: elementType === "link" || elementType === "button" ? "#" : undefined,
      src: elementType === "image" ? "/assets/images/placeholder.jpg" : undefined,
      alt: elementType === "image" ? "Canvas image" : undefined,
      // Add default animation
      animation: {
        type: 'hover',
        animation: {
          type: 'pulse',
          duration: '1s',
          timing: 'ease-in-out',
          delay: '0s',
          iterationCount: '1',
          intensity: 'normal'
        }
      }
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

  // Add this to handle tab switching
  const handleTabSwitch = (tab: "canvas" | "element") => {
    // If switching from element tab to canvas tab, clear the selected element
    if (activeTab === "element" && tab === "canvas") {
      setSelectedElementId(null);
      setSelectedComponent(baseComponentName); // Deselect the element in the main component
    }

    // Set the active tab
    setActiveTab(tab);
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
      (section: { type: string }) => section.type === baseComponentName
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
            className={`px-4 py-2 ${activeTab === "canvas" ? "border-b-2 border-blue-500" : ""
              }`}
            onClick={() => handleTabSwitch("canvas")}
          >
            تنظیمات کانوا
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "element" ? "border-b-2 border-blue-500" : ""
              } ${!selectedElementId ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => {
              if (selectedElementId) handleTabSwitch("element");
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
            <ColorInput
              label="پس‌زمینه کانوا"
              name="backgroundColor"
              value={canvasBackgroundColor}
              onChange={handleCanvasBackgroundColorChange}
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
            <ColorInput
              label="پس‌زمینه بخش"
              name="backgroundColor"
              value={sectionBackgroundColor}
              onChange={handleSectionBackgroundColorChange}
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
              <ColorInput
                label="رنگ متن"
                name="style.color"
                value={selectedElement.style.color ? rgbaToHexAndOpacity(selectedElement.style.color).hex : "#000000"}
                onChange={handleColorChange}
              />
              <div className="mt-2">
                <label className="block mb-1 text-sm">شفافیت: {Math.round(textColorOpacity * 100)}%</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={textColorOpacity}
                  onChange={handleTextColorOpacityChange}
                  className="w-full"
                />
              </div>
            </div>

            <div className="mb-4">
              <ColorInput
                label="رنگ پس‌زمینه"
                name="style.backgroundColor"
                value={selectedElement.style.backgroundColor ? rgbaToHexAndOpacity(selectedElement.style.backgroundColor).hex : "#ffffff"}
                onChange={handleColorChange}
              />
              <div className="mt-2">
                <label className="block mb-1 text-sm">شفافیت: {Math.round(bgColorOpacity * 100)}%</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={bgColorOpacity}
                  onChange={handleBgColorOpacityChange}
                  className="w-full"
                />
              </div>
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

          {/* Animation Settings Section */}
          <h4 className="font-bold mt-6 mb-4">تنظیمات انیمیشن</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block mb-2">نوع تریگر</label>
              <select
                value={animationType}
                onChange={(e) => handleAnimationChange('type', e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="hover">هاور</option>
                <option value="click">کلیک</option>
               
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-2">نوع انیمیشن</label>
              <select
                value={animationEffect}
                onChange={(e) => handleAnimationChange('effect', e.target.value)}
                className="w-full p-2 border rounded"
              >
                {animationService.getAnimationTypes().map((type) => (
                  <option key={type} value={type}>
                    {animationService.getAnimationPreview(type)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-2">مدت زمان</label>
              <select
                value={animationDuration}
                onChange={(e) => handleAnimationChange('duration', e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="0.3s">سریع (0.3s)</option>
                <option value="0.5s">نرمال (0.5s)</option>
                <option value="0.8s">متوسط (0.8s)</option>
                <option value="1s">آهسته (1s)</option>
                <option value="1.5s">خیلی آهسته (1.5s)</option>
                <option value="2s">بسیار آهسته (2s)</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-2">نوع حرکت</label>
              <select
                value={animationTiming}
                onChange={(e) => handleAnimationChange('timing', e.target.value)}
                className="w-full p-2 border rounded"
              >
                {animationService.getTimingFunctions().map((timing) => (
                  <option key={timing} value={timing}>
                    {timing === 'ease' && 'آسان'}
                    {timing === 'ease-in' && 'آسان ورودی'}
                    {timing === 'ease-out' && 'آسان خروجی'}
                    {timing === 'ease-in-out' && 'آسان دوطرفه'}
                    {timing === 'linear' && 'خطی'}
                    {timing === 'cubic-bezier(0, 0, 0.2, 1)' && 'سفارشی'}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-2">تاخیر</label>
              <select
                value={animationDelay}
                onChange={(e) => handleAnimationChange('delay', e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="0s">بدون تاخیر</option>
                <option value="0.1s">0.1 ثانیه</option>
                <option value="0.2s">0.2 ثانیه</option>
                <option value="0.3s">0.3 ثانیه</option>
                <option value="0.5s">0.5 ثانیه</option>
                <option value="1s">1 ثانیه</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-2">تعداد تکرار</label>
              <select
                value={animationIterationCount}
                onChange={(e) => handleAnimationChange('iterationCount', e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="1">یک بار</option>
                <option value="2">دو بار</option>
                <option value="3">سه بار</option>
                <option value="5">پنج بار</option>
                <option value="infinite">بی‌نهایت</option>
              </select>
            </div>

           
          </div>

          {/* Animation Preview */}
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h5 className="font-semibold mb-2">پیش‌نمایش انیمیشن:</h5>
            <div className="text-sm text-gray-600">
              <p><strong>تریگر:</strong> {animationType === 'hover' ? 'هاور' : animationType === 'click' ? 'کلیک' : animationType === 'scroll' ? 'اسکرول' : 'بارگذاری'}</p>
              <p><strong>انیمیشن:</strong> {animationService.getAnimationPreview(animationEffect)}</p>
              <p><strong>مدت:</strong> {animationDuration}</p>
              <p><strong>شدت:</strong> {animationIntensity === 'light' ? 'ملایم' : animationIntensity === 'normal' ? 'معمولی' : 'قوی'}</p>
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
