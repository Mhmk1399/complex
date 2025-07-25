"use client";
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Layout, AnimationEffect, AnimationConfig } from "@/lib/types"; // Import from types
import { Delete } from "../C-D";
import { Rnd } from "react-rnd";
import { useCanvas } from "@/app/contexts/CanvasContext";




// Define types for the Canvas Editor
export interface CanvasElementStyle {
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  fontWeight?: string;
  color?: string; // Can be hex or rgba
  backgroundColor?: string; // Can be hex or rgba
  borderRadius?: number;
  padding?: number;
  textAlign?: "left" | "right" | "center" | "justify" | "start" | "end";
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
  animation?: AnimationEffect; // Add animation support
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
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  position: relative;
  width: ${(props) => props.$data.blocks.setting.canvasWidth};
  height: ${(props) => props.$preview === "sm" ? 
    `${parseInt(props.$data.blocks.setting.canvasHeight) * 0.6}px` : 
    props.$data.blocks.setting.canvasHeight};
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
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
  $animation?: AnimationEffect;
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

  /* Apply animations using CSS filters and properties */
  ${(props) => {
    if (!props.$animation) return '';
    
    const { type, animation } = props.$animation;
    const selector = type === 'hover' ? '&:hover' : type === 'click' ? '&:active' : '';
    
    
    // Generate animation CSS based on type
    const generateAnimationCSS = (animType: string, config: AnimationConfig) => {
     
      switch (animType) {
        case 'pulse':
          return `
            ${selector} {
              animation: canvasPulse ${config.duration} ${config.timing} ${config.delay || '0s'} ${config.iterationCount || '1'};
            }
            
            @keyframes canvasPulse {
              0%, 100% { 
                opacity: 1;
                filter: brightness(1);
              }
              50% { 
                opacity: ${Math.max(0.3, 1 - (0.4 ))};
                filter: brightness(${1 + (0.3)});
              }
            }
          `;
        case 'glow':
          return `
            ${selector} {
              animation: canvasGlow ${config.duration} ${config.timing} ${config.delay || '0s'} ${config.iterationCount || '1'};
            }
            
            @keyframes canvasGlow {
              0%, 100% { 
                filter: brightness(1) drop-shadow(0 0 0px rgba(255, 255, 255, 0));
              }
              50% { 
                filter: brightness(${1 + (0.2 )}) drop-shadow(0 0 ${8 }px rgba(255, 255, 255, ${0.6 }));
              }
            }
          `;
        case 'brightness':
          return `
            ${selector} {
              animation: canvasBrightness ${config.duration} ${config.timing} ${config.delay || '0s'} ${config.iterationCount || '1'};
            }
            
            @keyframes canvasBrightness {
              0%, 100% { 
                filter: brightness(1);
              }
              50% { 
                filter: brightness(${1 + (0.4 )});
              }
            }
          `;
        case 'blur':
          return `
            ${selector} {
              animation: canvasBlur ${config.duration} ${config.timing} ${config.delay || '0s'} ${config.iterationCount || '1'};
            }
            
            @keyframes canvasBlur {
              0%, 100% { 
                filter: blur(0px);
              }
              50% { 
                filter: blur(${2 }px);
              }
            }
          `;
        case 'saturate':
          return `
            ${selector} {
              animation: canvasSaturate ${config.duration} ${config.timing} ${config.delay || '0s'} ${config.iterationCount || '1'};
            }
            
            @keyframes canvasSaturate {
              0%, 100% { 
                filter: saturate(1);
              }
              50% { 
                filter: saturate(${1 + (0.8 )});
              }
            }
          `;
        case 'contrast':
          return `
            ${selector} {
              animation: canvasContrast ${config.duration} ${config.timing} ${config.delay || '0s'} ${config.iterationCount || '1'};
            }
            
            @keyframes canvasContrast {
              0%, 100% { 
                filter: contrast(1);
              }
              50% { 
                filter: contrast(${1 + (0.5 )});
              }
            }
          `;
        case 'opacity':
          return `
            ${selector} {
              animation: canvasOpacity ${config.duration} ${config.timing} ${config.delay || '0s'} ${config.iterationCount || '1'};
            }
            
            @keyframes canvasOpacity {
              0% { 
                opacity: 1;
              }
              50% { 
                opacity: ${Math.max(0.2, 1 - (0.6 ))};
              }
              100% { 
                opacity: 1;
              }
            }
          `;
        case 'shadow':
          return `
            ${selector} {
              animation: canvasShadow ${config.duration} ${config.timing} ${config.delay || '0s'} ${config.iterationCount || '1'};
            }
            
            @keyframes canvasShadow {
              0%, 100% { 
                filter: drop-shadow(0 0 0px rgba(0, 0, 0, 0));
              }
              50% { 
                filter: drop-shadow(0 ${4 }px ${8 }px rgba(0, 0, 0, ${0.3}));
              }
            }
          `;
        default:
          return '';
      }
    };

    // Handle load animation differently
   

    return generateAnimationCSS(animation.type, animation);
  }}
`;

const CanvasEditor: React.FC<CanvasEditorProps> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
  setLayout,
  previewWidth,
}) => {
  // IMPORTANT: All state hooks must be called unconditionally at the top
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { selectedElementId, setSelectedElementId } = useCanvas();
  const [isEditing, setIsEditing] = useState(false);
  const editableRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState(previewWidth);
  const [clickedElements, setClickedElements] = useState<Set<string>>(new Set());

  // Get the section data from the layout
  const sectionData = layout?.sections?.children?.sections.find(
    (section) => section.type === actualName
  ) as CanvasEditorSection | undefined;

  // Handle responsive preview
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 425) {
        setPreview("sm");
      } else {
        setPreview(previewWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [previewWidth]);

  // IMPORTANT: All useEffect hooks must be called unconditionally at the top
  useEffect(() => {
    if (selectedComponent.includes(":element:")) {
      const elementId = selectedComponent.split(":element:")[1];
      setSelectedElementId(elementId);
    } else if (selectedComponent === actualName) {
      setSelectedElementId(null);
    }
  }, [selectedComponent, actualName, setSelectedElementId]);

  // Initialize blocks.elements if it doesn't exist
  useEffect(() => {
    if (sectionData && !sectionData.blocks?.elements) {
      const updatedLayout = JSON.parse(JSON.stringify(layout));
      const sectionIndex = updatedLayout.sections.children.sections.findIndex(
        (section: { type: string }) => section.type === actualName
      );
      
      if (sectionIndex !== -1) {
        if (!updatedLayout.sections.children.sections[sectionIndex].blocks) {
          updatedLayout.sections.children.sections[sectionIndex].blocks = {
            elements: [],
            setting: {
              canvasWidth: "100%",
              canvasHeight: "500px",
              backgroundColor: "#f9fafb",
              gridSize: 10,
              showGrid: true
            }
          };
        } else if (!updatedLayout.sections.children.sections[sectionIndex].blocks.elements) {
          updatedLayout.sections.children.sections[sectionIndex].blocks.elements = [];
        }
        
        setLayout(updatedLayout);
      }
    }
  }, [sectionData, layout, actualName, setLayout]);

  // Setup scroll observers for scroll-triggered animations
  useEffect(() => {
    if (!sectionData?.blocks?.elements) return;

    const observers: IntersectionObserver[] = [];

    

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [sectionData?.blocks?.elements]);

  // Now you can have conditional returns
  if (!sectionData) {
    return null;
  }

  // Ensure blocks and elements exist
  const elements = sectionData.blocks?.elements || [];
  const blockSettings = sectionData.blocks?.setting || {
    canvasWidth: "100%",
    canvasHeight: "500px",
    backgroundColor: "#f9fafb",
    gridSize: 10,
    showGrid: false
  };

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
    if (!selectedElementId || !elements) return;

    // Find the element to update
    const elementIndex = elements.findIndex(
      (el) => el.id === selectedElementId
    );

    if (elementIndex === -1) return;

    // Create a deep copy of the layout
    const updatedLayout = JSON.parse(JSON.stringify(layout));
    
    // Find the section in the updated layout
    const sectionIndex = updatedLayout.sections.children.sections.findIndex(
      (section: { type: string }) => section.type === actualName
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
    if (!elements) return;

    // Find the element to update
    const elementIndex = elements.findIndex(
      (el) => el.id === elementId
    );

    if (elementIndex === -1) return;

    // Create a deep copy of the layout
    const updatedLayout = JSON.parse(JSON.stringify(layout));
    
    // Find the section in the updated layout
    const sectionIndex = updatedLayout.sections.children.sections.findIndex(
      (section: { type: string }) => section.type === actualName
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

  // Handle click animations
  const handleElementClick = (elementId: string, e: React.MouseEvent) => {
    const element = elements.find(el => el.id === elementId);
    if (element?.animation?.type === 'click') {
      e.stopPropagation();
      // Add to clicked elements set
      setClickedElements(prev => new Set(prev).add(elementId));
      
      // Remove from clicked elements after animation duration
      const duration = parseFloat(element.animation.animation.duration.replace('s', '')) * 1000;
      const delay = parseFloat((element.animation.animation.delay || '0s').replace('s', '')) * 1000;
      
      setTimeout(() => {
        setClickedElements(prev => {
          const newSet = new Set(prev);
          newSet.delete(elementId);
          return newSet;
        });
      }, duration + delay);
    }
    
    // Also handle element selection
    handleElementSelect(elementId, e);
  };

  // Adjust element styles based on preview mode
  const getAdjustedStyle = (style: CanvasElementStyle) => {
    if (preview === "sm") {
      return {
        ...style,
        fontSize: style.fontSize ? Math.max(Math.floor(style.fontSize * 0.7), 10) : undefined,
        borderRadius: style.borderRadius ? Math.floor(style.borderRadius * 0.7) : undefined,
        padding: style.padding ? Math.floor(style.padding * 0.7) : undefined,
      };
    }
    return style;
  };

  // Render a canvas element based on its type
  const renderElement = (element: CanvasElement) => {
    const isSelected = element.id === selectedElementId;
    const adjustedStyle = getAdjustedStyle(element.style);
    const isClicked = clickedElements.has(element.id);
    
    // Base styles
    const commonStyles: React.CSSProperties = {
      fontSize: adjustedStyle.fontSize ? `${adjustedStyle.fontSize}px` : undefined,
      fontWeight: adjustedStyle.fontWeight || undefined,
      color: adjustedStyle.color || undefined,
      backgroundColor: adjustedStyle.backgroundColor || undefined,
      borderRadius: adjustedStyle.borderRadius ? `${adjustedStyle.borderRadius}px` : undefined,
      padding: adjustedStyle.padding ? `${adjustedStyle.padding}px` : undefined,
      textAlign: adjustedStyle.textAlign,
      zIndex: adjustedStyle.zIndex || 1,
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: adjustedStyle.textAlign === "center" ? "center" : 
                     adjustedStyle.textAlign === "left" ? "flex-start" : "flex-end",
      overflow: "hidden",
      transition: 'all 300ms ease-in-out',
    };

    // Add animation classes based on animation type
    const getAnimationClasses = () => {
      let classes = "canvas-element";
      
      if (element.animation) {
        const { type } = element.animation;
        
        if (type === 'click' && isClicked) {
          classes += " clicked";
        }
        
       
      }
      
      return classes;
    };

    switch (element.type) {
      case "heading":
        return (
          <h2
            id={`canvas-element-${element.id}`}
            style={commonStyles}
            className={getAnimationClasses()}
            onDoubleClick={handleEditStart}
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            ref={isSelected && isEditing ? editableRef as React.RefObject<HTMLHeadingElement> : null}
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
            id={`canvas-element-${element.id}`}
            style={commonStyles}
            className={getAnimationClasses()}
            onDoubleClick={handleEditStart}
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            ref={isSelected && isEditing ? editableRef as React.RefObject<HTMLParagraphElement> : null}
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
            id={`canvas-element-${element.id}`}
            src={element.src || "/assets/images/placeholder.jpg"}
            alt={element.alt || "Canvas image"}
            style={{
              ...commonStyles,
              objectFit: "cover",
            }}
            draggable={false}
            className={getAnimationClasses()}
          />
        );
      case "button":
        return (
          <div
            style={{
              textDecoration: "none",
              display: "block",
              width: "100%",
              height: "100%",
            }}
            onClick={(e) => {
              // Prevent navigation when in edit mode
              if (isSelected) {
                e.preventDefault();
              }
            }}
          >
            <button
              id={`canvas-element-${element.id}`}
              style={commonStyles}
              className={getAnimationClasses()}
              onDoubleClick={handleEditStart}
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              ref={isSelected && isEditing ? editableRef as unknown as React.RefObject<HTMLButtonElement> : null}
              onBlur={(e) => {
                setIsEditing(false);
                handleContentChange(e.currentTarget.textContent || "");
              }}
            >
              {element.content}
            </button>
          </div>
        );
      case "link":
        return (
          <div
            id={`canvas-element-${element.id}`}
            style={commonStyles}
            className={getAnimationClasses()}
            onDoubleClick={handleEditStart}
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            ref={isSelected && isEditing ? editableRef as unknown as React.RefObject<HTMLDivElement> : null}
            onBlur={(e) => {
              setIsEditing(false);
              handleContentChange(e.currentTarget.textContent || "");
            }}
            onClick={(e) => e.preventDefault()}
          >
            {element.content}
          </div>
        );
      case "div":
        return (
          <div
            id={`canvas-element-${element.id}`}
            style={commonStyles}
            className={getAnimationClasses()}
          />
        );
      default:
        return null;
    }
  };

  // Calculate scale factor for responsive elements
  const getScaleFactor = () => {
    return preview === "sm" ? 0.6 : 1;
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
        $showGrid={blockSettings.showGrid || false}
        $gridSize={blockSettings.gridSize || 10}
        $previewWidth={previewWidth}
        $preview={preview}
        onClick={handleCanvasClick}
        className="mx-auto"
      >
        {elements.map((element) => {
          const scaleFactor = getScaleFactor();
          // Adjust position and size for small screens
          const adjustedPosition = preview === "sm" 
            ? { x: element.style.x * scaleFactor, y: element.style.y * scaleFactor }
            : { x: element.style.x, y: element.style.y };
            
          const adjustedSize = preview === "sm"
            ? { width: element.style.width * scaleFactor, height: element.style.height * scaleFactor }
            : { width: element.style.width, height: element.style.height };
            
          return (
            <Rnd
              key={element.id}
              size={adjustedSize}
              position={adjustedPosition}
              onDragStop={(e, d) => {
                // Convert back to original scale when saving
                const originalX = preview === "sm" ? d.x / scaleFactor : d.x;
                const originalY = preview === "sm" ? d.y / scaleFactor : d.y;
                handleElementUpdate(element.id, { x: originalX, y: originalY });
              }}
              onResizeStop={(e, direction, ref, delta, position) => {
                // Convert back to original scale when saving
                const width = parseInt(ref.style.width);
                const height = parseInt(ref.style.height);
                const originalWidth = preview === "sm" ? width / scaleFactor : width;
                const originalHeight = preview === "sm" ? height / scaleFactor : height;
                const originalX = preview === "sm" ? position.x / scaleFactor : position.x;
                const originalY = preview === "sm" ? position.y / scaleFactor : position.y;
                
                handleElementUpdate(element.id, {
                  width: originalWidth,
                  height: originalHeight,
                  x: originalX,
                  y: originalY,
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
                $previewWidth={previewWidth}
                $preview={preview}
                $animation={element.animation}
                onClick={(e) => handleElementClick(element.id, e)}
              >
                {renderElement(element)}
              </ElementWrapper>
            </Rnd>
          );
        })}
      </CanvasContainer>
    </div>
  );
};

export default CanvasEditor;
