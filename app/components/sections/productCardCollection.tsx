import Image from "next/image";
import styled from "styled-components";
import {
  ProductCardSetting,
  ProductCardData,
  ProductBlockSetting,
} from "@/lib/types";

interface ProductCardProps {
  productData: ProductCardData;
  settings?: ProductBlockSetting;
  previewWidth?: "sm" | "default";
}

const Card = styled.div<{
  $setting?: ProductCardSetting;
  $previewWidth?: "sm" | "default";
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  height: 350px;
  border-radius: 5px;
  width: ${(props) => (props.$previewWidth === "sm" ? "250px" : "100%")};
  max-width: 300px;
  min-width: ${(props) => (props.$previewWidth === "sm" ? "250px" : "auto")};
  flex-shrink: 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 426px) {
    padding: 0.5rem;
    height: 350px;
  }
`;

const ProductImage = styled(Image)<{
  $settings?: ProductCardSetting;
  $productData?: ProductCardData;
}>`
  object-fit: cover;
  width: 100%;
  height: 200px;
  border-radius: 5px;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 426px) {
    height: 160px;
    aspect-ratio: 1;
  }
`;

const ProductName = styled.h3<{
  $settings?: ProductCardSetting;
  $productData?: ProductCardData;
}>`
  font-size: 18px;
  font-weight: 600;
  color: black;
  margin: 6px 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin: 8px 0 6px;
  }
`;

const ProductDescription = styled.p<{
  $settings?: ProductCardSetting;
  $productData?: ProductCardData;
}>`
  font-size: 14px;
  color: ${(props) => props.$settings?.descriptionColor};
  font-weight: ${(props) => props.$settings?.descriptionFontWeight};
  text-align: center;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  @media (max-width: 768px) {
    font-size: 0.85rem;
    margin: 6px 0 12px;
    -webkit-line-clamp: 1;
  }
`;

const ProductPrice = styled.span<{
  $settings?: ProductBlockSetting;
  $productData?: ProductCardData;
}>`
  font-size: 12px;
  color: black;
  font-weight: 700;
  margin: 6px 0;
  text-align: center;
`;

const AddToCartButton = styled.button<{
  $settings?: ProductBlockSetting;
  $productData?: ProductCardData;
}>`
  background-color: white;
  color: ${(props) => props.$settings?.cartColor};
  border: none;
  padding: 8px 20px;
  border-radius: ${(props) => props.$settings?.cartRadius}px;
  font-size: 0.9rem;
  border-bottom: 1px solid black;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 6px 12px;
    margin-top: 6px;
  }
`;

const ProductCardCollection: React.FC<ProductCardProps> = ({
  productData,
  settings,
  previewWidth = "default",
}) => {
  // Early return if productData is null or undefined
  if (!productData) {
    console.log("ProductCard: productData is null or undefined");
    return null;
  }

  try {
    // Use actual product image or fallback
    // const imageSrc =
    //   productData?.images?.[0]?.imageSrc || "/assets/images/pro2.jpg";
    const currentImage = {
      imageSrc: productData?.images?.[0]?.imageSrc || "/assets/images/pro2.jpg",
      imageAlt:
        productData?.images?.[0]?.imageAlt ||
        productData?.name ||
        "Product Image",
    };

    // Handle products from collections
    const safeProductData = {
      ...productData,
      images: productData?.images || [currentImage],
    };

    // Use _id or id, whichever is available

    return (
      <Card $setting={settings} $previewWidth={previewWidth} dir="rtl">
        <ProductImage
          $settings={settings}
          $productData={safeProductData}
          src={currentImage.imageSrc}
          alt={currentImage.imageAlt}
          width={2000}
          height={1000}
        />

        <ProductName $settings={settings} $productData={productData}>
          {safeProductData.name || "Unnamed Product"}
        </ProductName>
        <ProductDescription $settings={settings} $productData={productData}>
          {productData?.description
            ? productData.description.slice(0, 30) + "..."
            : "توضیحات موجود نیست"}
        </ProductDescription>

        <ProductPrice $settings={settings} $productData={productData}>
          {productData?.price
            ? Number(productData.price).toLocaleString("fa-IR")
            : "قیمت مشخص نشده"}{" "}
          تومان
        </ProductPrice>
        <AddToCartButton $settings={settings} $productData={productData}>
          افزودن به سبد خرید
        </AddToCartButton>
      </Card>
    );
  } catch (error) {
    console.log("ProductCard error:", error, "productData:", productData);
    return <div>خطا در دریافت</div>;
  }
};

export default ProductCardCollection;
