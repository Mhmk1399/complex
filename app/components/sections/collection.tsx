import { CollectionBlockSetting, CollectionSection, Layout } from "@/lib/types";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Delete } from "../C-D";

interface CollectionProps {
  productId: string;
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
}
interface ProductData {
  id: string;
  name: string;
  price: number;
  imageSrc: string;
  imageAlt: string;
  btnText: string;
}

const CollectionWrapper = styled.div<{ $setting: CollectionBlockSetting }>`
  padding: ${(props) => props.$setting?.paddingTop}px
    ${(props) => props.$setting?.paddingBottom}px;
  margin: ${(props) => props.$setting?.marginTop}px
    ${(props) => props.$setting?.marginBottom}px;
  background-color: ${(props) => props.$setting?.backgroundColor};
`;

const ProductGrid = styled.div<{ $setting: CollectionBlockSetting }>`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding: 20px;
`;

const ProductCard = styled.div<{
  $setting: CollectionBlockSetting;
  $isLarge?: boolean;
}>`
  background: ${(props) => props.$setting.cardBackground};
  border-radius: ${(props) => props.$setting.cardBorderRadius};
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: ${(props) =>
    props.$isLarge ? "calc(50% - 12px)" : "calc(25% - 12px)"};
`;

const ProductImage = styled.img<{ $setting: CollectionBlockSetting }>`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: ${(props) => props.$setting.imageRadius};
`;

const ProductInfo = styled.div`
  padding: 16px;
`;

const ProductName = styled.h3<{ $setting: CollectionBlockSetting }>`
  color: ${(props) => props.$setting.productNameColor};
`;

const ProductPrice = styled.div<{ $setting: CollectionBlockSetting }>`
  color: ${(props) => props.$setting.priceColor};
  font-size: 16px;
  margin: 8px 0;
`;

const BuyButton = styled.button<{ $setting: CollectionBlockSetting }>`
  background: ${(props) => props.$setting.btnBackgroundColor};
  color: ${(props) => props.$setting.btnTextColor};
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;

  &:hover {
    opacity: 0.9;
  }
`;

export const Collection: React.FC<CollectionProps> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
  setLayout,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [products, setProducts] = useState<ProductData[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/collection", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (data?.products) {
          const formattedProducts = data.products.map((product:{}) => ({
            id: product._id,
            name: product.name,
            price: product.price,
            imageSrc: product.images?.imageSrc || "/assets/images/pro2.jpg",
            imageAlt: product.images?.imageAlt || product.name,
            btnText: "خرید محصول",
          }));

          setProducts(formattedProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const sectionData = layout?.sections?.children?.sections?.find(
    (section) => section.type === actualName
  ) as CollectionSection;

  console.log(sectionData);

  return (
    <CollectionWrapper
      $setting={sectionData}
      onClick={() => {
        setSelectedComponent(actualName);
      }}
      className={`transition-all duration-150 ease-in-out relative ${
        selectedComponent === actualName
          ? "border-4 border-blue-500 rounded-2xl shadow-lg "
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
        <div className="absolute w-fit -top-5 -left-1 z-10 flex ">
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

      <ProductGrid $setting={sectionData}>
        {products.slice(0, 3).map((product, index) => (
          <ProductCard
            key={product.id}
            $setting={sectionData}
            $isLarge={index === 0}
            style={
              index === 0 ? { height: "100%" } : { height: "calc(50% - 12px)" }
            }
          >
            <ProductImage
              src={product.imageSrc}
              alt={product.imageAlt}
              $setting={sectionData}
            />
            <ProductInfo>
              <ProductName $setting={sectionData}>{product.name}</ProductName>
              <ProductPrice $setting={sectionData}>
                {product.price}
              </ProductPrice>
              <BuyButton $setting={sectionData}>{product.btnText}</BuyButton>
            </ProductInfo>
          </ProductCard>
        ))}
      </ProductGrid>
    </CollectionWrapper>
  );
};
