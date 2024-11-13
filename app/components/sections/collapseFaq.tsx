import React, { useState } from "react";
import styled from "styled-components";
interface CollapseFaqProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: {
    sections?: {
      children?: { sections: SectionData[] };
    };
  };
}

interface BlocksType {
  setting: {
    [key: string]: string;
  };
  text1?: string;
  text2?: string;
  text3?: string;
  text4?: string;
  content1?: string;
  content2?: string;
  content3?: string;
  content4?: string;
  heading?: string;
}

interface SettingType {
  paddingTop?: string;
  paddingBottom?: string;
  marginTop?: string;
  marginBottom?: string;
  background?: string;
  headingColor?: string;
  headingFontSize?: string;
  headingFontWeight?: string;
  borderRadious?: string;
}

interface SectionData {
  blocks: BlocksType[];
  setting: SettingType;
}

// Styled Components
const Section = styled.section<{ $data: SectionData }>`
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
  border-radius: ${(props) => props.$data.setting?.borderRadious || "0px"};
`;

const Heading = styled.h2<{ $data: SectionData }>`
  color: ${(props) => props.$data.setting?.headingColor || "#333"};
  font-size: ${(props) => props.$data.setting?.headingFontSize || "24px"};
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

const Question = styled.div<{ $data: SectionData; $idx: number }>`
  font-size: ${(props) =>
    props.$data.blocks[props.$idx]?.setting[`textFontSize${props.$idx + 1}`] ||
    "18px"};
  font-weight: ${(props) =>
    props.$data.blocks[props.$idx]?.setting[
      `textFontWeight${props.$idx + 1}`
    ] || "bold"};
  color: ${(props) =>
    props.$data.blocks[props.$idx]?.setting[`textColor${props.$idx + 1}`] ||
    "#333"};
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Answer = styled.div<{
  $data: SectionData;
  $idx: number;
  $isOpen: boolean;
}>`
  font-size: ${(props) =>
    props.$data.blocks[props.$idx]?.setting[
      `contentFontSize${props.$idx + 1}`
    ] || "16px"};
  font-weight: ${(props) =>
    props.$data.blocks[props.$idx]?.setting[
      `contentFontWeight${props.$idx + 1}`
    ] || "normal"};
  color: ${(props) =>
    props.$data.blocks[props.$idx]?.setting[`contentColor${props.$idx + 1}`] ||
    "#666"};
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
    ?.sections?.[7] as SectionData) || {
    blocks: [{ setting: {} }],
    setting: {},
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
      onClick={() => setSelectedComponent("collapse")}
    >
      <Heading $data={sectionData}>{sectionData.blocks[0].heading}</Heading>
      {sectionData.blocks.map((block, idx: number) => {
        const typedBlock = block as BlocksType;
        return (
          <FaqItem key={idx}>
            <Question
              $data={sectionData}
              $idx={idx}
              onClick={(e) => {
                e.stopPropagation();
                toggleOpen(idx);
              }}
            >
              {typedBlock[`text${idx + 1}` as keyof BlocksType] as React.ReactNode}
              <span>{openIndexes.includes(idx) ? "-" : "+"}</span>
            </Question>
            <Answer
              $data={sectionData}
              $idx={idx}
              $isOpen={openIndexes.includes(idx)}
            >
              {typedBlock[`content${idx + 1}` as keyof BlocksType] as React.ReactNode}
            </Answer>
          </FaqItem>
        );
      })}

    </Section>
  );
};

export default CollapseFaq;
