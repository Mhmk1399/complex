import { Layout, MultiRowSection, MultiRowBlock } from "@/lib/types";
import React, { useState } from "react";
import styled from "styled-components";
import { Delete } from "../C-D";

interface MultiRowShowProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
  previewWidth: "sm" | "default";
}

const Section = styled.section<{
  $data: MultiRowSection;
  $previewWidth: string;
}>`
  padding-top: ${(props) => props.$data.setting?.paddingTop || "20px"}px;
  padding-bottom: ${(props) => props.$data.setting?.paddingBottom || "20px"}px;
  margin-top: ${(props) => props.$data.setting?.marginTop || "20px"}px;
  margin-bottom: ${(props) => props.$data.setting?.marginBottom || "20px"}px;
  background-color: ${(props) =>
    props.$data.setting?.backgroundColorMultiRow || "#ffffff"};
  width: ${(props) => (props.$previewWidth === "sm" ? "375px" : "100%")};
  margin: 0 auto;
  border-radius: 12px;
`;

const RowContainer = styled.div<{ $previewWidth: string }>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => (props.$previewWidth === "sm" ? "8px" : "16px")};
  padding: ${(props) => (props.$previewWidth === "sm" ? "10px" : "20px")};
`;

const Row = styled.div<{ $data: MultiRowSection; $previewWidth: string }>`
  display: flex;
  flex-direction: ${(props) =>
    props.$previewWidth === "sm"
      ? "column"
      : props.$data.setting?.imageAlign || "row-reverse"};
  gap: ${(props) => (props.$previewWidth === "sm" ? "10px" : "20px")};
  padding: ${(props) => (props.$previewWidth === "sm" ? "15px" : "30px")};
  background-color: ${(props) =>
    props.$data.setting?.backgroundColorBox || "#f9f9f9"};
  border-radius: 18px;
`;

const ContentWrapper = styled.div<{
  $data: MultiRowSection;
  $previewWidth: string;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${(props) => (props.$previewWidth === "sm" ? "18px" : "16px")};
  width: ${(props) => (props.$previewWidth === "sm" ? "100%" : "60%")};
`;

const Image = styled.img<{ $data: MultiRowSection; $previewWidth: string }>`
  width: ${(props) =>
    props.$previewWidth === "sm" ? "100%" : props.$data.setting?.imageWidth}px;
  height: ${(props) =>
    props.$previewWidth === "sm"
      ? "200px"
      : props.$data.setting?.imageHeight}px;
  object-fit: cover;
  border-radius: ${(props) => props.$data.setting?.imageRadius || "8px"}px;
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: scale(1.01);
    opacity: 0.7;
    cursor: pointer;
  }
`;

const Title = styled.h2<{ $data: MultiRowSection; $previewWidth: string }>`
  font-size: ${(props) =>
    props.$previewWidth === "sm"
      ? "24"
      : props.$data.setting?.titleFontSize || "24"}px;
  color: ${(props) => props.$data?.setting?.titleColor || "#ffffff"};
  text-align: center;
  margin-bottom: ${(props) => (props.$previewWidth === "sm" ? "10px" : "20px")};
`;

const Heading = styled.h2<{ $data: MultiRowSection; $previewWidth: string }>`
  color: ${(props) => props.$data.setting?.headingColor || "#333"};
  font-size: ${(props) =>
    props.$previewWidth === "sm"
      ? "22"
      : props.$data.setting?.headingFontSize || "24"}px;
  font-weight: ${(props) => props.$data.setting?.headingFontWeight || "bold"};
  text-align: center;
  @media (max-width: 768px) {
    font-size: 24px;
    margin-top: 10px;
  }
`;

const Description = styled.p<{ $data: MultiRowSection; $previewWidth: string }>`
  font-size: ${(props) =>
    props.$previewWidth === "sm"
      ? "14"
      : props.$data.setting?.descriptionFontSize || "16"}px;
  color: ${(props) => props.$data.setting?.descriptionColor || "#666"};
  text-align: center;
  padding: ${(props) => (props.$previewWidth === "sm" ? "0 15" : "0 10")}px;
`;

const Button = styled.a<{ $data: MultiRowSection; $previewWidth: string }>`
  padding: ${(props) =>
    props.$previewWidth === "sm" ? "8px 20px" : "10px 30px"};
  font-size: ${(props) => (props.$previewWidth === "sm" ? "14px" : "16px")};
  background-color: ${(props) =>
    props.$data.setting?.btnBackgroundColor || "#007BFF"};
  color: ${(props) => props.$data.setting?.btnColor || "#fff"};
  border-radius: 5px;
  text-align: center;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const MultiRow: React.FC<MultiRowShowProps> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
  setLayout,
  previewWidth,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const sectionData = (layout.sections?.children?.sections?.find(
    (section) => section.type === actualName
  ) as MultiRowSection) || { blocks: [], setting: {} };

  if (!sectionData) return null;

  return (
    <Section
      $data={sectionData}
      $previewWidth={previewWidth}
      onClick={() => setSelectedComponent(actualName)}
      className={`transition-all duration-150 ease-in-out relative ${
        selectedComponent === actualName
          ? "border-4 border-blue-500 rounded-lg shadow-lg "
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
        <div className="absolute w-fit -top-5 -left-1 z-10 flex">
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
      <Title $data={sectionData} $previewWidth={previewWidth}>
        {sectionData.title}
      </Title>

      <RowContainer $previewWidth={previewWidth}>
        {Object.entries(sectionData.blocks).map(([key, block], idx) => {
          if (key === "setting") return null;
          const typedBlock = block as MultiRowBlock;

          return (
            <Row key={idx} $data={sectionData} $previewWidth={previewWidth}>
              <Image
                src={typedBlock.imageSrc || "/default-image.jpg"}
                alt={typedBlock.imageAlt || ""}
                $data={sectionData}
                $previewWidth={previewWidth}
              />
              <ContentWrapper $previewWidth={previewWidth} $data={sectionData}>
                <Heading $previewWidth={previewWidth} $data={sectionData}>
                  {typedBlock.heading}
                </Heading>
                <Description $data={sectionData} $previewWidth={previewWidth}>
                  {typedBlock.description}
                </Description>
                <Button
                  href={typedBlock.btnLink || "#"}
                  $data={sectionData}
                  $previewWidth={previewWidth}
                >
                  {typedBlock.btnLable || "Learn More"}
                </Button>
              </ContentWrapper>
            </Row>
          );
        })}
      </RowContainer>
    </Section>
  );
};

export default MultiRow;
