"use client";
import styled from "styled-components";
import type { Layout, ProductCardData, SpecialOfferSection } from "@/lib/types";
import ProductCard from "./productCard";
import { useEffect, useState, useRef } from "react";
import { Delete } from "../C-D";

interface SpecialOfferProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
  previewWidth: "sm" | "default";
}

const ScrollContainer = styled.div<{
  $data: SpecialOfferSection;
}>`
  position: relative;
  width: 100%;
  padding-top: ${(props) => props.$data.setting?.paddingTop || "20"}px;
  padding-bottom: ${(props) => props.$data.setting?.paddingBottom || "20"}px;
  margin-top: ${(props) => props.$data.setting?.marginTop || "20"}px;
  margin-bottom: ${(props) => props.$data.setting?.marginBottom || "20"}px;
  background-color: ${(props) =>
    props.$data.setting?.backgroundColor || "#ef394e"};
`;

const SpecialOfferSection = styled.section<{
  $data: SpecialOfferSection;
  $isMobile: boolean;
}>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: auto;
  max-width: 100%;
  overflow-x: scroll;
  scroll-behavior: smooth;
  gap: 8px;
  padding: ${(props) => (props.$isMobile ? "10px" : "20px")};
  background-color: ${(props) =>
    props.$data.setting?.backgroundColor || "#ef394e"};
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
  $data: SpecialOfferSection;
  $isMobile: boolean;
}>`
  color: ${(props) => props.$data.blocks?.setting?.headingColor || "#FFFFFF"};
  font-size: ${(props) =>
    props.$isMobile
      ? "24px"
      : `${props.$data.blocks?.setting?.headingFontSize || "32"}px`};
  font-weight: ${(props) =>
    props.$data.blocks?.setting?.headingFontWeight || "bold"};
  text-align: center;
`;

const ScrollButton = styled.button<{
  $data: SpecialOfferSection;
}>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: "#FFFFFF";
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

  &.left {
    left: 10px;
  }

  &.right {
    right: 10px;
  }

  /* Apply navigation button animations */
  ${(props) => {
    const navAnimation = props.$data.blocks?.setting?.navAnimation;
    if (!navAnimation) return "";

    const { type, animation: animConfig } = navAnimation;
    const selector = type === "hover" ? "&:hover" : "&:active";

    // Generate animation CSS based on type
    if (animConfig.type === "pulse") {
      return `
          ${selector} {
            animation: specialOfferNavPulse ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes specialOfferNavPulse {
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
            animation: specialOfferNavGlow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes specialOfferNavGlow {
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
            animation: specialOfferNavBrightness ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes specialOfferNavBrightness {
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
            animation: specialOfferNavBlur ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes specialOfferNavBlur {
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
            animation: specialOfferNavSaturate ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes specialOfferNavSaturate {
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
            animation: specialOfferNavContrast ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes specialOfferNavContrast {
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
            animation: specialOfferNavOpacity ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes specialOfferNavOpacity {
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
            animation: specialOfferNavShadow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes specialOfferNavShadow {
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

export const SpecialOffer: React.FC<SpecialOfferProps> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
  setLayout,
  previewWidth,
}) => {
  const [specialOfferProducts, setSpecialOfferProducts] = useState<
    ProductCardData[]
  >([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [preview, setPreview] = useState(previewWidth);
  const containerRef = useRef<HTMLDivElement>(null);

  const sectionData = layout?.sections?.children?.sections.find(
    (section) => section.type === actualName
  ) as SpecialOfferSection;

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
    const fetchData = async () => {
      const sectionData = layout?.sections?.children?.sections.find(
        (section) => section.type === actualName
      ) as SpecialOfferSection;

      const collectionId = sectionData?.blocks?.setting?.selectedCollection;
      if (!collectionId) return;

      const response = await fetch(`/api/collections/id`, {
        headers: {
          "Content-Type": "application/json",
          collectionId: collectionId,
        },
      });
      const data = await response.json();
      if (data.collections.length > 0) {
        setSpecialOfferProducts(data.collections[0].products);
      }
    };

    fetchData();
  }, [actualName, sectionData?.blocks?.setting?.selectedCollection]);

  if (!sectionData) return null;
  if (!layout || !layout.sections) return null;

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
    <ScrollContainer
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
      <SpecialOfferSection
        ref={containerRef}
        $data={sectionData}
        $isMobile={preview === "sm"}
      >
        <div className="flex flex-col items-center justify-center gap-y-10 px-10">
          <Heading $data={sectionData} $isMobile={preview === "sm"}>
            {sectionData.blocks?.textHeading}
          </Heading>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="50px"
            viewBox="0 -960 960 960"
            width="50px"
            fill={sectionData.blocks?.setting.headingColor}
          >
            <path d="M300-520q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41Zm0-80q25 0 42.5-17.5T360-660q0-25-17.5-42.5T300-720q-25 0-42.5 17.5T240-660q0 25 17.5 42.5T300-600Zm360 440q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41Zm0-80q25 0 42.5-17.5T720-300q0-25-17.5-42.5T660-360q-25 0-42.5 17.5T600-300q0 25 17.5 42.5T660-240Zm-444 80-56-56 584-584 56 56-584 584Z" />
          </svg>
        </div>

        {specialOfferProducts.length > 0 &&
          specialOfferProducts.map((product) => (
            <ProductCard key={product._id} productData={product} />
          ))}
        {specialOfferProducts.length === 0 && (
          <div className="flex flex-row items-center justify-start  lg:justify-end  w-full ">
            <span className="text-white text-3xl justify-center text-center w-full flex lg:gap-5">
              لطفا یک مجموعه را انتخاب کنید
            </span>
          </div>
        )}
      </SpecialOfferSection>

      {/* Navigation Buttons with Animation */}
      <ScrollButton
        className="left bg-white"
        onClick={() => handleScroll("left")}
        $data={sectionData}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#000000">
          <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
        </svg>
      </ScrollButton>

      <ScrollButton
        className="right bg-white"
        onClick={() => handleScroll("right")}
        $data={sectionData}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#000000">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </ScrollButton>
    </ScrollContainer>
  );
};
