"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { DragEndEvent } from "@dnd-kit/core";
import richtextImage from "@/public/assets/images/richtext.png";
import ImageTextImage from "@/public/assets/images/imagetext.png";
import bannerImage from "@/public/assets/images/banner.jpg";
import CollapseFaqImage from "@/public/assets/images/collapse.png";
import contactImage from "@/public/assets/images/contact.png";
import newsLetterImage from "@/public/assets/images/newsletter.png";
import multiColumnImage from "@/public/assets/images/multicolumn.png";
import slideShowImage from "@/public/assets/images/slideShow.png";
import multiRowImage from "@/public/assets/images/multirow.png";
import video from "@/public/assets/images/video.png";
import videoSm from "@/public/assets/images/videoSm.png";
import rowSm from "@/public/assets/images/rowSm.png";
import slideSm from "@/public/assets/images/slideSm.png";
import columnSm from "@/public/assets/images/columnSm.png";
import newsletterSm from "@/public/assets/images/newsletterSm.png";
import contactSm from "@/public/assets/images/contactSm.png";
import collapseSm from "@/public/assets/images/collapseSm.png";
import bannerSm from "@/public/assets/images/BannerSm.png";
import imagetextSm from "@/public/assets/images/imagetextSm.png";
import richtextSm from "@/public/assets/images/richtextSm.png";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { RichText } from "./forms/richTextForm";
import { HeaderForm } from "./forms/headerForm";
import { JasonChanger } from "./compiler";
import { BannerForm } from "./forms/bannerForm";
import { ImageTextForm } from "./forms/imageTextForm";
import { VideoForm } from "./forms/videoForm";
import { ContactForm } from "./forms/contact";
import { NewsLetterForm } from "./forms/newsLetterForm";
import { CollapseForm } from "./forms/collapseForm";
import {
  BlogSection,
  CollectionSection,
  ContactFormDataSection,
  ContactFormProps,
  DetailPageSection,
  FooterSection,
  MultiRowSection,
  ProductSection,
  SlideSection,
  VideoSection,
  BannerSection,
  CollapseSection,
  HeaderSection,
  ImageTextSection,
  Layout,
  MultiColumnSection,
  NewsLetterSection,
  RichTextSection,
  Section,
  BlogDetailSection,
} from "@/lib/types";
import { MultiColumnForm } from "./forms/multiColomnForm";
import { SlideForm } from "./forms/slideForm";
import { MultiRowForm } from "./forms/multiRowForm";
import { FooterForm } from "./forms/footerForm";
import { Create } from "./C-D";
import ProductListForm from "./forms/productForm";
import { DetailForm } from "./forms/detailForm";
import { CollectionForm } from "./forms/collectionForm";
import BlogListForm from "./forms/blogForm";
import { BlogDetailForm } from "./forms/blogDetailForm";
type FormData =
  | HeaderSection
  | MultiRowSection
  | BannerSection
  | FooterSection
  | NewsLetterSection
  | BannerSection
  | VideoSection
  | Section
  | SlideSection
  | CollapseSection
  | RichTextSection
  | ContactFormProps
  | MultiColumnSection
  | ProductSection
  | DetailPageSection
  | BlogDetailSection
  | BlogSection;

interface FormProps {
  selectedComponent: string;
  setLayout: (data: Layout) => void;
  layout: Layout;
  orders: string[];
  setOrders: React.Dispatch<React.SetStateAction<string[]>>;
}

