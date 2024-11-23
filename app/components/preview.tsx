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

// First update the PreviewProps interface
interface PreviewProps {
  layout: Layout;
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  orders: string[];
  selectedComponent: string; // Add this new prop
}

// Then use it in the component
export const Preview: React.FC<PreviewProps> = ({
  layout,
  setSelectedComponent,
  orders,
  selectedComponent, // Add this to the destructured props
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
  };
  // console.log(layout.sections.children);

  return (
    <div className="mt-16 w-full md:w-full lg:w-[75%] h-[95vh] relative border border-gray-200 rounded-lg overflow-y-auto scrollbar-hide lg:mt-5 lg:ml-5">
      <Header setSelectedComponent={setSelectedComponent} layout={layout} />
      <div className="grid grid-cols-1 mt-32">
        {orders.map((componentName, index) => {
          // Extract base component name by removing any numeric suffix
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
                actualName={componentName} // Pass the full name including suffix
                selectedComponent={selectedComponent} // Pass the full name including suffix
              />
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
};
