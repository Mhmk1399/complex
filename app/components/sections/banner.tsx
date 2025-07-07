"use client";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import { Layout, BannerSection } from "@/lib/types";
import { Delete } from "../C-D";
import { useEffect, useState } from "react";

interface props {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
  previewWidth: "sm" | "default";
}

const SectionBanner = styled.section<{
  $data: BannerSection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  position: relative;
  height: ${(props) => (props.$preview === "sm" ? "300px" : "600px")};
  margin-top: ${(props) => props.$data.setting.marginTop || "30"}px;
  margin-bottom: ${(props) => props.$data.setting.marginBottom}px;
  padding-top: ${(props) => props.$data.setting.paddingTop}px;
  padding-bottom: ${(props) => props.$data.setting.paddingBottom}px;
  padding-left: ${(props) => props.$data.setting.paddingLeft}px;
  padding-right: ${(props) => props.$data.setting.paddingRight}px;
  
  @media (max-width: 768px) {
    height: ${(props) => (props.$preview === "sm" ? "200px" : "300px")};
  }
`;

const BannerImage = styled(Image)<{
  $data: BannerSection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  opacity: ${(props) => props.$data.blocks.setting.opacityImage || "1"};
  border-radius: ${(props) =>
    props.$data.blocks.setting.imageRadious || "10px"};
  object-fit: ${(props) => props.$data.blocks.setting.imageBehavior || "cover"};
`;

const BannerTextBox = styled.div<{
  $data: BannerSection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: ${(props) => props.$data.blocks.setting.opacityTextBox || "1"};
  background-color: ${(props) =>
    props.$data.blocks.setting.backgroundColorBox || "rgba(0, 0, 0, 0.5)"};
  padding: ${(props) => (props.$preview === "sm" ? "20px 30px" : "70px 20px")};
  border-radius: ${(props) =>
    props.$data.blocks.setting.backgroundBoxRadious || "10"}px;

  /* Create a pseudo-element for animations that doesn't affect positioning */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    pointer-events: none;
    z-index: -1;
  }

  /* Apply animations to the pseudo-element or specific properties that don't affect transform */
  ${(props) => {
    const animation = props.$data.blocks.setting.animation;
    if (!animation) return '';
    
    const { type, animation: animConfig } = animation;
    const selector = type === 'hover' ? '&:hover' : '&:active';
    
    // Handle different animation types
    if (animConfig.type === 'pulse') {
      return `
        ${selector} {
          animation: bannerPulse ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
      `;
    } else if (animConfig.type === 'ping') {
      return `
        ${selector}::before {
          animation: bannerPing ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
      `;
    } else if (animConfig.type === 'bgOpacity') {
      return `
        ${selector} {
          animation: bannerBgOpacity ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
      `;
    } else if (animConfig.type === 'scaleup') {
      return `
        ${selector} {
          animation: bannerScaleup ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
      `;
    } else if (animConfig.type === 'scaledown') {
      return `
        ${selector} {
          animation: bannerScaledown ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
      `;
    }
    
    return '';
  }}

  /* Animation keyframes that don't affect positioning */
  @keyframes bannerPulse {
    0%, 100% { 
      opacity: 1;
      filter: brightness(1);
    }
    50% { 
      opacity: 0.7;
      filter: brightness(1.2);
    }
  }
  
  @keyframes bannerPing {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    75%, 100% {
      transform: scale(1.2);
      opacity: 0;
    }
  }
  
  @keyframes bannerBgOpacity {
    0%, 100% { 
      background-color: ${(props) => props.$data.blocks.setting.backgroundColorBox || "rgba(0, 0, 0, 0.5)"};
    }
    50% { 
      background-color: ${(props) => {
        const bgColor = props.$data.blocks.setting.backgroundColorBox || "rgba(0, 0, 0, 0.5)";
        if (bgColor.startsWith('#')) {
          const r = parseInt(bgColor.slice(1, 3), 16);
          const g = parseInt(bgColor.slice(3, 5), 16);
          const b = parseInt(bgColor.slice(5, 7), 16);
          return `rgba(${r}, ${g}, ${b}, 0.3)`;
        }
        return bgColor;
      }};
    }
  }
  
  @keyframes bannerScaleup {
    0% {
      filter: brightness(1);
    }
    100% {
      filter: brightness(1.1) contrast(1.1);
    }
  }
  
  @keyframes bannerScaledown {
    0% {
      filter: brightness(1);
    }
    100% {
      filter: brightness(0.9) contrast(0.9);
    }
  }
`;

const HeadingText = styled.h2<{
  $data: BannerSection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  color: ${(props) => props.$data.blocks.setting.textColor || "#ffffff"};
  font-size: ${(props) =>
    props.$preview === "sm"
      ? "18px"
      : props.$data.blocks.setting.textFontSize || "16px"}px;
  font-weight: ${(props) =>
    props.$data.blocks.setting.textFontWeight || "bold"};
  text-align: center;
  @media (max-width: 768px) {
    font-size: ${(props) => (props.$preview === "sm" ? "16px" : "28px")};
  }
`;

const DescriptionText = styled.p<{
  $data: BannerSection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  color: ${(props) => props.$data.blocks.setting.descriptionColor || "#ffffff"};
  font-size: ${(props) =>
    props.$preview === "sm"
      ? "14px"
      : props.$data.blocks.setting.descriptionFontSize || "16px"}px;
  font-weight: ${(props) =>
    props.$data.blocks.setting.descriptionFontWeight || "normal"};
  margin-top: 14px;
  text-align: center;
  @media (max-width: 768px) {
    font-size: ${(props) => (props.$preview === "sm" ? "12px" : "16px")};
  }
`;

const Banner: React.FC<props> = ({
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
    if (window.innerWidth < 426) {
      setPreview("sm");
    } else {
      setPreview(previewWidth);
    }
  }, [previewWidth]);

  const sectionData = layout?.sections?.children?.sections.find(
    (section) => section.type === actualName
  ) as BannerSection;

  if (!sectionData) {
    return null;
  }

  const { description, imageAlt, imageSrc, text } = sectionData?.blocks;

  return (
    <SectionBanner
      $previewWidth={previewWidth}
      $preview={preview}
      $data={sectionData}
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

      <Link
        href={"#"}
        style={{
          position: "relative",
          display: "block",
          width: "100%",
          height: "100%",
        }}
      >
        <BannerImage
          $preview={preview}
          $previewWidth={previewWidth}
          $data={sectionData}
          alt={imageAlt || "banner"}
          src={imageSrc || "/assets/images/banner2.webp"}
          fill
          priority
        />
      </Link>
      <BannerTextBox
        $data={sectionData}
        $previewWidth={previewWidth}
        $preview={preview}
      >
        <HeadingText
          $data={sectionData}
          $previewWidth={previewWidth}
          $preview={preview}
        >
          {text || "سربرگ بنر"}
        </HeadingText>
        <DescriptionText
          $data={sectionData}
          $previewWidth={previewWidth}
          $preview={preview}
        >
          {description || "توضیحات بنر"}
        </DescriptionText>
      </BannerTextBox>
    </SectionBanner>
  );
};

export default Banner;
