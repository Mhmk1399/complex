"use client";
import styled from "styled-components";
import { Delete } from "../C-D";
import { ProductSection, Layout, ProductCardData } from "@/lib/types";
import ProductCard from "./productCard";
import { useEffect, useState } from "react";

interface ProductListProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
}
// const defaultProduct: ProductCardData = {
//   images: [{ imageSrc: "/assets/images/pro2.jpg", imageAlt: "Default Image" }],
//   name: "محصول پیش‌فرض",
//   description: "توضیحات پیش‌فرض محصول",
//   price: "0",
//   id: "0",
// };

const SectionProductList = styled.section<{
  $data: ProductSection;
}>`
  display: grid;
  grid-template-columns: repeat(
    ${(props) => props.$data.setting?.gridColumns},
    1fr
  );
  gap: 8px;
  padding-top: ${(props) => props.$data?.setting?.paddingTop}px;
  padding-bottom: ${(props) => props.$data?.setting?.paddingBottom}px;
  padding-left: ${(props) => props.$data?.setting?.paddingLeft}px;
  padding-right: ${(props) => props.$data?.setting?.paddingRight}px;
  margin-top: ${(props) => props.$data?.setting?.marginTop}px;
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom}px;
  background-color: ${(props) => props.$data?.setting?.backgroundColor};
  @media (max-width: 425px) {
    grid-template-columns: repeat(1, 2fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 2fr);
  }
`;

const ProductList: React.FC<ProductListProps> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
  setLayout,
}) => {
  const [productData, setProductData] = useState<ProductCardData[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (data?.products) {
          const productInfo = data.products.map((product: any) => ({
            ...product,
            images: product.images || [],
          }));
          console.log(productInfo);

          setProductData(productInfo);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const sectionData = layout?.sections?.children?.sections.find(
    (section) => section.type === actualName
  ) as ProductSection;

  if (!sectionData) {
    return null;
  }

  return (
    <SectionProductList
      $data={sectionData}
      onClick={() => setSelectedComponent(actualName)}
      className={`transition-all duration-150 ease-in-out relative ${
        selectedComponent === actualName
          ? "border-4 border-blue-500 rounded-lg shadow-lg "
          : ""
      }`}
    >
      {showDeleteModal && (
        <div className="fixed inset-0  bg-black bg-opacity-70 z-50 flex items-center justify-center ">
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
      ) : null}
      {productData.map((block, index) => (
        <div className="p-0 m-0" key={`${block.id}-${index}`}>
          <ProductCard productData={block} />
        </div>
      ))}
    </SectionProductList>
  );
};

export default ProductList;
