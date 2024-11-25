"use client";
import { Layout, RichTextSection, RichTextBlock } from "@/lib/types";
import Link from "next/link";
import styled from "styled-components";
import { Delete } from "../C-D";

interface RichTextProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
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
  border-radius: 30px;
  align-items: center;
  margin-left: 10px;
  margin-right: 10px;
  gap: 15px;
`;

const H1 = styled.h1<{ $data: RichTextBlock }>`
  color: ${(props) => props.$data?.setting?.textHeadingColor || "#000"};
  font-size: ${(props) => props.$data?.setting?.textHeadingFontSize || "24px"};
  font-weight: ${(props) =>
    props.$data?.setting?.textHeadingFontWeight || "bold"};
  // border-bottom: 3px solid #ffffff;
  padding-bottom: 10px;
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const P = styled.p<{ $data: RichTextBlock }>`
  color: ${(props) => props.$data?.setting?.descriptionColor || "#666"};
  font-size: ${(props) => props.$data?.setting?.descriptionFontSize || "16px"};
  font-weight: ${(props) =>
    props.$data?.setting?.descriptionFontWeight || "normal"};
  @media (max-width: 768px) {
    font-size: 16px;
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
  actualName,
  selectedComponent,
  setLayout,
}) => {
  const sectionData = layout?.sections?.children?.sections?.find(
    (section) => section.type === actualName
  ) as RichTextSection;

  if (!sectionData) {
    return null;
  }

  // Add type guard to verify section type

  const { blocks } = sectionData;

  // Type guard for RichTextBlock

  const { textHeading, description, btnText, btnLink } = blocks;

  return (
    <Section
      dir="rtl"
      $data={sectionData}
      onClick={() => setSelectedComponent(actualName)}
      className={`transition-all duration-150 ease-in-out relative ${
        selectedComponent === actualName
          ? "border-4 border-blue-500 rounded-lg shadow-lg "
          : ""
      }`}
    >
     {actualName === selectedComponent ? (<div className="absolute w-fit -top-5 -left-1 z-10 flex justify-center items-center">
        <div className=" bg-blue-500 py-1 px-4 rounded-lg text-white ">
          {actualName}
        </div>
        <button className="text-red-600 font-extrabold text-xl hover:bg-red-100 bg-slate-100 pb-1 mx-1 items-center justify-items-center content-center rounded-full px-3 "
         onClick={()=>Delete(actualName,layout,setLayout)}
        >x</button>
        </div>
        
      ) : null}
    
      {textHeading && <H1 $data={blocks}>{textHeading}</H1>}

      <hr className="w-[70%] h-[4px] bg-white mb-4" />

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
