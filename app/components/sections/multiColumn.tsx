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
  max-width: 100%;
  margin-top: ${(props) => props.$data.setting.marginTop || "30"}px;
  margin-bottom: ${(props) => props.$data.setting.marginBottom}px;
  margin-right: ${(props) => props.$data.setting.marginRight}px;
  margin-left: ${(props) => props.$data.setting.marginLeft}px;
  padding-top: ${(props) => props.$data.setting.paddingTop}px;
  padding-bottom: ${(props) => props.$data.setting.paddingBottom}px;
  padding-left: ${(props) => props.$data.setting.paddingLeft}px;
  padding-right: ${(props) => props.$data.setting.paddingRight}px;
  background-color: ${(props) =>
    props.$data.setting?.backgroundColorBox || "#ffffff"};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${(props) => (props.$preview === "sm" ? "10" : "15")}px;
  border-radius: ${(props) => props.$data.setting.formRadius || 5}px;
  box-shadow: ${(props) =>
    `${props.$data.setting?.shadowOffsetX || 0}px 
     ${props.$data.setting?.shadowOffsetY || 4}px 
     ${props.$data.setting?.shadowBlur || 10}px 
     ${props.$data.setting?.shadowSpread || 0}px 
     ${props.$data.setting?.shadowColor || "#fff"}`};
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
  display: flex;
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

