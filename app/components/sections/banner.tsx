"use client";
import React, { useState } from "react";
import nullData from "../../../public/template/null.json";
import styled from "styled-components";
import Image from "next/image";

interface BlocksType {
  setting: {
    descriptionColor?: string;
    descriptionFontSize?: string;
    descriptionFontWeight?: string;
    imageWidth?: string;
    imageHeight?: string;
    imageRadius?: string;
    imageBehavior?: string;
    opacityImage?: string;
    textColor?: string;
    textFontSize?: string;
    textFontWeight?: string;
    positionBoxTextDesktop?: string;
    backgroundColorBox?: string;
    backgroundBoxRadious?: string;
    textAlignmentBoxDesktop?: string;
    textAlignmentBoxMobile?: string;
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
const sectionData = nullData.sections.sectionHeader as SectionData;

// Styled components

const SectionBanner = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: ${sectionData.blocks.setting.imageWidth};

  height: ${sectionData.blocks.setting.imageHeight};
  border-radius: ${sectionData.blocks.setting.imageRadius};
  background-color: ${sectionData.blocks.setting.backgroundColorBox};
  background-image: url(${sectionData.blocks.imageSrc});
  background-size: ${sectionData.blocks.setting.imageBehavior};
  background-position: center;
  background-repeat: no-repeat;
`;

const Banner = () => {
  const { description, imageAlt, imageSrc, text, imageLink } =
    sectionData.blocks;
  return (
    <SectionBanner>
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
