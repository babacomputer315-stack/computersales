import dynamic from "next/dynamic";
import React from "react";
import Button from "../Button";
import { imageBaseUrl } from "@/utils/constants";
import Image from "next/image";
import { formatNumber } from "@/utils/formatNumber";
import { useRouter } from "next/router";
const Modal = dynamic(() => import("./Modal"), {
  ssr: false,
});

const AddToCartModal = ({
  open,
  setOpen,
  item,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  item: any;
}) => {
  const router = useRouter();

  if (!item) return null;

  let attributesText = "";
  if (item?.variant) {
    const attrPairs = item?.variant?.attributeValues
      .map((v: any) => {
        const attr = v.attributeValue.attribute?.name;
        const val = v.attributeValue.value;
        return attr && val ? `${attr}: ${val}` : null;
      })
      .filter(Boolean);
    attributesText = attrPairs.join(" • ") || "";
  }

  return (
    <Modal
      title="محصول به سبد خرید اضافه شد !"
      open={open}
      setOpen={setOpen}
    >
      <div className="border border-stroke rounded-lg p-4">
        <div className="flex justify-between md:justify-start gap-4">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-lg bg-white border border-stroke">
            <Image
              src={`${imageBaseUrl}/${item?.image}`}
              alt={item?.name}
              width={150}
              height={150}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col justify-between items-start flex-1">
            <h4 className="font-bold font-noora text-sm">{item.name}</h4>
            {attributesText ? (
              <div className="flex items-center gap-1 bg-stroke rounded-full px-1 py-0.5">
                {item?.variant?.attributeValues?.find(
                  (attr: any) =>
                    attr?.attributeValue?.attribute?.slug === "color"
                ) && (
                  <>
                    {item?.variant?.attributeValues?.find(
                      (attr: any) =>
                        attr?.attributeValue?.attribute?.slug === "color"
                    )?.attributeValue?.colorCode ? (
                      <div
                        style={{
                          backgroundColor: item?.variant?.attributeValues?.find(
                            (attr: any) =>
                              attr?.attributeValue?.attribute?.slug === "color"
                          )?.attributeValue?.colorCode,
                        }}
                        className="w-5 h-5 ml-0.5 rounded-full"
                      ></div>
                    ) : null}
                    {item?.variant?.attributeValues?.find(
                      (attr: any) =>
                        attr?.attributeValue?.attribute?.slug === "color"
                    )?.attributeValue?.file?.name ? (
                      <Image
                        src={`${imageBaseUrl}/${
                          item?.variant?.attributeValues?.find(
                            (attr: any) =>
                              attr?.attributeValue?.attribute?.slug === "color"
                          )?.attributeValue?.file?.name
                        }`}
                        alt="color"
                        width={20}
                        height={20}
                        className="rounded-full ml-0.5"
                      />
                    ) : null}
                  </>
                )}
                {attributesText ? (
                  <span className="text-xs font-medium text-secondary-text">
                    {attributesText}
                  </span>
                ) : null}
              </div>
            ) : (
              <div className="h-4" />
            )}
            <span className="text-sm font-semibold">
              <span className="font-normal text-secondary-text">تعداد:</span>{" "}
              {item.quantity}
            </span>
          </div>
        </div>
        <div className="border-t-2 border-t-stroke border-dashed pt-4 mt-4 flex items-center justify-between">
          <div className="font-semibold">قیمت محصول</div>
          <div className="text-end block order-2 md:order-none my-4 md:my-0">
            <div className="flex flex-col gap-2 items-end">
              {item.salePrice && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-xs lg:text-sm text-secondary-text">
                      {formatNumber(item.price)}
                    </span>
                    <span className="text-xs text-secondary-text">تومان</span>
                  </div>
                  <div className="bg-danger text-white text-xs px-3 py-1 rounded-md">
                    {Math.round(
                      ((item.price - item.salePrice) / item.price) * 100
                    )}
                    %
                  </div>
                </div>
              )}
              <div className="flex items-center gap-1">
                <span className={`font-semibold text-lg`}>
                  {formatNumber(item.salePrice ? item.salePrice : item.price)}
                </span>
                <span className={`text-sm`}>تومان</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Button
        title="رفتن به سبد خرید"
        className="mt-6 w-full"
        onClick={() => {
          setOpen(false);
          router.push("/cart");
        }}
      />
    </Modal>
  );
};

export default AddToCartModal;
