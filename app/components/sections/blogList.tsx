"use client";
import styled from "styled-components";
import { Delete } from "../C-D";
import {
  BlogListSection,
  BlogListSetting,
  BlogSection,
  Layout,
} from "@/lib/types";
import { useEffect, useState } from "react";
import Image from "next/image";

interface BlogListProps {
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
}
interface BlogData {
  blogId: number;
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  author: string;
  date: string;
  btnText: string;
  btnLink: string;
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
  height: 70%;
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
    font-size: 1.25rem;
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
    color: #000000;
    margin-bottom: 15px;
    color: ${(props) => props.$data?.textColor};
  }

  .read-more {
    display: inline-block;
    padding: 8px 16px;
    background: #0070f3;
    color: ${(props) => props.$data?.buttonColor};
    border-radius: 4px;
    text-decoration: none;
    transition: background 0.3s ease;
    background: ${(props) => props.$data?.btnBackgroundColor};

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

  // Add this useEffect to fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blogs", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        const blogInfo = data.blogs.map((blog: BlogData) => ({
          ...blog,
          // btnText: "مطالعه بیشتر",
          btnLink: `/blog/${blog.blogId}`,
          imageSrc: "/assets/images/pro3.jpg", // Add a default image
          imageAlt: blog.title,
          description: blog.description,
        }));
        setBlogData(blogInfo);
        console.log(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
          ? "border-4 border-blue-500 rounded-lg shadow-lg"
          : ""
      }`}
    >
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h3 className="text-lg font-bold mb-4">
              آیا از حذف
              <span className="text-blue-400 font-bold mx-1">{actualName}</span>
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
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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

      {actualName === selectedComponent && (
        <div className="absolute w-fit -top-5 -left-1 z-10 flex flex-row-reverse">
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
      )}

      {blogData.map((blog, index) => (
        // Inside BlogCard component:
        <BlogCard
          key={`blog-${blog.blogId}-${index}`}
          $data={sectionData.setting}
        >
          {blog.imageSrc ? (
            <Image
              src={blog.imageSrc || "/assets/images/pro2.jpg"}
              alt={blog.imageAlt || "Blog image"}
              width={1000}
              height={800}
            />
          ) : null}
          <div className="content">
            <h2 className="title">{blog.title}</h2>
            <div className="meta">
              {/* Display all available author info */}
              <span>{blog.author}نویسنده : </span>
              <span>{blog.date}</span>
            </div>
            {/* Display any text content available */}
            {Object.entries(blog)
              .filter(
                ([key, value]) =>
                  typeof value === "string" && !["title"].includes(key)
              )
              .map(([key, value]) => (
                <p key={key} className="description mb-2">
                  <span className="font-bold">{key}: </span>
                  {value}
                  {blog.description}
                </p>
              ))}
            <a href={blog.btnLink} className="read-more">
              {blog.btnText || "مطالعه بیشتر"}
            </a>
          </div>
        </BlogCard>
      ))}
    </SectionBlogList>
  );
};

export default BlogList;
