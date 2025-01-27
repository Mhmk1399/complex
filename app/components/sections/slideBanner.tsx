"use client";
import styled from "styled-components";
import Image from "next/image";
import { Layout } from "@/lib/types";
import type { SlideBannerSection } from "@/lib/types";
import { Delete } from "../C-D";
import { useState, useEffect } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

interface props {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
  previewWidth: "sm" | "default";
}

const SlideBannerSection = styled.section<{
  $data: SlideBannerSection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  position: relative;
  width: 100%;
  padding-top: ${(props) => props.$data.setting.paddingTop}px;
  padding-bottom: ${(props) => props.$data.setting.paddingBottom}px;
  padding-left: ${(props) => props.$data.setting.paddingLeft}px;
  padding-right: ${(props) => props.$data.setting.paddingRight}px;
  height: ${(props) => props.$data.blocks.setting.height || "200"}px;
  margin-top: ${(props) => props.$data.setting.marginTop || "30"}px;
  margin-bottom: ${(props) => props.$data.setting.marginBottom}px;
  overflow: hidden;
`;

const SlideContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Slide = styled.div<{ $active: boolean; $data: SlideBannerSection }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${(props) => (props.$active ? 1 : 0)};
  transition: opacity 0.7s ease-in-out;
`;
const NavigationButtons = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  z-index: 10;
`;

const NavButton = styled.button<{
  $data: SlideBannerSection;
}>`
  background: ${(props) => props.$data.blocks.setting.bgArrow};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 1);
  }
`;
const DotsContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
`;

const Dot = styled.button<{ $active: boolean; $data: SlideBannerSection }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${(props) =>
    props.$active
      ? props.$data.blocks.setting.activeDotColor || "#ffffff"
      : props.$data.blocks.setting.inactiveDotColor ||
        "rgba(255, 255, 255, 0.5)"};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const SlideBanner: React.FC<props> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
  setLayout,
  previewWidth,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [preview, setPreview] = useState(previewWidth);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  useEffect(() => {
    if (window.innerWidth < 426) {
      setPreview("sm");
    } else {
      setPreview(previewWidth);
    }
  }, [previewWidth]);

  const sectionData = layout?.sections?.children?.sections.find(
    (section) => section.type === actualName
  ) as SlideBannerSection;

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === (sectionData?.blocks?.slides?.length ?? 1) - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? (sectionData?.blocks?.slides?.length ?? 1) - 1 : prev - 1
    );
  };

  if (!sectionData) return null;

  return (
    <SlideBannerSection
      $data={sectionData}
      $preview={preview}
      $previewWidth={previewWidth}
      onClick={() => setSelectedComponent(actualName)}
      className={`transition-all duration-150 ease-in-out relative ${
        selectedComponent === actualName ? "border-4 border-blue-500 " : ""
      }`}
      dir="rtl"
    >
      {showDeleteModal && (
        <div className="fixed inset-0  bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h3 className="text-lg font-bold mb-4">
              آیا از حذف
              <span className="text-blue-400 font-bold mx-1">{actualName}</span>
              مطمئن هستید؟
            </h3>
            <div className="flex flex-row-reverse gap-4 justify-end">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setShowDeleteModal(false)}
              >
                انصراف
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 "
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

      {actualName === selectedComponent ? (
        <div className="absolute w-fit -top-5 -left-1 z-10 flex flex-row-reverse">
          <div className="bg-blue-500 py-1 px-4 rounded-l-lg text-white">
            {actualName}
          </div>
          <button
            className="font-extrabold text-xl hover:bg-blue-500 bg-red-500 pb-1 rounded-r-lg px-3 text-white transform transition-all ease-in-out duration-300"
            onClick={() => setShowDeleteModal(true)}
          >
            x
          </button>
        </div>
      ) : null}

      <SlideContainer>
        {sectionData.blocks.slides.map((slide, index) => (
          <Slide
            key={index}
            $active={currentSlide === index}
            $data={sectionData}
          >
            <Image
  src={slide.imageSrc}
  alt={slide.imageAlt}
  width={preview === "sm" ? 300 : 10000}
  height={preview === "sm" ? 300 : 2000}
  className="w-full h-full object-cover"
  style={{
    objectFit: 'cover',
  }}
/>

          </Slide>
        ))}
      </SlideContainer>

      <NavigationButtons>
        <NavButton onClick={prevSlide} $data={sectionData}>
          <BsChevronRight size={20} />
        </NavButton>
        <NavButton onClick={nextSlide} $data={sectionData}>
          <BsChevronLeft size={20} />
        </NavButton>
      </NavigationButtons>
      <DotsContainer>
        {sectionData.blocks.slides.map((_, index) => (
          <Dot
            $data={sectionData}
            key={index}
            $active={currentSlide === index}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </DotsContainer>
    </SlideBannerSection>
  );
};
export default SlideBanner;
