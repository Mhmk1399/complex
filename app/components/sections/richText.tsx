"use client";
import Link from "next/link";
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
interface RichTextProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: l
   
  
}


// Move all styled components outside the component function
const Section = styled.section<{ $data: SectionData }>`
  padding-top: ${props => props.$data?.setting?.paddingTop || "10px"}px;
  padding-bottom: ${props => props.$data?.setting?.paddingBottom || "10px"}px;
  padding-left: 30px;
  padding-right: 30px;
  margin-top: ${props => props.$data?.setting?.marginTop || "0px"}px;
  margin-bottom: ${props => props.$data?.setting?.marginBottom || "0px"}px;
  margin-left: 10px;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$data?.blocks?.setting?.allTextPosition};
  gap: 15px;
  background-color: ${props => props.$data?.blocks?.setting?.background};
`;

const H1 = styled.h1<{ $data: SectionData }>`
  color: ${props => props.$data?.blocks?.setting?.textHeadingColor};
  font-size: ${props => props.$data?.blocks?.setting?.textHeadingFontSize};
  font-weight: ${props => props.$data?.blocks?.setting?.textHeadingFontWeight};
  text-wrap: wrap;
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const P = styled.p<{ $data: SectionData }>`
  color: ${props => props.$data?.blocks?.setting?.descriptionColor};
  font-size: ${props => props.$data?.blocks?.setting?.descriptionFontSize};
  font-weight: ${props => props.$data?.blocks?.setting?.descriptionFontWeight};
  text-wrap: wrap;
  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const Btn = styled.button<{ $data: SectionData }>`
  color: ${props => props.$data?.blocks?.setting?.btnTextColor};
  background-color: ${props => props.$data?.blocks?.setting?.btnBackgroundColor};
  padding: 10px 20px;
  border-radius: 5px;
  transition: transform 0.4s ease-in-out;
  &:hover {
    transform: scale(1.1);
    cursor: pointer;
    opacity: 0.8;
    color: ${props => props.$data?.blocks?.setting?.btnTextColor};
  }
`;

const RichText: React.FC<RichTextProps> = ({ setSelectedComponent, layout }) => {
  const sectionData = layout?.sections?.children?.sections[2];
  const { textHeading, description, btnText, btnLink } = sectionData.blocks || {};

  return (
    <Section $data={sectionData} onClick={() => setSelectedComponent("rich-text")}>
      {textHeading && <H1 $data={sectionData}>{textHeading}</H1>}
      {description && <P $data={sectionData}>{description}</P>}
      {btnLink && (
        <Btn $data={sectionData}>
          <Link href={btnLink}>{btnText}</Link>
        </Btn>
      )}
    </Section>
  );
};


export default RichText;
