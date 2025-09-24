"use client";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import { Layout, GallerySection } from "@/lib/types";
import { useState, useEffect } from "react";
import { Delete } from "../C-D";

interface GalleryProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
  previewWidth: "sm" | "default";
}

const Section = styled.section<{
  $data: GallerySection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
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
    props.$data?.blocks?.setting?.background || "#ffffff"};
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: ${(props) => props.$data.blocks?.setting?.Radius || "5"}px;
  box-shadow: ${(props) =>
    `${props.$data.blocks.setting?.shadowOffsetX || 0}px 
     ${props.$data.blocks.setting?.shadowOffsetY || 4}px 
     ${props.$data.blocks.setting?.shadowBlur || 10}px 
     ${props.$data.blocks.setting?.shadowSpread || 0}px 
     ${props.$data.blocks.setting?.shadowColor || "#fff"}`};
`;

const Title = styled.h2<{ $data: GallerySection }>`
  color: ${(props) => props.$data?.blocks?.setting?.titleColor || "#000000"};
  font-size: ${(props) =>
    props.$data?.blocks?.setting?.titleFontSize || "24"}px;
  font-weight: ${(props) =>
    props.$data?.blocks?.setting?.titleFontWeight || "bold"};
`;

const Description = styled.p<{ $data: GallerySection }>`
  color: ${(props) =>
    props.$data?.blocks?.setting?.descriptionColor || "#666666"};
  font-size: ${(props) =>
    props.$data?.blocks?.setting?.descriptionFontSize || "16"}px;
  font-weight: ${(props) =>
    props.$data?.blocks?.setting?.descriptionFontWeight || "normal"};
  margin-bottom: 30px;
  padding: 0px 20px;
  text-align: center;
`;

const ImageGrid = styled.div<{
  $data: GallerySection;
  $preview: "sm" | "default";
}>`
  display: grid;
  grid-template-columns: repeat(
    ${(props) =>
      props.$preview === "sm"
        ? props.$data?.blocks?.setting?.gridColumns
        : props.$data?.blocks?.setting?.gridColumns || "3"},
    1fr
  );
  gap: ${(props) => props.$data?.blocks?.setting?.gridGap || "10"}px;
  padding: 0 20px;
`;

const ImageWrapper = styled.div<{ $data: GallerySection }>`
  position: relative;
  height: ${(props) => props.$data?.blocks?.setting?.imageHeight || "100"}px;
  width: ${(props) => props.$data?.blocks?.setting?.imageWidth || "200"}px;
  border-radius: ${(props) =>
    props.$data?.blocks?.setting?.imageRadius || "8"}px;
  overflow: hidden;
  transition: transform 0.3s ease;
  object-fit: fill;

  /* Apply image animations */
  ${(props) => {
    const imageAnimation = props.$data.blocks?.setting?.imageAnimation;
    if (!imageAnimation) return "&:hover { transform: scale(1.05); }";

    const { type, animation: animConfig } = imageAnimation;
    const selector = type === "hover" ? "&:hover" : "&:active";

    // Generate animation CSS based on type
    if (animConfig.type === "pulse") {
      return `
        ${selector} {
          animation: galleryImagePulse ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes galleryImagePulse {
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
          animation: galleryImageGlow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes galleryImageGlow {
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
          animation: galleryImageBrightness ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes galleryImageBrightness {
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
          animation: galleryImageBlur ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes galleryImageBlur {
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
          animation: galleryImageSaturate ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes galleryImageSaturate {
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
          animation: galleryImageContrast ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes galleryImageContrast {
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
          animation: galleryImageOpacity ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes galleryImageOpacity {
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
          animation: galleryImageShadow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes galleryImageShadow {
          0%, 100% { 
            filter: drop-shadow(0 0 0px rgba(0, 0, 0, 0));
          }
          50% { 
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
          }
        }
      `;
    }

    // Default hover effect if no animation is configured
    return "&:hover { transform: scale(1.05); }";
  }}
`;

const Gallery: React.FC<GalleryProps> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
  setLayout,
  previewWidth,
}) => {
  const [preview, setPreview] = useState(previewWidth);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (window.innerWidth <= 425) {
      setPreview("sm");
    } else {
      setPreview(previewWidth);
    }
  }, [previewWidth]);

  const sectionData = layout?.sections?.children?.sections?.find(
    (section) => section.type === actualName
  ) as GallerySection;

  if (!sectionData) return null;

  const { title, description, images } = sectionData.blocks;

  return (
    <Section
      $data={sectionData}
      $preview={preview}
      $previewWidth={previewWidth}
      onClick={() => setSelectedComponent(actualName)}
      className={`transition-all duration-150 ease-in-out relative ${
        selectedComponent === actualName ? "border-4 border-blue-500" : ""
      }`}
    >
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h3 className="text-lg font-bold mb-4">
              مطمئن هستید؟
              <span className="text-blue-400 font-bold mx-1">{actualName}</span>
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

      {actualName === selectedComponent && (
        <div className="absolute w-fit -top-5 -left-1 z-10 flex">
          <div className="bg-blue-500 py-1 px-4 rounded-l-lg text-white">
            {actualName}
          </div>
          <button
            className="font-extrabold text-xl hover:bg-blue-500 bg-red-500 pb-1 rounded-r-lg px-3 text-white transform transition-all duration-300"
            onClick={() => setShowDeleteModal(true)}
          >
            x
          </button>
        </div>
      )}

      {title && (
        <Title dir="rtl" $data={sectionData}>
          {title}
        </Title>
      )}
      {description && (
        <Description dir="rtl" $data={sectionData}>
          {description}
        </Description>
      )}

      <ImageGrid $data={sectionData} $preview={preview}>
        {images.map((image, index) => (
          <ImageWrapper key={index} $data={sectionData}>
            {image.imageLink ? (
              <Link href={image.imageLink}>
                <Image
                  src={image.imageSrc}
                  alt={image.imageAlt}
                  width={3000}
                  height={3000}
                  className="w-full h-full object-cover"
                />
              </Link>
            ) : (
              <Image
                src={image.imageSrc}
                alt={image.imageAlt}
                width={3000}
                height={3000}
                className="w-full h-full object-cover"
              />
            )}
          </ImageWrapper>
        ))}
      </ImageGrid>
    </Section>
  );
};

export default Gallery;
