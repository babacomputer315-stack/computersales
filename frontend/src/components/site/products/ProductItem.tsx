import Image from "next/image";
import React from "react";

import { imageBaseUrl } from "@/utils/constants";
import Link from "next/link";

export interface ProductCardData {
  id: number;
  name: string;
  slug: string;
  regularPrice: number;
  salePrice?: number | null;
  stockQuantity: number;
  images: Array<{
    file: {
      name: string;
    };
  }>;
  variations?: Array<{
    price: number;
    salePrice?: number | null;
  }>;
}

interface ProductItemProps {
  product?: ProductCardData;
  discount?: boolean;
  fill?: boolean;
  isMobile?: boolean;
  className?: string;
  border?: boolean;
}

const ProductItem = ({
  product,
  fill = false,
  isMobile = false,
  className = "",
  border = true,
}: ProductItemProps) => {
  const productName =
    product?.name ||
    "کارت گرافیک ایسوس Prime GeForce RTX 5050 8GB GDDR6 OC Edition";

  const productImage = product?.images?.length
    ? `${imageBaseUrl}/${product.images[0]?.file?.name}`
    : "https://computersales.storage.c2.liara.space/1757337576216-h2jvb0.webp";

  const regularPrice = product?.regularPrice
    ? product.regularPrice
    : product?.variations?.[0]?.price;

  const salePrice = product?.salePrice
    ? product.salePrice
    : product?.variations?.[0]?.salePrice;

  const hasDiscount =
    !!salePrice && !!regularPrice && salePrice < regularPrice;

  const discountPercentage = hasDiscount
    ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
    : 0;

  const stockQuantity = product?.stockQuantity;

  const discountComponent = (
    <>
      {/* 
      <div className="absolute top-0 -right-2 z-10">
        <div className="relative">
          <div
            className="absolute top-2 -right-1.5"
            style={{
              width: "0",
              height: "0",
              borderRight: "14px solid transparent",
              borderBottom: "32px solid #52090C",
              borderTop: "0 solid transparent",
              borderLeft: "0 solid transparent",
              zIndex: 20,
            }}
          />

          <div className="bg-primary text-white z-20 absolute top-6 -right-1 min-w-20 p-2 rounded-md">
            پر تخفیف
          </div>
        </div>
      </div>
      */}
    </>
  );

  const productImageComponent = (
    <div
      className={`${
        isMobile ? "aspect-square" : "w-full aspect-square"
      } relative`}
    >
      <Image
        src={productImage}
        alt={productName}
        width={isMobile ? 100 : 900}
        height={isMobile ? 100 : 900}
        className="object-contain w-full h-full rounded-lg"
      />

      {hasDiscount && discountComponent}
    </div>
  );

  const priceSection = regularPrice ? (
    <div className="flex flex-col gap-2 items-end">
      {hasDiscount && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-xs lg:text-sm text-secondary-text line-through">
              {regularPrice.toLocaleString()}
            </span>
          </div>

          <div className="bg-primary text-white text-xs px-3 py-1 rounded-md">
            {discountPercentage}%
          </div>
        </div>
      )}

      <div className="flex items-center gap-1">
        <span
          className={`font-semibold ${
            isMobile ? "text-sm" : "text-lg"
          }`}
        >
          {(salePrice || regularPrice)?.toLocaleString()}
        </span>

        <span className={`text-xs ${isMobile ? "" : "text-sm"}`}>
          تومان
        </span>
      </div>
    </div>
  ) : (
    <span
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = "tel:02145322";
      }}
      className="text-sm cursor-pointer"
    >
      تماس بگیرید
    </span>
  );

  return isMobile ? (
    <Link
      className={`${className} ${
        fill ? "bg-white" : "border-1.5 border-stroke"
      } rounded-lg p-4`}
      href={`/products/${product?.slug}`}
    >
      <div className="mt-4 grid grid-cols-[1fr_2fr] gap-3">
        {productImageComponent}

        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-peydaEn font-bold leading-6 line-clamp-2">
            {productName}
          </h2>

          <div className="flex items-end justify-between flex-1">
            <button className="icon-btn bg-gray">
              <Image
                src="/assets/icons/shopping-bag.svg"
                alt="shopping-bag"
                width={24}
                height={24}
              />
            </button>

            {priceSection}
          </div>
        </div>
      </div>
    </Link>
  ) : (
    <Link
      href={`/products/${product?.slug}`}
      className={`${className} ${
        fill ? "bg-white" : ""
      } rounded-lg h-full flex flex-col ${
        border
          ? "border-stroke border-1.5"
          : "border-transparent"
      }`}
    >
      {productImageComponent}

      <div className="px-4 pb-4 flex flex-col flex-1">
        <h2 className="font-semibold font-peydaEn text-sm leading-8 flex-1 line-clamp-2">
          {productName}
        </h2>

        <div className="flex items-center justify-between mt-2">
          {Number(stockQuantity) > 0 && (
            <div className="font-medium text-secondary-text text-xs">
              {stockQuantity} عدد موجود
            </div>
          )}
        </div>

        <div className="flex items-end justify-between h-14 mt-4">
          <button className="icon-btn bg-[#E6ECF3]">
            <Image
              src="/assets/icons/shopping-bag.svg"
              alt="shopping-bag"
              width={24}
              height={24}
            />
          </button>

          {priceSection}
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;