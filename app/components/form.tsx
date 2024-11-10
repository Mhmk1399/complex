"use client"
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { RichText } from './forms/richTextForm'
import { Header } from './forms/header';

interface FormProps {
  selectedComponent: string;
  setUserInputData: (input: string) => void;
}

export const Form = ({ selectedComponent, setUserInputData }: FormProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const renderFormContent = () => {
    switch (selectedComponent) {
      case 'richText':
        return <RichText />
      case 'header':
        return <Header />
      case 'buttonConfig':
        return 
      default:
        return <div>Select a component to configure</div>
    }
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed right-0 top-0 h-screen w-80 bg-white shadow-lg overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Component Settings
          </h2>
          {renderFormContent()}
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
        <div 
          className="h-10 w-full flex justify-center items-center cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="w-20 h-1.5 bg-gray-300 rounded-full" />
        </div>

        <div className="max-h-[calc(80vh-40px)] min-h-[calc(50vh-30px)] overflow-y-auto p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Component Settings
          </h2>
          {renderFormContent()}
        </div>
      </motion.div>
    </>
  );
};
