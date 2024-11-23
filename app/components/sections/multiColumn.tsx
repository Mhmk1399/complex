import { Layout, MultiColumnSection } from "@/lib/types";
import styled from "styled-components";

interface MultiColumnProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
}

// Styled Components
const Section = styled.section<{ $data: MultiColumnSection }>`
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

const Heading = styled.h2<{ $data: MultiColumnSection }>`
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

const Column = styled.div<{ $data: MultiColumnSection }>`
  padding: 20px;
  border-radius: ${(props) => props.$data.setting?.imageRadious || "8px"}px;
  text-align: center;
  width: 500px;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  position: relative;

  @media (max-width: 1024px) {
    width: 45%;
    min-height: 500px;
  }

  @media (max-width: 768px) {
    width: 90%;
    min-height: 450px;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 15px;
  }
`;

const Title = styled.h3<{ $data: MultiColumnSection }>`
  font-size: ${(props) => props.$data.setting?.titleFontSize || "24px"}px;
  font-weight: ${(props) => props.$data.setting?.titleFontWeight || "bold"};
  color: ${(props) => props.$data.setting?.titleColor || "#ffffff"};
  margin-bottom: 10px;
  min-height: 60px;
  @media (max-width: 768px) {
    font-size: 22px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const Image = styled.img<{ $data: MultiColumnSection }>`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  border-radius: ${(props) => props.$data.setting?.imageRadious || "5px"}px;
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

const Description = styled.p<{ $data: MultiColumnSection }>`
  font-size: ${(props) => props.$data.setting?.descriptionFontSize || "16px"}px;
  font-weight: ${(props) =>
    props.$data.setting?.descriptionFontWeight || "normal"};
  color: ${(props) => props.$data.setting?.descriptionColor || "#ffffff"};
  width: 100%;
  margin-bottom: 15px;
   min-height: 110px; // Add minimum height
  max-height: 150px
  overflow-y: auto;

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const Button = styled.a<{ $data: MultiColumnSection }>`
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
  actualName,
}) => {
  const sectionData = (layout.sections?.children?.sections.find(
    (section) => section.type === actualName
  ) as MultiColumnSection) || {
    blocks: [{ setting: {} }],
    setting: {},
  };

  if (!sectionData) {
    console.error("MultiColumn section data is missing or invalid.");
    return null;
  }

  return (
    <Section
      dir="rtl"
      $data={sectionData}
      onClick={() => setSelectedComponent(actualName)}
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
          const typedBlock = block as MultiColumnSection;
          return (
            <Column key={idx} $data={sectionData}>
              <Title $data={sectionData}>
                {
                  typedBlock[
                    `title${index + 1}` as keyof MultiColumnSection
                  ] as React.ReactNode
                }
              </Title>
              <Description $data={sectionData}>
                {
                  typedBlock[
                    `description${index + 1}` as keyof MultiColumnSection
                  ] as React.ReactNode
                }
              </Description>
              <Image
                src={
                  (typedBlock[
                    `imageSrc${index + 1}` as keyof MultiColumnSection
                  ] as string) || "/assets/images/banner2.webp"
                }
                alt={
                  (typedBlock[
                    `imageAlt${index + 1}` as keyof MultiColumnSection
                  ] as string) || ""
                }
                $data={sectionData}
              />
              <Button
                href={
                  (typedBlock[
                    `btnLink${index + 1}` as keyof MultiColumnSection
                  ] as string) || ""
                }
                $data={sectionData}
              >
                {(typedBlock[
                  `btnLable${index + 1}` as keyof MultiColumnSection
                ] as React.ReactNode) || "بیشتر"}
              </Button>
            </Column>
          );
        })}{" "}
      </ColumnContainer>
    </Section>
  );
};

export default MultiColumn;
