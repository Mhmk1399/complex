"use client";
import {
  Layout,
  HeaderSection,
  Section as SectionType,
  HeaderBlock,
} from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";

interface HeaderProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  selectedComponent: string;
  previewWidth: "sm" | "default";
}
// const LoaderContainer = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   width: 100%;
//   height: 80px;
//   background-color: #14213d;
//   position: absolute;
//   z-index: 40;
// `;
// Styled components
const SectionHeader = styled.section<{
  $data: HeaderSection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  display: ${(props) => (props.$preview === "sm" ? "block" : "flex")};
  align-items: center;
  justify-content: center;
  text-align: center;
  padding-top: ${(props) => props.$data.setting.paddingTop || "0"}px;
  padding-bottom: ${(props) => props.$data.setting.paddingBottom || "0"}px;
  margin-top: ${(props) => props.$data.setting.marginTop || "0"}px;
  margin-bottom: ${(props) => props.$data.setting.marginBottom || "0"}px;
  background-color: ${(props) =>
    props.$data?.blocks?.setting?.backgroundColorNavbar || "#14213D"};
  position: absolute;
  width: 100%;
  z-index: 40;
`;

const LogoContainer = styled.div<{
  $data: HeaderSection;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 1rem;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Logo = styled.img<{
  $data: HeaderSection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  width: ${(props) =>
    props.$preview === "sm"
      ? `${Number(props.$data.blocks.setting.imageWidth || "100") / 2}`
      : `${props.$data.blocks.setting.imageWidth || "auto"}`}px;
  height: ${(props) =>
    props.$preview === "sm"
      ? `${Number(props.$data.blocks.setting.imageHeight || "50") / 2}`
      : `${props.$data.blocks.setting.imageHeight || "auto"}`}px;
  // margin-right: ${(props) =>
    props.$data.blocks.setting.marginRight || "0"}px;
  // margin-left: ${(props) => props.$data.blocks.setting.marginLeft || "0"}px;
  transition: all 0.3s ease-in-out;
  position: relative;
  transform: translateX(
    ${(props) =>
      `calc(${props.$data.blocks.setting.marginRight || 0}px - ${
        props.$data.blocks.setting.marginLeft || 0
      }px)`}
  );
`;

const NavItems = styled.div<{
  $isOpen: boolean;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  transition: all 0.3s ease-in-out;

  ${({ $preview, $isOpen }) =>
    $preview === "sm" &&
    `
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-height: ${$isOpen ? "500px" : "0"};
    opacity: ${$isOpen ? "1" : "0"};
    overflow: hidden;
    visibility: ${$isOpen ? "visible" : "hidden"};
    transform: translateY(${$isOpen ? "0" : "-90px"});
  `}
`;

const NavItem = styled(Link)<{
  $data: HeaderSection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  color: ${(props) => props.$data.blocks.setting.itemColor || "#000"};
  font-size: ${(props) =>
    props.$preview === "sm"
      ? `16`
      : `${props.$data.blocks.setting.itemFontSize || "14"}`}px;
  font-weight: ${(props) =>
    props.$data.blocks.setting.itemFontWeight || "normal"};
  padding: ${(props) =>
    props.$preview === "sm" ? "0.25rem 0.5rem" : "0.5rem 1rem"};
  transition: all 0.2s ease-in-out;
  &:hover {
    color: ${(props) => props.$data.blocks.setting.itemHoverColor || "#000"};
  }
`;

const MenuButton = styled.button<{
  $data: HeaderSection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  display: ${({ $preview }) => ($preview === "sm" ? "block" : "none")};
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;

  color: ${(props) => props.$data.blocks.setting.itemColor || "#000"};
  position: absolute;
  top: ${(props) => (props.$preview === "sm" ? "top-1" : "top-5")};
  z-index: 100;
`;

const Header: React.FC<HeaderProps> = ({
  setSelectedComponent,
  layout,
  selectedComponent,
  previewWidth,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [preview, setPreview] = useState(previewWidth);

  useEffect(() => {
    if (window.innerWidth <= 425) {
      setPreview("sm");
    } else {
      setPreview(previewWidth);
    }
  }, [previewWidth]);
  useEffect(() => {
    if (layout?.sections?.sectionHeader) {
    }
  }, [layout]);

  const sectionData = layout?.sections?.sectionHeader as HeaderSection;
  const isHeaderSection = (section: SectionType): section is HeaderSection => {
    return section?.type === "header" && "blocks" in section;
  };

  if (!sectionData || !isHeaderSection(sectionData)) {
    //  ("Section data is missing or invalid.");
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
      $preview={preview}
      $previewWidth={previewWidth}
      $data={sectionData}
      className={`w-full ${
        previewWidth === "default" ? "w-[75%]" : "w-[28%]"
      } px-1 transition-all duration-150 mt-4 ease-in-out ${
        selectedComponent === "sectionHeader" ? "border-4 border-blue-500" : ""
      }`}
      dir="rtl"
      onClick={() => setSelectedComponent("sectionHeader")}
    >
      {"sectionHeader" === selectedComponent ? (
        <div className="absolute w-fit -top-5 -left-1 z-10 flex ">
          <div className="bg-blue-500 py-1 px-4 rounded-l-lg text-white">
            {"sectionHeader"}
          </div>
        </div>
      ) : null}
      <LogoContainer $data={sectionData}>
        <Logo
          $preview={preview}
          className={`${isOpen ? "hidden" : "block"}`}
          $data={sectionData}
          $previewWidth={previewWidth}
          src={imageLogo || "/assets/images/logo.webp"}
          alt={imageAlt}
        />

        <MenuButton
          $preview={preview}
          className="absolute top-2 left-1 p-4"
          $data={sectionData}
          $previewWidth={previewWidth}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "X" : "☰"}
        </MenuButton>
      </LogoContainer>
      <NavItems
        $isOpen={isOpen}
        $previewWidth={previewWidth}
        $preview={preview}
      >
        {links?.map((link, index) => (
          <NavItem
            $preview={preview}
            $previewWidth={previewWidth}
            $data={sectionData}
            key={index}
            href={link.url}
          >
            {link.name}
          </NavItem>
        ))}
      </NavItems>
    </SectionHeader>
  );
};

export default Header;
