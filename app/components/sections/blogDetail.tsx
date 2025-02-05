"use client";
import React, { useEffect, useState } from "react";
import { BlogDetailSection, Layout } from "@/lib/types";
import Image from "next/image";
import { styled } from "styled-components";
import { Delete } from "../C-D";

interface BlogDetailProps {
  blogId: string;
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
}

interface BlogData {
  title: string;
  content: string;
  coverImage: string;
  author: string;
  createdAt: string;
}

const SectionBlogDetail = styled.div<{
  $data: BlogDetailSection;
}>`
  padding-top: ${(props) => props.$data?.setting?.paddingTop || 0}px;
  padding-bottom: ${(props) => props.$data?.setting?.paddingBottom || 0}px;
  padding-left: ${(props) => props.$data?.setting?.paddingLeft || 0}px;
  padding-right: ${(props) => props.$data?.setting?.paddingRight || 0}px;
  margin-top: ${(props) => props.$data?.setting?.marginTop || 0}px;
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom || 0}px;
  background-color: ${(props) =>
    props.$data?.setting?.backgroundColor || "#ffffff"};

  .blog-title {
    color: ${(props) => props.$data?.setting?.titleColor || "#1A1A1A"};
    font-size: ${(props) => props.$data?.setting?.titleFontSize || 36}px;
    font-weight: bold;
  }

  .blog-content {
    color: ${(props) => props.$data?.setting?.contentColor || "#2C2C2C"};
    font-size: ${(props) => props.$data?.setting?.contentFontSize || 18}px;
    line-height: 1.8;
  }

  .cover-image {
    width: ${(props) => props.$data?.setting?.coverImageWidth || 600}px;
    height: ${(props) => props.$data?.setting?.coverImageHeight || 400}px;
    position: relative;
    border-radius: ${(props) => props.$data?.setting?.imageRadius || 0}px;
    overflow: hidden;
    margin-bottom: 24px;
  }
  .blog-meta {
    color: ${(props) => props.$data?.setting?.metaColor || "#2C2C2C"};
    font-size: ${(props) => props.$data?.setting?.metaFontSize || 16}px;
    margin-bottom: 12px;
  }
`;

const BlogDetail: React.FC<BlogDetailProps> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
  setLayout,
}) => {
  const [blog, setBlog] = useState<BlogData>({
    title: "",
    content: "",
    coverImage: "/assets/images/pro3.jpg",
    author: "",
    createdAt: "",
  });
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs`); // Fetching blog with ID 1
        const data = await response.json();
        setBlog(data.blogs[0]);
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, []);

  const sectionData = layout?.sections?.children?.sections?.find(
    (section) => section.type === actualName
  ) as BlogDetailSection;

  if (!sectionData) {
    return null;
  }

  if (loading) return <div>Loading...</div>;
  if (!blog) return <div>Blog not found</div>;

  return (
    <SectionBlogDetail
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
              مطمئن هستید؟
              <span className="text-blue-400 font-bold mx-1">
                {actualName}
              </span>{" "}
              آیا از حذف{" "}
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
      <div className="cover-image flex mx-auto items-center">
        <Image
          src={blog.coverImage ? blog.coverImage : "/assets/images/pro3.jpg"}
          alt={blog.title}
          fill
          className="object-cover"
        />
      </div>

      <h1 className="blog-title text-right">{blog.title}</h1>

      <div className="blog-meta text-right">
        <span>{blog.author} : نویسنده </span>
        <br />
        <span>
          تاریخ :
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
        className="blog-content text-right"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </SectionBlogDetail>
  );
};

export default BlogDetail;
