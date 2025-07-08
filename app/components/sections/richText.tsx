"use client";
import { Layout, RichTextSection, RichTextBlock } from "@/lib/types";
import Link from "next/link";
import styled from "styled-components";
import { Delete } from "../C-D";
import { useEffect, useState } from "react";

interface RichTextProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
  previewWidth: "sm" | "default";
}

// Styled components
const Section = styled.section<{
  $data: RichTextSection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  padding-top: ${(props) => props.$data?.setting?.paddingTop || "10"}px;
  padding-bottom: ${(props) => props.$data?.setting?.paddingBottom || "10"}px;
  padding-left: ${(props) => props.$data?.setting?.paddingLeft || "10"}px;
  padding-right: ${(props) => props.$data?.setting?.paddingRight || "10"}px;
  margin-top: ${(props) => props.$data?.setting?.marginTop || "30"}px;
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom || "30"}px;
  background-color: ${(props) =>
    props.$data?.blocks?.setting?.background || "#ffffff"};
  display: flex;
  flex-direction: column;
  border-radius: 30px;
  align-items: center;
  margin-left: 10px;
  margin-right: 10px;
  gap: 15px;
`;

const H1 = styled.h1<{
  $data: RichTextBlock;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  color: ${(props) => props.$data?.setting?.textHeadingColor || "#000"};
  font-size: ${(props) =>
    props.$preview === "sm"
      ? "18"
      : props.$data?.setting?.textHeadingFontSize || "24"}px;
  font-weight: ${(props) =>
    props.$data?.setting?.textHeadingFontWeight || "bold"};
  // border-bottom: 3px solid #ffffff;
  padding-bottom: 10px;
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const P = styled.p<{
  $data: RichTextBlock;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  color: ${(props) => props.$data?.setting?.descriptionColor || "#666"};
  text-align: center;
  padding: 0px 70px;
  font-size: ${(props) =>
    props.$preview === "sm"
      ? "14"
      : props.$data?.setting?.descriptionFontSize || "24"}px;
  font-weight: ${(props) =>
    props.$data?.setting?.descriptionFontWeight || "normal"};
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const HR = styled.hr<{
  $data: RichTextBlock;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  background-color: ${(props) => props.$data?.setting?.lineColor || "#000"};
  width: ${(props) => props.$data?.setting?.lineWidth || "500"}px;
  height: ${(props) => props.$data?.setting?.lineHeight || "0"}px;
  margin-bottom: ${(props) => props.$data?.setting?.lineBottom || "1"}px;
  margin-top: ${(props) => props.$data?.setting?.lineTop || "1"}px;
`;

const Btn = styled.button<{
  $data: RichTextBlock;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  color: ${(props) => props.$data?.setting?.btnTextColor || "#fff"};
  background-color: ${(props) =>
    props.$data?.setting?.btnBackgroundColor || "#007BFF"};
  padding: ${(props) => (props.$preview === "sm" ? "7px 20px" : "15px 30px")};
  border-radius: 5px;
  border: none;
  cursor: pointer;


  /* Apply button animations */
  ${(props) => {
    const btnAnimation = props.$data?.setting?.btnAnimation;
    if (!btnAnimation) return '';
    
    const { type, animation: animConfig } = btnAnimation;
    const selector = type === 'hover' ? '&:hover' : '&:active';
    
    // Generate animation CSS based on type
    if (animConfig.type === 'pulse') {
      return `
        ${selector} {
          animation: richTextBtnPulse ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
        
        @keyframes richTextBtnPulse {
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
    } else if (animConfig.type === 'glow') {
      return `
        ${selector} {
          animation: richTextBtnGlow ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
        
        @keyframes richTextBtnGlow {
          0%, 100% { 
            filter: brightness(1) drop-shadow(0 0 0px rgba(255, 255, 255, 0));
          }
          50% { 
            filter: brightness(1.2) drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
          }
        }
      `;
    } else if (animConfig.type === 'brightness') {
      return `
        ${selector} {
          animation: richTextBtnBrightness ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
        
        @keyframes richTextBtnBrightness {
          0%, 100% { 
            filter: brightness(1);
          }
          50% { 
            filter: brightness(1.4);
          }
        }
      `;
    } else if (animConfig.type === 'blur') {
      return `
        ${selector} {
          animation: richTextBtnBlur ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
        
        @keyframes richTextBtnBlur {
          0%, 100% { 
            filter: blur(0px);
          }
          50% { 
            filter: blur(2px);
          }
        }
      `;
    } else if (animConfig.type === 'saturate') {
      return `
        ${selector} {
          animation: richTextBtnSaturate ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
        
        @keyframes richTextBtnSaturate {
          0%, 100% { 
            filter: saturate(1);
          }
          50% { 
            filter: saturate(1.8);
          }
        }
      `;
    } else if (animConfig.type === 'contrast') {
      return `
        ${selector} {
          animation: richTextBtnContrast ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
        
        @keyframes richTextBtnContrast {
          0%, 100% { 
            filter: contrast(1);
          }
          50% { 
            filter: contrast(1.5);
          }
        }
      `;
    } else if (animConfig.type === 'opacity') {
      return `
        ${selector} {
          animation: richTextBtnOpacity ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
        
        @keyframes richTextBtnOpacity {
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
    } else if (animConfig.type === 'shadow') {
      return `
        ${selector} {
          animation: richTextBtnShadow ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
        
        @keyframes richTextBtnShadow {
          0%, 100% { 
            filter: drop-shadow(0 0 0px rgba(0, 0, 0, 0));
          }
          50% { 
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
          }
        }
      `;
    }
    
    return '';
  }}
`;

// Update the section data assignment with type checking
const RichText: React.FC<RichTextProps> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
  setLayout,
  previewWidth,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [preview, setPreview] = useState(previewWidth);

  useEffect(() => {
    if (window.innerWidth <= 425) {
      setPreview("sm");
    } else {
      setPreview(previewWidth);
    }
  }, [previewWidth]);
  
  const sectionData = layout?.sections?.children?.sections?.find(
    (section) => section.type === actualName
  ) as RichTextSection;

  if (!sectionData) {
    return null;
  }

  // Add type guard to verify section type
  const { blocks } = sectionData;

  // Type guard for RichTextBlock
  const { textHeading, description, btnText, btnLink } = blocks;

  return (
    <Section
      $preview={preview}
      $previewWidth={previewWidth}
      dir="rtl"
      $data={sectionData}
      onClick={() => setSelectedComponent(actualName)}
      className={`transition-all duration-150 ease-in-out relative ${
        selectedComponent === actualName
          ? "border-4 border-blue-500 rounded-lg shadow-lg "
          : ""
      }`}
    >
      {showDeleteModal && (
        <div className="fixed inset-0  bg-black bg-opacity-70 z-50 flex items-center justify-center ">
          <div className="bg-white p-8 rounded-lg">
            <h3 className="text-lg font-bold mb-4 ">
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

      {textHeading && (
        <H1 $data={blocks} $previewWidth={previewWidth} $preview={preview}>
          {textHeading}
        </H1>
      )}

      <HR
        $previewWidth={previewWidth}
        $data={blocks}
        $preview={preview}
        className=" mx-auto"
      />

      {description && (
        <P $previewWidth={previewWidth} $data={blocks} $preview={preview}>
          {description}
        </P>
      )}
      {btnLink && (
        <Link href={btnLink || "#"} passHref legacyBehavior>
          <Btn $data={blocks} $previewWidth={previewWidth} $preview={preview}>
            {btnText}
          </Btn>
        </Link>
      )}
    </Section>
  );
};

export default RichText;
