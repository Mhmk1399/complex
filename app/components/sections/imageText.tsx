"use client";
import React from "react";
import styled from "styled-components";

interface ImageTextProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: {
    sections?: {
      children?: { sections: SectionData[] };
    };
  };
}

interface BlocksType {
  setting: {
    headingColor?: string;
    headingFontSize?: string;
    headingFontWeight?: string;
    descriptionColor?: string;
    descriptionFontSize?: string;
    descriptionFontWeight?: string;
    btnTextColor?: string;
    btnBackgroundColor?: string;
    backgroundColorBox?: string;
    backgroundBoxOpacity?: string;
    boxRadiuos?: string;
    opacityImage?: string;
    imageWidth?: string;
    imageHeight?: string;
    background?: string;
  };
  imageSrc?: string;
  imageAlt?: string;
  heading?: string;
  description?: string;
  btnLink?: string;
  btnText?: string;
}

interface SettingType {
  paddingTop?: string;
  paddingBottom?: string;
  marginTop?: string;
  marginBottom?: string;
}

interface SectionData {
  blocks: BlocksType;
  setting: SettingType;
}
const Section = styled.section<{ $data: SectionData }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  padding-top: ${props => props.$data.setting?.paddingTop || 0}px;
  padding-bottom: ${props => props.$data.setting?.paddingBottom || 0}px;
  margin-top: ${props => props.$data.setting?.marginTop || 0}px;
  margin-bottom: ${props => props.$data.setting?.marginBottom || 0}px;
  border-radius: ${props => props.$data.blocks?.setting?.boxRadiuos || "10px"}px;
  background-color: ${props => props.$data.blocks?.setting?.background || "transparent"};
  overflow: hidden;
  flex-direction: column;
  @media (min-width: 1024px) {
    flex-direction: row;
    margin-left:10px;
        margin-right:10px;

  }
`;

const Image = styled.img<{ $data: SectionData }>`
  width: ${props => props.$data.blocks?.setting?.imageWidth || "50%"};
  height: ${props => props.$data.blocks?.setting?.imageHeight || "auto"};
  opacity: ${props => props.$data.blocks?.setting?.opacityImage || "1"};
  object-fit: cover;
  @media (max-width: 768px) {
    height: auto;
    
  }
  @media (min-width: 1025px) {
    width: 50%;
        ;

  }
`;

const TextContainer = styled.div<{ $data: SectionData }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: center;
  padding: 20px;
  width: 100%;
  background-color: ${props => props.$data.blocks?.setting?.backgroundColorBox};
  margin: 10px 0px;
  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
    margin: 10px;
  }
`;

const Heading = styled.h2<{ $data: SectionData }>`
  color: ${props => props.$data.blocks?.setting?.headingColor || "#333"};
  font-size: ${props => props.$data.blocks?.setting?.headingFontSize || "24px"}px;
  font-weight: ${props => props.$data.blocks?.setting?.headingFontWeight || "bold"};
  margin-bottom: 10px;
  @media (max-width: 768px) {
    font-size: 22px;
  }
  @media (min-width: 1025px) {
    text-align: right;
  }
`;
const Description = styled.p<{ $data: SectionData }>`
  color: ${props => props.$data.blocks?.setting?.descriptionColor || "#666666"};
  font-size: ${props => props.$data.blocks?.setting?.descriptionFontSize || "16px"}px;
  font-weight: ${props => props.$data.blocks?.setting?.descriptionFontWeight || "normal"};
  margin-bottom: 20px;
  @media (max-width: 768px) {
    font-size: 14px;
  }
  @media (min-width: 1025px) {
    text-align: right;
  }
`;

// Add missing Button styled component
const Button = styled.a<{ $data: SectionData }>`
  display: inline-block;
  padding: 10px 20px;
  color: ${props => props.$data.blocks?.setting?.btnTextColor || "#fff"};
  background-color: ${props => props.$data.blocks?.setting?.btnBackgroundColor || "#007bff"};
  text-decoration: none;
  border-radius: 5px;
  transition: opacity 0.3s;
  &:hover {
    opacity: 0.8;
  }
`;

const ImageText: React.FC<ImageTextProps> = ({
  setSelectedComponent,
  layout,
}) => {
  const sectionData = layout?.sections?.children?.sections.find(
    (section) => (section as { type?: string }).type === "image-text"
  ) as SectionData || {
    blocks: {},
    setting: {} // Add default empty setting object
  };

  return (
    <Section $data={sectionData} onClick={() => setSelectedComponent("image-text")} dir="rtl">
      <Image
        $data={sectionData}
        src={sectionData?.blocks?.imageSrc || "/assets/images/banner2.webp"}
        alt={sectionData?.blocks?.imageAlt || "Image"}
      />
      <TextContainer $data={sectionData}>
        <Heading $data={sectionData}>{sectionData?.blocks?.heading || "Default Heading"}</Heading>
        <Description $data={sectionData}>
          {sectionData?.blocks?.description || "Pair text with an image to focus on your chosen product, collection, or blog post. Add details on availability, style, or even provide a review."}
        </Description>
        <Button $data={sectionData} href={sectionData?.blocks?.btnLink}>
          {sectionData?.blocks?.btnText || "Learn More"}
        </Button>
      </TextContainer>
    </Section>
  );
}
export default ImageText;
