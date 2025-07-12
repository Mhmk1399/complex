import { useState } from "react";
import {
  HiDocumentText,
  HiColorSwatch,
  HiOutlineAdjustments,
  HiSparkles,
} from "react-icons/hi";

interface TabButtonsProps {
  onTabChange: (tab: "content" | "style" | "spacing" | "animation") => void;
  initialTab?: "content" | "style" | "spacing" | "animation";
}

type TabType = "content" | "style" | "spacing" | "animation";

interface TabConfig {
  key: TabType;
  label: string;
  tooltip: string;
  icon: React.ComponentType<{ className?: string }>;
  activeColor: string;
  hoverColor: string;
}

const tabConfigs: TabConfig[] = [
  {
    key: "content",
    label: "محتوا",
    tooltip: "تنظیمات محتوا و متن",
    icon: HiDocumentText,
    activeColor: "text-blue-600 border-blue-500",
    hoverColor: "hover:text-blue-500 hover:border-blue-300",
  },
  {
    key: "style",
    label: "استایل",
    tooltip: "رنگ‌ها و ظاهر کلی",
    icon: HiColorSwatch,
    activeColor: "text-purple-600 border-purple-500",
    hoverColor: "hover:text-purple-500 hover:border-purple-300",
  },
  {
    key: "spacing",
    label: "فاصله",
    tooltip: "حاشیه و فاصله‌گذاری",
    icon: HiOutlineAdjustments,
    activeColor: "text-green-600 border-green-500",
    hoverColor: "hover:text-green-500 hover:border-green-300",
  },
  {
    key: "animation",
    label: "انیمیشن",
    tooltip: "جلوه‌های بصری و حرکت",
    icon: HiSparkles,
    activeColor: "text-orange-600 border-orange-500",
    hoverColor: "hover:text-orange-500 hover:border-orange-300",
  },
];

export const TabButtons: React.FC<TabButtonsProps> = ({
  onTabChange,
  initialTab = "content",
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [hoveredIcon, setHoveredIcon] = useState<TabType | null>(null);

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <div className="border-b border-gray-200 mb-6">
      <div className="flex">
        {tabConfigs.map((tabConfig) => {
          const isActive = activeTab === tabConfig.key;
          const isHovered = hoveredIcon === tabConfig.key;
          const IconComponent = tabConfig.icon;

          return (
            <button
              key={tabConfig.key}
              onClick={() => handleTabClick(tabConfig.key)}
              className={`
                relative flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-all duration-200
                ${
                  isActive
                    ? tabConfig.activeColor
                    : `text-gray-500 border-transparent ${tabConfig.hoverColor}`
                }
              `}
              type="button"
            >
              <div
                className="relative"
                onMouseEnter={() => setHoveredIcon(tabConfig.key)}
                onMouseLeave={() => setHoveredIcon(null)}
              >
                <IconComponent className="w-4 h-4" />

                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
                    <div className="bg-black/80 backdrop-blur-md text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                      {tabConfig.tooltip}
                      {/* Arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                    </div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      {/* <div className="bg-white px-4 py-2  text-xs text-gray-500 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-current opacity-50" />
        <span>
        تنظیمات  {tabConfigs.find((tab) => tab.key === activeTab)?.label} 
        </span>
      </div> */}
    </div>
  );
};
