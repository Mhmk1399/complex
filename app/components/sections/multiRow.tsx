import React from "react";
import styled from "styled-components";

// Types
interface MultiRowShowProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: {
    sections?: {
      children?: { sections: SectionData[] };
    };
  };
}
interface ColumnBlock {
  heading?: string;
  description?: string;
  btnLable?: string;
  imageSrc?: string;
  imageAlt?: string;
  btnLink?: string;
}

interface BlocksType {
  setting: {
    // [key: string]: string;
  };
  heading?: string;
  description?: string;
  btnLabel?: string;
  imageSrc?: string;
  imageAlt?: string;
  btnLink?: string;
  btnLable?: string;
}

interface SettingType {
  paddingTop?: string;
  paddingBottom?: string;
  marginTop?: string;
  marginBottom?: string;
  headingColor?: string;
  headingFontSize?: string;
  headingFontWeight?: string;
  descriptionColor?: string;
  descriptionFontWeight?: string;
  descriptionFontSize?: string;
  imageWidth?: string;
  imageHeight?: string;
  imageRadius?: string;
  backgroundColorMultiRow?: string;
  backgroundColorBox?: string;
  btnColor?: string;
  btnBackgroundColor?: string;
  titleColor?: string;
  titleFontWeight?: string;
  titleFontSize?: string;
  imageAlign?: string;
}

interface SectionData {
  title: string;
  blocks: BlocksType[];
  setting: SettingType;
}

// Styled Components
const Section = styled.section<{ $data: SectionData }>`
  padding-top: ${(props) => props.$data.setting?.paddingTop || "20px"};
  padding-bottom: ${(props) => props.$data.setting?.paddingBottom || "20px"};
  margin-top: ${(props) => props.$data.setting?.marginTop || "20px"};
  margin-bottom: ${(props) => props.$data.setting?.marginBottom || "20px"};
  background-color: ${(props) =>
    props.$data.setting?.backgroundColorMultiRow || "#ffffff"};
  display: block;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  border-radius: 12px;
`;

const Title = styled.h2<{ $data: SectionData }>`
  color: ${(props) => props.$data.setting?.titleColor || "#333"};
  font-size: ${(props) => props.$data.setting?.titleFontSize || "24px"};
  font-weight: ${(props) => props.$data.setting?.titleFontWeight || "bold"};
  text-align: center;
  margin-top: 30px;
`;
const Heading = styled.h2<{ $data: SectionData }>`
  color: ${(props) => props.$data.setting?.headingColor || "#333"};
  font-size: ${(props) => props.$data.setting?.headingFontSize || "24px"};
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

const Row = styled.div<{ $data: SectionData }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  margin-right: 10px;
  padding: 30px;
  border-radius: ${(props) => props.$data.setting?.imageRadius || "8px"};
  background-color: ${(props) =>
    props.$data.setting?.backgroundColorBox || "#f9f9f9"};
  max-width: auto;

  @media (min-width: 768px) {
    flex-direction: ${(props) => props.$data.setting?.imageAlign || "row"};
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
`;

const WrapperContainer = styled.div<{ $data: SectionData }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  align-items: center;
`;

const Image = styled.img<{ $data: SectionData }>`
  width: ${(props) => props.$data.setting?.imageWidth || "100%"};
  height: ${(props) => props.$data.setting?.imageHeight || "auto"};
  border-radius: ${(props) => props.$data.setting?.imageRadius || "8px"};
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

const Description = styled.p<{ $data: SectionData }>`
  color: ${(props) => props.$data.setting?.descriptionColor || "#666"};
  font-size: ${(props) => props.$data.setting?.descriptionFontSize || "16px"};
  font-weight: ${(props) =>
    props.$data.setting?.descriptionFontWeight || "normal"};
  margin-bottom: 10px;
  text-align: center;
  padding: 0 10px;
  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const Button = styled.a<{ $data: SectionData }>`
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
  const sectionData = layout.sections?.children?.sections?.[9] || {
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
        onClick={() => setSelectedComponent("multirow")}
      >
        <RowContainer>
          {Object.entries(sectionData.blocks).map(([key, block], idx) => {
            if (key === "setting") return null;
            const index = Number(key);
            if (isNaN(index)) return null;
            const typedBlock = block as ColumnBlock;
            return (
              <Row key={idx} $data={sectionData}>
                {typedBlock.imageSrc && (
                  <Image
                    src={
                      (typedBlock.imageSrc as keyof ColumnBlock) ||
                      "/assets/images/banner2.webp"
                    }
                    alt={(typedBlock.imageAlt as keyof ColumnBlock) || ""}
                    $data={sectionData}
                  />
                )}
                <WrapperContainer $data={sectionData}>
                  <Heading $data={sectionData}>
                    {typedBlock.heading ||
                      ("No title available" as keyof ColumnBlock)}
                  </Heading>
                  <Description $data={sectionData}>
                    {typedBlock.description ||
                      ("description" as keyof ColumnBlock)}
                  </Description>
                  <Button
                    href={
                      typedBlock.btnLink || ("#" as keyof ColumnBlock) || ""
                    }
                    $data={sectionData}
                  >
                    {(typedBlock.btnLable as keyof ColumnBlock) || "Learn More"}
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
