"use client";
import styled from "styled-components";
import type { Layout, ProductCardData, SpecialOfferSection } from "@/lib/types";
import ProductCard from "./productCard";
import { useEffect, useState, useRef } from "react";
import { Delete } from "../C-D";
import { createApiService } from "@/lib/api-factory";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
interface Collection {
  _id: string;
  name: string;
  products?: unknown[];
}
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
  max-width: 100%;
  margin-top: ${(props) => props.$data.setting.marginTop || "30"}px;
  margin-bottom: ${(props) => props.$data.setting.marginBottom}px;
  margin-right: ${(props) => props.$data.setting.marginRight}px;
  margin-left: ${(props) => props.$data.setting.marginLeft}px;
  padding-top: ${(props) => props.$data.setting.paddingTop}px;
  padding-bottom: ${(props) => props.$data.setting.paddingBottom}px;
  padding-left: ${(props) => props.$data.setting.paddingLeft}px;
  padding-right: ${(props) => props.$data.setting.paddingRight}px;
  background-color: ${(props) =>
    props.$data.setting?.backgroundColor || "#ef394e"};
  min-height: ${(props) => props.$data.blocks.setting.height}px;

  box-shadow: ${(props) =>
    `${props.$data.blocks.setting?.shadowOffsetX || 0}px 
     ${props.$data.blocks.setting?.shadowOffsetY || 4}px 
     ${props.$data.blocks.setting?.shadowBlur || 10}px 
     ${props.$data.blocks.setting?.shadowSpread || 0}px 
     ${props.$data.blocks.setting?.shadowColor || "#fff"}`};
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
    `${props.$data.blocks?.setting?.headingFontSize || "32"}px`};
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
  background-color: ${(props) =>
    props.$data.blocks?.setting?.btnBackgroundColor || "#000000"};
  color: ${(props) => props.$data.blocks?.setting?.btnTextColor || "#000000"};
  border: none;
  border-radius: ${(props) => props.$data.blocks?.setting?.btnRadius || "5"}px;
  width: 40px;
  opacity: 0.8;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.2);

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [preview, setPreview] = useState(previewWidth);
  const containerRef = useRef<HTMLDivElement>(null);

  const sectionData = layout?.sections?.children?.sections.find(
    (section) => section.type === actualName
  ) as SpecialOfferSection;

  const api = createApiService({
    baseUrl: "/api",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        typeof window !== "undefined"
          ? localStorage.getItem("token") || ""
          : "",
    },
  });

  const collectionId = sectionData?.blocks?.setting?.selectedCollection;
  const [specialOfferProducts, setSpecialOfferProducts] = useState<
    ProductCardData[]
  >([]);

  const { data: collectionsData } = api.useGet("/collections", {
    revalidateOnFocus: false,
   });

  useEffect(() => {
    if (collectionId && collectionsData?.product) {
      const selectedCollection = collectionsData.product.find(
        (col: Collection) => col._id === collectionId
      );

      if (selectedCollection?.products) {
        setSpecialOfferProducts(selectedCollection.products);
      } else {
        setSpecialOfferProducts([]);
      }
    } else {
      setSpecialOfferProducts([]);
    }
  }, [collectionId, collectionsData]);

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
          specialOfferProducts.map((product: ProductCardData) => (
            <ProductCard key={product._id} productData={product} />
          ))}
        {specialOfferProducts.length === 0 && (
          <div className="flex flex-row items-center justify-start  lg:justify-end  w-full ">
            <span
              className={`text-white ${
                preview === "sm" ? "text-base" : "text-xl"
              } justify-center text-center w-full flex lg:gap-5`}
            >
              لطفا یک مجموعه را انتخاب کنید
            </span>
          </div>
        )}
      </SpecialOfferSection>

      {/* Navigation Buttons with Animation */}
      <ScrollButton
        className="left"
        onClick={() => handleScroll("left")}
        $data={sectionData}
      >
        <BiChevronLeft size={24} />
      </ScrollButton>

      <ScrollButton
        className="right"
        onClick={() => handleScroll("right")}
        $data={sectionData}
      >
        <BiChevronRight size={24} />
      </ScrollButton>
    </ScrollContainer>
  );
};
