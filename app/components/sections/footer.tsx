"use client";
import React from "react";
import styled from "styled-components";
import Link from "next/link";

interface BlocksType {
  setting: {
    textColor?: string;
    textFontSize?: string;
    textFontWeight?: string;
    backgroundColor?: string;
    linkColor?: string;
    linkHoverColor?: string;
  };
  text?: string;
  links?: { url: string; label: string }[];
}

interface SettingType {
  paddingTop?: string;
  paddingBottom?: string;
  marginTop?: string;
  marginBottom?: string;
  backgroundColor?: string;
}

interface SectionData {
  blocks: BlocksType;
  setting: SettingType;
}

interface FooterProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: {
    sections?: {
      sectionFooter?: SectionData;
    };
  };
}

const FooterContainer = styled.footer<{ $data: SectionData }>`
  padding-top: ${(props) => props.$data.setting.paddingTop || "20px"};
  padding-bottom: ${(props) => props.$data.setting.paddingBottom || "20px"};
  margin-top: ${(props) => props.$data.setting.marginTop || "0px"};
  margin-bottom: ${(props) => props.$data.setting.marginBottom || "0px"};
  background-color: ${(props) => props.$data.setting.backgroundColor || "#333"};
  color: ${(props) => props.$data.blocks.setting.textColor || "#fff"};
  text-align: center;
`;

const FooterText = styled.p<{ $data: SectionData }>`
  font-size: ${(props) => props.$data.blocks.setting.textFontSize || "16px"}px;
  font-weight: ${(props) =>
    props.$data.blocks.setting.textFontWeight || "normal"};
  margin-bottom: 10px;
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 10px;
`;

const FooterLink = styled(Link)<{ $data: SectionData }>`
  color: ${(props) => props.$data.blocks.setting.linkColor || "#fff"};
  font-weight: bold;
  text-decoration: none;
  &:hover {
    color: ${(props) => props.$data.blocks.setting.linkHoverColor || "#f0f0f0"};
  }
`;

const Footer: React.FC<FooterProps> = ({ setSelectedComponent, layout }) => {
  const sectionData = layout.sections?.sectionFooter || {
    blocks: { setting: {}, links: [] },
    setting: {},
  };

  const { text, links } = sectionData.blocks;

  return (
    <FooterContainer
      $data={sectionData}
      onClick={() => setSelectedComponent("footer")}
    >
      {text && <FooterText $data={sectionData}>{text}</FooterText>}
      {links && links.length > 0 && (
        <FooterLinks>
          {links.map((link, index) => (
            <FooterLink
              key={index}
              href={link.url}
              $data={sectionData}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </FooterLink>
          ))}
        </FooterLinks>
      )}
    </FooterContainer>
  );
};

export default Footer;
