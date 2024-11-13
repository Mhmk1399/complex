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

interface BlocksType {
  setting: {
    [key: string]: string;
  };
  title1?: string;
  title2?: string;
  title3?: string;
  description1?: string;
  description2?: string;
  description3?: string;
  btnLabel1?: string;
  btnLabel2?: string;
  btnLabel3?: string;
  btnLink1?: string;
  btnLink2?: string;
  btnLink3?: string;
  imageAlt1?: string;
  imageAlt2?: string;
  imageAlt3?: string;
  heading?: string;
}

interface SettingType {
  paddingTop?: string;
  paddingBottom?: string;
  marginTop?: string;
  marginBottom?: string;
  backgroundColorBox?: string;
  headingColor?: string;
  headingFontSize?: string;
  headingFontWeight?: string;
  imageRadius?: string;
  imageWidth?: string;
  imageHeight?: string;
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
    props.$data.setting?.backgroundColorBox || "#ffffff"};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const Heading = styled.h2<{ $data: SectionData }>`
  color: ${(props) => props.$data.setting?.headingColor || "#333"};
  font-size: ${(props) => props.$data.setting?.headingFontSize || "24px"};
  font-weight: ${(props) => props.$data.setting?.headingFontWeight || "bold"};
  text-align: center;
  margin-bottom: 20px;
`;

const ColumnContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Column = styled.div<{ $data: SectionData }>`
  background-color: ${(props) =>
    props.$data.setting?.backgroundColorBox || "#f9f9f9"};
  padding: 20px;
  border-radius: ${(props) => props.$data.setting?.imageRadius || "8px"};
  text-align: center;
  width: 300px;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Image = styled.img<{ $data: SectionData }>`
  width: ${(props) => props.$data.setting?.imageWidth || "100px"};
  height: ${(props) => props.$data.setting?.imageHeight || "100px"};
  border-radius: ${(props) => props.$data.setting?.imageRadius || "8px"};
  object-fit: cover;
  margin-bottom: 10px;
  margin-top: 10px;
`;

const Description = styled.p`
  font-size: 16px;
  margin-bottom: 15px;
`;

const Button = styled.a<{ $data: BlocksType }>`
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
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
      onClick={() => setSelectedComponent("multi-column")}
    >
      <Heading $data={sectionData}>{sectionData.blocks[0].heading}</Heading>
      <ColumnContainer>
        {sectionData.blocks.map((block: string | Section, idx: number) => (
          <Column key={idx} $data={sectionData}>
            <Title>gftntfghtghntgfnb</Title>
            <Description>regfte4wtgfwt4w3t</Description>
            <Image
              src={block[`imageAlt${idx + 1}`]}
              alt={block[`imageAlt${idx + 1}`]}
              $data={sectionData}
              
            />
            <Button href={block[`btnLink${idx + 1}`]} $data={block}>
              eh5tr5trh5yrerhge4trg
            </Button>
          </Column>
        ))}
      </ColumnContainer>
    </Section>
  );
};

export default MultiColumn;
