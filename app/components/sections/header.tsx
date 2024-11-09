"use client";
import nullData from "../../../public/template/null.json";
import styled from "styled-components";

interface BlocksType {
  setting: {
    headingColor?: string;
    headingFontSize?: string;
    headingFontWeight?: string;
    btnBackgroundColor?: string;
    btnTextColor?: string;
    btnBackground?: string;
    textHeading?: string;
  };
  tilte?: string;
  imageLogo?: string;
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

const SectionHeader = styled.section`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
const Logo = styled.img`
  width: 100px;
`;

const sectionData = nullData.sections.sectionHeader as SectionData;

const Header: React.FC = () => {
  const { tilte, imageLogo } = sectionData.blocks;
  return (
    <SectionHeader>
      <h1>
        <Logo src={imageLogo} alt="logo" />
        {<span>{tilte}</span>}
      </h1>
    </SectionHeader>
  );
};

export default Header;
