import dynamic from "next/dynamic";
import React from "react";
import Button from "../Button";
import Image from "next/image";
import { useRouter } from "next/router";
import { Category } from "@/services/user/product.service";
import { SSRProductFilters } from "@/services/ssr/product.service";
import { buildProductUrl } from "@/utils/urlHelpers";
const Modal = dynamic(() => import("./Modal"), {
  ssr: false,
});

const ProductCategoriesModal = ({
  open,
  setOpen,
  categories,
  currentFilters,
  setCurrentFilters,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  categories: Category[];
  currentFilters: SSRProductFilters;
  setCurrentFilters: (filters: SSRProductFilters) => void;
}) => {
  const router = useRouter();

  return (
    <Modal
      title="انتخاب دسته بندی"
      open={open}
      setOpen={setOpen}
      headerClassName="!mb-0"
    >
      <div className="flex py-6 gap-3 flex-wrap sticky top-20 bg-white">
        {categories
          .filter((c) => currentFilters.categoryIds?.includes(c.id))
          .map((category) => (
            <div
              className="text-xs border border-stroke p-2 rounded-md flex items-center gap-2 whitespace-nowrap"
              key={category.id}
            >
              <div
                className="cursor-pointer bg-gray w-6 h-6 rounded-md flex items-center justify-center"
                onClick={() => {
                  const newFilters = {
                    ...currentFilters,
                    categoryIds: [], // Clear all categories when removing
                    page: 1,
                  };
                  setCurrentFilters(newFilters);
                  const url = buildProductUrl(newFilters);
                  router.push(url);
                }}
              >
                <Image
                  src={"/assets/icons/x.svg"}
                  width={18}
                  height={18}
                  alt="x"
                />
              </div>
              {category.name}
            </div>
          ))}
      </div>
      <div className="flex flex-col gap-5">
        {categories.map((category) => (
          <div
            className="flex items-center justify-between rounded-md cursor-pointer border-b border-b-stroke pb-5 last:border-b-0"
            key={category.id}
            onClick={() => {
              const newFilters = {
                ...currentFilters,
                categoryIds: currentFilters.categoryIds?.includes(category.id)
                  ? [] // If already selected, deselect it
                  : [category.id], // Select only this category
                page: 1,
              };
              setCurrentFilters(newFilters);
              const url = buildProductUrl(newFilters);
              router.push(url);
            }}
          >
            <span
              className={`text-sm ${
                currentFilters.categoryIds?.includes(category.id)
                  ? "text-secondary font-medium"
                  : ""
              }`}
            >
              {category.name}
            </span>
            <div className="flex items-center gap-2">
              {category.productCount && (
                <span className="text-xs bg-neutral px-2 py-1 rounded w-5 h-5 flex items-center justify-center">
                  {category.productCount}
                </span>
              )}
              {currentFilters.categoryIds?.includes(category.id) ? (
                <Image
                  src={"/assets/icons/checkbox-fill.svg"}
                  width={20}
                  height={20}
                  alt="arrow"
                />
              ) : (
                <Image
                  src={"/assets/icons/checkbox.svg"}
                  width={20}
                  height={20}
                  alt="arrow"
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <Button
        title="بستن"
        className="mt-6 w-full sticky bottom-0"
        onClick={() => {
          setOpen(false);
        }}
      />
    </Modal>
  );
};

export default ProductCategoriesModal;
