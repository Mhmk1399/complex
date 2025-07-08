"use client";
import styled from "styled-components";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Delete } from "../C-D";
import type { Layout, BrandsSection } from "@/lib/types";

interface BrandsProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
  previewWidth: "sm" | "default";
}

const BrandsContainer = styled.div<{
  $data: BrandsSection;
}>`
  padding-top: ${(props) => props.$data.setting?.paddingTop || "5"}px;
  padding-bottom: ${(props) => props.$data.setting?.paddingBottom || "5"}px;
  margin-top: ${(props) => props.$data.setting?.marginTop || "2"}px;
  margin-bottom: ${(props) => props.$data.setting?.marginBottom || "2"}px;
  background-color: ${(props) =>
    props.$data.setting?.backgroundColor || "#FFFFFF"};
  border-radius: ${(props) => props.$data.setting?.borderRadius || "20"}px;
  border: ${(props) => props.$data.setting?.border || "1px solid #E0E0E0"};
`;

const Heading = styled.h2<{
  $data: BrandsSection;
  $isMobile: boolean;
}>`
  color: ${(props) => props.$data.blocks?.setting?.headingColor || "#14213D"};
  font-size: ${(props) =>
    props.$isMobile
      ? "24px"
      : `${props.$data.blocks?.setting?.headingFontSize || "32"}px`};
  font-weight: ${(props) =>
    props.$data.blocks?.setting?.headingFontWeight || "bold"};
  text-align: center;
  margin-bottom: 2rem;
`;

const BrandsGrid = styled.div<{
  $data: BrandsSection;
  $isMobile: boolean;
}>`
  display: flex;
  flex-wrap: nowrap;
  justify-content: start;
  overflow-x: scroll;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const ScrollButton = styled.button<{
  $data: BrandsSection;
}>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: #ffffff;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &.left {
    left: 10px;
  }

  &.right {
    right: 10px;
  }

  /* Apply navigation button animations */
  ${(props) => {
    const navAnimation = props.$data.blocks?.setting?.navAnimation;
    if (!navAnimation) return '';
    
    const { type, animation: animConfig } = navAnimation;
    const selector = type === 'hover' ? '&:hover' : '&:active';
    
    // Generate animation CSS based on type
    if (animConfig.type === 'pulse') {
      return `
        ${selector} {
          animation: brandNavPulse ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
        
        @keyframes brandNavPulse {
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
          animation: brandNavGlow ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
        
        @keyframes brandNavGlow {
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
          animation: brandNavBrightness ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
        
        @keyframes brandNavBrightness {
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
          animation: brandNavBlur ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
        
        @keyframes brandNavBlur {
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
          animation: brandNavSaturate ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
        
        @keyframes brandNavSaturate {
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
          animation: brandNavContrast ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
        
        @keyframes brandNavContrast {
          0%, 100% { 
            filter: contrast(1)          }
          50% { 
            filter: contrast(1.5);
          }
        }
      `;
    } else if (animConfig.type === 'opacity') {
      return `
        ${selector} {
          animation: brandNavOpacity ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
        
        @keyframes brandNavOpacity {
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
          animation: brandNavShadow ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
        
        @keyframes brandNavShadow {
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

const BrandCard = styled.a<{
  $data: BrandsSection;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background-color: ${(props) =>
    props.$data.blocks?.setting?.cardBackground || "#FFFFFF"};
  transition: all 0.3s ease;
`;

const BrandName = styled.span<{
  $data: BrandsSection;
}>`
  color: ${(props) => props.$data.blocks?.setting?.brandNameColor || "#666666"};
  font-size: ${(props) =>
    props.$data.blocks?.setting?.brandNameFontSize || "16"}px;
  font-weight: ${(props) =>
    props.$data.blocks?.setting?.brandNameFontWeight || "normal"};
  margin-top: 0.5rem;
`;

export const Brands: React.FC<BrandsProps> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
  setLayout,
  previewWidth,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [preview, setPreview] = useState(previewWidth);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setPreview(window.innerWidth <= 425 ? "sm" : previewWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [previewWidth]);

  const handleScroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = 400;
      const newScrollPosition =
        containerRef.current.scrollLeft +
        (direction === "left" ? scrollAmount : -scrollAmount);
      containerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

  const sectionData = layout?.sections?.children?.sections.find(
    (section) => section.type === actualName
  ) as BrandsSection;

  if (!layout || !layout.sections || !sectionData) return null;

  return (
    <div
      onClick={() => setSelectedComponent(actualName)}
      className={`transition-all duration-150 ease-in-out relative ${
        selectedComponent === actualName
          ? "border-4 border-blue-500 rounded-2xl shadow-lg"
          : ""
      }`}
    >
      <BrandsContainer
        $data={sectionData}
        onClick={() => setSelectedComponent(actualName)}
        className={`transition-all duration-150 ease-in-out relative ${
          selectedComponent === actualName
            ? "border-4 border-blue-500 rounded-2xl shadow-lg"
            : ""
        }`}
      >
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

        <Heading $data={sectionData} $isMobile={preview === "sm"}>
          {sectionData.blocks?.heading}
        </Heading>

        <BrandsGrid
          ref={containerRef}
          $data={sectionData}
          $isMobile={preview === "sm"}
          dir="rtl"
        >
          {sectionData.blocks?.brands.map((brand) => (
            <BrandCard
              className="border-l p-3"
              key={brand.id}
              $data={sectionData}
            >
              <div
                className="relative "
                style={{
                  width: `${sectionData.blocks?.setting?.logoWidth || 96}px`,
                  height: `${sectionData.blocks?.setting?.logoHeight || 96}px`,
                }}
              >
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-contain"
                />
              </div>
              <BrandName $data={sectionData}>{brand.name}</BrandName>
            </BrandCard>
          ))}
        </BrandsGrid>

        {/* Left Scroll Button with Animation */}
        <ScrollButton
          className="left bg-white"
          onClick={() => handleScroll("left")}
          $data={sectionData}
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
          </svg>
        </ScrollButton>

        {/* Right Scroll Button with Animation */}
        <ScrollButton
          className="right bg-white"
          onClick={() => handleScroll("right")}
          $data={sectionData}
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </ScrollButton>

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-lg font-bold mb-4">
                مطمئن هستید؟
                <span className="text-blue-400 font-bold mx-1">
                  {actualName}
                </span>{" "}
                آیا از حذف
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
      </BrandsContainer>
    </div>
  );
};

