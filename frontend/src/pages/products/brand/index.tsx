import SiteLayout from "@/components/site/layout/Layout";
import { ssrBrandService } from "@/services/ssr/brand.service";
import { Brand } from "@/types/brand";
import { imageBaseUrl } from "@/utils/constants";
import { detectDevice } from "@/utils/detectDevice";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import React, { ReactElement } from "react";

const BrandsPage = ({ brands }: { brands: Brand[] }) => {
  return (
    <div className="lg:container lg:mx-auto px-6 lg:px-0 lg:mt-8 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 mt-6 gap-4 lg:mb-32">
      {brands?.map((brand) => (
        <Link
          href={`/products/brand/${brand.slug}`}
          key={brand.id}
          className="border-1.5 border-stroke rounded-xl flex flex-col overflow-hidden"
        >
          <div className="w-full h-20">
            <Image
              src={`${imageBaseUrl}/${brand.image.name}`}
              alt={brand.name}
              width={500}
              height={100}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="p-6 flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold">{brand.name}</span>
            </div>
            <div className="bg-[#F5F7F8] flex items-center gap-2 px-2 py-1.5 rounded-lg">
              <Image
                src={"/assets/icons/brand-arrow.svg"}
                alt="arrow"
                width={16}
                height={16}
              />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BrandsPage;

BrandsPage.getLayout = function getLayout(page: ReactElement, props: any) {
  return (
    <SiteLayout
      breadcrumb={[
        { title: "صفحه اصلی", href: "/" },
        { title: "برندها", href: "" },
      ]}
    >
      {page}
    </SiteLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { isMobileSSR } = detectDevice(context);

  try {
    const brand = await ssrBrandService.getBrands(1, 300);

    return {
      props: {
        isMobileSSR,
        brands: brand?.data,
      },
    };
  } catch (error) {
    console.error("Error fetching products:", error);

    // Return fallback data on error
    return {
      props: {
        isMobileSSR,
        brand: undefined,
      },
    };
  }
};
