"use client";
import React, { useState } from "react";
import styled from "styled-components";
import { ContactFormDataSection, Layout } from "../../../lib/types";
import { Delete } from "../C-D";

interface ContactFormProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
  previewWidth: "sm" | "default";
}

const Section = styled.section<{
  $data: ContactFormDataSection;
  $previewWidth: "sm" | "default";
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: ${(props) => props.$data?.setting?.paddingTop || "20"}px;
  padding-bottom: ${(props) => props.$data?.setting?.paddingBottom || "20"}px;
  padding-left: ${(props) => props.$data?.setting?.paddingLeft || "20"}px;
  padding-right: ${(props) => props.$data?.setting?.paddingRight || "20"}px;
  margin-top: ${(props) => props.$data?.setting?.marginTop || "20"}px;
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom || "20"}px;
  background-color: ${(props) =>
    props.$data.blocks?.setting?.formBackground || "#f9f9f9"};
  border-radius: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width: ${(props) => (props.$previewWidth === "sm" ? "100%" : "auto")};
  max-width: ${(props) => (props.$previewWidth === "sm" ? "425px" : "100%")};
`;

const Heading = styled.h2<{ $data: ContactFormDataSection }>`
  color: ${(props) => props.$data.blocks?.setting?.headingColor || "#333"};
  font-size: ${(props) =>
    props.$data.blocks?.setting?.headingFontSize || "24px"}px;
  font-weight: ${(props) =>
    props.$data.blocks?.setting?.headingFontWeight || "bold"};
  margin-bottom: 20px;
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const Form = styled.form<{ $previewWidth: "sm" | "default" }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${(props) => (props.$previewWidth === "sm" ? "90%" : "100%")};
  max-width: ${(props) => (props.$previewWidth === "sm" ? "340px" : "800px")};
  padding: 0 ${(props) => (props.$previewWidth === "sm" ? "10px" : "20px")};
`;

const Input = styled.input<{ $previewWidth: "sm" | "default" }>`
  padding: ${(props) => (props.$previewWidth === "sm" ? "10px" : "14px")};
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: ${(props) => (props.$previewWidth === "sm" ? "14px" : "16px")};
  width: 70%;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const TextArea = styled.textarea<{ $previewWidth: "sm" | "default" }>`
  padding: ${(props) => (props.$previewWidth === "sm" ? "10px" : "14px")};
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: ${(props) => (props.$previewWidth === "sm" ? "14px" : "16px")};
  width: 70%;
  resize: vertical;
  min-height: ${(props) => (props.$previewWidth === "sm" ? "80px" : "100px")};

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.3);
  }

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const Button = styled.button<{
  $data: ContactFormDataSection;
  $previewWidth: "sm" | "default";
}>`
  padding: ${(props) =>
    props.$previewWidth === "sm" ? "12px 30px" : "15px 50px"};
  background-color: ${(props) =>
    props.$data.blocks.setting?.btnBackgroundColor || "#007bff"};
  color: ${(props) => props.$data.blocks.setting?.btnTextColor || "#fff"};
  border: none;
  border-radius: 5px;
  font-size: ${(props) => (props.$previewWidth === "sm" ? "14px" : "16px")};
  cursor: pointer;
  transition: all 0.4s ease-in-out;
  width: ${(props) => (props.$previewWidth === "sm" ? "50%" : "70%")};
  text-align: center;

  &:hover {
    background-color: ${(props) =>
      props.$data.blocks.setting?.btnBackgroundColor ? "#0056b3" : "#9c119c"};
    transform: scale(0.97);
  }
`;

// ContactForm Component
const ContactForm: React.FC<ContactFormProps> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
  setLayout,
  previewWidth,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const sectionData = layout.sections?.children?.sections?.find(
    (section) => section.type === "ContactForm"
  ) as ContactFormDataSection;
  if (!sectionData) {
    return null;
  }

  return (
    <Section
      dir="rtl"
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
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center ">
          <div className="bg-white p-8 rounded-lg">
            <h3 className="text-lg font-bold mb-4">
              آیا از حذف
              <span className="text-blue-400 font-bold mx-1">
                {actualName}
              </span>{" "}
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
        <div className="absolute w-fit -top-5 -left-1 z-10 flex flex-row-reverse ">
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
        {sectionData?.blocks?.heading || "Contact Us"}
      </Heading>
      <Form $previewWidth={previewWidth}>
        <Input
          $previewWidth={previewWidth}
          type="text"
          placeholder="نام"
          required
        />
        <Input
          $previewWidth={previewWidth}
          type="email"
          placeholder="ایمیل"
          required
        />
        <TextArea
          $previewWidth={previewWidth}
          placeholder="متن پیام شما ..."
          required
        />
        <Button $data={sectionData} $previewWidth={previewWidth} type="submit">
          ارسال
        </Button>
      </Form>
    </Section>
  );
};

export default ContactForm;
