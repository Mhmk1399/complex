"use client";
import React from "react";
import styled from "styled-components";

interface NewsLetterProps {
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
    descriptionColor?: string;
    descriptionFontSize?: string;
    descriptionFontWeight?: string;
    btnBackgroundColor?: string;
    btnTextColor?: string;
    formBackground?: string;
  };
  heading?: string;
  description?: string;
  btnText?: string;
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
  padding-top: ${(props) => props.$data.setting?.paddingTop || "20px"}px;
  padding-bottom: ${(props) => props.$data.setting?.paddingBottom || "20px"}px;
  margin-top: ${(props) => props.$data.setting?.marginTop || "20px"}px;
  margin-bottom: ${(props) => props.$data.setting?.marginBottom || "20px"}px;
  background-color: ${(props) =>
    props.$data.blocks.setting?.formBackground || "#f9f9f9"};
  border-radius: 10px;
  margin-left: 0 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const Heading = styled.h2<{ $data: SectionData }>`
  color: ${(props) => props.$data.blocks.setting?.headingColor || "#333333"};
  font-size: ${(props) =>
    props.$data.blocks.setting?.headingFontSize || "24px"}px;
  font-weight: ${(props) =>
    props.$data?.blocks?.setting?.headingFontWeight};
  margin-bottom: 10px;
  padding: 20px 20px;
  text-align: center;
`;

const Description = styled.p<{ $data: SectionData }>`
  color: ${(props) =>
    props.$data.blocks.setting?.descriptionColor || "#666666"};
  font-size: ${(props) =>
    props.$data.blocks.setting?.descriptionFontSize || "16px"}px;
  font-weight: ${(props) =>
    props.$data.blocks.setting?.descriptionFontWeight || "normal"};
  text-align: center;
  margin-bottom: 20px;
  padding: 0px 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0 20px;
  @media (max-width: 768px) {
    width: 90%;
    margin: 10px 0;
  }
`;

const Input = styled.input`
  padding: 12px;
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

const Button = styled.button<{ $data: SectionData }>`
  padding: 10px 30px;
  background-color: ${(props) =>
    props.$data.blocks.setting?.btnBackgroundColor || "#007bff"};
  color: ${(props) => props.$data.blocks.setting?.btnTextColor || "#ffffff"};
  border: none;
  margin-top: 4px;
  border-radius: 5px;
  font-size: 16px;
  font-weight: semibold;
  cursor: pointer;
  transition: all 0.4s ease-in-out;

  &:hover {
    opacity: 0.7;
    color: #000000;
  }
`;

// NewsLetter Component
const NewsLetter: React.FC<NewsLetterProps> = ({
  setSelectedComponent,
  layout,
}) => {
  const sectionData = layout.sections?.children?.sections.find(
    (section) => (section as { type?: string }).type === "newsletter"
  ) as SectionData;
  return (
    <Section
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
        <Input type="email" placeholder="Enter your email" required />
        <Button $data={sectionData} type="submit">
          {sectionData.blocks.btnText || "Subscribe"}
        </Button>
      </Form>
    </Section>
  );
};

export default NewsLetter;
