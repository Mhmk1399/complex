import React from "react";
import Header from "./sections/header";

interface PreviewProps {
  layout: {};
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
}

export const Preview: React.FC<PreviewProps> = ({
  layout,
  setSelectedComponent,
}) => {
  return (
    <div className="w-full md:w-full lg:w-[75%] h-[95vh] border border-gray-200 rounded-lg overflow-y-auto scrollbar-hide lg:mt-5 lg:ml-5">
      <Header setSelectedComponent={setSelectedComponent} />
    </div>
  );
};
