"use client";
import React from "react";
import styled from "styled-components";
import { Layout, VideoSection } from "@/lib/types";

// Interfaces
interface VideoProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
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
const Video: React.FC<VideoProps> = ({ setSelectedComponent, layout }) => {
  const sectionData = layout.sections?.children?.sections?.find(
    (section) => section.type === "video"
  ) as VideoSection;

  const { blocks } = sectionData || { blocks: {} };

  return (
    <Section $data={sectionData} onClick={() => setSelectedComponent("video")}>
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
