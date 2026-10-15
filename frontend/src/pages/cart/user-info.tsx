import SiteLayout from "@/components/site/layout/Layout";
import React, { ReactElement, useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/site/shared/Button";
import { formatNumber } from "@/utils/formatNumber";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import orderService, {
  CreateOrderRequest,
} from "@/services/user/order.service";
import paymentService from "@/services/user/payment.service";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Address from "@/types/address";
import addressService from "@/services/user/address.service";
import AddAddressModal from "@/components/site/shared/Modal/AddAddressModal";
import Label from "@/components/site/shared/Label";
import { ShippingClass } from "@/types/shippingClass";
import shippingClassService from "@/services/user/shippingClass.service";
import EditProfileModal from "@/components/site/shared/Modal/EditProfileModal";

const steps = [
  {
    label: "سبد خرید",
    icon: "/assets/icons/shopping-bag-white.svg",
    active: true,
    done: true,
  },
  {
    label: "ثبت اطلاعات کاربری",
    icon: "/assets/icons/user-white.svg",
    active: true,
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
  const { cart, getCartTotal, getCartDiscount, getCartFinalTotal } = useCart();
  const { user, setOpenAuthModal } = useAuth();
  const router = useRouter();

  const [openEditProfileModal, setOpenEditProfileModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [addressId, setAddressId] = useState<number | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [openAddAddressModal, setOpenAddAddressModal] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<"pec" | "zibal">("pec");

  const [customerNote, setCustomerNote] = useState("");

  const [shippingClasses, setShippingClasses] = useState<ShippingClass[]>([]);
  const [selectedShippingClass, setSelectedShippingClass] =
    useState<ShippingClass | null>(null);

  useEffect(() => {
    fetchShippingClasses();
  }, []);

  const fetchShippingClasses = async () => {
    try {
      const response = await shippingClassService.getShippingClasses();
      setShippingClasses(response.data);
      setSelectedShippingClass(response.data[0]);
    } catch (error) {
      console.error("Error fetching shipping classes:", error);
    }
  };

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await addressService.getUserAddresses();
      setAddresses(response.data);
      if (response.data.length) {
        setAddressId(response.data[0].id);
        setCityCode(response.data[0].cityCode);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const [cityCode, setCityCode] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!user) {
      router.push("/auth?redirect=/cart/user-info");
      return;
    }

    if (!user?.firstName || !user?.lastName) {
      toast.error("لطفا اطلاعات خود را تکمیل کنید");
      setOpenEditProfileModal(true);
      return;
    }

    if (cart.length === 0) {
      toast.error("سبد خرید شما خالی است");
      return;
    }

    if (!addressId) {
      toast.error("لطفا آدرس را انتخاب کنید");
      return;
    }

    if (!selectedShippingClass) {
      toast.error("لطفا نحوه ارسال را انتخاب کنید");
      return;
    }

    const isAssembly = cart.some((item) => item.name === "هزینه اسمبل");

    setIsLoading(true);

    try {
      // Prepare order data
      const orderData: CreateOrderRequest = {
        items: cart
          // .filter((item) => item.name !== "هزینه اسمبل")
          .map((item) => ({
            productId: item.id,
            variationId: item.variant?.id,
            quantity: item.quantity,
          })),
        shippingAddressId: addressId,
        shippingClassId: selectedShippingClass.id,
        paymentMethod: "gateway",
        customerNote,
        isAssembly,
      };

      // Create order
      const orderResponse = await orderService.createOrder(orderData);

      // Initiate payment
      const paymentResponse = await paymentService.initiatePayment(
        orderResponse.order.id,
        paymentMethod
      );

      // Clear cart after successful order creation
      // clearCart();

      // Redirect to payment page or show success message

      // You can redirect to payment gateway or show payment instructions
      if (paymentResponse.paymentUrl) {
        toast.success("در حال هدایت به درگاه پرداخت ...");
        window.location.href = paymentResponse.paymentUrl;
      } else {
        router.push(`/profile/orders/${orderResponse.order.id}`);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("خطا در ثبت سفارش. لطفا دوباره تلاش کنید");
    } finally {
      setIsLoading(false);
    }
  };

  const ShippingClassItem = ({
    shippingClass,
  }: {
    shippingClass: ShippingClass | undefined;
  }) => {
    if (!shippingClass) return null;
    return (
      <div
        key={shippingClass.id}
        className={`border p-4 rounded-xl text-sm font-medium flex items-center justify-between cursor-pointer ${
          selectedShippingClass?.id === shippingClass.id
            ? "border-primary"
            : "border-stroke"
        }`}
        onClick={() => setSelectedShippingClass(shippingClass)}
      >
        <div className="flex items-center gap-2">
          <Image
            src={
              selectedShippingClass?.id === shippingClass.id
                ? "/assets/icons/checkbox-active.svg"
                : "/assets/icons/checkbox.svg"
            }
            alt="shipping-class"
            width={20}
            height={20}
          />
          <span>{shippingClass.name}</span>
        </div>
        <span className="text-gray-800 text-sm">
          {shippingClass.type === "post" || shippingClass.name === "تحویل حضوری"
            ? ""
            : "پس کرایه"}
        </span>
      </div>
    );
  };

  return (
    <>
      <AddAddressModal
        open={openAddAddressModal}
        setOpen={setOpenAddAddressModal}
        onSuccess={() => {
          fetchAddresses();
        }}
      />
      <div className="container mx-auto px-6 md:px-0 mt-6 md:mt-8 mb-16 md:mb-32">
        <div className="bg-[#F5F5F7] py-5 md:py-10 rounded-lg mb-6 md:mb-8">
          <div className="flex items-center justify-between px-4 md:px-0 md:w-2/3 mx-auto relative">
            {steps.map((step) => (
              <div
                key={step.label}
                className={`flex flex-col gap-2 justify-center items-center z-10 ${
                  step.done ? "opacity-20" : ""
                }`}
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
          <div className="border rounded-lg md:border-none border-stroke px-3 md:px-0 order-2 md:order-1">
            <div className="border-b border-b-stroke py-4 md:pt-0 md:pb-6 flex items-center justify-between">
              <h5 className="text-sm md:text-xl font-semibold md:font-medium">
                اطلاعات شما
              </h5>
              {/* <span
                className="text-primary bg-primary-50 font-semibold cursor-pointer"
                onClick={() => {
                  if(!user) {
                    router.push("/auth?redirect=/cart/user-info");
                    return;
                  }
                  setOpenAddAddressModal(true)
                }}
              >
                افزودن آدرس جدید
              </span> */}
              <Button
                variant="secondary"
                title="افزودن آدرس جدید"
                onClick={() => {
                  if (!user) {
                    router.push("/auth?redirect=/cart/user-info");
                    return;
                  }
                  setOpenAddAddressModal(true);
                }}
              />
            </div>
            <div className="mt-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-secondary-text mt-2">در حال بارگذاری...</p>
                </div>
              ) : addresses?.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-secondary-text">هیچ آدرسی ثبت نشده است</p>
                </div>
              ) : (
                addresses?.map((address) => (
                  <div
                    key={address.id}
                    onClick={() => {
                      setAddressId(address.id);
                      setCityCode(address.cityCode);
                    }}
                    className={`mb-6 last:mb-0 border-b-1.5 border-stroke pb-6 last:border-b-0 last:pb-0 flex items-center justify-between cursor-pointer`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="flex items-center flex-1 gap-2">
                          <Image
                            src={"/assets/icons/map-pin.svg"}
                            alt="map"
                            width={24}
                            height={24}
                          />
                          <p>{address.addressLine}</p>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center gap-3 flex-wrap">
                        <div className="text-sm px-4 py-2 bg-[#F5F5F7] rounded-md">
                          استان: <span>{address.province}</span>
                        </div>
                        <div className="text-sm px-4 py-2 bg-[#F5F5F7] rounded-md">
                          شهر: <span>{address.city}</span>
                        </div>
                        <div className="text-sm px-4 py-2 bg-[#F5F5F7] rounded-md">
                          شماره تماس: <span>{address.phone}</span>
                        </div>
                        {address.postalCode && (
                          <div className="text-sm px-4 py-2 bg-[#F5F5F7] rounded-md">
                            کد پستی: <span>{address.postalCode}</span>
                          </div>
                        )}
                        <div className="text-sm px-4 py-2 bg-[#F5F5F7] rounded-md">
                          گیرنده: <span>{address.fullName}</span>
                        </div>
                      </div>
                    </div>
                    {addressId === address.id && (
                      <div>
                        <Image
                          src={"/assets/icons/checkbox-active.svg"}
                          alt="check"
                          width={24}
                          height={24}
                        />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            <div>
              <div className="mt-6 mb-4 md:mb-6 border-t border-t-stroke pt-6 border-b border-b-stroke pb-6">
                <Label label="یادداشت سفارش" />
                <textarea
                  placeholder="یادداشت سفارش ..."
                  className="w-full p-3 resize-none rounded-lg outline-none text-main-text text-sm bg-input-bg focus:outline-primary focus:outline-1"
                  rows={5}
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                ></textarea>
              </div>
              <div className="mb-4 pb-6 border-b border-b-stroke">
                <div>
                  <span className="font-bold text-sm">درگاه پرداخت</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                  <div
                    className={`border p-4 rounded-xl text-sm font-medium flex items-center justify-between cursor-pointer ${
                      paymentMethod === "pec"
                        ? "border-primary"
                        : "border-stroke"
                    }`}
                    onClick={() => setPaymentMethod("pec")}
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={
                          paymentMethod === "pec"
                            ? "/assets/icons/checkbox-active.svg"
                            : "/assets/icons/checkbox.svg"
                        }
                        alt="pec"
                        width={20}
                        height={20}
                      />
                      <span>درگاه پرداخت پارسیان</span>
                    </div>
                  </div>
                  <div
                    className={`border p-4 rounded-xl text-sm font-medium flex items-center justify-between cursor-pointer ${
                      paymentMethod === "zibal"
                        ? "border-primary"
                        : "border-stroke"
                    }`}
                    onClick={() => setPaymentMethod("zibal")}
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={
                          paymentMethod === "zibal"
                            ? "/assets/icons/checkbox-active.svg"
                            : "/assets/icons/checkbox.svg"
                        }
                        alt="zibal"
                        width={20}
                        height={20}
                      />
                      <span>درگاه پرداخت زیبال</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <div>
                  <span className="font-bold text-sm">انتخاب نحوه ارسال </span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                  {shippingClasses
                    .filter((item) => item.name === "تیپاکس")
                    .map((shippingClass) => (
                      <ShippingClassItem
                        key={shippingClass.id}
                        shippingClass={shippingClass}
                      />
                    ))}
                  {shippingClasses
                    .filter((item) => item.name === "پست")
                    .map((shippingClass) => (
                      <ShippingClassItem
                        key={shippingClass.id}
                        shippingClass={shippingClass}
                      />
                    ))}
                  {cityCode === "1" ? (
                    <>
                      <ShippingClassItem
                        shippingClass={shippingClasses.find(
                          (item) => item.name === "پیک"
                        )}
                      />
                      <ShippingClassItem
                        shippingClass={shippingClasses.find(
                          (item) => item.name === "تحویل حضوری"
                        )}
                      />
                    </>
                  ) : (
                    <ShippingClassItem
                      shippingClass={shippingClasses.find(
                        (item) => item.name === "باربری"
                      )}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="border border-stroke bg-[#F5F5F7] rounded-xl p-4 h-fit order-2 md:order-2 sticky top-24">
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
              {/* TAX */}
              {/* <div className="flex items-center justify-between">
                <span className="text-sm">مالیات بر ارزش افزوده</span>
                <span className="text-sm font-medium">
                  {formatNumber((getCartFinalTotal() * 10) / 100)} تومان
                </span>
              </div> */}
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
                    {/* TAX */}
                    {/* {formatNumber(
                      getCartFinalTotal() + (getCartFinalTotal() * 10) / 100
                    )} */}
                    {formatNumber(getCartFinalTotal())}
                  </span>{" "}
                  تومان
                </span>
              </div>
            </div>
            <Button
              title={isLoading ? "در حال پردازش..." : "پرداخت و خرید محصول"}
              className="mt-5 w-full"
              onClick={handleSubmit}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
      <EditProfileModal
        open={openEditProfileModal}
        setOpen={setOpenEditProfileModal}
        // onSuccess={() => {
        //   handleSubmit();
        // }}
      />
    </>
  );
};

export default CartPage;

CartPage.getLayout = function getLayout(page: ReactElement) {
  return <SiteLayout>{page}</SiteLayout>;
};
