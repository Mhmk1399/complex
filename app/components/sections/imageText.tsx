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
    imageRadious?: string;
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

const ImageText: React.FC<ImageTextProps> = ({
  setSelectedComponent,
  layout,
}) => {
  const sectionData = layout.sections?.children?.sections.find(
    (section) =>
      (section as { type?: string }).type === ("image-text" as string)
  ) as SectionData;

  const Section = styled.section`
    position: relative;
    padding-top: ${sectionData.setting?.paddingTop};
    padding-bottom: ${sectionData?.setting?.paddingBottom};
    margin-top: ${sectionData?.setting?.marginTop || "20px"};
    margin-bottom: ${sectionData?.setting?.marginBottom || "20px"};
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    @media (max-width: 768px) {
      margin: 0 10px;
    }
  `;

  const Image = styled.img`
    width: ${sectionData?.blocks?.setting?.imageWidth};
    margin: 0 10px;
    height: ${sectionData?.blocks?.setting?.imageHeight || "auto"};
    opacity: ${sectionData?.blocks?.setting?.opacityImage || "1"};
    border-radius: ${sectionData?.blocks?.setting?.imageRadious || "10px"};
    object-fit: cover;
    filter: brightness(0.9);
    @media (max-width: 425px) {
      height: 500px;
    }
  `;

  const TextContainer = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 70px 150px;
    backdrop-filter: blur(30px);
    background-color: ${sectionData?.blocks?.setting?.backgroundColorBox};
    opacity: ${sectionData?.blocks?.setting?.backgroundBoxOpacity || "0.2"};
    border-radius: ${sectionData?.blocks?.setting?.boxRadiuos || "10px"};
    transition: transform 0.4s ease, opacity 0.4s ease;

    @media (max-width: 768px) {
      height: fit-content;
      padding: 50px 100px;
    }
  `;

  const Heading = styled.h2`
    color: ${sectionData?.blocks?.setting?.headingColor || "#fff"};
    font-size: ${sectionData?.blocks?.setting?.headingFontSize || "24px"};
    font-weight: ${sectionData?.blocks?.setting?.headingFontWeight || "bold"};
    margin: 10px 0;
    flex-wrap: nowrap;
    @media (max-width: 768px) {
      font-size: 22px;
    }
  `;

  const Description = styled.p`
    color: ${sectionData?.blocks?.setting?.descriptionColor || "#ddd"};
    font-size: ${sectionData?.blocks?.setting?.descriptionFontSize || "16px"};
    font-weight: ${sectionData?.blocks?.setting?.descriptionFontWeight ||
    "normal"};
    margin-top: 10px;
    @media (max-width: 768px) {
      font-size: 16px;
    }
  `;

  const Button = styled.a`
    color: ${sectionData?.blocks?.setting?.btnTextColor || "#fff"};
    background-color: ${sectionData?.blocks?.setting?.btnBackgroundColor ||
    "#007bff"};
    padding: 10px 30px;
    text-decoration: none;
    border-radius: 10px;
    margin-top: 15px;
    transition: background-color 0.2s ease-in-out;
    &:hover {
      opacity: 0.9;
      background-color: transparent;
    }
    @media (max-width: 768px) {
      padding: 8px 50px;
      font-size: 18px;
    }
  `;

  return (
    <Section onClick={() => setSelectedComponent("image-text")}>
      <Image
        src={sectionData?.blocks?.imageSrc || "/assets/images/banner2.webp"}
        alt={sectionData?.blocks?.imageAlt || "Image"}
      />
      <TextContainer>
        <Heading>{sectionData?.blocks?.heading || "Default Heading"}</Heading>
        <Description>
          {sectionData?.blocks?.description || "Default Description"}
        </Description>

        <Button href={sectionData?.blocks?.btnLink}>
          {sectionData?.blocks?.btnText || "Learn More"}
        </Button>
      </TextContainer>
    </Section>
  );
};
export default ImageText;
