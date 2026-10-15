import SiteLayout from "@/components/site/layout/Layout";
import Button from "@/components/site/shared/Button";
import InputField from "@/components/site/shared/InputField";
import Label from "@/components/site/shared/Label";
import StaticMap from "@/components/site/shared/StaticMap";
import { useIsMobile } from "@/hooks/useIsMobile";
import Image from "next/image";
import React, { ReactElement } from "react";
import Head from "next/head";
import { siteUrl } from "@/utils/constants";

const ContactPage = () => {
  const ismobile = useIsMobile();

  return (
    <>
      <Head>
        <title>تماس با ما - حراج کامپیوتر</title>
        <meta
          key="description"
          name="description"
          content="برای کسب اطلاعات بیشتر و خرید محصولات با حراج کامپیوتر در تماس باشید"
        />
        <link key="canonical" rel="canonical" href={`${siteUrl}/contact`} />

        {/* Open Graph Meta Tags */}
        <meta key="og:type" property="og:type" content="website" />
        <meta
          key="og:title"
          property="og:title"
          content="تماس با ما - حراج کامپیوتر"
        />
        <meta
          key="og:description"
          property="og:description"
          content="برای کسب اطلاعات بیشتر و خرید محصولات با حراج کامپیوتر در تماس باشید"
        />
        <meta property="og:url" content={`${siteUrl}/contact`} />

        {/* Twitter Card Meta Tags */}
        <meta
          key="twitter:card"
          name="twitter:card"
          content="summary"
        />
        <meta
          key="twitter:title"
          name="twitter:title"
          content="تماس با ما - حراج کامپیوتر"
        />
        <meta
          key="twitter:description"
          name="twitter:description"
          content="برای کسب اطلاعات بیشتر و خرید محصولات با حراج کامپیوتر در تماس باشید"
        />

        {/* Structured Data - ContactPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ContactPage",
              name: "تماس با ما - حراج کامپیوتر",
              description:
                "برای کسب اطلاعات بیشتر و خرید محصولات با حراج کامپیوتر در تماس باشید",
              url: `${siteUrl}/contact`,
              mainEntity: {
                "@type": "Organization",
                name: "حراج کامپیوتر",
                telephone: "+98-21-45322",
                email: "info@computersales.ir",
                address: {
                  "@type": "PostalAddress",
                  streetAddress:
                    "خیابان ولیعصر تقاطع طالقانی مجتمع نور تهران طبقه همکف سوم واحد 8019",
                  addressLocality: "تهران",
                  addressCountry: "IR",
                },
              },
            }),
          }}
        />
      </Head>
      <div className="pt-6 md:pt-10 md:container md:mx-auto px-6 md:px-0">
        {/* Hero Section */}
        <div className="bg-[#F4F6FA] rounded-2xl py-6 md:py-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <Image
            src={"/assets/icons/contact/contact.svg"}
            alt="contact"
            width={270}
            height={56}
            className="hidden lg:block"
          />
          <Image
            src={"/assets/icons/contact/contact.svg"}
            alt="contact"
            width={189}
            height={40}
            className="block lg:hidden"
          />
          <div className="text-sm lg:text-lg font-semibold px-4 lg:px-0">
            آیا سوالی دارید؟ برای کسب اطلاعات بیشتر با ما در ارتباط باشید و برای
            ما همین حالا بنویسید.
          </div>
          <div className="flex items-center gap-4 pl-6 px-4 lg:pr-0">
            <a
              target="_blank"
              href={"https://instagram.com/computersalesir"}
              className="bg-white w-10 h-10 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center"
            >
              <Image
                src={"/assets/icons/contact/instagram.svg"}
                alt="contact"
                width={ismobile ? 16 : 24}
                height={ismobile ? 16 : 24}
              />
            </a>
            <a
              href="https://t.me/+989120185720"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white w-10 h-10 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center"
            >
              <Image
                src={"/assets/icons/contact/telegram.svg"}
                alt="contact"
                width={ismobile ? 16 : 24}
                height={ismobile ? 16 : 24}
              />
            </a>
            <a
              href="https://wa.me/989120185720"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white w-10 h-10 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center"
            >
              <Image
                src={"/assets/icons/contact/whatsapp.svg"}
                alt="contact"
                width={ismobile ? 16 : 24}
                height={ismobile ? 16 : 24}
              />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 mt-6 md:mt-8 mb-16 md:mb-32 gap-6">
          <div className="border border-[#F4F6FA] rounded-2xl p-6">
            <div className="pb-6 border-b-2 border-dashed border-b-stroke flex items-center gap-2">
              <Image
                src={"/assets/icons/category-menu.svg"}
                alt="shape"
                width={20}
                height={20}
              />
              <span className="lg:text-lg font-bold">اطلاعات تماس</span>
            </div>
            <div>
              <div className="flex items-center justify-between mt-8 mb-8">
                <div className="flex flex-col gap-2">
                  <span className="text-gray-800">شماره تماس</span>
                  <a href="tel:02145322" className="text-sm font-semibold">
                    021-45322
                  </a>
                </div>
                <div className="bg-[#F4F6FA] rounded-2xl w-14 h-14 flex items-center justify-center">
                  <Image
                    src={"/assets/icons/contact/mobile.svg"}
                    alt="phone"
                    width={28}
                    height={28}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mt-8 mb-8">
                <div className="flex flex-col gap-2 flex-1 max-w-[70%]">
                  <span className="text-gray-800">آدرس</span>
                  <span className="text-sm leading-6 lg:leading-7 font-semibold">
                    تهران – خیابان ولیعصر تقاطع طالقانی مجتمع نور تهران طبقه
                    همکف سوم واحد 8019
                  </span>
                </div>
                <div className="bg-[#F4F6FA] rounded-2xl w-14 h-14 flex items-center justify-center">
                  <Image
                    src={"/assets/icons/contact/location.svg"}
                    alt="phone"
                    width={28}
                    height={28}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mt-8 mb-8">
                <div className="flex flex-col gap-2">
                  <span className="text-gray-800">ایمیل</span>
                  <span className="text-sm font-semibold">
                    info@computersales.ir
                  </span>
                </div>
                <div className="bg-[#F4F6FA] rounded-2xl w-14 h-14 flex items-center justify-center">
                  <Image
                    src={"/assets/icons/contact/postbox.svg"}
                    alt="phone"
                    width={28}
                    height={28}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mt-8">
                <div className="flex flex-col gap-2">
                  <span className="text-gray-800">ساعت کاری</span>
                  <span className="text-sm font-semibold">
                    شنبه تا پنجشنبه ۹ الی ۱۸
                  </span>
                </div>
                <div className="bg-[#F4F6FA] rounded-2xl w-14 h-14 flex items-center justify-center">
                  <Image
                    src={"/assets/icons/contact/circle-clock.svg"}
                    alt="phone"
                    width={28}
                    height={28}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-2 items-center">
              <div className="w-14 h-14 rounded-full bg-[#E6ECF3] flex items-center justify-center">
                <Image
                  src={"/assets/icons/contact/pin-circle.svg"}
                  alt="pin"
                  width={24}
                  height={24}
                />
              </div>
              <h5 className="lg:text-lg font-bold">ما کجا هستیم؟</h5>
              <span className="text-gray-800 text-sm">مسریابی آسان وراحت</span>
            </div>
            <div className="rounded-2xl overflow-hidden">
              <StaticMap />
            </div>
          </div>
          <div className="border border-[#F4F6FA] rounded-2xl p-6 flex flex-col">
            <div className="pb-6 border-b-2 border-dashed border-b-stroke flex items-center gap-2">
              <Image
                src={"/assets/icons/category-menu.svg"}
                alt="shape"
                width={20}
                height={20}
              />
              <span className="lg:text-lg font-bold">ارسال پیام یا سوال</span>
            </div>
            <div className="flex flex-col gap-4 pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label label="نام و نام خانوادگی" />
                  <InputField
                    value=""
                    onChange={() => {}}
                    placeholder="مثال: محمد محمدی"
                  />
                </div>
                <div>
                  <Label label="شماره همراه" />
                  <InputField
                    value=""
                    onChange={() => {}}
                    placeholder="مثال: 09123456789"
                  />
                </div>
              </div>
              <div>
                <Label label="ایمیل" />
                <InputField
                  value=""
                  onChange={() => {}}
                  placeholder="مثال: example@gmail.com"
                />
              </div>
              <div>
                <Label label="پیام شما" />
                <textarea
                  className="border-none outline-none rounded-xl px-3 text-sm py-3 resize-none bg-input-bg w-full"
                  rows={3}
                  placeholder="مثال: پیام خود را بنویسید"
                />
              </div>
              <Button
                title="ارسال درخواست"
                variant="primary"
                className="px-20 text-sm md:self-start"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

ContactPage.getLayout = function getLayout(page: ReactElement) {
  return <SiteLayout>{page}</SiteLayout>;
};

export default ContactPage;
