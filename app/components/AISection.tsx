"use client";
import { useState } from "react";
import { AIModal } from "./AIModal";
import { TokenDisplay } from "./TokenDisplay";
import { useTokens } from "@/hooks/useTokens";
import { FaRobot, FaMagic } from "react-icons/fa";

interface AISectionProps {
  currentStyles: string;
  onApplyChanges: (updatedStyles: unknown) => void;
}

export const AISection: React.FC<AISectionProps> = ({
  currentStyles,
  onApplyChanges,
}) => {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const { hasTokens, isLowOnTokens } = useTokens();

  const handleOpenAI = () => {
    if (!hasTokens) {
      // Show token purchase prompt
      return;
    }
    setIsAIModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Token Display */}
      <TokenDisplay />

      {/* AI Controls */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FaRobot className="text-purple-500" size={20} />
            <h3 className="font-semibold text-gray-800">دستیار هوشمند</h3>
          </div>
          
          {isLowOnTokens && (
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
              توکن کم!
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-4">
          از هوش مصنوعی برای تغییر طراحی و محتوای صفحه استفاده کنید
        </p>

        <button
          onClick={handleOpenAI}
          disabled={!hasTokens}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            hasTokens
              ? "bg-purple-600 hover:bg-purple-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <FaMagic size={16} />
          {hasTokens ? "شروع ویرایش با AI" : "نیاز به خرید توکن"}
        </button>

        {!hasTokens && (
          <p className="text-xs text-red-600 mt-2 text-center">
            برای استفاده از AI ابتدا توکن خریداری کنید
          </p>
        )}
      </div>

      {/* AI Modal */}
      <AIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        currentStyles={currentStyles}
        onApplyChanges={onApplyChanges}
      />
    </div>
  );
};