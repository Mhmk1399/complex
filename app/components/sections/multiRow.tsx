import { Layout, MultiRowSection, MultiRowBlock } from "@/lib/types";
import React, { useState } from "react";
import styled from "styled-components";
import { Delete } from "../C-D";

// Types
interface MultiRowShowProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
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
  @media (max-width: 768px) {
    font-size: 28px;
  }
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
  gap: 5px;
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
  min-height: 100px;
  width: 100%;
  text-align: center;
  padding: 0 10px;
  border-right: 3px solid gray;
  @media (max-width: 768px) {
    font-size: 15px;
    margin-bottom: 10px;
  }
`;

const Button = styled.a<{ $data: MultiRowSection }>`
  display: inline-block;
  padding: 10px 30px 10px 30px;
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
  actualName,
  selectedComponent,
  setLayout,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const sectionData = (layout.sections?.children?.sections?.find(
    (section) => section.type === actualName
  ) as MultiRowSection) || {
    title: "",
    blocks: [{ setting: {} }],
    setting: {},
  };

  if (!sectionData) {
    return null;
  }

  return (
    <>
      <Title $data={sectionData}>
        {sectionData?.title || "No title available"}
      </Title>
      <Section
        $data={sectionData}
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
