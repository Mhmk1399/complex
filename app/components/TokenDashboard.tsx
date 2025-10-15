"use client";
import { useTokens } from "@/hooks/useTokens";
import { TokenDisplay } from "./TokenDisplay";

export const TokenDashboard = () => {
  const { tokenUsage, loading, isLowOnTokens, refreshTokens } = useTokens();

  const handleBuyTokens = () => {
    // Redirect to purchase page or open payment modal
    window.open('/dashboard/billing', '_blank');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
        <div className="h-8 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-24"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">مدیریت توکن‌های AI</h3>
        <button
          onClick={refreshTokens}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          🔄 بروزرسانی
        </button>
      </div>

      <TokenDisplay />

      {isLowOnTokens && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800">
                ⚠️ توکن‌های شما رو به اتمام است
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                برای استفاده مداوم از AI، توکن بیشتری خریداری کنید
              </p>
            </div>
            <button
              onClick={handleBuyTokens}
              className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-colors"
            >
              خرید توکن
            </button>
          </div>
        </div>
      )}

      {tokenUsage && tokenUsage.remainingTokens === 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-800">
                🚫 توکن‌های شما تمام شده است
              </p>
              <p className="text-xs text-red-600 mt-1">
                برای استفاده از ویژگی‌های AI باید توکن خریداری کنید
              </p>
            </div>
            <button
              onClick={handleBuyTokens}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              خرید فوری
            </button>
          </div>
        </div>
      )}
    </div>
  );
};