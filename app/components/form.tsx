"use client"
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { RichText } from './forms/richTextForm'
import { HeaderForm } from './forms/headerForm';
import { JasonChanger } from './compiler';
import { BannerForm } from './forms/bannerForm';
import { ImageTextForm } from './forms/imageTextForm';
import { VideoForm } from './forms/videoForm';
import { ContactForm } from './forms/contact';
import { NewsLetterForm } from './forms/newsLetterForm';
import { CollapseForm } from './forms/collapseForm';
import { Layout, Section  } from '@/lib/types';
import { MultiColumnForm } from './forms/multiColomnForm';
import { SlideForm } from './forms/slideForm';
interface FormProps {
  selectedComponent: string;
  setLayout: (data: Layout) => void;
  layout: Layout;
}

export const Form = ({ selectedComponent, setLayout ,layout }: FormProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [userInputData, setUserInputData] = useState<object | Section >({});
  useEffect(() => {
    const newjason=JasonChanger(layout, selectedComponent, userInputData)
    setLayout(newjason)
    
  }, [userInputData])

  const renderFormContent = (setUserInputData: (data: {}) => void, userInputData: Section ) => {
    switch (selectedComponent) {
      case 'rich-text':
        return <RichText  setUserInputData={setUserInputData} userInputData={userInputData} layout={layout}/>
      case 'sectionHeader':
        return <HeaderForm setUserInputData={setUserInputData} userInputData={userInputData} layout={layout} />
      case 'banner':
      return <BannerForm setUserInputData={setUserInputData} userInputData={userInputData} layout={layout} />
      case 'image-text':
        return <ImageTextForm setUserInputData={setUserInputData} userInputData={userInputData} layout={layout} />
      case 'video':
        return <VideoForm setUserInputData={setUserInputData} userInputData={userInputData} layout={layout} />
      case 'contact-form':
        return <ContactForm setUserInputData={setUserInputData} userInputData={userInputData} layout={layout} />
      case 'newsletter':
        return <NewsLetterForm setUserInputData={setUserInputData} userInputData={userInputData} layout={layout} />
      case 'collapse':
        return <CollapseForm setUserInputData={setUserInputData} userInputData={userInputData} layout={layout} />
      case 'multicolumn':
        return <MultiColumnForm setUserInputData={setUserInputData} userInputData={userInputData} layout={layout} />
      case 'slideshow':
        return <SlideForm setUserInputData={setUserInputData} userInputData={userInputData} layout={layout} />
      default:
        return <div>Select a component to configure</div>
    }
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed right-0 top-0 h-screen w-80 bg-white shadow-lg overflow-y-auto " style={{ zIndex: 1000 }}>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Component Settings
          </h2>
          {renderFormContent(setUserInputData, userInputData as Section)}
        </div>
      </div>

      {/* Mobile/Tablet Bottom Sheet */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        initial={{ y: "calc(100% - 40px)" }}
        animate={{ y: isOpen ? 0 : "calc(100% - 40px)" }}
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white bg-opacity-80 rounded-t-3xl shadow-2xl"
      >
        <div 
          className="h-10 w-full flex justify-center items-center cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="w-20 h-1.5 bg-gray-300 rounded-full" />
        </div>

        <div className="max-h-[calc(60vh-40px)] min-h-[calc(40vh-30px)] overflow-y-auto p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Component Settings
          </h2>
          {renderFormContent(setUserInputData, userInputData as Section)}
        </div>
      </motion.div>
    </>
  );
};
