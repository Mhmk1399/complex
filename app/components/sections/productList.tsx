"use client";
import styled from "styled-components";
import { Delete } from "../C-D";
import { ProductSection, Layout, ProductCardData } from "@/lib/types";
import ProductCard from "./productCard";
import { useEffect, useState } from "react";

interface ProductListProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
}
// const defaultProduct: ProductCardData = {
//   images: [{ imageSrc: "/assets/images/pro2.jpg", imageAlt: "Default Image" }],
//   name: "محصول پیش‌فرض",
//   description: "توضیحات پیش‌فرض محصول",
//   price: "0",
//   id: "0",
// };

const SectionProductList = styled.section<{
  $data: ProductSection;
}>`
  display: grid;
  grid-template-columns: repeat(
    ${(props) => props.$data.setting?.gridColumns},
    1fr
  );
  gap: 8px;
  direction: rtl;
  padding-top: ${(props) => props.$data?.setting?.paddingTop}px;
  padding-bottom: ${(props) => props.$data?.setting?.paddingBottom}px;
  padding-left: ${(props) => props.$data?.setting?.paddingLeft}px;
  padding-right: ${(props) => props.$data?.setting?.paddingRight}px;
  margin-top: ${(props) => props.$data?.setting?.marginTop}px;
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom}px;
  background-color: ${(props) => props.$data?.setting?.backgroundColor};
  @media (max-width: 425px) {
    grid-template-columns: repeat(1, 2fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 2fr);
  }
`;

const ProductList: React.FC<ProductListProps> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
  setLayout,
}) => {
  const [productData, setProductData] = useState<ProductCardData[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<ProductCardData[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000000 });
  const [selectedFilters, setSelectedFilters] = useState({
    category: '',
    color: '',
    priceMin: 0,
    priceMax: 100000000
  });
  useEffect(() => {
    if (productData.length > 0) {
      // Extract unique categories
      const uniqueCategories = [...new Set(productData.map(product => product.category))].filter((category): category is string => category !== undefined);
      setCategories(uniqueCategories);

      // Extract unique colors from all products
      const uniqueColors = [...new Set(productData.flatMap(product =>
        product.colors.map(color => color[0])
      ))];
      setColors(uniqueColors);

      // Set initial filtered products
      setFilteredProducts(productData);
    }
  }, [productData]);
  const handleFilter = () => {
    let filtered = productData;

    // Category filter
    if (selectedFilters.category) {
      filtered = filtered.filter(product => product.category === selectedFilters.category);
    }

    // Color filter
    if (selectedFilters.color) {
      filtered = filtered.filter(product =>
        product.colors.some(color => color[0] === selectedFilters.color)
      );
    }

    // Price range filter
    filtered = filtered.filter(product => {
      const price = parseInt(product.price);
      return price >= selectedFilters.priceMin && price <= selectedFilters.priceMax;
    });

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "",
          },

        });

        const data = await response.json();

        if (data?.products) {
          const productInfo = data.products.map((product: ProductCardData) => ({
            ...product,
            images: product.images,
          }));

          setProductData(productInfo);
        }
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const sectionData = layout?.sections?.children?.sections.find(
    (section) => section.type === actualName
  ) as ProductSection;


  if (!sectionData) {
    return null;
  }

  return (
    <SectionProductList
      $data={sectionData}
      onClick={() => setSelectedComponent(actualName)}
      className={`transition-all duration-150 ease-in-out relative ${selectedComponent === actualName
          ? "border-4 border-blue-500 rounded-lg shadow-lg "
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
        <div className="absolute w-fit -top-5 -left-1 z-10 flex">
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
         <div className="filter-panel bg-white p-4 rounded-lg shadow mb-4 ">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">دسته‌بندی</label>
            <select
              className="w-full border rounded-md p-2"
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="">همه</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Color Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">رنگ</label>
            <select
              className="w-full border rounded-md p-2"
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, color: e.target.value }))}
            >
              <option value="">همه</option>
              {colors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">حداقل قیمت (تومان)</label>
            <input
              type="number"
              className="w-full border rounded-md p-2"
              value={selectedFilters.priceMin}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, priceMin: parseInt(e.target.value) }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">حداکثر قیمت (تومان)</label>
            <input
              type="number"
              className="w-full border rounded-md p-2"
              value={selectedFilters.priceMax}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, priceMax: parseInt(e.target.value) }))}
            />
          </div>
        </div>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={handleFilter}
        >
          اعمال فیلتر
        </button>
      </div>

      {filteredProducts.map((block, index) => (
        <div className="p-0 m-0" key={`${block.id}-${index}`}>
          <ProductCard productData={block} />
        </div>
      ))}
    </SectionProductList>
  );
};

export default ProductList;
