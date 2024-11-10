"use client";
import React from "react";
import nullData from "../../../public/template/null.json";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";

interface BlocksType {
  setting: {
    descriptionColor?: string;
    descriptionFontSize?: string;
    descriptionFontWeight?: string;
    descriptionFontSizeMobile?: string;
    imageRadious?: string;
    imageBehavior?: string;
    opacityImage?: string;
    opacityTextBox?: string;
    textColor?: string;
    textFontSize?: string;
    textFontWeight?: string;
    textFontSizeMobile?: string;
    backgroundColorBox?: string;
    backgroundBoxRadious?: string;
  };
  imageSrc?: string;
  imageAlt?: string;
  imageLink?: string;
  text?: string;
  description?: string;
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

const sectionData = nullData.sections.children.sections[0] as SectionData;

// Styled components
const SectionBanner = styled.section`
  position: relative;
  height: 600px;
  margin: 0px 10px;
  margin-top: ${sectionData.setting.marginTop};
  margin-bottom: ${sectionData.setting.marginBottom};
  padding-top: ${sectionData.setting.paddingTop};
  padding-bottom: ${sectionData.setting.paddingBottom};
  overflow: hidden;
  @media (max-width: 768px) {
    height: 300px;
  }
`;

const BannerImage = styled(Image)`
  opacity: ${sectionData.blocks.setting.opacityImage || "1"};
  border-radius: ${sectionData.blocks.setting.imageRadious || "10px"};
  object-fit: ${sectionData.blocks.setting.imageBehavior || "cover"};
`;

const BannerTextBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: ${sectionData.blocks.setting.opacityTextBox || "1"};
  background-color: ${sectionData.blocks.setting.backgroundColorBox ||
  "rgba(0, 0, 0, 0.5)"};
  padding: 70px;
  border-radius: ${sectionData.blocks.setting.backgroundBoxRadious || "10px"};
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const HeadingText = styled.h2`
  color: ${sectionData.blocks.setting.textColor || "#fff"};
  font-size: ${sectionData.blocks.setting.textFontSize || "16px"};
  font-weight: ${sectionData.blocks.setting.textFontWeight || "bold"};
  text-align: center;
  @media (max-width: 768px) {
    font-size: ${sectionData.blocks.setting.textFontSizeMobile || "16px"};
  }
`;

const DescriptionText = styled.p`
  color: ${sectionData.blocks.setting.descriptionColor || "#fff"};
  font-size: ${sectionData.blocks.setting.descriptionFontSize || "16px"};
  font-weight: ${sectionData.blocks.setting.descriptionFontWeight || "normal"};
  margin-top: 17px;
  text-align: center;
  @media (max-width: 768px) {
    font-size: ${sectionData.blocks.setting.descriptionFontSizeMobile ||
    "15px"};
  }
`;

const Banner: React.FC = () => {
  const { description, imageAlt, imageSrc, text } = sectionData.blocks;

  return (
    <SectionBanner>
      <Link href={sectionData.blocks.imageLink || "/"}>
        <BannerImage
          alt={imageAlt || "banner"}
          src={imageSrc || "/assets/images/banner2.webp"}
          layout="fill"
          priority
        />
      </Link>
      <BannerTextBox>
        <HeadingText>{text || "Heading of Banner"}</HeadingText>
        <DescriptionText>
          {description || "Description of Banner"}
        </DescriptionText>
      </BannerTextBox>
    </SectionBanner>
  );
};

export default Banner;
