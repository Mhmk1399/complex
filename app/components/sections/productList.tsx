"use client";
import styled from "styled-components";
import { Delete } from "../C-D";
import { ProductSection, Layout, ProductCardData } from "@/lib/types";
import ProductCard from "./productCard";
import { useEffect, useState } from "react";
import React from "react";

interface ProductListProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
}
interface CategoryWithChildren {
  _id: string;
  name: string;
  children?: CategoryWithChildren[];
}
type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name';


// const defaultProduct: ProductCardData = {
//   images: [{ imageSrc: "/assets/images/pro2.jpg", imageAlt: "Default Image" }],
//   name: "محصول پیش‌فرض",
//   description: "توضیحات پیش‌فرض محصول",
//   price: "0",
//   id: "0",
// };
const ColorBox = styled.div<{ $color: string; $selected: boolean }>`
  width: 30px;
  height: 30px;
  border-radius: 4px;
  background-color: ${props => props.$color};
  cursor: pointer;
  border: 2px solid ${props => props.$selected ? '#2563eb' : 'transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;
const RangeSliderContainer = styled.div`
  position: relative;
  width: 100%;
  height: 40px;
`;

const RangeSlider = styled.input`
  position: absolute;
  width: 100%;
  pointer-events: none;
  appearance: none;
  height: 2px;
  background: none;
  
  &::-webkit-slider-thumb {
    pointer-events: all;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #2563eb;
    cursor: pointer;
    appearance: none;
    z-index: 3;
    position: relative;
  }
