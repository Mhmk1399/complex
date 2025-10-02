"use client";
import styled from "styled-components";
import { Layout, StorySection } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Delete } from "../C-D";
import { createApiService } from "@/lib/api-factory";

interface StoryProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
  previewWidth: "sm" | "default";
}

interface Story {
  _id: string;
  title: string;
  image: string;
  storeId: string;
  createdAt: string;
  updatedAt: string;
}

const StoryContainer = styled.div<{
  $data: StorySection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  padding-top: ${(props) => props.$data.setting?.paddingTop || "20"}px;
  padding-bottom: ${(props) => props.$data.setting?.paddingBottom || "20"}px;
  padding-right: ${(props) => props.$data.setting?.paddingRight || "20"}px;
  padding-left: ${(props) => props.$data.setting?.paddingLeft || "20"}px;
  margin-top: ${(props) => props.$data.setting?.marginTop || "10"}px;
  margin-bottom: ${(props) => props.$data.setting?.marginBottom || "10"}px;
  margin-right: ${(props) => props.$data.setting.marginRight}px;
  margin-left: ${(props) => props.$data.setting.marginLeft}px;
  background-color: ${(props) =>
    props.$data.blocks?.setting?.backgroundColor || "#ffffff"};
  box-shadow: ${(props) =>
    `${props.$data.blocks.setting.shadowOffsetX || 0}px 
     ${props.$data.blocks.setting.shadowOffsetY || 4}px 
     ${props.$data.blocks.setting.shadowBlur || 10}px 
     ${props.$data.blocks.setting.shadowSpread || 0}px 
     ${props.$data.blocks.setting.shadowColor || "#fff"}`};
`;

const StoriesWrapper = styled.section<{
  $data: StorySection;
}>`
  display: flex;
  direction: rtl;
  justify-content: flex-start;
  overflow-x: auto;
  gap: ${(props) => props.$data.blocks.setting.storyGap || 12}px;
  padding: 10px;
  scroll-behavior: smooth;
  width: 100%;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const StoryItem = styled.div<{
  $data: StorySection;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;
  width: ${(props) => props.$data.blocks.setting.storyWidth || 104}px;
  height: ${(props) => props.$data.blocks.setting.storyHeight || 300}px;

  .story-ring {
    padding: 2px;
    border-radius: 50%;
    border: 2px solid ${(props) => props.$data.blocks.setting.storyRingColor};
  }

  .story-image {
    border-radius: ${(props) => props.$data.blocks.setting.imageRadius}%;
    object-fit: cover;

    /* Apply story image animations */
    ${(props) => {
      const imageAnimation = props.$data.blocks?.setting?.imageAnimation;
      if (!imageAnimation) return "";

      const { type, animation: animConfig } = imageAnimation;
      const selector = type === "hover" ? "&:hover" : "&:active";

      // Generate animation CSS based on type
      if (animConfig.type === "pulse") {
        return `
          ${selector} {
            animation: storyImagePulse ${animConfig.duration} ${
          animConfig.timing
        } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes storyImagePulse {
            0%, 100% { 
              opacity: 1;
              filter: brightness(1);
            }
            50% { 
              opacity: 0.7;
              filter: brightness(1.3);
            }
          }
        `;
      } else if (animConfig.type === "glow") {
        return `
          ${selector} {
            animation: storyImageGlow ${animConfig.duration} ${
          animConfig.timing
        } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes storyImageGlow {
            0%, 100% { 
              filter: brightness(1) drop-shadow(0 0 0px rgba(255, 255, 255, 0));
            }
            50% { 
              filter: brightness(1.2) drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
            }
          }
        `;
      } else if (animConfig.type === "brightness") {
        return `
          ${selector} {
            animation: storyImageBrightness ${animConfig.duration} ${
          animConfig.timing
        } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes storyImageBrightness {
            0%, 100% { 
              filter: brightness(1);
            }
            50% { 
              filter: brightness(1.4);
            }
          }
        `;
      } else if (animConfig.type === "blur") {
        return `
          ${selector} {
            animation: storyImageBlur ${animConfig.duration} ${
          animConfig.timing
        } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes storyImageBlur {
            0%, 100% { 
              filter: blur(0px);
            }
            50% { 
              filter: blur(2px);
            }
          }
        `;
      } else if (animConfig.type === "saturate") {
        return `
          ${selector} {
            animation: storyImageSaturate ${animConfig.duration} ${
          animConfig.timing
        } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes storyImageSaturate {
            0%, 100% { 
              filter: saturate(1);
            }
            50% { 
              filter: saturate(1.8);
            }
          }
        `;
      } else if (animConfig.type === "contrast") {
        return `
          ${selector} {
            animation: storyImageContrast ${animConfig.duration} ${
          animConfig.timing
        } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes storyImageContrast {
            0%, 100% { 
              filter: contrast(1);
            }
            50% { 
              filter: contrast(1.5);
            }
          }
        `;
      } else if (animConfig.type === "opacity") {
        return `
          ${selector} {
            animation: storyImageOpacity ${animConfig.duration} ${
          animConfig.timing
        } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes storyImageOpacity {
            0% { 
              opacity: 1;
            }
            50% { 
              opacity: 0.4;
            }
            100% { 
              opacity: 1;
            }
          }
        `;
      } else if (animConfig.type === "shadow") {
        return `
          ${selector} {
            animation: storyImageShadow ${animConfig.duration} ${
          animConfig.timing
        } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes storyImageShadow {
            0%, 100% { 
              filter: drop-shadow(0 0 0px rgba(0, 0, 0, 0));
            }
            50% { 
              filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
            }
          }
        `;
      }

      return "";
    }}
  }

  .story-title {
    margin-top: 4px;
    font-size: ${(props) => props.$data.blocks.setting.titleFontSize}px;
    font-weight: ${(props) => props.$data.blocks.setting.titleFontWeight};
    color: ${(props) => props.$data.blocks.setting.titleColor};
    text-align: center;
  }
`;

export const Story: React.FC<StoryProps> = ({
  layout,
  actualName,
  selectedComponent,
  setSelectedComponent,
  setLayout,
  previewWidth,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [preview, setPreview] = useState(previewWidth);

  const api = createApiService({
    baseUrl: "/api",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        typeof window !== "undefined"
          ? localStorage.getItem("token") || ""
          : "",
    },
  });

  const { data: storiesData, error: storiesError } = api.useGet("/story", {
    revalidateOnFocus: false,
    refreshInterval: 60000,
  });

  const stories: Story[] = storiesData || [];

  useEffect(() => {
    if (window.innerWidth <= 425) {
      setPreview("sm");
    } else {
      setPreview(previewWidth);
    }
  }, [previewWidth]);

  const sectionData = layout?.sections?.children?.sections.find(
    (section) => section.type === actualName
  ) as StorySection;

  if (!layout || !layout.sections) {
    return null;
  }

  if (!sectionData) return null;

  return (
    <>
      <StoryContainer
        $preview={preview}
        $data={sectionData}
        $previewWidth={previewWidth}
        onClick={() => setSelectedComponent(actualName)}
        className={`transition-all duration-150 ease-in-out relative ${
          selectedComponent === actualName
            ? "border-4 border-blue-500 rounded-2xl shadow-lg"
            : ""
        }`}
      >
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-lg font-bold mb-4">
                مطمئن هستید؟
                <span className="text-blue-400 font-bold mx-1">
                  {actualName}
                </span>{" "}
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
              className="font-extrabold text-xl hover:bg-blue-500 bg-red-500 pb-1 rounded-r-lg px-3 text-white transform transition-all ease-in-out duration-300"
              onClick={() => setShowDeleteModal(true)}
            >
              x
            </button>
          </div>
        )}
        <StoriesWrapper
          $data={sectionData}
          ref={containerRef}
          className="overflow-x-auto"
        >
          {(stories.length > 0 ? stories : sectionData.blocks.stories).map(
            (story: any, idx: number) => (
              <StoryItem
                key={"_id" in story ? story._id + idx : idx}
                $data={sectionData}
                onClick={() => setSelectedStory(story.image || story.imageUrl)}
              >
                <div className="story-ring">
                  <Image
                    src={story.image || story.imageUrl}
                    alt={story.title}
                    className="story-image h-[100px] object-cover"
                    width={800}
                    height={800}
                  />
                </div>
                <span className="story-title">{story.title}</span>
              </StoryItem>
            )
          )}
        </StoriesWrapper>
      </StoryContainer>

      <AnimatePresence>
        {selectedStory && (
          <motion.div
            className="fixed w-full inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedStory(null)}
          >
            <motion.div
              className="relative w-full max-w-lg "
              initial={{ scale: 0.8, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute -top-20 right-3 z-100 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white text-2xl hover:bg-white/30 transition-all"
                onClick={() => setSelectedStory(null)}
              >
                ×
              </button>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-full h-full"
              >
                <Image
                  src={selectedStory}
                  alt="Story view"
                  width={400}
                  height={896}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
