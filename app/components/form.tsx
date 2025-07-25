"use client";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { DragEndEvent } from "@dnd-kit/core";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { FaBars, FaExchangeAlt, FaPuzzlePiece, FaRobot } from "react-icons/fa";
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
import collectionSm from "@/public/assets/images/collectionsm.png";
import collection from "@/public/assets/images/collection.png";
import brand from "@/public/assets/images/brand.png";
import gallery from "@/public/assets/images/gallery.png";
import market from "@/public/assets/images/market.png";
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
import { set } from "lodash";
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
  },
  {
    id: "OfferRow",
    label: "پیشنهاد های هفتگی",
    image: market,
    bgSize: "contain",
  },
  { id: "ProductsRow", label: "محصولات", image: newproduct, bgSize: "cover" },
  { id: "Brands", label: "برند", image: brand, bgSize: "cover" },
  { id: "Gallery", label: "گالری", image: gallery, bgSize: "cover" },
  { id: "SlideBanner", label: "بنر", image: slidebanner, bgSize: "cover" },
  { id: "Story", label: "استوری", image: story, bgSize: "cover" },
  { id: "RichText", label: "متن غنی", image: richtextImage, bgSize: "cover" },
  {
    id: "ImageText",
    label: "عکس نوشته",
    image: ImageTextImage,
    bgSize: "cover",
  },
  { id: "Banner", label: "بنر", image: bannerImage, bgSize: "cover" },
  {
    id: "CollapseFaq",
    label: "سوالات متداول",
    image: CollapseFaqImage,
    bgSize: "cover",
    bgPosition: "top",
  },
  {
    id: "ContactForm",
    label: "ارتباط با ما",
    image: contactImage,
    bgSize: "cover",
    bgPosition: "top",
  },
  {
    id: "NewsLetter",
    label: " خبرنامه",
    image: newsLetterImage,
    bgSize: "cover",
    bgPosition: "top",
  },
  {
    id: "MultiColumn",
    label: "ستون ها",
    image: multiColumnImage,
    bgSize: "cover",
  },
  {
    id: "SlideShow",
    label: " اسلاید شو",
    image: slideShowImage,
    bgSize: "cover",
    bgPosition: "top",
  },
  {
    id: "MultiRow",
    label: "  ردیف ها",
    image: multiRowImage,
    bgSize: "cover",
    bgPosition: "top",
  },
  { id: "Video", label: "   ویدیو", image: video, bgSize: "contain" },
  {
    id: "CanvasEditor",
    label: "ویرایشگر کانوا",
    image: canvasEditorImage,
    bgSize: "cover",
  },
  { id: "Collection", label: "کالکشن", image: collection, bgSize: "contain" },
];
const smSections = [
  {
    name: "RichText",
    title: "متن غنی",
    image: richtextSm.src,
    height: "12rem",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  {
    name: "ImageText",
    title: "عکس نوشته",
    image: imagetextSm.src,
    height: "12rem",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  {
    name: "Banner",
    title: "بنر",
    image: bannerSm.src,
    height: "12rem",
    backgroundSize: "contain",
    backgroundPosition: "center",
  },
  {
    name: "CollapseFaq",
    title: "سوالات متداول",
    image: collapseSm.src,
    height: "30rem",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  {
    name: "ContactForm",
    title: "ارتباط با ما",
    image: contactSm.src,
    height: "20rem",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  {
    name: "NewsLetter",
    title: "خبرنامه",
    image: newsletterSm.src,
    height: "12rem",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  {
    name: "MultiColumn",
    title: "ستون ها",
    image: columnSm.src,
    height: "30rem",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  {
    name: "SlideShow",
    title: "اسلاید شو",
    image: slideSm.src,
    height: "27rem",
    backgroundSize: "contain",
    backgroundPosition: "top",
  },
  {
    name: "MultiRow",
    title: "ردیف ها",
    image: rowSm.src,
    height: "30rem",
    backgroundSize: "contain",
    backgroundPosition: "top",
  },
  {
    name: "Video",
    title: "ویدیو",
    image: videoSm.src,
    height: "20rem",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  {
    name: "CanvasEditor",
    title: "ویرایشگر کانوا",
    image: canvasEditorImage?.src,
    height: "12rem",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  {
    name: "Collection",
    title: "کالکشن",
    image: collectionSm.src,
    height: "20rem",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  {
    name: "SliderCard",
    title: "اسلایدر کارت",
    // image: slidercardSm.src,
    height: "20rem",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  {
    name: "CategoryBox",
    title: "دسته بندی",
    // image: categoryboxSm.src,
    height: "12rem",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  {
    name: "BlogCard",
    title: "مقالات",
    // image: blogcardSm.src,
    height: "20rem",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  {
    name: "FloatingCard",
    title: "کارت شناور",
    // image: floatingcardSm.src,
    height: "15rem",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  {
    name: "Timeline",
    title: "تایملاین",
    // image: timelineSm.src,
    height: "30rem",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  {
    name: "FeatureBox",
    title: "فیچر باکس",
    // image: featureboxSm.src,
    height: "15rem",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  {
    name: "PriceTable",
    title: "جدول قیمت",
    // image: pricetableSm.src,
    height: "20rem",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
];

// Start scrollbar styles for webkit browsers
const scrollbarStyles = `
  /* Scrollbar Track */
  ::-webkit-scrollbar {
    width: 2px; /* Smaller width for the scrollbar */
    height: 6px; /* Smaller height for horizontal scrollbar */
  }

  /* Scrollbar Thumb */
  ::-webkit-scrollbar-thumb {
    background: #adb5bd; /* Color of the scrollbar thumb */
    border-radius: 3px; /* Rounded corners */
  }

  /* Scrollbar Thumb on Hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #6c757d; /* Darker color on hover */
  }

  /* Scrollbar Track */
  ::-webkit-scrollbar-track {
    background: #f1f1f1; /* Color of the scrollbar track */
    border-radius: 3px; /* Rounded corners */
  }

  /* Scrollbar Track on Hover */
  ::-webkit-scrollbar-track:hover {
    background: #ddd; /* Lighter color on hover */
  }
`;

const FormContainer = styled.div`
  /* Remove scrollbar styles from here */
`;

const ScrollableFormContent = styled.div`
  ${scrollbarStyles}
  position: relative;
  height: 100%;
  overflow-y: scroll; /* Always show vertical scrollbar */
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
  console.log(selectedComponent, "selectedComponent");
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

  // Setup sensors for dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor),
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
        className="p-2 bg-white border focus:bg-blue-300 group focus:text-white  rounded-2xl flex items-center gap-1 cursor-grab mb-2"
      >
        <span className="text-gray-400 group-focus:text-white">☰</span>
        <span className="text-sm group-focus:text-white ">{id}</span>
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
    <div
      className="flex bg-transparent flex-row mr-4  rounded-2xl mx-2 justify-end items-end mt-9  
    transition-all duration-300"
    >
      <button
        onClick={() => setShowOrdersMenu(!showOrdersMenu)}
        className={`
      flex items-center gap-2 m-2 px-2 py-1 text-sm font-medium
      ${!showOrdersMenu ? "bg-blue-500 text-white" : " text-gray-700"} 
      rounded-full transition-all duration-300 transform
    `}
      >
        {!showOrdersMenu ? (
          <>
            جابجایی
            <FaExchangeAlt className="w-4 h-4 text-gray-100" />
          </>
        ) : (
          <>
            منو
            <FaBars className="w-4 h-4 text-blue-400" />
          </>
        )}
      </button>
      <motion.button
        id="aiAssistant"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsAIModalOpen(true)}
        className={` lg:w-auto text-xs font-semibold  mb-2 justify-start border-gray-400  px-3 md:mt-0 
          transition-all duration-300 transform`}
      >
        <FaRobot className="w-8 h-8" />
      </motion.button>

      {showOrdersMenu && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center text-nowrap gap-2 m-2 px-2 py-1 text-sm font-medium text-gray-700 rounded-full transition-all duration-300 transform"
        >
          انتخاب سکشن
          <FaPuzzlePiece className="w-4 h-4 text-blue-400" />
        </button>
      )}
    </div>
  );

  return (
    <FormContainer>
      <Toaster />
      <div>
        <motion.button
          className=" absolute top-1 right-4 z-[9999] hidden text-lg animate-pulse lg:block py-1 text-black rounded-lg hover:bg-slate-100 transition-colors hover:bg-gray-100/10 backdrop-blur-sm"
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          <motion.div
            animate={isFormOpen ? "open" : "closed"}
            variants={{
              open: { rotate: 90 },
              closed: { rotate: 0 },
            }}
            transition={{ duration: 0.45 }}
          >
            {isFormOpen ? (
              // Horizontal dots for close
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="4" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="20" cy="12" r="2" />
              </svg>
            ) : (
              // Vertical dots for open
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="4" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="20" r="2" />
              </svg>
            )}
          </motion.div>
        </motion.button>
        {isFormOpen && (
          <>
            {isModalOpen && (
              <motion.div
                dir="rtl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.91 }}
                className="fixed inset-0 hidden backdrop-blur-md  bg-black bg-opacity-80 lg:flex items-center justify-center z-[9999] overflow-y-auto"
              >
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{
                    type: "spring",
                    damping: 15,
                    stiffness: 300,
                    duration: 0.8,
                  }}
                  className="bg-white/40 backdrop-blur-xl border-2 border-gray-300 p-6 rounded-xl w-[100%] max-h-[60vh] max-w-5xl overflow-auto shadow-lg relative"
                >
                  <div className=" -mr-7 -mt-8 sticky -top-8 right-0">
                    <motion.button
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsModalOpen(false)}
                      className="text-gray-100 hover:text-gray-300 text-lg font-semibold m-4 transition-all duration-150 ease-in-out"
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
                    {sections.map(
                      ({ id, label, image, bgSize, bgPosition = "center" }) => (
                        <div
                          key={id}
                          onClick={() => addSection(id)}
                          className="flex flex-col cursor-pointer items-center w-full h-48 bg-cover bg-center bg-no-repeat hover:scale-95 transition-all duration-300 relative group"
                          style={{
                            ...imageContainerStyle,
                            backgroundImage: `url(${image?.src})`,
                            backgroundSize: bgSize,
                            backgroundPosition: bgPosition,
                            backgroundRepeat: "no-repeat",
                          }}
                        >
                          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                          <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {label}
                          </span>
                        </div>
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
                  className="fixed right-0 hidden lg:block top-0 h-screen w-[270px] ease-in-out border-l-2 border-white/40 rounded overflow-hidden"
                  style={{ zIndex: 1000 }}
                >
                  {/* Scrollable Container with custom scrollbar */}
                  <ScrollableFormContent>
                    {/* Animated Background Layer - Uses dynamic content height */}
                    <motion.div
                      className="absolute top-0 left-0 right-0 bg-white/80 backdrop-blur-sm"
                      style={{
                        height: `${Math.max(
                          contentHeight,
                          window.innerHeight
                        )}px`,
                        width: "100%",
                        maxWidth: "270px",
                      }}
                      animate={{
                        backgroundColor: [
                          "rgba(255,255,255,0.8)",
                          "rgba(255,255,255,0.9)",
                          "rgba(255,255,255,0.8)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      }}
                    />

                    {/* Pulse Animation Overlay - Uses dynamic content height */}
                    <motion.div
                      className="absolute top-0 left-0 right-0 bg-blue-500/10 backdrop-blur-sm"
                      style={{
                        height: `${Math.max(
                          contentHeight,
                          window.innerHeight
                        )}px`,
                        width: "100%",
                        maxWidth: "270px",
                      }}
                      animate={{
                        opacity: [0.1, 0.3, 0.1],
                        scale: [1, 1.02, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      }}
                    />

                    {/* Content Layer */}
                    <div ref={contentRef} className="relative z-10 w-full">
                      <div className="relative w-full">
                        {ordersButton}

                        <div className="p-2 w-full">
                          <h2
                            className="text-xl mb-2 border-b-2 text-right pb-2 w-fit border-blue-500 font-bold text-[#343a40] ml-auto"
                            dir="rtl"
                          >
                            {showOrdersMenu ? "ترتیب سکشن" : "تنظیمات سکشن"}
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
                                  {orders.map((id: string) => (
                                    <SortableItem key={id} id={id} />
                                  ))}
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
                      ? `w-fit m-2 px-4 py-2 bg-blue-500 text-white rounded-full  transition-colors`
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
                          className="p-2 overflow-y-visible w-[80%] mx-auto mb-72 z-50 flex flex-col items-center gap-2"
                        >
                          {smSections.map(
                            ({
                              name,
                              title,
                              image,
                              height = "12rem",
                              backgroundSize = "cover",
                              backgroundPosition = "center",
                            }) => (
                              <div
                                key={name}
                                onClick={() => addSection(name)}
                                className="flex flex-col cursor-pointer items-center w-full h-48 bg-cover bg-center bg-no-repeat hover:scale-95 transition-all duration-300 relative group"
                                style={{
                                  ...imageContainerStyle,
                                  backgroundImage: `url(${image})`,
                                  backgroundSize,
                                  backgroundPosition,
                                  backgroundRepeat: "no-repeat",
                                  maxWidth: "100%",
                                  height,
                                }}
                              >
                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                                <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  {title}
                                </span>
                              </div>
                            )
                          )}
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
        )}{" "}
        <AIModal
          isOpen={isAIModalOpen}
          onClose={() => setIsAIModalOpen(false)}
          currentStyles={userInputData || {}}
          onApplyChanges={setUserInputData}
        />
      </div>
    </FormContainer>
  );
};
