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
  margin-top: ${(props) => props.$data.setting.marginTop || "20"}px;
  margin-bottom: ${(props) => props.$data.setting.marginBottom || "20"}px;
  background-color: ${(props) => props.$data.blocks.setting.formBackground || "#f9f9f9"};
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width: ${(props) => (props.$previewWidth === "sm" ? "425px" : "100%")};
  transition: all 0.3s ease;
`;

const Heading = styled.h2<{ $data: NewsLetterSection; $previewWidth: "sm" | "default" }>`
  color: ${(props) => props.$data.blocks.setting.headingColor};
  font-size: ${(props) => props.$previewWidth === "sm" 
    ? `${parseInt(props.$data.blocks.setting.headingFontSize) * 0.8}px`
    : `${props.$data.blocks.setting.headingFontSize}px`};
  font-weight: ${(props) => props.$data.blocks.setting.headingFontWeight};
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
      {/* Delete Modal and Component Header remain the same */}
      
      <Heading $data={sectionData} $previewWidth={previewWidth}>
        {sectionData.blocks.heading || "خبرنامه ما"}
      </Heading>
      
      <Description $data={sectionData} $previewWidth={previewWidth}>
        {sectionData.blocks.description || "برای دریافت آخرین اخبار ایمیل خود را وارد کنید"}
      </Description>
      
      <Form $previewWidth={previewWidth}>
        <Input $previewWidth={previewWidth} type="email" placeholder="ایمیل خود را وارد کنید" required />
        <Button $data={sectionData} $previewWidth={previewWidth} type="submit">
          {sectionData.blocks.btnText || "عضویت"}
        </Button>
      </Form>
    </Section>
  );
};

export default NewsLetter;
