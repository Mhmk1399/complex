"use client";
import styled from "styled-components";
import { Delete } from "../C-D";
import Image from "next/image";
import Link from "next/link";
import {
  ProductSection,
  Layout,
  ProductBlockSetting,
  ShopOverviewBlock,
} from "@/lib/types"; // Adjust the import path to match your project structure
import { data } from "framer-motion/client";

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
  gap: 20px;
  padding-top: ${(props) => props.$data?.setting?.paddingTop}px;
  padding-bottom: ${(props) => props.$data?.setting?.paddingBottom}px;
  margin-top: ${(props) => props.$data?.setting?.marginTop}px;
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom}px;
  background-color: ${(props) => props.$data?.setting?.backgroundColor};
`;

const ProductCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 8px;
  background: #fff;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ProductImage = styled(Image)`
  object-fit: cover;
  width: 100%;
  height: 200px;
`;

const ProductName = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  color: #000000;
  margin: 8px 0;
`;

const ProductDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  text-align: center;
  margin: 8px 0;
`;

const ProductPrice = styled.span`
  font-size: 1rem;
  font-weight: bold;
  color: #000000;
  margin: 8px 0;
`;

const ProductButton = styled(Link)`
  display: inline-block;
  padding: 10px 20px;
  background-color: #e5e5e5;
  color: #000000;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: bold;
  margin-top: 12px;
  text-align: center;
`;

const ProductList: React.FC<ProductListProps> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
  setLayout,
}) => {
  const sectionData = layout.sections?.children?.sections.find(
    (section) => section.type === actualName
  ) as ProductSection;

  if (!sectionData) {
    return 13333;
  }

  console.log(sectionData.blocks);
  

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

      {blocks.map((product, index: number) => (
        <ProductCard key={index}>
          <ProductImage
            src={product.imageSrc}
            alt={product.imageAlt}
            width={1000}
            height={1000}
          />
          <ProductName>{product.name}</ProductName>
          <ProductDescription>{product.description}</ProductDescription>
          <ProductPrice>{product.price}</ProductPrice>
          <ProductButton href={product.btnLink}>
            {product.btnText}
          </ProductButton>
        </ProductCard>
      ))}
    </SectionProductList>
  );
};

export default ProductList;
