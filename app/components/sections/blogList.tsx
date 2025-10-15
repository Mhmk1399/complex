"use client";
import styled from "styled-components";
import { BlogListSection, BlogListSetting, Layout } from "@/lib/types";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Delete } from "../C-D";

interface BlogListProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
}
interface BlogData {
  blogId: number;
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  author: string;
  date: string;
  btnText: string;
  btnLink: string;
  storeId: string;
  content: string;
  createdAt: string;
  id: number;
}

const SectionBlogList = styled.section<{
  $data: BlogListSection;
}>`
  display: grid;
  grid-template-columns: repeat(
    ${(props) => props.$data.setting?.gridColumns},
    1fr
  );
  gap: 10px;
  padding-top: ${(props) => props.$data?.setting?.paddingTop}px;
  padding-bottom: ${(props) => props.$data?.setting?.paddingBottom}px;
  paddding-left: ${(props) => props.$data?.setting?.paddingLeft}px;
  padding-right: ${(props) => props.$data?.setting?.paddingRight}px;
  margin-top: ${(props) => props.$data?.setting?.marginTop}px;
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom}px;
  background-color: ${(props) => props.$data?.setting?.backgroundColor};
  box-shadow: ${(props) =>
    `${props.$data.setting?.shadowOffsetX || 0}px 
     ${props.$data.setting?.shadowOffsetY || 4}px 
     ${props.$data.setting?.shadowBlur || 10}px 
     ${props.$data.setting?.shadowSpread || 0}px 
     ${props.$data.setting?.shadowColor || "#fff"}`};
  border-radius: ${(props) => props.$data.setting?.Radius || "20"}px;

  @media (max-width: 425px) {
    grid-template-columns: repeat(1, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const BlogCard = styled.div<{
  $data: BlogListSetting;
}>`
  background: ${(props) => props.$data?.cardBackgroundColor};
  border-radius: ${(props) => props.$data?.cardBorderRadius}px;
  margin: 0 8px;
  height: 100%;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transform: translateY(-1px);
    cursor: pointer;
  }

  img {
    width: 100%;
    height: 300px;
    object-fit: cover;
  }

  .content {
    padding: 10px;
  }

  .title {
    font-size: ${(props) => props.$data?.titleSize}px;
    font-weight: bold;
    margin-bottom: 10px;
    color: ${(props) => props.$data?.textColor};
  }

  .meta {
    display: flex;
    justify-content: space-between;
    color: ${(props) => props.$data?.textColor};
    font-size: 0.875rem;
    margin-bottom: 10px;
  }

  .description {
    font-size: ${(props) => props.$data?.descriptionSize}px;
    margin-bottom: 15px;
    color: ${(props) => props.$data?.textColor};
  }

  .read-more {
    display: inline-block;
    padding: 8px 16px;
    color: ${(props) => props.$data?.buttonColor};
    border-radius: ${(props) => props.$data.btnRadius || "20"}px;
    text-decoration: none;
    transition: background 0.3s ease;
    background-color: ${(props) => props.$data?.btnBackgroundColor};

    &:hover {
      opacity: 0.8;
    }
  }
`;

const BlogList: React.FC<BlogListProps> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
  setLayout,
}) => {
  const [blogData, setBlogData] = useState<BlogData[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blogs", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              typeof window !== "undefined"
                ? `Bearer ${localStorage.getItem("token")}`
                : "",
          },
        });

        const data = await response.json();

        const blogInfo = data.blogs.map((blog: BlogData) => ({
          ...blog,
          // btnText: "مطالعه بیشتر",
          btnLink: `/blog/${blog.blogId}`,
          imageSrc: "/assets/images/pro3.jpg", // Add a default image
          imageAlt: blog.title,
          description: blog.description,
          storeId: blog.storeId,
        }));
        setBlogData(blogInfo);
      } catch (error) {
        console.log("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  const sectionData = layout?.sections?.children?.sections.find(
    (section) => section.type === actualName
  ) as BlogListSection;

  if (!sectionData) return null;

  return (
    <SectionBlogList
      dir="rtl"
      $data={sectionData}
      onClick={() => setSelectedComponent(actualName)}
      className={`transition-all duration-150 ease-in-out relative ${
        selectedComponent === actualName
          ? "border-4 border-blue-500 rounded-lg shadow-lg "
          : ""
      }`}
    >
      {showDeleteModal && (
        <div className="fixed inset-0  bg-black bg-opacity-70 z-50 flex items-center justify-center ">
          <div className="bg-white p-8 rounded-lg">
            <h3 className="text-lg font-bold mb-4">
              آیا از حذف{" "}
              <span className="text-blue-400 font-bold mx-1">{actualName}</span>{" "}
              مطمئن هستید؟
            </h3>
            <div className="flex gap-4 justify-start">
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

      {blogData.map((blog, index) => (
        <BlogCard key={`blog-${blog.id}-${index}`} $data={sectionData.setting}>
          {blog.image ? (
            <Image
              src={blog.image || "/assets/images/pro2.jpg"}
              alt={blog.title || "Blog image"}
              width={1000}
              height={800}
            />
          ) : null}
          <div className="content">
            <h2 className="title line-clamp-1">{blog.title}</h2>
            <div className="meta">
              <span>
                {blog.createdAt &&
                  new Intl.DateTimeFormat("fa-IR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    calendar: "persian",
                  }).format(new Date(blog.createdAt))}
              </span>
            </div>
            <div
              className="description mb-2 text-right"
              dangerouslySetInnerHTML={{
                __html: blog.content.slice(0, 50) + "...",
              }}
            />
            <a href="#" className="read-more">
              مطالعه بیشتر
            </a>
          </div>
        </BlogCard>
      ))}
    </SectionBlogList>
  );
};

export default BlogList;
