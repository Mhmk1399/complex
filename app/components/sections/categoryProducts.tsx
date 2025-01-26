"use client";
import styled from "styled-components";
import { Layout } from "@/lib/types";
import Image from "next/image";

interface CategoryProductsProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
  previewWidth: "sm" | "default";
}

const CategoryContainer = styled.div<{
  $previewWidth: "sm" | "default";
}>`
  padding: 20px 0;
  background-color: #ffffff;
`;

const CategoriesWrapper = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  padding: 20px;
  width: 100%;
`;

const CategoryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }

  .category-image-container {
    width: 100px;
    height: 100px;
    border-radius: 16px;
    overflow: hidden;
    background-color: #f5f5f5;
  }

  .category-title {
    margin-top: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #3f3f3f;
    text-align: center;
  }
`;

const categories = [
  { id: 1, title: "موبایل", imageUrl: "/images/mobile.png" },
  { id: 2, title: "لپ تاپ", imageUrl: "/images/laptop.png" },
  { id: 3, title: "لوازم خانگی", imageUrl: "/images/appliances.png" },
  { id: 4, title: "آرایشی و بهداشتی", imageUrl: "/images/beauty.png" },
  { id: 5, title: "مد و پوشاک", imageUrl: "/images/fashion.png" },
  { id: 6, title: "کالای دیجیتال", imageUrl: "/images/digital.png" },
  { id: 7, title: "ورزش و سفر", imageUrl: "/images/sports.png" },
  { id: 8, title: "خانه و آشپزخانه", imageUrl: "/images/home.png" },
  { id: 9, title: "بچه و نوزاد", imageUrl: "/images/baby.png" },
  { id: 12, title: "ابزار و تجهیزات", imageUrl: "/images/tools.png" },
];

export const CategoryProducts: React.FC<CategoryProductsProps> = ({
  layout,
  actualName,
  selectedComponent,
  setSelectedComponent,
  setLayout,
  previewWidth
}) => {
  return (
    <CategoryContainer
      $previewWidth={previewWidth}
      onClick={() => setSelectedComponent(actualName)}
      className={`transition-all duration-150 ease-in-out relative ${
        selectedComponent === actualName
          ? "border-4 border-blue-500 rounded-2xl shadow-lg"
          : ""
      }`}
    >
      {actualName === selectedComponent && (
        <div className="absolute w-fit -top-5 -left-1 z-10 flex">
          <div className="bg-blue-500 py-1 px-4 rounded-lg text-white">
            {actualName}
          </div>
        </div>
      )}
      
      <h2 className="text-xl font-bold text-center mb-4 text-gray-800">
        خرید بر اساس دسته‌بندی
      </h2>
      
      <CategoriesWrapper>
        {categories.map((category) => (
          <CategoryItem key={category.id}>
            <div className="category-image-container">
              <Image
                src={category.imageUrl}
                alt={category.title}
                width={100}
                height={100}
                className="object-cover w-full h-full"
              />
            </div>
            <span className="category-title">{category.title}</span>
          </CategoryItem>
        ))}
      </CategoriesWrapper>
    </CategoryContainer>
  );
};
