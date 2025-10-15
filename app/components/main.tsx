"use client";
import React, { useEffect, useRef, useState } from "react";
import { Preview } from "./preview";
import { Form } from "./form";
import Image from "next/image";
import jwt, { JwtPayload } from "jsonwebtoken";

import { AnimatePresence, motion } from "framer-motion";
import TourGuide from "./sections/guideTour";
import { useSharedContext } from "@/app/contexts/SharedContext";
import { CanvasProvider } from "../contexts/CanvasContext";
import { createApiService } from "@/lib/api-factory";
import { Layout } from "@/lib/types";
import toast from "react-hot-toast";

export const Main = () => {
  // Get shared state from context
  const {
    // selectedComponent,
    layout,
    setLayout,
    previewWidth,
    setPreviewWidth,
    activeRoutes,
    setActiveRoutes,
  } = useSharedContext();

  // Frontend cache
  interface CacheData {
    data: unknown;
    timestamp: number;
  }

  const [cache, setCache] = useState<Record<string, CacheData>>({});
  const CACHE_DURATION = 60000; // 1 minute

  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  const api = createApiService({
    baseUrl: "/api",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [routes, setRoutes] = useState<string[]>([]);
  const [activeMode, setActiveMode] = useState<"sm" | "lg">("sm");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeElement, setActiveElement] = useState<
    | "save"
    | "delete"
    | "preview"
    | "sitePreview"
    | "addRoute"
    | "changeRoute"
    | "seo"
    | "routeName"
  >("save");
  // Removed isFormOpen state - now using context
  const [newRouteName, setNewRouteName] = useState("");
  const [isMetaDataModalOpen, setIsMetaDataModalOpen] = useState(false);

  const [metaData, setMetaData] = useState({
    title: "",
    description: "",
  });

  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  // Removed orders state - now using context
  const [selectedRoute, setSelectedRoute] = useState<string>("home");

  // site of the vendor on the userwebsite
  const handleSiteView = () => {
    const token = getAuthToken();
    if (!token) {
      toast.error("توکن یافت نشد");
      return;
    }

    try {
      const decoded = jwt.decode(token) as JwtPayload;
      const storeId = decoded?.storeId;

      if (!storeId) {
        toast.error("شناسه فروشگاه یافت نشد");
        return;
      }

      const isDev = process.env.NODE_ENV === "development";
      const siteUrl = isDev
        ? `http://localhost:3002` // Development URL
        : `https://${storeId}.tomakdigitalagency.ir`; // Production URL
      window.open(siteUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.log("Error decoding token:", error);
      toast.error("مشکل در خواندن توکن");
    }
  };

  // add new route
  const handleAddRoute = async ({ name }: { name: string }) => {
    if (routes.includes(name)) {
      toast.error("این مسیر در حال حاظر موجود است");
      return;
    }

    try {
      await fetch("/api/route-handler", {
        method: "POST",
        headers: {
          filename: name,
          token: localStorage.getItem("token") || "",
        },
      });

      fetchRoutes();
      toast.success("مسیر جدید ساخته شد");
    } catch (error) {
      console.log("Error adding route:", error);
      toast.error("مشکل در ساخت مسیر");
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, [selectedRoute, activeMode]);

  // Replace the direct import with API call
  const sendTokenToServer = async () => {
    const cacheKey = `layout-${selectedRoute}-${activeMode}`;
    const cached = cache[cacheKey];

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      const data = cached.data as Layout;
      setLayout(data);
      return data;
    }

    try {
      const data = await api.endpoint("/layout-jason").get({
        headers: {
          selectedRoute: selectedRoute.split(".")[0],
          activeMode: activeMode,
          token: localStorage.getItem("token") || "",
        },
      });
      setCache((prev) => ({
        ...prev,
        [cacheKey]: { data, timestamp: Date.now() },
      }));
      setLayout(data as Layout);
      return data;
    } catch (error: unknown) {
      console.log("Error in data fetch:", error);
      if (error instanceof Error && (error.message?.includes("401") || error.message?.includes("expired"))) {
        localStorage.removeItem("token");
        const redirectUrl = process.env.NODE_ENV === "development" 
          ? "http://localhost:3000" 
          : "https://dashboard.tomakdigitalagency.ir";
        window.location.href = redirectUrl;
      }
    }
  };

  useEffect(() => {
    sendTokenToServer();
  }, [activeMode, selectedRoute]);

  const handleSave = async () => {
    const loadingToast = toast.loading("در حال ذخیره سازی");
    setSaveStatus("saving");

    try {
      const result = await api.endpoint("/layout-jason").post(layout, {
        headers: {
          selectedRoute: selectedRoute,
          activeMode: activeMode,
          token: localStorage.getItem("token") || "",
        },
      });
      console.log("Save response:", result);
      toast.dismiss(loadingToast);
      toast.success("!ذخیره شد");
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error: unknown) {
      console.log("Error saving layout:", error);
      if (error instanceof Error && (error.message?.includes("401") || error.message?.includes("expired"))) {
        localStorage.removeItem("token");
        const redirectUrl = process.env.NODE_ENV === "development" 
          ? "http://localhost:3000" 
          : "https://dashboard.tomakdigitalagency.ir";
        window.location.href = redirectUrl;
        return;
      }
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  };

  const handleModeChange = (mode: "lg" | "sm") => {
    setActiveMode(mode);
  };

  const fetchRoutes = async () => {
    const cacheKey = "routes";
    const cached = cache[cacheKey];

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      const cachedData = cached.data as { files: string[] };
      const cleanedRoutes = cleanRouteNames(cachedData.files);
      setRoutes(cleanedRoutes);
      setActiveRoutes(cleanedRoutes);
      return;
    }

    try {
      const res = await fetch("/api/route-handler", {
        method: "GET",
        headers: {
          token: localStorage.getItem("token") || "",
        },
      });
      
      if (res.status === 401) {
        localStorage.removeItem("token");
        const redirectUrl = process.env.NODE_ENV === "development" 
          ? "http://localhost:3000" 
          : "https://dashboard.tomakdigitalagency.ir";
        window.location.href = redirectUrl;
        return;
      }
      
      const result = await res.json();
      setCache((prev) => ({
        ...prev,
        [cacheKey]: { data: result, timestamp: Date.now() },
      }));
      const cleanedRoutes = cleanRouteNames(result.files as string[]);
      console.log(cleanedRoutes, ",,,,,,,,,,,,,,,");
      setRoutes(cleanedRoutes as string[]);
      setActiveRoutes(cleanedRoutes as string[]);
    } catch (error) {
      console.log("Error fetching routes:", error);
    }
  };

  const handleDeleteRoute = async () => {
    try {
      await api.endpoint("/route-handler").delete({
        headers: { 
          filename: selectedRoute ,
          token: localStorage.getItem("token") || "" 
        },
        
      });

      fetchRoutes();
      setSelectedRoute("home");
      toast.success(" !حذف مسیر انجام شد");
    } catch (error) {
      console.log("Error deleting route:", error);
      toast.error("مشکل در حذف مسیر");
    }
    sendTokenToServer();
  };

  const cleanRouteNames = (routes: string[]) => {
    const cleanedRoutes = routes.map((route) =>
      route.replace(/(sm|lg)\.json$/, "")
    );
    return [...new Set(cleanedRoutes)];
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  // Add this useEffect to control the guide flow
  const handleMetaDataSave = () => {
    const updatedLayout = {
      ...layout,
      sections: {
        ...layout.sections,
        children: {
          ...layout.sections.children,
          metaData: metaData,
        },
      },
    };
    console.log("Updated Layout:", updatedLayout);

    setLayout(updatedLayout);
    setIsMetaDataModalOpen(false);
    handleSave(); // This will save to the server
  };

  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const addRouteButtonRef = useRef<HTMLButtonElement>(null);
  const deleteRouteButtonRef = useRef<HTMLButtonElement>(null);
  const changeRouteRef = useRef<HTMLLabelElement>(null);
  const previewToggleRef = useRef<HTMLDivElement>(null);
  const sitePreviewRef = useRef<HTMLButtonElement>(null);
  const seoButtonRef = useRef<HTMLButtonElement>(null);
  const routeNameRef = useRef<HTMLSpanElement>(null);

  const getHighlightClass = (
    ref: React.RefObject<HTMLButtonElement | HTMLDivElement | HTMLSelectElement>
  ) => {
    if (ref.current && activeElement === ref.current.id) {
      // return "ring-4 ring-purple-600 ring-offset-2 animate-pulse scale-110 transition-all duration-300 z-50";
    }

    return "";
  };

  return (
    <div>
      <CanvasProvider>
        <div className="min-h-screen ">
          {isMetaDataModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 border border-gray-300 backdrop-blur-sm rounded-xl shadow-lg w-96">
                <h3 className="text-lg font-bold text-white mb-4 text-right">
                  (سئو) ویرایش متا دیتا
                </h3>
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="عنوان"
                      value={metaData.title}
                      onChange={(e) =>
                        setMetaData({ ...metaData, title: e.target.value })
                      }
                      className="w-full p-2 border rounded-lg"
                      dir="rtl"
                    />
                    <div className="text-xs text-gray-300 text-right mt-1">
                      عنوان صفحه که در نتایج جستجو و تب مرورگر نمایش داده می‌شود
                    </div>
                  </div>
                  <div>
                    <textarea
                      placeholder="توضیحات (حداکثر 160 کاراکتر برای سئو)"
                      value={metaData.description}
                      onChange={(e) =>
                        setMetaData({
                          ...metaData,
                          description: e.target.value.slice(0, 160),
                        })
                      }
                      className="w-full p-2 border rounded-lg"
                      dir="rtl"
                      maxLength={160}
                    />
                    <div className="text-xs text-gray-300 text-right mt-1">
                      توضیح کوتاه صفحه برای نمایش در نتایج جستجو -{" "}
                      {metaData.description.length}/160 کاراکتر
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 space-x-reverse">
                    <button
                      onClick={handleMetaDataSave}
                      className="px-4 py-2 mx-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      ذخیره
                    </button>
                    <button
                      onClick={() => setIsMetaDataModalOpen(false)}
                      className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      انصراف
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              e.currentTarget.style.setProperty("--x", `${x}%`);
              e.currentTarget.style.setProperty("--y", `${y}%`);
            }}
            className="sticky  top-0 z-50 backdrop-blur-2xl bg-gradient-to-br py-2 lg:py-0  from-[#e4e4e4]/60 to-[#fff]
             shadow-sm cursor-pointer"
          >
            <div className=" mx-auto px-4 sm:px-6 lg:px-8 ">
              <div className="flex lg:flex-row flex-wrap items-center  md:mt-0 justify-center gap-x-0 md:gap-x-1 lg:py-0  sm:space-y-0">
                <motion.div className="md:flex hidden  items-center border-r pr-2 border-gray-300 absolute left-2 gap-2 px-3 py-0.5">
                  <span ref={routeNameRef} className="text-sm font-medium">
                    {selectedRoute}
                  </span>
                  {/* {routeIcons[selectedRoute as keyof typeof routeIcons] &&
                    React.createElement(
                      routeIcons[selectedRoute as keyof typeof routeIcons],
                      {
                        className: "w-4 h-4",
                      }
                    )} */}
                  <button
                    ref={seoButtonRef}
                    className=" font-semibold border-l text-xs"
                    onClick={() => setIsMetaDataModalOpen(true)}
                  >
                    سئو صفحه
                  </button>
                </motion.div>

                <motion.button
                  id="sitePreview"
                  onClick={handleSiteView}
                  className={`${getHighlightClass(
                    sitePreviewRef
                  )} lg:w-auto text-xs font-semibold border-r pr-2 border-gray-400 lg:-ml-12 px-3 md:mt-0 
    transition-all duration-300 transform`}
                  whileTap={{ scale: 0.95 }}
                  ref={sitePreviewRef}
                >
                  نمایش سایت
                </motion.button>

                {/* Save Button with Animation */}
                <motion.button
                  id="save"
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  ref={saveButtonRef}
                  disabled={saveStatus === "saving"}
                  className={`w-fulllg:-ml-12 ${getHighlightClass(
                    saveButtonRef
                  )} px-1  text-xs font-semibold border-r pr-2 border-gray-800 transition-all duration-300 transform text-black`}
                >
                  ذخیره تنظیمات
                </motion.button>

                {/* View Mode Toggles */}
                <div
                  id="preview"
                  ref={previewToggleRef}
                  className={`flex ${getHighlightClass(
                    previewToggleRef
                  )} items-center flex-row-reverse space-x-3`}
                >
                  <motion.button
                    onClick={() => handleModeChange("sm")}
                    className={`py-1.5 px-1 rounded-lg hidden ml-2 lg:block transition-all duration-300
                    ${previewWidth === "sm" ? " " : "bg-[#e4e4e4]/10 "}`}
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
                    onClick={() => handleModeChange("lg")}
                    className={`py-1.5 rounded-lg hidden lg:block transition-all duration-300 
                    ${previewWidth === "default" ? " " : "bg-[#e4e4e4]/5 "}`}
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
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsModalOpen(true)}
                  ref={addRouteButtonRef}
                  className={`px-3 ${getHighlightClass(
                    addRouteButtonRef
                  )}  text-xs font-semibold border-x pr-2 border-gray-400 hover:bg-transparent `}
                >
                  افزودن مسیر
                </motion.button>

                <motion.button
                  id="delete"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  ref={deleteRouteButtonRef}
                  onClick={() => setIsDeleteModalOpen(true)}
                  className={`px-3 ${getHighlightClass(
                    deleteRouteButtonRef
                  )} text-xs font-semibold border-r pr-2 border-gray-400 hover:bg-transparent`}
                >
                  حذف مسیر
                </motion.button>
                <motion.label
                  ref={changeRouteRef}
                  className="relative my-2 md:my-0 text-xs font-semibold inline-flex items-center cursor-pointer"
                >
                  <motion.div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 px-3 py-0.5  backdrop-blur-xl rounded-md"
                    >
                      <span className="text-xs font-medium">
                        {selectedRoute}
                      </span>
                      <motion.svg
                        animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                        className="w-4 h-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </motion.svg>
                    </motion.button>

                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute mt-2 w-24 bg-white/90 max-h-64 overflow-auto flex flex-col backdrop-blur-xl rounded-xl shadow-xl border border-white/80 z-50"
                          dir="rtl"
                        >
                          {activeRoutes.map((route) => (
                            <motion.button
                              key={route}
                              onClick={() => {
                                setSelectedRoute(route);
                                setIsDropdownOpen(false);
                              }}
                              className=" px-2 py-2 text-right rounded-lg text-xs transition-colors hover:text-red-500"
                            >
                              {route}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  : مسیرها
                </motion.label>
              </div>
            </div>
          </motion.div>

          <Preview />

          <Form />
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/20  p-6 border border-gray-300 backdrop-blur-sm rounded-xl shadow-lg w-96"
            >
              <div className="flex    flex-col mb-4 gap-2">
                {" "}
                <h3 className="text-lg font-bold text-white text-right">
                  افزودن مسیر جدید
                </h3>
                <p className="text-right mt-1 text-sm text-blue-600 ">
                  لطفا فقط از حروف لاتین استفاده شود *
                </p>
              </div>

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
                    className="px-4 py-2 mx-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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
              className="bg-white/20 p-6 border border-gray-300 backdrop-blur-sm rounded-xl shadow-lg w-96"
            >
              <h3 className="text-lg font-bold mb-4 text-white text-right">
                حذف مسیر
              </h3>
              <div className="space-y-4">
                <select
                  value={selectedRoute}
                  onChange={(e) => setSelectedRoute(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  dir="rtl"
                >
                  <option value="">انتخاب مسیر</option>
                  {activeRoutes
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
                    className="px-4 py-2 mx-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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

        <TourGuide
          saveButtonRef={saveButtonRef}
          addRouteButtonRef={addRouteButtonRef}
          deleteRouteButtonRef={deleteRouteButtonRef}
          previewToggleRef={previewToggleRef}
          sitePreviewRef={sitePreviewRef}
          changeRouteRef={changeRouteRef}
          seoButtonRef={seoButtonRef}
          routeNameRef={routeNameRef}
          setActiveElement={setActiveElement}
        />
      </CanvasProvider>
    </div>
  );
};
