import React from "react";
import "@/styles/globals.scss";
import "@/styles/fileManager.scss";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ReactElement, ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import dynamic from "next/dynamic";
import Script from "next/script";
import { siteUrl } from "@/utils/constants";
const NextProgress = dynamic(() => import("next-progress"), {
  ssr: false,
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  React.useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      const register = () => navigator.serviceWorker.register("/sw.js").catch((error) => console.error("PWA service worker registration failed", error));
      window.addEventListener("load", register, { once: true });
      return () => window.removeEventListener("load", register);
    }
  }, []);
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <AuthProvider>
        <CartProvider>
          <Head>
            <title>
              فروشگاه اینترنتی حراج کامپیوتر - سیستم های آماده و اسمبل شده
            </title>
            <meta
              key="description"
              name="description"
              content="فروشگاه اینترنتی حراج کامپیوتر - خرید سیستم های آماده، قطعات کامپیوتر و لپ تاپ با بهترین قیمت و گارانتی معتبر"
            />
            <link rel="manifest" href="/site.webmanifest" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link key="canonical" rel="canonical" href={siteUrl} />

            {/* Open Graph Meta Tags */}
            <meta key="og:type" property="og:type" content="website" />
            <meta
              key="og:title"
              property="og:title"
              content="فروشگاه اینترنتی حراج کامپیوتر - سیستم های آماده و اسمبل شده"
            />
            <meta
              key="og:description"
              property="og:description"
              content="فروشگاه اینترنتی حراج کامپیوتر - خرید سیستم های آماده، قطعات کامپیوتر و لپ تاپ با بهترین قیمت و گارانتی معتبر"
            />
            <meta
              key="og:site_name"
              property="og:site_name"
              content="حراج کامپیوتر"
            />
            <meta key="og:locale" property="og:locale" content="fa_IR" />
            {/* <meta
              property="og:image"
              content={`${siteUrl}/assets/images/logo-full.svg`}
            /> */}

            {/* Twitter Card Meta Tags */}
            <meta
              key="twitter:card"
              name="twitter:card"
              content="summary_large_image"
            />
            <meta
              key="twitter:title"
              name="twitter:title"
              content="فروشگاه اینترنتی حراج کامپیوتر - سیستم های آماده و اسمبل شده"
            />
            <meta
              key="twitter:description"
              name="twitter:description"
              content="فروشگاه اینترنتی حراج کامپیوتر - خرید سیستم های آماده، قطعات کامپیوتر و لپ تاپ با بهترین قیمت و گارانتی معتبر"
            />
            <meta
              key="twitter:image"
              name="twitter:image"
              content={`${siteUrl}/assets/images/logo-full.svg`}
            />
            <meta
              key="twitter:image:alt"
              name="twitter:image:alt"
              content="حراج کامپیوتر"
            />
            <meta
              key="twitter:site"
              name="twitter:site"
              content="@computersales"
            />
            <meta
              key="twitter:creator"
              name="twitter:creator"
              content="@computersales"
            />

            {/* Structured Data - Organization */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Organization",
                  name: "حراج کامپیوتر",
                  url: siteUrl,
                  logo: `${siteUrl}/assets/images/logo-full.svg`,
                  description:
                    "فروشگاه اینترنتی حراج کامپیوتر - خرید سیستم های آماده، قطعات کامپیوتر و لپ تاپ با بهترین قیمت و گارانتی معتبر",
                  contactPoint: {
                    "@type": "ContactPoint",
                    telephone: "+98-21-45322",
                    contactType: "customer service",
                    areaServed: "IR",
                    availableLanguage: "Persian",
                  },
                  sameAs: [
                    "https://instagram.com/computersalesir",
                    "https://t.me/+989120185720",
                  ],
                }),
              }}
            />

            {/* Structured Data - WebSite */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "WebSite",
                  name: "حراج کامپیوتر",
                  url: siteUrl,
                  potentialAction: {
                    "@type": "SearchAction",
                    target: {
                      "@type": "EntryPoint",
                      urlTemplate: `${siteUrl}/products?search={search_term_string}`,
                    },
                    "query-input": "required name=search_term_string",
                  },
                }),
              }}
            />
          </Head>
          {getLayout(
            <>
              <Component {...pageProps} />
              <Toaster containerClassName="text-sm" />
              <NextProgress
                delay={300}
                color="#c4161c"
                options={{ showSpinner: false }}
              />
            </>
          )}
        </CartProvider>
      </AuthProvider>
      <Script
        id="goftino-widget"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
!function(){var i="kRrdQN",a=window,d=document;function g(){var g=d.createElement("script"),s="https://www.goftino.com/widget/"+i,l=localStorage.getItem("goftino_"+i);g.async=!0,g.src=l?s+"?o="+l:s;d.getElementsByTagName("head")[0].appendChild(g);}"complete"===d.readyState?g():a.attachEvent?a.attachEvent("onload",g):a.addEventListener("load",g,!1);}();`,
        }}
      />
    </>
  );
}
