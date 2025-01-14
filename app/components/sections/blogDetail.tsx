"use client";
import React, { useEffect, useState } from "react";
import {  BlogDetailSection, Layout } from "@/lib/types";
import Image from "next/image";
import { styled } from "styled-components";

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
`;

const BlogDetail: React.FC<BlogDetailProps> = ({
  layout,
  actualName,
}) => {
  const [blog, setBlog] = useState<BlogData>({
    title: "",
    content: "",
    coverImage: "/assets/images/pro3.jpg",
    author: "",
    createdAt: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs`); // Fetching blog with ID 1
        const data = await response.json();
        console.log("data", data);
        
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
    >
     
      <div className="cover-image flex mx-auto items-center">
        <Image
          src={blog.coverImage ? blog.coverImage : "/assets/images/pro3.jpg"}
          alt={blog.title}
          fill
          className="object-cover"
        />
      </div>

      <h1 className="blog-title mb-6 mr-2">{blog.title}</h1>

      <div className="blog-content mr-2">{blog.content}</div>
      <div className="flex flex-col items-center gap-4 mb-8 mr-2">
        <span>{blog.author}نویسنده : </span>
        <span>{blog.createdAt}</span>
      </div>
    </SectionBlogDetail>
  );
};

export default BlogDetail;
