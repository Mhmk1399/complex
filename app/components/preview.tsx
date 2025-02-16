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
import { SpecialOffer } from "./sections/specialOffer";
import { Story } from "./sections/story";
import Gallery from "./sections/gallery";
import SlideBanner from "./sections/slideBanner";
import { OfferRow } from "./sections/offerRow";
import { Brands } from "./sections/brands";
import { ProductsRow } from "./sections/productsRow";

// First update the PreviewProps interface
interface PreviewProps {
  layout: Layout;
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  orders: string[];
  selectedComponent: string;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
  previewWidth: "sm" | "default";
  setPreviewWidth: (mode: "sm" | "default") => void;
  isFormOpen: boolean;
}

// Then use it in the component
export const Preview: React.FC<PreviewProps> = ({
  layout,
  setSelectedComponent,
  orders,
  selectedComponent,
  setLayout,
  previewWidth,
  isFormOpen,
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
    SpecialOffer,
    Story,
    Gallery,
    SlideBanner,
    OfferRow,
    Brands,
    ProductsRow,
  };

  return (
    <div>
      <div
        className={`flex relative justify-center ${
          previewWidth === "default" ? "flex-col" : ""
        }`}
      >
        {/* Add this wrapper */}
        <div
          data-preview-container="true"
          className={`h-[85vh] relative border border-gray-200 rounded-lg overflow-y-auto mx-2 scrollbar-hide  ${
            previewWidth === "sm" && "w-[425px]"
          } ${previewWidth === "default" && isFormOpen && "w-[80%]"} `}
        >
          <Header
            setSelectedComponent={setSelectedComponent}
            layout={layout}
            selectedComponent={selectedComponent}
            previewWidth={previewWidth} // Pass the state to components
          />

          <div className="grid grid-cols-1">
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
                    previewWidth={previewWidth} 
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
