"use client";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { DragEndEvent } from "@dnd-kit/core";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { FaArrowLeft, FaBars, FaExchangeAlt, FaPuzzlePiece } from "react-icons/fa";
import { RiRobot3Line } from "react-icons/ri";
import richtextImage from "@/public/assets/images/richtext.png";
import ImageTextImage from "@/public/assets/images/imagetext.png";
import bannerImage from "@/public/assets/images/banner.jpg";
import CollapseFaqImage from "@/public/assets/images/collapse.png";
import contactImage from "@/public/assets/images/contact.png";
import newsLetterImage from "@/public/assets/images/newsletter.png";
import multiColumnImage from "@/public/assets/images/multicolumn.png";
import slideShowImage from "@/public/assets/images/slideShow.png";
import multiRowImage from "@/public/assets/images/multirow.png";
// import video from "@/public/assets/images/video.png";
// import videoSm from "@/public/assets/images/videoSm.png";
import rowSm from "@/public/assets/images/rowSm.png";
import slideSm from "@/public/assets/images/slideSm.png";
import columnSm from "@/public/assets/images/columnSm.png";
import newsletterSm from "@/public/assets/images/newsletterSm.png";
import contactSm from "@/public/assets/images/contactSm.png";
import collapseSm from "@/public/assets/images/collapseSm.png";
import bannerSm from "@/public/assets/images/BannerSm.png";
import imagetextSm from "@/public/assets/images/imagetextSm.png";
import richtextSm from "@/public/assets/images/richtextSm.png";
// import collectionSm from "@/public/assets/images/collectionsm.png";
// import collection from "@/public/assets/images/collection.png";
import brand from "@/public/assets/images/brand.png";
import gallery from "@/public/assets/images/gallery.png";
// import market from "@/public/assets/images/market.png";
import newproduct from "@/public/assets/images/newproduct.png";
import offer from "@/public/assets/images/offer.png";
import slidebanner from "@/public/assets/images/slidebanner.png";
import story from "@/public/assets/images/story-1.png";
import canvasEditorImage from "@/public/assets/images/canvasEditorImage.png";
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
  MultiColumnSection,
  NewsLetterSection,
  RichTextSection,
  Section,
  BlogDetailSection,
  StorySection,
  SpecialOfferSection,
  GallerySection,
  SlideBannerSection,
  OfferRowSection,
  BrandsSection,
  ProductRowSection,
} from "@/lib/types";
import { MultiColumnForm } from "./forms/multiColomnForm";
import { SlideForm } from "./forms/slideForm";
import { MultiRowForm } from "./forms/multiRowForm";
import { FooterForm } from "./forms/footerForm";
import { Create } from "./C-D";
import ProductListForm from "./forms/productForm";
import { DetailForm } from "./forms/detailForm";
import BlogListForm from "./forms/blogForm";
import { BlogDetailForm } from "./forms/blogDetailForm";
import { StoryForm } from "./forms/storyForm";
import GalleryForm from "./forms/galleryForm";
import { SlideBannerForm } from "./forms/slideBannerForm";
import { OfferRowForm } from "./forms/offerRowForm";
import { BrandsForm } from "./forms/brandsForm";
import { ProductRowForm } from "./forms/productRowForm";
import { styled } from "styled-components";
import { SpecialForm } from "./forms/specialForm";
import { useSharedContext } from "@/app/contexts/SharedContext";
import CanvasEditorForm from "./forms/canvasEditorForm";
import { AIModal } from "./AIModal";
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
  | StorySection
  | SpecialOfferSection
  | GallerySection
  | SlideBannerSection
  | OfferRowSection
  | BrandsSection
  | CollectionSection
  | ProductRowSection
  | BlogSection;

