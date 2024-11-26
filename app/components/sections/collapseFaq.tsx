import { Layout, CollapseSection, CollapseBlock } from "@/lib/types";
import React, { useState } from "react";
import styled from "styled-components";
import { Delete } from "../C-D";

// Props Interface
interface CollapseFaqProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
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
  actualName,
  selectedComponent,
  setLayout,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const sectionData = (layout.sections?.children?.sections.find(
    (section) => section.type === actualName
  ) as CollapseSection) || {
    blocks: [],
    setting: {},
    type: "collapse",
  };

  if (!sectionData) {
    return null;
  }

  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleOpen = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <Section
      $data={sectionData}
      onClick={() => setSelectedComponent(actualName)}
      className={`transition-all duration-150 ease-in-out relative ${
        selectedComponent === actualName
          ? "border-4 border-blue-500 rounded-lg shadow-lg "
          : ""
      }`}
    >
      {showDeleteModal && (
        <div className="fixed inset-0  bg-black bg-opacity-70 z-50 flex items-center justify-center ">
          <div className="bg-white p-8 rounded-lg">
            <h3 className="text-lg font-bold mb-4">
              مطمئن هستید؟
              <span className="text-blue-400 font-bold mx-1">
                {actualName}
              </span>{" "}
              آیا از حذف
            </h3>
            <div className="flex gap-4 justify-end">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setShowDeleteModal(false)}
              >
                انصراف
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 "
                onClick={() => {
                  Delete(actualName, layout, setLayout);
                  setShowDeleteModal(false);
                }}
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {actualName === selectedComponent ? (
        <div className="absolute w-fit -top-5 -left-1 z-10 flex ">
          <div className="bg-blue-500 py-1 px-4 rounded-l-lg text-white">
            {actualName}
          </div>
          <button
            className="font-extrabold text-xl hover:bg-blue-500 bg-red-500 pb-1 rounded-r-lg px-3 text-white transform transition-all ease-in-out duration-300"
            onClick={() => setShowDeleteModal(true)}
          >
            x
          </button>
        </div>
      ) : null}

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
