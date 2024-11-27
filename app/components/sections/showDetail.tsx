"use client";

import { useSearchParams } from "next/navigation";
import React from "react";
import DetailPage from "./detailPage";

const ProductsPage = () => {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  if (!productId) {
    return null;
  }

  return (
    <div>
      <DetailPage productId={productId} />
    </div>
  );
};

export default ProductsPage;
