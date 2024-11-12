"use client";
import React from "react";
import styled from "styled-components";

interface VideoProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: {
    sections?: {
      children?: { sections: SectionData[] };
    };
  };
}

interface BlocksType {
  setting: {
    headingColor?: string;
    headingFontSize?: string;
    headingFontWeight?: string;
    videoWidth?: string;
    videoHeight?: string;
    videoRadius?: string;
    videoLoop?: boolean;
    videoMute?: boolean;
    videoAutoplay?: boolean;
    videoPoster?: string;
  };
  heading?: string;
  videoUrl?: string;
  videoAlt?: string;
}

interface SettingType {
  paddingTop?: string;
  paddingBottom?: string;
  marginTop?: string;
  marginBottom?: string;
}

interface SectionData {
  blocks: BlocksType;
  setting: SettingType;
}

// Styled Components for Video Section
const Section = styled.section<{ $data: SectionData }>`
  padding-top: ${(props) => props.$data?.setting?.paddingTop || "10px"}px;
  padding-bottom: ${(props) => props.$data?.setting?.paddingBottom || "10px"}px;
  margin-top: ${(props) => props.$data?.setting?.marginTop || "0px"}px;
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom || "0px"}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
`;

const Heading = styled.h1<{ $data: SectionData }>`
  color: ${(props) => props.$data?.blocks?.setting?.headingColor};
  font-size: ${(props) => props.$data?.blocks?.setting?.headingFontSize};
  font-weight: ${(props) => props.$data?.blocks?.setting?.headingFontWeight};
  text-align: center;
`;

const VideoElement = styled.video<{ $data: SectionData }>`
  width: ${(props) => props.$data?.blocks?.setting?.videoWidth || "100%"};
  height: ${(props) => props.$data?.blocks?.setting?.videoHeight || "auto"};
  border-radius: ${(props) =>
    props.$data?.blocks?.setting?.videoRadius || "0px"};
`;

// Video Component
const Video: React.FC<VideoProps> = ({ setSelectedComponent, layout }) => {
  const sectionData = layout.sections?.children?.sections?.[4] as SectionData;
  const { heading, videoUrl, videoAlt } = sectionData?.blocks || {};

  return (
    <Section $data={sectionData} onClick={() => setSelectedComponent("video")}>
      {heading && (
        <Heading $data={sectionData}>{heading || "heading of video"}</Heading>
      )}
      {videoUrl && (
        <VideoElement
          $data={sectionData}
          src={videoUrl}
          loop={sectionData.blocks.setting.videoLoop}
          muted={sectionData.blocks.setting.videoMute}
          autoPlay={sectionData.blocks.setting.videoAutoplay}
          poster={sectionData.blocks.setting.videoPoster}
          controls
        >
          {videoAlt && <track kind="captions" label={videoAlt} />}
        </VideoElement>
      )}
    </Section>
  );
};
export default Video;
