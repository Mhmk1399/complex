import React from "react";
import styled from "styled-components";

interface MultiColumnProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: {
    sections?: {
      children?: { sections: SectionData[] };
    };
  };
}
interface ColumnBlock {
  title1?: string;
  title2?: string;
  title3?: string;
  description1?: string;
  description2?: string;
  description3?: string;
  imageSrc1?: string;
  imageSrc2?: string;
  imageSrc3?: string;
  imageAlt1?: string;
  imageAlt2?: string;
  imageAlt3?: string;
  btnLink1?: string;
  btnLink2?: string;
  btnLink3?: string;
  btnLable1?: string;
  btnLable2?: string;
  btnLable3?: string;
}
interface BlocksType {
  setting: {
    [key: string]: string;
  };
  title?: string;
  title2?: string;
  title3?: string;
  description?: string;
  description2?: string;
  description3?: string;
  btnLabel?: string;
  btnLabel2?: string;
  btnLabel3?: string;
  btnLink?: string;
  btnLink2?: string;
  btnLink3?: string;
  imageAlt?: string;
  imageSrc?: string;
}

interface SettingType {
  heading: string;
  paddingTop?: string;
  paddingBottom?: string;
  marginTop?: string;
  marginBottom?: string;
  backgroundColorBox?: string;
  headingColor?: string;
  headingFontSize?: string;
  headingFontWeight?: string;
  imageRadious?: string;
  imageWidth?: string;
  imageHeight?: string;
  imageBehavior?: string;
  titleColor?: string;
  titleFontSize?: string;
  titleFontWeight?: string;
  descriptionColor?: string;
  descriptionFontSize?: string;
  descriptionFontWeight?: string;
  btnColor?: string;
  btnBackgroundColor?: string;
}

interface SectionData {
  blocks: BlocksType[];
  setting: SettingType;
}

// Styled Components
const Section = styled.section<{ $data: SectionData }>`
  padding-top: ${(props) => props.$data.setting?.paddingTop || "20px"}px;
  padding-bottom: ${(props) => props.$data.setting?.paddingBottom || "20px"}px;
  margin-top: ${(props) => props.$data.setting?.marginTop || "20px"}px;
  margin-bottom: ${(props) => props.$data.setting?.marginBottom || "20px"}px;
  background-color: ${(props) =>
    props.$data.setting?.backgroundColorBox || "#ffffff"};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  margin-right: 10px;
  gap: 15px;
  border-radius: 12px;
`;

const Heading = styled.h2<{ $data: SectionData }>`
  color: ${(props) => props.$data.setting?.headingColor || "#333"};
  font-size: ${(props) => props.$data.setting?.headingFontSize || "24px"}px;
  font-weight: ${(props) => props.$data.setting?.headingFontWeight || "bold"};
  text-align: center;
  margin-bottom: 20px;
  margin-top: 20px;

  @media (max-width: 768px) {
    font-size: 28px;
  }

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const ColumnContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const Column = styled.div<{ $data: SectionData }>`
  padding: 20px;
  border-radius: ${(props) => props.$data.setting?.imageRadious || "8px"}px;
  text-align: center;
  width: 500px;

  @media (max-width: 1024px) {
    width: 45%;
  }

  @media (max-width: 768px) {
    width: 90%;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 15px;
  }
`;

const Title = styled.h3<{ $data: SectionData }>`
  font-size: ${(props) => props.$data.setting?.titleFontSize || "24px"}px;
  font-weight: ${(props) => props.$data.setting?.titleFontWeight || "bold"};
  color: ${(props) => props.$data.setting?.titleColor || "#ffffff"};
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 22px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const Image = styled.img<{ $data: SectionData }>`
  width: ${(props) => props.$data.setting?.imageWidth || "500px"}px;
  height: ${(props) => props.$data.setting?.imageHeight || "400px"}px;
  border-radius: ${(props) => props.$data.setting?.imageRadious || "5px"}px;
  object-fit: ${(props) => props.$data.setting?.imageBehavior || "cover"};
  margin-bottom: 10px;
  transition: all 0.5s ease-in-out;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
  }
  &:hover {
    transform: scale(0.95);
  }
`;

const Description = styled.p<{ $data: SectionData }>`
  font-size: ${(props) => props.$data.setting?.descriptionFontSize || "16px"}px;
  font-weight: ${(props) =>
    props.$data.setting?.descriptionFontWeight || "normal"};
  color: ${(props) => props.$data.setting?.descriptionColor || "#ffffff"};
  margin-bottom: 15px;

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const Button = styled.a<{ $data: SectionData }>`
  display: inline-block;
  padding: 10px 30px;
  background-color: ${(props) =>
    props.$data.setting?.btnBackgroundColor || "#000"};
  color: ${(props) => props.$data.setting?.btnColor || "#fff"};
  border-radius: 5px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.5s ease-in-out;

  &:hover {
    opacity: 0.7;
  }

  @media (max-width: 480px) {
    padding: 8px 20px;
    font-size: 14px;
  }
`;

const MultiColumn: React.FC<MultiColumnProps> = ({
  setSelectedComponent,
  layout,
}) => {
  const sectionData = (layout.sections?.children
    ?.sections?.[8] as SectionData) || {
    blocks: [{ setting: {} }],
    setting: {},
  };

  return (
    <Section
      dir="rtl"
      $data={sectionData}
      onClick={() => setSelectedComponent("multicolumn")}
    >
      <Heading $data={sectionData}>
        {sectionData?.setting.heading || "heading"}
      </Heading>
      {/* // Replace the existing mapping code with this: */}
      <ColumnContainer>
        {Object.entries(sectionData.blocks).map(([key, block], idx) => {
          if (key === "setting") return null;
          const index = Number(key);
          if (isNaN(index)) return null;
          const typedBlock = block as ColumnBlock;
          return (
            <Column key={idx} $data={sectionData}>
              <Title $data={sectionData}>
                {typedBlock[`title${index + 1}` as keyof ColumnBlock]}
              </Title>
              <Description $data={sectionData}>
                {typedBlock[`description${index + 1}` as keyof ColumnBlock]}
              </Description>
              <Image
                src={
                  typedBlock[`imageSrc${index + 1}` as keyof ColumnBlock] ||
                  "/assets/images/banner2.webp"
                }
                alt={
                  typedBlock[`imageAlt${index + 1}` as keyof ColumnBlock] || ""
                }
                $data={sectionData}
              />
              <Button
                href={
                  typedBlock[`btnLink${index + 1}` as keyof ColumnBlock] || ""
                }
                $data={sectionData}
              >
                {typedBlock[`btnLable${index + 1}` as keyof ColumnBlock] ||
                  "Learn More"}
              </Button>
            </Column>
          );
        })}
      </ColumnContainer>
    </Section>
  );
};

export default MultiColumn;
