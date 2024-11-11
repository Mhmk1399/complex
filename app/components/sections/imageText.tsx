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

const ImageText: React.FC<ImageTextProps> = ({
  setSelectedComponent,
  layout,
}) => {
  const sectionData = layout.sections?.children?.sections.find(
    (section) =>
      (section as { type?: string }).type === ("image-text" as string)
  ) as SectionData;

  const Section = styled.section`
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: ${sectionData.setting?.paddingTop};
    padding-bottom: ${sectionData.setting?.paddingBottom};
    margin-top: ${sectionData?.setting?.marginTop || "20px"};
    margin-bottom: ${sectionData?.setting?.marginBottom || "20px"};
    border-radius: ${sectionData?.blocks?.setting?.boxRadiuos || "10px"};
    overflow: hidden;
    flex-direction: column;
    @media (min-width: 1024px) {
      flex-direction: row;
      margin: 10px;
    }
  `;

  const Image = styled.img`
    width: ${sectionData?.blocks?.setting?.imageWidth || "50%"};
    height: ${sectionData?.blocks?.setting?.imageHeight || "auto"};
    opacity: ${sectionData?.blocks?.setting?.opacityImage || "1"};
    object-fit: cover;
    @media (max-width: 768px) {
      width: 100%;
      height: auto;
      padding: 0px 10px;
    }
    @media (min-width: 1025px) {
      width: 50%;
    }
  `;

  const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: center;
    padding: 20px;
    width: 100%;
    background-color: ${sectionData?.blocks?.setting?.backgroundColorBox};
    margin: 10px 0px;
    @media (max-width: 768px) {
      align-items: center;
      text-align: center;
      margin: 10px;
    }
  `;

  const Heading = styled.h2`
    color: ${sectionData?.blocks?.setting?.headingColor || "#333"};
    font-size: ${sectionData?.blocks?.setting?.headingFontSize || "24px"};
    font-weight: ${sectionData?.blocks?.setting?.headingFontWeight || "bold"};
    margin-bottom: 10px;
    @media (max-width: 768px) {
      font-size: 22px;
    }
    @media (min-width: 1025px) {
      text-align: right;
      padding: 0px 100px;
    }
  `;

  const Description = styled.p`
    color: ${sectionData?.blocks?.setting?.descriptionColor || "#666"};
    font-size: ${sectionData?.blocks?.setting?.descriptionFontSize || "16px"};
    font-weight: ${sectionData?.blocks?.setting?.descriptionFontWeight ||
    "normal"};

    @media (max-width: 768px) {
      font-size: 16px;
    }
    @media (min-width: 1025px) {
      margin: 10px;
      text-align: right;
      padding: 0px 100px;
    }
  `;

  const Button = styled.a`
    color: ${sectionData?.blocks?.setting?.btnTextColor || "#fff"};
    background-color: ${sectionData?.blocks?.setting?.btnBackgroundColor ||
    "#007bff"};
    padding: 10px 20px;
    text-decoration: none;
    border-radius: 5px;
    margin-top: 15px;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: #0056b3;
    }

    @media (max-width: 768px) {
      padding: 8px 50px;
    }
    @media (min-width: 1025px) {
      margin: 10px;
      text-align: right;
      margin: 10px 110px;
    }
  `;

  return (
    <Section onClick={() => setSelectedComponent("image-text")} dir="rtl">
      <Image
        src={sectionData?.blocks?.imageSrc || "/assets/images/banner2.webp"}
        alt={sectionData?.blocks?.imageAlt || "Image"}
        loading="lazy"
      />
      <TextContainer>
        <Heading>{sectionData?.blocks?.heading || "Default Heading"}</Heading>
        <Description>
          {sectionData?.blocks?.description ||
            "Pair text with an image to focus on your chosen product, collection, or blog post. Add details on availability, style, or even provide a review."}
        </Description>
        <Button href={sectionData?.blocks?.btnLink}>
          {sectionData?.blocks?.btnText || "Learn More"}
        </Button>
      </TextContainer>
    </Section>
  );
};
export default ImageText;
