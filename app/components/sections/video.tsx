"use client";
import React, { useState } from "react";
import styled from "styled-components";
import { Layout, VideoSection } from "@/lib/types";
import { Delete } from "../C-D";

interface VideoProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
  previewWidth: "sm" | "default";
}

const Section = styled.section<{ $data: VideoSection; $previewWidth: string }>`
  padding-top: ${(props) => props.$data.setting?.paddingTop || "10"}px;
  padding-bottom: ${(props) => props.$data.setting?.paddingBottom || "10"}px;
  margin-top: ${(props) => props.$data?.setting?.marginTop || "0"}px;
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom || "0"}px;
  background-color: ${(props) =>
    props.$data.blocks.setting?.backgroundVideoSection || "#e4e4e4"};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  gap: 15px;
  // width: ${(props) => (props.$previewWidth === "sm" ? "375px" : "100%")};
`;

const Heading = styled.h1<{ $data: VideoSection; $previewWidth: string }>`
  color: ${(props) => props.$data.blocks.setting?.headingColor || "#333"};
  font-size: ${(props) =>
    props.$previewWidth === "sm"
      ? "20"
      : props.$data.blocks?.setting?.headingFontSize || "24"}px;
  font-weight: ${(props) =>
    props.$data.blocks?.setting?.headingFontWeight || "bold"};
  text-align: center;
  padding: 0 ${(props) => (props.$previewWidth === "sm" ? "10" : "0")}px;
  @media (max-width: 768px) {
    font-size:20px;
`;

const VideoElement = styled.video<{
  $data: VideoSection;
  $previewWidth: string;
}>`
  width: ${(props) =>
    props.$previewWidth === "sm"
      ? "355px"
      : props.$data.blocks.setting?.videoWidth || "100%"}0px;
  border-radius: ${(props) =>
    props.$data.blocks.setting?.videoRadious || "10px"}px;
  height: auto;
  padding: ${(props) => (props.$previewWidth === "sm" ? "0 10px" : "0")};
`;

const Video: React.FC<VideoProps> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
  setLayout,
  previewWidth,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const sectionData = layout.sections?.children?.sections?.find(
    (section) => section.type === actualName
  ) as VideoSection;

  if (!sectionData) return null;

  const { blocks } = sectionData;

  return (
    <Section
      $data={sectionData}
      $previewWidth={previewWidth}
      onClick={() => setSelectedComponent(actualName)}
      className={`transition-all duration-150 ease-in-out relative ${
        selectedComponent === actualName
          ? "border-4 border-blue-500 rounded-lg shadow-lg"
          : ""
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

      {blocks.heading && (
        <Heading $data={sectionData} $previewWidth={previewWidth}>
          {blocks.heading}
        </Heading>
      )}

      {blocks.videoUrl && (
        <VideoElement
          $data={sectionData}
          $previewWidth={previewWidth}
          src={blocks.videoUrl}
          loop={blocks.setting?.videoLoop}
          muted={blocks.setting?.videoMute}
          autoPlay={blocks.setting?.videoAutoplay}
          poster={blocks.setting?.videoPoster}
          controls
        >
          {blocks.videoAlt && <track kind="captions" label={blocks.videoAlt} />}
        </VideoElement>
      )}
    </Section>
  );
};

export default Video;
