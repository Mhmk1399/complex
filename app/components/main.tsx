"use client";
import React, { useEffect, useState } from "react";
import { Preview } from "./preview";
import { Form } from "./form";
import smData from "../../public/template/nullSm.json";
import Image from "next/image";
import nullJson from "../../public/template/null.json";
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
// Example client-side code to send the token to the server

export const Main = () => {
  const [Data , setData] = useState<Layout>(nullJson as unknown as Layout);
  const [loading, setLoading] = useState(true);
  const [layout, setLayout] = useState<Layout>(Data);
  const [smLayout] = useState<Layout>(smData as unknown as Layout);
  const [activeMode, setActiveMode] = useState<"sm" | "lg">("lg");
  const [previewWidth, setPreviewWidth] = useState<"sm" | "default">("default");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] =
    useState<string>("");
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [orders, setOrders] = useState<string[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string>("home");
  const [activeRoutes, setActiveRoutes] = useState([
  { value: 'home', name: '' },
  { value: 'about', name: 'درباره' },
  { value: 'contact', name: 'ارتباط' },
  { value: 'store', name: 'فروشگاه' },
  { value: 'DetailPage', name: 'جزئیات' },
  { value: 'BlogList', name: 'وبلاگ' },
  { value: 'BlogDetail', name: 'وبلاگ' }]);
  const handleAddRoute = (newRoute: { value: string, name: string }) => {
    setActiveRoutes(prevRoutes => [...prevRoutes, newRoute]);
  };

// Replace the direct import with API call
const sendTokenToServer = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('Token not found in local storage');
    return;
  }

  try {
    const response = await fetch('/api/layout-jason', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'selectedRoute': selectedRoute,
        'activeMode': activeMode
      }
    });

    if (!response.ok) {
      console.log('Server responded with an error:', response.statusText);
      return;
    }

    const data = await response.json().catch(() => {
      console.log('Failed to parse response as JSON');
      return null;
    });

    if (data) {
      setLayout(data); 
      setData(data);
      setLoading(false)
      console.log('Layout data fetched:', data);
      
    }
    

  } catch (error) {
    console.log('Error sending token to server:', error);
  }
};

useEffect(() => {
  setLoading(true)
  sendTokenToServer();
}, []);

useEffect(() => {
  setLoading(true)
  sendTokenToServer();
}, [activeMode, selectedRoute]);


  useEffect(() => {
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
          children: DetailPage.children  as DetailPageChildren,
        },
      }));
    } else if (selectedRoute === "store") {
      setLayout((prevLayout: Layout) => ({
        ...prevLayout,
        sections: {
          ...prevLayout.sections,
          children: Store.children  as StoreChildren,
        },
      }));
    } else if (selectedRoute === "BlogList") {
      setLayout((prevLayout: Layout) => ({
        ...prevLayout,
        sections: {
          ...prevLayout.sections,
          children: Blog.children as  BlogChildren,
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
      setLayout((prevLayout: Layout) => ({
        ...prevLayout,
        sections: {
          ...prevLayout.sections,
          children: currentLayoutData.sections.children as Layout['sections']['children'],
        },
      }));
    }
  }, [selectedRoute, activeMode ]);

  const [newRouteName, setNewRouteName] = useState('');
  const [newRouteValue, setNewRouteValue] = useState('');
  useEffect(() => {
    setLoading(false);
    const currentLayoutData = activeMode === "sm" ? smData : Data;

    const routeConfigs = {
      about: About.children as AboutChildren,
      contact: Contact.children as AboutChildren,
      DetailPage: DetailPage.children as  DetailPageChildren,
      store: Store.children as StoreChildren,
      BlogList: Blog.children  as BlogChildren,
      BlogDetail: BlogDetail.children as BlogDetailChildren,
      // Add default case for custom routes
      default: currentLayoutData.sections.children}

    const children = routeConfigs[selectedRoute as keyof typeof routeConfigs] || routeConfigs.default;

    if (children) {
      setLayout((prevLayout: Layout) => ({
        ...prevLayout,
        sections: {
          ...prevLayout.sections,
          children: children as Layout['sections']['children'],
        },
      }));
    }
  }, [selectedRoute, activeMode])
  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      const response = await fetch("/api/layout-jason", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'selectedRoute': selectedRoute,
          'activeMode': activeMode
        },
        body: JSON.stringify(layout),
      });
  
      const result = await response.json(); // Get response data
      console.log("Save response:", result); // Debug log
      if (!response.ok) {
        throw new Error("Failed to save layout");
      }
  
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.log("Error saving layout:", error);
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
        <div className="fixed top-0 left-0 w-[75%] h-full flex fle justify-center items-center bg-white bg-opacity-90 z-50">
          <div className="flex space-x-1">
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
            className="sticky top-0 z-50  backdrop-blur-2xl bg-gradient-to-br from-[#0052D4] to-[#6FB1FC]
             shadow-md cursor-pointer">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <div className="flex flex-col sm:flex-row items-center justify-center py-4 gap-x-5 space-y-4 sm:space-y-0">
                <motion.button
                  className={`w-full sm:w-auto bg-pink-400 text-white lg:-ml-12 px-3 py-2.5 rounded-full font-medium 
                    transition-all duration-300 transform`}
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
                  className={`w-fitlg:-ml-12 px-3 py-2.5 rounded-full font-medium transition-all duration-300 transform
                  ${saveStatus === "saving"
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
                    ${previewWidth === "sm"
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
                    ${previewWidth === "default"
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
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsModalOpen(true)}
                  className="px-3 py-2 bg-blue-500 text-white rounded-xl shadow-md hover:bg-blue-600"
                >
                  افزودن مسیر
                </motion.button>



                <motion.select
                  whileHover={{ scale: 1.02 }}
                  dir="rtl"
                  id="page-settings"
                  value={selectedRoute}
                  onChange={(e) => setSelectedRoute(e.target.value)}
                  className="w-[100px]  px-2 py-1 bg-gray-200 rounded-xl border-2 border-gray-200 
             shadow-sm focus:border-gray-200 focus:ring-2 focus:ring-gray-200 
             transition-all duration-300"
                >
                  {activeRoutes.map((route) => (
                    <option key={route.value} value={route.value}>
                      {route.name || route.value}
                    </option>
                  ))}
                </motion.select>

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
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-xl shadow-lg w-96"
          >
            <h3 className="text-lg font-bold mb-4 text-right">افزودن مسیر جدید</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="نام مسیر"
                value={newRouteName}
                onChange={(e) => setNewRouteName(e.target.value)}
                className="w-full p-2 border rounded-lg"
                dir="rtl"
              />
              <input
                type="text"
                placeholder="آدرس مسیر"
                value={newRouteValue}
                onChange={(e) => setNewRouteValue(e.target.value)}
                className="w-full p-2 border rounded-lg"
                dir="rtl"
              />
              <div className="flex justify-end space-x-2 space-x-reverse">
                <button
                  onClick={() => {
                    handleAddRoute({ value: newRouteValue, name: newRouteName });
                    setNewRouteName('');
                    setNewRouteValue('');
                    setIsModalOpen(false);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  ذخیره
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  انصراف
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
