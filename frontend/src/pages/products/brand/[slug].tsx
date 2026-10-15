import SiteLayout from "@/components/site/layout/Layout";
import ProductItem from "@/components/site/products/ProductItem";
import Pagination from "@/components/site/shared/Pagination";
import Switch from "@/components/site/shared/Switch";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useProductFilters } from "@/hooks/useProductFilters";
import { useProductSort } from "@/hooks/useProductSort";
import { detectDevice } from "@/utils/detectDevice";
import { formatNumber } from "@/utils/formatNumber";
import dynamic from "next/dynamic";
import {
  ssrProductService,
  SSRProductFilters,
} from "@/services/ssr/product.service";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { ReactElement, useState } from "react";
import { parseProductFilters } from "@/utils/urlHelpers";
import { CategorySpecificationWithOptions } from "@/services/ssr/category.service";
import Breadcrumb from "@/components/site/shared/Breadcrumb";
import Head from "next/head";
import { Category } from "@/services/user/product.service";
import { ssrBrandService } from "@/services/ssr/brand.service";
import { Brand } from "@/types/brand";
import { imageBaseUrl, siteUrl } from "@/utils/constants";
const ProductPriceRangeModal = dynamic(
  () => import("@/components/site/shared/Modal/ProductPriceRangeModal"),
  {
    ssr: false,
  }
);
const ProductSortModal = dynamic(
  () => import("@/components/site/shared/Modal/ProductSortModal"),
  {
    ssr: false,
  }
);

interface ProductsPageProps {
  isMobileSSR: boolean;
  products: any[];
  brand: Brand;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: SSRProductFilters;
  productsMinPrice: number;
  productsMaxPrice: number;
  categorySpecifications: CategorySpecificationWithOptions[];
  category: Category;
}

