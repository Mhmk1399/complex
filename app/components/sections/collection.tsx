import { CollectionBlockSetting, CollectionSection, Layout } from "@/lib/types";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Delete } from "../C-D";
import Link from "next/link";
interface CollectionData {
  _id: string;
  name: string;
  products: Array<{
    _id: string;
    name: string;
    price: number;
    images?: {
      imageSrc: string;
      imageAlt: string;
    };
  }>;
}

interface CollectionProps {
  productId: string;
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
  previewWidth: "sm" | "default";
}
interface ProductData {
  _id: string;
  name: string;
  price: number;
  images?: {
    imageSrc: string;
    imageAlt: string;
  };
  btnText: string;
}

const CollectionWrapper = styled.div<{
  $setting: CollectionBlockSetting;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  padding: ${(props) => props.$setting?.paddingTop}px;
  background-color: ${(props) => props.$setting?.backgroundColor};
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(8px);
  margin: 20px;
  transition: all 0.4s ease-in-out;
`;
const Heading = styled.h2<{ $setting: CollectionBlockSetting }>`
  color: ${(props) => props.$setting?.headingColor};
  font-size: ${(props) => props.$setting?.headingFontSize}px;
  font-weight: ${(props) => props.$setting?.headingFontWeight};
  text-align: center;
`;

const ProductGrid = styled.div<{
  $setting: CollectionBlockSetting;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  display: grid;
  grid-template-columns: repeat(
    ${(props) => (props.$preview === "sm" ? "1" : "3")},
    1fr
  );
  gap: 10px;
  padding: 10px;
`;

const ProductCard = styled.div<{
  $setting: CollectionBlockSetting;
  $isLarge?: boolean;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  position: relative;
  border-radius: ${(props) => props.$setting?.imageRadius}px;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    img {
      transform: scale(1.05);
    }

    .product-info {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ProductImage = styled.img<{ $setting: CollectionBlockSetting }>`
  width: 100%;
  height: 350px;
  object-fit: cover;
  transition: transform 0.5s ease;
  border-radius: ${(props) => props.$setting?.imageRadius}px;
`;

const ProductInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 25px;
  &:hover {
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.7) 0%,
      rgba(0, 0, 0, 0.4) 50%,
      rgba(0, 0, 0, 0) 100%
    );
  }
  transform: translateY(20%);
  opacity: 1;
  transition: all 0.4s ease-in-out;
  class: product-info;
`;

const ProductName = styled.h3<{ $setting: CollectionBlockSetting }>`
  color: ${(props) => props.$setting?.productNameColor};
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: 600;
  transform: translateY(10px);
  transition: transform 0.3s ease;

  ${ProductInfo}:hover & {
    transform: translateY(0);
  }
`;

const ProductPrice = styled.div<{ $setting: CollectionBlockSetting }>`
  color: ${(props) => props.$setting?.priceColor};
  font-size: 16px;
  margin: 12px 0;
  transform: translateY(10px);
  transition: transform 0.3s ease 0.1s;

  ${ProductInfo}:hover & {
    transform: translateY(0);
  }
`;

const BuyButton = styled(Link)<{ $setting: CollectionBlockSetting }>`
  display: inline-block;
  padding: 10px 20px;
  background-color: ${(props) => props.$setting?.btnBackgroundColor};
  color: ${(props) => props.$setting?.btnTextColor};
  border-radius: 8px;
  font-weight: 500;
  transform: translateY(10px);
  transition: all 0.3s ease 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateY(-2px);
  }

  ${ProductInfo}:hover & {
    transform: translateY(0);
  }
