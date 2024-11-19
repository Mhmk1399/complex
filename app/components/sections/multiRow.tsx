import { Layout, MultiRowSection, MultiRowBlock } from "@/lib/types";
import React from "react";
import styled from "styled-components";

// Types
interface MultiRowShowProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
}

// Styled Components
const Section = styled.section<{ $data: MultiRowSection }>`
  padding-top: ${(props) => props.$data.setting?.paddingTop || "20px"}px;
  padding-bottom: ${(props) => props.$data.setting?.paddingBottom || "20px"}px;
  margin-top: ${(props) => props.$data.setting?.marginTop || "20px"}px;
  margin-bottom: ${(props) => props.$data.setting?.marginBottom || "20px"}px;
  background-color: ${(props) =>
    props.$data.setting?.backgroundColorMultiRow || "#ffffff"};
  display: block;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  border-radius: 12px;
`;

const Title = styled.h2<{ $data: MultiRowSection }>`
  color: ${(props) => props.$data.setting?.titleColor || "#333"};
  font-size: ${(props) => props.$data.setting?.titleFontSize || "24px"}px;
  font-weight: ${(props) => props.$data.setting?.titleFontWeight || "bold"};
  text-align: center;
  margin-top: 30px;
`;
const Heading = styled.h2<{ $data: MultiRowSection }>`
  color: ${(props) => props.$data.setting?.headingColor || "#333"};
  font-size: ${(props) => props.$data.setting?.headingFontSize || "24px"}px;
  font-weight: ${(props) => props.$data.setting?.headingFontWeight || "bold"};
  text-align: center;
  @media (max-width: 768px) {
    font-size: 24px;
    margin-top: 10px;
  }
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  align-items: center;
`;

const Row = styled.div<{ $data: MultiRowSection }>`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  margin-right: 10px;
  padding: 30px;
  border-radius: 18px;
  background-color: ${(props) =>
    props.$data.setting?.backgroundColorBox || "#f9f9f9"};
  max-width: auto;
  flex-direction: ${(props) =>
    props.$data.setting?.imageAlign || "row-reverse"};

  @media (min-width: 768px) {
    align-items: center;
    img {
      width: 40%;
      margin-bottom: 0;
    }

    .content {
      width: 60%;
      text-align: center;
    }
  }
    @media (max-width: 425px) {
    flex-direction: column;
    align-items: center;
    img {
      width: 100%;
      margin-bottom: 10px;
    }
`;

const WrapperContainer = styled.div<{ $data: MultiRowSection }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  align-items: center;
  min-height: 300px; // Add fixed minimum height
  width: 100%; // Fixed width
  padding: 20px;
`;

const Image = styled.img<{ $data: MultiRowSection }>`
  width: 100%;
  height: 100%;
  border-radius: ${(props) => props.$data.setting?.imageRadius || "8px"}px;
  object-fit: cover;
  margin-bottom: 10px;
  transition: all 0.5s ease-in-out;
  box-shadow: 3px 2px 3px 2px rgba(203, 192, 192, 0.2);

  &:hover {
    opacity: 0.4;
    transform: scale(1.01);
    transform: rotate(1deg);
  }
`;

const Description = styled.p<{ $data: MultiRowSection }>`
  color: ${(props) => props.$data.setting?.descriptionColor || "#666"};
  font-size: ${(props) => props.$data.setting?.descriptionFontSize || "16px"}px;
  font-weight: ${(props) =>
    props.$data.setting?.descriptionFontWeight || "normal"};
  margin-bottom: 10px;
  overflow-y: auto; // Allow scrolling if content exceeds height
  min-height: 80px;
  width: 100%;
  text-align: center;
  padding: 0 10px;
  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const Button = styled.a<{ $data: MultiRowSection }>`
  display: inline-block;
  padding: 10px 20px 10px 20px;
  color: ${(props) => props.$data.setting?.btnColor || "#fff"};
  background-color: ${(props) =>
    props.$data.setting?.btnBackgroundColor || "#007BFF"};
  border-radius: 5px;
  text-decoration: none;
  text-align: center;
  transition: all 0.3s ease-in-out;
  &:hover {
    opacity: 0.6;
  }
`;

const MultiRow: React.FC<MultiRowShowProps> = ({
  setSelectedComponent,
  layout,
}) => {
  const sectionData = (layout.sections?.children
    ?.sections?.[9] as MultiRowSection) || {
    title: "",
    blocks: [{ setting: {} }],
    setting: {},
  };

  return (
    <>
      <Title $data={sectionData}>
        {sectionData?.title || "No title available"}
      </Title>
      <Section
        dir="rtl"
        $data={sectionData}
        onClick={() => setSelectedComponent("multiRow")}
      >
        <RowContainer>
          {Object.entries(sectionData.blocks).map(([key, block], idx) => {
            if (key === "setting") return null;
            const index = Number(key);
            if (isNaN(index)) return null;
            const typedBlock = block as MultiRowBlock;
            return (
              <Row key={idx} $data={sectionData}>
                {typedBlock.imageSrc && (
                  <Image
                    src={
                      (typedBlock.imageSrc as string) ||
                      "/assets/images/banner2.webp"
                    }
                    alt={(typedBlock.imageAlt as string) || ""}
                    $data={sectionData}
                  />
                )}
                <WrapperContainer $data={sectionData}>
                  <Heading $data={sectionData}>
                    {typedBlock.heading || "No title available"}
                  </Heading>
                  <Description $data={sectionData}>
                    {typedBlock.description || "description"}
                  </Description>
                  <Button
                    href={typedBlock.btnLink || "#" || ""}
                    $data={sectionData}
                  >
                    {typedBlock.btnLable || "Learn More"}
                  </Button>
                </WrapperContainer>
              </Row>
            );
          })}
        </RowContainer>
      </Section>
    </>
  );
};
export default MultiRow;
