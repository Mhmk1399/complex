"use client";
import React from "react";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";

interface BlocksType {
  setting: {
    textColor?: string;
    textFontSize?: string;
    textFontWeight?: string;
    descriptionColor?: string;
    descriptionFontSize?: string;
    descriptionFontWeight?: string;
    logoWidth?: string;
    logoHeight?: string;
    logoRadius?: string;
    linkColor?: string;
  };
  text?: string;
  description?: string;
  instagramLink?: string;
  telegramLink?: string;
  whatsappLink?: string;
  logo?: string;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
`;

const FooterText = styled.p<{ $data: SectionData }>`
  font-size: ${(props) => props.$data.blocks.setting.textFontSize || "16px"}px;
  font-weight: ${(props) =>
    props.$data.blocks.setting.textFontWeight || "normal"};
  color: ${(props) => props.$data.blocks.setting.textColor || "16px"};
  padding: 10px 5px;
`;

const FooterDescription = styled.p<{ $data: SectionData }>`
  font-size: ${(props) =>
    props.$data.blocks.setting.descriptionFontSize || "16px"}px;
  font-weight: ${(props) =>
    props.$data.blocks.setting.descriptionFontWeight || "normal"};
  color: ${(props) => props.$data.blocks.setting.descriptionColor || "16px"};
  padding: 0px 50px;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 10px;
  margin-bottom: 10px;
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
`;
const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  color: #ffffff;
  gap: 15px;
  margin-top: 10px;
`;

const FooterLink = styled(Link)<{ $data: SectionData }>`
  font-weight: bold;
  text-decoration: none;
  color: ${(props) => props.$data.blocks.setting.linkColor};

  &:hover {
    opacity: 0.7;
  }
`;

const Logo = styled(Image)<{ $data: SectionData }>`
  width: ${(props) => props.$data.blocks.setting.logoWidth || "100px"};
  height: ${(props) => props.$data.blocks.setting.logoHeight || "100px"};
  border-radius: ${(props) => props.$data.blocks.setting.logoRadius || "5px"};
`;

const Footer: React.FC<FooterProps> = ({ setSelectedComponent, layout }) => {
  const sectionData = layout.sections?.sectionFooter || {
    blocks: { setting: {}, links: [] },
    setting: {},
  };

  const {
    text,
    links,
    description,
    instagramLink,
    telegramLink,
    whatsappLink,
    logo,
  } = sectionData.blocks;

  return (
    <FooterContainer
      dir="rtl"
      $data={sectionData}
      onClick={() => setSelectedComponent("sectionFooter")}
    >
      <Logo
        $data={sectionData}
        src={logo || "/assets/images/logo.webp"}
        width={100}
        height={100}
        alt="Logo"
      />

      {text && <FooterText $data={sectionData}>{text}</FooterText>}
      {description && (
        <FooterDescription $data={sectionData}>{description}</FooterDescription>
      )}
      <SocialLinks>
        <Link
          href={instagramLink ? instagramLink : "/"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/assets/images/instagram.png"
            alt="Instagram"
            width={30}
            height={30}
          />
        </Link>
        <Link
          href={telegramLink ? telegramLink : "/"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/assets/images/whatsapp.png"
            alt="Whatsapp"
            width={30}
            height={30}
          />
        </Link>
        <Link
          href={whatsappLink ? whatsappLink : "/"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/assets/images/telegram.png"
            alt="Telegram"
            width={30}
            height={30}
          />
        </Link>
      </SocialLinks>

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
