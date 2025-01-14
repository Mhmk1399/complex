import React, { useEffect, useState } from "react";

interface TourGuideProps {
  saveButtonRef: React.RefObject<HTMLButtonElement>;
  addRouteButtonRef: React.RefObject<HTMLButtonElement>;
  deleteRouteButtonRef: React.RefObject<HTMLButtonElement>;
  previewToggleRef: React.RefObject<HTMLDivElement>;
  sitePreviewRef: React.RefObject<HTMLButtonElement>;
  changeRouteRef: React.RefObject<HTMLSelectElement>;
  setActiveElement: React.Dispatch<
    React.SetStateAction<
      "save" | "delete" | "preview" | "sitePreview" | "addRoute" | "changeRoute"
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
  setActiveElement,
}) => {
  const idArray = [
    "save",
    "addRoute",
    "delete",
    "preview",
    "sitePreview",
    "changeRoute",
  ];

  const [isTourVisible, setIsTourVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [tooltipPosition, setTooltipPosition] = useState({
    top: 10,
    right: 10,
  });
  const StepIcons = {
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
  };
  const steps = [
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
      content: "با کلیک بر روی این دکمه، وب‌سایت شما در پیش‌نمایش باز می‌شود.",
      title: "نمایش وب‌سایت",
      icon: StepIcons.sitePreview,
    },
    {
      ref: changeRouteRef,
      content: "از اینجا می‌توانید مسیر را تغییر دهید.",
      title: "تغییر مسیر",
      icon: StepIcons.changeRoutePath,
    },
  ];

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenTour");
    if (!hasSeenTour) {
      setIsTourVisible(true);
    }
  }, []);

  useEffect(() => {
    if (isTourVisible && steps[currentStep].ref.current) {
      steps[currentStep].ref.current.focus();
      steps[currentStep].ref.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      const rect = steps[currentStep].ref.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.bottom + 30,
        right: rect.left,
      });
    }
  }, [currentStep, isTourVisible, steps]);
  

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      // Get the next element and update position
      const nextElement = steps[currentStep + 1].ref.current;
      setActiveElement(
        idArray[currentStep + 1] as
          | "save"
          | "delete"
          | "preview"
          | "sitePreview"
          | "addRoute"
          | "changeRoute"
      );
      if (nextElement) {
        const rect = nextElement.getBoundingClientRect();
        setTooltipPosition({
          top: rect.bottom + 20,
          right: rect.left,
        });
      }
    } else {
      handleCloseTour();
    }
  };

  const handleCloseTour = () => {
    setIsTourVisible(false);
    localStorage.setItem("hasSeenTour", "true");
  };

  return (
    isTourVisible && (
      <>
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 z-40" />
        <div
          dir="rtl"
          className="absolute z-[9999] bg-indigo-700 border-2 border-gray-300 bg-opacity-70 backdrop-blur-md py-4 px-5 rounded-lg shadow-lg max-w-xs transition-all duration-500 ease-in-out"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.right}px`,
            transform: "translate3d(0, 0, 0)", // Enable hardware acceleration
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
