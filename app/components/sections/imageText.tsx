"use client";
import React, { useState } from "react";
import styled from "styled-components";
import { ImageTextSection, Layout } from "@/lib/types";
import { Delete } from "../C-D";

interface ImageTextProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
  previewWidth: "sm" | "default";
}

// Styled Components
const Section = styled.section<{
  $data: ImageTextSection;
  $previewWidth: "sm" | "default";
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${(props) =>
    props.$data.blocks?.setting?.boxRadiuos || "10"}px;
  padding-top: ${(props) => props.$data.setting?.paddingTop || "0"}px;
  padding-bottom: ${(props) => props.$data.setting?.paddingBottom || "0"}px;
  margin-top: ${(props) => props.$data.setting?.marginTop || "0"}px;
  margin-bottom: ${(props) => props.$data.setting?.marginBottom || "0"}px;
  background-color: ${(props) =>
    props.$data.blocks?.setting?.background || "transparent"};
  flex-direction: ${(props) =>
    props.$previewWidth === "sm"
      ? "column"
      : "row"};


`;

const Image = styled.img<{
  $data: ImageTextSection;
  $previewWidth: "sm" | "default";
}>`
  width: ${(props) => props.$data?.blocks?.setting?.imageWidth || "500"}0px;
  height: ${(props) => props.$data?.blocks?.setting?.imageHeight || "200"}0px;
  opacity: ${(props) => props.$data?.blocks?.setting?.opacityImage || "1"};
  border-radius: ${(props) =>
    props.$data?.blocks?.setting?.boxRadiuos || "10"}px;
  object-fit: cover;

  @media (max-width: 768px) {
    height: auto;
  }

  @media (min-width: 1025px) {
    width: 50%;
  }
`;

const TextContainer = styled.div<{ $data: ImageTextSection; $previewWidth: "sm" | "default"; }>`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  padding: 20px;
  width: 100%;
  background-color: ${(props) =>
    props.$data.blocks?.setting?.backgroundColorBox};
  margin: 10px 0px;

  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
    margin: 10px;
  }
`;

const Heading = styled.h2<{
  $data: ImageTextSection;
  $previewWidth: "sm" | "default";
}>`
  color: ${(props) => props.$data.blocks?.setting?.headingColor || "#333"};
  font-size: ${(props) =>
    props.$previewWidth === "sm"
      ? "18"
      : props.$data?.setting?.headingFontSize || "30"}px;
  font-weight: ${(props) =>
    props.$data.blocks?.setting?.headingFontWeight || "bold"};
  margin-bottom: 10px;
`;

const Description = styled.p<{
  $data: ImageTextSection;
  $previewWidth: "sm" | "default";
}>`
  color: ${(props) =>
    props.$data.blocks?.setting?.descriptionColor || "#666666"};
  font-size: ${(props) =>
    props.$previewWidth === "sm"
      ? "18"
      : props.$data?.setting?.descriptionFontSize || "24"}px;
  font-weight: ${(props) =>
    props.$data.blocks?.setting?.descriptionFontWeight || "normal"};
  margin-bottom: 20px;
`;

const Button = styled.a<{ $data: ImageTextSection }>`
  display: inline-block;
  padding: 10px 20px;
  color: ${(props) => props.$data.blocks?.setting?.btnTextColor || "#fff"};
  background-color: ${(props) =>
    props.$data.blocks?.setting?.btnBackgroundColor || "#007bff"};
  text-decoration: none;
  border-radius: 5px;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }
`;

// Main Component
const ImageText: React.FC<ImageTextProps> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
  setLayout,
  previewWidth,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // Find the first section with type "image-text"
  const sectionData = layout?.sections?.children?.sections.find(
    (section) => section.type === actualName
  ) as ImageTextSection;

  // Fallback for missing or invalid section data
  if (!sectionData) {
    return null;
  }

  const { imageSrc, imageAlt, heading, description, btnLink, btnText } =
    sectionData.blocks;

  return (
    <Section
      $previewWidth={previewWidth}
      $data={sectionData}
      onClick={() => setSelectedComponent(actualName)}
      className={`transition-all duration-150 ease-in-out relative ${
        selectedComponent === actualName ? "border-4 border-blue-500 " : ""
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
      ) : null}

      <Image
        className="rounded-xl "
        $data={sectionData}
        $previewWidth={previewWidth}
        src={imageSrc || "/assets/images/banner2.webp"}
        alt={imageAlt || "Image"}
      />
      <TextContainer $data={sectionData} $previewWidth={previewWidth}>
        <Heading $data={sectionData} $previewWidth={previewWidth}>
          {heading || "Default Heading"}
        </Heading>
        <Description $data={sectionData} $previewWidth={previewWidth}>
          {description ||
            "Pair text with an image to focus on your chosen product, collection, or blog post. Add details on availability, style, or even provide a review."}
        </Description>
        {btnLink && (
          <Button $data={sectionData} href={btnLink}>
            {btnText || "Learn More"}
          </Button>
        )}
      </TextContainer>
    </Section>
  );
};

export default ImageText;
