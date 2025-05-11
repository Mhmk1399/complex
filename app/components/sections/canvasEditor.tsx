"use client";
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Layout } from "@/lib/types";
import { Delete } from "../C-D";
import { Rnd } from "react-rnd";

// Define types for the Canvas Editor
export interface CanvasElementStyle {
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  borderRadius?: number;
  padding?: number;
  textAlign?: string;
  zIndex?: number;
}

export interface CanvasElement {
  id: string;
  type: "heading" | "paragraph" | "image" | "button" | "link" | "div";
  content?: string;
  style: CanvasElementStyle;
  href?: string;
  src?: string;
  alt?: string;
}

export interface CanvasEditorSection {
  type: string;
  setting: {
    paddingTop: string;
    paddingBottom: string;
    paddingLeft: string;
    paddingRight: string;
    marginTop: string;
    marginBottom: string;
    backgroundColor: string;
  };
  blocks: {
    elements: CanvasElement[];
    setting: {
      canvasWidth: string;
      canvasHeight: string;
      backgroundColor: string;
      gridSize: number;
      showGrid: boolean;
    };
  };
}

interface CanvasEditorProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
  previewWidth: "sm" | "default";
}

const CanvasContainer = styled.div<{
  $data: CanvasEditorSection;
  $showGrid: boolean;
  $gridSize: number;
}>`
  position: relative;
  width: ${(props) => props.$data.blocks.setting.canvasWidth};
  height: ${(props) => props.$data.blocks.setting.canvasHeight};
  background-color: ${(props) => props.$data.blocks.setting.backgroundColor};
  overflow: hidden;
  ${(props) =>
    props.$showGrid
      ? `
    background-image: linear-gradient(
        to right,
        rgba(0, 0, 0, 0.1) 1px,
        transparent 1px
      ),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
    background-size: ${props.$gridSize}px ${props.$gridSize}px;
  `
      : ""}
`;

const ElementWrapper = styled.div<{
  $isSelected: boolean;
  $isEditing: boolean;
}>`
  position: absolute;
  width: 100%;
  height: 100%;
  ${(props) =>
    props.$isSelected
      ? `
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  `
      : ""}
  ${(props) =>
    props.$isEditing
      ? `
    cursor: text;
  `
      : ""}
`;

