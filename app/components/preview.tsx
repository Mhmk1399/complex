import React, { useState } from "react";
import Header from "./sections/header";
import RichText from "./sections/richText";
import Banner from "./sections/banner";
import ImageText from "./sections/imageText";
import Video from "./sections/video";
import ContactForm from "./sections/contactForm";
import NewsLetter from "./sections/newsLetter";
import CollapseFaq from "./sections/collapseFaq";
import MultiColumn from "./sections/multiColumn";
import SlideShow from "./sections/slideShow";
import MultiRow from "./sections/multiRow";
import { Layout } from "@/lib/types";
import Footer from "./sections/footer";
import ProductList from "./sections/productList";
import DetailPage from "./sections/detailPage";
import { Collection } from "./sections/collection";
import BlogList from "./sections/blogList";
import BlogDetail from "./sections/blogDetail";
import Image from "next/image";

// First update the PreviewProps interface
interface PreviewProps {
  layout: Layout;
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  orders: string[];
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
}

// Then use it in the component
export const Preview: React.FC<PreviewProps> = ({
  layout,
  setSelectedComponent,
  orders,
  selectedComponent,
  setLayout,
}) => {
  const [previewWidth, setPreviewWidth] = useState<"sm" | "default">("default");

  const componentMap = {
    Header,
    RichText,
    Banner,
    ImageText,
    Video,
    ContactForm,
    NewsLetter,
    CollapseFaq,
    MultiColumn,
    SlideShow,
    MultiRow,
    ProductList,
    DetailPage,
    Collection,
    BlogList,
    BlogDetail,
  };

  return (
    <div>
      {/* Buttons to toggle preview size */}
      <div className="flex items-center flex-row-reverse justify-center mr-56 gap-4 p-2 border-b-2 border-gray-200">
        <span className="hidden lg:block text-gray-500 font-bold">: تنظیمات پیش نمایش </span>

        <button
        title="حالت گوشی"
          onClick={() => setPreviewWidth("sm")}
          className={`px-4 py-2 rounded hidden lg:block ${
            previewWidth === "sm" ? "bg-blue-400 text-white" : "bg-gray-200"
          }`}
        >
          <Image
            src="/assets/images/smartphone.png"
            alt="Small Mode"
            width={20}
            height={20}
          />
        </button>
        <button
        title="حالت سیستم"
          onClick={() => setPreviewWidth("default")}
          className={`px-4 py-2 rounded hidden lg:block ${
            previewWidth === "default"
              ? "bg-blue-400 text-white"
              : "bg-gray-200"
          }`}
        >
          <Image
            src="/assets/images/computer.png"
            alt="Small Mode"
            width={20}
            height={20}
          />
        </button>
      </div>

      {/* Preview Container */}

      <div
        className={`flex relative justify-center ${
          previewWidth === "default" ? "flex-col" : "mr-64"
        }`}
      >
        {/* Add this wrapper */}
        <div
          className={`h-[90vh] relative border border-gray-200 rounded-lg overflow-y-auto scrollbar-hide lg:mt-1 lg:ml-5 ${
            previewWidth === "sm" ? "w-[425px]" : "w-full lg:w-[75%]"
          }`}
        >
          <Header
            setSelectedComponent={setSelectedComponent}
            layout={layout}
            selectedComponent={selectedComponent}
            previewWidth={previewWidth} // Pass the state to components
          />
          <div className="grid grid-cols-1 mt-32">
            {orders.map((componentName, index) => {
              const baseComponentName = componentName.split("-")[0];
              const Component =
                componentMap[baseComponentName as keyof typeof componentMap];

              return Component ? (
                <div
                  key={componentName} // Using the full componentName which includes the UUID
                  style={{ order: index }}
                  className="w-full"
                >
                  <Component
                    setSelectedComponent={setSelectedComponent}
                    layout={layout}
                    actualName={componentName}
                    selectedComponent={selectedComponent}
                    setLayout={setLayout}
                    productId={"674c044a7e265babdd061919"}
                    blogId={"674dc8d6cf4d515adfa1a31f"}
                    previewWidth={previewWidth} // Pass the state to components
                  />
                </div>
              ) : null;
            })}
          </div>
          <Footer
            setSelectedComponent={setSelectedComponent}
            layout={layout}
            selectedComponent={selectedComponent}
            previewWidth={previewWidth} // Pass the state to components
          />
        </div>
      </div>
    </div>
  );
};
