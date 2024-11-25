"use client";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import { ProductSection, Layout , ProductBlockSetting } from "@/lib/types"; // Adjust the import path to match your project structure

interface ProductListProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
}

const SectionProductList = styled.section<{
  $data: ProductSection["setting"];
}>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$data.gridColumns}, 1fr);
  gap: 20px;
  padding-top: ${(props) => props.$data?.paddingTop}px;
  padding-bottom: ${(props) => props.$data?.paddingBottom}px;
  margin-top: ${(props) => props.$data?.marginTop}px;
  margin-bottom: ${(props) => props.$data?.marginBottom}px;
  background-color: ${(props) => props.$data?.backgroundColor};
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

const ProductImage = styled(Image)<{ $data: ProductBlockSetting }>`
  border-radius: ${(props) => props.$data.imageRadious};
  object-fit: cover;
  width: 100%;
  height: 200px;
`;

const ProductName = styled.h3<{ $color: string }>`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${(props) => props.$color};
  margin: 8px 0;
`;

const ProductDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  text-align: center;
  margin: 8px 0;
`;

const ProductPrice = styled.span<{ $color: string }>`
  font-size: 1rem;
  font-weight: bold;
  color: ${(props) => props.$color};
  margin: 8px 0;
`;

const ProductButton = styled(Link)<{ $bgColor: string; $textColor: string }>`
  display: inline-block;
  padding: 10px 20px;
  background-color: ${(props) => props.$bgColor};
  color: ${(props) => props.$textColor};
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
    return 1;
  }
  console.log(sectionData);
  console.log(sectionData.blocks);
  const { blocks, setting } = sectionData;

  return (
    <SectionProductList
      $data={setting}
      onClick={() => setSelectedComponent(actualName)}
    >
      {blocks.map((product, index: number) => (
        <ProductCard key={index}>
          <ProductImage
            src={product.imageSrc}
            alt={product.imageAlt}
            width={300}
            height={200}
            $radius={setting.imageRadius}
          />
          <ProductName $color={setting.productNameColor}>
            {product.name}
          </ProductName>
          <ProductDescription>{product.description}</ProductDescription>
          <ProductPrice $color={setting.priceColor}>
            {product.price}
          </ProductPrice>
          <ProductButton
            href={product.btnLink}
            $bgColor={setting.btnBackgroundColor}
            $textColor={setting.btnTextColor}
          >
            {product.btnText}
          </ProductButton>
        </ProductCard>
      ))}
    </SectionProductList>
  );
};

export default ProductList;
