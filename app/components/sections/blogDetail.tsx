"use client";
import React, { useEffect, useState } from "react";
import { BlogDetailSection, Layout } from "@/lib/types";
import Image from "next/image";
import { styled } from "styled-components";
import { Delete } from "../C-D";
import { createApiService } from "@/lib/api-factory";

interface BlogDetailProps {
  blogId: string;
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  layout: Layout;
  actualName: string;
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
  previewWidth: "sm" | "default";
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
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
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
    font-size: ${(props) => 
      props.$preview === "sm" 
        ? Math.max(18, (parseInt(props.$data?.setting?.titleFontSize || "36") * 0.6)) 
        : props.$data?.setting?.titleFontSize || 36}px;
    font-weight: bold;
    margin-bottom: 16px;
    
    @media (max-width: 768px) {
      font-size: ${(props) => 
        Math.max(16, (parseInt(props.$data?.setting?.titleFontSize || "36") * 0.5))}px;
    }
  }

  .blog-content {
    color: ${(props) => props.$data?.setting?.contentColor || "#2C2C2C"};
    font-size: ${(props) => 
      props.$preview === "sm" 
        ? Math.max(14, (parseInt(props.$data?.setting?.contentFontSize || "18") * 0.8)) 
        : props.$data?.setting?.contentFontSize || 18}px;
    line-height: 1.8;
    margin-top: 24px;
    
    @media (max-width: 768px) {
      font-size: ${(props) => 
        Math.max(12, (parseInt(props.$data?.setting?.contentFontSize || "18") * 0.7))}px;
    }
  }

  .blog-meta {
    color: ${(props) => props.$data?.setting?.metaColor || "#666666"};
    font-size: ${(props) => 
      props.$preview === "sm" 
        ? Math.max(12, (parseInt(props.$data?.setting?.metaFontSize || "14") * 0.9)) 
        : props.$data?.setting?.metaFontSize || 14}px;
    margin-bottom: 20px;
    
    @media (max-width: 768px) {
      font-size: ${(props) => 
        Math.max(10, (parseInt(props.$data?.setting?.metaFontSize || "14") * 0.8))}px;
    }
  }
`;

const CoverImageContainer = styled.div<{
  $data: BlogDetailSection;
  $previewWidth: "sm" | "default";
  $preview: "sm" | "default";
}>`
  width: ${(props) => 
    props.$preview === "sm" 
      ? Math.min(300, parseInt(props.$data?.setting?.coverImageWidth || "600")) 
      : props.$data?.setting?.coverImageWidth || 600}px;
  height: ${(props) => 
    props.$preview === "sm" 
      ? Math.min(200, parseInt(props.$data?.setting?.coverImageHeight || "400")) 
      : props.$data?.setting?.coverImageHeight || 400}px;
  position: relative;
  border-radius: ${(props) => props.$data?.setting?.imageRadius || 10}px;
  overflow: hidden;
  margin: 0 auto 24px auto;
  cursor: pointer;
  transition: transform 0.3s ease;

  /* Apply animations using CSS filters and properties that don't affect positioning */
  ${(props) => {
    const animation = props.$data.setting.animation;
    if (!animation) return '';
    
    const { type, animation: animConfig } = animation;
    const selector = type === 'hover' ? '&:hover' : '&:active';
    
    // Generate animation CSS based on type
    if (animConfig.type === 'pulse') {
      return `
        ${selector} {
          animation: blogImagePulse ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
        
        @keyframes blogImagePulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 1;
          }
          50% { 
            transform: scale(1.05);
            opacity: 0.8;
          }
        }
      `;
    } else if (animConfig.type === 'ping') {
      return `
        ${selector} {
          animation: blogImagePing ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
        
        @keyframes blogImagePing {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%, 100% {
            transform: scale(1.1);
            opacity: 0;
          }
        }
      `;
    } else if (animConfig.type === 'bgOpacity') {
      return `
        ${selector} {
          animation: blogImageBgOpacity ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
        
        @keyframes blogImageBgOpacity {
          0%, 100% { 
            opacity: 1;
          }
          50% { 
            opacity: 0.7;
          }
        }
      `;
    } else if (animConfig.type === 'scaleup') {
      return `
        ${selector} {
          animation: blogImageScaleup ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
        
        @keyframes blogImageScaleup {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.1);
          }
        }
      `;
    } else if (animConfig.type === 'scaledown') {
      return `
        ${selector} {
          animation: blogImageScaledown ${animConfig.duration} ${animConfig.timing} ${animConfig.delay || '0s'} ${animConfig.iterationCount || '1'};
        }
        
        @keyframes blogImageScaledown {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(0.95);
          }
        }
      `;
    }
    
    return '';
  }}

  @media (max-width: 768px) {
    width: ${(props) => 
      Math.min(280, parseInt(props.$data?.setting?.coverImageWidth || "600"))}px;
    height: ${(props) => 
      Math.min(180, parseInt(props.$data?.setting?.coverImageHeight || "400"))}px;
  }
`;

const BlogDetail: React.FC<BlogDetailProps> = ({
  setSelectedComponent,
  layout,
  actualName,
  selectedComponent,
  setLayout,
  previewWidth,
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
  const [preview, setPreview] = useState(previewWidth);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 425) {
        setPreview("sm");
      } else {
        setPreview(previewWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [previewWidth]);

  const api = createApiService({
    baseUrl: '/api',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const { data: blogData, error } = api.useGet('/blogs', {
    revalidateOnFocus: false,
    refreshInterval: 60000
  });

  useEffect(() => {
    if (blogData) {
      setBlog(blogData.blogs[0]);
      setLoading(false);
    } else if (error) {
      console.error("Error fetching blog:", error);
      setLoading(false);
    }
  }, [blogData, error]);

  const sectionData = layout?.sections?.children?.sections?.find(
    (section) => section.type === actualName
  ) as BlogDetailSection;

  if (!sectionData) {
    return null;
  }

  if (loading) return <div className="text-center py-8">در حال بارگذاری...</div>;
  if (!blog) return <div className="text-center py-8">بلاگ یافت نشد</div>;

  return (
    <SectionBlogDetail
      $data={sectionData}
      $previewWidth={previewWidth}
      $preview={preview}
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

      <CoverImageContainer
        $data={sectionData}
        $previewWidth={previewWidth}
        $preview={preview}
      >
        <Image
          src={sectionData.setting.coverImage || blog.coverImage || "/assets/images/pro3.jpg"}
          alt={blog.title}
          fill
          className="object-cover"
          priority
        />
      </CoverImageContainer>

      <h1 className="blog-title text-right">{blog.title || "عنوان بلاگ"}</h1>

      <div className="blog-meta text-right">
        <span>{blog.author || "نویسنده"} : نویسنده </span>
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
        dangerouslySetInnerHTML={{ 
          __html: blog.content || "محتوای بلاگ در اینجا نمایش داده می‌شود..." 
        }}
      />
    </SectionBlogDetail>
  );
};

export default BlogDetail;
