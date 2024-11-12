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

// Styled Components
const Section = styled.section<{ $data: SectionData }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: ${(props) => props.$data.setting?.paddingTop || "20px"};
  padding-bottom: ${(props) => props.$data.setting?.paddingBottom || "20px"};
  margin-top: ${(props) => props.$data.setting?.marginTop || "20px"};
  margin-bottom: ${(props) => props.$data.setting?.marginBottom || "20px"};
  border-radius: ${(props) => props.$data.blocks.setting?.boxRadiuos || "10px"};
  overflow: hidden;
  flex-direction: column;
  background-color: ${(props) =>
    props.$data.blocks.setting?.backgroundColorBox || "#f9f9f9"};
  @media (min-width: 1024px) {
    flex-direction: row;
    gap: 20px;
  }
`;

const Image = styled.img<{ $data: SectionData }>`
  width: ${(props) => props.$data.blocks.setting?.imageWidth || "50%"};
  height: ${(props) => props.$data.blocks.setting?.imageHeight || "auto"};
  opacity: ${(props) => props.$data.blocks.setting?.opacityImage || "1"};
  object-fit: cover;
  @media (max-width: 768px) {
    width: 100%;
    padding: 0px 10px;
  }
`;

const TextContainer = styled.div<{ $data: SectionData }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  width: 100%;
  background-color: ${(props) =>
    props.$data.blocks.setting?.backgroundColorBox};
  opacity: ${(props) =>
    props.$data.blocks.setting?.backgroundBoxOpacity || "1"};
  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
  }
`;

const Heading = styled.h2<{ $data: SectionData }>`
  color: ${(props) => props.$data.blocks.setting?.headingColor || "#333"};
  font-size: ${(props) =>
    props.$data.blocks.setting?.headingFontSize || "24px"};
  font-weight: ${(props) =>
    props.$data.blocks.setting?.headingFontWeight || "bold"};
  margin-bottom: 10px;
  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const Description = styled.p<{ $data: SectionData }>`
  color: ${(props) => props.$data.blocks.setting?.descriptionColor || "#666"};
  font-size: ${(props) =>
    props.$data.blocks.setting?.descriptionFontSize || "15px"};
  font-weight: ${(props) =>
    props.$data.blocks.setting?.descriptionFontWeight || "normal"};
  margin-bottom: 15px;
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const Button = styled.a<{ $data: SectionData }>`
  color: ${(props) => props.$data.blocks.setting?.btnTextColor || "#fff"};
  background-color: ${(props) =>
    props.$data.blocks.setting?.btnBackgroundColor || "#007bff"};
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    padding: 8px 50px;
  }
`;

// ImageText Component
const ImageText: React.FC<ImageTextProps> = ({
  setSelectedComponent,
  layout,
}) => {
  const sectionData = layout.sections?.children?.sections.find(
    (section) => (section as { type?: string }).type === "image-text"
  ) as SectionData;

  return (
    <Section
      $data={sectionData}
      onClick={() => setSelectedComponent("image-text")}
      dir="rtl"
    >
      <Image
        src={sectionData.blocks.imageSrc || "/assets/images/banner2.webp"}
        alt={sectionData.blocks.imageAlt || "Image"}
        loading="lazy"
        $data={sectionData}
      />
      <TextContainer $data={sectionData}>
        <Heading $data={sectionData}>
          {sectionData.blocks.heading || "Default Heading"}
        </Heading>
        <Description $data={sectionData}>
          {sectionData.blocks.description ||
            "Pair text with an image to focus on your chosen product, collection, or blog post. Add details on availability, style, or even provide a review."}
        </Description>
        <Button href={sectionData.blocks.btnLink} $data={sectionData}>
          {sectionData.blocks.btnText || "Learn More"}
        </Button>
      </TextContainer>
    </Section>
  );
};

export default ImageText;
