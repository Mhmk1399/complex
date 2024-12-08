"use client";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import { Layout, BannerSection } from "@/lib/types";
import { useEffect, useState } from "react";

interface props {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
  previewWidth: "sm" | "default";
}

const SectionBanner = styled.section<{
  $data: BannerSection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  position: relative;
  height: ${(props) => (props.$preview === "sm" ? "300px" : "600px")};
  margin: 0px 10px;
  margin-top: ${(props) => props.$data.setting.marginTop}px;
  margin-bottom: ${(props) => props.$data.setting.marginBottom}px;
  padding-top: ${(props) => props.$data.setting.paddingTop}px;
  padding-bottom: ${(props) => props.$data.setting.paddingBottom}px;
  @media (max-width: 768px) {
    height: ${(props) => (props.$preview === "sm" ? "200px" : "300px")};
  }

`;

const BannerImage = styled(Image)<{
  $data: BannerSection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  opacity: ${(props) => props.$data.blocks.setting.opacityImage || "1"}px;
  border-radius: ${(props) =>
    props.$data.blocks.setting.imageRadious || "10px"};
  object-fit: ${(props) => props.$data.blocks.setting.imageBehavior};
`;

const BannerTextBox = styled.div<{
  $data: BannerSection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
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
  padding: ${(props) => (props.$preview === "sm" ? "20px 40px" : "50px 200px")};
  border-radius: ${(props) =>
    props.$data.blocks.setting.backgroundBoxRadious || "10px"};
`;

const HeadingText = styled.h2<{
  $data: BannerSection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  color: ${(props) => props.$data.blocks.setting.textColor || "#ffffff"};
  font-size: ${(props) =>
    props.$preview === "sm"
      ? "18px"
      : props.$data.blocks.setting.textFontSize || "16px"}px;
  font-weight: ${(props) =>
    props.$data.blocks.setting.textFontWeight || "bold"};
  text-align: center;
  @media (max-width: 768px) {
    font-size: ${(props) => (props.$preview === "sm" ? "16px" : "28px")};
  }
`;

const DescriptionText = styled.p<{
  $data: BannerSection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  color: ${(props) => props.$data.blocks.setting.descriptionColor || "#ffffff"};
  font-size: ${(props) =>
    props.$preview === "sm"
      ? "14px"
      : props.$data.blocks.setting.descriptionFontSize || "16px"}px;
  font-weight: ${(props) =>
    props.$data.blocks.setting.descriptionFontWeight || "normal"};
  margin-top: 14px;
  text-align: center;
  @media (max-width: 768px) {
    font-size: ${(props) => (props.$preview === "sm" ? "12px" : "16px")};
  }
`;

const Banner: React.FC<props> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
  setLayout,
  previewWidth,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [preview, setPreview] = useState(previewWidth);

  useEffect(() => {
    if (window.innerWidth <= 425) {
      setPreview("sm");
    } else {
      setPreview(previewWidth);
    }
  }, [previewWidth]);

  const sectionData = layout?.sections?.children?.sections.find(
    (section) => section.type === actualName
  ) as BannerSection;

  if (!sectionData) {
    return null;
  }
  if (!sectionData) {
    return <div>No data available</div>; // or handle this case appropriately
  }

  const { description, imageAlt, imageSrc, text } = sectionData?.blocks;

  console.log(preview);

  return (
    <SectionBanner
      $previewWidth={previewWidth}
      $preview={preview}
      $data={sectionData}
      onClick={() => setSelectedComponent(actualName)}
      
    >
     

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
          $preview={preview}
          $previewWidth={previewWidth}
          $data={sectionData}
          alt={imageAlt || "banner"}
          src={imageSrc || "/assets/images/banner2.webp"}
          fill
          priority
        />
      </Link>
      <BannerTextBox
        $data={sectionData}
        $previewWidth={previewWidth}
        $preview={preview}
      >
        <HeadingText
          $data={sectionData}
          $previewWidth={previewWidth}
          $preview={preview}
        >
          {text || "سربرگ بنر"}
        </HeadingText>
        <DescriptionText
          $data={sectionData}
          $previewWidth={previewWidth}
          $preview={preview}
        >
          {description || "توضیحات بنر"}
        </DescriptionText>
      </BannerTextBox>
    </SectionBanner>
  );
};

export default Banner;
