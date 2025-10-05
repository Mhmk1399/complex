"use client";
import styled from "styled-components";
import {
  ProductSection,
  Layout,
  ProductCardData,
  ProductBlockSetting,
} from "@/lib/types";
import ProductCard from "./productCard";
import { useEffect, useState } from "react";
import React from "react";
import { FiFilter } from "react-icons/fi";
import { createApiService } from "@/lib/api-factory";

interface ProductListProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  previewWidth: "sm" | "default";
}
interface CategoryWithChildren {
  _id: string;
  name: string;
  children?: CategoryWithChildren[];
}
type SortOption = "newest" | "price-asc" | "price-desc" | "name";

const SectionProductList = styled.section<{
  $data: ProductSection;
  $previewWidth: "sm" | "default";
}>`
  display: flex;
  max-width: 100%;
  direction: rtl;
  gap: 2rem;
  padding-top: ${(props) => props.$data?.setting?.paddingTop}px;
  padding-bottom: ${(props) => props.$data?.setting?.paddingBottom}px;
  padding-left: ${(props) => props.$data?.setting?.paddingLeft}px;
  padding-right: ${(props) => props.$data?.setting?.paddingRight}px;
  margin-top: ${(props) => props.$data?.setting?.marginTop}px;
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom}px;
  margin-left: ${(props) => props.$data?.setting?.marginLeft}px;
  margin-right: ${(props) => props.$data?.setting?.marginRight}px;
  background-color: ${(props) => props.$data?.setting?.backgroundColor};
  box-shadow: ${(props) =>
    `${props.$data.setting?.shadowOffsetX || 0}px 
     ${props.$data.setting?.shadowOffsetY || 4}px 
     ${props.$data.setting?.shadowBlur || 10}px 
     ${props.$data.setting?.shadowSpread || 0}px 
     ${props.$data.setting?.shadowColor || "#fff"}`};
  border-radius: ${(props) => props.$data.setting?.Radius || "10"}px;

  @media (max-width: 426px) {
    flex-direction: column;
  }
`;

const ProductGrid = styled.div<{
  $data: ProductSection;
  $previewWidth: "sm" | "default";
}>`
  flex: 1;
  display: ${(props) => (props.$previewWidth === "sm" ? "flex" : "grid")};
  ${(props) =>
    props.$previewWidth === "sm"
      ? `flex-wrap: nowrap;
     overflow-x: auto;
     scroll-snap-type: x mandatory;
     -webkit-overflow-scrolling: touch;
     
     & > div {
       flex: 0 0 auto;
       width: 80%;
       scroll-snap-align: start;
     }`
      : `grid-template-columns: repeat(${
          props.$data.setting?.gridColumns || 3
        }, 1fr);
     gap: 16px;`}

  @media (max-width: 426px) {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;

    & > div {
      flex: 0 0 auto;
      width: 80%;
      scroll-snap-align: start;
    }
  }
`;
const ColorBox = styled.div<{ $color: string; $selected: boolean }>`
  width: 30px;
  height: 30px;
  border-radius: 4px;
  background-color: ${(props) => props.$color};
  cursor: pointer;
  border: 2px solid ${(props) => (props.$selected ? "#2563eb" : "transparent")};
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;
const FilterBgRow = styled.div<{ $data: ProductBlockSetting }>`
  background-color: ${(props) => props.$data?.filterRowBg};
`;
const FilteNameRow = styled.div<{
  $data: ProductBlockSetting;
  $previewWidth: "sm" | "default";
}>`
  color: ${(props) => props.$data?.filterNameColor};
  font-size: ${(props) => (props.$previewWidth === "sm" ? "12" : "16")}px;
`;
const FilterCardBg = styled.div<{
  $data: ProductBlockSetting;
  $previewWidth: "sm" | "default";
}>`
  background-color: ${(props) => props.$data?.filterCardBg};
  border-radius: 10px;
  width: 356px;
  flex-shrink: 0;
  height: fit-content;
  position: sticky;
  top: 80px;
  right: 5px;
  display: ${(props) => (props.$previewWidth === "sm" ? "none" : "block")};
  @media (max-width: 426px) {
    display: none;
  }
`;

const PriceInputContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  justify-content: space-between;
`;

const PriceInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  text-align: center;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const ApplyButton = styled.button<{
  $data: ProductBlockSetting;
}>`
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  background-color: ${(props) => props.$data?.filterButtonBg};
  color: ${(props) => props.$data?.filterButtonTextColor};
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ProductList: React.FC<ProductListProps> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
  previewWidth,
}) => {
  const [preview, setPreview] = useState(previewWidth);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const api = createApiService({
    baseUrl: "/api",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        typeof window !== "undefined"
          ? `Bearer ${localStorage.getItem("token")}`
          : "",
    },
  });

  const { data: productsData } = api.useGet("/products", {
    revalidateOnFocus: false,
   });

  const { data: categoriesData } = api.useGet("/category", {
    revalidateOnFocus: false,
   });

  const productData = productsData?.products || [];
  const categoriesDataList = categoriesData || [];
  const [filteredProducts, setFilteredProducts] = useState<ProductCardData[]>(
    []
  );
  const [colors, setColors] = useState<string[]>([]);
  const [showColorModal, setShowColorModal] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const sortOptions = [
    { value: "newest", label: "جدیدترین" },
    { value: "price-asc", label: "ارزان‌ترین" },
    { value: "price-desc", label: "گران‌ترین" },
    { value: "name", label: "نام محصول" },
  ];
  const [selectedFilters, setSelectedFilters] = useState({
    category: "",
    color: "",
    priceMin: 0,
    priceMax: 100000000,
  });
  const getSortedProducts = (products: ProductCardData[]) => {
    switch (sortBy) {
      case "newest":
        return [...products].sort(
          (a, b) =>
            new Date(b?.createdAt || new Date()).getTime() -
            new Date(a?.createdAt || new Date()).getTime()
        );
      case "price-asc":
        return [...products].sort(
          (a, b) => parseInt(a.price) - parseInt(b.price)
        );
      case "price-desc":
        return [...products].sort(
          (a, b) => parseInt(b.price) - parseInt(a.price)
        );
      case "name":
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return products;
    }
  };
  console.log(preview);

  useEffect(() => {
    if (productData.length > 0) {
      // Extract unique categories
      const uniqueCategories = [
        ...new Set(
          productData.map((product: ProductCardData) => product.category?.name)
        ),
      ].filter((category): category is string => category !== undefined);

      console.log(uniqueCategories);

      // Extract unique color codes from all products
      const uniqueColors = [
        ...new Set(
          productData.flatMap((product: ProductCardData) =>
            product.colors.map((color) => color.code)
          )
        ),
      ] as string[];
      setColors(uniqueColors);

      const prices = productData.map((product: ProductCardData) =>
        parseInt(product.price)
      );
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      setSelectedFilters((prev) => ({
        ...prev,
        priceMin: minPrice,
        priceMax: maxPrice,
      }));

      setFilteredProducts(productData);
    }
  }, [productData]);

  useEffect(() => {
    if (window.innerWidth <= 426) {
      setPreview("sm");
    } else {
      setPreview(previewWidth);
    }
  }, [previewWidth]);

  const handleFilter = () => {
    let filtered = productData;

    if (selectedFilters.category) {
      // Find the selected category in categoriesData
      const selectedCategory = categoriesDataList.find(
        (cat: CategoryWithChildren) => cat.name === selectedFilters.category
      );

      if (selectedCategory) {
        // Get all child category names including the parent
        const relevantCategories = getAllChildCategories(selectedCategory);

        // Filter products that match  of the relevant categories
        filtered = filtered.filter(
          (product: ProductCardData) =>
            product.category &&
            relevantCategories.includes(product.category.name)
        );
      } else {
        // If not found in main categories, it might be a child category
        filtered = filtered.filter(
          (product: ProductCardData) =>
            product.category?.name === selectedFilters.category
        );
      }
    }

    // Keep existing color filter
    if (selectedColors.length > 0) {
      filtered = filtered.filter((product: ProductCardData) =>
        product.colors.some((color) => selectedColors.includes(color.code))
      );
    }

    // Keep existing price filter
    filtered = filtered.filter((product: ProductCardData) => {
      const price = parseInt(product.price);
      return (
        price >= selectedFilters.priceMin && price <= selectedFilters.priceMax
      );
    });

    setFilteredProducts(filtered);
  };
  const getAllChildCategories = (category: CategoryWithChildren): string[] => {
    let categories = [category.name];
    if (category.children) {
      category.children.forEach((child) => {
        categories = [...categories, ...getAllChildCategories(child)];
      });
    }
    return categories;
  };

  const sectionData = layout?.sections?.children?.sections.find(
    (section) => section.type === actualName
  ) as ProductSection;

  if (!sectionData) {
    return null;
  }

  const renderPriceFilter = () => (
    <div className="price-filter-container">
      <h3 className="text-lg font-bold text-gray-800 pb-3">فیلتر قیمت</h3>
      <PriceInputContainer>
        <div className="flex flex-col items-center flex-1">
          <label className="text-sm font-medium text-gray-700 mb-1">
            از (تومان)
          </label>
          <PriceInput type="number" placeholder="0" />
        </div>
        <div className="flex flex-col items-center flex-1">
          <label className="text-sm font-medium text-gray-700 mb-1">
            تا (تومان)
          </label>
          <PriceInput type="number" placeholder="بدون محدودیت" />
        </div>
      </PriceInputContainer>
      <ApplyButton $data={sectionData.setting}>اعمال فیلتر</ApplyButton>
    </div>
  );

  return (
    <SectionProductList
      $data={sectionData}
      $previewWidth={previewWidth}
      onClick={() => setSelectedComponent(actualName)}
      className={`transition-all flex-row-reverse duration-150 ease-in-out relative flex bg-gray-100 ${
        selectedComponent === actualName
          ? "border-4 border-blue-500 rounded-lg shadow-lg "
          : ""
      }`}
    >
      {preview === "sm" && (
        <button
          className="bg-blue-500 text-white p-2  rounded absolute top-[60px] right-4 z-50 shadow-md"
          onClick={() => setIsMobileFilterOpen(true)}
        >
          <FiFilter size={24} />
        </button>
      )}

      {/** Mobile filter modal */}
      {preview === "sm" && isMobileFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div
            className="bg-white/60 backdrop-blur-sm border p-10  rounded-lg max-w-4xl  "
            dir="rtl"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">فیلترها</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  دسته‌بندی
                </label>
                <select
                  className="w-full border rounded-md p-2"
                  onChange={(e) =>
                    setSelectedFilters((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                >
                  <option value="">همه</option>
                  {categoriesDataList.map((category: CategoryWithChildren) => (
                    <React.Fragment key={category._id}>
                      <option value={category.name}>{category.name}</option>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رنگ‌ها
                </label>
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
              {showColorModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                  <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] mx-2 overflow-y-auto">
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
                              setSelectedColors((prev) =>
                                prev.includes(colorCode)
                                  ? prev.filter((c) => c !== colorCode)
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
              {/** Include additional filters like color and price as needed */}
              {renderPriceFilter()}
            </div>
            <div className="mt-4 flex justify-start gap-2">
              <button
                onClick={() => {
                  handleFilter();
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                تایید
              </button>
            </div>
          </div>
        </div>
      )}

      {actualName === selectedComponent ? (
        <div className="absolute w-fit -top-8 -left-1 z-10 flex">
          <div className="bg-blue-500 py-1 px-4 rounded-lg text-white">
            {actualName}
          </div>
        </div>
      ) : null}

      <FilterBgRow
        $data={sectionData.setting}
        className="absolute min-w-full top-0 text-white mx-0  right-0 z-20 shadow-sm"
      >
        <div className="flex w-[100%] items-center gap-6 p-4 border-b">
          <FilteNameRow
            $previewWidth={previewWidth}
            $data={sectionData.setting}
            className="opacity-70 font-semibold"
          >
            {" "}
            مرتب‌سازی بر اساس :
          </FilteNameRow>
          <div className="flex gap-6">
            {sortOptions.map((option) => (
              <FilteNameRow
                $previewWidth={previewWidth}
                $data={sectionData.setting}
                key={option.value}
                onClick={() => setSortBy(option.value as SortOption)}
                className={`pb-1 relative cursor-pointer transition-all duration-200 ease-in-out ${
                  sortBy === option.value
                    ? '   after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-500'
                    : "text-gray-50  "
                }`}
              >
                {option.label}
              </FilteNameRow>
            ))}
          </div>
        </div>
      </FilterBgRow>

      <ProductGrid
        $data={sectionData}
        $previewWidth={previewWidth}
        className="mt-20"
      >
        {getSortedProducts(filteredProducts)
          .slice(0, 7)
          .map((block, index) => (
            <div key={`${block.id}-${index}`}>
              <ProductCard
                productData={block}
                settings={sectionData.setting}
                previewWidth={previewWidth}
              />
            </div>
          ))}
      </ProductGrid>

      <FilterCardBg
        $previewWidth={previewWidth}
        $data={sectionData.setting}
        className="p-4 rounded-lg shadow-sm"
        dir="rtl"
      >
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 justify-start">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              دسته‌بندی
            </label>
            <select
              className="w-full border rounded-md p-2 "
              onChange={(e) =>
                setSelectedFilters((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
            >
              <option value="">همه</option>
              {categoriesDataList.map((category: CategoryWithChildren) => (
                <React.Fragment key={category._id}>
                  <option value={category.name}>{category.name}</option>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رنگ‌ها
            </label>
            <button
              onClick={() => setShowColorModal(true)}
              className="px-4 py-2 w-full bg-gray-100 rounded-md hover:bg-gray-200 flex items-center gap-2"
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

          {renderPriceFilter()}

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
                          setSelectedColors((prev) =>
                            prev.includes(colorCode)
                              ? prev.filter((c) => c !== colorCode)
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
      </FilterCardBg>

      {showColorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] mx-2 overflow-y-auto">
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
                      setSelectedColors((prev) =>
                        prev.includes(colorCode)
                          ? prev.filter((c) => c !== colorCode)
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
    </SectionProductList>
  );
};

export default ProductList;
