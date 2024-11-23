"use client";
import React from "react";
import styled from "styled-components";
import { Layout, VideoSection } from "@/lib/types";

// Interfaces
interface VideoProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
}

// Styled Components for Video Section
const Section = styled.section<{ $data: VideoSection }>`
  padding-top: ${(props) => props.$data.setting?.paddingTop || "10px"}px;
  padding-bottom: ${(props) => props.$data.setting?.paddingBottom || "10px"}px;
  margin-top: ${(props) => props.$data.setting?.marginTop || "0px"}px;
  margin-bottom: ${(props) => props.$data.setting?.marginBottom || "0px"}px;
  background-color: ${(props) =>
    props.$data.blocks.setting?.backgroundVideoSection || "#e4e4e4"};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  gap: 15px;
`;

const Heading = styled.h1<{ $data: VideoSection }>`
  color: ${(props) => props.$data.blocks.setting?.headingColor || "#333"};
  font-size: ${(props) =>
    props.$data.blocks.setting?.headingFontSize || "24px"}px;
  font-weight: ${(props) =>
    props.$data.blocks.setting?.headingFontWeight || "bold"};
  text-align: center;
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const VideoElement = styled.video<{ $data: VideoSection }>`
  width: ${(props) => props.$data.blocks.setting?.videoWidth || "100%"};
  border-radius: ${(props) =>
    props.$data.blocks.setting?.videoRadious || "10px"}px;
  height: auto;
  @media (max-width: 768px) {
    border-radius: 20px;
    padding: 0px 10px;
  }
`;

// Video Component
const Video: React.FC<VideoProps> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
}) => {
  const sectionData = layout.sections?.children?.sections?.find(
    (section) => section.type === actualName
  ) as VideoSection;

  if (!sectionData) {
    console.error("Video section data is missing or invalid.");
    return null;
  }

  const { blocks } = sectionData || { blocks: {} };

  return (
    <Section
      $data={sectionData}
      onClick={() => setSelectedComponent(actualName)}
      className={`transition-all duration-150 ease-in-out relative ${
        selectedComponent === actualName
          ? "border-4 border-blue-500 rounded-lg shadow-lg "
          : ""
      }`}
    >
      {actualName === selectedComponent ? (
        <div className="absolute w-fit -top-5 -left-1 bg-blue-500 py-1 px-4  rounded-lg text-white z-10">
          {actualName}
        </div>
      ) : null}

      {blocks.heading && (
        <Heading $data={sectionData}>
          {blocks.heading || "Video Heading"}
        </Heading>
      )}
      {blocks.videoUrl && (
        <VideoElement
          $data={sectionData}
          src={blocks.videoUrl || "/assets/video/video.mp4"}
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
