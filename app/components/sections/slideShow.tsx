import React, { useState } from "react";
import styled from "styled-components";
import { SlideSection, Layout, SlideBlock } from "@/lib/types";
import { Delete } from "../C-D";

// Props Interface
interface SlideShowProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
}

// Styled Components
const Section = styled.section<{ $data: SlideSection["setting"] }>`
  padding-top: ${(props) => props.$data.paddingTop || "20px"}px;
  padding-bottom: ${(props) => props.$data.paddingBottom || "20px"}px;
  margin-top: ${(props) => props.$data.marginTop || "20px"}px;
  margin-bottom: ${(props) => props.$data.marginBottom || "20px"}px;
  display: flex;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 10px;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.$data.backgroundColorBox || "transparent"};
`;

const SlideContainer = styled.div<{ $data: SlideBlock | undefined }>`
  max-width: 800px;
  overflow: hidden;
  border-radius: ${(props) =>
    props.$data?.setting?.backgroundBoxRadius || "10px"};
  margin: 0 20px;
  position: relative;
  display: flex;
  justify-content: center;
`;

const SlidesWrapper = styled.div<{ $currentIndex: number }>`
  display: flex;
  transition: transform 0.6s ease-in-out;
  transform: translateX(${(props) => props.$currentIndex * -100}%);
`;

const Slide = styled.div`
  flex: 0 0 100%;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
`;

const SlideImage = styled.img<{ $data: SlideBlock }>`
  width: 100%;
  object-fit: cover;
  opacity: ${(props) => props.$data.setting?.opacityImage || 1};
  border-radius: ${(props) => props.$data.setting?.imageRadious || "10px"};
  margin: 10px auto;
`;

const SlideText = styled.h3<{ $data?: SlideSection["setting"] }>`
  color: ${(props) => props.$data?.textColor || "#fff"};
  font-size: ${(props) => props.$data?.textFontSize || "24px"};
  font-weight: ${(props) => props.$data?.textFontWeight || "bold"};
  text-align: center;
  padding: 10px;
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const SlideDescription = styled.p<{ $data?: SlideSection["setting"] }>`
  color: ${(props) => props.$data?.descriptionColor || "#333"};
  font-size: ${(props) => props.$data?.descriptionFontSize || "16px"};
  font-weight: ${(props) => props.$data?.descriptionFontWeight || "normal"};
  text-align: center;
  padding: 5px;
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const Button = styled.a<{ $data: SlideSection["setting"] }>`
  display: inline-block;
  margin-top: 10px;
  padding: 10px 20px;
  color: ${(props) => props.$data.btnTextColor || "#fff"};
  background-color: ${(props) => props.$data.btnBackgroundColor || "#5b8e7d"};
  border-radius: 5px;
  text-align: center;
  width: 100%;

  text-decoration: none;
  &:hover {
    opacity: 0.8;
  }
`;

const NavButton = styled.button`
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border-radius: 100px;
  padding: 10px;
  cursor: pointer;
  z-index: 10;
  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 425px) {
    transform: translateY(-140%);

    font-size: 10px;
  }
  @media (max-width: 768px) {
    top: 34%;
  }
  @media (min-width: 1024px) {
    top: 38%;
  }
`;

const PrevButton = styled(NavButton)`
  left: 3px;
`;

const NextButton = styled(NavButton)`
  right: 3px;
`;

// SlideShow Component
const SlideShow: React.FC<SlideShowProps> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
  setLayout,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const sectionData: SlideSection = (layout.sections?.children?.sections?.find(
    (section) => section.type === actualName
  ) as SlideSection) || {
    blocks: [],
    setting: {
      paddingTop: "20px",
      paddingBottom: "20px",
      marginTop: "20px",
      marginBottom: "20px",
    },
    type: "slideShow",
  };

  if (!sectionData) {
    return null;
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = sectionData.blocks || [];

  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <Section
      $data={sectionData.setting}
      onClick={() => setSelectedComponent(actualName)}
      className={`transition-all duration-150 ease-in-out relative ${
        selectedComponent === actualName ? "border-4 border-blue-500 " : ""
      }`}
    >
          {showDeleteModal && (
        <div className="fixed inset-0  bg-black bg-opacity-70 z-50 flex items-center justify-center ">
          <div className="bg-white p-8 rounded-lg">
            <h3 className="text-lg font-bold mb-4">
              مطمئن هستید؟
              <span className="text-blue-400 font-bold mx-1">
                {actualName}
              </span> آیا از حذف
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

      <SlideContainer $data={slides[0]}>
        <SlidesWrapper $currentIndex={currentIndex}>
          {slides.map((slide, index) => (
            <Slide key={index}>
              <SlideImage
                src={slide.imageSrc}
                alt={slide.imageAlt}
                $data={slide}
              />
              <SlideText $data={sectionData.setting}>{slide.text}</SlideText>
              <SlideDescription $data={sectionData.setting}>
                {slide.description}
              </SlideDescription>
              <Button href={slide.btnLink} $data={sectionData.setting}>
                {slide.btnText}
              </Button>
            </Slide>
          ))}
        </SlidesWrapper>
        <PrevButton onClick={handlePrev}>{"<"}</PrevButton>
        <NextButton onClick={handleNext}>{">"}</NextButton>
      </SlideContainer>
    </Section>
  );
};

export default SlideShow;
