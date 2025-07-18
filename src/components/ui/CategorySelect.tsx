"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface CategoryOption {
  value: string;
  label: string;
  icon: string;
  description: string;
  examples: string[];
}

const categoryOptions: CategoryOption[] = [
  {
    value: "retail",
    label: "Retail",
    icon: "🏪",
    description: "Consumer goods and shopping experiences",
    examples: ["storefronts", "shopping bags", "cash registers", "checkout counters"]
  },
  {
    value: "healthcare",
    label: "Healthcare",
    icon: "🏥",
    description: "Medical services and health-related products",
    examples: ["hospital buildings", "doctors", "stethoscopes", "medical cross"]
  },
  {
    value: "construction",
    label: "Construction",
    icon: "🏗️",
    description: "Building and construction services",
    examples: ["cranes", "construction workers", "hard hats", "blueprints"]
  },
  {
    value: "information-technology",
    label: "Information Technology",
    icon: "💻",
    description: "Tech services and digital solutions",
    examples: ["developers", "servers", "cloud icons", "screens full of code"]
  },
  {
    value: "food-beverage",
    label: "Food & Beverage",
    icon: "🍽️",
    description: "Restaurants, catering, and food services",
    examples: ["cafes", "chefs", "food trucks", "restaurant counters"]
  },
  {
    value: "banking-finance",
    label: "Banking & Finance",
    icon: "🏦",
    description: "Financial services and banking solutions",
    examples: ["bank buildings", "dollar signs", "credit cards", "charts"]
  },
  {
    value: "education",
    label: "Education",
    icon: "🎓",
    description: "Educational services and learning programs",
    examples: ["classrooms", "books", "chalkboards", "students and teachers"]
  },
  {
    value: "tourism",
    label: "Tourism",
    icon: "✈️",
    description: "Travel and tourism services",
    examples: ["travel agencies", "suitcases", "famous landmarks", "flights"]
  }
];

interface CategorySelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  showExamples?: boolean;
}

export function CategorySelect({ 
  value, 
  onValueChange, 
  placeholder = "Select a category",
  className = "",
  showExamples = false
}: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || "");

  const selectedOption = categoryOptions.find(option => option.value === selectedValue);

  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue);
    onValueChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
      >
        <div className="flex items-center space-x-2">
          {selectedOption ? (
            <>
              <span className="text-gray-900">{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        <ChevronDown 
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-auto"
          >
            <div className="py-1">
              {categoryOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full px-3 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors ${
                    selectedValue === option.value ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">
                            {option.label}
                          </span>
                          {selectedValue === option.value && (
                            <Check className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {option.description}
                        </p>
                        {showExamples && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-400 mb-1">Examples:</p>
                            <div className="flex flex-wrap gap-1">
                              {option.examples.map((example, index) => (
                                <span
                                  key={index}
                                  className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                                >
                                  {example}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

// Export the category options for use in other components
export { categoryOptions };
export type { CategoryOption };

