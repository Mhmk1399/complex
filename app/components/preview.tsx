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
  previewWidth: "sm" | "default";
  setPreviewWidth: (mode: "sm" | "default") => void;
}

// Then use it in the component
export const Preview: React.FC<PreviewProps> = ({
  layout,
  setSelectedComponent,
  orders,
  selectedComponent,
  setLayout,
  previewWidth,
  setPreviewWidth,
}) => {
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

// {
//   <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="sticky top-0 z-50 backdrop-blur-md bg-white/80 shadow-sm"
//           >
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//               <div className="flex flex-col sm:flex-row items-center justify-between py-4 space-y-4 sm:space-y-0">
//                 {/* Save Button with Animation */}
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={handleSave}
//                   disabled={saveStatus === "saving"}
//                   className={`w-full sm:w-auto px-6 py-2.5 rounded-full font-medium transition-all duration-300 transform
//                   ${
//                     saveStatus === "saving"
//                       ? "bg-gray-400"
//                       : saveStatus === "saved"
//                       ? "bg-green-500"
//                       : saveStatus === "error"
//                       ? "bg-red-500"
//                       : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
//                   }
//                   text-white shadow-md hover:shadow-lg`}
//                 >
//                   {saveStatus === "saving"
//                     ? "Saving..."
//                     : saveStatus === "saved"
//                     ? "Saved!"
//                     : saveStatus === "error"
//                     ? "Error!"
//                     : "Save Changes"}
//                 </motion.button>

//                 {/* View Mode Toggles */}
//                 <div className="flex items-center flex-row-reverse space-x-3">
//                   <span className="text-sm text-gray-600 ml-2">
//                 :  تنظیمات پیش نمایش
//                   </span>
//                   <motion.button
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                     onClick={() => handleModeChange("sm")}
//                     className={`p-2 rounded-lg transition-all duration-300
//                     ${
//                       activeMode === "sm"
//                         ? "bg-blue-500 shadow-lg"
//                         : "bg-gray-200 hover:bg-gray-300"
//                     }`}
//                   >
//                     <Image
//                       src="/assets/images/smartphone.png"
//                       alt="Mobile View"
//                       width={24}
//                       height={24}
//                       className="transform transition-transform"
//                     />
//                   </motion.button>

//                   <motion.button
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                     onClick={() => handleModeChange("default")}
//                     className={`p-2 rounded-lg transition-all duration-300
//                     ${
//                       activeMode === "default"
//                         ? "bg-blue-500 shadow-lg"
//                         : "bg-gray-200 hover:bg-gray-300"
//                     }`}
//                   >
//                     <Image
//                       src="/assets/images/computer.png"
//                       alt="Desktop View"
//                       width={24}
//                       height={24}
//                       className="transform transition-transform"
//                     />
//                   </motion.button>
//                 </div>

//                 {/* Route Selector */}
//                 <motion.select
//                   whileHover={{ scale: 1.02 }}
//                   value={selectedRoute}
//                   onChange={(e) => setSelectedRoute(e.target.value)}
//                   className="w-full sm:w-48 px-4 py-2.5 rounded-xl border-2 border-gray-200
//                   bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200
//                   transition-all duration-300"
//                 >
//                   <option value="home">Home</option>
//                   <option value="about">About</option>
//                   <option value="contact">Contact</option>
//                   <option value="store">Store</option>
//                   <option value="DetailPage">Detail Page</option>
//                   <option value="BlogList">Blog</option>
//                   <option value="BlogDetail">Blog Detail</option>
//                 </motion.select>
//               </div>

//             </div>
//           </motion.div>
//           <Preview
//             layout={layout}
//             setSelectedComponent={setSelectedComponent}
//             orders={orders}
//             selectedComponent={selectedComponent}
//             setLayout={setLayout}
//             previewWidth={previewWidth}
//             setPreviewWidth={setPreviewWidth}
//           />
//           <Form
//             selectedComponent={selectedComponent}
//             setLayout={setLayout}
//             layout={layout}
//             orders={orders}
//             setOrders={setOrders}
//           />
//         </div>
// }

{
  /* <button
onClick={handleSave}
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
</button> */
}
