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
  previewWidth: "sm" | "default";
}
const defaultProperties = [
  { key: "نوع اتصال", value: "بی‌سیم", tooltip: "بی‌سیم " },
  { key: "نوع گوشی", value: "دو گوشی", tooltip: "دو گوشی" },
  { key: "قابلیت‌های ویژه", value: "میکروفون", tooltip: "میکروفون" },
  { key: "مناسب برای", value: "بازی، مکالمه", tooltip: "بازی، مکالمه" },
  { key: "رابط", value: "بلوتوث", tooltip: "بلوتوث" },
];
const SectionDetailPage = styled.div<{
  $data: DetailPageSection;
  $preview: "sm" | "default";
}>`
  padding-top: ${(props) => props.$data?.setting?.paddingTop || 0}px;
  padding-bottom: ${(props) => props.$data?.setting?.paddingBottom || 0}px;
  padding-left: ${(props) => props.$data?.setting?.paddingLeft || 20}px;
  padding-right: ${(props) => props.$data?.setting?.paddingRight || 20}px;
  margin-top: ${(props) => props.$data?.setting?.marginTop || 0}px;
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom || 0}px;
  background-color: ${(props) =>
    props.$data?.setting?.backgroundColor || "#ffffff"};
  height: ${(props) => (props.$preview === "sm" ? "50rem" : "full")};

  .product-name {
    color: ${(props) => props.$data?.setting?.productNameColor || "#000000"};
    font-size: ${(props) => props.$data?.setting?.productNameFontSize || 20}px;
    font-weight: ${(props) =>
      props.$data?.setting?.productNameFontWeight || "bold"};
  }
  .product-category {
    color: ${(props) => props.$data?.setting?.categoryColor || "#000000"};
    font-size: ${(props) => props.$data?.setting?.categoryFontSize || 20}px;
  }

  .product-price {
    color: ${(props) => props.$data?.setting?.priceColor || "#000000"};
    font-size: ${(props) => props.$data?.setting?.priceFontSize || 12}px;
    @media (max-width: 768px) {
      font-size: 30px;
    }
  }

  .product-description {
    color: ${(props) => props.$data?.setting?.descriptionColor || "#000000"};
    font-size: ${(props) => props.$data?.setting?.descriptionFontSize || 16}px;
    @media (max-width: 768px) {
      font-size: 20px;
    }
  }
  .product-status {
    color: ${(props) => props.$data?.setting?.statusColor || "#000000"};
    font-size: ${(props) => props.$data?.setting?.statusFontSize || 10}px;
    @media (max-width: 768px) {
      font-size: 20px;
    }
  }

  .add-to-cart-button {
    background-color: ${(props) =>
      props.$data?.setting?.btnBackgroundColor || "#3498DB"};
    color: ${(props) => props.$data?.setting?.btnTextColor || "#000000"};
    transition: transform 0.5s ease;
    &:hover {
      transform: translateY(-2px);
      opacity: 0.85;
      transition: transform 0.3s ease-in-out;
    }
  }
  .bg-box {
    background-color: ${(props) =>
      props.$data?.setting?.backgroundColorBox || "#ffffff"};
    border-radius: ${(props) => props.$data?.setting?.boxRadius || 10}px;
  }
  .property-key {
    color: ${(props) => props.$data?.setting?.propertyKeyColor || "#e4e4e4"};
  }
  .property-value {
    color: ${(props) => props.$data?.setting?.propertyValueColor || "#000000"};
  }
  .property-bg {
    background-color: ${(props) =>
      props.$data?.setting?.propertyBg || "#ffffff"};
  }

  .product-image {
    width: ${(props) => props.$data?.setting?.imageWidth || 300}px;
    height: ${(props) => props.$data?.setting?.imageHeight || 200}px;
    border-radius: ${(props) => props.$data?.setting?.imageRadius || 10}px;
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
  previewWidth,
}) => {
  const [preview, setPreview] = useState(previewWidth);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (window.innerWidth <= 425) {
      setPreview("sm");
    } else {
      setPreview(previewWidth);
    }
  }, [previewWidth]);
  const [product, setProduct] = useState<ProductCardData>({
    images: [],
    name: "",
    description: "",
    price: "80,000",
    id: "",
    category: { name: "headphone", _id: "1" },
    discount: "20",
    status: "eded",
    inventory: "",
    colors: [],
    properties: "",
    createdAt: "",
    updatedAt: "",
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
      } catch (error) {
        setLoading(false);
        console.log("Error fetching product details:", error);
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
  const sectionData = (layout?.sections?.children?.sections?.find((section) => {
    return section.type === actualName;
  }) as DetailPageSection) || {
    blocks: {},
    setting: {}, // Provide default empty settings
    type: "DetailPage",
  };

  if (!sectionData) {
    return null;
  }

  return (
    <SectionDetailPage
      $preview={preview}
      $data={sectionData}
      className={` mx-2 rounded-lg px-4 min-h-fit py-8 transition-all duration-150 ease-in-out relative ${
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-2">
        {/* Product Images Section */}
        <div className="space-y-4 z-50">
          <div className="product-image">
            <Image
              src={selectedImage || "/assets/images/pro2.jpg"}
              alt={product.name}
              width={1000}
              height={1000}
              className="transition-transform duration-300 ease-in-out hover:scale-150"
            />
          </div>

          <div className="relative">
            <div
              className={`flex gap-3 py-2  ${
                preview === "sm" ? "min-w-full" : " overflow-x-auto"
              }`}
            >
              {Array.isArray(product.images) && product.images.length > 0
                ? product.images.map((image: ProductImage, index: number) => (
                    <div
                      key={index}
                      className={`relative min-w-[80px] h-[80px] cursor-pointer 
              transition-all duration-300 ease-in-out hover:shadow-lg 
              ${
                selectedImage === image.imageSrc
                  ? "border-2 border-blue-500 scale-105"
                  : "border border-gray-200"
              }
              rounded-lg overflow-hidden`}
                      onClick={() => setSelectedImage(image.imageSrc)}
                    >
                      <Image
                        src={image.imageSrc}
                        alt={image.imageAlt}
                        fill
                        className="object-cover hover:opacity-90"
                      />
                    </div>
                  ))
                : // Default static images
                  [
                    "/assets/images/pro1.jpg",
                    "/assets/images/pro2.jpg",
                    "/assets/images/pro3.jpg",
                  ].map((defaultImage, index) => (
                    <div
                      key={index}
                      className={`relative min-w-[120px] h-[80px] cursor-pointer 
              transition-all duration-300 ease-in-out hover:shadow-lg
              ${
                selectedImage === defaultImage
                  ? "border-2 border-blue-500 scale-105"
                  : "border border-gray-200"
              }
              rounded-lg overflow-hidden`}
                      onClick={() => setSelectedImage(defaultImage)}
                    >
                      <Image
                        src={defaultImage}
                        alt={`Default product image ${index + 1}`}
                        fill
                        className="object-cover hover:opacity-90"
                      />
                    </div>
                  ))}
            </div>
          </div>
        </div>

        {/* Product Info Section */}
        <div
          className={`space-y-8 lg:-mr-64 ${
            preview === "sm" ? "mt-96 pr-16" : ""
          }`}
        >
          <h1 className="product-name">{product.name || "نام محصول"}</h1>
          <p className="product-description text-wrap">
            {product.description ||
              "توضیحات محصول در ابن قسمت نمایش داده می شود."}
          </p>
          <div className="border border-gray-300 max-w-sm rounded-lg p-4 ">
            <div className="text-sm font-bold mb-3">ویژگی‌های محصول</div>
            <div className=" flex flex-wrap gap-2">
              {(Array.isArray(product.properties) &&
              product.properties.length > 0
                ? product.properties
                : defaultProperties
              ).map((prop, index) => (
                <div
                  key={index}
                  className="flex flex-col p-2 rounded-lg group relative property-bg"
                >
                  <span className="text-gray-500 text-sm ml-2 property-key">
                    {prop.key}:
                  </span>
                  <span className="text-sm property-value">{prop.value}</span>
                  <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 -top-8 right-0 whitespace-nowrap">
                    {prop.tooltip}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={` ${
              preview === "sm"
                ? "   "
                : "lg:absolute lg:left-8 lg:-top-2 lg:w-[300px]"
            } `}
          >
            <div className="bg-white bg-box rounded-xl shadow-lg p-6 space-y-3">
              {/* Price and Discount Section */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="product-price text-xl font-bold">
                    {product.price || "80,000"} تومان
                  </span>
                  {product.discount && (
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
                      {product.discount}% تخفیف
                    </span>
                  )}
                </div>
                {product.discount && (
                  <span className="text-red-300 line-through text-sm">
                    {(
                      Number(product.price?.replace(/,/g, "")) /
                      (1 - Number(product.discount) / 100)
                    ).toLocaleString()}{" "}
                    تومان
                  </span>
                )}
              </div>

              {/* Delivery Info */}
              <div className="space-y-3 border-t border-b py-4">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm">ارسال سریع</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm">تحویل در سریع‌ترین زمان ممکن</span>
                </div>
              </div>

              {/* Inventory Status */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    product.inventory && Number(product.inventory) > 0
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm">
                  {product.inventory && Number(product.inventory) > 0
                    ? "موجود در انبار"
                    : "ناموجود"}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full px-6 py-3 add-to-cart-button rounded-lg font-medium">
                  افزودن به سبد خرید
                </button>
              </div>

              {/* Additional Product Info */}
              <div className="text-sm space-y-2 text-gray-600">
                <div className="flex product-category justify-between">
                  <span>کد محصول:</span>
                  <span>{product.id || "N/A"}</span>
                </div>
                <div className="flex product-category justify-between">
                  <span>دسته‌بندی:</span>
                  <span>{product.category?.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionDetailPage>
  );
};
export default DetailPage;
