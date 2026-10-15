import { ProductVariation } from "@/types/productVariation";
import dynamic from "next/dynamic";
import React from "react";
import Image from "next/image";
import { formatNumber } from "@/utils/formatNumber";
import { imageBaseUrl } from "@/utils/constants";

const Modal = dynamic(() => import("./Modal"), {
  ssr: false,
});

interface ProductVariationsModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  variations: ProductVariation[];
  activeVariant?: ProductVariation;
  onSelectVariation: (variation: ProductVariation) => void;
}

const ProductVariationsModal = ({
  open,
  setOpen,
  variations,
  activeVariant,
  onSelectVariation,
}: ProductVariationsModalProps) => {
  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectVariation = (variation: ProductVariation) => {
    onSelectVariation(variation);
    setOpen(false);
  };

  const getWarrantyName = (variation: ProductVariation) => {
    const warrantyAttr = variation.attributeValues.find(
      (av) => av.attributeValue.attribute.slug === "warranty"
    );
    return warrantyAttr?.attributeValue.value || "بدون گارانتی";
  };

  return (
    <Modal
      title={"انتخاب گارانتی محصول"}
      open={open}
      setOpen={handleClose}
      className="md:hidden"
    >
      <div className="flex flex-col gap-3">
        {variations.map((variation) => {
          const isActive = activeVariant?.id === variation.id;
          const warrantyName = getWarrantyName(variation);
          const price = variation.salePrice || variation.price;
          const regularPrice = variation.salePrice ? variation.price : null;
          const hasDiscount =
            variation.salePrice && variation.salePrice < variation.price;

          return (
            <div
              key={variation.id}
              onClick={() => handleSelectVariation(variation)}
              className={`border rounded-xl p-4 cursor-pointer transition-all ${
                isActive
                  ? "border-primary bg-primary/5"
                  : "border-stroke hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  {variation.imageFile?.name && (
                    <div className="w-16 h-16 rounded-lg border border-stroke overflow-hidden flex-shrink-0">
                      <Image
                        src={`${imageBaseUrl}/${variation.imageFile.name}`}
                        alt={warrantyName}
                        width={64}
                        height={64}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <span className="font-semibold text-sm">
                      {warrantyName}
                    </span>
                    {variation.stockStatus === "outofstock" && (
                      <span className="text-xs text-danger">ناموجود</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  {hasDiscount && regularPrice && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-secondary-text line-through">
                        {formatNumber(regularPrice)}
                      </span>
                      <span className="bg-danger text-white text-xs px-2 py-0.5 rounded">
                        {Math.round(
                          ((regularPrice - price) / regularPrice) * 100
                        )}
                        %
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-base">
                      {formatNumber(price)}
                    </span>
                    <span className="text-xs text-secondary-text">تومان</span>
                  </div>
                </div>
                {/* {isActive && (
                  <div className="flex-shrink-0">
                    <Image
                      src="/assets/icons/check-circle.svg"
                      alt="selected"
                      width={24}
                      height={24}
                    />
                  </div>
                )} */}
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default ProductVariationsModal;
