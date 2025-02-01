"use client";
import styled from "styled-components";
import { Layout, OfferRowSection } from "@/lib/types";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Delete } from "../C-D";

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
  margin-top: ${props => props.$data.setting?.marginTop || "10"}px;
  margin-bottom: ${props => props.$data.setting?.marginBottom || "10"}px;
  padding-top: ${props => props.$data.setting?.paddingTop || "20"}px;
  padding-bottom: ${props => props.$data.setting?.paddingBottom || "20"}px;
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
  background: linear-gradient(to right, 
    ${props => props.$data.setting?.gradientFromColor || '#e5e7eb'}, 
    ${props => props.$data.setting?.gradientToColor || '#d1d5db'}
  );
  
  border-radius: 0.75rem;
`;


const OfferItem = styled.div`
  display: flex;
  cursor: pointer;
  flex-direction: row;
  
  align-items: center;
  

  .offer-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
  }

  .discount-badge {
    background: #ef394e;
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 14px;
  }
`;

export const OfferRow: React.FC<OfferRowProps> = ({
  layout,
  actualName,
  selectedComponent,
  setSelectedComponent,
  setLayout,
  previewWidth
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [preview, setPreview] = useState(previewWidth);
console.warn(previewWidth);

  useEffect(() => {
    if (window.innerWidth <= 424) {
      setPreview("sm");
    } else {
      setPreview(previewWidth);
    }
  }, [previewWidth]);

  const sectionData = layout?.sections?.children?.sections.find(
    (section) => section.type === actualName
  ) as OfferRowSection;

  if (!sectionData) return null;
  console.log('sectionData', sectionData);

  const offers = [
    {
      id: 2,
      title: "برنج طبیعت",
      imageUrl: "/assets/images/pro1.jpg",
      price: 450000,
      originalPrice: 520000,
      discount: 15,
    },
    {
      id: 3,
      title: "برنج طبیعت",
      imageUrl: "/assets/images/pro1.jpg",
      price: 450000,
      originalPrice: 520000,
      discount: 15,
    },
    {
      id: 4,
      title: "برنج طبیعت",
      imageUrl: "/assets/images/pro1.jpg",
      price: 450000,
      originalPrice: 520000,
      discount: 15,
    },
    
  ];
  console.log(selectedComponent)
  return (
    <OffersContainer
      $data={sectionData}
      $preview={preview}
      $previewWidth={previewWidth}
      onClick={() => setSelectedComponent(actualName)}
      className={`transition-all duration-150 ease-in-out relative  ${selectedComponent === actualName
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

      <OffersWrapper ref={containerRef} $data={sectionData} $previewWidth={previewWidth} className={`flex gap-4 flex-col  ${preview === "sm" ? "flex-col" : "flex-row lg:flex-row"}`}>
        <div className="flex items-center justify-start gap-4 flex-row">
          <Image src={"/assets/images/fresh.webp"} alt="Offer" width={80} height={50} />
          <h2
            className={`text-lg font-bold lg:text-2xl lg:w-1/4 w-full text-nowrap`}
            style={{ color: sectionData.blocks.setting?.titleColor || '#059669' }}
          >
            {sectionData.blocks.setting?.titleText}
          </h2>
        </div>
        <div className={`flex  mr-2 items-center justify-center gap-2 lg:gap-4`}>
          {offers.map((offer) => (
            <OfferItem key={offer.id} className="relative">
              <Image
                src={offer.imageUrl}
                alt={offer.title}
                width={60}
                height={60}
                className="offer-image rounded-full"
              />
              <span className="discount-badge bottom-0 text-xs absolute">{offer.discount}%</span>
            </OfferItem>
          ))}
         { <button className=" bg-white lg:hidden rounded-full w-fit px-4 py-2 my-4 lg:mr-8 text-lg items-center"> <svg
          fill={sectionData.blocks.setting?.buttonTextColor || '#000000'}
          xmlns="http://www3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
        >
          <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
        </svg>
        </button>}
        {previewWidth==="sm"&&
          <button className=" bg-white  rounded-full w-fit px-4 py-2 my-4 lg:mr-8 text-lg items-center"> <svg
          fill={sectionData.blocks.setting?.buttonTextColor || '#000000'}
          xmlns="http://www3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
        >
          <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
        </svg>
        </button>}
        </div>
        {previewWidth=="default" &&<button
            className="rounded-full px-4 py-2 my-4 text-lg mr-auto font-semibold hidden  lg:flex flex-row-reverse gap-x-2 items-center"
            style={{ background: sectionData.blocks.setting?.buttonColor || '#ffffff', color: sectionData.blocks.setting?.buttonTextColor || '#000000' }}
          ><svg
            fill={sectionData.blocks.setting?.buttonTextColor || '#000000'}
            xmlns="http://www3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
          >
              <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
            </svg>
            {sectionData.setting?.buttonText || 'مشاهده همه'}</button>}
          
         

      </OffersWrapper>
    </OffersContainer>
  );
};
