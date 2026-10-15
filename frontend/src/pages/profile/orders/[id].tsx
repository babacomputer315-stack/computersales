import SiteLayout from "@/components/site/layout/Layout";
import OrderPrint from "@/components/site/shared/OrderPrint";
import httpClient from "@/services/httpClient";
import orderService from "@/services/user/order.service";
import { Order } from "@/types/order";
import { imageBaseUrl } from "@/utils/constants";
import { convertToJalali } from "@/utils/convertToJalali";
import { formatNumber } from "@/utils/formatNumber";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useReactToPrint } from "react-to-print";

const ProfileSidebar = dynamic(
  () => import("@/components/site/layout/ProfileSidebar"),
  {
    ssr: false,
  }
);

const OrderDetailPage = () => {
  const [order, setOrder] = useState<Order | null>(null);

  const router = useRouter();

  const [orderToPrint, setOrderToPrint] = useState<Order | null>(null);

  const printRef = useRef<HTMLDivElement>(null);

  const id = router.query.id?.toString() as string;

  const getData = async () => {
    const response = await orderService.getOrderById(Number(id));
    setOrder(response.data);
  };

  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: orderToPrint
      ? `سفارش - ${orderToPrint.orderNumber}`
      : "سفارش",
  });

  const handlePrintOrder = async () => {
    try {
      toast.loading("در حال بارگذاری اطلاعات سفارش...");
      const response = await httpClient.get(`/user/orders/${order?.id}`);
      setOrderToPrint(response.data.data);
      toast.dismiss();

      // Wait for the component to render before printing
      setTimeout(() => {
        handlePrint();
      }, 100);
    } catch (error) {
      console.log(error);
      toast.dismiss();
      toast.error("خطا در بارگذاری اطلاعات سفارش");
    }
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container mx-auto px-6 md:px-0 mt-6 md:mt-8 mb-16 md:mb-32">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-6">
          <ProfileSidebar />
          <div className="border border-stroke rounded-lg p-6">
            <div className="flex items-center gap-3 mb-16">
              <Link href="/profile/orders">
                <Image
                  src="/assets/icons/back.svg"
                  alt="back"
                  width={24}
                  height={24}
                />
              </Link>
              <h5 className="text-xl font-noora font-bold">جزئیات سفارش</h5>
            </div>
            <div className="flex flex-col gap-5">
              <div className="border-b border-b-stroke pb-5 flex items-center gap-6">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-secondary-text">کد سفارش:</span>
                  <span className="text-sm font-medium">
                    {order?.orderNumber}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-secondary-text">
                    تاریخ ثبت سفارش:
                  </span>
                  <span className="text-sm font-medium">
                    {convertToJalali(order?.createdAt ?? "")}
                  </span>
                </div>
              </div>
              <div className="border-b border-b-stroke pb-5 flex flex-col gap-5">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-secondary-text">
                      تحویل گیرنده:
                    </span>
                    <span className="text-sm font-medium">
                      {order?.shippingAddress?.fullName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-secondary-text">
                      شماره تماس:
                    </span>
                    <span className="text-sm font-medium">
                      {order?.shippingAddress?.phone}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-secondary-text">استان:</span>
                    <span className="text-sm font-medium">
                      {order?.shippingAddress?.province}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-secondary-text">شهر:</span>
                    <span className="text-sm font-medium">
                      {order?.shippingAddress?.city}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-secondary-text">
                    آدرس ارسال مرسوله:
                  </span>
                  <span className="text-sm font-medium">
                    {order?.shippingAddress?.addressLine}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-secondary-text">
                      کد پستی:
                    </span>
                    <span className="text-sm font-medium">
                      {order?.shippingAddress?.postalCode}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-secondary-text">پلاک:</span>
                    <span className="text-sm font-medium">
                      {order?.shippingAddress?.plaque}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-secondary-text">
                    یادداشت سفارش:
                  </span>
                  <span className="text-sm font-medium">
                    {order?.customerNote}
                  </span>
                </div>
              </div>
              <div className="border-b border-b-stroke pb-8 flex flex-col gap-5 pt-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-secondary-text">
                      مبلغ کل:
                    </span>
                    <span className="font-semibold">
                      {formatNumber(order?.totalAmount ?? 0)}
                    </span>
                    <span className="font-normal text-xs text-secondary-text">
                      تومان
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-secondary-text">
                      وضعیت پرداخت:
                    </span>
                    <span className="text-sm font-medium">
                      {order?.payment?.status}
                      {/* {order?.payment?.status === "failed" ? (
                      <div
                        onClick={() => {
                          window.location.href = `https://gateway.zibal.ir/start/${order?.payment?.trackingCode}`;
                        }}
                      >
                        پرداخت
                      </div>
                    ) : null} */}
                    </span>
                  </div>
                </div>
                {/* <div className="flex items-center gap-1">
                <span className="text-sm text-secondary-text">
                  هزینه بسته بندی و ارسال:
                </span>
                <span className="font-semibold">
                  {formatNumber(order?.totalAmount ?? 0)}
                </span>
                <span className="font-normal text-xs text-secondary-text">
                  تومان
                </span>
              </div> */}
              </div>
            </div>
            <div className="bg-[#F7F7F7] mt-5 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Image
                    src="/assets/icons/truck-secondary.svg"
                    alt="back"
                    width={24}
                    height={24}
                  />
                  <span>مشخصات مرسوله</span>
                </div>
                <div
                  onClick={() => {
                    handlePrintOrder();
                  }}
                  className="bg-white p-3 rounded-lg flex items-center gap-2 text-sm font-medium cursor-pointer"
                >
                  <Image
                    src="/assets/icons/file-text.svg"
                    alt="back"
                    width={20}
                    height={20}
                  />
                  <span className="text-secondary">مشاهده فاکتور</span>
                </div>
              </div>
              <div className="mt-8 flex items-center justify-between border-b border-b-stroke pb-6">
                <div className="flex text-sm items-center gap-2">
                  <span className="text-secondary-text">کد پیگیری مرسوله:</span>
                  <span className="font-medium">{order.orderNumber}</span>
                </div>
                <div className="flex text-sm items-center gap-2">
                  <span className="text-secondary-text">کد پیگیری مرسوله:</span>
                  <span className="font-medium">2165449</span>
                </div>
                <div className="flex text-sm items-center gap-2">
                  <span className="text-secondary-text">کد پیگیری مرسوله:</span>
                  <span className="font-medium">2165449</span>
                </div>
                <div className="flex text-sm items-center gap-2">
                  <span className="text-secondary-text">کد پیگیری مرسوله:</span>
                  <span className="font-medium">2165449</span>
                </div>
              </div>
              {order?.items.map((item) => {
                let attributesText = "";
                if (item.variation) {
                  const attrPairs = item?.variation?.attributeValues
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
                    className="py-6 border-b border-b-stroke flex items-center justify-between last:border-b-0 last:pb-0"
                  >
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-white rounded-lg">
                        <Image
                          src={`${imageBaseUrl}/${item.image?.name ?? ""}`}
                          alt="truck"
                          width={80}
                          height={80}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex flex-col items-start justify-between">
                        <h2 className="font-noora text-sm font-bold">
                          {item.product?.name || item.productName}
                        </h2>
                        <div className="flex items-center gap-1 text-sm">
                          <span className="text-secondary-text">تعداد:</span>
                          <span className="font-medium">
                            {item.quantity} عدد
                          </span>
                        </div>
                        {/* <div className="flex items-center gap-1 bg-white rounded-full px-1 py-0.5">
                      <div className="w-5 h-5 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs font-medium">زرد روشن</span>
                    </div> */}
                        {attributesText ? (
                          <div className="flex items-center gap-1 bg-white border border-stroke rounded-full px-1 py-0.5">
                            {item?.variation?.attributeValues?.find(
                              (attr: any) =>
                                attr?.attributeValue?.attribute?.slug ===
                                "color"
                            ) && (
                              <>
                                {item?.variation?.attributeValues?.find(
                                  (attr: any) =>
                                    attr?.attributeValue?.attribute?.slug ===
                                    "color"
                                )?.attributeValue?.colorCode ? (
                                  <div
                                    style={{
                                      backgroundColor:
                                        item?.variation?.attributeValues?.find(
                                          (attr: any) =>
                                            attr?.attributeValue?.attribute
                                              ?.slug === "color"
                                        )?.attributeValue?.colorCode,
                                    }}
                                    className="w-5 h-5 ml-0.5 rounded-full border border-stroke shadow-sm"
                                  ></div>
                                ) : null}
                                {item?.variation?.attributeValues?.find(
                                  (attr: any) =>
                                    attr?.attributeValue?.attribute?.slug ===
                                    "color"
                                )?.attributeValue?.file?.name ? (
                                  <Image
                                    src={`${imageBaseUrl}/${
                                      item?.variation?.attributeValues?.find(
                                        (attr: any) =>
                                          attr?.attributeValue?.attribute
                                            ?.slug === "color"
                                      )?.attributeValue?.file?.name
                                    }`}
                                    alt="color"
                                    width={20}
                                    height={20}
                                    className="rounded-full ml-0.5 border border-stroke shadow-sm"
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
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm text-secondary-text">
                        مبلغ پرداختی
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="font-bold">
                          {formatNumber(item.totalPrice)}
                        </span>
                        <span className="font-normal text-xs text-secondary-text">
                          تومان
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {orderToPrint && (
        <div style={{ display: "none" }}>
          <OrderPrint ref={printRef} order={orderToPrint || null} />
        </div>
      )}
    </>
  );
};

export default OrderDetailPage;

OrderDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <SiteLayout>{page}</SiteLayout>;
};
