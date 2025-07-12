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
import Footer from "./sections/footer";
import ProductList from "./sections/productList";
import DetailPage from "./sections/detailPage";
import BlogList from "./sections/blogList";
import BlogDetail from "./sections/blogDetail";
import { SpecialOffer } from "./sections/specialOffer";
import { Story } from "./sections/story";
import Gallery from "./sections/gallery";
import SlideBanner from "./sections/slideBanner";
import { OfferRow } from "./sections/offerRow";
import { Brands } from "./sections/brands";
import { ProductsRow } from "./sections/productsRow";
import { useSharedContext } from "@/app/contexts/SharedContext";
import CanvasEditor from "./sections/canvasEditor";

export const Preview: React.FC = () => {
  const {
    layout,
    setLayout,
    selectedComponent,
    setSelectedComponent,
    orders,
    previewWidth,
    isFormOpen,
  } = useSharedContext();

  console.log(layout, "llllllllllll");

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
    BlogList,
    BlogDetail,
    SpecialOffer,
    Story,
    Gallery,
    SlideBanner,
    OfferRow,
    Brands,
    ProductsRow,
    CanvasEditor, // Add this line
  };

  return (
    <div>
      <div
        className={`flex relative justify-center pt-5 ${
          previewWidth === "default" ? "flex-col" : ""
        }`}
      >
        <div
          data-preview-container="true"
          className={`h-[85vh] relative border border-gray-200 rounded-lg overflow-y-auto mx-2 scrollbar-hide  ${
            previewWidth === "sm" && "w-[425px]"
          } ${previewWidth === "default" && isFormOpen && ""} `}
        >
          <Header
            setSelectedComponent={setSelectedComponent}
            layout={layout}
            selectedComponent={selectedComponent}
            previewWidth={previewWidth}
          />

          <div className="grid grid-cols-1">
            {orders.map((componentName, index) => {
              const baseComponentName = componentName.split("-")[0];
              const Component =
                componentMap[baseComponentName as keyof typeof componentMap];

              return Component ? (
                <div
                  key={componentName}
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
            previewWidth={previewWidth}
          />
        </div>
      </div>
    </div>
  );
};
