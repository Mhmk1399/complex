"use client";
import React, { useEffect, useRef, useState } from "react";
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
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TourGuide from "./sections/guideTour";

export const Main = () => {
  const [Data, setData] = useState<Layout>(nullJson as unknown as Layout);
  // const [loading, setLoading] = useState(true);
  const [layout, setLayout] = useState<Layout>(Data);
  const [activeMode, setActiveMode] = useState<"sm" | "lg">("lg");
  const [previewWidth, setPreviewWidth] = useState<"sm" | "default">("default");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<string>("");
  const [activeElement, setActiveElement] = useState<
    "save" | "delete" | "preview" | "sitePreview" | "addRoute" | "changeRoute"
  >("save");

  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [orders, setOrders] = useState<string[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string>("home");
  const [activeRoutes, setActiveRoutes] = useState([
    "home",
    "about",
    "contact",
  ]);

  const handleAddRoute = async ({ name }: { name: string }) => {
    console.log(setData)
    if (routes.includes(name)) {
      toast.error("Route already exists!", { autoClose: 3000 });
      return;
    }


    try {
      const response = await fetch("/api/route-handler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "new-route": name,
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("Failed to add route");
      }

      const result = await response.json();
      console.log("Route added successfully:", result);
      fetchRoutes(); // Fetch updated routes
      toast.success("Route added successfully!", { autoClose: 3000 });
    } catch (error) {
      console.error("Error adding route:", error);
      toast.error("Failed to add route!", { autoClose: 3000 });
    }


    fetch("/api/route-handler", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          console.log("Server responded with an error:", response.statusText);
          return null;
        }

        return response.json();
      })
      .then((data) => {
        if (data) {
          setActiveRoutes(data);
          console.log("Route data:", data);
        }
      })
      .catch((error) => {
        console.log("Error sending token to server:", error);
      });
    fetchRoutes();
  };
  useEffect(() => {



    fetch("/api/route-handler", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          console.log("Server responded with an error:", response.statusText);
          return null;
        }

        return response.json();
      })
      .then((data) => {
        if (data) {
          setActiveRoutes(data);
          console.log("Route data:", data);
        }
      })
      .catch((error) => {
        console.log("Error sending token to server:", error);
      });
  }, [selectedRoute, activeMode]);

  // Replace the direct import with API call
  const sendTokenToServer = async () => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const repoUrl = urlParams.get('repoUrl');
  
    try {
      const response = await fetch("/api/layout-jason", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "selectedRoute": selectedRoute,
          "activeMode": activeMode,
          "repoUrl": repoUrl || '', // Pass the extracted repoUrl
        },
      });
  
      if (!response.ok) {
        console.log("Server responded with an error:", response.statusText);
        return;
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("Error sending request:", error);
    }
  };
  

  useEffect(() => {
    // setLoading(true);
    sendTokenToServer();
  }, []);

  useEffect(() => {
    sendTokenToServer();
  }, [activeMode, selectedRoute]);

  const [newRouteName, setNewRouteName] = useState("");
  useEffect(() => {
    const currentLayoutData = activeMode === "sm" ? smData : Data;

    const routeConfigs = {
      about: About.children as AboutChildren,
      contact: Contact.children as AboutChildren,
      DetailPage: DetailPage.children as DetailPageChildren,
      store: Store.children as StoreChildren,
      BlogList: Blog.children as BlogChildren,
      BlogDetail: BlogDetail.children as BlogDetailChildren,
      // Add default case for custom routes
      default: currentLayoutData.sections.children,
    };

    const children =
      routeConfigs[selectedRoute as keyof typeof routeConfigs] ||
      routeConfigs.default;

    if (children) {
      setLayout((prevLayout: Layout) => ({
        ...prevLayout,
        sections: {
          ...prevLayout.sections,
          children: children as Layout["sections"]["children"],
        },
      }));
    }
  }, [selectedRoute, activeMode]);
  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      const response = await fetch("/api/layout-jason", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          selectedRoute: selectedRoute,
          activeMode: activeMode,
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
  };
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [routes, setRoutes] = useState<string[]>([]);
  const fetchRoutes = async () => {

    try {
      const response = await fetch("/api/route-handler", {
        method: "GET",
        headers: {
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch routes");
      }

      const result = await response.json();
      setRoutes(result);
      setActiveRoutes(result);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };
  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleDeleteRoute = async () => {


    try {
      const response = await fetch("/api/route-handler", {
        method: "DELETE",
        headers: {
          route: selectedRoute,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete route");
      }

      const result = await response.json();
      console.log("Route deleted successfully:", result);
      fetchRoutes(); // Fetch updated routes
      setSelectedRoute("home");
      toast.success("Route deleted successfully!", { autoClose: 3000 });
    } catch (error) {
      console.log("Error deleting route:", error);
      toast.error("Failed to delete route!", { autoClose: 3000 });
    }
    fetchRoutes();
    setSelectedRoute("home");
    sendTokenToServer();
  };
  // Add this useEffect to control the guide flow

  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const addRouteButtonRef = useRef<HTMLButtonElement>(null);
  const deleteRouteButtonRef = useRef<HTMLButtonElement>(null);
  const changeRouteRef = useRef<HTMLSelectElement>(null);
  const previewToggleRef = useRef<HTMLDivElement>(null);
  const sitePreviewRef = useRef<HTMLButtonElement>(null);

  const getHighlightClass = (
    ref: React.RefObject<HTMLButtonElement | HTMLDivElement | HTMLSelectElement>
  ) => {
   
    if (ref.current && activeElement === ref.current.id) {
      return "ring-4 ring-purple-600 ring-offset-2 animate-pulse scale-110 transition-all duration-300 z-50";
    }

    return "";
  };

  return (
    <div>
      {/* {loading ? (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white bg-opacity-90 z-50">
          <div className="card">
            <div className="loader">
              <p>loading</p>
              <div className="words px-2">
                <span className="word font-thin italic">buttons</span>
                <span className="word font-thin italic">forms</span>
                <span className="word font-thin italic">switches</span>
                <span className="word font-thin italic">cards</span>
                <span className="word font-thin italic">buttons</span>
              </div>
            </div>
          </div>
        </div>
      ) : ( */}
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
          className="sticky top-0 z-50 backdrop-blur-2xl bg-gradient-to-br from-[#0052D4] to-[#6FB1FC]
             shadow-md cursor-pointer"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 ">
            <div className="flex lg:flex-row flex-wrap  items-center justify-center py-4 gap-x-5 space-y-4 sm:space-y-0">
              <motion.button
                id="sitePreview"
                className={` ${getHighlightClass(
                  sitePreviewRef
                )} lg:w-auto bg-pink-400  text-white lg:-ml-12 px-3 py-2.5 mt-4 md:mt-0 rounded-full font-medium 
                    transition-all duration-300 transform`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                ref={sitePreviewRef}
              >
                <Link href="/">نمایش سایت</Link>
              </motion.button>
              {/* Save Button with Animation */}
              <motion.button
                id="save"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                ref={saveButtonRef}
                disabled={saveStatus === "saving"}
                className={`w-fitlg:-ml-12 ${getHighlightClass(
                  saveButtonRef
                )} px-3 py-2.5 rounded-full font-medium transition-all duration-300 transform
                  ${
                    saveStatus === "saving"
                      ? "bg-blue-900"
                      : saveStatus === "saved"
                      ? "bg-green-500"
                      : saveStatus === "error"
                      ? "bg-red-500"
                      : "bg-[#FFBF00] hover:bg-yellow-200"
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
              <div
                id="preview"
                ref={previewToggleRef}
                className={`flex ${getHighlightClass(
                  previewToggleRef
                )} items-center flex-row-reverse space-x-3`}
              >
                <span className="text-sm text-gray-50 ml-2 hidden lg:block font-semibold">
                  : تنظیمات پیش نمایش
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleModeChange("sm")}
                  className={`p-2 rounded-lg hidden  lg:block transition-all duration-300 shadow-md hover:shadow-gray-500
                    ${
                      previewWidth === "sm"
                        ? "bg-yellow-600 shadow-lg"
                        : "bg-[#FFBF00] hover:bg-gray-300"
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
                        ? "bg-yellow-600 shadow-lg"
                        : "bg-[#FFBF00] hover:bg-gray-300"
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
                id="addRoute"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                ref={addRouteButtonRef}
                className={`px-3 ${getHighlightClass(
                  addRouteButtonRef
                )} py-2 bg-[#32936F] text-white rounded-xl shadow-md hover:bg-green-400`}
              >
                افزودن مسیر
              </motion.button>

              <motion.button
                id="delete"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                ref={deleteRouteButtonRef}
                onClick={() => setIsDeleteModalOpen(true)}
                className={`px-3 ${getHighlightClass(
                  deleteRouteButtonRef
                )} py-2 bg-[#E83F6F] text-white rounded-xl shadow-md hover:bg-red-600`}
              >
                حذف مسیر
              </motion.button>

              <motion.select
                whileHover={{ scale: 1.02 }}
                dir="rtl"
                ref={changeRouteRef}
                id="changeRoute"
                value={selectedRoute}
                onChange={(e) => setSelectedRoute(e.target.value)}
                className={`w-[100px] ${getHighlightClass(
                  changeRouteRef
                )} px-2 py-1 bg-gray-200 rounded-xl border-2 border-gray-200 
             shadow-sm focus:border-gray-200 focus:ring-2 focus:ring-gray-200 
             transition-all duration-300`}
              >
                {activeRoutes.map((route, index) => (
                  <option key={index} value={route}>
                    {route}
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
      {/* )} */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-xl shadow-lg w-96"
          >
            <h3 className="text-lg font-bold mb-4 text-right">
              افزودن مسیر جدید
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="نام مسیر"
                value={newRouteName}
                onChange={(e) => {
                  setNewRouteName(e.target.value);
                  console.log(newRouteName);
                }}
                className="w-full p-2 border rounded-lg"
                dir="rtl"
              />

              <div className="flex justify-end space-x-2 space-x-reverse">
                <button
                  onClick={() => {
                    handleAddRoute({ name: newRouteName });
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
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-xl shadow-lg w-96"
          >
            <h3 className="text-lg font-bold mb-4 text-right">حذف مسیر</h3>
            <div className="space-y-4">
              <select
                value={selectedRoute}
                onChange={(e) => setSelectedRoute(e.target.value)}
                className="w-full p-2 border rounded-lg"
                dir="rtl"
              >
                <option value="">انتخاب مسیر</option>
                {routes
                  .filter(
                    (route) => !["home", "about", "contact"].includes(route)
                  )
                  .map((route) => (
                    <option key={route} value={route}>
                      {route}
                    </option>
                  ))}
              </select>
              <div className="flex justify-end space-x-2 space-x-reverse">
                <button
                  onClick={() => {
                    handleDeleteRoute();
                    setSelectedRoute("");
                    setIsDeleteModalOpen(false);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  حذف
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  انصراف
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      <ToastContainer position="top-left" transition={Slide} />
      <TourGuide
        saveButtonRef={saveButtonRef}
        addRouteButtonRef={addRouteButtonRef}
        deleteRouteButtonRef={deleteRouteButtonRef}
        previewToggleRef={previewToggleRef}
        sitePreviewRef={sitePreviewRef}
        changeRouteRef={changeRouteRef}
        setActiveElement={setActiveElement}
      />
    </div>
  );
};
