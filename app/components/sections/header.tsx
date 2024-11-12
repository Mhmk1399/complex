"use client";
import React, { useState } from "react";
import styled from "styled-components";

interface HeaderProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: {
    sections?: {
      sectionHeader?: SectionData;
    };
  };
}

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

const SectionHeader = styled.section<{ $data: SectionData }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${props => props?.$data?.setting?.paddingTop}px;
  padding-bottom: ${props => props?.$data?.setting?.paddingBottom}px;
  margin-top: ${props => props?.$data?.setting?.marginTop};
  margin-bottom: ${props => props?.$data?.setting?.marginBottom}px;
  background-color: ${props => props?.$data?.blocks?.setting?.backgroundColorNavbar};
  position: fixed;
z-index: 100;
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

const Logo = styled.img<{ $data: SectionData }>`
  width: ${props => props?.$data?.blocks?.setting?.imageWidth};
  height: ${props => props?.$data?.blocks?.setting?.imageHeight};
  border-radius: ${props => props?.$data?.blocks?.setting?.imageRadius};
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

const NavItem = styled.a<{ $data: SectionData }>`
  color: ${props => props?.$data?.blocks?.setting?.itemColor};
  font-size: ${props => props?.$data?.blocks?.setting?.itemFontSize}px;
  font-weight: ${props => props?.$data?.blocks?.setting?.itemFontWeight}px;
  padding: 0.5rem 1rem;
  text-decoration: none;
  &:hover {
    color: ${props => props?.$data?.blocks?.setting?.itemHoverColor};
  }
`;

const MenuButton = styled.button<{ $data: SectionData }>`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props?.$data?.blocks?.setting?.itemColor};

  @media (max-width: 768px) {
    display: flex;
  }
`;

const Header: React.FC<HeaderProps> = ({ setSelectedComponent, layout }) => {
  // Initialize with default values
  const defaultSectionData: SectionData = {
    blocks: {
      setting: {
        titleColor: "#000000",  // Changed from "#000"
        titleFontSize: "16px",
        titleFontWeight: "normal",
        imageWidth: "auto",
        imageHeight: "auto", 
        imageRadius: "0px",
        itemColor: "#000000",   // Changed from "#000"
        itemFontSize: "14px",
        itemFontWeight: "normal",
        itemHoverColor: "#666666", // Changed from "#666"
        backgroundColorNavbar: "transparent"
      },
      imageLogo: "/assets/images/logo.webp",
      imageAlt: "Logo",  // Add default value
      links: []
    },
    setting: {
      paddingTop: "0px",
      paddingBottom: "0px", 
      marginTop: "0px",
      marginBottom: "0px",
      navbarPosition: "static"
    }
  };
  

  const sectionData = layout.sections?.sectionHeader ?? defaultSectionData;
const { imageLogo, imageAlt, links = [] } = sectionData.blocks ?? defaultSectionData.blocks;



  const [isOpen, setIsOpen] = useState(false);

  return (
    <SectionHeader $data={sectionData} className="w-full lg:w-[75%]" dir="rtl" onClick={() => setSelectedComponent("sectionHeader")}>
      <LogoContainer>
        <Logo $data={sectionData} src={imageLogo || "/assets/images/logo.webp"} alt={imageAlt} />
        <MenuButton $data={sectionData} onClick={() => setIsOpen(!isOpen)}>☰</MenuButton>
      </LogoContainer>
      <NavItems $isOpen={isOpen}>
        {links?.map((link, index) => (
          <NavItem $data={sectionData} key={index} href={link.url}>
            {link.name}
          </NavItem>
        ))}
      </NavItems>
    </SectionHeader>
  );
};

export default Header;
