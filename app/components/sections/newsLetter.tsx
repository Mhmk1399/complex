"use client";
import React from "react";
import styled from "styled-components";
import { Layout, NewsLetterSection } from "@/lib/types"; // Import the types

interface NewsLetterProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
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
  border-radius: 5px;
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
}) => {
  const sectionData = layout.sections?.children?.sections?.find(
    (section) => section.type === "newsletter"
  ) as NewsLetterSection;

  if (!sectionData) {
    return null; // Return null if no section data is found
  }

  return (
    <Section
    dir="rtl"
      $data={sectionData}
      onClick={() => setSelectedComponent("newsletter")}
    >
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
