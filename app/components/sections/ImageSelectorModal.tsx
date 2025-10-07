"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FiImage } from "react-icons/fi";

// Interface for image file
interface ImageFile {
  id: string;
  filename: string;
  url: string;
  fileUrl: string;
  uploadedAt: string;
  size: number;
}

// Props interface for the modal
interface ImageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (image: ImageFile) => void;
}

export default function ImageSelectorModal({
  isOpen,
  onClose,
  onSelectImage,
}: ImageSelectorModalProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);

  // Fetch images based on store ID from token
  const fetchImages = async () => {
    try {
      const response = await fetch("/api/upload", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.success && data.images) {
        setImages(data.images);
      }
    } catch (error) {
      console.log("Error fetching images:", error);
    }
  };

  // Fetch images when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchImages();
    }
  }, [isOpen]);

  // Handle image selection
  const handleImageSelect = (image: ImageFile) => {
    setSelectedImage(image);
  };

  // Confirm image selection
  const confirmSelection = () => {
    if (selectedImage) {
      onSelectImage(selectedImage);
      onClose();
    }
  };

  // If modal is not open, return null
  if (!isOpen) return null;

  // Render modal using portal to document body
  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        dir="rtl"
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">انتخاب تصویر</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {images.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <FiImage className="w-20 h-20 text-gray-300 mb-4" />
                <h3 className="text-lg text-gray-500 mb-2">تصویری یافت نشد</h3>
                <div className="text-center max-w-md">
                  <p className="text-sm text-gray-400 mb-3">
                    لطفاً ابتدا تصاویر خود را آپلود کنید
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-700 font-medium">
                      راهنمایی: اگر تصویری ندارید، از دشبورد از قسمت گالری
                      بسازید
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {images.map((image: ImageFile) => (
                  <motion.div
                    key={image.id}
                    className={`relative cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 ${
                      selectedImage?.id === image.id
                        ? "ring-4 ring-blue-500 ring-opacity-75 scale-105"
                        : "hover:scale-105"
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleImageSelect(image)}
                  >
                    <Image
                      src={image.url}
                      alt={image.filename}
                      width={200}
                      height={200}
                      className="object-cover w-full h-32 sm:h-40"
                    />
                    {selectedImage?.id === image.id && (
                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                        <div className="bg-blue-500 rounded-full p-2">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-white text-xs truncate">
                        {image.filename}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              انصراف
            </button>
            <button
              onClick={confirmSelection}
              disabled={!selectedImage}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                selectedImage
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              تایید انتخاب
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
