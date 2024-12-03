"use client";
import styled from "styled-components";
import React, { useState } from "react";
import { SlideSection, Layout, SlideBlock } from "@/lib/types";
import { Delete } from "../C-D";

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
}>`
  position: relative;
  margin: 0px 10px;
  margin-top: ${(props) => props.$data.setting.marginTop}px;
  margin-bottom: ${(props) => props.$data.setting.marginBottom}px;
  padding-top: ${(props) => props.$data.setting.paddingTop}px;
  padding-bottom: ${(props) => props.$data.setting.paddingBottom}px;
  background-color: ${(props) =>
    props.$data.setting.backgroundColorBox || "transparent"};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SlideContainer = styled.div<{ $previewWidth: "sm" | "default" }>`
  width: 100%;
  max-width: ${(props) => (props.$previewWidth === "sm" ? "400px" : "800px")};
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

const SlideImage = styled.img<{ $data: SlideBlock }>`
  width: 100%;
  border-radius: ${(props) => props.$data?.setting?.imageRadious || "10px"};
  opacity: ${(props) => props.$data?.setting?.opacityImage || 1};
  object-fit: ${(props) => props.$data?.setting?.imageBehavior || "cover"};
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
}>`
  color: ${(props) => props.$data.textColor || "#000"};
  font-size: ${(props) =>
    props.$previewWidth === "sm"
      ? "18"
      : props.$data?.setting?.textFontSize || "22"}px;
  font-weight: ${(props) => props.$data.textFontWeight || "bold"};
  margin-top: 5px;
  text-align: center;
`;

const SlideDescription = styled.p<{
  $data: SlideSection["setting"];
  $previewWidth: "sm" | "default";
}>`
  color: ${(props) => props.$data.descriptionColor || "#333"};
  font-size: ${(props) =>
    props.$previewWidth === "sm"
      ? "14"
      : props.$data?.setting?.descriptionFontSize || "22"}px;
  font-weight: ${(props) => props.$data.descriptionFontWeight || "normal"};
  padding: 20px;
  text-align: center;
  margin-top: 5px;
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 10px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
`;

const PrevButton = styled(NavButton)`
  left: 10px;
`;

const NextButton = styled(NavButton)`
  right: 10px;
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

  const sectionData = layout.sections.children?.sections.find(
    (section) => section.type === actualName
  ) as SlideSection;

  if (!sectionData) return null;

  const { blocks } = sectionData;

  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % blocks.length);
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 + blocks.length) % blocks.length);

  return (
    <SectionSlideShow
      $data={sectionData}
      $previewWidth={previewWidth}
      onClick={() => setSelectedComponent(actualName)}
      className={`relative transition-all duration-150 ${
        selectedComponent === actualName
          ? "border-4 border-blue-500 rounded-lg"
          : ""
      }`}
    >
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-bold">حذف {actualName}؟</h3>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-cancel"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  Delete(actualName, layout, setLayout);
                  setShowDeleteModal(false);
                }}
                className="btn-delete"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      <SlideContainer $previewWidth={previewWidth}>
        <SlidesWrapper $currentIndex={currentIndex}>
          {blocks.map((slide, index) => (
            <Slide key={index}>
              <SlideImage
                src={slide.imageSrc}
                alt={slide.imageAlt || "Slide"}
                $data={slide}
              />
              <SlideTextBox>
                <SlideHeading
                  $data={sectionData.setting}
                  $previewWidth={previewWidth}
                >
                  {slide.text}
                </SlideHeading>
                <SlideDescription $data={sectionData.setting} $previewWidth={previewWidth}>
                  {slide.description}
                </SlideDescription>
              </SlideTextBox>
            </Slide>
          ))}
        </SlidesWrapper>
        <PrevButton onClick={handlePrev}>{"<"}</PrevButton>
        <NextButton onClick={handleNext}>{">"}</NextButton>
      </SlideContainer>
    </SectionSlideShow>
  );
};

export default SlideShow;
