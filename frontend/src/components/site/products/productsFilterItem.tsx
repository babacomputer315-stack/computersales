import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CategorySpecificationWithOptions } from "@/services/ssr/category.service";

interface ProductsFilterItemProps {
  specification: CategorySpecificationWithOptions;
  selectedOptions?: number[];
  onOptionToggle?: (optionId: number) => void;
  onClearFilter?: () => void;
}

const ProductsFilterItem = ({
  specification,
  selectedOptions = [],
  onOptionToggle,
  onClearFilter,
}: ProductsFilterItemProps) => {
  const [open, setOpen] = useState(false);

  // Check if any options are selected
  const hasSelectedOptions = selectedOptions.length > 0;

  // Get selected options for this specification
  const selectedSpecOptions = specification.options?.filter(option => 
    selectedOptions.includes(option.id)
  ) || [];

  const handleOptionClick = (optionId: number) => {
    if (onOptionToggle) {
      onOptionToggle(optionId);
    }
  };

  const handleClearFilter = () => {
    if (onClearFilter) {
      onClearFilter();
    }
  };

  return (
    <div
      className={`border-b border-b-stroke hidden md:flex flex-col px-4 justify-between gap-4 cursor-pointer ${
        hasSelectedOptions ? "bg-secondary/5" : ""
      }`}
    >
      <div
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between pt-6 ${
          !open ? "pb-6" : ""
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{specification.name}</span>
          {hasSelectedOptions && (
            <span className="text-xs bg-secondary text-white px-2 py-1 rounded-full">
              {selectedSpecOptions.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasSelectedOptions && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClearFilter();
              }}
              className="text-danger text-xs hover:underline"
            >
              حذف
            </button>
          )}
          <Image
            src={"/assets/icons/arrow-bottom-filter.svg"}
            width={24}
            height={24}
            alt="arrow"
            className={`transition-transform duration-500 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>
      {open ? (
        <div className="flex flex-col pb-6">
          {specification.options?.map((option) => {
            const isSelected = selectedOptions.includes(option.id);
            return (
              <div
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                className="flex items-center py-4 border-b border-b-stroke last:border-b-0 gap-2 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <Image
                  src={
                    isSelected
                      ? "/assets/icons/filter/checkbox-active.svg"
                      : "/assets/icons/checkbox.svg"
                  }
                  width={20}
                  height={20}
                  alt="checkbox"
                  className="mb-1"
                />
                <span 
                  className={`text-sm ${
                    isSelected ? "text-secondary font-medium" : "text-gray-800"
                  }`}
                >
                  {option.label}
                </span>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default ProductsFilterItem;
