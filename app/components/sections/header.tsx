"use client";
import {
  Layout,
  HeaderSection,
  Section as SectionType,
  HeaderBlock,
} from "@/lib/types";
import { useState } from "react";
import styled from "styled-components";

interface HeaderProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
}

// Styled components
const SectionHeader = styled.section<{
  $data: HeaderSection;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${(props) => props.$data.setting.paddingTop || "0px"}px;
  padding-bottom: ${(props) => props.$data.setting.paddingBottom || "0px"}px;
  margin-top: ${(props) => props.$data.setting.marginTop || "0px"}px;
  margin-bottom: ${(props) => props.$data.setting.marginBottom || "0px"}px;
  background-color: ${(props) =>
    props.$data.blocks.setting.backgroundColorNavbar};

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

const Logo = styled.img<{ $data: HeaderSection }>`
  width: ${(props) => props.$data.blocks.setting.imageWidth || "auto"}px;
  height: ${(props) => props.$data.blocks.setting.imageHeight || "auto"}px;
  border-radius: ${(props) => props.$data.blocks.setting.imageRadius || "0px"};
`;

const NavItems = styled.div<{ $isOpen: boolean }>`
  display: flex;
  gap: 2rem;
  transition: all 0.3s ease-in-out;
  align-items: center;

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

const NavItem = styled.a<{ $data: HeaderSection }>`
  color: ${(props) => props.$data.blocks.setting.itemColor || "#000"};
  font-size: ${(props) => props.$data.blocks.setting.itemFontSize || "14px"};
  font-weight: ${(props) =>
    props.$data.blocks.setting.itemFontWeight || "normal"};
  padding: 0.5rem 1rem;
  text-decoration: none;
  transition: all 0.3s ease-in-out;

  &:hover {
    color: ${(props) => props.$data.blocks.setting.itemHoverColor || "#666"};
    transform: scale(1.1);
  }
`;

const MenuButton = styled.button<{ $data: HeaderSection }>`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${(props) => props.$data.blocks.setting.itemColor || "#000"};

  @media (max-width: 768px) {
    display: flex;
  }
`;

const Header: React.FC<HeaderProps> = ({ setSelectedComponent, layout }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const sectionData = layout?.sections?.sectionHeader as HeaderSection;
  const isHeaderSection = (section: SectionType): section is HeaderSection => {
    return section?.type === "header" && "blocks" in section;
  };

  if (!sectionData || !isHeaderSection(sectionData)) {
    console.error("Section data is missing or invalid.");
    return null;
  }

  const { blocks } = sectionData;

  const isHeaderBlock = (block: HeaderBlock): block is HeaderBlock => {
    return (
      block &&
      "imageLogo" in block &&
      "imageAlt" in block &&
      Array.isArray(block.links)
    );
  };

  if (!isHeaderBlock(blocks)) {
    console.error("Blocks data is missing or invalid.");
    return null;
  }

  const { imageLogo, imageAlt, links } = blocks;

  return (
    <SectionHeader
      $data={sectionData}
      className="w-full lg:w-[75%]"
      dir="rtl"
      onClick={() => setSelectedComponent("sectionHeader")}
    >
      <LogoContainer>
        <Logo
          $data={sectionData}
          src={imageLogo || "/assets/images/logo.webp"}
          alt={imageAlt}
        />
        <MenuButton $data={sectionData} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "X" : "☰"}
        </MenuButton>
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
