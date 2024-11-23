"use client";
import React from "react";
import styled from "styled-components";
import { ContactFormDataSection, Layout } from "../../../lib/types";

interface ContactFormProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
}

// Styled Components
const Section = styled.section<{ $data: ContactFormDataSection }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: ${(props) => props.$data?.setting?.paddingTop || "20px"};
  padding-bottom: ${(props) => props.$data?.setting?.paddingBottom || "20px"};
  margin-top: ${(props) => props.$data?.setting?.marginTop || "20px"};
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom || "20px"};
  margin-left: 20px;
  margin-right: 20px;
  background-color: ${(props) =>
    props.$data.blocks?.setting?.formBackground || "#f9f9f9"};
  border-radius: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0 20px;
`;

const Input = styled.input`
  padding: 14px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 16px;
  width: 70%;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const TextArea = styled.textarea`
  padding: 14px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 16px;
  width: 70%;
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.3);
  }

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const Button = styled.button<{ $data: ContactFormDataSection }>`
  padding: 15px 50px;
  background-color: ${(props) =>
    props.$data.blocks.setting?.btnBackgroundColor || "#007bff"};
  color: ${(props) => props.$data.blocks.setting?.btnTextColor || "#fff"};
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.4s ease-in-out;

  &:hover {
    background-color: ${(props) =>
      props.$data.blocks.setting?.btnBackgroundColor ? "#0056b3" : "#9c119c"};
    transform: scale(0.97);
  }

  @media (max-width: 768px) {
    width: 90%;
  }
`;

// ContactForm Component
const ContactForm: React.FC<ContactFormProps> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
}) => {
  const sectionData = layout.sections?.children?.sections?.find(
    (section) => section.type === "ContactForm"
  ) as ContactFormDataSection;
  if (!sectionData) {
    console.error("ContactForm section data is missing or invalid.");
    return null;
  }

  return (
    <Section
      dir="rtl"
      $data={sectionData}
      onClick={() => setSelectedComponent(actualName)}
      className={`transition-all duration-150 ease-in-out relative ${
        selectedComponent === actualName
          ? "border-4 border-blue-500 rounded-lg shadow-lg "
          : ""
      }`}
    >
      {actualName === selectedComponent ? (
        <div className="absolute w-fit -top-5 -left-1 bg-blue-500 py-1 px-4 rounded-lg text-white z-10">
          {actualName}
        </div>
      ) : null}
    
      <Heading $data={sectionData}>
        {sectionData?.blocks?.heading || "Contact Us"}
      </Heading>
      <Form>
        <Input type="text" placeholder="نام" required />
        <Input type="email" placeholder="ایمیل" required />
        <TextArea placeholder="متن پیام شما ..." required />
        <Button $data={sectionData} type="submit">
          ارسال
        </Button>
      </Form>
    </Section>
  );
};

export default ContactForm;
