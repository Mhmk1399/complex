"use client";
import React, { useEffect, useState } from "react";
import {
  DetailPageSection,
  Layout,
  ProductCardData,
  ProductImage,
} from "@/lib/types";
import Image from "next/image";
import { Delete } from "../C-D";
import { styled } from "styled-components";

interface DetailPageProps {
  productId: string;
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
}

const SectionDetailPage = styled.div<{
  $data: DetailPageSection;
}>`
  padding-top: ${(props) => props.$data?.setting?.paddingTop}px;
  padding-bottom: ${(props) => props.$data?.setting?.paddingBottom}px;
  margin-top: ${(props) => props.$data?.setting?.marginTop}px;
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom}px;
  background-color: ${(props) => props.$data?.setting?.backgroundColor};


  .product-name {
    color: ${(props) => props.$data?.setting?.productNameColor};
    font-size: ${(props) => props.$data?.setting?.productNameFontSize}px;
    font-weight: ${(props) => props.$data?.setting?.productNameFontWeight};
  }
  .product-category {
    color: ${(props) => props.$data?.setting?.categoryColor};
    font-size: ${(props) => props.$data?.setting?.categoryFontSize}px;
  }

  .product-price {
    color: ${(props) => props.$data?.setting?.priceColor};
    font-size: ${(props) => props.$data?.setting?.priceFontSize}px;
    @media (max-width: 768px) {
      font-size: 30px;
    }
  }

  .product-description {
    color: ${(props) => props.$data?.setting?.descriptionColor};
    font-size: ${(props) => props.$data?.setting?.descriptionFontSize}px;
    @media (max-width: 768px) {
      font-size: 20px;
    }
  }
  .product-status {
    color: ${(props) => props.$data?.setting?.statusColor};
    font-size: ${(props) => props.$data?.setting?.statusFontSize}px;
    @media (max-width: 768px) {
      font-size: 20px;
    }
  }

  .add-to-cart-button {
    background-color: ${(props) =>
      props.$data?.setting?.btnBackgroundColor || "#3498DB"};
    color: ${(props) => props.$data?.setting?.btnTextColor};
    transition: transform 0.5s ease;
    &:hover {
      transform: translateY(-2px);
      opacity: 0.85;
      transition: transform 0.3s ease-in-out;
    }
  }

  .product-image {
    width: ${(props) => props.$data?.setting?.imageWidth}0px;
    height: ${(props) => props.$data?.setting?.imageHeight}0px;
    border-radius: ${(props) => props.$data?.setting?.imageRadius}px;
    object-fit: cover;
    overflow: hidden;
    position: relative;

    @media (max-width: 768px) {
      width: 100%;
      height: auto;
    }

    img {
      width: 100%;
      height: 100%;
      transition: transform 0.4s ease-in-out;

      &:hover {
        transform: scale(1.7);
        cursor: zoom-in;
      }
    }
  }
`;

const DetailPage: React.FC<DetailPageProps> = ({
  productId,
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
  setLayout,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [product, setProduct] = useState<ProductCardData>({
    images: [],
    name: "",
    description: "",
    price: "",
    id: "",
    category: "",
    discount: "",
    status: "",
    inventory: "",
  });
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
          throw new Error(await response.text());
        }
        const data = await response.json();
        setProduct(data);

        setSelectedImage(data.images[0]?.imageSrc || "");
        setLoading(false);

        // console.log(typeof data.images, data.images);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        Product not found
      </div>
    );
  }
  const sectionData = layout?.sections?.children?.sections?.find((section) => {
    console.log("Comparing:", section.type, actualName);
    return section.type === actualName;
  }) as DetailPageSection;

  console.log("Section Data:", sectionData);
  if (!sectionData) {
    return null;
  }

  return (
    <SectionDetailPage
      $data={sectionData}
      className={` mx-2 rounded-lg px-4 py-8 transition-all duration-150 ease-in-out relative ${
        selectedComponent === actualName
          ? "border-4 border-blue-500 rounded-lg shadow-lg "
          : ""
      }`}
      dir="rtl"
      onClick={() => setSelectedComponent(actualName)}
    >
      {showDeleteModal && (
        <div className="fixed inset-0  bg-black bg-opacity-70 z-50 flex items-center justify-center ">
          <div className="bg-white p-8 rounded-lg">
            <h3 className="text-lg font-bold mb-4">
              آیا از حذف
              <span className="text-blue-400 font-bold mx-1">{actualName}</span>
              مطمئن هستید؟
            </h3>
            <div className="flex gap-4 justify-end flex-row-reverse">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-48">
        {/* Product Images Section */}
        <div className="space-y-4">
          <div className="product-image">
            <Image
              src={selectedImage || "/assets/images/pro1.jpg"}
              alt={product.name}
              width={1000}
              height={1000}
            />
          </div>
          <div className="flex gap-4 overflow-x-auto">
            {Array.isArray(product.images) &&
              product.images.map((image: ProductImage, index: number) => (
                <div
                  key={index}
                  className={`relative h-20 w-20 cursor-pointer rounded-md overflow-hidden ${
                    selectedImage === image.imageSrc
                      ? "border-2 border-blue-500"
                      : ""
                  }`}
                  onClick={() => setSelectedImage(image.imageSrc)}
                >
                  <Image
                    src={image.imageSrc || "/assets/images/pro3.jpg"}
                    alt={image.imageAlt}
                    fill
                    className="object-cover "
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="space-y-6">
          <h1 className="product-name">{product.name}</h1>
          <p className="product-description">{product.description}</p>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="product-price">{product.price} تومان</span>
              {product.discount && (
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full">
                  {product.discount}% تخفیف
                </span>
              )}
            </div>

            <div className="space-y-2">
              {product.status && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold product-status">وضعیت:</span>
                  <span
                    className={`${
                      product.status === "available"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.status === "available" ? "موجود" : "ناموجود"}
                  </span>
                </div>
              )}

              {product.category && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold product-category">
                    دسته‌بندی:
                  </span>
                  <span className="product-category">{product.category}</span>
                </div>
              )}
            </div>
            <div className="flex  gap-2">
              <button className="px-6 py-3 add-to-cart-button rounded-md">
                افزودن به سبد خرید
              </button>
            </div>
          </div>
        </div>
      </div>
    </SectionDetailPage>
  );
};
export default DetailPage;
