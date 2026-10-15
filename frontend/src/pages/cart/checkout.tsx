import SiteLayout from "@/components/site/layout/Layout";
import React, { ReactElement, useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/site/shared/Button";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import paymentService from "@/services/user/payment.service";
import toast from "react-hot-toast";
import { formatNumber } from "@/utils/formatNumber";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useCart } from "@/context/CartContext";
import { OrderItem } from "@/types/orderItem";
import orderService from "@/services/user/order.service";
import { imageBaseUrl } from "@/utils/constants";
import Link from "next/link";

const CheckoutPage = () => {
  const router = useRouter();

  const { clearCart } = useCart();

  const { user, loading, setOpenAuthModal } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [payment, setPayment] = useState<any>(null);

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const [isSuccess, setIsSuccess] = useState(false);

  const isMobile = useIsMobile();

  const { orderId, status, success, trackId, token, provider } = router.query;

  useEffect(() => {
    if (!user && !loading) {
      setOpenAuthModal(true);
      return;
    }
    if (orderId && trackId && user) {
      verifyPayment();
    }
    if (token && provider === "pec") {
      verifyPECPayment();
    }
  }, [orderId, trackId, user, token, provider]);

  const verifyPayment = async () => {
    if (!orderId || !trackId) return;

    setIsLoading(true);

    try {
      const verifyData = {
        trackingCode: trackId as string,
        provider: "zibal",
      };

      const response = await paymentService.verifyPayment(
        Number(orderId),
        verifyData
      );

      if (response.success) {
        setOrder(response.order);
        setPayment(response.payment);
        clearCart();
        setIsSuccess(true);

        const orderItemsResponse = await orderService.getOrderById(
          Number(orderId)
        );

        setOrderItems(orderItemsResponse.data.items);
      } else {
        const orderItemsResponse = await orderService.getOrderById(
          Number(orderId)
        );

        setOrderItems(orderItemsResponse.data.items);
        toast.error("پرداخت ناموفق بود");
        setPayment(response.payment);
        setOrder(response.order);
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error("خطا در تایید پرداخت");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPECPayment = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await paymentService.verfyPECPayment({
        Token: token as string,
        status: status as string,
      });
      if (response?.success) {
        const orderId = response.orderId;
        const orderResponse = await orderService.getOrderById(Number(orderId));
        setOrder(orderResponse.data);
        setOrderItems(orderResponse.data.items);
        clearCart();
        setIsSuccess(true);
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error("خطا در تایید پرداخت");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewOrder = () => {
    router.push(`/profile/orders/${order?.id || orderId}`);
  };

  if (!user || loading) {
    return null;
  }

  return (
    <div className="container mx-auto px-6 md:px-0 mt-6 md:mt-8 mb-32 md:mb-32">
      <div>
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium">در حال تایید پرداخت...</p>
          </div>
        ) : order ? (
          isSuccess ? (
            <div className="lg:border border-stroke rounded-xl lg:p-8">
              <div className="bg-success-light lg:px-6 lg:py-5 p-4 flex flex-col lg:flex-row lg:items-center justify-between rounded-xl">
                <div className="flex items-center gap-2">
                  <Image
                    src="/assets/icons/checkout-success.svg"
                    alt="success"
                    width={isMobile ? 56 : 80}
                    height={isMobile ? 56 : 80}
                  />
                  <div>
                    <h1 className="lg:text-xl font-bold text-main-text mb-2">
                      پرداخت شما با{" "}
                      <span className="text-[#48D48A]">موفقیت</span> انجام شد
                    </h1>
                    <p className="text-sm text-gray-800">
                      جهت دریافت جزئیات بیشتر، لطفاً ایمیل یا پیامک خود را بررسی
                      کنید
                    </p>
                  </div>
                </div>
                <div className="flex lg:flex-col items-center lg:items-start justify-between mt-6 lg:mt-0">
                  <span className="text-sm lg:mb-2">مبلغ پرداختی</span>
                  <span className="font-bold lg:text-xl flex items-center gap-1">
                    <span>{formatNumber(order.totalAmount)}</span>{" "}
                    <span className="text-gray-800 text-xs lg:text-sm font-normal">
                      تومان
                    </span>
                  </span>
                </div>
              </div>
              <div className="mt-6 flex flex-col-reverse lg:items-center lg:justify-between lg:flex-row gap-6">
                <div className="font-bold text-sm lg:text-base flex items-center gap-2">
                  <Image
                    src={"/assets/icons/category-menu.svg"}
                    width={14}
                    height={14}
                    alt="category-menu"
                  />
                  <span>سفارشات من</span>
                </div>
                <div className="bg-[#F5F5F7] rounded-lg p-4 text-sm flex items-center gap-8 justify-between">
                  <span>کد سفارش</span>
                  <span className="font-semibold tracking-widest">
                    #{order.orderNumber}
                  </span>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-4">
                {orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 border border-stroke rounded-xl flex flex-col lg:flex-row items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={`${imageBaseUrl}/${item.image?.name}`}
                        alt={item.productName}
                        width={64}
                        height={64}
                      />
                      <div className="flex flex-col gap-2">
                        <div className="font-semibold">{item.productName}</div>
                        <div className="text-gray-800 text-sm">
                          {item.attributesText}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between lg:hidden w-full mt-6">
                      <div className="bg-[#F5F5F7] rounded-lg text-sm items-center gap-2 py-2 px-3 flex">
                        <span className="font-semibold">{item.quantity}</span>
                        <span>عدد</span>
                      </div>
                      <div className="items-center gap-1 flex">
                        <span className="font-bold text-lg">
                          {formatNumber(item.totalPrice)}
                        </span>
                        <span className="text-sm text-gray-800">تومان</span>
                      </div>
                    </div>
                    <div className="bg-[#F5F5F7] rounded-lg text-sm items-center gap-2 py-2 px-3 hidden lg:flex">
                      <span className="font-semibold">{item.quantity}</span>
                      <span>عدد</span>
                    </div>
                    <div className="items-center gap-1 hidden lg:flex">
                      <span className="font-bold text-lg">
                        {formatNumber(item.totalPrice)}
                      </span>
                      <span className="text-sm text-gray-800">تومان</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button
                  title="مشاهده سفارش"
                  className="mt-6"
                  onClick={handleViewOrder}
                />
              </div>
            </div>
          ) : (
            <div className="lg:border border-stroke lg:p-6 rounded-xl lg:max-w-3xl mx-auto">
              <div className="flex items-center gap-2">
                <Image
                  src={"/assets/icons/checkout-fail.svg"}
                  alt="success"
                  width={isMobile ? 56 : 80}
                  height={isMobile ? 56 : 80}
                />
                <div className="gap-2 flex flex-col">
                  <h2 className="text-sm lg:text-xl font-bold">
                    خرید شما متاسفانه{" "}
                    <span className="text-danger">ناموفق</span> بود !
                  </h2>
                  <p className="text-sm text-gray-800">
                    لطفا سفارش خودرا چک کرده و دوباره تلاش کنید
                  </p>
                </div>
              </div>
              <div className="bg-[#F4F6FA] p-4 rounded-xl mt-4 mb-6 text-sm lg:text-base">
                <div className="flex items-center justify-between">
                  <span className="text-gray-800">تاریخ تراکنش</span>
                  <span>25 اسفند 1403</span>
                </div>
              </div>
              <Link
                href={"/"}
                className="border border-stroke rounded-lg px-8 py-3 flex items-center justify-center text-secondary-900 font-medium text-sm"
              >
                بازگشت به سایت
              </Link>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <p className="text-lg font-medium text-secondary-text">
              در حال بارگذاری...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;

CheckoutPage.getLayout = function getLayout(page: ReactElement) {
  return <SiteLayout>{page}</SiteLayout>;
};
