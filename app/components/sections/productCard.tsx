import Image from "next/image";
import styled from "styled-components";
import type {
  ProductBlockSetting,
  ProductCard,
  ProductCardData,
} from "@/lib/types";
interface ProductCardProps {
  productData: ProductCardData;
  settings?: ProductBlockSetting;
  previewWidth?: "sm" | "default";
}

const defaultSetting = {
  cardBorderRadius: "0px",
  cardBackground: "#fff",
  nameFontSize: "1.2rem",
  nameFontWeight: "bold",
  nameColor: "#000000",
  descriptionFontSize: "0.9rem",
  descriptionFontWeight: "normal",
  descriptionColor: "#666",
  priceFontSize: "1rem",
  pricecolor: "#000000",
};

const Card = styled.div<{
  $setting?: ProductBlockSetting;
  $previewWidth: "sm" | "default";
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: ${(props) => props.$setting?.cardBorderRadius}px;
  background: ${(props) => props.$setting?.cardBackground};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 380px;
  min-width: 320px;


  margin: ${(props) => (props.$previewWidth === "sm" ? "10px" : "")};
  @media (max-width: 768px) {
    margin: 10px 5px;
    height: 380px;
  }
`;

const ProductImage = styled(Image)<{
  $settings?: ProductBlockSetting;
  $productData?: ProductCardData;
}>`
  object-fit: cover;
  width: 100%;
  max-width: 320px;
  padding: ${(props) => props.$settings?.imagePadding}px;
  height: 200px;
  border-radius: ${(props) => props.$settings?.imageRadius}px;
  transition: all 0.3s ease;
  &:hover {
    opacity: 0.8;
  }
  if (props.$setting?.cardBorderRadius > 0) {
    border-radius-top: ${(props) => props.$settings?.imageRadius}px 0;
  }
`;

const ProductName = styled.h3<{
  $settings?: ProductBlockSetting;
  $productData?: ProductCardData;
}>`
  font-size: ${(props) =>
    props.$settings?.nameFontSize || defaultSetting.nameFontSize}px;
  font-weight: ${(props) =>
    props.$settings?.nameFontWeight || defaultSetting.nameFontWeight};
  color: ${(props) => props.$settings?.nameColor || defaultSetting.nameColor};
  margin: 8px 0;
  text-align: center;
`;

const ProductDescription = styled.p<{
  $settings?: ProductBlockSetting;
  $productData?: ProductCardData;
}>`
  font-size: ${(props) =>
    props.$settings?.descriptionFontSize ||
    defaultSetting.descriptionFontSize}px;
  color: ${(props) =>
    props.$settings?.descriptionColor || defaultSetting.descriptionColor};
  font-weight: ${(props) =>
    props.$settings?.descriptionFontWeight ||
    defaultSetting.descriptionFontWeight};
  text-align: center;
  margin: 8px 0;
`;

const ProductPrice = styled.span<{
  $settings?: ProductBlockSetting;
  $productData?: ProductCardData;
}>`
  font-size: ${(props) =>
    props.$settings?.priceFontSize || defaultSetting.priceFontSize}px;
  color: ${(props) => props.$settings?.priceColor};
  font-weight: 700;
  margin: 8px 0;
`;

const AddToCartButton = styled.button<{
  $settings?: ProductBlockSetting;
  $productData?: ProductCardData;
}>`
  background-color: ${(props) => props.$settings?.cartBakground};
  color: ${(props) => props.$settings?.cartColor};
  border: none;
  padding: 8px 20px;
  border-radius: ${(props) => props.$settings?.cartRadius}px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${(props) => props.$settings?.cartBakground};
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 6px 12px;
    margin-top: 6px;
  }
`;

const ProductCard: React.FC<ProductCardProps> = ({
  productData,
  settings,
  previewWidth = "default",
}) => {
  const currentImageIndex = 0;
  console.log(productData.images);

  const currentImage = (productData.images && productData.images[currentImageIndex]) || {
    imageSrc: "/assets/images/pro2.jpg",
    imageAlt: "Product Image",
  };

  return (
    <Card dir="rtl" $setting={settings} $previewWidth={previewWidth}>
      <ProductImage
        $settings={settings}
        $productData={productData}
        src={currentImage.imageSrc || "/assets/images/pro2.jpg"}
        alt={currentImage.imageAlt || "Product Image"}
        width={2000}
        height={2000}
        className=" "
      />
      <ProductName $settings={settings} $productData={productData}>
        {productData.name}
      </ProductName>
      <ProductDescription $settings={settings} $productData={productData}>
        {productData.description ? productData.description.slice(0, 30) + "..." : "توضیحات محصول"}
      </ProductDescription>
      <ProductPrice $settings={settings} $productData={productData}>
        {productData.price}
      </ProductPrice>
      <AddToCartButton $settings={settings} $productData={productData}>
        افزودن به سبد خرید
      </AddToCartButton>
    </Card>
  );
};
export default ProductCard;
