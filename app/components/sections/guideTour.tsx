import React, { useEffect, useMemo, useState } from "react";

interface TourGuideProps {
  saveButtonRef: React.RefObject<HTMLButtonElement>;
  addRouteButtonRef: React.RefObject<HTMLButtonElement>;
  deleteRouteButtonRef: React.RefObject<HTMLButtonElement>;
  previewToggleRef: React.RefObject<HTMLDivElement>;
  sitePreviewRef: React.RefObject<HTMLButtonElement>;
  changeRouteRef: React.RefObject<HTMLLabelElement>;
  seoButtonRef: React.RefObject<HTMLButtonElement>;
  routeNameRef: React.RefObject<HTMLSpanElement>;
  setActiveElement: React.Dispatch<
    React.SetStateAction<
      "save" | "delete" | "preview" | "sitePreview" | "addRoute" | "changeRoute" | "seo" | "routeName"
    >
  >;
}

const TourGuide: React.FC<TourGuideProps> = ({
  saveButtonRef,
  addRouteButtonRef,
  deleteRouteButtonRef,
  previewToggleRef,
  sitePreviewRef,
  changeRouteRef,
  seoButtonRef,
  routeNameRef,
  setActiveElement,
}) => {
  const idArray = [
    "save",
    "addRoute",
    "delete",
    "preview",
    "sitePreview",
    "changeRoute",
    "seo",
    "routeName",
  ];

  const [isTourVisible, setIsTourVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElements, setHighlightedElements] = useState<HTMLElement[]>([]);

  const [tooltipPosition, setTooltipPosition] = useState({
    top: 10,
    right: 10,
  });
  const StepIcons = useMemo(
    () => ({
      save: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
          />
        </svg>
      ),
      addRoute: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
      deleteRoute: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      ),
      preview: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ),
      sitePreview: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
      ),
      changeRoutePath: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="white"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
          />
        </svg>
      ),
      seo: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="white"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      ),
      routeName: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="white"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 6h.008v.008H6V6z"
          />
        </svg>
      ),
    }),
    []
  );
  const steps = useMemo(
    () => [
      {
        ref: saveButtonRef,
        content: "با کلیک بر روی این دکمه، تنظیمات شما ذخیره می‌شود.",
        title: "ذخیره تنظیمات",
        icon: StepIcons.save,
      },
      {
        ref: addRouteButtonRef,
        content: "با این گزینه می‌توانید مسیر جدید اضافه کنید.",
        title: "افزودن مسیر جدید",
        icon: StepIcons.addRoute,
      },
      {
        ref: deleteRouteButtonRef,
        content: "از اینجا می‌توانید مسیر را حذف کنید.",
        title: "حذف مسیر",
        icon: StepIcons.deleteRoute,
      },

      {
        ref: previewToggleRef,
        content: "برای تغییر وضعیت پیش‌نمایش، از این دکمه‌ها استفاده کنید.",
        title: "تنظیمات وضعیت پیش‌نمایش",
        icon: StepIcons.preview,
      },
      {
        ref: sitePreviewRef,
        content:
          "با کلیک بر روی این دکمه، وب‌سایت شما در پیش‌نمایش باز می‌شود.",
        title: "نمایش وب‌سایت",
        icon: StepIcons.sitePreview,
      },
      {
        ref: changeRouteRef,
        content: "از اینجا می‌توانید مسیر را تغییر دهید.",
        title: "تغییر مسیر",
        icon: StepIcons.changeRoutePath,
      },
      {
        ref: seoButtonRef,
        content: "برای تنظیم عنوان و توضیحات سئو صفحه از این دکمه استفاده کنید.",
        title: "تنظیمات سئو",
        icon: StepIcons.seo,
      },
      {
        ref: routeNameRef,
        content: "این قسمت نام مسیر فعال را نمایش میدهد.",
        title: "نمایش نام مسیر",
        icon: StepIcons.routeName,
      },
    ],
    [
      saveButtonRef,
      addRouteButtonRef,
      deleteRouteButtonRef,
      previewToggleRef,
      sitePreviewRef,
      changeRouteRef,
      seoButtonRef,
      routeNameRef,
      StepIcons,
    ]
  );

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenTour");
    if (!hasSeenTour) {
      setIsTourVisible(true);
    }
  }, []);

  const clearAllHighlights = () => {
    highlightedElements.forEach(element => {
      if (element) {
        element.style.boxShadow = '';
        element.style.zIndex = '';
        element.style.position = '';
        element.style.backgroundColor = '';
        element.style.border = '';
        element.style.outline = '';
        element.style.transform = '';
        element.style.filter = '';
        element.style.removeProperty('box-shadow');
        element.style.removeProperty('z-index');
        element.style.removeProperty('position');
        element.style.removeProperty('background-color');
        element.style.removeProperty('border');
        element.style.removeProperty('outline');
        element.style.removeProperty('transform');
        element.style.removeProperty('filter');
      }
    });
    setHighlightedElements([]);
  };

  useEffect(() => {
    const currentRef = steps[currentStep]?.ref?.current;
    if (isTourVisible && currentRef) {
      // Clear previous highlights
      clearAllHighlights();
      
      currentRef.focus();
      currentRef.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      
      // Add highlight to current element
      const elementToHighlight = currentRef.closest('label') || currentRef;
      elementToHighlight.style.position = 'relative';
      elementToHighlight.style.zIndex = '9998';
      elementToHighlight.style.boxShadow = '0 0 0 3px #3b82f6, 0 0 20px rgba(59, 130, 246, 0.5)';
      elementToHighlight.style.borderRadius = '8px';
      
      setHighlightedElements([elementToHighlight]);
      
      const updatePosition = () => {
        const rect = currentRef.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const tooltipWidth = 320;
        const tooltipHeight = 200;
        
        let top = rect.bottom + 20;
        let left = rect.left;
        
        if (left + tooltipWidth > viewportWidth) {
          left = viewportWidth - tooltipWidth - 20;
        }
        
        if (left < 20) {
          left = 20;
        }
        
        if (top + tooltipHeight > viewportHeight) {
          top = rect.top - tooltipHeight - 20;
        }
        
        if (top < 20) {
          top = 20;
        }
        
        setTooltipPosition({ top, right: left });
      };
      
      updatePosition();
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [currentStep, isTourVisible, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setActiveElement(
        idArray[currentStep + 1] as
          | "save"
          | "delete"
          | "preview"
          | "sitePreview"
          | "addRoute"
          | "changeRoute"
          | "seo"
          | "routeName"
      );
    } else {
      handleCloseTour();
    }
  };

  const handleCloseTour = () => {
    clearAllHighlights();
    setIsTourVisible(false);
    localStorage.setItem("hasSeenTour", "true");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllHighlights();
    };
  }, []);

  return (
    isTourVisible && (
      <>
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 z-40" />
        <div
          dir="rtl"
          className="fixed z-[9999] bg-indigo-700 border-2 border-gray-300 bg-opacity-90 backdrop-blur-md py-4 px-5 rounded-xl shadow-2xl w-80 transition-all duration-300 ease-in-out"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.right}px`,
            transform: "translate3d(0, 0, 0)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <p className="text-base font-bold text-white  ">
              {steps[currentStep].title}
            </p>
            {steps[currentStep].icon}
          </div>
          <p className="mb-4 pb-3 text-sm text-gray-200 border-b border-gray-300">
            {steps[currentStep].content}
          </p>
          <div className="flex justify-between flex-row-reverse">
            <button
              onClick={handleCloseTour}
              className="px-4 py-2 bg-red-500 text-white rounded-xl hover:scale-95 transition-all duration-700 hover:bg-red-600"
            >
              بستن
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-yellow-500 text-white rounded-xl hover:scale-95 transition-all duration-700 hover:bg-blue-600"
            >
              {currentStep === steps.length - 1 ? "پایان" : "بعدی"}
            </button>
          </div>
        </div>
      </>
    )
  );
};

export default TourGuide;
