"use client";
import React, { useEffect, useState } from "react";
import { ProductCardData, ProductImage } from "@/lib/types";
import Image from "next/image";

interface DetailPageProps {
  productId: string;
}

const DetailPage: React.FC<DetailPageProps> = ({ productId }) => {
  const [product, setProduct] = useState<ProductCardData>({
    images: [],
    name: "",
    description: "",
    price: "",
    id: "",
  });
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
 
  useEffect(() => {
    const fetchProductDetails = async () => {
        
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
          throw new Error(await response.text());
        }
        const data = await response.json();
        setProduct(data);
        setSelectedImage(data.images[0]?.imageSrc || "");
        setLoading(false);
        console.log(typeof data.images, data.images);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        Product not found
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images Section */}
        <div className="space-y-4">
          <div className="relative h-[500px] w-full rounded-lg overflow-hidden">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto">
            {product.images &&
              product.images.map((image: ProductImage, index: number) => (
                <div
                  key={index}
                  className={`relative h-20 w-20 cursor-pointer rounded-md overflow-hidden ${
                    selectedImage === image.imageSrc
                      ? "border-2 border-blue-500"
                      : ""
                  }`}
                  onClick={() => setSelectedImage(image.imageSrc)}
                >
                  <Image
                    src={image.imageSrc}
                    alt={image.imageAlt}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{product.price} تومان</span>
              {product.discount && (
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full">
                  {product.discount}% تخفیف
                </span>
              )}
            </div>

            <div className="space-y-2">
              {product.status && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">وضعیت:</span>
                  <span
                    className={`${
                      product.status === "available"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.status === "available" ? "موجود" : "ناموجود"}
                  </span>
                </div>
              )}

              {product.category && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">دسته‌بندی:</span>
                  <span>{product.category}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DetailPage;
