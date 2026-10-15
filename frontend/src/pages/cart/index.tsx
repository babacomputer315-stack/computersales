import SiteLayout from "@/components/site/layout/Layout";
import React, { ReactElement } from "react";
import Image from "next/image";
import Button from "@/components/site/shared/Button";
import { imageBaseUrl, siteUrl } from "@/utils/constants";
import { formatNumber } from "@/utils/formatNumber";
import { useCart } from "@/context/CartContext";
import Head from "next/head";

const steps = [
  {
    label: "سبد خرید",
    icon: "/assets/icons/shopping-bag-white.svg",
    active: true,
    done: false,
  },
  {
    label: "ثبت اطلاعات کاربری",
    icon: "/assets/icons/user.svg",
    active: false,
    done: false,
  },
  {
    label: "تکمیل خرید",
    icon: "/assets/icons/check-circle.svg",
    active: false,
    done: false,
  },
];

const CartPage = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    getCartDiscount,
    getCartFinalTotal,
  } = useCart();

  if (cart.length === 0) {
    return (
      <>
        <Head>
          <title>سبد خرید - حراج کامپیوتر</title>
          <link key="canonical" rel="canonical" href={`${siteUrl}/cart`} />
        </Head>
        <div className="container mx-auto px-6 md:px-0 mt-6 md:mt-8 mb-16 md:mb-32 flex flex-col items-center justify-center gap-2 h-[50vh]">
          <Image
            src="/assets/images/empty-cart.png"
            alt="empty-cart"
            width={156}
            height={190}
          />
          <h5 className="text-sm md:text-xl font-semibold md:font-medium mt-2">
            سبد خرید شما خالی است
          </h5>
          <p className="text-sm text-secondary-text">
            شما هیچ محصولی به سبد خرید خود اضافه نکرده اید
          </p>
          <Button
            title="رفتن به صفحه اصلی"
            className="mt-2"
            link={true}
            href="/"
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>سبد خرید - حراج کامپیوتر</title>
        <link key="canonical" rel="canonical" href={`${siteUrl}/cart`} />
      </Head>
      <div className="container mx-auto px-6 md:px-0 mt-6 md:mt-8 mb-16 md:mb-32">
        <div className="bg-[#F5F5F7] py-5 md:py-10 rounded-lg mb-6 md:mb-8">
          <div className="flex items-center justify-between px-4 md:px-0 md:w-2/3 mx-auto relative">
            {steps.map((step) => (
              <div
                key={step.label}
                className={`flex flex-col gap-2 justify-center items-center z-10`}
              >
                <div
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center ${
                    step.active ? "bg-secondary-900" : "bg-white"
                  }`}
                >
                  <Image
                    src={step.icon}
                    alt={step.label}
                    width={24}
                    height={24}
                    className="w-5 h-5 md:w-6 md:h-6"
                  />
                </div>
                <span
                  className={`text-sm ${
                    step.active
                      ? "font-semibold text-main-text"
                      : "text-secondary-text"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="md:border-1.5 border-stroke p-0 md:py-6 md:px-6 rounded-lg grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-6">
          <div className="border rounded-lg md:border-none border-stroke px-3 md:px-0">
            <div className="grid md:grid-cols-[3fr_1fr_1fr] border-b border-b-stroke py-4 md:pt-0 md:pb-6">
              <div className="flex items-center justify-between md:justify-start gap-4">
                <h5 className="text-sm md:text-xl font-semibold md:font-medium">
                  سبد خرید شما
                </h5>
                <div className="bg-[#FDE9EB] text-primary text-sm py-1 px-4 rounded-lg">
                  {cart.length} محصول
                </div>
              </div>
              <div className="text-center hidden md:block">تعداد</div>
              <div className="text-end hidden md:block">قیمت نهایی</div>
            </div>
            {cart.map((item, index) => {
              let attributesText = "";
              if (item.variant) {
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
                <div
                  key={item.id}
                  className={`grid md:grid-cols-[3fr_1fr_1fr] ${
                    index === cart.length - 1 ? "border-b-0" : "border-b"
                  } items-center border-b-stroke py-4 md:pb-6 pt-6`}
                >
                  <div className="flex justify-between md:justify-start gap-4">
                    <div
                      className={`w-28 h-28 md:w-36 md:h-36 rounded-lg bg-white ${
                        item.image ? "border border-stroke" : ""
                      }`}
                    >
                      {item.image ? (
                        <Image
                          src={`${imageBaseUrl}/${item?.image}`}
                          alt={item?.name}
                          width={150}
                          height={150}
                          className="w-full h-full object-contain"
                        />
                      ) : null}
                    </div>
                    <div className="flex flex-col justify-between items-start flex-1">
                      <span className="text-sm">{item?.category}</span>
                      <h4 className="font-bold font-noora text-sm">
                        {item.name}
                      </h4>
                      {attributesText ? (
                        <div className="flex items-center gap-1 bg-stroke rounded-full px-1 py-0.5">
                          {item?.variant?.attributeValues?.find(
                            (attr: any) =>
                              attr?.attributeValue?.attribute?.slug === "color"
                          ) && (
                            <>
                              {item?.variant?.attributeValues?.find(
                                (attr: any) =>
                                  attr?.attributeValue?.attribute?.slug ===
                                  "color"
                              )?.attributeValue?.colorCode ? (
                                <div
                                  style={{
                                    backgroundColor:
                                      item?.variant?.attributeValues?.find(
                                        (attr: any) =>
                                          attr?.attributeValue?.attribute
                                            ?.slug === "color"
                                      )?.attributeValue?.colorCode,
                                  }}
                                  className="w-5 h-5 ml-0.5 rounded-full"
                                ></div>
                              ) : null}
                              {item?.variant?.attributeValues?.find(
                                (attr: any) =>
                                  attr?.attributeValue?.attribute?.slug ===
                                  "color"
                              )?.attributeValue?.file?.name ? (
                                <Image
                                  src={`${imageBaseUrl}/${
                                    item?.variant?.attributeValues?.find(
                                      (attr: any) =>
                                        attr?.attributeValue?.attribute
                                          ?.slug === "color"
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
                    </div>
                  </div>
                  <div className="md:flex items-center justify-end md:justify-center gap-1.5 flex order-3 md:order-none">
                    {!item?.isSinglePurchase ? (
                      <button
                        onClick={() => {
                          if (item.variant) {
                            if (item.quantity < item.variant.purchaseLimit) {
                              updateQuantity(item.id, item.quantity + 1);
                            }
                          } else {
                            if (
                              item.purchaseLimit !== null &&
                              item.quantity < item.purchaseLimit
                            ) {
                              updateQuantity(item.id, item.quantity + 1);
                            }
                          }
                        }}
                        disabled={
                          item.variant
                            ? item.quantity >= item?.variant?.purchaseLimit
                            : item.purchaseLimit !== null &&
                              item.quantity >= item.purchaseLimit
                        }
                        className={`w-10 h-10 rounded-md bg-[#F7F7F7] flex items-center justify-center ${
                          item.variant
                            ? item.quantity >= item?.variant?.purchaseLimit
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                            : item.purchaseLimit !== null &&
                              item.quantity >= item.purchaseLimit
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <Image
                          src="/assets/icons/plus.svg"
                          alt="minus"
                          width={20}
                          height={20}
                        />
                      </button>
                    ) : null}
                    <input
                      type="number"
                      className="w-10 h-10 text-center border border-stroke rounded-md focus:border-stroke text-sm focus:outline-none select-none"
                      value={item.quantity}
                      readOnly
                    />
                    <button
                      onClick={() => {
                        if (item.quantity === 1) {
                          removeFromCart(item.id);
                          return;
                        }
                        updateQuantity(item.id, item.quantity - 1);
                      }}
                      className={`w-10 h-10 rounded-md bg-[#F7F7F7] flex items-center justify-center`}
                    >
                      <Image
                        src="/assets/icons/trash.svg"
                        alt="minus"
                        width={20}
                        height={20}
                      />
                    </button>
                  </div>
                  <div className="text-end block order-2 md:order-none my-4 md:my-0">
                    <div className="flex flex-col gap-2 items-end">
                      {item.salePrice && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <span className="text-xs lg:text-sm text-secondary-text">
                              {formatNumber(item.price)}
                            </span>
                            <span className="text-xs text-secondary-text">
                              تومان
                            </span>
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
                          {formatNumber(
                            item.salePrice ? item.salePrice : item.price
                          )}
                        </span>
                        <span className={`text-sm`}>تومان</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="bg-[#F5F5F7] sticky top-6 rounded-xl p-4 h-fit">
            <div className="flex items-center gap-2.5">
              <Image
                src="/assets/icons/discount-cart.svg"
                alt="discount"
                width={24}
                height={24}
              />
              <span className="font-medium">اگر کد تخفیف دارید وارد کنید</span>
            </div>
            <div className="flex items-center gap-2.5 mt-4 relative pb-5 border-b border-b-[#E7E7E7]">
              <input
                type="text"
                className="h-12 rounded-lg text-sm px-3 flex-1 focus:outline-none focus:border-none"
                placeholder="کد تخفیف را وارد نمایید"
              />
              <button className="text-primary absolute left-4">اعمال کد</button>
            </div>
            <div className="flex flex-col gap-5 mt-5 border-b border-b-[#E7E7E7] pb-5">
              <div className="flex items-center justify-between">
                <span className="text-sm">تعداد محصولات</span>
                <span className="text-sm font-medium">{cart.length} محصول</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">مجموع قیمت</span>
                <span className="text-sm font-medium">
                  {formatNumber(getCartTotal())} تومان
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">مجموع تخفیف</span>
                <span className="text-sm font-medium">
                  {formatNumber(getCartDiscount())} تومان
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-5 mt-5">
              <div className="flex items-center justify-between">
                <span className="text-sm">مجموع سبد خرید</span>
                <span className="text-sm font-medium">
                  <span className="text-2xl font-bold">
                    {formatNumber(getCartFinalTotal())}
                  </span>{" "}
                  تومان
                </span>
              </div>
            </div>
            <Button
              title="تایید و تکمیل سفارش"
              className="mt-5 w-full"
              link={true}
              href="/cart/user-info"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;

CartPage.getLayout = function getLayout(page: ReactElement) {
  return <SiteLayout>{page}</SiteLayout>;
};
