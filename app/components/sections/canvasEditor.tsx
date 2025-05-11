"use client";
import { Layout } from "@/lib/types";
import { Delete } from "../C-D";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";

// Define the types for our canvas elements
export interface CanvasElement {
  id: string;
  type: "heading" | "paragraph" | "image" | "button" | "link" | "div";
  content: string;
  style: {
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
    textAlign?: "left" | "center" | "right";
    zIndex?: number;
  };
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
    backgroundColor?: string;
    height?: string;
  };
  blocks: {
    elements: CanvasElement[];
    setting: {
      canvasWidth: string;
      canvasHeight: string;
      backgroundColor: string;
      gridSize?: number;
      showGrid?: boolean;
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
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  position: relative;
  width: ${(props) => props.$data.blocks.setting.canvasWidth || "100%"};
  height: ${(props) => props.$data.blocks.setting.canvasHeight || "500px"};
  background-color: ${(props) => props.$data.blocks.setting.backgroundColor || "#ffffff"};
  margin-top: ${(props) => props.$data.setting.marginTop || "0"}px;
  margin-bottom: ${(props) => props.$data.setting.marginBottom || "0"}px;
  padding-top: ${(props) => props.$data.setting.paddingTop || "0"}px;
  padding-bottom: ${(props) => props.$data.setting.paddingBottom || "0"}px;
  padding-left: ${(props) => props.$data.setting.paddingLeft || "0"}px;
  padding-right: ${(props) => props.$data.setting.paddingRight || "0"}px;
  overflow: hidden;
  border-radius: 8px;
`;

const ElementWrapper = styled.div<{
  $style: CanvasElement["style"];
  $isSelected: boolean;
}>`
  position: absolute;
  left: ${(props) => props.$style.x}px;
  top: ${(props) => props.$style.y}px;
  width: ${(props) => props.$style.width}px;
  height: ${(props) => props.$style.height}px;
  z-index: ${(props) => props.$style.zIndex || 1};
  ${(props) =>
    props.$isSelected
      ? "outline: 2px dashed #3b82f6; outline-offset: 2px;"
      : ""}
`;

// Render different element types
const renderElement = (element: CanvasElement, isSelected: boolean) => {
  const { type, content, style, href, src, alt } = element;

  switch (type) {
    case "heading":
      return (
        <h2
          style={{
            fontSize: `${style.fontSize || 24}px`,
            fontWeight: style.fontWeight || "bold",
            color: style.color || "#000000",
            textAlign: style.textAlign || "left",
            width: "100%",
            height: "100%",
            margin: 0,
            padding: `${style.padding || 0}px`,
            backgroundColor: style.backgroundColor || "transparent",
            borderRadius: `${style.borderRadius || 0}px`,
          }}
        >
          {content}
        </h2>
      );
    case "paragraph":
      return (
        <p
          style={{
            fontSize: `${style.fontSize || 16}px`,
            fontWeight: style.fontWeight || "normal",
            color: style.color || "#000000",
            textAlign: style.textAlign || "left",
            width: "100%",
            height: "100%",
            margin: 0,
            padding: `${style.padding || 0}px`,
            backgroundColor: style.backgroundColor || "transparent",
            borderRadius: `${style.borderRadius || 0}px`,
          }}
        >
          {content}
        </p>
      );
    case "image":
      return (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          <Image
            src={src || "/assets/images/placeholder.jpg"}
            alt={alt || "Canvas image"}
            fill
            style={{
              objectFit: "cover",
              borderRadius: `${style.borderRadius || 0}px`,
            }}
          />
        </div>
      );
    case "button":
      return (
        <button
          style={{
            fontSize: `${style.fontSize || 16}px`,
            fontWeight: style.fontWeight || "bold",
            color: style.color || "#ffffff",
            backgroundColor: style.backgroundColor || "#3b82f6",
            borderRadius: `${style.borderRadius || 4}px`,
            padding: `${style.padding || 8}px`,
            width: "100%",
            height: "100%",
            border: "none",
            cursor: "pointer",
            textAlign: style.textAlign as any || "center",
          }}
        >
          {content}
        </button>
      );
    case "link":
      return (
        <Link
          href={href || "#"}
          style={{
            fontSize: `${style.fontSize || 16}px`,
            fontWeight: style.fontWeight || "normal",
            color: style.color || "#3b82f6",
            textAlign: style.textAlign as any || "left",
            width: "100%",
            height: "100%",
            display: "block",
            padding: `${style.padding || 0}px`,
            backgroundColor: style.backgroundColor || "transparent",
            borderRadius: `${style.borderRadius || 0}px`,
            textDecoration: "none",
          }}
        >
          {content}
        </Link>
      );
    case "div":
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: style.backgroundColor || "#f3f4f6",
            borderRadius: `${style.borderRadius || 0}px`,
            padding: `${style.padding || 0}px`,
          }}
        >
          {content}
        </div>
      );
    default:
      return null;
  }
};

const CanvasEditor: React.FC<CanvasEditorProps> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
  setLayout,
  previewWidth,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [preview, setPreview] = useState(previewWidth);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  useEffect(() => {
    if (window.innerWidth <= 425) {
      setPreview("sm");
    } else {
      setPreview(previewWidth);
    }
  }, [previewWidth]);

  const sectionData = layout?.sections?.children?.sections.find(
    (section) => section.type === actualName
  ) as CanvasEditorSection;

  if (!sectionData) {
    return null;
  }

  const { elements } = sectionData.blocks;

  const handleElementClick = (elementId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElementId(elementId);
    // We'll also need to update the selected component in the parent
    // to show the element's properties in the form
    setSelectedComponent(`${actualName}:element:${elementId}`);
  };

  return (
    <div
      onClick={() => {
        setSelectedComponent(actualName);
        setSelectedElementId(null);
      }}
      className={`transition-all duration-150 ease-in-out relative ${
        selectedComponent === actualName
          ? "border-4 border-blue-500 rounded-2xl shadow-lg"
          : ""
      }`}
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

      {actualName === selectedComponent && (
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
        $previewWidth={previewWidth}
        $preview={preview}
      >
        {elements?.map((element) => (
          <ElementWrapper
            key={element.id}
            $style={element.style}
            $isSelected={selectedElementId === element.id}
            onClick={(e) => handleElementClick(element.id, e)}
          >
            {renderElement(element, selectedElementId === element.id)}
          </ElementWrapper>
        ))}
      </CanvasContainer>
    </div>
  );
};

export default CanvasEditor;