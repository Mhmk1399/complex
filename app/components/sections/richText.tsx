"use client";
import { Layout, RichTextSection, RichTextBlock } from "@/lib/types";
import Link from "next/link";
import styled from "styled-components";
import { Delete } from "../C-D";
import { useEffect, useState } from "react";

interface RichTextProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
  previewWidth: "sm" | "default";
}

// Styled components
const Section = styled.section<{
  $data: RichTextSection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  padding-top: ${(props) => props.$data?.setting?.paddingTop || "10"}px;
  padding-bottom: ${(props) => props.$data?.setting?.paddingBottom || "10"}px;
  padding-left: ${(props) => props.$data?.setting?.paddingLeft || "10"}px;
  padding-right: ${(props) => props.$data?.setting?.paddingRight || "10"}px;
  margin-top: ${(props) => props.$data?.setting?.marginTop || "30"}px;
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom || "30"}px;
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

const H1 = styled.h1<{
  $data: RichTextBlock;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  color: ${(props) => props.$data?.setting?.textHeadingColor || "#000"};
  font-size: ${(props) =>
    props.$preview === "sm"
      ? "18"
      : props.$data?.setting?.textHeadingFontSize || "24"}px;
  font-weight: ${(props) =>
    props.$data?.setting?.textHeadingFontWeight || "bold"};
  // border-bottom: 3px solid #ffffff;
  padding-bottom: 10px;
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const P = styled.p<{
  $data: RichTextBlock;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  color: ${(props) => props.$data?.setting?.descriptionColor || "#666"};
  font-size: ${(props) =>
    props.$preview === "sm"
      ? "14"
      : props.$data?.setting?.descriptionFontSize || "24"}px;
  font-weight: ${(props) =>
    props.$data?.setting?.descriptionFontWeight || "normal"};
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const Btn = styled.button<{
  $data: RichTextBlock;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  color: ${(props) => props.$data?.setting?.btnTextColor || "#fff"};
  background-color: ${(props) =>
    props.$data?.setting?.btnBackgroundColor || "#007BFF"};
  padding: ${(props) => (props.$preview === "sm" ? "7px 20px" : "15px 30px")};
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: transform 0.4s ease-in-out;
  &:hover {
    transform: scale(1.02);
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
  previewWidth,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [preview, setPreview] = useState(previewWidth);

  useEffect(() => {
    if (window.innerWidth <= 425) {
      setPreview("sm");
    } else {
      setPreview(previewWidth);
    }
  }, [previewWidth]);
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
      $preview={preview}
      $previewWidth={previewWidth}
      dir="rtl"
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
            <h3 className="text-lg font-bold mb-4 ">
              آیا از حذف
              <span className="text-blue-400 font-bold mx-1">{actualName}</span>
              مطمئن هستید؟
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
        <div className="absolute w-fit -top-5 -left-1 z-10 flex flex-row-reverse">
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

      {textHeading && (
        <H1 $data={blocks} $previewWidth={previewWidth} $preview={preview}>
          {textHeading}
        </H1>
      )}

      <hr className="w-[70%] h-[4px] bg-white mb-4" />

      {description && (
        <P $previewWidth={previewWidth} $data={blocks} $preview={preview}>
          {description}
        </P>
      )}
      {btnLink && (
        <Link href={"#"} passHref legacyBehavior>
          <Btn $data={blocks} $previewWidth={previewWidth} $preview={preview}>
            {btnText}
          </Btn>
        </Link>
      )}
    </Section>
  );
};

export default RichText;