`;

export const Collection: React.FC<CollectionProps> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
  setLayout,
  previewWidth,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [preview, setPreview] = useState(previewWidth);

  useEffect(() => {
    if (window.innerWidth <= 425) {
      setPreview("sm");
    } else {
      setPreview(previewWidth);
    }
  }, [previewWidth]);

  const [collections, setCollections] = useState<CollectionData[]>([]);
  const [selectedCollection, setSelectedCollection] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);

  // Modify your useEffect to handle collections
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/collections",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );        const data = await response.json();

        const collectionData = data.collections || [];
        setCollections(collectionData);
        // Set initial filtered products from 'all' collection
        const allCollection = data.collections.find(
          (c: CollectionData) => c.name === "all"
        );
        if (allCollection) {
          const formattedProducts = allCollection.products.map(
            (product: ProductData) => ({
              id: product._id,
              name: product.name,
              price: product.price,
              imageSrc: product.images?.imageSrc || "/assets/images/pro2.jpg",
              imageAlt: product.images?.imageAlt || product.name,
              btnText: "خرید محصول",
            })
          );
          setFilteredProducts(formattedProducts);
        }
      } catch (error) {
        console.log("Error fetching collections:", error);
      }
    };

    fetchProducts();
  }, []);
  const handleCollectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const collectionName = e.target.value;
    setSelectedCollection(collectionName);

    const selectedCollectionData = collections.find(
      (c) => c.name === collectionName
    );
    if (selectedCollectionData) {
      const formattedProducts = selectedCollectionData.products.map(
        (product: CollectionData["products"][0]) => ({
          _id: product._id,
          name: product.name,
          price: product.price,
          imageSrc: product.images?.imageSrc || "/assets/images/pro2.jpg",
          imageAlt: product.images?.imageAlt || product.name,
          btnText: "خرید محصول",
        })
      );
      setFilteredProducts(formattedProducts);
    }
  };

  const sectionData = layout?.sections?.children?.sections?.find(
    (section) => section.type === actualName
  ) as CollectionSection;
  if (!sectionData?.setting) {
    return null; // or return a loading state/placeholder
  }

  return (
    <>
      <Heading $setting={sectionData.setting}>
        {sectionData.blocks.heading}
      </Heading>
      <div className="flex justify-center px-6 my-4">
        <select
          value={selectedCollection}
          onChange={handleCollectionChange}
          className="p-2 border rounded-lg bg-white shadow-sm"
          style={{
            color: sectionData.setting.headingColor,
            borderColor: sectionData.setting.btnBackgroundColor,
          }}
        >
          {collections.map((collection) => (
            <option key={collection._id} value={collection.name}>
              {collection.name}
            </option>
          ))}
        </select>
      </div>
      <CollectionWrapper
        $preview={preview}
        $previewWidth={previewWidth}
        dir="rtl"
        $setting={sectionData.setting}
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
          <div className="fixed inset-0  bg-black bg-opacity-70 z-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-lg font-bold mb-4">
                آیا از حذف
                <span className="text-blue-400 font-bold mx-1">
                  {actualName}
                </span>
                مطمئن هستید؟
              </h3>
              <div className="flex flex-row-reverse gap-4 justify-end">
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
          <div className="absolute w-fit -top-5 -left-1 z-10 flex flex-row-reverse ">
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

        <ProductGrid
          $preview={preview}
          $setting={sectionData.setting}
          $previewWidth={previewWidth}
        >
          {filteredProducts.slice(0, 3).map((product, index) => (
            <ProductCard
              $preview={preview}
              $previewWidth={previewWidth}
              key={product._id}
              $setting={sectionData.setting}
              $isLarge={index === 0}
              // style={
              //   index === 0
              //     ? { height: "100%" }
              //     : { height: "calc(50% - 10px)" }
              // }
            >
              <ProductImage
                src={product.images?.imageSrc || "/assets/images/pro2.jpg"}
                alt={product.images?.imageAlt}
                $setting={sectionData.setting}
              />
              <ProductInfo className="mb-8 transition-all duration-300 ease-in-out">
                <ProductName $setting={sectionData.setting}>
                  {product.name || "نام محصول"}
                </ProductName>
                <ProductPrice $setting={sectionData.setting}>
                  {product.price || "قیمت محصول"}
                </ProductPrice>
                <BuyButton href="#" $setting={sectionData.setting}>
                  {product.btnText}
                </BuyButton>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductGrid>
      </CollectionWrapper>
    </>
  );
};
