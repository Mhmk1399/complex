"use client";
import Link from "next/link";
import nullData from "../../../public/template/null.json";
import styled from "styled-components";

interface BlocksType {
  setting: {
    allTextPosition?: string;
    background?: string;
    textHeadingColor?: string;
    textHeadingFontSize?: string;
    textHeadingFontWeight?: string;
    descriptionColor?: string;
    descriptionFontSize?: string;
    descriptionFontWeight?: string;
    btnTextColor?: string;
    btnBackgroundColor?: string;
  };
  textHeading?: string;
  description?: string;
  btnText?: string;
  btnLink?: string;
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

const sectionData = nullData.sections.children.sections[2] as SectionData;

// Styled components
const Section = styled.section`
  padding-top: ${sectionData?.setting?.paddingTop || "10px"};
  padding-bottom: ${sectionData.setting.paddingBottom || "10px"};
  padding-left: 30px;
  padding-right: 30px;
  margin-top: ${sectionData.setting.marginTop || "0px"};
  margin-bottom: ${sectionData.setting.marginBottom || "0px"};
  margin-left: 10px;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  align-items: ${sectionData.blocks.setting.allTextPosition};
  gap: 15px;
  background-color: ${sectionData.blocks.setting.background};
`;

const H1 = styled.h1`
  color: ${sectionData.blocks.setting.textHeadingColor};
  font-size: ${sectionData.blocks.setting.textHeadingFontSize};
  font-weight: ${sectionData.blocks.setting.textHeadingFontWeight};
  text-wrap: wrap;
`;

const P = styled.p`
  color: ${sectionData.blocks.setting.descriptionColor};
  font-size: ${sectionData.blocks.setting.descriptionFontSize};
  font-weight: ${sectionData.blocks.setting.descriptionFontWeight};
  text-wrap: wrap;
`;

const Btn = styled.button`
  color: ${sectionData.blocks.setting.btnTextColor};
  background-color: ${sectionData.blocks.setting.btnBackgroundColor};
  padding: 10px 20px;
  border-radius: 5px;
  transition: transform 0.4s ease-in-out;
  &:hover {
    transform: scale(1.1);
    cursor: pointer;
    background-color: inherit;
    color: ${sectionData.blocks.setting.btnBackgroundColor};
  }
`;

const RichText: React.FC = () => {
  const { textHeading, description, btnText, btnLink } = sectionData.blocks;

  return (
    <Section>
      {textHeading && <H1>{textHeading}</H1>}
      {description && <P>{description}</P>}
      {btnLink && (
        <Btn>
          <Link href={btnLink}>{btnText}</Link>
        </Btn>
      )}
    </Section>
  );
};

export default RichText;
