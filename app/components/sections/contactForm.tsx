"use client";
import React from "react";
import styled from "styled-components";

interface ContactFormProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: {
    sections?: {
      children?: { sections: SectionData[] };
    };
  };
}

interface BlocksType {
  setting: {
    headingColor?: string;
    headingFontSize?: string;
    headingFontWeight?: string;
    btnTextColor?: string;
    btnBackgroundColor?: string;
    formBackground?: string;
  };
  heading?: string;
}

interface SettingType {
  paddingTop?: string;
  paddingBottom?: string;
  marginTop?: string;
  marginBottom?: string;
}

interface SectionData {
  blocks: BlocksType;
  setting: SettingType;
}

// Styled Components
const Section = styled.section<{ $data: SectionData }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: ${(props) => props.$data.setting?.paddingTop || "20px"};
  padding-bottom: ${(props) => props.$data.setting?.paddingBottom || "20px"};
  margin-top: ${(props) => props.$data.setting?.marginTop || "20px"};
  margin-bottom: ${(props) => props.$data.setting?.marginBottom || "20px"};
  margin-left: 20px;
  margin-right: 20px;
  background-color: ${(props) =>
    props.$data.blocks.setting?.formBackground || "#f9f9f9"};
  border-radius: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const Heading = styled.h2<{ $data: SectionData }>`
  color: ${(props) => props.$data.blocks.setting?.headingColor || "#333"};
  font-size: ${(props) =>
    props.$data.blocks.setting?.headingFontSize || "24px"}px;
  font-weight: ${(props) =>
    props.$data.blocks.setting?.headingFontWeight || "bold"};
  margin-bottom: 20px;
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

const Button = styled.button<{ $data: SectionData }>`
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
}) => {
  const sectionData = layout.sections?.children?.sections.find(
    (section) => (section as { type?: string }).type === "contact-form"
  ) as SectionData;

  return (
    <Section
      dir="ltr"
      $data={sectionData}
      onClick={() => setSelectedComponent("contact-form")}
    >
      <Heading $data={sectionData}>
        {sectionData.blocks.heading || "Contact Us"}
      </Heading>
      <Form>
        <Input type="text" placeholder="Name" required />
        <Input type="email" placeholder="Email" required />
        <TextArea placeholder="Your message" required />
        <Button $data={sectionData} type="submit">
          Send Message
        </Button>
      </Form>
    </Section>
  );
};

export default ContactForm;
