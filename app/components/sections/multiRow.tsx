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
  btnText?: string;
  title?: string;
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
  background-color: ${(props) =>
    props.$data.setting?.backgroundColorMultiRow || "#ffffff"};
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  border-radius: 12px;
`;

const Heading = styled.h2<{ $data: SectionData }>`
  color: ${(props) => props.$data.setting?.titleColor || "#333"};
  font-size: ${(props) => props.$data.setting?.titleFontSize || "24px"};
  font-weight: ${(props) => props.$data.setting?.titleFontWeight || "bold"};
  text-align: center;
  margin-bottom: 20px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  align-items: center;
`;

const Row = styled.div<{ $data: SectionData }>`
  padding: 20px;
  border-radius: ${(props) => props.$data.setting?.imageRadius || "8px"};
  background-color: ${(props) =>
    props.$data.setting?.backgroundColorBox || "#f9f9f9"};
  text-align: center;
  width: 100%;
  max-width: 500px;
`;

const Image = styled.img<{ $data: SectionData }>`
  width: ${(props) => props.$data.setting?.imageWidth || "100%"};
  height: ${(props) => props.$data.setting?.imageHeight || "auto"};
  border-radius: ${(props) => props.$data.setting?.imageRadius || "8px"};
  object-fit: cover;
  margin-bottom: 10px;
`;

const Description = styled.p<{ $data: SectionData }>`
  color: ${(props) => props.$data.setting?.descriptionColor || "#666"};
  font-size: ${(props) => props.$data.setting?.descriptionFontSize || "16px"};
  font-weight: ${(props) =>
    props.$data.setting?.descriptionFontWeight || "normal"};
  margin-bottom: 10px;
`;

const Button = styled.a<{ $data: SectionData }>`
  display: inline-block;
  padding: 10px 20px;
  color: ${(props) => props.$data.setting?.btnColor || "#fff"};
  background-color: ${(props) =>
    props.$data.setting?.btnBackgroundColor || "#007BFF"};
  border-radius: 5px;
  text-decoration: none;
  &:hover {
    opacity: 0.8;
  }
`;

const MultiRow: React.FC<MultiRowShowProps> = ({
  setSelectedComponent,
  layout,
}) => {
  const sectionData = layout.sections?.children?.sections?.[9] || {
    blocks: [{ setting: {} }],
    setting: {},
  };

  return (
    <Section
      dir="rtl"
      $data={sectionData}
      onClick={() => setSelectedComponent("multi-row")}
    >
      <Heading $data={sectionData}>
        {sectionData?.title || "No title available"}
      </Heading>
      <RowContainer>
        {sectionData.blocks.map((block: BlocksType, index: number) => (
          <Row key={index} $data={sectionData}>
            {block.imageSrc && (
              <Image
                src={block.imageSrc || "/assets/images/banner1.jpg"}
                alt={block.imageAlt || "image"}
                $data={sectionData}
              />
            )}
            <Description $data={sectionData}>
              {block.description || "No description available"}
            </Description>
            <Button href={block.btnLink || "#"} $data={sectionData}>
              {block.btnLabel || "Learn More"}
            </Button>
          </Row>
        ))}
      </RowContainer>
    </Section>
  );
};
export default MultiRow;
