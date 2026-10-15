import React, { forwardRef, useEffect, useState } from "react";
import { Order } from "@/types/order";
import orderService from "@/services/user/order.service";
import { convertToJalali } from "@/utils/convertToJalali";
import { formatNumber } from "@/utils/formatNumber";

interface OrderPrintProps {
  order: Order;
}

// forwardRef برای اینکه react-to-print بتونه به DOM دسترسی پیدا کنه
const OrderPrint = forwardRef<HTMLDivElement, OrderPrintProps>(
  ({ order }, ref) => {
    if (!order) return null;
    return (
      <>
        <div className="site relative" ref={ref} dir="rtl">
          <div className="absolute top-28 left-0 bottom-0 right-0 flex items-center justify-center">
            <img src="/assets/images/logo-print.svg" className="w-4/5 h-full" />
          </div>

          {/* --- هدر فاکتور --- */}
          <div className="flex justify-between items-center mb-4 border-b border-b-stroke bg-[#F4F6FA] px-6 py-5 text-xs">
            <div>
              <h1 className="mb-2 text-base font-bold">فاکتور ارسال</h1>
              {/* <p className="text-gray-500">شماره سفارش: {order.orderNumber}</p> */}
              <p>تاریخ: {convertToJalali(order.createdAt)}</p>
            </div>
            <img
              src="/assets/images/logo-full.svg"
              alt="لوگو"
              className="w-32 h-auto"
            />
          </div>

          {/* --- اطلاعات مشتری --- */}
          {/* <div className="mb-4 grid grid-cols-2 gap-4 px-4 text-[8px]">
          <div className="flex items-center justify-between border border-[#EBEBEB] rounded-sm p-2 gap-2">
            <span>وضعیت سفارش: </span>
            <span className="font-semibold">در حال بررسی</span>
          </div>
          <div className="flex items-center justify-between border border-[#EBEBEB] rounded-sm p-2 gap-2">
            <span>شناسه سفارش: </span>
            <span className="font-semibold tracking-widest">
              {order.orderNumber}
            </span>
          </div>
        </div> */}

          <div className="border border-[#E6EAF3] mb-4 rounded-sm overflow-hidden mx-4 text-[8px]">
            <div className="bg-[#F4F6FA] p-2 font-bold">اطلاعات فروشنده</div>
            <div className="p-2">
              <div className="grid grid-cols-2 border-b border-b-[#EBEBEB] pb-2 mb-2">
                <div className="w-1/2">
                  <span className="font-semibold">
                    نام فروشگاه:{" "}
                    <span className="font-normal">حراج کامپیوتر</span>
                  </span>
                </div>
                <div className="w-1/2">
                  <span className="font-semibold">
                    وبسایت:{" "}
                    <span className="font-normal">computersales.ir</span>
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="w-1/2">
                  <span className="font-semibold">
                    ایمیل:{" "}
                    <span className="font-normal">info@computersales.ir</span>
                  </span>
                </div>
                <div className="w-1/2">
                  <span className="font-semibold">
                    تلفن تماس: <span className="font-normal">021-45322</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-[#EBEBEB] mb-4 rounded-sm overflow-hidden mx-4 text-[8px]">
            <div className="bg-[#F4F6FA] p-2 font-bold">اطلاعات گیرنده</div>
            <div className="p-2">
              <div className="grid grid-cols-3 border-b border-b-[#EBEBEB] pb-2 mb-2">
                <div>
                  <span className="font-semibold">
                    استان:{" "}
                    <span className="font-normal">
                      {order.shippingAddress?.province}
                    </span>
                  </span>
                </div>
                <div className="flex justify-center">
                  <span className="font-semibold">
                    شهر:{" "}
                    <span className="font-normal">
                      {order.shippingAddress?.city}
                    </span>
                  </span>
                </div>
                <div className="flex justify-end">
                  <span className="font-semibold">
                    شماره تماس:{" "}
                    <span className="font-normal">
                      {order.shippingAddress?.phone}
                    </span>
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 border-b border-b-[#EBEBEB] pb-2 mb-2">
                <div>
                  <span className="font-semibold">
                    نام گیرنده:{" "}
                    <span className="font-normal">
                      {order.shippingAddress?.fullName}
                    </span>
                  </span>
                </div>
                <div className="flex justify-center">
                  <span className="font-semibold">
                    کد پستی:{" "}
                    <span className="font-normal">
                      {order.shippingAddress?.postalCode}
                    </span>
                  </span>
                </div>
                <div className="flex justify-end">
                  <span className="font-semibold">
                    پلاک:{" "}
                    <span className="font-normal">
                      {order.shippingAddress?.plaque}
                    </span>
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 border-b border-b-[#EBEBEB] pb-2 mb-2">
                <div>
                  <span className="font-semibold">
                    کد ملی:{" "}
                    <span className="font-normal">
                      {order?.user?.nationalCode}
                    </span>
                  </span>
                </div>
                <div className="flex justify-center">
                  <span className="font-semibold">
                    روش حمل و نقل: <span className="font-normal">تیپاکس</span>
                  </span>
                </div>
                <div className="flex justify-end">
                  <span className="font-semibold">
                    تاریخ سفارش:{" "}
                    <span className="font-normal">
                      {convertToJalali(order.createdAt)}
                    </span>
                  </span>
                </div>
              </div>
              <div>
                <span className="font-semibold">
                  آدرس:{" "}
                  <span className="font-normal">
                    {order.shippingAddress?.addressLine}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* --- جدول محصولات --- */}
          <div className="mx-4 mb-4">
            <table className="border-collapse text-right border border-[#EBEBEB] rounded-sm overflow-hidden w-full text-[8px]">
              <thead>
                <tr className="border-b border-[#EBEBEB] bg-[#F4F6FA]">
                  <th className="p-2 pl-0">محصول</th>
                  <th className="p-2 pl-0">ویژگی‌ها</th>
                  <th className="p-2 pl-0">تعداد</th>
                  <th className="p-2 pl-0">قیمت</th>
                  <th className="p-2 pl-0">قیمت کل</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b border-[#EBEBEB]">
                    <td className="p-2 pl-0">
                      <span className="w-28 leading-5 block">
                        {item.productName}
                      </span>
                    </td>
                    <td className="p-2 pl-0">
                      <span className="w-28 leading-5 block">
                        {item.attributesText}
                      </span>
                    </td>
                    <td className="p-2 pl-0">{item.quantity}</td>
                    <td className="p-2 pl-0">
                      {item.unitPrice.toLocaleString()}{" "}
                      <span className="text-[8px]">تومان</span>
                    </td>
                    <td className="p-2 pl-0">
                      {item.totalPrice.toLocaleString()}{" "}
                      <span className="text-[8px]">تومان</span>
                    </td>
                  </tr>
                ))}
                <tr className="border-b border-[#EBEBEB]">
                  <td
                    className="p-2 pl-0 bg-[#F4F6FA] text-center font-semibold"
                    colSpan={2}
                  >
                    جمع کل
                  </td>
                  <td className="p-2 pl-0 font-semibold">
                    {order.items.reduce((acc, item) => acc + item.quantity, 0)}
                  </td>
                  <td className="p-2 pl-0 font-semibold">
                    {order.items
                      .reduce((acc, item) => acc + item.unitPrice, 0)
                      .toLocaleString()}{" "}
                    <span className="text-[8px]">تومان</span>
                  </td>
                  <td className="p-2 pl-0 font-semibold">
                    {order.items
                      .reduce((acc, item) => acc + item.totalPrice, 0)
                      .toLocaleString()}{" "}
                    <span className="text-[8px]">تومان</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 px-4 text-[8px] rounded-md overflow-hidden mb-4">
            <div />
            {/* <div className="border border-[#EBEBEB] rounded-sm">
            <div className="bg-[#EDEDED] p-2 font-semibold">یادداشت خرید:</div>
            <div className="p-2">{order.customerNote}</div>
          </div> */}
            <div className="border border-[#EBEBEB] rounded-sm p-2">
              <div className="flex items-center justify-between pb-2">
                <span className="font-semibold">مبلغ کل</span>
                <span>{order.totalAmount.toLocaleString()} تومان</span>
              </div>

              {/* TAX */}
              {/* <div className="flex items-center justify-between pb-2 pt-2">
                <span className="font-semibold">مالیات بر ارزش افزوده</span>
                <span>
                  {formatNumber((order.totalAmount * 10) / 100)} تومان
                </span>
              </div> */}

              <div className="flex items-center justify-between pt-2 bg-[#F4F6FA] pb-2 px-2 rounded-md">
                <span className="font-semibold">مبلغ نهایی</span>
                <span className="font-semibold">
                  {/* TAX */}
                  {/* {formatNumber(
                    order.totalAmount + (order.totalAmount * 10) / 100
                  )}{" "} */}
                  {formatNumber(order.totalAmount)} تومان
                </span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
);

OrderPrint.displayName = "OrderPrint";

export default OrderPrint;
