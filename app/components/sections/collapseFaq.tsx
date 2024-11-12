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
  map: any;
  setting: {
    textColor?: string;
    textFontSize?: string;
    textFontWeight?: string;
    contentColor?: string;
    contentFontSize?: string;
    contentFontWeight?: string;
    background?: string;
  };
  heading?: string;
  text1?: string;
  text2?: string;
  text3?: string;
  text4?: string;
  content1?: string;
  content2?: string;
  content3?: string;
  content4?: string;
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

// Styled Components
const Section = styled.section<{ $data: SectionData }>`
  padding-top: ${(props) => props.$data.setting?.paddingTop || "20px"};
  padding-bottom: ${(props) => props.$data.setting?.paddingBottom || "20px"};
  margin-top: ${(props) => props.$data.setting?.marginTop || "20px"};
  margin-bottom: ${(props) => props.$data.setting?.marginBottom || "20px"};
  background-color: ${(props) =>
    props.$data.setting?.background || "#ffffff"};
  display: flex;
  flex-direction: column;
  width: 90%;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const Heading = styled.h2<{ $data: SectionData }>`
  color: ${(props) => props.$data.blocks.setting?.textColor || "#333"};
  font-size: ${(props) => props.$data.blocks.setting?.textFontSize || "24px"};
  font-weight: ${(props) =>
    props.$data.blocks.setting?.textFontWeight || "bold"};
  text-align: center;
  margin-bottom: 20px;
`;

const FaqItem = styled.div`
  width: 100%;
  margin: 10px 0;
  padding: 10px;
`;

const Question = styled.div<{ $data: SectionData; idx: number }>`
  font-size: ${(props) =>
    props.$data.blocks.setting?.[
      `textFontSize${props.idx + 1}` as keyof typeof props.$data.blocks.setting
    ] || "18px"};
  font-weight: ${(props) =>
    props.$data.blocks.setting?.[
      `textFontWeight${
        props.idx + 1
      }` as keyof typeof props.$data.blocks.setting
    ] || "bold"};
  color: ${(props) =>
    props.$data.blocks.setting?.[
      `textColor${props.idx + 1}` as keyof typeof props.$data.blocks.setting
    ] || "#333"};
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Answer = styled.div<{
  $data: SectionData;
  idx: number;
  $isOpen: boolean;
}>`
  font-size: ${(props) =>
    props.$data.blocks.setting?.[
      `contentFontSize${
        props.idx + 1
      }` as keyof typeof props.$data.blocks.setting
    ] || "16px"};
  font-weight: ${(props) =>
    props.$data.blocks.setting?.[
      `contentFontWeight${
        props.idx + 1
      }` as keyof typeof props.$data.blocks.setting
    ] || "normal"};
  color: ${(props) =>
    props.$data.blocks.setting?.[
      `contentColor${props.idx + 1}` as keyof typeof props.$data.blocks.setting
    ] || "#666"};
  padding: 10px;
  background-color: #f9f9f9;
  display: ${(props) => (props.$isOpen ? "block" : "none")};
`;

const CollapseFaq: React.FC<CollapseFaqProps> = ({
  setSelectedComponent,
  layout,
}) => {
  const sectionData = (layout.sections?.children
    ?.sections?.[7] as SectionData) || {
    blocks: { setting: {} },
    setting: {},
  };
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleOpen = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const faqData = sectionData.blocks.map(
    (block: Record<string, any>, index: number) => ({
      question: block[`text${index + 1}`],
      answer: block[`content${index + 1}`],
      setting: block.setting,
    })
  );

  return (
    <Section
      dir="rtl"
      $data={sectionData}
      onClick={() => setSelectedComponent("collapseFaq")}
    >
      <Heading $data={sectionData}>
        {sectionData.blocks?.heading || "Frequently Asked Questions"}
      </Heading>
      {faqData.map((item: string | any, idx: number) => (
        <FaqItem key={idx}>
          <Question
            $data={sectionData}
            idx={idx}
            onClick={(e) => {
              e.stopPropagation();
              toggleOpen(idx);
            }}
          >
            {item.question}
            <span>{openIndexes.includes(idx) ? "-" : "+"}</span>
          </Question>
          {openIndexes.includes(idx) && item.answer && (
            <Answer
              $data={sectionData}
              idx={idx}
              $isOpen={openIndexes.includes(idx)}
            >
              {item.answer}
            </Answer>
          )}
        </FaqItem>
      ))}
    </Section>
  );
};

export default CollapseFaq;
