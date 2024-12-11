"use client";
import React, { useEffect, useState } from "react";
import { Preview } from "./preview";
import { Form } from "./form";
import data from "../../public/template/null.json";
import smData from "../../public/template/nullSm.json";
import Image from "next/image";
import {
  AboutChildren,
  BlogChildren,
  BlogDetailChildren,
  DetailPageChildren,
  Layout,
  StoreChildren,
} from "../../lib/types";
import About from "@/public/template/about.json";
import Contact from "@/public/template/contact.json";
import Store from "@/public/template/product.json";
import DetailPage from "@/public/template/detail.json";
import Blog from "@/public/template/blog.json";
import BlogDetail from "@/public/template/blogDetail.json";
import { motion } from "framer-motion";
import Link from "next/link";

export const Main = () => {
  const Data = data as unknown as Layout;
  const [loading, setLoading] = useState(true);
  const [layout, setLayout] = useState<Layout>(Data);
  const [smLayout, setSmLayout] = useState<Layout>(smData as unknown as Layout);
  const [activeMode, setActiveMode] = useState<"sm" | "lg">("lg");
  const [previewWidth, setPreviewWidth] = useState<"sm" | "default">("default");
  const [selectedComponent, setSelectedComponent] =
    useState<string>("sectionHeader");
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [orders, setOrders] = useState<string[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string>("home");
  useEffect(() => {
    setLoading(false);
    const currentLayoutData = activeMode === "sm" ? smData : Data;

    if (selectedRoute === "about") {
      setLayout((prevLayout: Layout) => ({
        ...prevLayout,
        sections: {
          ...prevLayout.sections,
          children: About.children as AboutChildren,
        },
      }));
    } else if (selectedRoute === "contact") {
      setLayout((prevLayout: Layout) => ({
        ...prevLayout,
        sections: {
          ...prevLayout.sections,
          children: Contact.children as AboutChildren,
        },
      }));
    } else if (selectedRoute === "DetailPage") {
      setLayout((prevLayout: Layout) => ({
        ...prevLayout,
        sections: {
          ...prevLayout.sections,
          children: DetailPage.children as DetailPageChildren,
        },
      }));
    } else if (selectedRoute === "store") {
      setLayout((prevLayout: Layout) => ({
        ...prevLayout,
        sections: {
          ...prevLayout.sections,
          children: Store.children as StoreChildren,
        },
      }));
      console.log(layout);
    } else if (selectedRoute === "BlogList") {
      setLayout((prevLayout: Layout) => ({
        ...prevLayout,
        sections: {
          ...prevLayout.sections,
          children: Blog.children as BlogChildren,
        },
      }));
    } else if (selectedRoute === "BlogDetail") {
      setLayout((prevLayout: Layout) => ({
        ...prevLayout,
        sections: {
          ...prevLayout.sections,
          children: BlogDetail.children as BlogDetailChildren,
        },
      }));
    } else {
      setLayout((prevLayout) => ({
        ...prevLayout,
        sections: {
          ...prevLayout.sections,
          children: currentLayoutData.sections.children,
        },
      }));
    }
    console.log(layout);
  }, [selectedRoute, activeMode]);

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      console.log("Saving mode:", activeMode);

      const response = await fetch("/api/saveLayout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          mode: activeMode,
          layout: activeMode === "sm" ? smLayout : layout,
        }),
      });

      const result = await response.json(); // Get response data
      console.log("Save response:", result); // Debug log
      if (!response.ok) {
        throw new Error("Failed to save layout");
      }

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Error saving layout:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  };
  const handleModeChange = (mode: "lg" | "sm") => {
    setActiveMode(mode);
    const newLayout = mode === "sm" ? smLayout : Data;
    setLayout(newLayout);
  };
  return (
    <div>
      {loading ? (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white bg-opacity-90 z-50">
          <div className="flex space-x-2">
            <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen ">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
              background:
                "radial-gradient(circle at var(--x) var(--y), #4facfe 0%, #0052D4 50%)",
              transition: { duration: 0.3 },
            }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              e.currentTarget.style.setProperty("--x", `${x}%`);
              e.currentTarget.style.setProperty("--y", `${y}%`);
            }}
            className="sticky top-0 z-50  backdrop-blur-2xl bg-gradient-to-br from-[#0052D4] to-[#6FB1FC] shadow-md cursor-pointer"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <div className="flex flex-col sm:flex-row items-center justify-around py-4 space-y-4 sm:space-y-0">
                <motion.button
                  className={`w-full sm:w-auto bg-pink-400 text-white lg:-ml-12 px-3 py-2.5 rounded-full font-medium transition-all duration-300 transform`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/">نمایش سایت</Link>
                </motion.button>
                {/* Save Button with Animation */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  disabled={saveStatus === "saving"}
                  className={`w-full sm:w-auto lg:-ml-12 px-3 py-2.5 rounded-full font-medium transition-all duration-300 transform
                  ${
                    saveStatus === "saving"
                      ? "bg-blue-900"
                      : saveStatus === "saved"
                      ? "bg-green-500"
                      : saveStatus === "error"
                      ? "bg-red-500"
                      : "bg-gradient-to-r from-blue-200 to-blue-600 hover:from-blue-600 hover:to-blue-200"
                  }
                  text-white shadow-md hover:shadow-lg`}
                >
                  {saveStatus === "saving"
                    ? "...در حال ذخیره"
                    : saveStatus === "saved"
                    ? " ! ذخیره شد "
                    : saveStatus === "error"
                    ? "ارور"
                    : "ذخیره تنظیمات"}
                </motion.button>

                {/* View Mode Toggles */}
                <div className="flex items-center flex-row-reverse space-x-3">
                  <span className="text-sm text-gray-50 ml-2 hidden lg:block font-semibold">
                    : تنظیمات پیش نمایش
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleModeChange("sm")}
                    className={`p-2 rounded-lg hidden lg:block transition-all duration-300 shadow-md hover:shadow-gray-500
                    ${
                      previewWidth === "sm"
                        ? "bg-yellow-500 shadow-lg"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    <Image
                      onClick={() => setPreviewWidth("sm")}
                      src="/assets/images/smartphone.png"
                      alt="Mobile View"
                      width={24}
                      height={24}
                      className="transform transition-transform"
                    />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleModeChange("lg")}
                    className={`p-2 rounded-lg hidden lg:block transition-all duration-300 shadow-md hover:shadow-gray-500
                    ${
                      previewWidth === "default"
                        ? "bg-yellow-500 shadow-lg"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    <Image
                      src="/assets/images/computer.png"
                      onClick={() => setPreviewWidth("default")}
                      alt="Desktop View"
                      width={24}
                      height={24}
                      className="transform transition-transform"
                    />
                  </motion.button>
                </div>

                {/* Route Selector */}
                <label
                  htmlFor="page-settings"
                  className="lg:-ml-80 text-sm block lg:hidden text-gray-50 font-semibold"
                >
                  : تنظیمات صفحه
                </label>
                <motion.select
                  whileHover={{ scale: 1.02 }}
                  dir="rtl"
                  id="page-settings"
                  value={selectedRoute}
                  onChange={(e) => setSelectedRoute(e.target.value)}
                  className="w-full  sm:w-40 px-2 py-1 bg-gray-200 rounded-xl border-2 border-gray-200 
                   shadow-sm focus:border-gray-200 focus:ring-2 focus:ring-gray-200 
                  transition-all duration-300"
                >
                  <option value="home">خانه</option>
                  <option value="about">درباره </option>
                  <option value="contact">ارتباط</option>
                  <option value="store">فروشگاه</option>
                  <option value="DetailPage">جزِئیات محصول</option>
                  <option value="BlogList">وبلاگ</option>
                  <option value="BlogDetail">جزئیات وبلاگ </option>
                </motion.select>
                <label
                  htmlFor="page-settings"
                  className="lg:-ml-36 hidden lg:block lg:border-t-black text-sm text-gray-50 font-semibold"
                >
                  : تنظیمات صفحه
                </label>
              </div>
            </div>
          </motion.div>
          <Preview
            layout={layout}
            setSelectedComponent={setSelectedComponent}
            orders={orders}
            selectedComponent={selectedComponent}
            setLayout={setLayout}
            previewWidth={previewWidth}
            setPreviewWidth={setPreviewWidth}
          />
          <Form
            selectedComponent={selectedComponent}
            setLayout={setLayout}
            layout={layout}
            orders={orders}
            setOrders={setOrders}
          />
        </div>
      )}
    </div>
  );
};