const ProductsPage = ({
  isMobileSSR,
  products,
  pagination,
  productsMinPrice,
  productsMaxPrice,
  brand,
}: ProductsPageProps) => {
  const isMobile = useIsMobile(isMobileSSR);

  // Use the new filter and sort hooks
  const {
    filters: filterState,
    currentPage,
    toggleStockFilter,
    changePage,
    clearAllFilters,
  } = useProductFilters(undefined, "", brand?.slug);

  const { sortOptions, applySort, isSortActive } = useProductSort();

  const [openPriceRangeModal, setOpenPriceRangeModal] = useState(false);
  const [openSortModal, setOpenSortModal] = useState(false);

  return (
    <>
      <Head>
        <title>{`حراج کامپیوتر - ${brand?.name}`}</title>
        <meta
          key="description"
          name="description"
          content={`محصولات ${brand?.name} - خرید انواع محصولات ${brand?.name} با گارانتی معتبر`}
        />
        <link
          key="canonical"
          rel="canonical"
          href={`${siteUrl}/products/brand/${brand?.slug}`}
        />

        {/* Open Graph Meta Tags */}
        <meta key="og:type" property="og:type" content="website" />
        <meta
          key="og:title"
          property="og:title"
          content={`حراج کامپیوتر - ${brand?.name}`}
        />
        <meta
          key="og:description"
          property="og:description"
          content={`محصولات ${brand?.name} - خرید انواع محصولات ${brand?.name} با گارانتی معتبر`}
        />
        <meta
          property="og:url"
          content={`${siteUrl}/products/brand/${brand?.slug}`}
        />
        {brand?.image?.name && (
          <meta
            key="og:image"
            property="og:image"
            content={`${imageBaseUrl}/${brand.image.name}`}
          />
        )}

        {/* Twitter Card Meta Tags */}
        <meta
          key="twitter:card"
          name="twitter:card"
          content="summary_large_image"
        />
        <meta
          key="twitter:title"
          name="twitter:title"
          content={`حراج کامپیوتر - ${brand?.name}`}
        />
        <meta
          key="twitter:description"
          name="twitter:description"
          content={`محصولات ${brand?.name} - خرید انواع محصولات ${brand?.name} با گارانتی معتبر`}
        />
        {brand?.image?.name && (
          <meta
            key="twitter:image"
            name="twitter:image"
            content={`${imageBaseUrl}/${brand.image.name}`}
          />
        )}
      </Head>
      <Breadcrumb
        items={[
          { title: "صفحه اصلی", href: "/" },
          { title: brand.name, href: "" },
        ]}
      />
      {productsMinPrice > 0 && productsMaxPrice > 0 && (
        <ProductPriceRangeModal
          productsMinPrice={productsMinPrice}
          productsMaxPrice={productsMaxPrice}
          open={openPriceRangeModal}
          setOpen={setOpenPriceRangeModal}
          brandSlug={brand.slug}
        />
      )}
      <ProductSortModal open={openSortModal} setOpen={setOpenSortModal} />
      <div className="container mx-auto grid px-6 md:px-0 mt-6 md:mt-8 lg:grid-cols-[1fr_3fr] mb-16 md:mb-32 gap-6 items-start">
        <div className="flex items-center gap-3 overflow-x-auto hidden-scrollbar pl-1 md:hidden">
          <div
            onClick={() => setOpenSortModal(true)}
            className="border min-w-fit border-stroke flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer"
          >
            <span>مرتب سازی</span>
            <Image
              src={"/assets/icons/chevron-left.svg"}
              className="-rotate-90"
              width={20}
              height={20}
              alt="arrow"
            />
          </div>
          <div className="border min-w-fit border-stroke flex items-center gap-2 px-4 py-2 rounded-lg">
            <span>کالا های موجود</span>
            <Switch
              value={filterState.inStock === true}
              onChange={(value) => toggleStockFilter(value ? true : null)}
            />
          </div>
          <div
            onClick={() => setOpenPriceRangeModal(true)}
            className="border min-w-fit border-stroke flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer"
          >
            <span>بازه قیمتی</span>
            {(filterState.minPrice !== null ||
              filterState.maxPrice !== null) && (
              <span className="text-xs bg-secondary text-white px-2 py-1 rounded-full">
                فعال
              </span>
            )}
            <Image
              src={"/assets/icons/chevron-left.svg"}
              className="-rotate-90"
              width={20}
              height={20}
              alt="arrow"
            />
          </div>
        </div>

        {/* Desktop filters */}
        <div className="hidden md:flex flex-col border border-stroke rounded-lg">
          <div className="bg-[#F4F6FA] px-4 py-6 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Image
                src={"/assets/icons/filter.svg"}
                width={24}
                height={24}
                alt="arrow"
              />
              <span className="font-noora text-sm">
                <span className="font-semibold">فیلتر</span> محصولات
              </span>
            </div>
            <div
              className="text-danger font-medium text-sm cursor-pointer"
              onClick={clearAllFilters}
            >
              <span>حذف فیلترها</span>
            </div>
          </div>
          <div className="flex-col flex">
            <div className="border-b border-b-stroke hidden md:flex px-4 py-6 justify-between gap-4">
              <span className="font-semibold text-sm">
                نمایش کالا های موجود
              </span>
              <Switch
                value={filterState.inStock === true}
                onChange={(value) => toggleStockFilter(value ? true : null)}
              />
            </div>
            <div
              onClick={() => setOpenPriceRangeModal(true)}
              className={`hidden md:flex px-4 py-6 justify-between gap-4 cursor-pointer ${
                filterState.minPrice !== null || filterState.maxPrice !== null
                  ? "border-secondary bg-secondary/5"
                  : "border-stroke"
              }`}
            >
              <span className="font-semibold text-sm">بازه قیمتی</span>
              <div className="flex items-center gap-2">
                {(filterState.minPrice !== null ||
                  filterState.maxPrice !== null) && (
                  <span className="text-xs bg-secondary text-white px-2 py-1 rounded-full">
                    فعال
                  </span>
                )}
                <Image
                  src={"/assets/icons/chevron-left.svg"}
                  width={20}
                  height={20}
                  alt="arrow"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="hidden md:flex justify-between border-b border-b-stroke items-center">
            <div className="py-6">
              <div className="flex items-center gap-2">
                <Image
                  src={"/assets/icons/sort-desc.svg"}
                  width={20}
                  height={20}
                  alt="arrow"
                />
                <span className="font-medium">مرتب سازی:</span>
              </div>
            </div>
            <div className="flex-1 flex items-center select-none pr-5">
              {sortOptions.map((option, index) => (
                <div
                  onClick={() => applySort(option)}
                  key={option.value}
                  className={`h-full flex items-center relative ${
                    isSortActive(option.value)
                      ? "text-secondary font-medium"
                      : ""
                  }`}
                >
                  <span
                    className={`cursor-pointer text-sm relative h-full flex items-center`}
                  >
                    {option.label}
                    {isSortActive(option.value) && (
                      <div className="absolute bottom-0 bg-secondary h-1 w-full rounded-t-full" />
                    )}
                  </span>
                  {index !== sortOptions.length - 1 && (
                    <span className="text-stroke mx-4">|</span>
                  )}
                </div>
              ))}
            </div>
            <div className="py-4 text-sm">
              {formatNumber(pagination.total)} محصول موجود است
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  discount={
                    !!product.salePrice &&
                    product.salePrice < product.regularPrice
                  }
                  isMobile={isMobile}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-secondary-text text-lg font-medium">
                  محصولی یافت نشد
                </div>
                <div className="text-secondary-text text-sm mt-2">
                  لطفاً فیلترهای خود را تغییر دهید
                </div>
              </div>
            )}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.pages}
            onPageChange={changePage}
          />
        </div>
      </div>
    </>
  );
};

export default ProductsPage;

ProductsPage.getLayout = function getLayout(page: ReactElement, props: any) {
  return <SiteLayout>{page}</SiteLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { isMobileSSR } = detectDevice(context);

  try {
    // Parse query parameters using utility function
    const filters = parseProductFilters(context.query);

    const slug = context?.query?.slug as string;

    const brand = await ssrBrandService.getBrandBySlug(slug);

    if (!brand.data) {
      return {
        props: {},
        redirect: {
          destination: "/404",
        },
      };
    }

    const { products: productsResponse } = await ssrProductService.batchFetch({
      ...filters,
      brandId: brand?.data?.id || 0,
      sortBy:
        filters.sortBy === "most-visited" ||
        filters.sortBy === "most-sold" ||
        filters.sortBy === "most-discount"
          ? "createdAt"
          : (filters.sortBy as "name" | "price" | "createdAt" | "regularPrice"),
    });

    return {
      props: {
        isMobileSSR,
        products: productsResponse?.data?.data || [],
        productsMinPrice: productsResponse?.data?.productsMinPrice || 0,
        productsMaxPrice: productsResponse?.data?.productsMaxPrice || 0,
        pagination: productsResponse?.meta || {
          page: 1,
          limit: 20,
          total: 0,
          pages: 0,
        },
        filters,
        brand: brand?.data,
      },
    };
  } catch (error) {
    return {
      props: {},
      redirect: {
        destination: "/404",
      },
    };
  }
};
