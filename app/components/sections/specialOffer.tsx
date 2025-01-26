"use client";
import styled from "styled-components";
import type { Layout, SpecialOfferSection } from "@/lib/types";
import ProductCard from "./productCard";
import { useEffect, useState, useRef } from "react";
import { Delete } from "../C-D";


interface SpecialOfferProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
  previewWidth: "sm" | "default";
}

const ScrollContainer = styled.div<{
    $data: SpecialOfferSection;
  }>`
    position: relative;
    width: 100%;
    padding-top: ${props => props.$data.setting?.paddingTop || "20"}px;
    padding-bottom: ${props => props.$data.setting?.paddingBottom || "20"}px;
    margin-top: ${props => props.$data.setting?.marginTop || "20"}px;
    margin-bottom: ${props => props.$data.setting?.marginBottom || "20"}px;
    background-color: ${props => props.$data.setting?.backgroundColor || "#ef394e"};
  `;
  
  const SpecialOfferSection = styled.section<{
    $data: SpecialOfferSection;
    $isMobile: boolean;
  }>`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: auto;
    max-width: 100%;
    overflow-x: scroll;
    scroll-behavior: smooth;
    gap: 8px;
    padding: ${props => props.$isMobile ? "10px" : "20px"};
    background-color: ${props => props.$data.setting?.backgroundColor || "#ef394e"};
    border-radius: ${props => props.$data.blocks?.setting?.cardBorderRadius || "8"}px;
    direction: rtl;
  
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  `;
  
  const Heading = styled.h2<{
    $data: SpecialOfferSection;
    $isMobile: boolean;
  }>`
    color: ${props => props.$data.blocks?.setting?.headingColor || "#FFFFFF"};
    font-size: ${props => props.$isMobile ? "24px" : `${props.$data.blocks?.setting?.headingFontSize || "32"}px`};
    font-weight: ${props => props.$data.blocks?.setting?.headingFontWeight || "bold"};
    text-align: center;
  `;
  
  const ScrollButton = styled.button<{
    $data: SpecialOfferSection;
  }>`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background:  "#FFFFFF";
    color: ${props => props.$data.blocks?.setting?.btnTextColor || "#000000"};
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
    &.left {
      left: 10px;
    }
  
    &.right {
      right: 10px;
    }
  `;
  const products = [
    {
      images: [{
        imageSrc: "",
        imageAlt: "mohammad"
      }],
      _id: "677117dba08192d1da911b0b",
      name: "mohammad",
      description: "emohammad amani",
      category: "دسته بندی",
      price: "1000000",
      status: "available",
      discount: "0",
      id: "1",
      innventory: "3",
      storeId: "store_m58avrgi2vn5vu",
      createdAt: "2024-12-29T09:35:23.118Z",
      updatedAt: "2024-12-29T13:55:46.614Z",
     
    },
    {
      images: [{
        imageSrc: "",
        imageAlt: "mohammad"
      }],
      _id: "677117dca08192d1da911b0d",
      name: "mohammad",
      description: "mohammad amani",
      category: "دسته بندی",
      price: "1000000222",
      status: "available",
      discount: "0",
      id: "1",
      innventory: "2",
      storeId: "store_m58avrgi2vn5vu",
      createdAt: "2024-12-29T09:35:24.993Z",
      updatedAt: "2024-12-29T14:36:07.223Z",
  
    },
    {
      images: [{
                imageSrc: "",

        imageAlt: "hosein"
      }],
      _id: "67724b53ba6f18debeb2f326",
      name: "hosein",
      description: "hosein zolghadr",
      category: "ghavi",
      price: "137900",
      status: "available",
      discount: "0",
      id: "1",
      innventory: "1",
      storeId: "store_m58avrgi2vn5vu",
      createdAt: "2024-12-30T07:27:15.321Z",
      updatedAt: "2024-12-30T07:27:15.321Z",
     
    },
    {
      images: [{
                imageSrc: "",

        imageAlt: "محصول"
      }],
      _id: "67823bb967997894dbc40a8d",
      name: "نام محصول",
      description: "توضیحات محصول",
      category: "دسته بندی",
      price: "0",
      status: "available",
      discount: "0",
      id: "1",
      innventory: "0",
      storeId: "store_m5rxu4p3vtt4it",
      createdAt: "2025-01-11T09:36:57.022Z",
      updatedAt: "2025-01-11T09:36:57.022Z",

    },
    {
      images: [{
                imageSrc: "",

        imageAlt: "محصول"
      }],
      _id: "6782440467997894dbc40ab5",
      name: "نام محصول",
      description: "توضیحات محصول",
      category: "دسته بندی",
      price: "0",
      status: "available",
      discount: "0",
      id: "1",
      innventory: "0",
      storeId: "store_m5rxu4p3vtt4it",
      createdAt: "2025-01-11T10:12:20.388Z",
      updatedAt: "2025-01-11T10:12:20.388Z",
     
    },
   
    {
      images: [{
        imageSrc: "/assets/images/product-detail.jpg6",
        imageAlt: "y6yy6y"
      }],
      _id: "6784bd0da4ac6b5c32f83e9f",
      name: "123344",
      description: "6y6y6cdcdcfef",
      category: "دسته بند6y6y6yی",
      price: "6666",
      status: "unavailable",
      discount: "15",
      id: "1",
      innventory: "6",
      storeId: "store_m5tl58b5uqb5du",
      createdAt: "2025-01-13T07:13:17.747Z",
      updatedAt: "2025-01-14T08:14:43.205Z",
     
    },
    {
      images: [{
                imageSrc: "",

        imageAlt: "محصول"
      }],
      _id: "6784bd16a4ac6b5c32f83ea1",
      name: "نام محصول",
      description: "توضیحات محصول",
      category: "دسته بندی",
      price: "0",
      status: "available",
      discount: "0",
      id: "1",
      innventory: "0",
      storeId: "store_m5tl58b5uqb5du",
      createdAt: "2025-01-13T07:13:26.304Z",
      updatedAt: "2025-01-13T07:13:26.304Z",
      
    },
    {
      images: [{
                imageSrc: "",

        imageAlt: "محصول"
      }],
      _id: "6784bd33a4ac6b5c32f83ea3",
      name: "نام محصول",
      description: "توضیحات محصول",
      category: "دسته بندی",
      price: "0",
      status: "available",
      discount: "0",
      id: "1",
      innventory: "0",
      storeId: "store_m5tl58b5uqb5du",
      createdAt: "2025-01-13T07:13:55.382Z",
      updatedAt: "2025-01-13T07:13:55.382Z",
   
    },
    {
      images: [{
                imageSrc: "",

        imageAlt: "محصول1"
      }],
      _id: "6784ee04a509c286fd7932d7",
      name: "نام محصول1",
      description: "توضیحات محصول11111",
      category: "دسته بندی",
      price: "100000",
      status: "available",
      discount: "10",
      id: "1",
      innventory: "12",
      storeId: "store_m5tr1xydyi8okv",
      createdAt: "2025-01-13T10:42:12.812Z",
      updatedAt: "2025-01-13T10:42:12.812Z",
    
    },
    {
      images: [{
                imageSrc: "",

        imageAlt: "محصول2"
      }],
      _id: "6784ee24a509c286fd7932d9",
      name: "نام محصول2",
      description: "توضیحات محصول2",
      category: "دسته بندی",
      price: "200000",
      status: "available",
      discount: "36",
      id: "1",
      innventory: "12",
      storeId: "store_m5tr1xydyi8okv",
      createdAt: "2025-01-13T10:42:44.880Z",
      updatedAt: "2025-01-13T10:42:44.880Z",
    
    },
    {
      images: [{
                imageSrc: "",

        imageAlt: "test "
      }],
      _id: "67869948d90e358680c368fb",
      name: "نامtest",
      description: "توضیحات test",
      category: "دسته بندی",
      price: "200000",
      status: "available",
      discount: "20",
      id: "1",
      innventory: "21",
      storeId: "store_m5wq385budr23k",
      createdAt: "2025-01-14T17:05:12.224Z",
      updatedAt: "2025-01-14T17:05:12.224Z",
   
    },
    {
      images:[ {
                imageSrc: "",

        imageAlt: "محصول"
      }],
      _id: "678da249c2aaf5f90996e60c",
      name: "نام محصول",
      description: "توضیحات محصول",
      category: "دسته بندی",
      price: "0",
      status: "available",
      discount: "0",
      id: "1",
      innventory: "0",
      storeId: "store_m63zjws4fznrke",
      createdAt: "2025-01-20T01:09:29.945Z",
      updatedAt: "2025-01-20T01:09:29.945Z",
     
    }
  ];
  export const SpecialOffer: React.FC<SpecialOfferProps> = ({
    setSelectedComponent,
    layout,
    actualName,
    selectedComponent,
    setLayout,
    previewWidth,
  }) => {
  
    const specialOfferProducts = products;
    
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [preview, setPreview] = useState(previewWidth);
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth <= 425) {
          setPreview("sm");
        } else {
          setPreview(previewWidth);
        }
      };
  
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [previewWidth]);
  
    const sectionData = layout?.sections?.children?.sections.find(
      (section) => section.type === actualName
    ) as SpecialOfferSection;
  
    if (!layout || !layout.sections) {
      return null;
    }
  
    if (!sectionData) return null;
  // useEffect(() => {
  //     const fetchSpecialOffers = async () => {
  //       try {
  //         const response = await fetch("/api/products");
  //         const data = await response.json();
  //         if (data?.products) {
  //           setSpecialOfferProducts(data.products);
  //         }
  //       } catch (error) {
  //         console.error("Error fetching special offers:", error);
  //       }
  //     };
  
  //     fetchSpecialOffers();
  //   }, []);
    const handleScroll = (direction: 'left' | 'right') => {
      if (containerRef.current) {
        const scrollAmount = 400;
        const newScrollPosition = containerRef.current.scrollLeft + (direction === 'left' ? scrollAmount : -scrollAmount);
        containerRef.current.scrollTo({
          left: newScrollPosition,
          behavior: 'smooth'
        });
      }
    };
  
    return (
      <ScrollContainer 
      $data={sectionData}
      onClick={() => setSelectedComponent(actualName)}
      className={`transition-all duration-150 ease-in-out relative ${
        selectedComponent === actualName ? "border-4 border-blue-500 rounded-2xl shadow-lg" : ""
      }`}
    >    
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
     <SpecialOfferSection 
    ref={containerRef} 
    $data={sectionData} 
    $isMobile={preview === "sm"}
  >
    <div className="flex flex-col items-center justify-center gap-y-10 px-10">
      <Heading 
        $data={sectionData} 
        $isMobile={preview === "sm"}
      >
              {sectionData.blocks?.textHeading}
            </Heading>
            <svg xmlns="http://www.w3.org/2000/svg" height="80px" viewBox="0 -960 960 960" width="80px" fill={sectionData.blocks?.setting.headingColor}>
              <path d="M300-520q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41Zm0-80q25 0 42.5-17.5T360-660q0-25-17.5-42.5T300-720q-25 0-42.5 17.5T240-660q0 25 17.5 42.5T300-600Zm360 440q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41Zm0-80q25 0 42.5-17.5T720-300q0-25-17.5-42.5T660-360q-25 0-42.5 17.5T600-300q0 25 17.5 42.5T660-240Zm-444 80-56-56 584-584 56 56-584 584Z"/>
            </svg>
          </div>
          
          {specialOfferProducts.map((product) => (
            <ProductCard key={product._id} productData={product} />
          ))}
        </SpecialOfferSection>
  
        <ScrollButton className="left bg-white" onClick={() => handleScroll('left')} $data={sectionData}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
          </svg>
        </ScrollButton>
  
        <ScrollButton className="right bg-white" onClick={() => handleScroll('right')} $data={sectionData}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
          </svg>
        </ScrollButton>
      </ScrollContainer>
    );
  };
  