const sections = [
  {
    id: "SpecialOffer",
    label: "پیشنهاد شگفت انگیز",
    image: offer,
    bgSize: "cover",
    bgPosition: "center",
  },
  // {
  //   id: "OfferRow",
  //   label: "پیشنهاد های هفتگی",
  //   image: market,
  //   bgSize: "cover",
  //   bgPosition: "center",
  // },
  {
    id: "ProductsRow",
    label: "محصولات",
    image: newproduct,
    bgSize: "cover",
    bgPosition: "center",
  },
  {
    id: "Brands",
    label: "برند",
    image: brand,
    bgSize: "cover",
    bgPosition: "center",
  },
  {
    id: "Gallery",
    label: "گالری",
    image: gallery,
    bgSize: "cover",
    bgPosition: "center",
  },
  {
    id: "SlideBanner",
    label: "بنر",
    image: slidebanner,
    bgSize: "cover",
    bgPosition: "center",
  },
  {
    id: "Story",
    label: "استوری",
    image: story,
    bgSize: "cover",
    bgPosition: "center",
  },
  {
    id: "RichText",
    label: "متن غنی",
    image: richtextImage,
    bgSize: "cover",
    bgPosition: "center",
  },
  {
    id: "ImageText",
    label: "عکس نوشته",
    image: ImageTextImage,
    bgSize: "cover",
    bgPosition: "center",
  },
  {
    id: "Banner",
    label: "بنر",
    image: bannerImage,
    bgSize: "cover",
    bgPosition: "center",
  },
  {
    id: "CollapseFaq",
    label: "سوالات متداول",
    image: CollapseFaqImage,
    bgSize: "cover",
    bgPosition: "center",
  },
  {
    id: "ContactForm",
    label: "ارتباط با ما",
    image: contactImage,
    bgSize: "cover",
    bgPosition: "center",
  },
  {
    id: "NewsLetter",
    label: "خبرنامه",
    image: newsLetterImage,
    bgSize: "cover",
    bgPosition: "center",
  },
  {
    id: "MultiColumn",
    label: "ستون ها",
    image: multiColumnImage,
    bgSize: "cover",
    bgPosition: "center",
  },
  {
    id: "SlideShow",
    label: "اسلاید شو",
    image: slideShowImage,
    bgSize: "cover",
    bgPosition: "center",
  },
  {
    id: "MultiRow",
    label: "ردیف ها",
    image: multiRowImage,
    bgSize: "cover",
    bgPosition: "center",
  },
  // {
  //   id: "Video",
  //   label: "ویدیو",
  //   image: video,
  //   bgSize: "cover",
  //   bgPosition: "center",
  // },
  {
    id: "CanvasEditor",
    label: "ویرایشگر کانوا",
    image: canvasEditorImage,
    bgSize: "cover",
    bgPosition: "center",
  },
  // {
  //   id: "Collection",
  //   label: "کالکشن",
  //   image: collection,
  //   bgSize: "cover",
  //   bgPosition: "center",
  // },
];

