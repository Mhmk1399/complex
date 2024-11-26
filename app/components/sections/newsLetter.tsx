"use client";
import styled from "styled-components";
import { Layout, NewsLetterSection } from "@/lib/types"; // Import the types
import { Delete } from "../C-D";
import { useState } from "react";

interface NewsLetterProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
}

// Styled Components
const Section = styled.section<{ $data: NewsLetterSection }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: ${(props) => props.$data.setting.paddingTop || "20px"}px;
  padding-bottom: ${(props) => props.$data.setting.paddingBottom || "20px"}px;
  margin-top: ${(props) => props.$data.setting.marginTop || "20px"}px;
  margin-bottom: ${(props) => props.$data.setting.marginBottom || "20px"}px;
  background-color: ${(props) =>
    props.$data.blocks.setting.formBackground || "#f9f9f9"};
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const Heading = styled.h2<{ $data: NewsLetterSection }>`
  color: ${(props) => props.$data.blocks.setting.headingColor || "#333333"};
  font-size: ${(props) =>
    props.$data.blocks.setting.headingFontSize || "24px"}px;
  font-weight: ${(props) =>
    props.$data.blocks.setting.headingFontWeight || "bold"};
  text-align: center;
  padding: 20px;
`;

const Description = styled.p<{ $data: NewsLetterSection }>`
  color: ${(props) => props.$data.blocks.setting.descriptionColor || "#666666"};
  font-size: ${(props) =>
    props.$data.blocks.setting.descriptionFontSize || "16px"}px;
  font-weight: ${(props) =>
    props.$data.blocks.setting.descriptionFontWeight || "normal"};
  text-align: center;
  margin-bottom: 20px;
  padding: 0 10px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0 20px;

  @media (max-width: 768px) {
    width: 90%;
    margin: 10px 0;
  }
`;

const Input = styled.input`
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 15px;
  font-size: 16px;
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

const Button = styled.button<{ $data: NewsLetterSection }>`
  padding: 10px 30px;
  background-color: ${(props) =>
    props.$data.blocks.setting.btnBackgroundColor || "#007bff"};
  color: ${(props) => props.$data.blocks.setting.btnTextColor || "#ffffff"};
  border: none;
  margin-top: 4px;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.4s ease-in-out;

  &:hover {
    opacity: 0.7;
  }
`;

// NewsLetter Component
const NewsLetter: React.FC<NewsLetterProps> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
  setLayout,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const sectionData = layout.sections?.children?.sections?.find(
    (section) => section.type === actualName
  ) as NewsLetterSection;
  // console.log(sectionData);

  if (!sectionData) {
    return null; // Return null if no section data is found
  }

  return (
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
        <div className="absolute w-fit -top-5 -left-1 z-10 flex ">
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
      <Heading $data={sectionData}>
        {sectionData.blocks.heading || "Subscribe to Our Newsletter"}
      </Heading>
      <Description $data={sectionData}>
        {sectionData.blocks.description ||
          "Get the latest updates and offers delivered directly to your inbox."}
      </Description>
      <Form>
        <Input type="email" placeholder="ایمیل خود را وارد کنید" required />
        <Button $data={sectionData} type="submit">
          {sectionData.blocks.btnText || "Subscribe"}
        </Button>
      </Form>
    </Section>
  );
};

export default NewsLetter;
