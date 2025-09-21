import {
  Layout,
  CollapseSection,
  CollapseBlock,
  CollapseBlockSetting,
  AnimationEffect,
} from "@/lib/types";
import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { Delete } from "../C-D";

interface CollapseFaqProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
  previewWidth: "sm" | "default";
}

const Section = styled.section<{
  $data: CollapseSection;
  $previewWidth: string;
}>`
  padding-top: ${(props) => props.$data.setting?.paddingTop || 20}px;
  padding-bottom: ${(props) => props.$data.setting?.paddingBottom || 20}px;
  padding-left: ${(props) => props.$data.setting?.paddingLeft || 20}px;
  padding-right: ${(props) => props.$data.setting?.paddingRight || 20}px;
  margin-top: ${(props) => props.$data.setting?.marginTop || 20}px;
  margin-bottom: ${(props) => props.$data.setting?.marginBottom || 20}px;
  margin-left: 10px;
  margin-right: 10px;
  background-color: ${(props) => props.$data.setting?.background || "#ffffff"};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
`;

const Heading = styled.h2<{ $data: CollapseSection; $previewWidth: string }>`
  color: ${(props) => props.$data.setting?.headingColor || "#333"};
  font-size: ${(props) => {
    const baseFontSize = props.$data.setting?.headingFontSize || 24;
    return props.$previewWidth === "sm"
      ? `${(baseFontSize as number) * 0.8}px`
      : `${baseFontSize}px`;
  }};
  font-weight: ${(props) => props.$data.setting?.headingFontWeight || "bold"};
  text-align: center;
  margin: 10px 0 20px;
`;

const FaqItem = styled.div<{ $previewWidth: string }>`
  width: ${(props) => (props.$previewWidth === "sm" ? "90%" : "100%")};
  margin: 10px 0;
  padding: ${(props) => (props.$previewWidth === "sm" ? "8px" : "10px")};
`;

