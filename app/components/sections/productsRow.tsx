"use client";
import styled from "styled-components";
import type { Layout, ProductRowSection } from "@/lib/types";
import ProductCard from "./productCard";
import { useEffect, useState, useRef } from "react";
import { Delete } from "../C-D";

interface ProductsRowProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
  previewWidth: "sm" | "default";
}

const ScrollContainer = styled.div<{
  $data: ProductRowSection;
}>`
  position: relative;
  width: 100%;
  padding-top: ${(props) => props.$data.setting?.paddingTop || "20"}px;
  padding-bottom: ${(props) => props.$data.setting?.paddingBottom || "20"}px;
  margin-top: ${(props) => props.$data.setting?.marginTop || "20"}px;
  margin-bottom: ${(props) => props.$data.setting?.marginBottom || "20"}px;
  background-color: ${(props) =>
    props.$data.setting?.backgroundColor || "#ffffff"};
`;

const ProductsRowSection = styled.section<{
  $data: ProductRowSection;
  $isMobile: boolean;
}>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: auto;
  max-width: 100%;
  overflow-x: scroll;
  scroll-behavior: smooth;
  gap: 8px;
  padding: ${(props) => (props.$isMobile ? "10px" : "20px")};
  background-color: ${(props) =>
    props.$data.setting?.backgroundColor || "#ffffff"};
  border-radius: ${(props) =>
    props.$data.blocks?.setting?.cardBorderRadius || "8"}px;
  direction: rtl;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Heading = styled.h2<{
  $data: ProductRowSection;
  $isMobile: boolean;
}>`
  color: ${(props) => props.$data.blocks?.setting?.headingColor || "#000000"};
  font-size: ${(props) =>
    props.$isMobile
      ? "24px"
      : `${props.$data.blocks?.setting?.headingFontSize || "32"}px`};
  font-weight: ${(props) =>
    props.$data.blocks?.setting?.headingFontWeight || "bold"};
  text-align: right;
  margin-bottom: 20px;
`;

const ScrollButton = styled.button<{
  $data: ProductRowSection;
  $position: 'left' | 'right';
}>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${(props) => props.$position}: 10px;
  background: #ffffff;
  color: ${(props) => props.$data.blocks?.setting?.btnTextColor || "#000000"};
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
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
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
          animation: productRowNavPulse ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
        
        @keyframes productRowNavPulse {
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
          animation: productRowNavGlow ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
        
        @keyframes productRowNavGlow {
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
          animation: productRowNavBrightness ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
        
        @keyframes productRowNavBrightness {
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
          animation: productRowNavBlur ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
        
        @keyframes productRowNavBlur {
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
          animation: productRowNavSaturate ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
        
        @keyframes productRowNavSaturate {
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
          animation: productRowNavContrast ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
        
        @keyframes productRowNavContrast {
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
          animation: productRowNavOpacity ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
        
        @keyframes productRowNavOpacity {
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
          animation: productRowNavShadow ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
        
        @keyframes productRowNavShadow {
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

export const ProductsRow: React.FC<ProductsRowProps> = ({
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
  const [collectionProducts, setCollectionProducts] = useState([]);

  const sectionData = layout?.sections?.children?.sections.find(
    (section) => section.type === actualName
  ) as ProductRowSection;

  // Move both useEffect hooks here, before  returns
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 425) {
        setPreview("sm");
      } else {
        setPreview(previewWidth);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [previewWidth]);

  useEffect(() => {
    const fetchCollectionProducts = async () => {
      try {
        const collectionId = sectionData?.blocks?.setting?.selectedCollection;
        if (!collectionId) return;

        const response = await fetch(`/api/collections/id`, {
          headers: {
            "Content-Type": "application/json",
            collectionId: collectionId,
          },
        });
        const data = await response.json();
        setCollectionProducts(data.collections[0].products);
        console.log(
          "Collection Products:",
          data.collections[0].products
        )
      } catch (error) {
        console.log("Error fetching collection products:", error);
      }
    };

    fetchCollectionProducts();
  }, [sectionData?.blocks?.setting?.selectedCollection, actualName]);

  // Now place your conditional returns
  if (!layout || !layout.sections || !sectionData) return null;

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

  return (
    <div className="px-2">
      <ScrollContainer
        $data={sectionData}
        onClick={() => setSelectedComponent(actualName)}
        className={`transition-all duration-150 ease-in-out relative border rounded-lg  ${
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

        <Heading
          $data={sectionData}
          $isMobile={preview === "sm"}
          className="border-b-2 border-red-500 w-fit ml-auto mr-3 text-center"
        >
          {sectionData.blocks?.textHeading}
        </Heading>

        <ProductsRowSection
          ref={containerRef}
          $data={sectionData}
          $isMobile={preview === "sm"}
        >
          {collectionProducts.length > 0 ? (
            collectionProducts.map((product, idx) => (
              <ProductCard key={idx} productData={product} />
            ))
          ) : (
            <div className="flex flex-row items-center justify-start lg:justify-end w-full">
              <span className="text-gray-500 text-xl justify-center text-center w-full flex lg:gap-5">
                لطفا یک مجموعه را انتخاب کنید
              </span>
            </div>
          )}
        </ProductsRowSection>

        {/* Navigation Buttons with Animation */}
        <ScrollButton
          $data={sectionData}
          $position="left"
          onClick={() => handleScroll("left")}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#00000">
            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
          </svg>
        </ScrollButton>

        <ScrollButton
          $data={sectionData}
          $position="right"
          onClick={() => handleScroll("right")}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#00000">
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
      </ScrollContainer>
    </div>
  );
};
