"use client";
import nullData from "../../../public/template/null.json";
import styled from "styled-components";

interface BlocksType {
  setting: {
    titleColor?: string;
    titleFontSize?: string;
    titleFontWeight?: string;
    imageWidth?: string;
    imageHeight?: string;
    imageRadius?: string;
    itemColor?: string;
    itemFontSize?: string;
    itemFontWeight?: string;
    itemHoverColor?: string;
    backgroundColorNavbar?: string;
  };
  tilte?: string;
  imageLogo?: string;
  imageAlt?: string;
}

interface SettingType {
  paddingTop?: string;
  paddingBottom?: string;
  marginTop?: string;
  marginBottom?: string;
  navbarPosition?: string;
}

interface SectionData {
  blocks: BlocksType;
  setting: SettingType;
}
const sectionData = nullData.sections.sectionHeader as SectionData;

// Styled components
const SectionHeader = styled.section`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-top: ${sectionData.setting.paddingTop};
  padding-bottom: ${sectionData.setting.paddingBottom};
  margin-top: ${sectionData.setting.marginTop};
  margin-bottom: ${sectionData.setting.marginBottom};
  background-color: ${sectionData.blocks.setting.backgroundColorNavbar};
  position: ${sectionData.setting.navbarPosition};
`;
const Logo = styled.img`
  width: ${sectionData.blocks.setting.imageWidth};
  height: ${sectionData.blocks.setting.imageHeight};
  border-radius: ${sectionData.blocks.setting.imageRadius};
`;
const Title = styled.h1`
  color: ${sectionData.blocks.setting.titleColor};
  font-size: ${sectionData.blocks.setting.titleFontSize};
  font-weight: ${sectionData.blocks.setting.titleFontWeight};
`;

const Header: React.FC = () => {
  const { tilte, imageLogo, imageAlt } = sectionData.blocks;
  return (
    <SectionHeader>
      <h1>
        <Logo src={imageLogo} alt={imageAlt} />
        {<span>{tilte}</span>}
      </h1>
    </SectionHeader>
  );
};

export default Header;
