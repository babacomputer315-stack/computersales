import EmblaCarousel from "@/components/site/EmblaCarousel/EmblaCarousel";
import SiteLayout from "@/components/site/layout/Layout";
import { useIsMobile } from "@/hooks/useIsMobile";
import Image from "next/image";
import React, { ReactElement } from "react";
import Head from "next/head";
import { siteUrl } from "@/utils/constants";

const AboutUsPage = () => {
  const isMobile = useIsMobile();

  return (
    <>
      <Head>
        <title>درباره ما - حراج کامپیوتر</title>
        <meta
          key="description"
          name="description"
          content="حراج کامپیوتر فروشگاهی تخصصی در زمینه قطعات سخت‌افزاری، سیستم‌های آماده و تجهیزات جانبی کامپیوتر"
        />
        <link key="canonical" rel="canonical" href={`${siteUrl}/about-us`} />

        {/* Open Graph Meta Tags */}
        <meta key="og:type" property="og:type" content="website" />
        <meta
          key="og:title"
          property="og:title"
          content="درباره ما - حراج کامپیوتر"
        />
        <meta
          key="og:description"
          property="og:description"
          content="حراج کامپیوتر فروشگاهی تخصصی در زمینه قطعات سخت‌افزاری، سیستم‌های آماده و تجهیزات جانبی کامپیوتر"
        />
        <meta property="og:url" content={`${siteUrl}/about-us`} />

        {/* Twitter Card Meta Tags */}
        <meta
          key="twitter:card"
          name="twitter:card"
          content="summary_large_image"
        />
        <meta
          key="twitter:title"
          name="twitter:title"
          content="درباره ما - حراج کامپیوتر"
        />
        <meta
          key="twitter:description"
          name="twitter:description"
          content="حراج کامپیوتر فروشگاهی تخصصی در زمینه قطعات سخت‌افزاری، سیستم‌های آماده و تجهیزات جانبی کامپیوتر"
        />

        {/* Structured Data - AboutPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AboutPage",
              name: "درباره ما - حراج کامپیوتر",
              description:
                "حراج کامپیوتر فروشگاهی تخصصی در زمینه قطعات سخت‌افزاری، سیستم‌های آماده و تجهیزات جانبی کامپیوتر",
              url: `${siteUrl}/about-us`,
              mainEntity: {
                "@type": "Organization",
                name: "حراج کامپیوتر",
                url: siteUrl,
              },
            }),
          }}
        />
      </Head>
      <div className="lg:container lg:mx-auto pb-32">
        <div className="px-6 lg:px-0">
          <div className="bg-[#F5F5F7] rounded-b-3xl lg:p-10 p-5 relative !pb-64">
            <h1 className="lg:text-xl font-bold mb-2 lg:mb-4 lg:text-center">
              درباره <span className="text-primary">حراج کامپیوتر</span>
            </h1>
            <p className="leading-8 lg:text-center">
              حراج کامپیوتر فروشگاهی تخصصی در زمینه قطعات سخت‌افزاری، سیستم‌های
              آماده و تجهیزات جانبی کامپیوتر است. ما تلاش می‌کنیم با ارائه
              محصولات اورجینال، قیمت‌های رقابتی و پشتیبانی حرفه‌ای، تجربه‌ای
              متفاوت از خرید آنلاین را برای شما فراهم کنیم.تمامی کالاهای ما
              دارای ضمانت اصالت، گارانتی معتبر شرکتی و امکان بازگشت تا ۷ روز
              هستند. تیم ما پیش از ارسال هر سیستم، آن را به‌صورت کامل اسمبل و
              تست می‌کند تا محصولی آماده به کار به دست شما برسددر حراج کامپیوتر،
              ما فقط نمی‌فروشیم؛ بلکه راهنمای انتخاب شما هستیم.
            </p>
            <div className="flex items-center lg:justify-center justify-between lg:gap-20 mt-10">
              <div className="flex flex-col">
                <div className="flex items-center gap-1 font-bold text-3xl">
                  <span>200</span>
                  <span className="text-primary">+</span>
                </div>
                <span className="text-gray-800 text-sm">محصول متنوع</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 font-bold text-3xl">
                  <span>400</span>
                  <span className="text-primary">+</span>
                </div>
                <span className="text-gray-800 text-sm">مشتری راضی</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 font-bold text-3xl">
                  <span>50,000</span>
                  <span className="text-primary">+</span>
                </div>
                <span className="text-gray-800 text-sm">سفارش در ماه</span>
              </div>
            </div>

            <div className="absolute -bottom-32 lg:-bottom-52 lg:left-0 lg:right-0 left-6 right-6 flex items-center justify-center">
              <Image
                src="/assets/images/about-us.png"
                alt="about-us"
                width={isMobile ? 500 : 1000}
                height={isMobile ? 1000 : 1000}
                className={
                  isMobile ? "aspect-square object-cover rounded-2xl" : ""
                }
              />
            </div>
          </div>
          <div className="mt-44 lg:mt-64 flex flex-col items-center gap-3">
            <h2 className="lg:text-3xl text-xl font-bold">
              چرا <span className="text-primary">حراج کامپیوتر</span> بهترین
              انتخاب شماست ؟
            </h2>
            <span className="text-gray-800 text-center text-sm">
              گیمر ها چه نظری درباره خدمات، سرعت تحویل و پشتیبانی حراج کامپیوتر
              دارند !
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-10">
            <div className="bg-[#F4F6FA] rounded-2xl p-6">
              <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center">
                <Image
                  src="/assets/icons/about/delivery-success.svg"
                  alt="about-us"
                  width={28}
                  height={28}
                />
              </div>
              <h3 className="text-lg mt-3 mb-2 font-bold">ارسال سریع و امن</h3>
              <p className="text-gray-800 text-sm leading-6">
                تمامی محصولات ما از نظر کیفیت مورد بررسی قرار گرفته و با ضمانت
                اصالت ارائه می‌شوند.
              </p>
            </div>
            <div className="bg-[#F4F6FA] rounded-2xl p-6">
              <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center">
                <Image
                  src="/assets/icons/about/shield-verify.svg"
                  alt="shield-verify"
                  width={28}
                  height={28}
                />
              </div>
              <h3 className="text-lg mt-3 mb-2 font-bold">ضمانت اصالت کالا</h3>
              <p className="text-gray-800 text-sm leading-6">
                تمامی محصولات ما از نظر کیفیت مورد بررسی قرار گرفته و با ضمانت
                اصالت ارائه می‌شوند.
              </p>
            </div>
            <div className="bg-[#F4F6FA] rounded-2xl p-6">
              <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center">
                <Image
                  src="/assets/icons/about/coin-stack.svg"
                  alt="coin-stack"
                  width={28}
                  height={28}
                />
              </div>
              <h3 className="text-lg mt-3 mb-2 font-bold">قیمت رقابتی</h3>
              <p className="text-gray-800 text-sm leading-6">
                قیمت‌های ما به‌طور مداوم با قیمت‌های رقابتی موجود مقایسه می‌شود
                تا بهترین قیمت را برای شما پیشنهاد دهیم.
              </p>
            </div>
            <div className="bg-[#F4F6FA] rounded-2xl p-6">
              <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center">
                <Image
                  src="/assets/icons/about/wrench.svg"
                  alt="about-us"
                  width={28}
                  height={28}
                />
              </div>
              <h3 className="text-lg mt-3 mb-2 font-bold">
                اسمبل و تست رایگان
              </h3>
              <p className="text-gray-800 text-sm leading-6">
                تیم ما پیش از ارسال هر سیستم، آن را به‌صورت کامل اسمبل و تست
                می‌کند تا محصولی آماده به کار به دست شما برسد
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#F4F6FA] rounded-3xl relative mt-40 pt-32 lg:pt-24">
          <div className="bg-secondary-900 rounded-3xl py-8 px-6 flex flex-col lg:flex-row gap-6 lg:items-center justify-between absolute -top-24 lg:-top-14 lg:left-20 lg:right-20 left-6 right-6">
            <div className="flex items-center gap-4">
              <Image
                src="/assets/icons/about/bill.svg"
                alt="bill"
                width={56}
                height={56}
              />
              <h3 className="text-white font-bold text-xl">
                سوالی دارید؟ همین حالا بپرسید!
              </h3>
            </div>
            <div className="bg-primary rounded-xl h-12 flex items-center justify-center gap-2 px-8 cursor-pointer">
              <Image
                src="/assets/icons/about/headphones.svg"
                alt="play-button"
                width={24}
                height={24}
              />
              <span className="text-white font-bold">ارتباط با پشتیبانی</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-primary text-sm">
              نظرات مشتریان، چراغ راه ماست
            </span>
            <h2 className="lg:text-2xl text-xl font-bold text-center">
              <span className="text-primary">با اعتماد شما</span>، مسیرمان
              همواره روشن‌تر می‌شود
            </h2>
          </div>
          <div className="mt-10 lg:px-20 px-6">
            <EmblaCarousel
              slides={Array.from({ length: 4 }).map((a, i) => (
                <div
                  key={i}
                  className={`mt-6 ${i % 2 === 0 ? "" : "lg:pt-10"} lg:mt-10`}
                >
                  <div key={i} className={`bg-white rounded-3xl p-6 relative`}>
                    <Image
                      src={
                        i % 2 === 0
                          ? "/assets/icons/about/qoute-primary.svg"
                          : "/assets/icons/about/qoute.svg"
                      }
                      alt="star"
                      width={46}
                      height={46}
                      className="absolute -top-6 left-6"
                    />
                    <div className="flex items-center gap-2">
                      <Image
                        src="/assets/icons/about/avatar.svg"
                        alt="avatar"
                        width={48}
                        height={48}
                      />
                      <div className="flex flex-col gap-1">
                        <h5 className="font-bold text-sm">محمد محمدی</h5>
                        <span className="text-xs text-gray-800">
                          25 اسفند 1404
                        </span>
                      </div>
                    </div>
                    <div className="leading-7 mt-4">
                      اولین خریدم بود و نگران بودم، ولی بسته‌بندی حرفه‌ای و
                      ارسال سریعشون منو غافلگیر کرد. حتماً دوباره خرید می‌کنم.
                    </div>
                  </div>
                </div>
              ))}
              slideSize={isMobile ? "90%" : "33.33%"}
              dotClassName="mt-10"
              withControls={false}
              withDots
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUsPage;

AboutUsPage.getLayout = function getLayout(page: ReactElement) {
  return <SiteLayout>{page}</SiteLayout>;
};
