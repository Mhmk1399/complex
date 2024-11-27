import React from "react";
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
import FooterContainer from "./sections/footer";
import ProductList from "./sections/productList";

// First update the PreviewProps interface
interface PreviewProps {
  layout: Layout;
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  orders: string[];
  selectedComponent: string; // Add this new prop
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
}

// Then use it in the component
export const Preview: React.FC<PreviewProps> = ({
  layout,
  setSelectedComponent,
  orders,
  selectedComponent,
  setLayout,
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
    FooterContainer,
    ProductList,
  };

  return (
    <div className="w-full md:w-full lg:w-[75%] h-[90vh] relative border border-gray-200 rounded-lg overflow-y-auto scrollbar-hide lg:mt-1 lg:ml-5">
      <Header setSelectedComponent={setSelectedComponent} layout={layout} />
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
              />
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
};
