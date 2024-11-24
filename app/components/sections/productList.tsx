"use client";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";

interface Product {
  productId: number;
  imageSrc: string;
  imageAlt: string;
  name: string;
  description: string;
  price: string;
  btnText: string;
  btnLink: string;
}

interface ProductListProps {
  productList: {
    blocks: Product[];
    setting: {
      gridColumns: number;
      imageRadius: string;
      productNameColor: string;
      priceColor: string;
      btnBackgroundColor: string;
      btnTextColor: string;
      paddingTop: string;
      paddingBottom: string;
      marginTop: string;
      marginBottom: string;
      backgroundColor: string;
    };
  };
}

const SectionProductList = styled.section<{ settings: any }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.settings.gridColumns}, 1fr);
  gap: 20px;
  padding: ${(props) => props.settings.paddingTop}px
    ${(props) => props.settings.paddingBottom}px;
  margin: ${(props) => props.settings.marginTop}px
    ${(props) => props.settings.marginBottom}px;
  background-color: ${(props) => props.settings.backgroundColor};
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

const ProductImage = styled(Image)<{ radius: string }>`
  border-radius: ${(props) => props.radius};
  object-fit: cover;
  width: 100%;
  height: 200px;
`;

const ProductName = styled.h3<{ color: string }>`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${(props) => props.color};
  margin: 8px 0;
`;

const ProductDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  text-align: center;
  margin: 8px 0;
`;

const ProductPrice = styled.span<{ color: string }>`
  font-size: 1rem;
  font-weight: bold;
  color: ${(props) => props.color};
  margin: 8px 0;
`;

const ProductButton = styled(Link)<{ bgColor: string; textColor: string }>`
  display: inline-block;
  padding: 10px 20px;
  background-color: ${(props) => props.bgColor};
  color: ${(props) => props.textColor};
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: bold;
  margin-top: 12px;
  text-align: center;
`;

const ProductList: React.FC<ProductListProps> = ({ productList }) => {
  const { blocks, setting } = productList;

  return (
    <SectionProductList settings={setting}>
      {blocks.map((product) => (
        <ProductCard key={product.productId}>
          <ProductImage
            src={product.imageSrc}
            alt={product.imageAlt}
            width={300}
            height={200}
            radius={setting.imageRadius}
          />
          <ProductName color={setting.productNameColor}>
            {product.name}
          </ProductName>
          <ProductDescription>{product.description}</ProductDescription>
          <ProductPrice color={setting.priceColor}>{product.price}</ProductPrice>
          <ProductButton
            href={product.btnLink}
            bgColor={setting.btnBackgroundColor}
            textColor={setting.btnTextColor}
          >
            {product.btnText}
          </ProductButton>
        </ProductCard>
      ))}
    </SectionProductList>
  );
};

export default ProductList;