const Question = styled.div<{
  $block: CollapseBlock;
  $index: number;
  $previewWidth: string;
  $globalAnimation?: AnimationEffect;
}>`
  font-size: ${(props) => {
    const baseFontSize =
      (props.$block.setting[
        `textFontSize${props.$index + 1}` as keyof CollapseBlockSetting
      ] as number) || 18;
    return props.$previewWidth === "sm"
      ? `${baseFontSize * 0.9}px`
      : `${baseFontSize}px`;
  }};
  font-weight: ${(props) =>
    (props.$block.setting[
      `textFontWeight${props.$index + 1}` as keyof CollapseBlockSetting
    ] as string) || "bold"};
  color: ${(props) =>
    (props.$block.setting[
      `textColor${props.$index + 1}` as keyof CollapseBlockSetting
    ] as string) || "#ffffff"};
  padding: ${(props) => (props.$previewWidth === "sm" ? "8px" : "10px")};
  cursor: pointer;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;

  /* Apply global animation to all accordion headers */
  ${(props) => {
    const animation = props.$globalAnimation;
    if (!animation) return "";

    const { type, animation: animConfig } = animation;
    const selector = type === "hover" ? "&:hover" : "&:active";

    // Generate animation CSS based on type
    if (animConfig.type === "pulse") {
      return `
        ${selector} {
          animation: accordionHeaderPulse ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes accordionHeaderPulse {
          0%, 100% { 
            opacity: 1;
            filter: brightness(1);
          }
          50% { 
            opacity: 0.7;
            filter: brightness(1.3);
          }
        }
      `;
    } else if (animConfig.type === "glow") {
      return `
        ${selector} {
          animation: accordionHeaderGlow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes accordionHeaderGlow {
          0%, 100% { 
            filter: brightness(1) drop-shadow(0 0 0px rgba(255, 255, 255, 0));
          }
          50% { 
            filter: brightness(1.2) drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
          }
        }
      `;
    } else if (animConfig.type === "brightness") {
      return `
        ${selector} {
          animation: accordionHeaderBrightness ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes accordionHeaderBrightness {
          0%, 100% { 
            filter: brightness(1);
          }
          50% { 
            filter: brightness(1.4);
          }
        }
      `;
    } else if (animConfig.type === "blur") {
      return `
        ${selector} {
          animation: accordionHeaderBlur ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes accordionHeaderBlur {
          0%, 100% { 
            filter: blur(0px);
          }
          50% { 
            filter: blur(2px);
          }
        }
      `;
    } else if (animConfig.type === "saturate") {
      return `
        ${selector} {
          animation: accordionHeaderSaturate ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes accordionHeaderSaturate {
          0%, 100% { 
            filter: saturate(1);
          }
          50% { 
            filter: saturate(1.8);
          }
        }
      `;
    } else if (animConfig.type === "contrast") {
      return `
        ${selector} {
          animation: accordionHeaderContrast ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes accordionHeaderContrast {
          0%, 100% { 
            filter: contrast(1);
          }
          50% { 
            filter: contrast(1.5);
          }
        }
      `;
    } else if (animConfig.type === "opacity") {
      return `
        ${selector} {
          animation: accordionHeaderOpacity ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes accordionHeaderOpacity {
          0% { 
            opacity: 1;
          }
          50% { 
            opacity: 0.4;
          }
          100% { 
            opacity: 1;
          }
        }
      `;
    } else if (animConfig.type === "shadow") {
      return `
        ${selector} {
          animation: accordionHeaderShadow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes accordionHeaderShadow {
          0%, 100% { 
            filter: drop-shadow(0 0 0px rgba(0, 0, 0, 0));
          }
          50% { 
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
          }
        }
      `;
    }

    return "";
  }}
`;

const Answer = styled.div<{
  $block: CollapseBlock;
  $isOpen: boolean;
  $index: number;
  $previewWidth: string;
}>`
  font-size: ${(props) => {
    const baseFontSize =
      (props.$block.setting[
        `contentFontSize${props.$index + 1}` as keyof CollapseBlockSetting
      ] as number) || 16;
    return props.$previewWidth === "sm"
      ? `${baseFontSize * 0.9}px`
      : `${baseFontSize}px`;
  }};
  font-weight: ${(props) =>
    (props.$block.setting[
      `contentFontWeight${props.$index + 1}` as keyof CollapseBlockSetting
    ] as string) || "normal"};
  color: ${(props) =>
    (props.$block.setting[
      `contentColor${props.$index + 1}` as keyof CollapseBlockSetting
    ] as string) || "#e4e4e4e4"};
  padding: ${(props) =>
    props.$previewWidth === "sm" ? "12px 15px" : "15px 20px"};
  text-align: right;
  background-color: transparent;
  max-height: ${(props) => (props.$isOpen ? "500px" : "0")};
  opacity: ${(props) => (props.$isOpen ? "1" : "0")};
  overflow: hidden;
  transition: all 0.6s ease-in-out;
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
`;

const CollapseFaq: React.FC<CollapseFaqProps> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
  setLayout,
  previewWidth,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);
  const [blocks, setBlocks] = useState<CollapseBlock[]>([]);

  const sectionData = useMemo(() => {
    return (
      (layout?.sections?.children?.sections?.find(
        (section) => section.type === actualName
      ) as CollapseSection) || {
        blocks: [],
        setting: {},
        type: "collapse",
      }
    );
  }, [layout?.sections?.children?.sections, actualName]);

  useEffect(() => {
    if (sectionData?.blocks && typeof sectionData.blocks === "object") {
      const blocksArray = Object.keys(sectionData.blocks)
        .filter((key) => !isNaN(Number(key)))
        .map((key) => sectionData.blocks[Number(key)]);
      setBlocks(blocksArray);
    }
  }, [sectionData.blocks]);

  if (!sectionData) {
    return null;
  }

  const toggleOpen = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Handle click animations for global animation
  const handleQuestionClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();

    const globalAnimation = sectionData.setting?.headerAnimation;

    if (globalAnimation && globalAnimation.type === "click") {
      // Add clicked class for click animations
      const element = e.currentTarget as HTMLElement;
      element.classList.add("clicked");

      const duration =
        parseFloat(globalAnimation.animation.duration.replace("s", "")) * 1000;
      const delay =
        parseFloat((globalAnimation.animation.delay || "0s").replace("s", "")) *
        1000;

      setTimeout(() => {
        element.classList.remove("clicked");
      }, duration + delay);
    }

    toggleOpen(index);
  };

  return (
    <Section
      dir="rtl"
      $data={sectionData}
      $previewWidth={previewWidth}
      onClick={() => setSelectedComponent(actualName)}
      className={`transition-all duration-150 ease-in-out relative ${
        selectedComponent === actualName ? "border-4 border-blue-500 " : ""
      }`}
    >
      <Heading $data={sectionData} $previewWidth={previewWidth}>
        {sectionData.blocks[0]?.heading}
      </Heading>

      {blocks.length > 0 ? (
        blocks.map((block: CollapseBlock, idx: number) => (
          <FaqItem key={idx} $previewWidth={previewWidth}>
            <Question
              $block={block}
              $index={idx}
              $previewWidth={previewWidth}
              $globalAnimation={sectionData.setting?.headerAnimation}
              onClick={(e) => handleQuestionClick(e, idx)}
            >
              {
                block[
                  `text${idx + 1}` as keyof CollapseBlock
                ] as React.ReactNode
              }
              <span>{openIndexes.includes(idx) ? "-" : "+"}</span>
            </Question>
            <Answer
              $block={block}
              $isOpen={openIndexes.includes(idx)}
              $index={idx}
              $previewWidth={previewWidth}
            >
              {
                block[
                  `content${idx + 1}` as keyof CollapseBlock
                ] as React.ReactNode
              }
            </Answer>
          </FaqItem>
        ))
      ) : (
        <div>Loading...</div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0  bg-black bg-opacity-70 z-50 flex items-center justify-center ">
          <div className="bg-white p-8 rounded-lg">
            <h3 className="text-lg font-bold mb-4">
              آیا از حذف
              <span className="text-blue-400 font-bold mx-1">
                {actualName}
              </span>{" "}
              مطمئن هستید؟
            </h3>
            <div className="flex gap-4 justify-end flex-row-reverse">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setShowDeleteModal(false)}
              >
                انصراف
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 "
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

      {actualName === selectedComponent ? (
        <div className="absolute w-fit -top-5 -left-1 z-10 flex flex-row-reverse">
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
      ) : null}
    </Section>
  );
};

export default CollapseFaq;
