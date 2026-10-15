import SiteLayout from "@/components/site/layout/Layout";
import ProfileSidebar from "@/components/site/layout/ProfileSidebar";
import Button from "@/components/site/shared/Button";
import orderService from "@/services/user/order.service";
import { Order } from "@/types/order";
import { imageBaseUrl } from "@/utils/constants";
import { convertToJalali } from "@/utils/convertToJalali";
import { formatNumber } from "@/utils/formatNumber";
import Image from "next/image";
import React, { ReactElement, useEffect, useState } from "react";

const statuses = [
  {
    label: "جاری",
    value: "pending",
    icon: "/assets/icons/profile/order-pending.svg",
  },
  {
    label: "در حال پردازش",
    value: "processing",
    icon: "/assets/icons/profile/order-sent.svg",
  },
  {
    label: "تحویل شده",
    value: "completed",
    icon: "/assets/icons/profile/order-deliverd.svg",
  },
  {
    label: "لغو شده",
    value: "cancelled",
    icon: "/assets/icons/profile/order-cancel.svg",
  },
  // {
  //   label: "ناموفق",
  //   value: "failed",
  // },
  // {
  //   label: "بازگشت داده شده",
  //   value: "returned",
  // },
];

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentStatus, setCurrentStatus] = useState<
    "pending" | "processing" | "completed" | "cancelled" | "failed" | "returned"
  >("pending");
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const getData = async () => {
    const response = await orderService.getUserOrders(1, 10, currentStatus);
    setOrders(response.data.orders);
    setStatusCounts(response.data.statusCounts);
  };

  useEffect(() => {
    getData();
  }, [currentStatus]);

  return (
    <div className="container mx-auto px-6 md:px-0 mt-6 md:mt-8 mb-16 md:mb-32">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-6">
        <ProfileSidebar />
        <div className="flex flex-col overflow-x-hidden">
          <div>
            <div className="flex sticky md:top-6 top-0 z-10 bg-white pb-6 overflow-x-scroll hidden-scrollbar flex-nowrap gap-4">
              {statuses.map((status, index) => (
                <div
                  key={index}
                  onClick={() =>
                    setCurrentStatus(
                      status.value as
                        | "pending"
                        | "processing"
                        | "completed"
                        | "cancelled"
                        | "returned"
                        | "failed"
                    )
                  }
                  className={`min-w-52 flex-1 border-1.5 rounded-lg p-3 flex gap-3 cursor-pointer ${
                    status.value === currentStatus
                      ? "border-primary"
                      : "border-stroke"
                  }`}
                >
                  <div className="bg-input-bg w-12 h-12 rounded-xl flex items-center justify-center">
                    <Image
                      src={status.icon}
                      alt="order"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div className="flex flex-col justify-between">
                    <span className="font-semibold text-sm text-secondary-text">
                      {status.label}
                    </span>
                    <span className="font-semibold text-sm">
                      <span className="text-sm">
                        {statusCounts[status.value] || 0}
                      </span>{" "}
                      سفارش
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {orders.map((order, index) => (
              <div className="border border-stroke rounded-lg p-6" key={index}>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-b-stroke">
                  <div className="flex items-center gap-10 font-medium text-secondary-text">
                    <span>کد سفارش: {order.orderNumber}</span>
                    <span>
                      تاریخ ثبت سفارش:{" "}
                      {/* {new Date(order.createdAt).toLocaleDateString("fa-IR")} */}
                      {convertToJalali(order.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-2xl">
                      {formatNumber(order.totalAmount)}
                    </span>
                    <span className="text-sm text-secondary-text">تومان</span>
                  </div>
                </div>
                <div className="bg-input-bg rounded-lg flex md:items-center md:justify-between p-4 flex-col md:flex-row gap-8">
                  <div className="flex items-center gap-6">
                    {order?.items?.map((item, index) => (
                      <div
                        key={item.id}
                        className="w-20 h-20 bg-white rounded-lg relative"
                      >
                        <Image
                          src={`${imageBaseUrl}/${item.image.name}`}
                          alt={item.productName}
                          width={70}
                          height={70}
                          className="w-full h-full object-contain"
                        />
                        <span className="absolute -bottom-2 -left-2 bg-secondary text-white w-6 h-6 rounded-full flex items-center justify-center font-semibold text-xs">
                          {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 flex-col md:flex-row w-full md:w-auto">
                    {/* {order.payment?.status === "failed" ||
                    (order.status === "pending" &&
                      order.payment?.trackingCode) ? (
                      <Button
                        onClick={() => {
                          window.location.href = `https://gateway.zibal.ir/start/${order?.payment?.trackingCode}`;
                        }}
                        title="پرداخت"
                        variant="primary"
                        className="w-full md:w-auto"
                      />
                    ) : null} */}

                    <Button
                      link
                      href={`/profile/orders/${order.id}`}
                      title="جزئیات سفارش"
                      variant="primary"
                      className="w-full md:w-auto"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;

OrdersPage.getLayout = function getLayout(page: ReactElement) {
  return <SiteLayout>{page}</SiteLayout>;
};
