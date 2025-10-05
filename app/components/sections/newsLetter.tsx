"use client";
import styled from "styled-components";
import { Layout, NewsLetterSection } from "@/lib/types";
import { Delete } from "../C-D";
import { useState } from "react";

interface NewsLetterProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
  previewWidth: "sm" | "default";
}

const Section = styled.section<{
  $data: NewsLetterSection;
  $previewWidth: "sm" | "default";
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
    props.$data.blocks.setting.formBackground || "#f9f9f9"};
  border-radius: ${(props) => props.$data.blocks.setting.formRadius || "5"}px;
  transition: all 0.3s ease;
  box-shadow: ${(props) =>
    `${props.$data.blocks.setting?.shadowOffsetX || 0}px 
     ${props.$data.blocks.setting?.shadowOffsetY || 4}px 
     ${props.$data.blocks.setting?.shadowBlur || 10}px 
     ${props.$data.blocks.setting?.shadowSpread || 0}px 
     ${props.$data.blocks.setting?.shadowColor || "#fff"}`};
`;

const Heading = styled.h2<{
  $data: NewsLetterSection;
  $previewWidth: "sm" | "default";
}>`
  color: ${(props) => props.$data.blocks.setting.headingColor};
  font-size: ${(props) => props.$data.blocks.setting.headingFontSize}px;
  font-weight: ${(props) =>
    props.$data?.blocks?.setting?.headingFontWeight || "bold"};
  text-align: center;
`;

const Description = styled.p<{
  $data: NewsLetterSection;
  $previewWidth: "sm" | "default";
}>`
  color: ${(props) => props.$data.blocks.setting.descriptionColor};
  font-size: ${(props) => props.$data.blocks.setting.descriptionFontSize}px;
  font-weight: ${(props) => props.$data.blocks.setting.descriptionFontWeight};
  text-align: center;
  padding: 5px 10px;
`;

const Form = styled.form<{ $previewWidth: "sm" | "default" }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
  width: 100%;
  padding: 10px;
`;

const Input = styled.input<{
  $previewWidth: "sm" | "default";
  $data: NewsLetterSection;
}>`
  padding: 10px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
  background-color: ${(props) =>
    props.$data.blocks.setting.inputBackgroundColor};
  color: ${(props) => props.$data.blocks.setting.inputTextColor};
  border-radius: ${(props) => props.$data.blocks.setting.inputRadius || "5"}px;
  font-size: ${(props) => (props.$previewWidth === "sm" ? "14px" : "16px")};
  max-width: 100%;
  width: ${(props) => props.$data.blocks.setting.inputWidth || "300"}px;
`;

const Button = styled.button<{
  $data: NewsLetterSection;
  $previewWidth: "sm" | "default";
}>`
  padding: 10px 30px;
  background-color: ${(props) => props.$data.blocks.setting.btnBackgroundColor};
  color: ${(props) => props.$data.blocks.setting.btnTextColor};
  border: none;
  margin-top: 4px;
  border-radius: ${(props) => props.$data.blocks.setting.btnRadius || "5"}px;
  font-weight: 500;
  cursor: pointer;
  max-width: 100%;
  width: ${(props) => props.$data.blocks.setting.btnWidth || "5"}px;
  transition: all 0.4s ease-in-out;

  &:hover {
    opacity: 0.7;
  }

  /* Apply button animations */
  ${(props) => {
    const btnAnimation = props.$data.blocks?.setting?.btnAnimation;
    if (!btnAnimation) return "";

    const { type, animation: animConfig } = btnAnimation;
    const selector = type === "hover" ? "&:hover" : "&:active";

    // Generate animation CSS based on type
    if (animConfig.type === "pulse") {
      return `
        ${selector} {
          animation: newsletterBtnPulse ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes newsletterBtnPulse {
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
          animation: newsletterBtnGlow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes newsletterBtnGlow {
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
          animation: newsletterBtnBrightness ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes newsletterBtnBrightness {
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
          animation: newsletterBtnBlur ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes newsletterBtnBlur {
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
          animation: newsletterBtnSaturate ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes newsletterBtnSaturate {
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
          animation: newsletterBtnContrast ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes newsletterBtnContrast {
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
          animation: newsletterBtnOpacity ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes newsletterBtnOpacity {
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
          animation: newsletterBtnShadow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes newsletterBtnShadow {
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

const NewsLetter: React.FC<NewsLetterProps> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
  setLayout,
  previewWidth,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const sectionData = layout.sections?.children?.sections?.find(
    (section) => section.type === actualName
  ) as NewsLetterSection;

  if (!sectionData) return null;

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Handle click animation trigger
    const btnAnimation = sectionData.blocks?.setting?.btnAnimation;
    if (btnAnimation && btnAnimation.type === "click") {
      const button = e.currentTarget;
      button.classList.add("clicked");

      // Remove the class after animation completes
      const duration =
        parseFloat(btnAnimation.animation.duration.replace("s", "")) * 1000;
      const delay =
        parseFloat((btnAnimation.animation.delay || "0s").replace("s", "")) *
        1000;

      setTimeout(() => {
        button.classList.remove("clicked");
      }, duration + delay);
    }

    // Prevent form submission for demo purposes
    e.preventDefault();
  };

  return (
    <Section
      dir="rtl"
      $data={sectionData}
      $previewWidth={previewWidth}
      onClick={() => setSelectedComponent(actualName)}
      className={`transition-all duration-150 ease-in-out relative ${
        selectedComponent === actualName
          ? "border-4 border-blue-500 rounded-lg shadow-lg"
          : ""
      }`}
    >
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h3 className="text-lg font-bold mb-4">
              آیا از حذف
              <span className="text-blue-400 font-bold mx-1">{actualName}</span>
              مطمئن هستید؟
            </h3>
            <div className="flex gap-4 justify-end flex-row-reverse">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setShowDeleteModal(false)}
              >
                انصراف
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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

      {actualName === selectedComponent && (
        <div className="absolute w-fit -top-5 -left-1 z-10 flex flex-row-reverse">
          <div className="bg-blue-500 py-1 px-4 rounded-l-lg text-white">
            {actualName}
          </div>
          <button
            className="font-extrabold text-xl hover:bg-blue-500 bg-red-500 pb-1 rounded-r-lg px-3 text-white transform transition-all duration-300"
            onClick={() => setShowDeleteModal(true)}
          >
            x
          </button>
        </div>
      )}

      <Heading dir="rtl" $data={sectionData} $previewWidth={previewWidth}>
        {sectionData.blocks.heading || "خبرنامه ما"}
      </Heading>

      <Description dir="rtl" $data={sectionData} $previewWidth={previewWidth}>
        {sectionData.blocks.description ||
          "برای دریافت آخرین اخبار شماره خود را وارد کنید"}
      </Description>

      <Form $previewWidth={previewWidth} onSubmit={(e) => e.preventDefault()}>
        <Input
          $data={sectionData}
          $previewWidth={previewWidth}
          type="tel"
          placeholder="09120000000"
          required
          dir="rtl"
          className="text-center"
        />
        <Button
          $data={sectionData}
          $previewWidth={previewWidth}
          type="submit"
          onClick={handleButtonClick}
        >
          {sectionData.blocks.btnText || "عضویت"}
        </Button>
      </Form>
    </Section>
  );
};

export default NewsLetter;
