"use client";

import { Layout, RichTextSection, RichTextBlock,Section as sectionType, RichTextBlockSetting } from "@/lib/types";
import Link from "next/link";
import styled from "styled-components";

interface RichTextProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
}

// Styled components
const Section = styled.section<{ $data: RichTextSection }>`
  padding-top: ${(props) => props.$data?.setting?.paddingTop || "10px"};
  padding-bottom: ${(props) => props.$data?.setting?.paddingBottom || "10px"};
  margin-top: ${(props) => props.$data?.setting?.marginTop || "30px"};
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom || "30px"};
  background-color: ${(props) =>
    props.$data?.blocks?.setting?.background || "#ffffff"};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const H1 = styled.h1<{ $data: RichTextBlock }>`
  color: ${(props) => props.$data?.setting?.textHeadingColor || "#000"};
  font-size: ${(props) => props.$data?.setting?.textHeadingFontSize || "24px"};
  font-weight: ${(props) =>
    props.$data?.setting?.textHeadingFontWeight || "bold"};
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const P = styled.p<{ $data: RichTextBlock }>`
  color: ${(props) => props.$data?.setting?.descriptionColor || "#666"};
  font-size: ${(props) => props.$data?.setting?.descriptionFontSize || "16px"};
  font-weight: ${(props) =>
    props.$data?.setting?.descriptionFontWeight || "normal"};
  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const Btn = styled.button<{ $data: RichTextBlock }>`
  color: ${(props) => props.$data?.setting?.btnTextColor || "#fff"};
  background-color: ${(props) =>
    props.$data?.setting?.btnBackgroundColor || "#007BFF"};
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: transform 0.4s ease-in-out;
  &:hover {
    transform: scale(1.1);
    opacity: 0.8;
  }
`;

const RichText: React.FC<RichTextProps> = ({
  setSelectedComponent,
  layout,
}) => {
  const sectionData: RichTextSection   = layout?.sections?.children?.sections[2];

  if (!sectionData) {
    console.error("Section data is missing or invalid.");
    return null;
  }

  const { blocks } = sectionData;
  const { textHeading, description, btnText, btnLink } = blocks || {};

  console.log("sectionData", sectionData);

  return (
    <Section
      $data={sectionData}
      onClick={() => setSelectedComponent("rich-text")}
    >
      {textHeading && <H1 $data={blocks}>{textHeading}</H1>}
      {description && <P $data={blocks}>{description}</P>}
      {btnLink && (
        <Link href={btnLink} passHref legacyBehavior>
          <Btn $data={blocks}>{btnText}</Btn>
        </Link>
      )}
    </Section>
  );
};

export default RichText;
