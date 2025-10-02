// components/ai/AIModal.tsx
import React, { useState } from "react";
import { DeepSeekClient } from "@/lib/DeepSeekClient";
import { FaRobot } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStyles: string;
  onApplyChanges: (updatedStyles: unknown) => void;
}

// Constants
const ERROR_MESSAGES = {
  EMPTY_PROMPT: "لطفا درخواست خود را وارد کنید",
  MIN_LENGTH: "درخواست شما باید حداقل ۳ کاراکتر باشد",
  NO_JSON: "پاسخ هوش مصنوعی معتبر نیست",
  INVALID_JSON: "فرمت پاسخ نامعتبر است",
  NETWORK_ERROR: "خطا در برقراری ارتباط با سرور",
  UNKNOWN_ERROR: "خطای غیرمنتظره رخ داد",
  PARSE_ERROR: "خطا در تجزیه پاسخ",
} as const;

const LOADING_MESSAGES = {
  PROCESSING: "در حال پردازش درخواست...",
} as const;

const SUCCESS_MESSAGES = {
  UPDATED: "✅ تغییرات با موفقیت اعمال شد",
} as const;

// Helper Functions
const extractJSON = (response: string): unknown => {
  // Try to find JSON in different formats
  let jsonMatch = response.match(/\{[\s\S]*\}/);

  // If not found, try to extract from code blocks
  if (!jsonMatch) {
    jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonMatch[0] = jsonMatch[1];
    }
  }

  if (!jsonMatch) {
    throw new Error(ERROR_MESSAGES.NO_JSON);
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (parseError) {
    console.error("JSON Parse Error:", parseError);
    throw new Error(ERROR_MESSAGES.INVALID_JSON);
  }
};

const buildPrompt = (currentStyles: string, userRequest: string): string => `
You are a JSON generator for a website builder.
Get the provided JSON and update its variables according to the user request.

Current component JSON: ${JSON.stringify(currentStyles)}
User request: ${userRequest}

IMPORTANT: Return ONLY the updated JSON object without any explanations, markdown, or code blocks.
Do not wrap it in \`\`\`json or any other formatting.
Just return the raw JSON object.
`;

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    // Check for known error messages
    if (Object.values(ERROR_MESSAGES).includes(error.message as any)) {
      return error.message;
    }

    // Check for network errors
    if (
      error.message.includes("fetch") ||
      error.message.includes("network") ||
      error.message.includes("ارتباط")
    ) {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }

    return error.message;
  }

  return ERROR_MESSAGES.UNKNOWN_ERROR;
};

export const AIModal: React.FC<AIModalProps> = ({
  isOpen,
  onClose,
  currentStyles,
  onApplyChanges,
}) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    if (!isLoading) {
      setPrompt("");
      onClose();
    }
  };

  const validatePrompt = (value: string): boolean => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      toast.error(ERROR_MESSAGES.EMPTY_PROMPT, {
        duration: 3000,
        position: "top-center",
      });
      return false;
    }

    if (trimmedValue.length < 3) {
      toast.error(ERROR_MESSAGES.MIN_LENGTH, {
        duration: 3000,
        position: "top-center",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validatePrompt(prompt)) {
      return;
    }

    setIsLoading(true);

    const loadingToast = toast.loading(LOADING_MESSAGES.PROCESSING, {
      position: "top-center",
      duration: Infinity, // ✅ تا زمانی که manually dismiss نشه
    });

    try {
      const fullPrompt = buildPrompt(currentStyles, prompt);

      // ✅ ارسال با retry
      const response = await DeepSeekClient.sendPrompt(fullPrompt, {
        maxTokens: 4000,
        temperature: 0.3,
        retries: 3, // ✅ 3 بار تلاش مجدد
      });

      if (!response || typeof response !== "string") {
        throw new Error(ERROR_MESSAGES.NO_JSON);
      }

      const updatedStyles = extractJSON(response);
      onApplyChanges(updatedStyles);

      toast.dismiss(loadingToast);
      toast.success(SUCCESS_MESSAGES.UPDATED, {
        duration: 4000,
        position: "top-center",
      });

      handleClose();
    } catch (error) {
      console.error("AI Processing Error:", error);

      const errorMessage = getErrorMessage(error);

      toast.dismiss(loadingToast);
      toast.error(errorMessage, {
        duration: 6000, // ✅ 6 ثانیه برای خطاها
        position: "top-center",
        icon: "❌",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey && !isLoading) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/20 flex items-center justify-center z-[100]"
      dir="rtl"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white/70 p-6 border border-gray-300 backdrop-blur-lg rounded-xl shadow-lg w-full max-w-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FaRobot className="text-purple-500 ml-2" size={24} />
            <h3 className="text-xl font-bold text-black">دستیار هوشمند</h3>
          </div>

          {!isLoading && (
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-gray-100"
              aria-label="بستن"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="ai-prompt"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              درخواست خود را وارد کنید
            </label>
            <textarea
              id="ai-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="مثال: رنگ پس‌زمینه را آبی کن و اندازه فونت را بزرگ‌تر کن"
              className="w-full p-3 bg-white/10 text-black border border-gray-500 placeholder:text-gray-500 rounded-lg min-h-[150px] focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none transition-all"
              disabled={isLoading}
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <span>💡</span>
              <span>
                نکته: برای ارسال سریع از{" "}
                <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">
                  Ctrl + Enter
                </kbd>{" "}
                استفاده کنید
              </span>
            </p>
          </div>

          {/* Character count */}
          {prompt.trim().length > 0 && (
            <div className="text-xs text-gray-600 text-left">
              تعداد کاراکترها: {prompt.trim().length}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-start gap-3 pt-2">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              لغو
            </button>

            <button
              onClick={handleSubmit}
              disabled={isLoading || !prompt.trim()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  در حال پردازش...
                </>
              ) : (
                <>اعمال تغییرات</>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
