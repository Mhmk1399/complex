import { Layout, MultiColumnSection } from "@/lib/types";
import styled from "styled-components";
import { Delete } from "../C-D";
import { useEffect, useState } from "react";

interface MultiColumnProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
  previewWidth: "sm" | "default";
}

const Section = styled.section<{
  $data: MultiColumnSection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  padding-top: ${(props) =>
    props.$preview === "sm" ? "10" : props.$data.setting?.paddingTop || "20"}px;
  padding-bottom: ${(props) =>
    props.$preview === "sm"
      ? "10"
      : props.$data.setting?.paddingBottom || "20"}px;
  padding-right: ${(props) =>
    props.$preview === "sm"
      ? "10"
      : props.$data.setting?.paddingRight || "20"}px;
  padding-left: ${(props) =>
    props.$preview === "sm"
      ? "10"
      : props.$data.setting?.paddingLeft || "20"}px;
  margin-top: ${(props) =>
    props.$preview === "sm" ? "10" : props.$data.setting?.marginTop || "20"}px;
  margin-bottom: ${(props) =>
    props.$preview === "sm"
      ? "10"
      : props.$data.setting?.marginBottom || "20"}px;
  background-color: ${(props) =>
    props.$data.setting?.backgroundColorBox || "#ffffff"};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${(props) => (props.$preview === "sm" ? "10" : "15")}px;
  border-radius: 12px;
  width: ${(props) => (props.$preview === "sm" ? "100%" : "auto")}px;
  margin-left: ${(props) => (props.$preview === "sm" ? "5" : "10")}px;
  margin-right: ${(props) => (props.$preview === "sm" ? "5" : "10")}px;
`;

const Heading = styled.h2<{
  $data: MultiColumnSection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  color: ${(props) => props.$data.setting?.headingColor || "#333"};
  font-size: ${(props) => {
    const baseSize = props.$data.setting?.headingFontSize || 24;
    return props.$preview === "sm"
      ? `${(baseSize as number) * 0.8}px`
      : `${baseSize}px`;
  }};
  font-weight: ${(props) => props.$data.setting?.headingFontWeight || "bold"};
  text-align: center;
  margin-bottom: ${(props) => (props.$preview === "sm" ? "10px" : "20px")};
`;

const ColumnContainer = styled.div<{
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  // display: flex;
  gap: ${(props) => (props.$preview === "sm" ? "10px" : "20px")};
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-direction: ${(props) => (props.$preview === "sm" ? "column" : "row")};
  @media (max-width: 769px) {
    flex-direction: ${(props) => (props.$preview === "sm" ? "column" : "row")};
  }
`;

const Column = styled.div<{
  $data: MultiColumnSection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  padding: ${(props) => (props.$preview === "sm" ? "10px" : "20px")};
  border-radius: ${(props) => props.$data.setting?.imageRadious || "8px"}px;
  text-align: center;
  width: ${(props) => (props.$preview === "sm" ? "100%" : "30%")};
  min-height: ${(props) => (props.$preview === "sm" ? "auto" : "600px")};
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
`;

const Title = styled.h3<{
  $data: MultiColumnSection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  font-size: ${(props) => {
    const baseSize = props.$data.setting?.titleFontSize || 24;
    return props.$preview === "sm"
      ? `${(baseSize as number) * 0.8}`
      : `${baseSize}`;
  }}px;
  font-weight: ${(props) => props.$data.setting?.titleFontWeight || "bold"};
  color: ${(props) => props.$data.setting?.titleColor || "#ffffff"};
  margin-bottom: ${(props) => (props.$preview === "sm" ? "5px" : "10px")};
  min-height: ${(props) => (props.$preview === "sm" ? "40px" : "60px")};
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

const Description = styled.p<{
  $data: MultiColumnSection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  font-size: ${(props) => {
    const baseSize = props.$data.setting?.descriptionFontSize || 16;
    return props.$preview === "sm"
      ? `${(baseSize as number) * 0.9}`
      : `${baseSize}`;
  }}px;
  font-weight: ${(props) =>
    props.$data.setting?.descriptionFontWeight || "normal"};
  color: ${(props) => props.$data.setting?.descriptionColor || "#ffffff"};
  margin-bottom: ${(props) => (props.$preview === "sm" ? "10px" : "15px")};
  // min-height: ${(props) => (props.$preview === "sm" ? "80px" : "110px")};
  // max-height: ${(props) => (props.$preview === "sm" ? "120px" : "150px")};
  overflow-y: visible;
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
  selectedComponent,
  setLayout,
  previewWidth,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [preview, setPreview] = useState(previewWidth);

  useEffect(() => {
    if (window.innerWidth < 426) {
      setPreview("sm");
    } else {
      setPreview(previewWidth);
    }
  }, [previewWidth]);
  const sectionData = (layout.sections?.children?.sections.find(
    (section) => section.type === actualName
  ) as MultiColumnSection) || {
    blocks: [{ setting: {} }],
    setting: {},
  };

  if (!sectionData) {
    return null;
  }

  return (
    <Section
      $preview={preview}
      $previewWidth={previewWidth}
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

      <Heading
        $data={sectionData}
        $previewWidth={previewWidth}
        $preview={preview}
      >
        {sectionData?.setting.heading || "heading"}
      </Heading>
      {/* // Replace the existing mapping code with this: */}
      <ColumnContainer $previewWidth={previewWidth} $preview={preview}>
        {Object.entries(sectionData.blocks).map(([key, block], idx) => {
          if (key === "setting") return null;
          const index = Number(key);
          if (isNaN(index)) return null;
          const typedBlock = block as MultiColumnSection;
          return (
            <Column
              key={idx}
              $data={sectionData}
              $previewWidth={previewWidth}
              $preview={preview}
            >
              <Title
                $data={sectionData}
                $previewWidth={previewWidth}
                $preview={preview}
              >
                {
                  typedBlock[
                    `title${index + 1}` as keyof MultiColumnSection
                  ] as React.ReactNode
                }
              </Title>
              <Description
                $previewWidth={previewWidth}
                $data={sectionData}
                $preview={preview}
              >
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
