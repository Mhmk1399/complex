import { useState } from "react";
import { FaImage, FaPalette, FaArrowsAlt } from "react-icons/fa"; // Import icons

interface TabButtonsProps {
  onTabChange: (tab: "content" | "style" | "spacing") => void;
}

export const TabButtons: React.FC<TabButtonsProps> = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState<"content" | "style" | "spacing">(
    "content"
  );

  const handleTabClick = (tab: "content" | "style" | "spacing") => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <div className="flex gap-1 items-center justify-center mb-4 border-b border-gray-200">
      <button
        onClick={() => handleTabClick("content")}
        className={`px-1 py-2 text-sm rounded-t-lg transition-all duration-200 relative flex items-center gap-2 ${
          activeTab === "content"
            ? "text-gray-600 font-bold border-gray-200"
            : "text-gray-500 hover:text-blue-600 bg-transparent"
        }`}
      >
        محتوا
        <FaImage className="w-3 h-4" />
        {activeTab === "content" && (
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-400"></div>
        )}
      </button>
      <button
        onClick={() => handleTabClick("style")}
        className={`px-1 py-2 text-sm rounded-t-lg transition-all duration-200 relative flex items-center gap-2 ${
          activeTab === "style"
            ? "text-gray-600 font-bold border-gray-200"
            : "text-gray-500 hover:text-blue-600 bg-transparent"
        }`}
      >
        استایل
        <FaPalette className="w-3 h-4" />
        {activeTab === "style" && (
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-400"></div>
        )}
      </button>
      <button
        onClick={() => handleTabClick("spacing")}
        className={`px-1 py-2 text-sm rounded-t-lg transition-all duration-200 relative flex items-center gap-2 ${
          activeTab === "spacing"
            ? "text-gray-600 font-bold border-gray-200"
            : "text-gray-500 hover:text-blue-600 bg-transparent"
        }`}
      >
        فاصله
        <FaArrowsAlt className="w-3 h-4" />
        {activeTab === "spacing" && (
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-400"></div>
        )}
      </button>
    </div>
  );
};
