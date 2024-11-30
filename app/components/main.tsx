"use client";
import React, { useEffect, useState } from "react";
import { Preview } from "./preview";
import { Form } from "./form";
import data from "../../public/template/null.json";
import {
  AboutChildren,
  DetailPageChildren,
  Layout,
  StoreChildren,
} from "../../lib/types";
import About from "@/public/template/about.json";
import Contact from "@/public/template/contact.json";
import Store from "@/public/template/product.json";
import DetailPage from "@/public/template/detail.json";

export const Main = () => {
  const Data = data as unknown as Layout;
  const [loading, setLoading] = useState(true);
  const [layout, setLayout] = useState<Layout>(Data);
  const [selectedComponent, setSelectedComponent] =
    useState<string>("sectionHeader");
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [orders, setOrders] = useState<string[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string>("home");
  useEffect(() => {
    setLoading(false);
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
    } else {
      setLayout((prevLayout) => ({
        ...prevLayout,
        sections: {
          ...prevLayout.sections,
          children: Data.sections.children,
        },
      }));
    }
  }, [selectedRoute]);

  // const handleSave = async () => {
  //   setSaveStatus('saving');
  //   try {
  //     const response = await fetch('/api/saveLayout', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ layout }),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to save layout');
  //     }

  //     setSaveStatus('saved');
  //     setTimeout(() => setSaveStatus('idle'), 2000);
  //   } catch (error) {
  //     console.error('Error saving layout:', error);
  //     setSaveStatus('error');
  //     setTimeout(() => setSaveStatus('idle'), 2000);
  //   }
  // };

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
        <div>
          <div className=" z-50 flex justify-center lg:px-10 py-1">
            <button
              // onClick={handleSave}
              disabled={saveStatus === "saving"}
              className={`px-4 py-2 rounded-full mr-2 text-white ${
                saveStatus === "saving"
                  ? "bg-gray-400"
                  : saveStatus === "saved"
                  ? "bg-green-500"
                  : saveStatus === "error"
                  ? "bg-red-500"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {saveStatus === "saving"
                ? "Saving..."
                : saveStatus === "saved"
                ? "Saved!"
                : saveStatus === "error"
                ? "Error!"
                : "Save Changes"}
            </button>
            <select
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
              className="px-2 py-2 lg:mr-56 w-[150px] rounded-2xl border border-gray-500 text-center"
            >
              <option value="home">Home</option>
              <option value="about">About</option>
              <option value="contact">Contact</option>
              <option value="store">store</option>
              <option value="DetailPage">detalPage</option>
            </select>
          </div>
          <Preview
            layout={layout}
            setSelectedComponent={setSelectedComponent}
            orders={orders}
            selectedComponent={selectedComponent}
            setLayout={setLayout}
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
