import React, { useEffect, useState } from "react";

interface TourGuideProps {
  saveButtonRef: React.RefObject<HTMLButtonElement>;
  addRouteButtonRef: React.RefObject<HTMLButtonElement>;
  deleteRouteButtonRef: React.RefObject<HTMLButtonElement>;
  previewToggleRef: React.RefObject<HTMLDivElement>;
}

const TourGuide: React.FC<TourGuideProps> = ({
  saveButtonRef,
  addRouteButtonRef,
  deleteRouteButtonRef,
  previewToggleRef,
}) => {
  const [isTourVisible, setIsTourVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({
    top: 120,
    left: 10,
  });

  const steps = [
    {
      ref: saveButtonRef,
      content: "با کلیک بر روی این دکمه، تنظیمات شما ذخیره می‌شود.",
    },
    {
      ref: addRouteButtonRef,
      content: "با این گزینه می‌توانید مسیر جدید اضافه کنید.",
    },
    {
      ref: deleteRouteButtonRef,
      content: "از اینجا می‌توانید مسیر را حذف کنید.",
    },
    {
      ref: previewToggleRef,
      content: "برای تغییر وضعیت پیش‌نمایش، از این دکمه‌ها استفاده کنید.",
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
      const rect = steps[currentStep].ref.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.bottom + 30,
        left: rect.left,
      });
    }
  }, [currentStep, isTourVisible]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      // Get the next element and update position
      const nextElement = steps[currentStep + 1].ref.current;
      if (nextElement) {
        const rect = nextElement.getBoundingClientRect();
        setTooltipPosition({
          top: rect.bottom + 20,
          left: rect.left,
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
          className="absolute z-50 bg-yellow-500 p-2 rounded-lg shadow-lg max-w-xs"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
          }}
        >
          <p className="text-lg font-bold mb-4 text-white">راهنمای سریع</p>
          <p className="mb-4 text-sm">{steps[currentStep].content}</p>
          <div className="flex justify-between flex-row-reverse">
            <button
              onClick={handleCloseTour}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              بستن
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-pink-500 text-white rounded"
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
