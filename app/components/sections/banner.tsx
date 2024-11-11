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


// Styled components
interface bannerProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>,
  layout: {}
}


const Banner: React.FC<bannerProps> = ({ setSelectedComponent, layout }) => {
  const sectionData = (layout as any)?.sections?.children?.sections[3];
  const SectionBanner = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: ${sectionData?.blocks?.setting?.imageWidth};
  height: ${sectionData?.blocks?.setting?.imageHeight};
  border-radius: ${sectionData?.blocks?.setting?.imageRadius};
  background-color: ${sectionData?.blocks?.setting?.backgroundColorBox};
  background-image: url(${sectionData?.blocks?.imageSrc});
  background-size: ${sectionData?.blocks?.setting?.imageBehavior};
  background-position: center;
  background-repeat: no-repeat;
`;
  const {imageAlt, imageSrc,} =
    sectionData?.blocks || {};

  return (
    <SectionBanner onClick={() => setSelectedComponent("banner")}>
      <Image
        src={imageSrc || ""}
        alt={imageAlt || "banner"}
        width={1000}
        height={1000}
      />
    </SectionBanner>
  );
};
export default Banner;
