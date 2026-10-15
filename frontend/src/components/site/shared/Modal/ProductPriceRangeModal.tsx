import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import Button from "../Button";
import { useRouter } from "next/router";
import { buildProductUrl } from "@/utils/urlHelpers";
import PriceRange from "../PriceRange";

const Modal = dynamic(() => import("./Modal"), {
  ssr: false,
});

const ProductPriceRangeModal = ({
  open,
  setOpen,
  productsMinPrice,
  productsMaxPrice,
  categorySlug,
  categoryId,
  brandSlug,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  productsMinPrice: number;
  productsMaxPrice: number;
  categorySlug?: string;
  categoryId?: number;
  brandSlug?: string;
}) => {
  const router = useRouter();

  const [minPrice, setMinPrice] = useState(productsMinPrice);
  const [maxPrice, setMaxPrice] = useState(productsMaxPrice);

  useEffect(() => {
    // Reset to default range when URL parameters are removed
    if (!router.query.minPrice && !router.query.maxPrice) {
      setMinPrice(productsMinPrice);
      setMaxPrice(productsMaxPrice);
    } else {
      if (router.query.minPrice) {
        setMinPrice(Number(router.query.minPrice));
      }
      if (router.query.maxPrice) {
        setMaxPrice(Number(router.query.maxPrice));
      }
    }
  }, [router.query, productsMinPrice, productsMaxPrice]);

  return (
    <Modal
      title="انتخاب بازه قیمتی"
      open={open}
      setOpen={setOpen}
      headerClassName="!mb-0"
    >
      <PriceRange
        minPrice={productsMinPrice}
        maxPrice={productsMaxPrice}
        onRangeChange={(min, max) => {
          setMinPrice(min);
          setMaxPrice(max);
        }}
        initialMin={router.query.minPrice ? minPrice : undefined}
        initialMax={router.query.maxPrice ? maxPrice : undefined}
      />
      <div className="flex gap-3 mt-6">
        <Button
          title="حذف فیلتر"
          variant="secondary"
          className="flex-1"
          onClick={() => {
            const {
              minPrice: _,
              maxPrice: __,
              categoryIds: ___,
              categoryId: ____,
              ...restQuery
            } = router.query;
            router.push(
              buildProductUrl(
                {
                  ...restQuery,
                  categoryIds: null,
                  categoryId: null,
                  minPrice: null,
                  maxPrice: null,
                },
                "/products",
                categoryId,
                categorySlug,
                brandSlug
              )
            );
            setOpen(false);
          }}
        />
        <Button
          title="فیلتر بر اساس قیمت"
          className="flex-1"
          onClick={() => {
            const categoryIds = router.query.categoryIds
              ? (router.query.categoryIds as string)
                  .split(",")
                  .map((id: string) => parseInt(id.trim()))
                  .filter((id: number) => !isNaN(id))
              : null;
            router.push(
              buildProductUrl(
                {
                  ...router.query,
                  categoryIds,
                  minPrice,
                  maxPrice,
                },
                "/products",
                categoryId,
                categorySlug,
                brandSlug
              )
            );
            setOpen(false);
          }}
        />
      </div>
    </Modal>
  );
};

export default ProductPriceRangeModal;