export const Form = ({
  selectedComponent,
  setLayout,
  layout,
  orders,
  setOrders,
}: FormProps) => {
  const [userInputData, setUserInputData] = useState<FormData>({} as FormData);
  const [isOpen, setIsOpen] = useState(false);
  const [showOrdersMenu, setShowOrdersMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(true); // New state for form visibility

  // Setup sensors for dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const addSection = (componentName: string) => {
    Create(componentName, layout, setLayout);
  };

  const imageContainerStyle = {
    width: "800px", // Fixed width
    height: "250px", // Fixed height
    margin: "0 auto",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    overflow: "hidden", // Ensures content stays within bounds
  };
  useEffect(() => {
    if (selectedComponent) {
      setIsOpen(true);
    }
  }, [selectedComponent]);

  useEffect(() => {
    if (Object.keys(userInputData).length > 0) {
      const newLayout = JasonChanger(
        layout,
        selectedComponent,
        userInputData as Section
      );
      setLayout(newLayout);
    }
  }, [userInputData]);

  const SortableItem = ({ id }: { id: string }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="p-3 bg-white border rounded-2xl flex items-center gap-2 cursor-grab mb-2"
      >
        <span className="text-gray-400">☰</span>
        <span>{id}</span>
      </div>
    );
  };

  useEffect(() => {
    setOrders([...layout.sections.children.order]);
  }, [layout.sections.children.order]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = orders.indexOf(active.id as string);
      const newIndex = orders.indexOf(over?.id as string);
      const newOrders = arrayMove(orders, oldIndex, newIndex);

      setOrders(newOrders);
      setLayout({
        ...layout,
        sections: {
          ...layout.sections,
          children: {
            ...layout.sections.children,
            order: newOrders,
          },
        },
      });
    }
  };

  const renderFormContent = (
    setUserInputData: React.Dispatch<React.SetStateAction<FormData>>,
    userInputData: FormData,
    selectedComponent: string
  ) => {
    const baseComponentName = selectedComponent.split("-")[0];

    switch (baseComponentName) {
      case "RichText":
        return (
          <RichText
            setUserInputData={
              setUserInputData as React.Dispatch<
                React.SetStateAction<RichTextSection>
              >
            }
            userInputData={userInputData as RichTextSection}
            layout={layout}
            selectedComponent={selectedComponent}
          />
        );
      case "sectionHeader":
        return (
          <HeaderForm
            setUserInputData={
              setUserInputData as React.Dispatch<
                React.SetStateAction<HeaderSection>
              >
            }
            userInputData={userInputData as HeaderSection}
            layout={layout}
            selectedComponent={selectedComponent}
          />
        );
      case "Banner":
        return (
          <BannerForm
            setUserInputData={
              setUserInputData as React.Dispatch<
                React.SetStateAction<BannerSection>
              >
            }
            userInputData={userInputData as BannerSection}
            layout={layout}
            selectedComponent={selectedComponent}
          />
        );
      case "BlogList":
        return (
          <BlogListForm
            setUserInputData={
              setUserInputData as React.Dispatch<
                React.SetStateAction<BlogSection>
              >
            }
            userInputData={userInputData as BlogSection}
            layout={layout}
            selectedComponent={selectedComponent}
          />
        );

      case "ImageText":
        return (
          <ImageTextForm
            setUserInputData={
              setUserInputData as React.Dispatch<
                React.SetStateAction<ImageTextSection>
              >
            }
            userInputData={userInputData as ImageTextSection}
            layout={layout}
            selectedComponent={selectedComponent}
          />
        );
      case "ProductList":
        return (
          <ProductListForm
            setUserInputData={
              setUserInputData as React.Dispatch<
                React.SetStateAction<ProductSection>
              >
            }
            userInputData={userInputData as ProductSection}
            layout={layout}
            selectedComponent={selectedComponent}
          />
        );
      case "Video":
        return (
          <VideoForm
            setUserInputData={
              setUserInputData as React.Dispatch<
                React.SetStateAction<VideoSection>
              >
            }
            userInputData={userInputData as VideoSection}
            layout={layout}
            selectedComponent={selectedComponent}
          />
        );
      case "ContactForm":
        return (
          <ContactForm
            setUserInputData={
              setUserInputData as React.Dispatch<
                React.SetStateAction<ContactFormDataSection>
              >
            }
            userInputData={userInputData as ContactFormDataSection}
            layout={layout}
            selectedComponent={selectedComponent}
          />
        );
      case "NewsLetter":
        return (
          <NewsLetterForm
            setUserInputData={
              setUserInputData as React.Dispatch<
                React.SetStateAction<NewsLetterSection>
              >
            }
            userInputData={userInputData as NewsLetterSection}
            layout={layout}
            selectedComponent={selectedComponent}
          />
        );
      case "CollapseFaq":
        return (
          <CollapseForm
            setUserInputData={
              setUserInputData as React.Dispatch<
                React.SetStateAction<CollapseSection>
              >
            }
            userInputData={userInputData as CollapseSection}
            layout={layout}
            selectedComponent={selectedComponent}
          />
        );
      case "MultiColumn":
        return (
          <MultiColumnForm
            setUserInputData={
              setUserInputData as React.Dispatch<
                React.SetStateAction<MultiColumnSection>
              >
            }
            userInputData={userInputData as MultiColumnSection}
            layout={layout}
            selectedComponent={selectedComponent}
          />
        );
      case "SlideShow":
        return (
          <SlideForm
            setUserInputData={
              setUserInputData as React.Dispatch<
                React.SetStateAction<SlideSection>
              >
            }
            userInputData={userInputData as SlideSection}
            layout={layout}
            selectedComponent={selectedComponent}
          />
        );
      case "MultiRow":
        return (
          <MultiRowForm
            setUserInputData={
              setUserInputData as React.Dispatch<
                React.SetStateAction<MultiRowSection>
              >
            }
            userInputData={userInputData as MultiRowSection}
            layout={layout}
            selectedComponent={selectedComponent}
          />
        );
      case "Collection":
        return (
          <CollectionForm
            setUserInputData={
              setUserInputData as React.Dispatch<
                React.SetStateAction<CollectionSection>
              >
            }
            userInputData={userInputData as CollectionSection}
            layout={layout}
            selectedComponent={selectedComponent}
          />
        );
      case "DetailPage":
        return (
          <DetailForm
            setUserInputData={
              setUserInputData as React.Dispatch<
                React.SetStateAction<DetailPageSection>
              >
            }
            userInputData={userInputData as DetailPageSection}
            layout={layout}
            selectedComponent={selectedComponent}
          />
        );
      case "BlogDetail":
        return (
          <BlogDetailForm
            setUserInputData={
              setUserInputData as React.Dispatch<
                React.SetStateAction<BlogDetailSection>
              >
            }
            userInputData={userInputData as BlogDetailSection}
            layout={layout}
            selectedComponent={selectedComponent}
          />
        );
      case "sectionFooter":
        return (
          <FooterForm
            setUserInputData={
              setUserInputData as React.Dispatch<
                React.SetStateAction<FooterSection>
              >
            }
            userInputData={userInputData as FooterSection}
            layout={layout}
            selectedComponent={selectedComponent}
          />
        );
      default:
        return <div>یک سکشن را برای تنظیمات کلیک کنید...</div>;
    }
  };

  const ordersButton = (
    <div className="flex justify-between mt-12 items-center">
      <button
        onClick={() => setShowOrdersMenu(!showOrdersMenu)}
        className={
          !showOrdersMenu
            ? `w-fit  m-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors`
            : "w-fit m-2 px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-red-600 transition-colors"
        }
      >
        {!showOrdersMenu ? "جابجایی" : "منو"}
      </button>
      {showOrdersMenu && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="m-2 px-4 py-2  bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
        >
          {!isModalOpen ? "انتخاب سکشن" : " انتخاب سکشن"}
        </button>
      )}
    </div>
  );

  return (
    <>
      <div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="absolute top-2 right-5 z-[9999] hidden text-lg lg:block px-3 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-500 transition-colors"
        >
          {isFormOpen ? "✕" : "☰"}
        </button>
        {isFormOpen && (
          <>
            {isModalOpen && (
              <motion.div
                dir="rtl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.91 }}





                className="fixed inset-0 hidden backdrop-blur-sm  bg-black bg-opacity-50 lg:flex items-center justify-center z-[9999] overflow-y-auto"
              >
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{
                    type: "spring",
                    damping: 15,
                    stiffness: 300,
                    duration:0.8,
                  }}
                  className="bg-white/40 backdrop-blur-xl border-4 border-gray-300 p-6 rounded-xl w-[100%] max-h-[60vh] max-w-5xl overflow-auto shadow-lg relative"
                >
                  <div className=" -mr-7 -mt-8 sticky -top-8 right-0">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsModalOpen(false)}
                      className="text-gray-100 hover:text-gray-500 text-lg font-semibold m-4"
                    >
                      ✕
                    </motion.button>
                  </div>
                  {/* Modal content will go here */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="modal-content flex flex-col items-center justify-center gap-12"
                  >
                    <div
                      onClick={() => addSection("RichText")}
                      className="flex flex-col items-center w-full h-48 bg-cover bg-center bg-no-repeat hover:scale-95 transition-all duration-300 relative group"
                      style={{
                        ...imageContainerStyle,
                        backgroundImage: `url(${richtextImage.src})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                      <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {"متن غنی"}
                      </span>
                    </div>

                    <div
                      onClick={() => addSection("ImageText")}
                      className="flex flex-col items-center w-full h-48 bg-cover bg-center bg-no-repeat hover:scale-95 transition-all duration-300 relative group"
                      style={{
                        ...imageContainerStyle,
                        backgroundImage: `url(${ImageTextImage.src})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                      <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {"عکس نوشته"}
                      </span>
                    </div>
                    <div
                      onClick={() => addSection("Banner")}
                      className="flex flex-col items-center w-full h-48 bg-cover bg-center bg-no-repeat hover:scale-95 transition-all duration-300 relative group"
                      style={{
                        ...imageContainerStyle,
                        backgroundImage: `url(${bannerImage.src})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                      <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {"بنر"}
                      </span>
                    </div>
                    <div
                      onClick={() => addSection("CollapseFaq")}
                      className="flex flex-col items-center w-full h-48 bg-cover bg-center bg-no-repeat hover:scale-95 transition-all duration-300 relative group"
                      style={{
                        ...imageContainerStyle,
                        backgroundImage: `url(${CollapseFaqImage.src})`,
                        backgroundSize: "cover",
                        backgroundPosition: "top",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                      <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {"سوالات متداول"}
                      </span>
                    </div>
                    <div
                      onClick={() => addSection("ContactForm")}
                      className="flex flex-col items-center w-full h-48 bg-cover bg-center bg-no-repeat hover:scale-95 transition-all duration-300 relative group"
                      style={{
                        ...imageContainerStyle,
                        backgroundImage: `url(${contactImage.src})`,
                        backgroundSize: "cover",
                        backgroundPosition: "top",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                      <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {"ارتباط با ما"}
                      </span>
                    </div>
                    <div
                      onClick={() => addSection("NewsLetter")}
                      className="flex flex-col items-center w-full h-48 bg-cover bg-center bg-no-repeat hover:scale-95 transition-all duration-300 relative group"
                      style={{
                        ...imageContainerStyle,
                        backgroundImage: `url(${newsLetterImage.src})`,
                        backgroundSize: "cover",
                        backgroundPosition: "top",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                      <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {" خبرنامه"}
                      </span>
                    </div>
                    <div
                      onClick={() => addSection("MultiColumn")}
                      className="flex flex-col items-center w-full h-48 bg-cover bg-center bg-no-repeat hover:scale-95 transition-all duration-300 relative group"
                      style={{
                        ...imageContainerStyle,
                        backgroundImage: `url(${multiColumnImage.src})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                      <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {"ستون ها"}
                      </span>
                    </div>
                    <div
                      onClick={() => addSection("SlideShow")}
                      className="flex flex-col items-center w-full h-48 bg-cover bg-center bg-no-repeat hover:scale-95 transition-all duration-300 relative group"
                      style={{
                        ...imageContainerStyle,
                        backgroundImage: `url(${slideShowImage.src})`,
                        backgroundSize: "cover",
                        backgroundPosition: "top",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                      <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {" اسلاید شو"}
                      </span>
                    </div>
                    <div
                      onClick={() => addSection("MultiRow")}
                      className="flex flex-col items-center w-full h-48 bg-cover bg-center bg-no-repeat hover:scale-95 transition-all duration-300 relative group"
                      style={{
                        ...imageContainerStyle,
                        backgroundImage: `url(${multiRowImage.src})`,
                        backgroundSize: "cover",
                        backgroundPosition: "top",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                      <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {"  ردیف ها"}
                      </span>
                    </div>
                    <div
                      onClick={() => addSection("Video")}
                      className="flex flex-col items-center w-full h-48 bg-cover bg-center bg-no-repeat hover:scale-95 transition-all duration-300 relative group"
                      style={{
                        ...imageContainerStyle,
                        backgroundImage: `url(${video.src})`,
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                      <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {"   ویدیو"}
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
            {/* Desktop Sidebar */}
            <div
              className="hidden lg:block fixed right-0 top-0 h-screen w-80 bg-gray-50/30 rounded-xl backdrop-blur-sm shadow-lg overflow-y-auto"
              style={{ zIndex: 1000 }}
            >
              {ordersButton}

              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800" dir="rtl">
                  {showOrdersMenu ? "ترتیب سکشن" : "تنظیمات سکشن"}
                </h2>
                {showOrdersMenu ? (
                  <div
                    className="bg-gray-100/50 p-4 my-5 rounded-xl shadow-md"
                    dir="rtl"
                  >
                    <h3 className="text-2xl text-black font-semibold mb-4">
                      جابجایی سکشن
                    </h3>

                    {/* Add Modal Trigger Button */}

                    {/* Modal Component */}

                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={orders}
                        strategy={verticalListSortingStrategy}
                      >
                        {orders.map((id: string) => (
                          <SortableItem key={id} id={id} />
                        ))}
                      </SortableContext>
                    </DndContext>
                  </div>
                ) : (
                  renderFormContent(
                    setUserInputData,
                    userInputData as Section,
                    selectedComponent
                  )
                )}
              </div>
            </div>

            {/* Mobile/Tablet Bottom Sheet */}
            <AnimatePresence mode="wait">
              {showOrdersMenu && (
                <motion.div
                  initial={{ opacity: 0, x: "-100%" }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: "100%" }}
                  transition={{
                    type: "spring",
                    stiffness: 80,
                    damping: 20,
                    duration: 0.5,
                  }}
                  className="fixed lg:hidden inset-0 h-screen w-80 bg-white/70 shadow-lg overflow-y-auto z-[9999] rounded-xl"
                >
                  <span
                    className=" ml-2 top-3 border border-gray-400 absolute text-2xl text-gray-600 hover:bg-gray-200 rounded-full cursor-pointer pb-1 px-3 z-[10000]"
                    onClick={() => setShowOrdersMenu(!showOrdersMenu)}
                  >
                    x
                  </span>
                  <div
                    className="bg-white/20 p-4 my-5 rounded-lg backdrop-blur-md shadow-md"
                    dir="rtl"
                  >
                    <h3 className="text-2xl text-black font-semibold mb-4 border-b border-gray-400 pb-2">
                      جابجایی سکشن
                    </h3>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={orders}
                        strategy={verticalListSortingStrategy}
                      >
                        {orders.map((id: string) => (
                          <SortableItem key={id} id={id} />
                        ))}
                      </SortableContext>
                    </DndContext>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              drag="y"
              initial={{ y: isOpen ? 100 : "calc(100% - 40px)" }}
              animate={{ y: isOpen ? 0 : "calc(100% - 40px)" }}
              dragConstraints={{ top: 0, bottom: 0 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 bg-white z-50 bg-opacity-90 rounded-t-3xl shadow-2xl 
              sm:w-[95%]  
              md:w-[100%] "
            >
              <div
                className="h-10 w-full flex justify-center items-center cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              >
                <div className="w-20 h-1.5 bg-black/60 rounded-full" />
              </div>

              {/* Add the orders button here */}
              <div className="flex justify-between items-center px-4">
                <button
                  onClick={() => setShowOrdersMenu(!showOrdersMenu)}
                  className={
                    !showOrdersMenu
                      ? `w-fit m-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors`
                      : "w-fit m-2 px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  }
                >
                  {!showOrdersMenu ? "جابجایی" : "منو"}
                </button>
                {!showOrdersMenu && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="m-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                  >
                    {!isModalOpen ? "انتخاب سکشن" : "بازگشت به تنظیمات"}
                  </button>
                )}
                <AnimatePresence>
                  {isModalOpen && (
                    <motion.div
                      dir="rtl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="fixed inset-0 bg-black bg-opacity-50 min-h-screen overflow-y-auto flex items-center justify-center z-[9999]"
                    >
                      <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{
                          type: "spring",
                          damping: 30,
                          stiffness: 300,
                          duration: 0.6,
                        }}
                        className="bg-white/60 relative backdrop-blur-sm h-[100vh] rounded-2xl  w-full overflow-y-auto shadow-lg"
                      >
                        <div className="mb-4 absolute top-2 right-2 z-10">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsModalOpen(false)}
                            className="text-white hover:text-gray-700 text-2xl p-1 font-bold"
                          >
                            ✕
                          </motion.button>
                        </div>
                        {/* Modal content will go here */}
                        <motion.div
                          initial={{ y: 0, opacity: 0 }}
                          animate={{ y: 20, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="p-2 overflow-y-visible w-[80%] mx-auto mb-54 z-50 flex flex-col items-center gap-2"
                        >
                          <div
                            onClick={() => addSection("RichText")}
                            className="flex flex-col items-center h-48 bg-cover bg-center bg-no-repeat hover:scale-95 transition-all duration-300 relative group"
                            style={{
                              ...imageContainerStyle,
                              backgroundImage: `url(${richtextSm.src})`,
                              maxWidth: "100%",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                            }}
                          >
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                            <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              متن غنی
                            </span>
                          </div>
                          <div
                            onClick={() => addSection("ImageText")}
                            className="flex flex-col items-center w-full h-48 bg-cover bg-center bg-no-repeat hover:scale-95 transition-all duration-300 relative group"
                            style={{
                              ...imageContainerStyle,
                              backgroundImage: `url(${imagetextSm.src})`,
                              backgroundSize: "cover",
                              maxWidth: "100%",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                            }}
                          >
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                            <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              عکس نوشته
                            </span>
                          </div>
                          <div
                            onClick={() => addSection("Banner")}
                            className="flex flex-col items-center w-full h-48 bg-cover bg-center bg-no-repeat hover:scale-95 transition-all duration-300 relative group"
                            style={{
                              ...imageContainerStyle,
                              backgroundImage: `url(${bannerSm.src})`,
                              backgroundSize: "contain",
                              maxWidth: "100%",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                            }}
                          >
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                            <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              بنر
                            </span>
                          </div>
                          <div
                            onClick={() => addSection("CollapseFaq")}
                            className="flex flex-col items-center w-full h-48 bg-cover bg-center bg-no-repeat hover:scale-95 transition-all duration-300 relative group"
                            style={{
                              ...imageContainerStyle,
                              backgroundImage: `url(${collapseSm.src})`,
                              backgroundSize: "cover",
                              maxWidth: "100%",
                              height: "30rem",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                            }}
                          >
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                            <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              سوالات متداول
                            </span>
                          </div>
                          <div
                            onClick={() => addSection("ContactForm")}
                            className="flex flex-col items-center w-full h-48 bg-cover bg-center bg-no-repeat hover:scale-95 transition-all duration-300 relative group"
                            style={{
                              ...imageContainerStyle,
                              backgroundImage: `url(${contactSm.src})`,
                              backgroundSize: "cover",
                              maxWidth: "100%",
                              height: "20rem",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                            }}
                          >
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                            <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              {"ارتباط با ما"}
                            </span>
                          </div>
                          <div
                            onClick={() => addSection("NewsLetter")}
                            className="flex flex-col items-center w-full h-48 bg-cover bg-center bg-no-repeat hover:scale-95 transition-all duration-300 relative group"
                            style={{
                              ...imageContainerStyle,
                              backgroundImage: `url(${newsletterSm.src})`,
                              backgroundSize: "cover",
                              maxWidth: "100%",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                            }}
                          >
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                            <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              خبرنامه
                            </span>
                          </div>
                          <div
                            onClick={() => addSection("MultiColumn")}
                            className="flex flex-col items-center w-full h-48 bg-cover bg-center bg-no-repeat hover:scale-95 transition-all duration-300 relative group"
                            style={{
                              ...imageContainerStyle,
                              backgroundImage: `url(${columnSm.src})`,
                              backgroundSize: "cover",
                              height: "30rem",
                              maxWidth: "100%",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                            }}
                          >
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                            <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              ستون ها
                            </span>
                          </div>
                          <div
                            onClick={() => addSection("SlideShow")}
                            className="flex flex-col items-center w-full h-48 bg-cover bg-center bg-no-repeat hover:scale-95 transition-all duration-300 relative group"
                            style={{
                              ...imageContainerStyle,
                              backgroundImage: `url(${slideSm.src})`,
                              backgroundSize: "contain",
                              maxWidth: "100%",
                              height: "27rem",
                              backgroundPosition: "top",
                              backgroundRepeat: "no-repeat",
                            }}
                          >
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                            <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              اسلاید شو
                            </span>
                          </div>
                          <div
                            onClick={() => addSection("MultiRow")}
                            className="flex flex-col items-center w-full h-48 bg-cover bg-center bg-no-repeat hover:scale-95 transition-all duration-300 relative group"
                            style={{
                              ...imageContainerStyle,
                              backgroundImage: `url(${rowSm.src})`,
                              backgroundSize: "contain",
                              maxWidth: "100%",
                              height: "30rem",
                              backgroundPosition: "top",
                              backgroundRepeat: "no-repeat",
                            }}
                          >
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                            <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              ردیف ها
                            </span>
                          </div>
                          <div
                            onClick={() => addSection("Video")}
                            className="flex flex-col items-center w-full h-48 bg-cover bg-center bg-no-repeat hover:scale-95 transition-all duration-300 relative group"
                            style={{
                              ...imageContainerStyle,
                              backgroundImage: `url(${videoSm.src})`,
                              backgroundSize: "cover",
                              maxWidth: "100%",
                              height: "20rem",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                            }}
                          >
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                            <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              ویدیو
                            </span>
                          </div>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="max-h-[calc(60vh-40px)] min-h-[calc(40vh-30px)] overflow-y-auto p-6">
                <h2 className="text-xl font-bold text-white rounded-xl bg-blue-500 p-2.5 mb-4 text-center animate-pulse transition-all duration-300">
                  {selectedComponent} - تنظیمات سکشن
                </h2>
                {renderFormContent(
                  setUserInputData,
                  userInputData as Section,
                  selectedComponent
                )}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </>
  );
};
