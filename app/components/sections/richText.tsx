"use client";

import {
  Layout,
  RichTextSection,
  RichTextBlock,
  Section as sectionType,
} from "@/lib/types";
import Link from "next/link";
import styled from "styled-components";

interface RichTextProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
}

// Styled components
const Section = styled.section<{ $data: RichTextSection }>`
  padding-top: ${(props) => props.$data?.setting?.paddingTop || "10px"}px;
  padding-bottom: ${(props) => props.$data?.setting?.paddingBottom || "10px"}px;
  margin-top: ${(props) => props.$data?.setting?.marginTop || "30px"}px;
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom || "30px"}px;
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

// Update the section data assignment with type checking
const RichText: React.FC<RichTextProps> = ({
  setSelectedComponent,
  layout,
}) => {
  const sectionData = layout?.sections?.children
    ?.sections[2] as RichTextSection;

  // Add type guard to verify section type
  const isRichTextSection = (
    section: sectionType
  ): section is RichTextSection => {
    return (
      section?.type === "rich-text" &&
      "blocks" in section &&
      section.blocks !== undefined
    );
  };

  if (!sectionData || !isRichTextSection(sectionData)) {
    console.error("Section data is missing or invalid.");
    return null;
  }

  const { blocks } = sectionData;

  // Type guard for RichTextBlock
  const isRichTextBlock = (block: RichTextBlock): block is RichTextBlock => {
    return (
      block &&
      "textHeading" in block &&
      "description" in block &&
      "btnText" in block &&
      "btnLink" in block
    );
  };

  if (!isRichTextBlock(blocks)) {
    console.error("Blocks data is missing or invalid.");
    return null;
  }

  const { textHeading, description, btnText, btnLink } = blocks;

  return (
    <Section
      dir="rtl"
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
