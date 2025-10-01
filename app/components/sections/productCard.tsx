import Image from "next/image";
import styled from "styled-components";
import type { ProductCard, ProductCardData } from "@/lib/types";
interface ProductCardProps {
  productData: ProductCardData;
}


const defaultSetting = {
  cardBorderRadius: "10px",
  cardBackground: "#fff",
  imageWidth: "100%",
  imageheight: "200px",
  imageRadius: "8px",
  nameFontSize: "1.2rem",
  nameFontWeight: "bold",
  nameColor: "#000000",
  descriptionFontSize: "0.9rem",
  descriptionFontWeight: "normal",
  descriptionColor: "#666",
  priceFontSize: "1rem",
  pricecolor: "#000000",
  btnBackgroundColor: "#e5e5e5",
  btnColor: "#000000",
};

const Card = styled.div<{
  $setting?: ProductCard;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: ${(props) =>
    props.$setting?.cardBorderRadius || defaultSetting.cardBorderRadius};
  background: ${(props) =>
    props.$setting?.cardBackground || defaultSetting.cardBackground};
  margin: 10px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 340px;
  min-width: 250px;
  @media (max-width: 425px) {
    margin: 10px 5px;
    height: 320px;
  }
`;

const ProductImage = styled(Image)<{
  $settings?: ProductCard;
  $productData?: ProductCardData;
}>`
  object-fit: cover;
  width: ${(props) => props.$settings?.imageWidth || defaultSetting.imageWidth};
  height: ${(props) =>
    props.$settings?.imageHeight || defaultSetting.imageheight};
  border-radius: ${(props) =>
    props.$settings?.imageRadius || defaultSetting.imageRadius};
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.03);
  }
`;

const ProductName = styled.h3<{
  $settings?: ProductCard;
  $productData?: ProductCardData;
}>`
  font-size: ${(props) =>
    props.$settings?.nameFontSize || defaultSetting.nameFontSize};
  font-weight: ${(props) =>
    props.$settings?.nameFontWeight || defaultSetting.nameFontWeight};
  color: ${(props) => props.$settings?.nameColor || defaultSetting.nameColor};
  margin: 8px 0;
  text-align: center;
`;

const ProductDescription = styled.p<{
  $settings?: ProductCard;
  $productData?: ProductCardData;
}>`
  font-size: ${(props) =>
    props.$settings?.descriptionFontSize || defaultSetting.descriptionFontSize};
  color: ${(props) =>
    props.$settings?.descriptionColor || defaultSetting.descriptionColor};
  font-weight: ${(props) =>
    props.$settings?.descriptionFontWeight ||
    defaultSetting.descriptionFontWeight};
  text-align: center;
  margin: 8px 0;
`;

const ProductPrice = styled.span<{
  $settings?: ProductCard;
  $productData?: ProductCardData;
}>`
  font-size: ${(props) =>
    props.$settings?.priceFontSize || defaultSetting.priceFontSize};
  font-weight: ${(props) =>
    props.$settings?.priceColor || defaultSetting.pricecolor};
  margin: 8px 0;
`;

const ProductCard: React.FC<ProductCardProps> = ({ productData }) => {
  const currentImageIndex = 0;
  console.log(productData.images);

  const currentImage = productData.images[currentImageIndex] || {
    imageSrc: "",
    imageAlt: "",
  };

  return (
    <Card dir="rtl">
      <ProductImage
        $productData={productData}
        src={currentImage.imageSrc || "/assets/images/pro2.jpg"}
        alt={currentImage.imageAlt || "Product Image"}
        width={2000}
        height={2000}
      />
      <ProductName $productData={productData}>{productData.name}</ProductName>
      <ProductDescription $productData={productData}>
        {productData.description.slice(0, 30)}...
      </ProductDescription>
      <ProductPrice $productData={productData}>
        {productData.price}
      </ProductPrice>
    </Card>
  );
};
export default ProductCard;
