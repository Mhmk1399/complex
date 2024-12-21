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
  id: string;
  name: string;
  price: number;
  imageSrc: string;
  imageAlt: string;
  btnText: string;
}

const CollectionWrapper = styled.div<{
  $setting: CollectionBlockSetting;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  padding-top: ${(props) => props.$setting?.paddingTop}px;
  padding-bottom: ${(props) => props.$setting?.paddingBottom}px;
  padding-right: ${(props) => props.$setting?.paddingRight}px;
  padding-left: ${(props) => props.$setting?.paddingLeft}px;
  margin-top: ${(props) => props.$setting?.marginTop}px;
  margin-bottom: ${(props) => props.$setting?.marginBottom}px;
  background-color: ${(props) => props.$setting?.backgroundColor};
  // width: ${(props) => (props.$preview === "sm" ? "425px" : "100%")};
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 12px;
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
  background: ${(props) => props.$setting.cardBackground};
  border-radius: ${(props) => props.$setting.cardBorderRadius}px;
  overflow: hidden;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  &:hover {
    transform: scale(0.99);
  }
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  // width: ${(props) => (props.$isLarge ? "100%" : "calc(49% - 100px)")};
`;

const ProductImage = styled.img<{ $setting: CollectionBlockSetting }>`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: ${(props) => props.$setting.imageRadius}px;
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

const BuyButton = styled(Link)<{ $setting: CollectionBlockSetting }>`
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
        // const response = await fetch("/api/collections");
        // const data = await response.json();

<<<<<<< Updated upstream
        const collectionData = data.collections || [];
        setCollections(collectionData);
        // Set initial filtered products from 'all' collection
        const allCollection = data.collections.find(
          (c: CollectionData) => c.name === "all"
        );
        
        if (allCollection) {
          const formattedProducts = allCollection.products.map(
            (product: CollectionData['products'][0]) => ({
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
=======
        // const collectionData = data.collections || [];
        // setCollections(collectionData);
        // // Set initial filtered products from 'all' collection
        // const allCollection = data.collections.find(
        //   (c: any) => c.name === "all"
        // );
        // if (allCollection) {
        //   const formattedProducts = allCollection.products.map(
        //     (product: any) => ({
        //       id: product._id,
        //       name: product.name,
        //       price: product.price,
        //       imageSrc: product.images?.imageSrc || "/assets/images/pro2.jpg",
        //       imageAlt: product.images?.imageAlt || product.name,
        //       btnText: "خرید محصول",
        //     })
        //   );
        //   setFilteredProducts(formattedProducts);
        // }
>>>>>>> Stashed changes
      } catch (error) {
        console.log("Error fetching products:", error);
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
        (product: CollectionData['products'][0]) => ({
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
              key={product.id}
              $setting={sectionData.setting}
              $isLarge={index === 0}
              style={
                index === 0
                  ? { height: "100%" }
                  : { height: "calc(50% - 10px)" }
              }
            >
              <ProductImage
                src={product.imageSrc || "/assets/images/pro2.jpg"}
                alt={product.imageAlt}
                $setting={sectionData.setting}
              />
              <ProductInfo>
                <ProductName $setting={sectionData.setting}>
                  {product.name}
                </ProductName>
                <ProductPrice $setting={sectionData.setting}>
                  {product.price}
                </ProductPrice>
                <BuyButton
                  href={`/detailpages/${product.id}`}
                  $setting={sectionData.setting}
                >
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
