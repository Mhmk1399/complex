"use client";
import styled from "styled-components";
import {
  ProductSection,
  Layout,
  ProductCardData,
  ProductCardSetting,
} from "@/lib/types";
import ProductCard from "./productCard";
import { useEffect, useState } from "react";

interface ProductListProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
}
const defaultProduct: ProductCardData = {
  images: [{ imageSrc: "/assets/images/pro2.jpg", imageAlt: "Default Image" }],
  name: "محصول پیش‌فرض",
  description: "توضیحات پیش‌فرض محصول",
  price: "0",
  id: "0",
};

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
  const [setting, setSetting] = useState<ProductCardSetting>({});
  const [productData, setProductData] = useState<ProductCardData[]>([]);

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
          setProductData(productInfo);
          setSetting(data.products[5]?.setting || {});
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
      {blocks.map((block) => {
        const product =
          productData.find((p) => p.id === block.productId?.toString()) ||
          defaultProduct;
        return (
          <div className="p-0 m-0" key={block.productId}>
            <ProductCard setting={setting} productData={product} />
          </div>
        );
      })}
    </SectionProductList>
  );
};

export default ProductList;
