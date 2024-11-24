"use client";
import React from "react";
import styled from "styled-components";
import { ImageTextSection, Layout } from "@/lib/types";
import { Delete } from "../C-D";

interface ImageTextProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
}

// Styled Components
const Section = styled.section<{ $data: ImageTextSection }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${(props) =>
    props.$data.blocks?.setting?.boxRadiuos || "10px"};
  padding-top: ${(props) => props.$data.setting?.paddingTop || "0"}px;
  padding-bottom: ${(props) => props.$data.setting?.paddingBottom || "0"}px;
  margin-top: ${(props) => props.$data.setting?.marginTop || "0"}px;
  margin-bottom: ${(props) => props.$data.setting?.marginBottom || "0"}px;
  background-color: ${(props) =>
    props.$data.blocks?.setting?.background || "transparent"};
  flex-direction: column;

  @media (min-width: 1024px) {
    flex-direction: row;
    margin-left: 10px;
    margin-right: 10px;
  }
`;

const Image = styled.img<{ $data: ImageTextSection }>`
  width: ${(props) => props.$data.blocks?.setting?.imageWidth || "50%"};
  height: ${(props) => props.$data.blocks?.setting?.imageHeight || "auto"};
  opacity: ${(props) => props.$data.blocks?.setting?.opacityImage || "1"};
  object-fit: cover;

  @media (max-width: 768px) {
    height: auto;
  }

  @media (min-width: 1025px) {
    width: 50%;
  }
`;

const TextContainer = styled.div<{ $data: ImageTextSection }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: center;
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

const Heading = styled.h2<{ $data: ImageTextSection }>`
  color: ${(props) => props.$data.blocks?.setting?.headingColor || "#333"};
  font-size: ${(props) =>
    props.$data.blocks?.setting?.headingFontSize || "24"}px;
  font-weight: ${(props) =>
    props.$data.blocks?.setting?.headingFontWeight || "bold"};
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 28px;
  }

  @media (min-width: 1025px) {
    text-align: right;
  }
`;

const Description = styled.p<{ $data: ImageTextSection }>`
  color: ${(props) =>
    props.$data.blocks?.setting?.descriptionColor || "#666666"};
  font-size: ${(props) =>
    props.$data.blocks?.setting?.descriptionFontSize || "16"}px;
  font-weight: ${(props) =>
    props.$data.blocks?.setting?.descriptionFontWeight || "normal"};
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (min-width: 1025px) {
    text-align: right;
  }
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
}) => {
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
      $data={sectionData}
      onClick={() => setSelectedComponent(actualName)}
      dir="rtl"
      className={`transition-all duration-150 ease-in-out relative ${
        selectedComponent === actualName ? "border-4 border-blue-500 " : ""
      }`}
    >
      {actualName === selectedComponent ? (<div className="absolute w-fit -top-5 -left-1 z-10 flex justify-center items-center">
        <div className=" bg-blue-500 py-1 px-4 rounded-lg text-white ">
          {actualName}
        </div>
        <button className="text-red-600 font-extrabold text-xl hover:bg-red-100 bg-slate-100 pb-1 mx-1 items-center justify-items-center content-center rounded-full px-3 "
         onClick={()=>Delete(actualName,layout,setLayout)}
        >x</button>
        </div>
        
      ) : null}

      <Image className="rounded-xl "
        $data={sectionData}
        src={imageSrc || "/assets/images/banner2.webp"}
        alt={imageAlt || "Image"}
      />
      <TextContainer $data={sectionData}>
        <Heading $data={sectionData}>{heading || "Default Heading"}</Heading>
        <Description $data={sectionData}>
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
