"use client";
import styled from "styled-components";
import { Delete } from "../C-D";
import { ProductSection, Layout } from "@/lib/types";
import ProductCard from "./productCard";
import { useEffect, useState } from "react";

interface ProductListProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
}

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
  const [setting, setSetting] = useState({});
  const [productData, setProductData] = useState({});
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        console.log(data, "data");

        if (data?.products?.[4]) {
          setSetting(data.products[4].setting);
          const productInfo = data.products[4];
          setProductData(productInfo);
          console.log(productInfo, "productInfo");
        }
      } catch (error) {
        console.log("Error fetching products:", error);
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

  const { blocks } = sectionData;

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
      {actualName === selectedComponent ? (
        <div className="absolute w-fit -top-5 -left-1 z-10 flex justify-center items-center">
          <div className=" bg-blue-500 py-1 px-4 rounded-lg text-white ">
            {actualName}
          </div>
          <button
            className="text-red-600 font-extrabold text-xl hover:bg-red-100 bg-slate-100 pb-1 mx-1 items-center justify-items-center content-center rounded-full px-3 "
            onClick={() => Delete(actualName, layout, setLayout)}
          >
            x
          </button>
        </div>
      ) : null}

      {blocks.map((product) => (
        <div className="p-0 m-0" key={product.productId}>
          <ProductCard setting={setting} productData={productData} />
        </div>
      ))}
    </SectionProductList>
  );
};
export default ProductList;
