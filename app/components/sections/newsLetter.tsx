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

const Section = styled.section<{ $data: NewsLetterSection; $previewWidth: "sm" | "default" }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: ${(props) => props.$data.setting.paddingTop || "20"}px;
  padding-bottom: ${(props) => props.$data.setting.paddingBottom || "20"}px;
  padding-left: ${(props) => props.$data.setting.paddingLeft || "20"}px;
  padding-right: ${(props) => props.$data.setting.paddingRight || "20"}px;
  margin-top: ${(props) => props.$data.setting.marginTop || "20"}px;
  margin-bottom: ${(props) => props.$data.setting.marginBottom || "20"}px;
  background-color: ${(props) => props.$data.blocks.setting.formBackground || "#f9f9f9"};
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  // width: ${(props) => (props.$previewWidth === "sm" ? "425px" : "100%")};
  transition: all 0.3s ease;
  margin-left: 10px;
  margin-right: 10px;
`;

const Heading = styled.h2<{ $data: NewsLetterSection; $previewWidth: "sm" | "default" }>`
  color: ${(props) => props.$data.blocks.setting.headingColor};
  font-size: ${(props) => props.$previewWidth === "sm" 
    ? `${parseInt(props.$data.blocks.setting.headingFontSize) * 0.8}px`
    : `${props.$data.blocks.setting.headingFontSize}px`};
  font-weight: ${(props) => props.$data?.blocks?.setting?.headingFontWeight || "bold"};
  text-align: center;
  padding: ${(props) => props.$previewWidth === "sm" ? "10px" : "20px"};
`;

const Description = styled.p<{ $data: NewsLetterSection; $previewWidth: "sm" | "default" }>`
  color: ${(props) => props.$data.blocks.setting.descriptionColor};
  font-size: ${(props) => props.$previewWidth === "sm"
    ? `${parseInt(props.$data.blocks.setting.descriptionFontSize) * 0.8}px`
    : `${props.$data.blocks.setting.descriptionFontSize}px`};
  font-weight: ${(props) => props.$data.blocks.setting.descriptionFontWeight};
  text-align: center;
  margin-bottom: ${(props) => props.$previewWidth === "sm" ? "15px" : "20px"};
  padding: 0 ${(props) => props.$previewWidth === "sm" ? "15px" : "20px"};
`;

const Form = styled.form<{ $previewWidth: "sm" | "default" }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${(props) => props.$previewWidth === "sm" ? "90%" : "100%"};
  padding: 0 ${(props) => props.$previewWidth === "sm" ? "15px" : "20px"};
`;

const Input = styled.input<{ $previewWidth: "sm" | "default" }>`
  padding: ${(props) => props.$previewWidth === "sm" ? "6px" : "8px"};
  margin-bottom: ${(props) => props.$previewWidth === "sm" ? "10px" : "15px"};
  border: 1px solid #ccc;
  border-radius: 15px;
  font-size: ${(props) => props.$previewWidth === "sm" ? "14px" : "16px"};
  width: 100%;
  max-width: ${(props) => props.$previewWidth === "sm" ? "300px" : "400px"};
`;

const Button = styled.button<{ $data: NewsLetterSection; $previewWidth: "sm" | "default" }>`
  padding: ${(props) => props.$previewWidth === "sm" ? "8px 20px" : "10px 30px"};
  background-color: ${(props) => props.$data.blocks.setting.btnBackgroundColor};
  color: ${(props) => props.$data.blocks.setting.btnTextColor};
  border: none;
  margin-top: 4px;
  border-radius: 5px;
  font-size: ${(props) => props.$previewWidth === "sm" ? "14px" : "16px"};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.4s ease-in-out;

  &:hover {
    opacity: 0.7;
  }

  /* Apply button animations */
  ${(props) => {
    const btnAnimation = props.$data.blocks?.setting?.btnAnimation;
    if (!btnAnimation) return '';
    
    const { type, animation: animConfig } = btnAnimation;
    const selector = type === 'hover' ? '&:hover' : '&:active';
    
    // Generate animation CSS based on type
    if (animConfig.type === 'pulse') {
      return `
        ${selector} {
          animation: newsletterBtnPulse ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
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
    } else if (animConfig.type === 'glow') {
      return `
        ${selector} {
          animation: newsletterBtnGlow ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
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
    } else if (animConfig.type === 'brightness') {
      return `
        ${selector} {
          animation: newsletterBtnBrightness ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
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
    } else if (animConfig.type === 'blur') {
      return `
        ${selector} {
          animation: newsletterBtnBlur ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
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
    } else if (animConfig.type === 'saturate') {
      return `
        ${selector} {
          animation: newsletterBtnSaturate ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
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
    } else if (animConfig.type === 'contrast') {
      return `
        ${selector} {
          animation: newsletterBtnContrast ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
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
    } else if (animConfig.type === 'opacity') {
      return `
        ${selector} {
          animation: newsletterBtnOpacity ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
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
    } else if (animConfig.type === 'shadow') {
      return `
        ${selector} {
          animation: newsletterBtnShadow ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
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
    
    return '';
  }}
`;

const NewsLetter: React.FC<NewsLetterProps> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
  setLayout,
  previewWidth
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const sectionData = layout.sections?.children?.sections?.find(
    (section) => section.type === actualName
  ) as NewsLetterSection;

  
  if (!sectionData) return null;

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Handle click animation trigger
    const btnAnimation = sectionData.blocks?.setting?.btnAnimation;
    if (btnAnimation && btnAnimation.type === 'click') {
      const button = e.currentTarget;
      button.classList.add('clicked');
      
      // Remove the class after animation completes
      const duration = parseFloat(btnAnimation.animation.duration.replace('s', '')) * 1000;
      const delay = parseFloat((btnAnimation.animation.delay || '0s').replace('s', '')) * 1000;
      
      setTimeout(() => {
        button.classList.remove('clicked');
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
      
      <Heading $data={sectionData} $previewWidth={previewWidth}>
        {sectionData.blocks.heading || "خبرنامه ما"}
      </Heading>
      
      <Description $data={sectionData} $previewWidth={previewWidth}>
        {sectionData.blocks.description || "برای دریافت آخرین اخبار ایمیل خود را وارد کنید"}
      </Description>
      
      <Form $previewWidth={previewWidth} onSubmit={(e) => e.preventDefault()}>
        <Input $previewWidth={previewWidth} type="email" placeholder="ایمیل خود را وارد کنید" required />
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