`;

const SectionProductList = styled.section<{
  $data: ProductSection;
}>`
  display: grid;
  grid-template-columns: repeat(
    ${(props) => props.$data.setting?.gridColumns},
    1fr
  );
  width: 90%;
  gap: px;
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
  const [colors, setColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [showColorModal, setShowColorModal] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [categoriesData, setCategoriesData] = useState<CategoryWithChildren[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const sortOptions = [
    { value: 'newest', label: 'جدیدترین' },
    { value: 'price-asc', label: 'ارزان‌ترین' },
    { value: 'price-desc', label: 'گران‌ترین' },
    { value: 'name', label: 'نام محصول' }
  ];
  const [selectedFilters, setSelectedFilters] = useState({
    category: '',
    color: '',
    priceMin: 0,
    priceMax: 100000000
  });
  const getSortedProducts = (products: ProductCardData[]) => {
    switch (sortBy) {
      case 'newest':
        return [...products].sort((a, b) => 
          new Date(b?.createdAt || new Date()).getTime() - new Date(a?.createdAt || new Date()).getTime()
        );
      case 'price-asc':
        return [...products].sort((a, b) => 
          parseInt(a.price) - parseInt(b.price)
        );
      case 'price-desc':
        return [...products].sort((a, b) => 
          parseInt(b.price) - parseInt(a.price)
        );
      case 'name':
        return [...products].sort((a, b) => 
          a.name.localeCompare(b.name)
        );
      default:
        return products;
    }
  };
  useEffect(() => {
    if (productData.length > 0) {
      // Extract unique categories
      const uniqueCategories = [...new Set(productData.map(product => product.category?.name))].filter((category): category is string => category !== undefined);

      // Extract unique color codes from all products
      const uniqueColors = [...new Set(productData.flatMap(product =>
        product.colors.map(color => color.code)
      ))];
      setColors(uniqueColors);

      const prices = productData.map(product => parseInt(product.price));
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      setPriceRange({ min: minPrice, max: maxPrice });
      setSelectedFilters(prev => ({
        ...prev,
        priceMin: minPrice,
        priceMax: maxPrice
      }));

      setFilteredProducts(productData);
    }
  }, [productData]);

  const handleFilter = () => {
    let filtered = productData;

    if (selectedFilters.category) {
      // Find the selected category in categoriesData
      const selectedCategory = categoriesData.find(cat => cat.name === selectedFilters.category);

      if (selectedCategory) {
        // Get all child category names including the parent
        const relevantCategories = getAllChildCategories(selectedCategory);

        // Filter products that match any of the relevant categories
        filtered = filtered.filter(product =>
          product.category && relevantCategories.includes(product.category.name)
        );
      } else {
        // If not found in main categories, it might be a child category
        filtered = filtered.filter(product =>
          product.category?.name === selectedFilters.category
        );
      }
    }

    // Keep existing color filter
    if (selectedColors.length > 0) {
      filtered = filtered.filter(product =>
        product.colors.some(color => selectedColors.includes(color.code))
      );
    }

    // Keep existing price filter
    filtered = filtered.filter(product => {
      const price = parseInt(product.price);
      return price >= selectedFilters.priceMin && price <= selectedFilters.priceMax;
    });

    setFilteredProducts(filtered);
  };
  const getAllChildCategories = (category: CategoryWithChildren): string[] => {
    let categories = [category.name];
    if (category.children) {
      category.children.forEach(child => {
        categories = [...categories, ...getAllChildCategories(child)];
      });
    }
    return categories;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/category", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token") || "",
          },
        });
        const data = await response.json();
        setCategoriesData(data);

        // Extract all category names including children for the dropdown
        const allCategories = data.flatMap((category: CategoryWithChildren) => {
          const parentName = category.name;
          const childrenNames = category.children?.map((child: CategoryWithChildren) => child.name) || [];
          return [parentName, ...childrenNames];
        });

      } catch (error) {
        console.log("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
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
    <div  className={`transition-all duration-150 ease-in-out relative flex bg-gray-100 ${selectedComponent === actualName
      ? "border-4 border-blue-500 rounded-lg shadow-lg "
      : ""
      }`}>
      
    <SectionProductList
      $data={sectionData}
      onClick={() => setSelectedComponent(actualName)}
      
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
          <button
            className="font-extrabold text-xl hover:bg-blue-500 bg-red-500 pb-1 rounded-r-lg px-3 text-white transform transition-all ease-in-out duration-300"
            onClick={() => setShowDeleteModal(true)}
          >
            x
          </button>
          <div className="bg-blue-500 py-1 px-4 rounded-l-lg text-white">
            {actualName}
          </div>
          
        </div>
      ) : null}
      <div className="absolute w-[100%] top-3 left-0 right-0 z-20 bg-white shadow-sm ">
  <div className="flex items-center gap-6 p-4 border-b">
    <span className="text-gray-500">:مرتب‌سازی بر اساس</span>
    <div className="flex gap-6">
      {sortOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => setSortBy(option.value as SortOption)}
          className={`pb-2 relative ${
            sortBy === option.value 
              ? 'text-blue-500 font-medium after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-500' 
              : 'text-gray-600 hover:text-blue-500'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
</div>
      

      {getSortedProducts(filteredProducts).map((block, index) => (
  <div className="p-0 m-0" key={`${block.id}-${index}`}>
    <ProductCard productData={block} />
  </div>
))}
    </SectionProductList>
    <div className="filter-panel bg-white p-6 h-fit rounded-lg shadow mb-4 sticky top-0 mt-28 right-0 " dir="rtl">
        
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 justify-start">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">دسته‌بندی</label>
            <select
              className="w-full border rounded-md p-2"
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="">همه</option>
              {categoriesData.map((category, index) => (
                <React.Fragment key={category._id}>
                  <option value={category.name}>
                    {category.name}
                  </option>
                  {category.children?.map((child) => (
                    <option key={child._id} value={child.name}>
                      {`- ${child.name}`}
                    </option>
                  ))}
                </React.Fragment>
              ))}

            </select>
          </div>

          {/* Color Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">رنگ‌ها</label>
            <button
              onClick={() => setShowColorModal(true)}
              className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center gap-2"
            >
              انتخاب رنگ
              {selectedColors.length > 0 && (
                <span className="bg-blue-500 text-white rounded-full px-2 py-0.5 text-sm">
                  {selectedColors.length}
                </span>
              )}
            </button>
          </div>
          {/* Price Range Filter */}

          <div className="price-range-container">
            <h3 className="text-lg pb-2">فیلتر قیمت</h3>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              قیمت از: {selectedFilters.priceMin.toLocaleString()} تا: {selectedFilters.priceMax.toLocaleString()} تومان
            </label>

            <RangeSliderContainer>
              <RangeSlider
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                value={selectedFilters.priceMin}
                onChange={(e) => setSelectedFilters(prev => ({
                  ...prev,
                  priceMin: Math.min(parseInt(e.target.value), selectedFilters.priceMax)
                }))}
              />
              <RangeSlider
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                value={selectedFilters.priceMax}
                onChange={(e) => setSelectedFilters(prev => ({
                  ...prev,
                  priceMax: Math.max(parseInt(e.target.value), selectedFilters.priceMin)
                }))}
              />
            </RangeSliderContainer>
          </div>
          {showColorModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">انتخاب رنگ‌ها</h3>
                  <button
                    onClick={() => setShowColorModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div>
                  <div className="flex gap-2">
                    {colors.map((colorCode, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setSelectedColors(prev =>
                            prev.includes(colorCode)
                              ? prev.filter(c => c !== colorCode)
                              : [...prev, colorCode]
                          );
                        }}
                        className="flex flex-col items-center gap-1"
                      >
                        <ColorBox
                          $color={colorCode}
                          $selected={selectedColors.includes(colorCode)}
                          style={{ backgroundColor: colorCode }}
                          className="w-12 h-12"
                        />
                      </div>
                    ))}
                  </div>

                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setSelectedColors([]);
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    پاک کردن
                  </button>
                  <button
                    onClick={() => {
                      handleFilter();
                      setShowColorModal(false);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    تایید
                  </button>
                </div>
              </div>
            </div>
          )}
         

        </div>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={handleFilter}
        >
          اعمال فیلتر
        </button>
      </div>
    </div>
  );
};

export default ProductList;
