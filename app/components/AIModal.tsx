// components/ai/AIModal.tsx
import React, { useState } from "react";
import { DeepSeekClient } from "@/lib/DeepSeekClient";
import { FaRobot } from "react-icons/fa";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStyles: any; // Current component styles
  onApplyChanges: (updatedStyles: any) => void; // Callback to apply changes
}

export const AIModal = ({
  isOpen,
  onClose,
  currentStyles,
  onApplyChanges,
}: AIModalProps) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast.error("Please describe your changes");
      return;
    }

    setIsLoading(true);
    try {
      // Prepare the full prompt with context
      const fullPrompt = `
      You are a JSON generator for a website builder.
      get the provided josn and update its varables acording to the user request 
      Current component JSON: ${JSON.stringify(currentStyles)}
      User request: ${prompt}
      Return ONLY the updated JSON without any explanations or markdown.
      `;

      

      const response = await DeepSeekClient.sendPrompt(fullPrompt);
      
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }
      
      const updatedStyles = JSON.parse(jsonMatch[0]);
      onApplyChanges(updatedStyles);
      toast.success("Component updated with AI!");
      onClose();
    } catch (error: any) {
      console.error("AI Error:", error);
      toast.error(`AI Error: ${error.message || "Failed to process request"}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/20 p-6 border border-gray-300 backdrop-blur-sm rounded-xl shadow-lg w-full max-w-md"
      >
        <div className="flex items-center mb-4">
          <FaRobot className="text-purple-500 mr-2" size={24} />
          <h3 className="text-xl font-bold text-white">AI Assistant</h3>
        </div>
        
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the changes you want to this component..."
            className="w-full p-3 bg-white/10 text-white rounded-lg min-h-[150px] focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isLoading}
          />
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : "Apply Changes"}
            </button>
          </div>
        </div>
      </motion.div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};