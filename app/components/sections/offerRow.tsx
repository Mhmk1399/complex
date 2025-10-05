"use client";
import styled from "styled-components";
import { Layout, OfferRowSection } from "@/lib/types";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Delete } from "../C-D";
import Link from "next/link";
import { createApiService } from "@/lib/api-factory";

interface OfferRowProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
  previewWidth: "sm" | "default";
}

const OffersContainer = styled.div<{
  $data: OfferRowSection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  margin-top: ${(props) => props.$data.setting?.marginTop || "10"}px;
  margin-bottom: ${(props) => props.$data.setting?.marginBottom || "10"}px;
  padding-top: ${(props) => props.$data.setting?.paddingTop || "20"}px;
  padding-bottom: ${(props) => props.$data.setting?.paddingBottom || "20"}px;
`;

const OffersWrapper = styled.section<{
  $data: OfferRowSection;
  $previewWidth: "sm" | "default";
}>`
  display: flex;
  direction: rtl;
  justify-content: flex-center;
  align-items: center;
  overflow-x: auto;
  gap: 30px;
  padding: 8px;
  scroll-behavior: smooth;
  background: linear-gradient(
    to right,
    ${(props) => props.$data.setting?.gradientFromColor || "#e5e7eb"},
    ${(props) => props.$data.setting?.gradientToColor || "#d1d5db"}
  );
  border-radius: 0.75rem;
`;

const OfferItem = styled.div<{
  $data: OfferRowSection;
}>`
  display: flex;
  cursor: pointer;
  flex-direction: row;
  align-items: center;

  .offer-image {
    width: 80px;
    height: 80px;
    object-fit: cover;

    /* Apply image animations */
    ${(props) => {
      const imageAnimation = props.$data.blocks?.setting?.imageAnimation;
      if (!imageAnimation) return "";

      const { type, animation: animConfig } = imageAnimation;
      const selector = type === "hover" ? "&:hover" : "&:active";

      // Generate animation CSS based on type
      if (animConfig.type === "pulse") {
        return `
          ${selector} {
            animation: offerImagePulse ${animConfig.duration} ${
          animConfig.timing
        } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes offerImagePulse {
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
            animation: offerImageGlow ${animConfig.duration} ${
          animConfig.timing
        } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes offerImageGlow {
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
            animation: offerImageBrightness ${animConfig.duration} ${
          animConfig.timing
        } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes offerImageBrightness {
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
            animation: offerImageBlur ${animConfig.duration} ${
          animConfig.timing
        } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes offerImageBlur {
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
            animation: offerImageSaturate ${animConfig.duration} ${
          animConfig.timing
        } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes offerImageSaturate {
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
            animation: offerImageContrast ${animConfig.duration} ${
          animConfig.timing
        } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes offerImageContrast {
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
            animation: offerImageOpacity ${animConfig.duration} ${
          animConfig.timing
        } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes offerImageOpacity {
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
            animation: offerImageShadow ${animConfig.duration} ${
          animConfig.timing
        } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes offerImageShadow {
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

  .discount-badge {
    background: #ef394e;
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 14px;
  }
`;

const ViewAllButton = styled.button<{
  $data: OfferRowSection;
}>`
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  margin: 1rem 0;
  font-size: 1.125rem;
  margin-right: auto;
  font-weight: 600;
  display: none;

  &:hover {
    opacity: 0.65;
  }

  @media (min-width: 1024px) {
    display: flex;
    flex-direction: row-reverse;
    gap: 0.5rem;
    align-items: center;
  }

  /* Apply button animations */
  ${(props) => {
    const buttonAnimation = props.$data.blocks?.setting?.buttonAnimation;
    if (!buttonAnimation) return "";

    const { type, animation: animConfig } = buttonAnimation;
    const selector = type === "hover" ? "&:hover" : "&:active";

    // Generate animation CSS based on type
    if (animConfig.type === "pulse") {
      return `
        ${selector} {
          animation: offerButtonPulse ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes offerButtonPulse {
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
          animation: offerButtonGlow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes offerButtonGlow {
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
          animation: offerButtonBrightness ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes offerButtonBrightness {
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
          animation: offerButtonBlur ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes offerButtonBlur {
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
          animation: offerButtonSaturate ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes offerButtonSaturate {
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
          animation: offerButtonContrast ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes offerButtonContrast {
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
          animation: offerButtonOpacity ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes offerButtonOpacity {
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
          animation: offerButtonShadow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes offerButtonShadow {
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
`;

export const OfferRow: React.FC<OfferRowProps> = ({
  layout,
  actualName,
  selectedComponent,
  setSelectedComponent,
  setLayout,
  previewWidth,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [preview, setPreview] = useState(previewWidth);
  const sectionData = layout?.sections?.children?.sections?.find(
    (section) => section.type === actualName
  ) as OfferRowSection;

  const api = createApiService({
    baseUrl: "/api",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const collectionId = sectionData?.blocks?.setting?.selectedCollection;
  const { data: collectionsData } = api.useGet(
    collectionId ? "/collections/id" : "/collections",
    {
      headers: { collectionId },
      revalidateOnFocus: false,
    }
  );

  const categories = collectionsData?.collections?.[0]?.products || [];

  useEffect(() => {
    if (window.innerWidth <= 424) {
      setPreview("sm");
    } else {
      setPreview(previewWidth);
    }
  }, [previewWidth]);

  if (!sectionData) return null;

  return (
    <OffersContainer
      $data={sectionData}
      $preview={preview}
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
            className="font-extrabold text-xl hover:bg-blue-500 bg-red-500 pb-1 rounded-r-lg px-3 text-white transform transition-all ease-in-out duration-300"
            onClick={() => setShowDeleteModal(true)}
          >
            x
          </button>
        </div>
      )}

      <OffersWrapper
        ref={containerRef}
        $data={sectionData}
        $previewWidth={previewWidth}
        className={`flex gap-4 flex-col  ${
          preview === "sm" ? "flex-col" : "flex-row lg:flex-row"
        }`}
      >
        <div className="flex items-center justify-start gap-4 flex-row">
          <Image
            src={"/assets/images/fresh.webp"}
            alt="Offer"
            width={80}
            height={50}
          />
          <h2
            className={`text-lg font-bold lg:text-2xl lg:w-1/4 w-full text-nowrap`}
            style={{
              color: sectionData.blocks.setting?.titleColor || "#059669",
            }}
          >
            {sectionData.blocks.setting?.titleText}
          </h2>
        </div>
        <div className={`flex mr-2 items-center justify-center gap-2 lg:gap-4`}>
          {categories.length > 0 ? (
            categories.map(
              (category: {
                _id: string;
                images: { imageSrc: string; imageAlt: string };
                title: string;
                discount?: number;
              }) => (
                <OfferItem
                  key={category._id}
                  className="relative"
                  $data={sectionData}
                >
                  <Image
                    src={category.images.imageSrc}
                    alt={category.images.imageAlt}
                    width={60}
                    height={60}
                    className="offer-image rounded-full"
                  />
                  {category.discount && (
                    <span className="discount-badge bottom-0 text-xs absolute">
                      {category.discount}%
                    </span>
                  )}
                </OfferItem>
              )
            )
          ) : (
            <div className="flex flex-row items-center justify-start lg:justify-end w-full">
              <span className="text-gray-500 text-xl justify-center text-center w-full flex lg:gap-5">
                لطفا یک دسته‌بندی را انتخاب کنید
              </span>
            </div>
          )}
        </div>
        {previewWidth == "default" && (
          <ViewAllButton
            $data={sectionData}
            style={{
              background: sectionData.blocks.setting?.buttonColor || "#ffffff",
              color: sectionData.blocks.setting?.buttonTextColor || "#000000",
            }}
          >
            <svg
              fill={sectionData.blocks.setting?.buttonTextColor || "#000000"}
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
            >
              <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
            </svg>
            <Link href={"/"}>
              {sectionData.blocks?.setting?.buttonText || "مشاهده همه"}
            </Link>
          </ViewAllButton>
        )}
      </OffersWrapper>
    </OffersContainer>
  );
};
