import React, { useState } from "react";
import styled from "styled-components";

// Types
interface SlideShowProps {
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
  imageSrc?: string;
  imageAlt?: string;
  text?: string;
  description?: string;
  btnLink?: string;
  btnText?: string;
}

interface SettingType {
  paddingTop?: string;
  paddingBottom?: string;
  marginTop?: string;
  marginBottom?: string;
  descriptionColor?: string;
  descriptionFontSize?: string;
  descriptionFontWeight?: string;
  textColor?: string;
  textFontSize?: string;
  textFontWeight?: string;
  btnTextColor?: string;
  btnBackgroundColor?: string;
  backgroundColorBox?: string;
  opacityImage?: string;
  imageWidth?: string;
  imageHeight?: string;
  imageRadius?: string;
}

interface SectionData {
  blocks: BlocksType[];
  setting: SettingType;
}

// Styled Components
const Section = styled.section<{ $data: SectionData }>`
  padding-top: ${(props) => props.$data.setting?.paddingTop || "20px"};
  padding-bottom: ${(props) => props.$data.setting?.paddingBottom || "20px"};
  margin-top: ${(props) => props.$data.setting?.marginTop || "20px"};
  margin-bottom: ${(props) => props.$data.setting?.marginBottom || "20px"};
  display: flex;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 10px;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.$data.setting?.backgroundColorBox || "transparent"};
`;

const SlideContainer = styled.div<{ $data: BlocksType }>`
  max-width: 800px;
  overflow: hidden;
  border-radius: ${(props) =>
    props.$data.setting?.backgroundBoxRadius || "10px"};
  margin: 0 20px;
  position: relative;
  display: flex;
  justify-content: center;
`;
const SlidesWrapper = styled.div<{ $currentIndex: number }>`
  display: flex;
  text-align: center;
  transition: transform 0.6s ease-in-out;
  transform: translateX(${(props) => props.$currentIndex * -100}%);
  width: 100%;
`;

const Slide = styled.div`
  flex: 0 0 100%;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
`;

const SlideImage = styled.img<{ $data: SectionData }>`
  width: 100%;
  object-fit: cover;
  opacity: ${(props) => props.$data.setting?.opacityImage || 0.5};
  border-radius: ${(props) => props.$data.setting?.imageRadius || "10px"};
  margin: 10px auto;
  position: relative;
`;

const SlideText = styled.h3<{ $data: BlocksType }>`
  color: ${(props) => props.$data.setting?.textColor || "#fff"};
  font-size: ${(props) => props.$data.setting?.textFontSize || "24px"};
  font-weight: ${(props) => props.$data.setting?.textFontWeight || "bold"};
  padding: 10px;
`;

const SlideDescription = styled.p<{ $data: SettingType }>`
  padding: 5px;
  color: ${(props) => props.$data?.descriptionColor || "#333"};
  height: 150px;
  font-size: ${(props) => props.$data.descriptionFontSize || "16px"};
  font-weight: ${(props) => props.$data.descriptionFontWeight || "normal"};
`;

const Button = styled.a<{ $data: SettingType }>`
  display: inline-block;
  margin-top: 10px;
  padding: 10px 20px;
  color: ${(props) => props.$data.btnTextColor || "#fff"};
  background-color: ${(props) => props.$data.btnBackgroundColor || "#5b8e7d"};
  border-radius: 5px;
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
    top: 34%;
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
}) => {
  const sectionData = layout.sections?.children?.sections?.[1] || {
    blocks: [{ setting: {} }],
    setting: {},
  };
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = sectionData.blocks;

  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <Section
      $data={sectionData}
      onClick={() => setSelectedComponent("slideshow")}
    >
      <SlideContainer $data={slides[0]}>
        <SlidesWrapper $currentIndex={currentIndex}>
          {slides.map((slide: BlocksType, index) => (
            <Slide key={index}>
              <SlideImage
                src={slide.imageSrc}
                alt={slide.imageAlt}
                $data={sectionData}
              />
              <SlideText $data={slide}>{slide.text}</SlideText>
              <SlideDescription $data={sectionData.setting}>
                {slide.description || "No description available"}
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
