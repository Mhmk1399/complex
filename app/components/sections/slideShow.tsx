"use client";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import {
  SlideSection,
  Layout,
  SlideBlock,
  SlideBlockSetting,
} from "@/lib/types";
import { Delete } from "../C-D";
import Link from "next/link";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

interface SlideShowProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
  previewWidth: "sm" | "default";
}

const SectionSlideShow = styled.section<{
  $data: SlideSection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  max-width: 100%;
  margin-top: ${(props) => props.$data.setting.marginTop || 0}px;
  margin-bottom: ${(props) => props.$data.setting.marginBottom || 0}px;
  margin-right: ${(props) => props.$data.setting.marginRight || 0}px;
  margin-left: ${(props) => props.$data.setting.marginLeft || 0}px;
  padding: ${(props) =>
    `${props.$data.setting.paddingTop}px ${props.$data.setting.paddingRight}px ${props.$data.setting.paddingBottom}px ${props.$data.setting.paddingLeft}px`};
  background-color: ${(props) =>
    props.$data.setting.backgroundColorBox || "transparent"};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  position: relative;
  box-shadow: ${(props) =>
    `${props.$data.setting.shadowOffsetX || 0}px 
     ${props.$data.setting.shadowOffsetY || 4}px 
     ${props.$data.setting.shadowBlur || 10}px 
     ${props.$data.setting.shadowSpread || 0}px 
     ${props.$data.setting.shadowColor || "#fff"}`};
`;

const SlideContainer = styled.div<{
  $data: SlideBlockSetting;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  width: 100%;
  max-width: ${(props) => (props.$preview === "sm" ? "400px" : "2000px")};
  overflow: hidden;
  border-radius: 16px;
`;

const SlidesWrapper = styled.div<{ $currentIndex: number }>`
  display: flex;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(${(props) => props.$currentIndex * -100}%);
  will-change: transform;
`;

const Slide = styled.div`
  flex: 0 0 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;

  /* Smooth fade-in on mount */
  animation: fadeIn 0.5s ease;
  @keyframes fadeIn {
    from {
      opacity: 0.6;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const SlideImage = styled.img<{
  $data: SlideSection["setting"];
  $imageAnimation?: SlideSection["setting"]["imageAnimation"];
}>`
  width: ${(props) => props.$data?.imageWidth || "200"}px;
  height: ${(props) => props.$data?.imageHeight || "200"}px;
  position: relative;

  border-radius: ${(props) => props.$data?.imageRadious || "12"}px;
  opacity: ${(props) => props.$data?.opacityImage || 1};
  object-fit: ${(props) => props.$data?.imageBehavior || "cover"};
  transition: transform 0.4s ease, opacity 0.4s ease;

  /* Apply image animations */
  ${(props) => {
    const imageAnimation = props.$imageAnimation;
    if (!imageAnimation) return "";

    const { type, animation: animConfig } = imageAnimation;
    const selector = type === "hover" ? "&:hover" : "&:active";

    // Generate animation CSS based on type
    if (animConfig.type === "pulse") {
      const baseOpacity = Number(props.$data?.opacityImage || 1);
      return `
        ${selector} {
          animation: slideImagePulse ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideImagePulse {
          0%, 100% { 
            opacity: ${baseOpacity};
            filter: brightness(1);
          }
          50% { 
            opacity: ${Math.max(0.3, baseOpacity - 0.4)};
            filter: brightness(1.3);
          }
        }
      `;
    } else if (animConfig.type === "glow") {
      return `
        ${selector} {
          animation: slideImageGlow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideImageGlow {
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
          animation: slideImageBrightness ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideImageBrightness {
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
          animation: slideImageBlur ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideImageBlur {
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
          animation: slideImageSaturate ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideImageSaturate {
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
          animation: slideImageContrast ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideImageContrast {
          0%, 100% { 
            filter: contrast(1);
          }
          50% { 
            filter: contrast(1.5);
          }
        }
      `;
    } else if (animConfig.type === "opacity") {
      const baseOpacity = Number(props.$data?.opacityImage || 1);
      return `
        ${selector} {
          animation: slideImageOpacity ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideImageOpacity {
          0% { 
            opacity: ${baseOpacity};
          }
          50% { 
            opacity: ${Math.max(0.2, baseOpacity - 0.6)};
          }
          100% { 
            opacity: ${baseOpacity};
          }
        }
      `;
    } else if (animConfig.type === "shadow") {
      return `
        ${selector} {
          animation: slideImageShadow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideImageShadow {
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

const SlideTextBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 15px;
  padding: 0 12px;
  text-align: center;
`;

const SlideHeading = styled.h3<{
  $data: SlideSection["setting"];
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  color: ${(props) => props.$data.textColor || "#111"};
  font-size: ${(props) => props.$data?.textFontSize || "22"}px;
  font-weight: ${(props) => props.$data.textFontWeight || "600"};
  margin: 8px 0;
  letter-spacing: 0.3px;
`;

const SlideDescription = styled.p<{
  $data: SlideSection["setting"];
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  color: ${(props) => props.$data.descriptionColor || "#555"};
  font-size: ${(props) => props.$data?.descriptionFontSize || "18"}px;
  font-weight: ${(props) => props.$data.descriptionFontWeight || "400"};
  line-height: 1.6;
  margin-top: 5px;
`;

const NavButton = styled.button<{
  $data: SlideSection;
  $navAnimation?: SlideSection["setting"]["navAnimation"];
}>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: ${(props) =>
    props.$data.setting.navBg
      ? props.$data.setting.navBg + "B3" // HEX + alpha (B3 = ~70%)
      : "rgba(85,85,85,0.7)"};
  color: ${(props) => props.$data.setting.navColor || "#fff"};
  padding: 10px;
  border: none;
  border-radius: ${(props) => props.$data.setting.navRadius || "2"}px;
  cursor: pointer;
  z-index: 10;

  @media (max-width: 768px) {
    padding: 7px;
  }

  /* Apply navigation button animations */
  ${(props) => {
    const navAnimation = props.$navAnimation;
    if (!navAnimation) return "";

    const { type, animation: animConfig } = navAnimation;
    const selector = type === "hover" ? "&:hover" : "&:active";

    // Generate animation CSS based on type
    if (animConfig.type === "pulse") {
      return `
        ${selector} {
          animation: slideNavPulse ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideNavPulse {
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
          animation: slideNavGlow ${animConfig.duration} ${animConfig.timing} ${
        animConfig.delay || "0s"
      } ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideNavGlow {
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
          animation: slideNavBrightness ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideNavBrightness {
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
          animation: slideNavBlur ${animConfig.duration} ${animConfig.timing} ${
        animConfig.delay || "0s"
      } ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideNavBlur {
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
          animation: slideNavSaturate ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideNavSaturate {
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
          animation: slideNavContrast ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideNavContrast {
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
          animation: slideNavOpacity ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideNavOpacity {
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
          animation: slideNavShadow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideNavShadow {
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

const PrevButton = styled(NavButton)`
  left: 5px;
`;

const NextButton = styled(NavButton)`
  right: 5px;
`;

const Button = styled.button<{
  $data: SlideSection;
  $btnAnimation?: SlideSection["setting"]["btnAnimation"];
}>`
  margin-top: 12px;
  text-align: center;
  background-color: ${(props) =>
    props.$data?.setting?.btnBackgroundColor || "#007bff"};
  color: ${(props) => props.$data?.setting?.btnTextColor || "#fff"};
  padding: 10px 22px;
  border: none;
  border-radius: ${(props) => props.$data?.setting?.btnRadius || "50"}px;
  cursor: pointer;
  font-weight: 500;
  font-size: 15px;
  transition: all 0.3s ease;
  width: ${(props) => props.$data?.setting?.btnWidth || "50"}px;

  /* Apply button animations */
  ${(props) => {
    const btnAnimation = props.$btnAnimation;
    if (!btnAnimation) return "";

    const { type, animation: animConfig } = btnAnimation;
    const selector = type === "hover" ? "&:hover" : "&:active";

    // Generate animation CSS based on type
    if (animConfig.type === "pulse") {
      return `
        ${selector} {
          animation: slideBtnPulse ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideBtnPulse {
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
          animation: slideBtnGlow ${animConfig.duration} ${animConfig.timing} ${
        animConfig.delay || "0s"
      } ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideBtnGlow {
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
          animation: slideBtnBrightness ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideBtnBrightness {
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
          animation: slideBtnBlur ${animConfig.duration} ${animConfig.timing} ${
        animConfig.delay || "0s"
      } ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideBtnBlur {
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
          animation: slideBtnSaturate ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideBtnSaturate {
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
          animation: slideBtnContrast ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideBtnContrast {
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
          animation: slideBtnOpacity ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideBtnOpacity {
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
          animation: slideBtnShadow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideBtnShadow {
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

const SlideShow: React.FC<SlideShowProps> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
  setLayout,
  previewWidth,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [preview, setPreview] = useState(previewWidth);

  useEffect(() => {
    if (window.innerWidth <= 425) {
      setPreview("sm");
    } else {
      setPreview(previewWidth);
    }
  }, [previewWidth]);

  const sectionData = layout?.sections?.children?.sections.find(
    (section) => section.type === actualName
  ) as SlideSection;

  // Also add an early return if layout is not properly initialized
  if (!layout || !layout.sections) {
    return null;
  }

  if (!sectionData) return null;

  const blocks = Object.values(sectionData.blocks || {}) as SlideBlock[];

  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % (blocks.length || 1));
  const handlePrev = () =>
    setCurrentIndex(
      (prev) => (prev - 1 + (blocks.length || 1)) % (blocks.length || 1)
    );

  if (currentIndex >= (blocks.length || 0)) {
    setCurrentIndex(blocks.length - 1);
    return null;
  }

  return (
    <SectionSlideShow
      $preview={preview}
      $data={sectionData}
      $previewWidth={previewWidth}
      onClick={() => setSelectedComponent(actualName)}
      className={`transition-all duration-150 ease-in-out relative ${
        selectedComponent === actualName
          ? "border-4 border-blue-500 rounded-2xl shadow-lg "
          : ""
      }`}
    >
      {showDeleteModal && (
        <div className="fixed inset-0  bg-black bg-opacity-70 z-50 flex items-center justify-center ">
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
        <div className="absolute w-fit -top-5 -left-1 z-10 flex ">
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

      <SlideContainer
        $data={sectionData}
        $previewWidth={previewWidth}
        $preview={preview}
      >
        <SlidesWrapper $currentIndex={currentIndex}>
          {blocks.map((slide, index) => (
            <Slide key={index}>
              <SlideImage
                src={slide.imageSrc}
                alt={slide.imageAlt || "Slide"}
                $data={sectionData.setting}
                $imageAnimation={sectionData.setting?.imageAnimation}
              />
              <SlideTextBox>
                <SlideHeading
                  $preview={preview}
                  $data={sectionData.setting}
                  $previewWidth={previewWidth}
                >
                  {slide.text}
                </SlideHeading>
                <SlideDescription
                  $preview={preview}
                  $data={sectionData.setting}
                  $previewWidth={previewWidth}
                >
                  {slide.description}
                </SlideDescription>
                <Button
                  $data={sectionData}
                  $btnAnimation={sectionData.setting?.btnAnimation}
                >
                  <Link href={"#"}>
                    {slide.btnText ? slide.btnText : "بیشتر بخوانید"}
                  </Link>
                </Button>
              </SlideTextBox>
            </Slide>
          ))}
        </SlidesWrapper>

        <PrevButton
          onClick={handlePrev}
          $data={sectionData}
          $navAnimation={sectionData.setting?.navAnimation}
        >
          <BiChevronLeft size={24} />
        </PrevButton>

        <NextButton
          onClick={handleNext}
          $data={sectionData}
          $navAnimation={sectionData.setting?.navAnimation}
        >
          <BiChevronRight size={24} />
        </NextButton>
      </SlideContainer>
    </SectionSlideShow>
  );
};

export default SlideShow;
