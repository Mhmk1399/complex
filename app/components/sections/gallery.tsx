"use client";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import { Layout, GallerySection } from "@/lib/types";
import { useState, useEffect } from "react";
import { Delete } from "../C-D";

interface GalleryProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
  previewWidth: "sm" | "default";
}

// Replace the useEffect and states with this default images array

const Section = styled.section<{
  $data: GallerySection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  padding-top: ${(props) => props.$data?.setting?.paddingTop || "20"}px;
  padding-bottom: ${(props) => props.$data?.setting?.paddingBottom || "20"}px;
  padding-left: ${(props) => props.$data?.setting?.paddingLeft || "0"}px;
  padding-right: ${(props) => props.$data?.setting?.paddingRight || "0"}px;
  margin-top: ${(props) => props.$data?.setting?.marginTop || "0"}px;
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom || "0"}px;
  background-color: ${(props) =>
    props.$data?.blocks?.setting?.background || "#ffffff"};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2<{ $data: GallerySection }>`
  color: ${(props) => props.$data?.blocks?.setting?.titleColor || "#000000"};
  font-size: ${(props) =>
    props.$data?.blocks?.setting?.titleFontSize || "24"}px;
  font-weight: ${(props) =>
    props.$data?.blocks?.setting?.titleFontWeight || "bold"};
  margin-bottom: 20px;
`;

const Description = styled.p<{ $data: GallerySection }>`
  color: ${(props) =>
    props.$data?.blocks?.setting?.descriptionColor || "#666666"};
  font-size: ${(props) =>
    props.$data?.blocks?.setting?.descriptionFontSize || "16"}px;
  font-weight: ${(props) =>
    props.$data?.blocks?.setting?.descriptionFontWeight || "normal"};
  margin-bottom: 30px;
  text-align: center;
`;

const ImageGrid = styled.div<{
  $data: GallerySection;
  $preview: "sm" | "default";
}>`
  display: grid;
  grid-template-columns: repeat(
    ${(props) =>
      props.$preview === "sm"
        ? props.$data?.blocks?.setting?.gridColumns
        : props.$data?.blocks?.setting?.gridColumns || "3"},
    1fr
  );
  gap: ${(props) => props.$data?.blocks?.setting?.gridGap || "20"}px;
  padding: 0 20px;
`;

const ImageWrapper = styled.div<{ $data: GallerySection }>`
  position: relative;
  height: ${(props) => props.$data?.blocks?.setting?.imageHeight || "200"}px;
  height: ${(props) => props.$data?.blocks?.setting?.imageWidth || "200"}px;
  border-radius: ${(props) =>
    props.$data?.blocks?.setting?.imageRadius || "8"}px;
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const Gallery: React.FC<GalleryProps> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
  setLayout,
  previewWidth,
}) => {
  const [preview, setPreview] = useState(previewWidth);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (window.innerWidth <= 425) {
      setPreview("sm");
    } else {
      setPreview(previewWidth);
    }
  }, [previewWidth]);

  const sectionData = layout?.sections?.children?.sections?.find(
    (section) => section.type === actualName
  ) as GallerySection;

  if (!sectionData) return null;

  const { title, description, images } = sectionData.blocks;

  return (
    <Section
      $data={sectionData}
      $preview={preview}
      $previewWidth={previewWidth}
      onClick={() => setSelectedComponent(actualName)}
      className={`transition-all duration-150 ease-in-out relative ${
        selectedComponent === actualName ? "border-4 border-blue-500" : ""
      }`}
    >
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h3 className="text-lg font-bold mb-4">
              مطمئن هستید؟
              <span className="text-blue-400 font-bold mx-1">{actualName}</span>
              آیا از حذف
            </h3>
            <div className="flex gap-4 justify-end">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setShowDeleteModal(false)}
              >
                انصراف
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={() => {
                  Delete(actualName, layout, setLayout);
                  setShowDeleteModal(false);
                }}
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {actualName === selectedComponent && (
        <div className="absolute w-fit -top-5 -left-1 z-10 flex">
          <div className="bg-blue-500 py-1 px-4 rounded-l-lg text-white">
            {actualName}
          </div>
          <button
            className="font-extrabold text-xl hover:bg-blue-500 bg-red-500 pb-1 rounded-r-lg px-3 text-white transform transition-all duration-300"
            onClick={() => setShowDeleteModal(true)}
          >
            x
          </button>
        </div>
      )}
      {title && <Title $data={sectionData}>{title}</Title>}
      {description && (
        <Description $data={sectionData}>{description}</Description>
      )}

      <ImageGrid $data={sectionData} $preview={preview}>
        {images.map((image, index) => (
          <ImageWrapper key={index} $data={sectionData}>
            <Link
              href={image.imageLink ? image.imageLink : "#"}
              target="_blank"
            >
              <Image
                src={image.imageSrc}
                alt={image.imageAlt}
                width={3000}
                height={3000}
                className="w-full h-full object-cover"
              />
            </Link>
          </ImageWrapper>
        ))}
      </ImageGrid>
    </Section>
  );
};

export default Gallery;
