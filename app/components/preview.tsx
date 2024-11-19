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

interface PreviewProps {
  layout: Layout;
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
  orders: string[];
}

export const Preview: React.FC<PreviewProps> = ({
  layout,
  setSelectedComponent,
  orders
}) => {
  const componentMap = {
    header: Header,
    "rich-text": RichText,
    banner: Banner,
    "image-text": ImageText,
    video: Video,
    'contact-form': ContactForm,
    newsletter: NewsLetter,
    collapse: CollapseFaq,
    multicolumn: MultiColumn,
    slideshow: SlideShow,
    multiRow: MultiRow,
    footer: FooterContainer
  };

  return (
    <div className="mt-16 w-full md:w-full lg:w-[75%] h-[95vh] relative border border-gray-200 rounded-lg overflow-y-auto scrollbar-hide lg:mt-5 lg:ml-5">
      <Header setSelectedComponent={setSelectedComponent} 
                layout={layout}
              />
      <div className="grid grid-cols-1 mt-32">
        {orders.map((componentName, index) => {
          const Component = componentMap[componentName as keyof typeof componentMap];
          return Component ? (
            <div 
              key={componentName}
              style={{ order: index }}
              className="w-full"
            >
              <Component 
                setSelectedComponent={setSelectedComponent} 
                layout={layout}
              />
             
            </div>

          ) : null;
        })}
      </div>
    </div>
  );
};