// Updated smSections array
const smSections = [
  {
    name: "RichText",
    title: "متن غنی",
    image: richtextSm.src,
    height: "10rem",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  {
    name: "ImageText",
    title: "عکس نوشته",
    image: imagetextSm.src,
    height: "10rem",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  {
    name: "Banner",
    title: "بنر",
    image: bannerSm.src,
    height: "10rem",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  {
    name: "CollapseFaq",
    title: "سوالات متداول",
    image: collapseSm.src,
    height: "10rem",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  {
    name: "ContactForm",
    title: "ارتباط با ما",
    image: contactSm.src,
    height: "10rem",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  {
    name: "NewsLetter",
    title: "خبرنامه",
    image: newsletterSm.src,
    height: "10rem",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  {
    name: "MultiColumn",
    title: "ستون ها",
    image: columnSm.src,
    height: "10rem",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  {
    name: "SlideShow",
    title: "اسلاید شو",
    image: slideSm.src,
    height: "10rem",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  {
    name: "MultiRow",
    title: "ردیف ها",
    image: rowSm.src,
    height: "10rem",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  // {
  //   name: "Video",
  //   title: "ویدیو",
  //   image: videoSm.src,
  //   height: "10rem",
  //   backgroundSize: "cover",
  //   backgroundPosition: "center",
  // },
  {
    name: "CanvasEditor",
    title: "ویرایشگر کانوا",
    image: canvasEditorImage?.src,
    height: "10rem",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  // {
  //   name: "Collection",
  //   title: "کالکشن",
  //   image: collectionSm.src,
  //   height: "10rem",
  //   backgroundSize: "cover",
  //   backgroundPosition: "center",
  // },
];

const themeStyles = `
  --card-border-radius: 12px;
  --card-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  --card-hover-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  --primary-color: #3b82f6;
  --text-color: #1f2937;
  --overlay-bg: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.2));
`;

// Start scrollbar styles for webkit browsers
const scrollbarStyles = `
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-thumb {
    background: #9ca3af;
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
  }
  ::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 3px;
  }
  ::-webkit-scrollbar-track:hover {
    background: #e5e7eb;
  }
`;

const FormContainer = styled.div`
  ${themeStyles}
  width: 100%;
  height: 100%;
`;

const ScrollableFormContent = styled.div`
  ${scrollbarStyles}
  position: relative;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;

// End scrollbar styles for webkit browsers

export const Form = () => {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Get shared state from context
  const {
    selectedComponent,
    setSelectedComponent,
    setLayout,
    layout,
    orders,
    setOrders,
    isFormOpen,
    setIsFormOpen,
  } = useSharedContext();
  const [userInputData, setUserInputData] = useState<FormData>({} as FormData);
  const [isOpen, setIsOpen] = useState(false);
  const [showOrdersMenu, setShowOrdersMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);
  console.log(selectedComponent, contentHeight);
  // for get the height of form
  useEffect(() => {
    const updateHeight = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
    };

    updateHeight();

    // Update height when content changes
    const observer = new ResizeObserver(updateHeight);
    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => observer.disconnect();
  }, [showOrdersMenu, selectedComponent, userInputData]);

  // Open form when a component is selected
  useEffect(() => {
    if (selectedComponent) {
      setIsFormOpen(true);
    }
  }, [selectedComponent]);

  // Setup sensors for dnd-kit with better performance
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const addSection = (componentName: string) => {
    Create(componentName, layout, setLayout);
    setIsModalOpen(false);

    setTimeout(() => {
      const previewContainer = document.querySelector(
        '[data-preview-container="true"]'
      );
      if (previewContainer) {
        previewContainer.scrollTo({
          top: previewContainer.scrollHeight / 1.1,
          behavior: "smooth",
        });
      }
    }, 300);

    toast.success(`${componentName} اضافه شد`, {
      position: "top-center",
      duration: 2000,
      style: {
        background: "#4CAF50",
        color: "#fff",
        borderRadius: "10px",
        padding: "16px",
      },
    });
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
    if (
      userInputData &&
      typeof userInputData === "object" &&
      Object.keys(userInputData).length > 0
    ) {
      const newLayout = JasonChanger(
        layout,
        selectedComponent,
        userInputData as Section
      );
      setLayout(newLayout);
    }
  }, [userInputData]);

  const SortableItem = React.memo(({ id }: { id: string }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition: isDragging ? "none" : transition, // Disable transition during drag
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`
          p-3 bg-white border-2 border-gray-200 
          hover:border-blue-300 hover:shadow-sm
          rounded-lg flex items-center gap-3 cursor-grab 
          transition-colors duration-150
          ${isDragging ? "shadow-lg border-blue-400 bg-blue-50 z-50" : ""}
        `}
      >
        <div className="flex items-center justify-center w-5 h-5 bg-gray-100 rounded">
          <svg
            className="w-3 h-3 text-gray-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M3 15h18v-2H3v2zm0 4h18v-2H3v2zm0-8h18V9H3v2zm0-6v2h18V5H3z" />
          </svg>
        </div>
        <span className="text-sm font-medium text-gray-700 flex-1">{id}</span>
        <div className="w-1 h-6 bg-gray-300 rounded-full opacity-50" />
      </div>
    );
  });

  SortableItem.displayName = "SortableItem";

  useEffect(() => {
    if (layout?.sections?.children?.order) {
      setOrders([...layout.sections.children.order]);
    }
  }, [layout?.sections?.children?.order]);

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (active.id !== over?.id && over) {
        const oldIndex = orders.indexOf(active.id as string);
        const newIndex = orders.indexOf(over.id as string);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newOrders = arrayMove(orders, oldIndex, newIndex);

          // Batch state updates
          setOrders(newOrders);
          if (layout?.sections?.children) {
            setLayout((prevLayout) => ({
              ...prevLayout,
              sections: {
                ...prevLayout.sections,
                children: {
                  ...prevLayout.sections.children,
                  order: newOrders,
                },
              },
            }));
          }
        }
      }
    },
    [orders, layout, setOrders, setLayout]
  );

  const renderFormContent = (
    setUserInputData: React.Dispatch<React.SetStateAction<FormData>>,
    userInputData: FormData,
    selectedComponent: string
  ) => {
    const baseComponentName = selectedComponent.split("-")[0].split(":")[0];
    // console.log(  baseComponentName);

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
      case "Gallery":
        return (
          <GalleryForm
            setUserInputData={
              setUserInputData as React.Dispatch<
                React.SetStateAction<GallerySection>
              >
            }
            userInputData={userInputData as GallerySection}
            layout={layout}
            selectedComponent={selectedComponent}
          />
        );
      case "CanvasEditor":
        return (
          <CanvasEditorForm
            setUserInputData={
              setUserInputData as unknown as React.Dispatch<
                React.SetStateAction<
                  import("@/app/components/sections/canvasEditor").CanvasEditorSection
                >
              >
            }
            userInputData={
              userInputData as unknown as import("@/app/components/sections/canvasEditor").CanvasEditorSection
            }
            layout={layout}
            selectedComponent={selectedComponent}
            setLayout={setLayout}
            setSelectedComponent={setSelectedComponent}
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
      case "SlideBanner":
        return (
          <SlideBannerForm
            setUserInputData={
              setUserInputData as React.Dispatch<
                React.SetStateAction<SlideBannerSection>
              >
            }
            userInputData={userInputData as SlideBannerSection}
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
      case "Story":
        return (
          <StoryForm
            setUserInputData={
              setUserInputData as React.Dispatch<
                React.SetStateAction<StorySection>
              >
            }
            userInputData={userInputData as StorySection}
            layout={layout}
            selectedComponent={selectedComponent}
          />
        );
      case "SpecialOffer":
        return (
          <SpecialForm
            setUserInputData={
              setUserInputData as React.Dispatch<
                React.SetStateAction<SpecialOfferSection>
              >
            }
            userInputData={userInputData as SpecialOfferSection}
            layout={layout}
            selectedComponent={selectedComponent}
          />
        );
      case "OfferRow":
        return (
          <OfferRowForm
            setUserInputData={
              setUserInputData as React.Dispatch<
                React.SetStateAction<OfferRowSection>
              >
            }
            userInputData={userInputData as OfferRowSection}
            layout={layout}
            selectedComponent={selectedComponent}
          />
        );
      case "Brands":
        return (
          <BrandsForm
            setUserInputData={
              setUserInputData as React.Dispatch<
                React.SetStateAction<BrandsSection>
              >
            }
            userInputData={userInputData as BrandsSection}
            layout={layout}
            selectedComponent={selectedComponent}
          />
        );
      case "ProductsRow":
        return (
          <ProductRowForm
            setUserInputData={
              setUserInputData as React.Dispatch<
                React.SetStateAction<ProductRowSection>
              >
            }
            userInputData={userInputData as ProductRowSection}
            layout={layout}
            selectedComponent={selectedComponent}
          />
        );
      default:
        return <div>یک سکشن را برای تنظیمات کلیک کنید...</div>;
    }
  };

  const ordersButton = (
    <div className="flex items-center gap-2 justify-between p-4 mt-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowOrdersMenu(!showOrdersMenu)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-xs transition-all duration-300 shadow-sm
          ${
            !showOrdersMenu
              ? "bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/25"
              : "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25"
          }
        `}
      >
        {!showOrdersMenu ? (
          <>
            <FaExchangeAlt className="w-4 h-4" />
            جابجایی و سکشن ها
          </>
        ) : (
          <>
            <FaArrowLeft className="w-4 h-4" />
            بازگشت
          </>
        )}
      </motion.button>

      {/* Right Side Buttons */}
      <div className="flex items-center gap-3">
        {/* AI Assistant Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsAIModalOpen(true)}
          className="p-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-lg shadow-lg transition-all duration-300"
        >
          <RiRobot3Line className="w-5 h-5" />
        </motion.button>

        {/* Add Section Button */}
        <AnimatePresence mode="wait">
          {showOrdersMenu && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="flex items-center text-nowrap gap-2 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium text-xs shadow-lg shadow-emerald-500/25 transition-all duration-300"
            >
              <FaPuzzlePiece className="w-4 h-4" />
              افزودن
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <FormContainer>
      <Toaster />
      <div>
        <motion.button
          className="absolute top-1 right-4 z-[9999] hidden lg:block p-2 text-black rounded-lg hover:bg-gray-100 transition-colors backdrop-blur-sm"
          onClick={() => setIsFormOpen(!isFormOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-4 h-4 flex flex-col justify-center items-center">
            <motion.span
              animate={isFormOpen ? "open" : "closed"}
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: 45, y: 6 },
              }}
              transition={{ duration: 0.3 }}
              className="w-5 h-0.5 bg-current block transform origin-center"
            />
            <motion.span
              animate={isFormOpen ? "open" : "closed"}
              variants={{
                closed: { opacity: 1 },
                open: { opacity: 0 },
              }}
              transition={{ duration: 0.3 }}
              className="w-5 h-0.5 bg-current block transform origin-center mt-1"
            />
            <motion.span
              animate={isFormOpen ? "open" : "closed"}
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: -45, y: -6 },
              }}
              transition={{ duration: 0.3 }}
              className="w-5 h-0.5 bg-current block transform origin-center mt-1"
            />
          </div>
        </motion.button>
        {isFormOpen && (
          <>
            {isModalOpen && (
              <motion.div
                dir="rtl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.95 }}
                className="fixed inset-0 hidden backdrop-blur-md bg-black bg-opacity-70 lg:flex items-center justify-center z-[9999] overflow-y-auto"
              >
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{
                    type: "spring",
                    damping: 20,
                    stiffness: 200,
                    duration: 0.6,
                  }}
                  className="bg-white/50 backdrop-blur-lg border border-gray-200 p-8 rounded-2xl w-full max-w-6xl max-h-[80vh] overflow-auto shadow-xl relative"
                >
                  <div className="sticky top-0 right-0 flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsModalOpen(false)}
                      className="text-gray-700 hover:text-gray-900 text-lg font-semibold transition-all duration-200"
                    >
                      ✕
                    </motion.button>
                  </div>
                  {/* Modal content will go here */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="grid grid-cols-1  gap-2"
                  >
                    {sections.map(
                      ({ id, label, image, bgSize, bgPosition = "center" }) => (
                        <motion.div
                          key={id}
                          onClick={() => addSection(id)}
                          whileHover={{
                            scale: 1.03,
                            boxShadow: "var(--card-hover-shadow)",
                          }}
                          whileTap={{ scale: 0.98 }}
                          className="relative cursor-pointer group"
                          style={imageContainerStyle}
                          role="button"
                          aria-label={`Add ${label} section`}
                        >
                          <div
                            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                            style={{
                              backgroundImage: `url(${image?.src})`,
                              backgroundSize: bgSize,
                              backgroundPosition: bgPosition,
                            }}
                          />
                          <div className="absolute inset-0 bg-[var(--overlay-bg)] group-hover:opacity-70 transition-opacity duration-300" />
                          <span className="absolute inset-0 flex items-center justify-center text-white text-lg font-semibold text-center px-4 drop-shadow-md group-hover:scale-105 transition-transform duration-300">
                            {label}
                          </span>
                        </motion.div>
                      )
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
            {/* Desktop Sidebar */}
            {isFormOpen && (
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ x: "100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    type: "tween",
                    stiffness: 150,
                    damping: 20,
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                  className="fixed right-0 hidden lg:block top-0 h-screen w-[270px] bg-white/80 backdrop-blur-sm ease-in-out border-l-2 border-white/40 rounded overflow-hidden"
                  style={{ zIndex: 1000 }}
                >
                  {/* Scrollable Container with custom scrollbar */}
                  <ScrollableFormContent>
                    {/* <motion.div
                      className="absolute top-0 left-0 right-0 bg-white backdrop-blur-sm"
                      style={{
                        height: `${Math.max(
                          contentHeight,
                          window.innerHeight
                        )}px`,
                        width: "100%",
                        maxWidth: "270px",
                      }}
                    />

                     <motion.div
                      className="absolute top-0 left-0 right-0 bg-white   backdrop-blur-sm"
                      style={{
                        height: `${Math.max(
                          contentHeight,
                          window.innerHeight
                        )}px`,
                        width: "100%",
                        maxWidth: "270px",
                      }}
                    /> */}

                    {/* Content Layer */}
                    <div ref={contentRef} className="relative z-10 w-full">
                      <div className="relative w-full">
                        {ordersButton}

                        <div className="p-2 w-full">
                          <h2
                            className="text-xl mb-2 border-b-2 text-right pb-2 w-fit border-blue-500 font-bold text-[#343a40] ml-auto"
                            dir="rtl"
                          >
                            {showOrdersMenu ? "جابجایی سکشن" : "تنظیمات سکشن"}
                          </h2>
                          {showOrdersMenu ? (
                            <div
                              className="p-4 bg-white rounded-lg shadow-lg w-full"
                              dir="rtl"
                            >
                              <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                              >
                                <SortableContext
                                  items={orders}
                                  strategy={verticalListSortingStrategy}
                                >
                                  <div className="space-y-2">
                                    {orders.map((id: string) => (
                                      <SortableItem key={id} id={id} />
                                    ))}
                                  </div>
                                </SortableContext>
                              </DndContext>
                            </div>
                          ) : (
                            <div className="w-full">
                              {renderFormContent(
                                setUserInputData,
                                userInputData as Section,
                                selectedComponent
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </ScrollableFormContent>
                </motion.div>
              </AnimatePresence>
            )}

            {/* Mobile/Tablet Bottom Sheet */}
            <AnimatePresence mode="wait">
              {showOrdersMenu && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed lg:hidden inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
                    onClick={() => setShowOrdersMenu(false)}
                  />

                  {/* Bottom Sheet */}
                  <motion.div
                    initial={{ opacity: 0, y: "100%" }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: "100%" }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      duration: 0.4,
                    }}
                    className="fixed lg:hidden bottom-0 left-0 right-0 max-h-[85vh] bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden z-[9999] rounded-t-3xl border-t border-gray-200"
                  >
                    {/* Handle Bar */}
                    <div className="flex justify-center py-3 bg-gradient-to-b from-gray-50 to-transparent">
                      <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                    </div>

                    {/* Close Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-4 left-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors z-[10000]"
                      onClick={() => setShowOrdersMenu(false)}
                    >
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </motion.button>

                    {/* Content */}
                    <div
                      className="px-6 pb-8 overflow-y-auto max-h-[calc(85vh-80px)]"
                      dir="rtl"
                    >
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                          جابجایی سکشن
                        </h3>
                        <p className="text-sm text-gray-600">
                          برای تغییر ترتیب، آیتم‌ها را بکشید و رها کنید
                        </p>
                      </div>

                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-100">
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={handleDragEnd}
                        >
                          <SortableContext
                            items={orders}
                            strategy={verticalListSortingStrategy}
                          >
                            <div className="space-y-2">
                              {orders.map((id: string) => (
                                <SortableItem key={id} id={id} />
                              ))}
                            </div>
                          </SortableContext>
                        </DndContext>
                      </div>
                    </div>
                  </motion.div>
                </>
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
              <div className="flex justify-between items-center gap-2 px-4">
                <button
                  onClick={() => setShowOrdersMenu(!showOrdersMenu)}
                  className={
                    !showOrdersMenu
                      ? `w-fit  px-4 py-2 bg-blue-500 text-white rounded-xl  transition-colors`
                      : "w-fit  px-4 py-2 bg-yellow-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                  }
                >
                  {!showOrdersMenu ? "جابجایی" : "منو"}
                </button>
                <motion.button
                  id="aiAssistant"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsAIModalOpen(true)}
                  className={`   text-xs font-semibold px-4 py-2 bg-purple-600 rounded-xl justify-start border-gray-400   
                   transition-all duration-300 transform`}
                >
                  <RiRobot3Line className="w-5 h-5 text-white" />
                </motion.button>
                {!showOrdersMenu && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className=" px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                  >
                    {!isModalOpen ? "انتخاب سکشن" : "بازگشت به تنظیمات"}
                  </button>
                )}
                <AnimatePresence>
                  {isModalOpen && (
                    <>
                      {/* Backdrop */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
                        onClick={() => setIsModalOpen(false)}
                      />

                      {/* Modal */}
                      <motion.div
                        dir="rtl"
                        initial={{ opacity: 0, y: "100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "100%" }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                          duration: 0.4,
                        }}
                        className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden z-[9999] rounded-t-3xl border-t border-gray-200"
                      >
                        {/* Handle Bar */}
                        <div className="flex justify-center py-3 bg-gradient-to-b from-gray-50 to-transparent">
                          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                        </div>

                        {/* Close Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute top-4 left-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors z-[10000]"
                          onClick={() => setIsModalOpen(false)}
                        >
                          <svg
                            className="w-5 h-5 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </motion.button>

                        {/* Content */}
                        <div className="px-6 pb-8 overflow-y-auto max-h-[calc(85vh-80px)]">
                          <div className="mb-6">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                              انتخاب سکشن
                            </h3>
                            <p className="text-sm text-gray-600">
                              سکشن مورد نظر خود را انتخاب کنید
                            </p>
                          </div>

                          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-100">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {smSections.map(
                                ({
                                  name,
                                  title,
                                  image,
                                  height = "160px",
                                  backgroundSize = "cover",
                                  backgroundPosition = "center",
                                }) => (
                                  <motion.div
                                    key={name}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => addSection(name)}
                                    className="relative cursor-pointer rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 group bg-white"
                                    style={{ height }}
                                  >
                                    {/* Background Image */}
                                    {image && (
                                      <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                                        style={{
                                          backgroundImage: `url(${image})`,
                                          backgroundSize,
                                          backgroundPosition,
                                          backgroundRepeat: "no-repeat",
                                        }}
                                      />
                                    )}

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                                    {/* Content */}
                                    <div className="absolute inset-0 flex flex-col justify-end p-4">
                                      <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        <h3 className="text-white text-lg font-bold mb-2 drop-shadow-lg">
                                          {title}
                                        </h3>
                                        <div className="w-12 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                      </div>
                                    </div>

                                    {/* Add Icon */}
                                    <div className="absolute top-4 left-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                      <svg
                                        className="w-5 h-5 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M12 4v16m8-8H4"
                                        />
                                      </svg>
                                    </div>
                                  </motion.div>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </>
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
        )}{" "}
        <AIModal
          isOpen={isAIModalOpen}
          onClose={() => setIsAIModalOpen(false)}
          currentStyles={JSON.stringify(userInputData || {})}
          onApplyChanges={(data) => setUserInputData(data as FormData)}
        />
      </div>
    </FormContainer>
  );
};
