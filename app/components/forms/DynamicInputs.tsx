import React, { useEffect, useRef, useState } from "react";

interface DynamicRangeInputProps {
  label: string;
  name: string;
  value: string | number;
  min: string | number;
  max: string | number;
  step?: string | number;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  displayUnit?: string;
}
interface DynamicSelectInputProps {
  label: string;
  name: string;
  value: string | number;
  options: { value: string | number; label: string }[];
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}
interface ColorInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DynamicRangeInput: React.FC<DynamicRangeInputProps> = ({
  label,
  name,
  value,
  min,
  max,
  step = "1",
  onChange,
  displayUnit = "px",
}) => {
  const [inputValue, setInputValue] = useState(value);
  const percentage =
    ((Number(inputValue) - Number(min)) / (Number(max) - Number(min))) * 100;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange(e);
  };

  return (
    <div className="mb-2 w-full">
      <div className="flex justify-between items-center mb-3">
        <label
          htmlFor={name}
          className="text-sm font-semibold text-gray-800 tracking-wide"
        >
          {label}
        </label>
        <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-bold border border-indigo-200">
          {inputValue}
          {displayUnit}
        </div>
      </div>
      <div className="relative p-2 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
        <input
          id={name}
          type="range"
          name={name}
          min={min}
          max={max}
          step={step}
          value={inputValue}
          onChange={handleSliderChange}
          className="w-full h-2 rounded-full cursor-pointer appearance-none bg-transparent focus:outline-none range-input"
          style={{
            background: `linear-gradient(to left, #4f46e5 0%, #4f46e5 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
          }}
        />
      </div>
    </div>
  );
};

export const DynamicSelectInput: React.FC<DynamicSelectInputProps> = ({
  label,
  name,
  value,
  options,
  className = "",
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync selected value with label
  const selectedOption = options.find((option) => option.value === value);
  const displayLabel = selectedOption
    ? selectedOption.label
    : "Select an option";

  // Filter options based on search term
  const filteredOptions = options;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle option selection
  const handleSelect = (option: { value: string | number; label: string }) => {
    const syntheticEvent = {
      target: { name, value: option.value },
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange(syntheticEvent);
    setIsOpen(false);
  };

  // Handle keyboard navigation
  const handleKeyDown = (
    e: React.KeyboardEvent,
    option: { value: string | number; label: string }
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(option);
    }
  };

  return (
    <div className="mb-2 w-full" ref={containerRef}>
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-gray-800 mb-2 tracking-wide"
      >
        {label}
      </label>
      <div className="relative group">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`${className} w-full px-4 py-3 rounded-xl border-2 border-gray-300
            bg-white text-gray-800 text-sm font-semibold text-left
            focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2
            hover:border-indigo-200 hover:shadow-md transition-all duration-300 ease-in-out
            shadow-sm flex items-center justify-between`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span>{displayLabel}</span>
          <span
            className={`text-indigo-400 transition-transform duration-300 ease-in-out ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>
        {isOpen && (
          <div
            className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg
            max-h-64 overflow-y-auto transition-all duration-300 ease-in-out transform origin-top
            scale-y-100 opacity-100"
          >
            <ul role="listbox" className="text-sm text-gray-800">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={option.value === value}
                    tabIndex={0}
                    onClick={() => handleSelect(option)}
                    onKeyDown={(e) => handleKeyDown(e, option)}
                    className="px-4 py-2 cursor-pointer hover:bg-indigo-50 hover:text-indigo-600
                      transition-colors duration-200 focus:bg-indigo-50 focus:outline-none
                      focus:ring-1 focus:ring-indigo-300"
                  >
                    {option.label}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-500 italic">
                  No options found
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export const ColorInput: React.FC<ColorInputProps> = ({
  label,
  name,
  value,
  onChange,
}) => {
  const [hexValue, setHexValue] = useState(value || "#000000");
  const [isValidHex, setIsValidHex] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Validate hex code
  const validateHex = (hex: string) => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  };

  // Sync with external value prop
  useEffect(() => {
    if (validateHex(value)) {
      setHexValue(value);
      setIsValidHex(true);
    }
  }, [value]);

  // Handle click outside to blur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setHexValue(newValue);
    setIsValidHex(true);
    onChange(e);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value.toUpperCase();
    if (!newValue.startsWith("#")) {
      newValue = "#" + newValue;
    }
    setHexValue(newValue);
    const isValid = validateHex(newValue);
    setIsValidHex(isValid);

    if (isValid) {
      const syntheticEvent = {
        ...e,
        target: { ...e.target, name, value: newValue },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  return (
    <div className="mb-2 w-full group" ref={containerRef}>
      <label
        htmlFor={name}
        className="block text-sm font-bold text-gray-900 mb-3 tracking-wide transition-colors duration-300 group-hover:text-indigo-600"
      >
        {label}
      </label>
      <div className="relative flex flex-col sm:flex-row sm:items-center gap-3 p-1 bg-gray-50 rounded-xl border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
        <div className="relative">
          <div
            className={`absolute -inset-1.5 rounded-xl bg-gradient-to-r from-indigo-100 to-purple-100
              opacity-0 ${
                isFocused ? "opacity-50" : "group-hover:opacity-30"
              } transition-opacity duration-300 ease-in-out`}
          ></div>
          <input
            type="color"
            id={name}
            name={name}
            value={isValidHex ? hexValue : "#000000"}
            onChange={handleColorChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="relative z-10 w-10 h-10 p-0.5 rounded-lg border-2 border-white cursor-pointer
              shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
              transition-all duration-300 ease-in-out hover:scale-105"
            style={{ backgroundColor: isValidHex ? hexValue : "#000000" }}
            aria-label={`${label} color picker`}
          />
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={hexValue}
            onChange={handleHexChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`w-full px-3 py-2.5 text-sm font-mono uppercase rounded-lg border-2
              transition-all duration-200 shadow-sm focus:outline-none
              ${
                isValidHex
                  ? "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  : "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              }`}
            placeholder="#000000"
            maxLength={7}
            minLength={7}
            aria-label={`${label} hex color value`}
          />
          {!isValidHex && (
            <p className="text-xs text-red-500 mt-1 animate-fade-in">
              رنگ نامعتبر است
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
