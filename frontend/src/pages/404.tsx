import Button from "@/components/site/shared/Button";
import Image from "next/image";
import React from "react";

const NotFoundPage = () => {
  return (
    <div className="h-screen w-screen flex items-center site justify-center">
      <div className="flex items-center justify-center gap-4 flex-col">
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <h2 className="lg:text-2xl font-bold">
          متأسفیم! صفحه‌ی موردنظر شما یافت نشد.
        </h2>
        <p className="lg:text-base text-secondary-text text-center">
          ممکن است صفحه حذف شده باشد یا نشانی آن تغییر کرده باشد. برای ادامه، به
          صفحه‌ی اصلی مراجعه کنید
        </p>
        <Button
          className="z-50"
          link={true}
          href="/"
          title="بازگشت به صفحه اصلی"
        />
      </div>
      <Image
        src={"/assets/images/not-found/1.svg"}
        alt="not-found"
        width={1000}
        height={1000}
        className="absolute left-0 top-[10%] hidden lg:block"
      />
      <Image
        src={"/assets/images/not-found/mobile-1.svg"}
        alt="not-found"
        width={200}
        height={200}
        className="absolute left-0 top-[15%] lg:hidden"
      />
      <Image
        src={"/assets/images/not-found/2.svg"}
        alt="not-found"
        width={1000}
        height={1000}
        className="absolute right-0 bottom-[10%] hidden lg:block"
      />
      <Image
        src={"/assets/images/not-found/mobile-2.svg"}
        alt="not-found"
        width={200}
        height={200}
        className="absolute right-0 bottom-[15%] lg:hidden"
      />
    </div>
  );
};

export default NotFoundPage;
