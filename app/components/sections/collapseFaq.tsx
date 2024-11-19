import { Layout, CollapseSection, CollapseBlock } from "@/lib/types";
import React, { useState } from "react";
import styled from "styled-components";

// Props Interface
interface CollapseFaqProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
}

// Styled Components
const Section = styled.section<{ $data: CollapseSection }>`
  padding-top: ${(props) => props.$data.setting?.paddingTop || "20px"}px;
  padding-bottom: ${(props) => props.$data.setting?.paddingBottom || "20px"}px;
  margin-top: ${(props) => props.$data.setting?.marginTop || "20px"}px;
  margin-bottom: ${(props) => props.$data.setting?.marginBottom || "20px"}px;
  margin-left: 10px;
  margin-right: 10px;
  background-color: ${(props) => props.$data.setting?.background || "#ffffff"};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
`;

const Heading = styled.h2<{ $data: CollapseSection }>`
  color: ${(props) => props.$data.setting?.headingColor || "#333"};
  font-size: ${(props) => props.$data.setting?.headingFontSize || "24px"}px;
  font-weight: ${(props) => props.$data.setting?.headingFontWeight || "bold"};
  text-align: center;
  margin-bottom: 20px;
  margin-top: 10px;
`;

const FaqItem = styled.div`
  width: 100%;
  margin: 10px 0;
  padding: 10px;
`;

const Question = styled.div<{ $block: CollapseBlock; $index: number }>`
  font-size: ${(props) =>
    (props.$block.setting[
      `textFontSize${props.$index + 1}` as keyof typeof props.$block.setting
    ] as string) || "18px"};
  font-weight: ${(props) =>
    (props.$block.setting[
      `textFontWeight${props.$index + 1}` as keyof typeof props.$block.setting
    ] as string) || "bold"};
  color: ${(props) =>
    (props.$block.setting[
      `textColor${props.$index + 1}` as keyof typeof props.$block.setting
    ] as string) || "#ffffff"};
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Answer = styled.div<{
  $block: CollapseBlock;
  $isOpen: boolean;
  $index: number;
}>`
  font-size: ${(props) =>
    (props.$block.setting[
      `contentFontSize${props.$index + 1}` as keyof typeof props.$block.setting
    ] as string) || "16px"}px;
  font-weight: ${(props) =>
    (props.$block.setting[
      `contentFontWeight${
        props.$index + 1
      }` as keyof typeof props.$block.setting
    ] as string) || "normal"};
  color: ${(props) =>
    (props.$block.setting[
      `contentColor${props.$index + 1}` as keyof typeof props.$block.setting
    ] as string) || "#e4e4e4e4"};
  padding: 15px 20px;
  text-align: right;
  background-color: transparent;
  max-height: ${(props) => (props.$isOpen ? "500px" : "0")};
  opacity: ${(props) => (props.$isOpen ? "1" : "0")};
  overflow: hidden;
  transition: all 0.6s ease-in-out;
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
`;

const CollapseFaq: React.FC<CollapseFaqProps> = ({
  setSelectedComponent,
  layout,
}) => {
  const sectionData = (layout.sections?.children
    ?.sections?.[7] as CollapseSection) || {
    blocks: [],
    setting: {},
    type: "collapse-1234",
  };

  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleOpen = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <Section
      dir="rtl"
      $data={sectionData}
      onClick={() => setSelectedComponent("collapse-1234")}
    >
      <Heading $data={sectionData}>{sectionData.blocks[0]?.heading}</Heading>
      {sectionData.blocks.map((block: CollapseBlock, idx: number) => (
        <FaqItem key={idx}>
          <Question
            $block={block}
            $index={idx}
            onClick={(e) => {
              e.stopPropagation();
              toggleOpen(idx);
            }}
          >
            {block[`text${idx + 1}` as keyof CollapseBlock] as React.ReactNode}
            <span>{openIndexes.includes(idx) ? "-" : "+"}</span>
          </Question>
          <Answer
            $block={block}
            $isOpen={openIndexes.includes(idx)}
            $index={idx}
          >
            {
              block[
                `content${idx + 1}` as keyof CollapseBlock
              ] as React.ReactNode
            }
          </Answer>
        </FaqItem>
      ))}
    </Section>
  );
};

export default CollapseFaq;
