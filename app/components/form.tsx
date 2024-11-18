"use client"
import React, { useEffect, useState } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
import {ContactFormData, ContactFormProps, FooterSection, MultiRowSection, SlideSection, VideoSection} from '../../lib/types'
import { BannerSection ,CollapseSection, HeaderSection, ImageTextSection, Layout, MultiColumnSection, NewsLetterSection, RichTextSection, Section  } from '@/lib/types';
import { MultiColumnForm } from './forms/multiColomnForm';
import { SlideForm } from './forms/slideForm';
import {MultiRowForm}  from './forms/multiRowForm';
import { FooterForm } from './forms/footerForm';
type FormData = HeaderSection |MultiRowSection| BannerSection |FooterSection|NewsLetterSection|BannerSection|VideoSection| Section |SlideSection| CollapseSection | RichTextSection |ContactFormProps |MultiColumnSection;

interface FormProps {
  selectedComponent: string;
  setLayout: (data: Layout) => void;
  layout: Layout;
  orders:string[]
  setOrders: React.Dispatch<React.SetStateAction<string[]>>;
}

export const Form = ({ selectedComponent, setLayout, layout ,orders,setOrders}: FormProps) => {
  const [userInputData, setUserInputData] = useState<FormData>({} as FormData);
  const [isOpen, setIsOpen] = useState(false);
  const [showOrdersMenu, setShowOrdersMenu] = useState(false);
  
  // Setup sensors for dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (Object.keys(userInputData).length > 0) {
      const newLayout = JasonChanger(layout, selectedComponent, userInputData as Section);
      setLayout(newLayout);
    }
  }, [userInputData]);

  console.log(selectedComponent);

  // Create a SortableItem component
  const SortableItem = ({id}: {id: string}) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition
    } = useSortable({id});

    const style = {
      transform: CSS.Transform.toString(transform),
      transition
    };

    return (
      <div 
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="p-3 bg-white border rounded-lg flex items-center gap-2 cursor-grab mb-2"
      >
        <span className="text-gray-500">☰</span>
        <span>{id}</span>
      </div>
    );
  };

  useEffect(() => {
    setOrders([...layout.sections.children.order]);
  }, [layout.sections.children.order]);

  const handleDragEnd = (event: any) => {
    
    const {active, over} = event;
    if (active.id !== over.id) {
      const oldIndex = orders.indexOf(active.id);
      const newIndex = orders.indexOf(over.id);
      const newOrders = arrayMove(orders, oldIndex, newIndex);
      
      setOrders(newOrders);
      setLayout({
        ...layout,
        sections: {
          ...layout.sections,
          children: {
            ...layout.sections.children,
            order: newOrders
          }
        }
      });

    }

  };

  const renderFormContent = (
    setUserInputData: React.Dispatch<React.SetStateAction<FormData>>,
    userInputData: FormData
  ) => {
  
    switch (selectedComponent) {
      case 'rich-text':
        return <RichText setUserInputData={setUserInputData as React.Dispatch<React.SetStateAction<RichTextSection>>} 
                         userInputData={userInputData as RichTextSection} 
                         layout={layout} />
      case 'sectionHeader':
        return <HeaderForm setUserInputData={setUserInputData as React.Dispatch<React.SetStateAction<HeaderSection>>}
                          userInputData={userInputData as HeaderSection}
                          layout={layout} />
      case 'banner':
        return <BannerForm setUserInputData={setUserInputData as React.Dispatch<React.SetStateAction<BannerSection>>}
                          userInputData={userInputData as BannerSection}
                          layout={layout} />
      case 'image-text':
        return <ImageTextForm setUserInputData={setUserInputData as React.Dispatch<React.SetStateAction<ImageTextSection>>}
                              userInputData={userInputData as ImageTextSection}
                              layout={layout} />
      case 'video':
        return <VideoForm setUserInputData={setUserInputData as React.Dispatch<React.SetStateAction<VideoSection>>}
                          userInputData={userInputData as VideoSection}
                          layout={layout} />
      case 'contact-form':
        return <ContactForm setUserInputData={setUserInputData as React.Dispatch<React.SetStateAction<ContactFormData>>}
                            userInputData={userInputData as ContactFormData}
                            layout={layout} />
      case 'newsletter':
        return <NewsLetterForm setUserInputData={setUserInputData as React.Dispatch<React.SetStateAction<NewsLetterSection>>}
                               userInputData={userInputData as NewsLetterSection}
                               layout={layout} />
      case 'collapse':
        return <CollapseForm setUserInputData={setUserInputData as React.Dispatch<React.SetStateAction<CollapseSection>>}
                             userInputData={userInputData as CollapseSection}
                             layout={layout} />
      case 'multicolumn':
        return <MultiColumnForm setUserInputData={setUserInputData as React.Dispatch<React.SetStateAction<MultiColumnSection>>}
                                userInputData={userInputData as MultiColumnSection}
                                layout={layout} />
      case 'slideshow':
        return <SlideForm setUserInputData={setUserInputData as React.Dispatch<React.SetStateAction<SlideSection>>}
                          userInputData={userInputData as SlideSection}
                          layout={layout} />
      case 'multiRow':
        return<MultiRowForm setUserInputData={setUserInputData as React.Dispatch<React.SetStateAction<MultiRowSection>>}
        userInputData={userInputData as MultiRowSection}
        layout={layout} />  
        case 'sectionFooter' : 
        return<FooterForm  setUserInputData={setUserInputData as React.Dispatch<React.SetStateAction<FooterSection>>}
        userInputData={userInputData as FooterSection}
        layout={layout} />           
      default:
        return <div>Select a component to configure</div>
    }  
  }

  const ordersButton = (
    <button
      onClick={() => setShowOrdersMenu(!showOrdersMenu)}
      className={!showOrdersMenu?`w-fit  m-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors`:'w-fit m-2 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors'}
    >
     {!showOrdersMenu?'Orders':'menu'} 
    </button>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed right-0 top-0 h-screen w-80 bg-white shadow-lg overflow-y-auto " style={{ zIndex: 1000 }}>
      {ordersButton}

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Component Settings
          </h2>
          {showOrdersMenu? (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold mb-2">Orders Menu</h3>
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={orders}
        strategy={verticalListSortingStrategy}
      >
        {orders.map((id: string) => <SortableItem key={id} id={id} />)}
      </SortableContext>
    </DndContext>
  </div>
) : (
      renderFormContent(setUserInputData, userInputData as Section)
    )}
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
