"use client";
import { useState } from "react";
import nullData from "../../../public/template/null.json";
import styled from "styled-components";

interface HeaderLink {
  name: string;
  url: string;
}
interface BlocksType {
  setting: {
    titleColor?: string;
    titleFontSize?: string;
    titleFontWeight?: string;
    imageWidth?: string;
    imageHeight?: string;
    imageRadius?: string;
    itemColor?: string;
    itemFontSize?: string;
    itemFontWeight?: string;
    itemHoverColor?: string;
    backgroundColorNavbar?: string;
  };
  imageLogo?: string;
  imageAlt?: string;
  links?: HeaderLink[];
}

interface SettingType {
  paddingTop?: string;
  paddingBottom?: string;
  marginTop?: string;
  marginBottom?: string;
  navbarPosition?: string;
}

interface SectionData {
  blocks: BlocksType;
  setting: SettingType;
}
const sectionData = nullData.sections.sectionHeader as SectionData;

// Styled components
const SectionHeader = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${sectionData.setting.paddingTop};
  padding-bottom: ${sectionData.setting.paddingBottom};
  margin-top: ${sectionData.setting.marginTop};
  margin-bottom: ${sectionData.setting.marginBottom};
  background-color: ${sectionData.blocks.setting.backgroundColorNavbar};
  position: ${sectionData.setting.navbarPosition};
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 1rem;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Logo = styled.img`
  width: ${sectionData.blocks.setting.imageWidth};
  height: ${sectionData.blocks.setting.imageHeight};
  border-radius: ${sectionData.blocks.setting.imageRadius};
`;

const NavItems = styled.div<{ $isOpen: boolean }>`
  display: flex;
  gap: 1.5rem;
  transition: all 0.3s ease-in-out;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-height: ${({ $isOpen }) => ($isOpen ? "500px" : "0")};
    opacity: ${({ $isOpen }) => ($isOpen ? "1" : "0")};
    overflow: hidden;
    visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
    transform: translateY(${({ $isOpen }) => ($isOpen ? "0" : "-90px")});
    transition: all 0.5s ease-in-out;
  }
`;

const NavItem = styled.a`
  color: ${sectionData.blocks.setting.itemColor};
  font-size: ${sectionData.blocks.setting.itemFontSize};
  font-weight: ${sectionData.blocks.setting.itemFontWeight};
  padding: 0.5rem 1rem;
  text-decoration: none;
  &:hover {
    color: ${sectionData.blocks.setting.itemHoverColor};
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${sectionData.blocks.setting.itemColor};

  @media (max-width: 768px) {
    display: flex;
  }
`;

const Header: React.FC = () => {
  const { imageLogo, imageAlt, links } = sectionData.blocks;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SectionHeader dir="rtl">
      <LogoContainer>
        <Logo src={imageLogo || "/assets/images/logo.webp"} alt={imageAlt} />
        <MenuButton onClick={() => setIsOpen(!isOpen)}>☰</MenuButton>
      </LogoContainer>
      <NavItems $isOpen={isOpen}>
        {links?.map((link, index) => (
          <NavItem key={index} href={link.url}>
            {link.name}
          </NavItem>
        ))}
      </NavItems>
    </SectionHeader>
  );
};

export default Header;
