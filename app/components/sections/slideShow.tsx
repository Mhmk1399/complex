"use client";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { SlideSection, Layout } from "@/lib/types";
import { Delete } from "../C-D";
import Link from "next/link";

interface SlideShowProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
  previewWidth: "sm" | "default";
}

const SectionSlideShow = styled.section<{
  $data: SlideSection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  position: relative;
  margin: 0px 10px;
  margin-top: ${(props) => props.$data.setting.marginTop}px;
  margin-bottom: ${(props) => props.$data.setting.marginBottom}px;
  padding-top: ${(props) => props.$data.setting.paddingTop}px;
  padding-bottom: ${(props) => props.$data.setting.paddingBottom}px;
  padding-left: ${(props) => props.$data.setting.paddingLeft}px;
  padding-right: ${(props) => props.$data.setting.paddingRight}px;
  background-color: ${(props) =>
    props.$data.setting.backgroundColorBox || "transparent"};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SlideContainer = styled.div<{
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  width: 100%;
  max-width: ${(props) => (props.$preview === "sm" ? "400px" : "800px")};
  overflow: hidden;
  position: relative;
`;

const SlidesWrapper = styled.div<{ $currentIndex: number }>`
  display: flex;
  transition: transform 0.6s ease-in-out;
  transform: translateX(${(props) => props.$currentIndex * -100}%);
`;

const Slide = styled.div`
  flex: 0 0 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SlideImage = styled.img<{ $data: SlideSection["setting"] }>`
  width: 100%;
  border-radius: ${(props) => props.$data?.imageRadious || "10"}px;
  opacity: ${(props) => props.$data?.opacityImage || 1};
  object-fit: ${(props) => props.$data?.imageBehavior || "cover"};
`;

const SlideTextBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
`;

const SlideHeading = styled.h3<{
  $data: SlideSection["setting"];
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  color: ${(props) => props.$data.textColor || "#000"};
  font-size: ${(props) =>
    props.$preview === "sm" ? "18" : props.$data?.textFontSize || "22"}px;
  font-weight: ${(props) => props.$data.textFontWeight || "bold"};
  margin-top: 5px;
  text-align: center;
`;

const SlideDescription = styled.p<{
  $data: SlideSection["setting"];
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  color: ${(props) => props.$data.descriptionColor || "#333"};
  font-size: ${(props) =>
    props.$preview === "sm"
      ? "14"
      : props.$data?.descriptionFontSize || "22"}px;
  font-weight: ${(props) => props.$data.descriptionFontWeight || "normal"};
  padding: 20px;
  text-align: center;
  margin-top: 5px;
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-250%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 10px;
  border: none;
  border-radius: 20%;
  cursor: pointer;
  z-index: 10;
  @media (max-width: 425px) {
    transform: translateY(-390%);
    padding: 7px;
  }
  @media (max-width: 768px) {
    transform: translateY(-290%);
    padding: 7px;
  }
`;

const PrevButton = styled(NavButton)`
  left: 5px;
`;

const NextButton = styled(NavButton)`
  right: 5px;
`;

const Button = styled.button<{
  $data: SlideSection;
}>`
  text-align: center;
  background-color: ${(props) =>
    props.$data?.setting?.btnBackgroundColor || ""};
  color: ${(props) => props.$data?.setting?.btnTextColor || ""};
  padding: 10px 20px;
`;

const SlideShow: React.FC<SlideShowProps> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
  setLayout,
  previewWidth,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [preview, setPreview] = useState(previewWidth);
  
  useEffect(() => {
    if (window.innerWidth <= 425) {
      setPreview("sm");
    } else {
      setPreview(previewWidth);
    }
  }, [previewWidth]);

  const sectionData = layout?.sections?.children?.sections.find(
    (section) => section.type === actualName
  ) as SlideSection;

  // Also add an early return if layout is not properly initialized
  if (!layout || !layout.sections) {
    return null;
  }

  if (!sectionData) return null;

  const { blocks } = sectionData;

  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % blocks.length);
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 + blocks.length) % blocks.length);
  if (currentIndex >= blocks.length) {
    setCurrentIndex(blocks.length - 1);
    return null;
  }
  

  return (
    <SectionSlideShow
      $preview={preview}
      $data={sectionData}
      $previewWidth={previewWidth}
      onClick={() => setSelectedComponent(actualName)}
      className={`transition-all duration-150 ease-in-out relative ${
        selectedComponent === actualName
          ? "border-4 border-blue-500 rounded-2xl shadow-lg "
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

      <SlideContainer $previewWidth={previewWidth} $preview={preview}>
        <SlidesWrapper $currentIndex={currentIndex}>
          {blocks.map((slide, index) => (
            <Slide key={index}>
              <SlideImage
                src={slide.imageSrc}
                alt={slide.imageAlt || "Slide"}
                $data={sectionData.setting}
              />
              <SlideTextBox>
                <SlideHeading
                  $preview={preview}
                  $data={sectionData.setting}
                  $previewWidth={previewWidth}
                >
                  {slide.text}
                </SlideHeading>
                <SlideDescription
                  $preview={preview}
                  $data={sectionData.setting}
                  $previewWidth={previewWidth}
                >
                  {slide.description}
                </SlideDescription>
                <Button $data={sectionData}>
                  <Link
                    href={slide.btnLink ? slide.btnLink : "#"}
                    target="_blank"
                  >
                    {slide.btnText ? slide.btnText : "بیشتر بخوانید"}
                  </Link>
                </Button>
              </SlideTextBox>
            </Slide>
          ))}{" "}
        </SlidesWrapper>
        <PrevButton onClick={handlePrev}>{"<"}</PrevButton>
        <NextButton onClick={handleNext}>{">"}</NextButton>
      </SlideContainer>
    </SectionSlideShow>
  );
};

export default SlideShow;
