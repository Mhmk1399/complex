"use client";
import React from "react";
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
interface props {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: any;
}


const SectionBanner = styled.section<{ $data: SectionData }>`
  position: relative;  // Add this line to fix the Image fill issue
  height: 600px;
  margin: 0px 10px;
  margin-top: ${props => props.$data.setting.marginTop}px;
  margin-bottom: ${props => props.$data.setting.marginBottom}px;
  padding-top: ${props => props.$data.setting.paddingTop}px;
  padding-bottom: ${props => props.$data.setting.paddingBottom}px;
  overflow: hidden;
  @media (max-width: 768px) {
    height: 300px;
  }
`;


const BannerImage = styled(Image)<{ $data: SectionData }>`
  opacity: ${props => props.$data.blocks.setting.opacityImage || "1"}px;
  border-radius: ${props => props.$data.blocks.setting.imageRadious || "10px"};
  object-fit: ${props => props.$data.blocks.setting.imageBehavior || "cover"};
`;

const BannerTextBox = styled.div<{ $data: SectionData }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: ${props => props.$data.blocks.setting.opacityTextBox || "1"};
  background-color: ${props => props.$data.blocks.setting.backgroundColorBox || "rgba(0, 0, 0, 0.5)"};
  padding: 70px;
  border-radius: ${props => props.$data.blocks.setting.backgroundBoxRadious || "10px"};
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const HeadingText = styled.h2<{ $data: SectionData }>`
  color: ${props => props.$data.blocks.setting.textColor || "#fffff"};
  font-size: ${props => props.$data.blocks.setting.textFontSize || "16px"}px;
  font-weight: ${props => props.$data.blocks.setting.textFontWeight || "bold"};
  text-align: center;
  @media (max-width: 768px) {
    font-size: ${props => props.$data.blocks.setting.textFontSizeMobile || "16px"}px;
  }
`;

const DescriptionText = styled.p<{ $data: SectionData }>`
  color: ${props => props.$data.blocks.setting.descriptionColor || "#ffffff"};
  font-size: ${props => props.$data.blocks.setting.descriptionFontSize || "16px"}px;
  font-weight: ${props => props.$data.blocks.setting.descriptionFontWeight || "normal"};
  margin-top: 17px;
  text-align: center;
  @media (max-width: 768px) {
    font-size: ${props => props.$data.blocks.setting.descriptionFontSizeMobile || "15px"};
  }
`;

const Banner: React.FC<props> = ({setSelectedComponent, layout}) => {
  const sectionData = layout.sections.children.sections[0] as SectionData;
  const { description, imageAlt, imageSrc, text } = sectionData.blocks;

  return (
    <SectionBanner $data={sectionData} onClick={() => setSelectedComponent("banner")}>
      <Link href={sectionData.blocks.imageLink || "/"} style={{ position: 'relative', display: 'block', width: '100%', height: '100%' }}>
        <BannerImage
          $data={sectionData}
          alt={imageAlt || "banner"}
          src={imageSrc || "/assets/images/banner2.webp"}
          fill
          priority
        />
      </Link>
      <BannerTextBox $data={sectionData}>
        <HeadingText $data={sectionData}>
          {sectionData.blocks.text || "Heading of Banner"}
        </HeadingText>
        <DescriptionText $data={sectionData}>
          {sectionData.blocks.description || "Description of Banner"}
        </DescriptionText>
      </BannerTextBox>
    </SectionBanner>
  );
};


export default Banner;