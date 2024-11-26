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

// const ProductContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   border-radius: 10px;
//   background: #fff;
//   margin: 10px 15px;
//   padding: 10px;
//   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
//   @media (max-width: 425px) {
//     margin: 10px 5px;
//     height: 350px;
//   }
// `;

// const ProductImage = styled(Image)`
//   object-fit: cover;
//   width: 100%;
//   height: 200px;
// `;

// const ProductName = styled.h3`
//   font-size: 1.2rem;
//   font-weight: bold;
//   color: #000000;
//   margin: 8px 0;
// `;

// const ProductDescription = styled.p`
//   font-size: 0.9rem;
//   color: #666;
//   text-align: center;
//   margin: 8px 0;
// `;

// const ProductPrice = styled.span`
//   font-size: 1rem;
//   font-weight: bold;
//   margin: 8px 0;
// `;

// const ProductButton = styled(Link)`
//   display: inline-block;
//   padding: 10px 20px;
//   background-color: #e5e5e5;
//   color: #000000;
//   border-radius: 4px;
//   text-decoration: none;
//   font-size: 0.9rem;
//   font-weight: bold;
//   margin-top: 12px;
//   text-align: center;
// `;

const ProductList: React.FC<ProductListProps> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
  setLayout,
}) => {
  const [styles, setStyles] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setStyles(data);
        console.log(styles);
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
        <ProductCard
          product={product}
          key={blocks.indexOf(product)}
          styles={styles}
        />
        // <ProductContainer key={blocks.indexOf(product)}>
        //   <ProductImage
        //     src={product.imageSrc || "/assets/images/banner.jpg"}
        //     alt={product.imageAlt}
        //     width={1000}
        //     height={1000}
        //   />
        //   <ProductName>{product.name || "title"}</ProductName>
        //   <ProductDescription>
        //     {product.description || "description"}
        //   </ProductDescription>
        //   <ProductPrice>{product.price || "20.000$"}</ProductPrice>
        //   <ProductButton href={product.btnLink}>
        //     {product.btnText || "Buy Now"}
        //   </ProductButton>
        // </ProductContainer>
      ))}
    </SectionProductList>
  );
};
export default ProductList;
