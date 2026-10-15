import dynamic from "next/dynamic";
import React from "react";
import Button from "../Button";
import { useProductSort, SortOption } from "@/hooks/useProductSort";

const Modal = dynamic(() => import("./Modal"), {
  ssr: false,
});

interface ProductSortModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ProductSortModal = ({ open, setOpen }: ProductSortModalProps) => {
  const { currentSort, sortOptions, applySort, isSortActive } = useProductSort();

  const handleSortSelect = (sortOption: SortOption) => {
    applySort(sortOption);
    setOpen(false);
  };

  return (
    <Modal
      title="مرتب سازی محصولات"
      open={open}
      setOpen={setOpen}
      headerClassName="!mb-0"
    >
      <div className="flex flex-col gap-4 py-4">
        {sortOptions.map((option) => (
          <div
            key={option.value}
            onClick={() => handleSortSelect(option)}
            className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors ${
              isSortActive(option.value)
                ? "bg-primary text-white"
                : "bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <span
              className={`text-sm font-medium ${
                isSortActive(option.value) ? "text-secondary" : "text-gray-800"
              }`}
            >
              {option.label}
            </span>
            {isSortActive(option.value) && (
              <div className="w-5 h-5 bg-secondary rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-stroke">
        <Button
          title="بستن"
          className="w-full"
          onClick={() => setOpen(false)}
        />
      </div>
    </Modal>
  );
};

export default ProductSortModal;
