import React from "react";
import Header from "./sections/header";
import RichText from "./sections/richText";
import Banner from "./sections/banner";
import ImageText from "./sections/imageText";
import Video from "./sections/video";

interface PreviewProps {
  layout: {};
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
}

export const Preview: React.FC<PreviewProps> = ({
  layout,
  setSelectedComponent,
}) => {
  return (
    <div className="w-full md:w-full lg:w-[75%]  h-[95vh] relative border border-gray-200 rounded-lg overflow-y-auto scrollbar-hide lg:mt-5 lg:ml-5">
      <Header setSelectedComponent={setSelectedComponent} layout={layout} />
      <RichText setSelectedComponent={setSelectedComponent} layout={layout} />
      <Banner setSelectedComponent={setSelectedComponent} layout={layout} />
      <ImageText setSelectedComponent={setSelectedComponent} layout={layout} />
      <Video setSelectedComponent={setSelectedComponent} layout={layout} />
    </div>
  );
};