const CanvasEditor: React.FC<CanvasEditorProps> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
  setLayout,
  previewWidth,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const editableRef = useRef<HTMLDivElement>(null);

  // Get the section data from the layout
  const sectionData = layout?.sections?.children?.sections.find(
    (section) => section.type === actualName
  ) as CanvasEditorSection | undefined;

  // If section data doesn't exist, return null
  if (!sectionData) {
    return null;
  }

  // Initialize blocks.elements if it doesn't exist
  if (!sectionData.blocks.elements) {
    const updatedLayout = JSON.parse(JSON.stringify(layout));
    const sectionIndex = updatedLayout.sections.children.sections.findIndex(
      (section: any) => section.type === actualName
    );
    
    if (sectionIndex !== -1) {
      updatedLayout.sections.children.sections[sectionIndex].blocks.elements = [];
      setLayout(updatedLayout);
    }
  }

  // Check if the selected component includes an element ID
  useEffect(() => {
    if (selectedComponent.includes(":element:")) {
      const elementId = selectedComponent.split(":element:")[1];
      setSelectedElementId(elementId);
    } else if (selectedComponent === actualName) {
      setSelectedElementId(null);
    }
  }, [selectedComponent, actualName]);

  // Handle element selection
  const handleElementSelect = (elementId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElementId(elementId);
    setSelectedComponent(`${actualName}:element:${elementId}`);
  };

  // Handle canvas click (deselect elements)
  const handleCanvasClick = () => {
    setSelectedElementId(null);
    setSelectedComponent(actualName);
  };

  // Handle element content editing
  const handleEditStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedElementId) return;
    setIsEditing(true);
  };

  // Handle element content change
  const handleContentChange = (content: string) => {
    if (!selectedElementId || !sectionData.blocks.elements) return;

    // Find the element to update
    const elementIndex = sectionData.blocks.elements.findIndex(
      (el) => el.id === selectedElementId
    );

    if (elementIndex === -1) return;

    // Create a deep copy of the layout
    const updatedLayout = JSON.parse(JSON.stringify(layout));
    
    // Find the section in the updated layout
    const sectionIndex = updatedLayout.sections.children.sections.findIndex(
      (section: any) => section.type === actualName
    );

    if (sectionIndex === -1) return;

    // Update the element content
    updatedLayout.sections.children.sections[sectionIndex].blocks.elements[elementIndex].content = content;

    // Update the layout
    setLayout(updatedLayout);
  };

  // Handle element resize and drag
  const handleElementUpdate = (
    elementId: string,
    update: { x?: number; y?: number; width?: number; height?: number }
  ) => {
    if (!sectionData.blocks.elements) return;

    // Find the element to update
    const elementIndex = sectionData.blocks.elements.findIndex(
      (el) => el.id === elementId
    );

    if (elementIndex === -1) return;

    // Create a deep copy of the layout
    const updatedLayout = JSON.parse(JSON.stringify(layout));
    
    // Find the section in the updated layout
    const sectionIndex = updatedLayout.sections.children.sections.findIndex(
      (section: any) => section.type === actualName
    );

    if (sectionIndex === -1) return;

    // Update the element style
    const elementStyle = updatedLayout.sections.children.sections[sectionIndex].blocks.elements[elementIndex].style;
    
    if (update.x !== undefined) elementStyle.x = update.x;
    if (update.y !== undefined) elementStyle.y = update.y;
    if (update.width !== undefined) elementStyle.width = update.width;
    if (update.height !== undefined) elementStyle.height = update.height;

    // Update the layout
    setLayout(updatedLayout);
  };

  // Render a canvas element based on its type
  const renderElement = (element: CanvasElement) => {
    const isSelected = element.id === selectedElementId;

    const commonStyles = {
      fontSize: element.style.fontSize ? `${element.style.fontSize}px` : undefined,
      fontWeight: element.style.fontWeight || undefined,
      color: element.style.color || undefined,
      backgroundColor: element.style.backgroundColor || undefined,
      borderRadius: element.style.borderRadius ? `${element.style.borderRadius}px` : undefined,
      padding: element.style.padding ? `${element.style.padding}px` : undefined,
      textAlign: element.style.textAlign as any || undefined,
      zIndex: element.style.zIndex || 1,
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: element.style.textAlign === "center" ? "center" : 
                     element.style.textAlign === "left" ? "flex-start" : "flex-end",
      overflow: "hidden",
    };

    switch (element.type) {
      case "heading":
        return (
          <h2
            style={commonStyles}
            onDoubleClick={handleEditStart}
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            ref={isSelected && isEditing ? editableRef : null}
            onBlur={(e) => {
              setIsEditing(false);
              handleContentChange(e.currentTarget.textContent || "");
            }}
          >
            {element.content}
          </h2>
        );
      case "paragraph":
        return (
          <p
            style={commonStyles}
            onDoubleClick={handleEditStart}
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            ref={isSelected && isEditing ? editableRef : null}
            onBlur={(e) => {
              setIsEditing(false);
              handleContentChange(e.currentTarget.textContent || "");
            }}
          >
            {element.content}
          </p>
        );
      case "image":
        return (
          <img
            src={element.src || "/assets/images/placeholder.jpg"}
            alt={element.alt || "Canvas image"}
            style={{
              ...commonStyles,
              objectFit: "cover",
            }}
          />
        );
      case "button":
        return (
          <button
            style={{
              ...commonStyles,
              cursor: "pointer",
              border: "none",
            }}
            onDoubleClick={handleEditStart}
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            ref={isSelected && isEditing ? editableRef : null}
            onBlur={(e) => {
              setIsEditing(false);
              handleContentChange(e.currentTarget.textContent || "");
            }}
          >
            {element.content}
          </button>
        );
      case "link":
        return (
          <a
            href={element.href || "#"}
            style={{
              ...commonStyles,
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onDoubleClick={handleEditStart}
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            ref={isSelected && isEditing ? editableRef : null}
            onBlur={(e) => {
              setIsEditing(false);
              handleContentChange(e.currentTarget.textContent || "");
            }}
            onClick={(e) => e.preventDefault()}
          >
            {element.content}
          </a>
        );
      case "div":
        return (
          <div
            style={commonStyles}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      onClick={() => setSelectedComponent(actualName)}
      className={`transition-all duration-150 ease-in-out relative ${
        selectedComponent === actualName || selectedComponent.startsWith(`${actualName}:element:`)
          ? "border-4 border-blue-500 rounded-2xl shadow-lg"
          : ""
      }`}
      style={{
        paddingTop: `${sectionData.setting.paddingTop}px`,
        paddingBottom: `${sectionData.setting.paddingBottom}px`,
        paddingLeft: `${sectionData.setting.paddingLeft}px`,
        paddingRight: `${sectionData.setting.paddingRight}px`,
        marginTop: `${sectionData.setting.marginTop}px`,
        marginBottom: `${sectionData.setting.marginBottom}px`,
        backgroundColor: sectionData.setting.backgroundColor,
      }}
    >
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h3 className="text-lg font-bold mb-4">
              آیا از حذف
              <span className="text-blue-400 font-bold mx-1">{actualName}</span>
              مطمئن هستید؟
            </h3>
            <div className="flex gap-4 justify-end">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setShowDeleteModal(false)}
              >
                انصراف
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={() => {
                  Delete(actualName, layout, setLayout);
                  setShowDeleteModal(false);
                }}
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {(selectedComponent === actualName || selectedComponent.startsWith(`${actualName}:element:`)) && (
        <div className="absolute w-fit -top-5 -left-1 z-10 flex">
          <div className="bg-blue-500 py-1 px-4 rounded-l-lg text-white">
            {actualName}
          </div>
          <button
            className="font-extrabold text-xl hover:bg-blue-500 bg-red-500 pb-1 rounded-r-lg px-3 text-white transform transition-all ease-in-out duration-300"
            onClick={() => setShowDeleteModal(true)}
          >
            x
          </button>
        </div>
      )}

      <CanvasContainer
        $data={sectionData}
        $showGrid={sectionData.blocks.setting.showGrid || false}
        $gridSize={sectionData.blocks.setting.gridSize || 10}
        onClick={handleCanvasClick}
        className="mx-auto"
      >
        {sectionData.blocks.elements?.map((element) => (
          <Rnd
            key={element.id}
            size={{ width: element.style.width, height: element.style.height }}
            position={{ x: element.style.x, y: element.style.y }}
            onDragStop={(e, d) => {
              handleElementUpdate(element.id, { x: d.x, y: d.y });
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              handleElementUpdate(element.id, {
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
                x: position.x,
                            y: position.y,
              });
            }}
            bounds="parent"
            dragHandleClassName={isEditing ? "non-existent-class" : undefined}
            enableResizing={!isEditing}
            disableDragging={isEditing}
            style={{
              zIndex: element.style.zIndex || 1,
            }}
          >
            <ElementWrapper
              $isSelected={element.id === selectedElementId}
              $isEditing={isEditing && element.id === selectedElementId}
              onClick={(e) => handleElementSelect(element.id, e)}
            >
              {renderElement(element)}
            </ElementWrapper>
          </Rnd>
        ))}
      </CanvasContainer>
    </div>
  );
};

export default CanvasEditor;
