import React, { useState } from "react";
import { motion } from "framer-motion";
interface FormProps {
  selectedComponent: string;
  setUserInputData: (input: string) => void;
}
export const Form = (
  selectedComponent: FormProps,
  setUserInputData: (input: string) => void
) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed right-0 top-0 h-screen w-80 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">Sidebar Content</h2>
          {/* Add your sidebar content here */}
        </div>
      </div>

      {/* Mobile/Tablet Bottom Sheet */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        initial={{ y: "calc(100% - 40px)" }}
        animate={{ y: isOpen ? 0 : "calc(100% - 40px)" }}
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl"
      >
        {/* Draggable Handle */}
        <div
          className="h-10 w-full flex justify-center items-center cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="w-20 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Content Area */}
        <div className="max-h-[calc(80vh-40px)] min-h-[calc(50vh-30px)] overflow-y-auto p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Sidebar Content
          </h2>
          {/* Add your sidebar content here */}
        </div>
      </motion.div>
    </>
  );
};