const Image = styled.img<{
  $data: MultiColumnSection;
}>`
  width: 100%;
  height: ${(props) => props.$data.setting?.imageHeight || "5"}px;
  overflow-y: auto;
  border-radius: ${(props) => props.$data.setting?.imageRadious || "5"}px;
  margin-bottom: 10px;
  transition: all 0.5s ease-in-out;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
  }

  /* Default hover effect */
  &:hover {
    transform: scale(0.99);
  }

  /* Apply image animations */
  ${(props) => {
    const imageAnimation = props.$data.setting?.imageAnimation;
    if (!imageAnimation) return "";

    const { type, animation: animConfig } = imageAnimation;
    const selector = type === "hover" ? "&:hover" : "&:active";

    // Generate animation CSS based on type
    if (animConfig.type === "pulse") {
      return `
        ${selector} {
          animation: multiColumnImagePulse ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          transform: none; /* Override default transform */
        }
        
        @keyframes multiColumnImagePulse {
          0%, 100% { 
            opacity: 1;
            filter: brightness(1);
          }
          50% { 
            opacity: 0.7;
            filter: brightness(1.3);
          }
        }
      `;
    } else if (animConfig.type === "glow") {
      return `
        ${selector} {
          animation: multiColumnImageGlow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          transform: none; /* Override default transform */
        }
        
        @keyframes multiColumnImageGlow {
          0%, 100% { 
            filter: brightness(1) drop-shadow(0 0 0px rgba(255, 255, 255, 0));
          }
          50% { 
            filter: brightness(1.2) drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
          }
        }
      `;
    } else if (animConfig.type === "brightness") {
      return `
        ${selector} {
          animation: multiColumnImageBrightness ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          transform: none; /* Override default transform */
        }
        
        @keyframes multiColumnImageBrightness {
          0%, 100% { 
            filter: brightness(1);
          }
          50% { 
            filter: brightness(1.4);
          }
        }
      `;
    } else if (animConfig.type === "blur") {
      return `
        ${selector} {
          animation: multiColumnImageBlur ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          transform: none; /* Override default transform */
        }
        
        @keyframes multiColumnImageBlur {
          0%, 100% { 
            filter: blur(0px);
          }
          50% { 
            filter: blur(2px);
          }
        }
      `;
    } else if (animConfig.type === "saturate") {
      return `
        ${selector} {
          animation: multiColumnImageSaturate ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          transform: none; /* Override default transform */
        }
        
        @keyframes multiColumnImageSaturate {
          0%, 100% { 
            filter: saturate(1);
          }
          50% { 
            filter: saturate(1.8);
          }
        }
      `;
    } else if (animConfig.type === "contrast") {
      return `
        ${selector} {
          animation: multiColumnImageContrast ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          transform: none; /* Override default transform */
        }
        
        @keyframes multiColumnImageContrast {
          0%, 100% { 
            filter: contrast(1);
          }
          50% { 
            filter: contrast(1.5);
          }
        }
      `;
    } else if (animConfig.type === "opacity") {
      return `
        ${selector} {
          animation: multiColumnImageOpacity ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          transform: none; /* Override default transform */
        }
        
        @keyframes multiColumnImageOpacity {
          0% { 
            opacity: 1;
          }
          50% { 
            opacity: 0.4;
          }
          100% { 
            opacity: 1;
          }
        }
      `;
    } else if (animConfig.type === "shadow") {
      return `
        ${selector} {
          animation: multiColumnImageShadow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          transform: none; /* Override default transform */
        }
        
        @keyframes multiColumnImageShadow {
          0%, 100% { 
            filter: drop-shadow(0 0 0px rgba(0, 0, 0, 0));
          }
          50% { 
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
          }
        }
      `;
    }

    return "";
  }}
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

const Button = styled.a<{
  $data: MultiColumnSection;
}>`
  display: inline-block;
  padding: 10px 30px;
  background-color: ${(props) =>
    props.$data.setting?.btnBackgroundColor || "#000"};
  color: ${(props) => props.$data.setting?.btnColor || "#fff"};
  border-radius: ${(props) => props.$data.setting?.btnRadius || "5"}px;
  max-width: 100%;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.5s ease-in-out;

  /* Default hover effect */
  &:hover {
    opacity: 0.7;
  }

  @media (max-width: 480px) {
    padding: 8px 20px;
    font-size: 14px;
  }

  /* Apply button animations */
  ${(props) => {
    const btnAnimation = props.$data.setting?.btnAnimation;
    if (!btnAnimation) return "";

    const { type, animation: animConfig } = btnAnimation;
    const selector = type === "hover" ? "&:hover" : "&:active";

    // Generate animation CSS based on type
    if (animConfig.type === "pulse") {
      return `
        ${selector} {
          animation: multiColumnBtnPulse ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          opacity: 1; /* Override default opacity */
        }
        
        @keyframes multiColumnBtnPulse {
          0%, 100% { 
            opacity: 1;
            filter: brightness(1);
          }
          50% { 
            opacity: 0.7;
            filter: brightness(1.3);
          }
        }
      `;
    } else if (animConfig.type === "glow") {
      return `
        ${selector} {
          animation: multiColumnBtnGlow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          opacity: 1; /* Override default opacity */
        }
        
        @keyframes multiColumnBtnGlow {
          0%, 100% { 
            filter: brightness(1) drop-shadow(0 0 0px rgba(255, 255, 255, 0));
          }
          50% { 
            filter: brightness(1.2) drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
          }
        }
      `;
    } else if (animConfig.type === "brightness") {
      return `
        ${selector} {
          animation: multiColumnBtnBrightness ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          opacity: 1; /* Override default opacity */
        }
        
        @keyframes multiColumnBtnBrightness {
          0%, 100% { 
            filter: brightness(1);
          }
          50% { 
            filter: brightness(1.4);
          }
        }
      `;
    } else if (animConfig.type === "blur") {
      return `
        ${selector} {
          animation: multiColumnBtnBlur ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          opacity: 1; /* Override default opacity */
        }
        
        @keyframes multiColumnBtnBlur {
          0%, 100% { 
            filter: blur(0px);
          }
          50% { 
            filter: blur(2px);
          }
        }
      `;
    } else if (animConfig.type === "saturate") {
      return `
        ${selector} {
          animation: multiColumnBtnSaturate ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          opacity: 1; /* Override default opacity */
        }
        
        @keyframes multiColumnBtnSaturate {
          0%, 100% { 
            filter: saturate(1);
          }
          50% { 
            filter: saturate(1.8);
          }
        }
      `;
    } else if (animConfig.type === "contrast") {
      return `
        ${selector} {
          animation: multiColumnBtnContrast ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          opacity: 1; /* Override default opacity */
        }
        
        @keyframes multiColumnBtnContrast {
          0%, 100% { 
            filter: contrast(1);
          }
          50% { 
            filter: contrast(1.5);
          }
        }
      `;
    } else if (animConfig.type === "opacity") {
      return `
        ${selector} {
          animation: multiColumnBtnOpacity ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes multiColumnBtnOpacity {
          0% { 
            opacity: 1;
          }
          50% { 
            opacity: 0.4;
          }
          100% { 
            opacity: 1;
          }
        }
      `;
    } else if (animConfig.type === "shadow") {
      return `
        ${selector} {
          animation: multiColumnBtnShadow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          opacity: 1; /* Override default opacity */
        }
        
        @keyframes multiColumnBtnShadow {
          0%, 100% { 
            filter: drop-shadow(0 0 0px rgba(0, 0, 0, 0));
          }
          50% { 
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
          }
        }
      `;
    }

    return "";
  }}
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
        dir="rtl"
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
                dir="rtl"
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
                dir="rtl"
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
