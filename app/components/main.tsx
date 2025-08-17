"use client";
import React, { useEffect, useRef, useState } from "react";
import { Preview } from "./preview";
import { Form } from "./form";
import smData from "../../public/template/homesm.json";
import Image from "next/image";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  FaHome,
  FaInfoCircle,
  FaEnvelope,
  FaStore,
  FaBlog,
  FaNewspaper,
  FaRobot,
} from "react-icons/fa";

import {
  AboutChildren,
  BlogChildren,
  BlogDetailChildren,
  DetailPageChildren,
  Layout,
  StoreChildren,
} from "../../lib/types";
import About from "@/public/template/aboutlg.json";
import Contact from "@/public/template/contactlg.json";
import Store from "@/public/template/storelg.json";
import DetailPage from "@/public/template/detaillg.json";
import Blog from "@/public/template/bloglg.json";
import BlogDetail from "@/public/template/blogdetaillg.json";
import { AnimatePresence, motion } from "framer-motion";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TourGuide from "./sections/guideTour";
import { useSharedContext } from "@/app/contexts/SharedContext";
import { CanvasProvider } from "../contexts/CanvasContext";

const routeIcons = {
  home: FaHome,
  about: FaInfoCircle,
  contact: FaEnvelope,
  store: FaStore,
  blog: FaBlog,
  news: FaNewspaper,
  ai: FaRobot,
};

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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [routes, setRoutes] = useState<string[]>([]);
  // const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<"sm" | "lg">("sm");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeElement, setActiveElement] = useState<
    "save" | "delete" | "preview" | "sitePreview" | "addRoute" | "changeRoute"
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

  // اینجا ادرس سایتی که ساخته میشه داده میشه به دکمه
  const handleSiteView = () => {
    try {
      const token = localStorage.getItem("complexToken");
      if (!token) {
        toast.error("توکن یافت نشد");
        return;
      }

      // Decode the token without verification (client-side)
      const decodedToken = jwt.decode(token) as JwtPayload;

      if (!decodedToken?.user?.DeployedUrl) {
        toast.error("آدرس سایت یافت نشد");
        return;
      }

      let siteUrl = decodedToken.user.DeployedUrl;
      if (!/^https?:\/\//i.test(siteUrl)) {
        siteUrl = "https://" + siteUrl;
      }
      window.open(siteUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error opening site:", error);
      toast.error("مشکل در باز کردن سایت");
    }
  };

  // add new route on disk
const handleAddRoute = async ({ name }: { name: string }) => {
  const urlParams = new URLSearchParams(window.location.search);
  const DiskUrl = urlParams.get("DiskUrl");

  if (routes.includes(name)) {
    toast.error("این مسیر در حال حاظر موجود است", { autoClose: 3000 });
    return;
  }

  try {
    const response = await fetch("/api/route-handler", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        filename: name,          // ✅ kept in headers since your flow uses it
        DiskUrl: DiskUrl || "",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to add route");
    }

    const result = await response.json();
    console.log("Route added:", result);

    fetchRoutes(); // Fetch updated routes
    toast.success("مسیر جدید ساخته شد", {
      autoClose: 3000,
    });
  } catch (error) {
    console.log("Error adding route:", error);

    toast.error("مشکل در ساخت مسیر", {
      autoClose: 3000,
    });
  }

  fetch("/api/route-handler", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      DiskUrl: DiskUrl || "",
    },
  })
    .then((response) => {
      if (!response.ok) {
        return null;
      }
      return response.json();
    })
    .then((data) => {
      if (data) {
        const cleanRoutes = [
          ...new Set(
            data.files.map((f: string) =>
              f.replace(/(lg|sm)?\.json$/, "")
            )
          ),
        ];
        setActiveRoutes(cleanRoutes as string[]); // Now updates context state
      }
      console.log(data, "dafddasfhhadshaahdfhsdfhahdfhdahhf");
    })
    .catch((error) => {
      console.error("Error fetching routes:", error);
    });

  // ❌ removed extra fetchRoutes() here – it was redundant
};


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const DiskUrl = urlParams.get("DiskUrl");
    console.log("Fetching data with params:", {
      DiskUrl,
      selectedRoute,
      activeMode,
    });

    fetch("/api/route-handler", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        DiskUrl: DiskUrl || "",
      },
    })
      .then((response) => {
        if (!response.ok) {
          return null;
        }

        return response.json();
      })
      .then((data) => {
        
        if (data) {
          const cleanedRoutes = cleanRouteNames(data.files as string[]);
          setActiveRoutes(cleanedRoutes as string[]);
        }
      })
      .catch((error) => {
        console.log("Error sending token to server:", error);
      });
  }, [selectedRoute, activeMode]);

  // Replace the direct import with API call
  const sendTokenToServer = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const DiskUrl = urlParams.get("DiskUrl");
    console.log("Fetching data with params:", {
      DiskUrl,
      selectedRoute,
      activeMode,
    });

    console.log(selectedRoute, "selectedRoute");

    try {
      const response = await fetch("/api/layout-jason", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          selectedRoute: selectedRoute.split(".")[0],
          activeMode: activeMode,
          DiskUrl: DiskUrl || "",
        },
      });

      if (!response.ok) {
        console.log("Server error:", response.statusText);
        return;
      }

      const data = await response.json();
      setLayout(data);
      return data;
    } catch (error) {
      console.log("Error in data fetch:", error);
    }
  };

  useEffect(() => {
    sendTokenToServer();
  }, [activeMode, selectedRoute]);

  useEffect(() => {
    const currentLayoutData = activeMode === "sm" ? smData : layout;

    const routeConfigs = {
      about: About.children as unknown as AboutChildren,
      contact: Contact.children as unknown as AboutChildren,
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
    const urlParams = new URLSearchParams(window.location.search);
    const DiskUrl = urlParams.get("DiskUrl");
    console.log("Fetching data with params:", {
      DiskUrl,
      selectedRoute,
      activeMode,
    });
    try {
      const response = await fetch("/api/layout-jason", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          selectedRoute: selectedRoute,
          activeMode: activeMode,
          DiskUrl: DiskUrl || "",
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

  const fetchRoutes = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const DiskUrl = urlParams.get("DiskUrl");
    try {
      const response = await fetch("/api/route-handler", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          DiskUrl: DiskUrl || "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch routes");
      }

      const result = await response.json();
      console.log("Routes fetched successfully:", result); // Debug log

      // Clean route names before setting state
      const cleanedRoutes = cleanRouteNames(result.files as string[]);
      console.log("Cleaned routes:", cleanedRoutes);

      setRoutes(cleanedRoutes as string[]);
      setActiveRoutes(cleanedRoutes as string[]); // Now updates context state
    } catch (error) {
      console.log("Error fetching routes:", error);
    }
  };
  useEffect(() => {
    fetchRoutes();
  }, []);

  // Function to clean route names by removing sm.json/lg.json and removing duplicates
  const cleanRouteNames = (routes: string[]) => {
    // Remove sm.json and lg.json from route names
    const cleanedRoutes = routes.map((route) =>
      route.replace(/(sm|lg)\.json$/, "")
    );

    // Remove duplicates
    return [...new Set(cleanedRoutes)];
  };

  const handleDeleteRoute = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const DiskUrl = urlParams.get("DiskUrl");
    console.log("Fetching data with params:", {
      DiskUrl,
      selectedRoute,
      activeMode,
    });

    try {
      const response = await fetch("/api/route-handler", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          filename: selectedRoute,
          DiskUrl: DiskUrl || "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete route");
      }

      const result = await response.json();
      console.log("Route deleted successfully:", result);
      fetchRoutes(); // Fetch updated routes
      setSelectedRoute("home");
      toast.success(" حذف مسیر انجام شد! ", {
        autoClose: 3000,
      });
    } catch (error) {
      console.log("Error deleting route:", error);
      toast.error("مشکل در حذف مسیر", {
        autoClose: 3000,
      });
    }
    fetchRoutes();
    setSelectedRoute("home");
    sendTokenToServer();
  };
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
  const changeRouteRef = useRef<HTMLSelectElement>(null);
  const previewToggleRef = useRef<HTMLDivElement>(null);
  const sitePreviewRef = useRef<HTMLButtonElement>(null);

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
      <CanvasProvider>
        <div className="min-h-screen ">
          {isMetaDataModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white/20 p-6 border border-gray-300 backdrop-blur-sm rounded-xl shadow-lg w-96">
                <h3 className="text-lg font-bold text-white mb-4 text-right">
                  ویرایش متا دیتا
                </h3>
                <div className="space-y-4">
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
                  <textarea
                    placeholder="توضیحات"
                    value={metaData.description}
                    onChange={(e) =>
                      setMetaData({ ...metaData, description: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    dir="rtl"
                  />
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
            className="sticky  top-0 z-50 backdrop-blur-2xl bg-gradient-to-br py-2 lg:py-0.5  from-[#e4e4e4]/60 to-[#fff]
             shadow-sm cursor-pointer"
          >
            <div className=" mx-auto px-4 sm:px-6 lg:px-8 ">
              <div className="flex lg:flex-row flex-wrap items-center  md:mt-0 justify-center gap-x-0 md:gap-x-1 lg:py-0  sm:space-y-0">
                <motion.div className="md:flex hidden  items-center border-r pr-2 border-gray-300 absolute left-2 gap-2 px-3 py-0.5">
                  <span className="text-sm font-medium">{selectedRoute}</span>
                  {routeIcons[selectedRoute as keyof typeof routeIcons] &&
                    React.createElement(
                      routeIcons[selectedRoute as keyof typeof routeIcons],
                      {
                        className: "w-4 h-4",
                      }
                    )}
                  <button
                    className="hover:bg-gray-200 rounded-full p-1"
                    onClick={() => setIsMetaDataModalOpen(true)}
                  >
                    افزودن متا دیتا
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
                  )} px-1  text-xs font-semibold border-r pr-2 border-gray-800 transition-all duration-300 transform
                  ${
                    saveStatus === "saving"
                      ? "bg-blue-400 px-2 pl-2 py-1 rounded-xl text-white border-none"
                      : saveStatus === "saved"
                      ? "bg-green-400 px-2 pl-2 py-1 rounded-xl text-white border-none"
                      : saveStatus === "error"
                      ? "bg-red-400 pl-2 py-1 rounded-xl text-white border-none"
                      : ""
                  }
                  text-black`}
                >
                  {saveStatus === "saving"
                    ? "در حال ذخیره"
                    : saveStatus === "saved"
                    ? "ذخیره شد"
                    : saveStatus === "error"
                    ? "ناموفق"
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
                <motion.label className="relative my-2 md:my-0 text-xs font-semibold inline-flex items-center cursor-pointer">
                  <motion.div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 px-3 py-0.5  backdrop-blur-xl rounded-md"
                    >
                      <span className="text-sm font-medium">
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
                          className="absolute mt-2 w-20 bg-white/90 flex flex-col backdrop-blur-xl rounded-xl shadow-xl border border-white/80 z-50"
                          dir="rtl"
                        >
                          {activeRoutes.map((route) => (
                            <motion.button
                              key={route}
                              onClick={() => {
                                setSelectedRoute(route);
                                setIsDropdownOpen(false);
                              }}
                              className=" px-2 py-2 text-right rounded-lg text-sm transition-colors hover:text-red-500"
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
        {/* )} */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/20 p-6 border border-gray-300 backdrop-blur-sm rounded-xl shadow-lg w-96"
            >
              <h3 className="text-lg font-bold text-white mb-4 text-right">
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
        <ToastContainer position="top-right" transition={Slide} />
        <TourGuide
          saveButtonRef={saveButtonRef}
          addRouteButtonRef={addRouteButtonRef}
          deleteRouteButtonRef={deleteRouteButtonRef}
          previewToggleRef={previewToggleRef}
          sitePreviewRef={sitePreviewRef}
          changeRouteRef={changeRouteRef}
          setActiveElement={setActiveElement}
        />
      </CanvasProvider>
    </div>
  );
};
