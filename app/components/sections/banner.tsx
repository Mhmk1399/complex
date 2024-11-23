"use client";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import { Layout, BannerSection } from "@/lib/types";

interface props {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
}

const SectionBanner = styled.section<{ $data: BannerSection }>`
  position: relative; // Add this line to fix the Image fill issue
  height: 600px;
  margin: 0px 10px;
  margin-top: ${(props) => props.$data.setting.marginTop}px;
  margin-bottom: ${(props) => props.$data.setting.marginBottom}px;
  padding-top: ${(props) => props.$data.setting.paddingTop}px;
  padding-bottom: ${(props) => props.$data.setting.paddingBottom}px;
  // overflow: hidden;
  @media (max-width: 768px) {
    height: 300px;
  }
`;

const BannerImage = styled(Image)<{ $data: BannerSection }>`
  opacity: ${(props) => props.$data.blocks.setting.opacityImage || "1"}px;
  border-radius: ${(props) =>
    props.$data.blocks.setting.imageRadious || "10px"};
  object-fit: ${(props) => props.$data.blocks.setting.imageBehavior};
`;

const BannerTextBox = styled.div<{ $data: BannerSection }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: ${(props) => props.$data.blocks.setting.opacityTextBox || "1"};
  background-color: ${(props) =>
    props.$data.blocks.setting.backgroundColorBox || "rgba(0, 0, 0, 0.5)"};
  padding: 50px 200px;
  border-radius: ${(props) =>
    props.$data.blocks.setting.backgroundBoxRadious || "10px"};
  @media (max-width: 768px) {
    padding: 20px 40px;
  }
`;

const HeadingText = styled.h2<{ $data: BannerSection }>`
  color: ${(props) => props.$data.blocks.setting.textColor || "#fffff"};
  font-size: ${(props) => props.$data.blocks.setting.textFontSize || "16px"}px;
  font-weight: ${(props) =>
    props.$data.blocks.setting.textFontWeight || "bold"};
  text-align: center;
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const DescriptionText = styled.p<{ $data: BannerSection }>`
  color: ${(props) => props.$data.blocks.setting.descriptionColor || "#ffffff"};
  font-size: ${(props) =>
    props.$data.blocks.setting.descriptionFontSize || "16px"}px;
  font-weight: ${(props) =>
    props.$data.blocks.setting.descriptionFontWeight || "normal"};
  margin-top: 14px;
  text-align: center;
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const Banner: React.FC<props> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
}) => {
  const sectionData = layout?.sections?.children?.sections.find(
    (section) => section.type === actualName
  ) as BannerSection;

  if (!sectionData) {
    console.error("Banner section data is missing or invalid.");
    return null;
  }

  const { description, imageAlt, imageSrc, text } = sectionData?.blocks;

  return (
    <SectionBanner
      $data={sectionData}
      onClick={() => setSelectedComponent(actualName)}
      className={`transition-all duration-150 ease-in-out relative ${
        selectedComponent === actualName
          ? "border-4 border-blue-500 rounded-2xl shadow-lg "
          : ""
      }`}
    >
      {actualName === selectedComponent ? (
        <div className="absolute w-fit -top-5 -left-1 bg-blue-500 py-1 px-4 rounded-lg text-white z-10">
          {actualName}
        </div>
      ) : null}

      <Link
        href={sectionData.blocks.imageLink || "/"}
        style={{
          position: "relative",
          display: "block",
          width: "100%",
          height: "100%",
        }}
      >
        <BannerImage
          $data={sectionData}
          alt={imageAlt || "banner"}
          src={imageSrc || "/assets/images/banner2.webp"}
          fill
          priority
        />
      </Link>
      <BannerTextBox $data={sectionData}>
        <HeadingText $data={sectionData}>{text || "سربرگ بنر"}</HeadingText>
        <DescriptionText $data={sectionData}>
          {description || "توضیحات بنر"}
        </DescriptionText>
      </BannerTextBox>
    </SectionBanner>
  );
};

export default Banner;
