import EmblaCarousel from "@/components/site/EmblaCarousel/EmblaCarousel";
import SiteLayout from "@/components/site/layout/Layout";
import StoreBenefits from "@/components/site/layout/StoreBenefits";
import ProductFavoriteButton from "@/components/site/products/ProductFavoriteButton";
import ProductTabs from "@/components/site/products/ProductTabs";
import SaleTimer from "@/components/site/products/SaleTimer";
import Breadcrumb from "@/components/site/shared/Breadcrumb";
import Button from "@/components/site/shared/Button";
import AddToCartModal from "@/components/site/shared/Modal/AddToCartModal";
import { useCart } from "@/context/CartContext";
import { ssrProductService } from "@/services/ssr/product.service";
import { Product } from "@/types/product";
import { imageBaseUrl, siteUrl } from "@/utils/constants";
import { formatNumber } from "@/utils/formatNumber";
import { GetServerSideProps } from "next";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import Head from "next/head";
import dynamic from "next/dynamic";
import Link from "next/link";
import ProductVariationsModal from "@/components/site/shared/Modal/ProductVariationsModal";

const ZoomImage = dynamic(() => import("@/components/site/shared/ZoomImage"), {
  ssr: false,
});

const ProductPage = ({ product }: { product: Product }) => {
  const variations = product.variations;

  const warranties = useMemo(() => {
    const unique = new Map();
    variations.forEach((variation) => {
      const warrantyAttr = variation.attributeValues.find(
        (av) => av.attributeValue.attribute.slug === "warranty"
      );
      if (warrantyAttr) {
        unique.set(warrantyAttr.attributeValue.id, {
          id: warrantyAttr.attributeValue.id,
          name: warrantyAttr.attributeValue.value,
          slug: warrantyAttr.attributeValue.slug,
          colorCode: warrantyAttr.attributeValue.colorCode,
          fileId: warrantyAttr.attributeValue.fileId,
          file: warrantyAttr.attributeValue.file,
        });
      }
    });
    return Array.from(unique.values());
  }, [variations]);

  const [selectedWarranty, setSelectedWarranty] = useState(warranties[0]?.id);

  const [openProductVariationsModal, setOpenProductVariationsModal] =
    useState(false);

  const activeVariant = useMemo(() => {
    return variations.find((v) => {
      const hasWarranty =
        warranties.length === 0 ||
        v.attributeValues.some(
          (av) =>
            av.attributeValue.attribute.slug === "warranty" &&
            av.attributeValue.id === selectedWarranty
        );

      return hasWarranty;
    });
  }, [variations, selectedWarranty, warranties.length]);

  const regularPrice = useMemo(() => {
    return activeVariant
      ? activeVariant.price || product.regularPrice
      : product.regularPrice;
  }, [activeVariant, product.regularPrice]);

  const salePrice = useMemo(() => {
    return activeVariant ? activeVariant.salePrice : product.salePrice;
  }, [activeVariant, product.salePrice]);

  const hasDiscount = salePrice && salePrice < regularPrice;

  const discountPercentage =
    hasDiscount && salePrice
      ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
      : 0;

  const getCarouselImages = (
    product: Product,
    activeVariant?: Product["variations"][0]
  ) => {
    const hasVariantImage = activeVariant?.imageFile;

    const firstImage = hasVariantImage
      ? { id: "active", file: activeVariant.imageFile }
      : product.images.find((i) => i.isThumbnail);

    const restImages = product.images.filter((img) => {
      if (hasVariantImage) return !img.isThumbnail;
      return img.id !== firstImage?.id;
    });

    return [firstImage, ...restImages].filter(Boolean);
  };

  const carouselImages = getCarouselImages(product, activeVariant);

  const [lastCartItem, setLastCartItem] = useState<any>(null);

  const { addToCart, cart } = useCart();

  const handleAddToCart = () => {
    // Check if item already exists in cart (by id and variant)
    const existingItem = cart.find(
      (item) =>
        item.id === product.id &&
        ((!activeVariant && !item.variant) ||
          (activeVariant && item.variant?.id === activeVariant.id))
    );

    if (existingItem) {
      toast.error("محصول قبلا به سبد خرید اضافه شده است");
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: regularPrice,
      salePrice: salePrice || undefined,
      quantity: 1,
      image: product.images?.[0]?.file?.name || "",
      category:
        product.categories.find((c) => c.isPrimary)?.category?.name || "",
      variant: activeVariant
        ? {
            id: activeVariant.id,
            purchaseLimit: product.purchaseLimit,
            attributeValues: activeVariant.attributeValues,
          }
        : undefined,
      isSinglePurchase: product.isSinglePurchase,
      purchaseLimit: product.purchaseLimit,
    };

    addToCart(cartItem);
    setLastCartItem(cartItem);
    setOpenAddToCartModal(true);
  };

  const [openAddToCartModal, setOpenAddToCartModal] = useState(false);

  let metaTagPrice: string | number = "";
  let metaTagOldPrice: string | number | undefined = undefined;
  let metaTagAvailability: string = "";
  let metaTagGuarantee: string = "";

  if (product?.variations && product?.variations?.length > 0) {
    const validVariations = product?.variations?.filter(
      (v) => v?.price || v?.salePrice
    );
    if (validVariations?.length === 0) {
      metaTagPrice = product?.salePrice ?? product?.regularPrice ?? 0;
      metaTagAvailability =
        product?.stockStatus === "instock" ? "instock" : "outofstock";
    } else {
      const variationWithLowestPrice = validVariations?.reduce((min, v) => {
        const vPrice = v?.salePrice ?? v?.price ?? Infinity;
        const minPrice = min?.salePrice ?? min?.price ?? Infinity;
        return vPrice < minPrice ? v : min;
      });

      metaTagPrice =
        variationWithLowestPrice?.salePrice ?? variationWithLowestPrice?.price;
      metaTagOldPrice =
        variationWithLowestPrice?.salePrice &&
        variationWithLowestPrice?.salePrice <
          (variationWithLowestPrice?.price ?? Infinity)
          ? variationWithLowestPrice?.price
          : undefined;
      metaTagAvailability =
        variationWithLowestPrice?.stockStatus === "instock"
          ? "instock"
          : "outofstock";
      metaTagGuarantee =
        variationWithLowestPrice?.attributeValues?.find(
          (v) => v?.attributeValue?.attribute?.slug === "warranty"
        )?.attributeValue?.value || "";
    }
  } else {
    metaTagPrice = product?.salePrice ?? product?.regularPrice;
    metaTagOldPrice =
      product?.salePrice &&
      product?.salePrice < (product?.regularPrice ?? Infinity)
        ? product?.regularPrice
        : undefined;
    metaTagAvailability =
      product?.stockStatus === "instock" ? "instock" : "outofstock";
  }

  // console.log(product.specifications[product.specifications.length - 1].selectedOptions);

  return (
    <>
      <Head>
        <title>{`${product?.seoTitle || product?.name} - حراج کامپیوتر`}</title>
        <meta
          key="description"
          name="description"
          content={product?.seoDescription || product?.name}
        />

        <link
          key="canonical"
          rel="canonical"
          href={`${siteUrl}/products/${product?.slug}`}
        />

        <meta name="product_id" content={product?.id?.toString()} />
        <meta name="product_name" content={product?.name} />

        {/* تصویر اصلی (در اولویت تصویر variation) */}
        <meta
          key="og:image"
          property="og:image"
          content={`${imageBaseUrl}/${
            product?.images?.find((i) => i?.isThumbnail)?.file?.name
          }`}
        />

        {/* قیمت‌ها */}
        <meta name="product_price" content={metaTagPrice?.toString()} />

        <meta
          name="product_old_price"
          content={metaTagOldPrice?.toString() || ""}
        />

        {/* وضعیت موجودی */}
        <meta name="availability" content={metaTagAvailability} />

        <meta name="guarantee" content={metaTagGuarantee} />

        {/* Open Graph Meta Tags for Facebook, LinkedIn, WhatsApp */}
        <meta key="og:type" property="og:type" content="product" />
        <meta
          key="og:title"
          property="og:title"
          content={`${product?.seoTitle || product?.name} - حراج کامپیوتر`}
        />
        <meta
          key="og:description"
          property="og:description"
          content={product?.seoDescription || product?.name}
        />
        <meta
          property="og:url"
          content={`${siteUrl}/products/${product.slug}`}
        />
        <meta
          key="og:site_name"
          property="og:site_name"
          content="حراج کامپیوتر"
        />
        <meta key="og:locale" property="og:locale" content="fa_IR" />

        {/* Product specific Open Graph tags */}
        <meta
          property="product:price:amount"
          content={metaTagPrice?.toString()}
        />
        <meta property="product:price:currency" content="IRR" />
        {metaTagOldPrice && (
          <meta
            property="product:price:standard_amount"
            content={metaTagOldPrice?.toString()}
          />
        )}
        <meta
          property="product:availability"
          content={
            metaTagAvailability === "instock" ? "in stock" : "out of stock"
          }
        />
        {product?.brand?.name && (
          <meta property="product:brand" content={product.brand.name} />
        )}
        {product?.categories?.find((c) => c?.isPrimary)?.category?.name && (
          <meta
            property="product:category"
            content={
              product.categories.find((c) => c.isPrimary)?.category?.name || ""
            }
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
          content={`${product?.seoTitle || product?.name} - حراج کامپیوتر`}
        />
        <meta
          key="twitter:description"
          name="twitter:description"
          content={product?.seoDescription || product?.name}
        />
        <meta
          key="twitter:image"
          name="twitter:image"
          content={`${imageBaseUrl}/${
            product?.images?.find((i) => i?.isThumbnail)?.file?.name
          }`}
        />
        <meta
          key="twitter:image:alt"
          name="twitter:image:alt"
          content={product?.name}
        />

        {/* Additional images for social media */}
        {product?.images
          ?.filter((img) => !img.isThumbnail)
          ?.slice(0, 3)
          ?.map((img, index) => (
            <meta
              key={index}
              property="og:image"
              content={`${imageBaseUrl}/${img?.file?.name}`}
            />
          ))}

        {/* Structured Data - Product */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              name: product.name,
              image: [
                `${imageBaseUrl}/${
                  activeVariant?.imageFile?.name ||
                  product.images?.find((i) => i.isThumbnail)?.file?.name ||
                  "default.jpg"
                }`,
                ...product.images
                  .filter((img) => !img.isThumbnail)
                  .slice(0, 3)
                  .map((img) => `${imageBaseUrl}/${img.file.name}`),
              ],
              description: product.shortDescription?.replace(/<[^>]*>?/g, ""),
              sku: product.sku || product.id,
              brand: {
                "@type": "Brand",
                name: product.brand?.name || "Generic",
              },
              category: product.categories.find((c) => c.isPrimary)?.category
                ?.name,
              offers: {
                "@type": "Offer",
                priceCurrency: "IRR",
                price: Number(
                  hasDiscount && salePrice ? salePrice : regularPrice
                ),
                priceValidUntil: product.saleEndDate || undefined,
                availability:
                  activeVariant?.stockStatus === "instock"
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
                url: `${siteUrl}/products/${product.slug}`,
                seller: {
                  "@type": "Organization",
                  name: "حراج کامپیوتر",
                },
              },
            }),
          }}
        />

        {/* Structured Data - BreadcrumbList */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "صفحه اصلی",
                  item: siteUrl,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: product.name,
                  item: `${siteUrl}/products/${product.slug}`,
                },
              ],
            }),
          }}
        />
      </Head>
      <AddToCartModal
        open={openAddToCartModal}
        setOpen={setOpenAddToCartModal}
        item={lastCartItem}
      />
      <div className="items-center justify-between container mx-auto hidden lg:flex">
        <Breadcrumb
          items={[
            { title: "صفحه اصلی", href: "/" },
            { title: product.name, href: "" },
          ]}
        />
        <div className="mt-8 w-96 flex justify-end gap-4">
          <Link
            href={`/products/brand/${product.brand?.slug}`}
            className="text-xs font-semibold items-center px-3 py-2 gap-1 flex border border-stroke rounded-lg"
          >
            {product?.brand?.image?.name && (
              <img
                src={`${imageBaseUrl}/${product.brand?.image?.name}`}
                alt={product.brand?.name || ""}
                className="w-14 h-5 object-cover"
              />
            )}
            <span className="mt-0.5">{product.brand?.name}</span>
          </Link>
          <Link
            href={`/products/category/${
              product?.categories?.find((c) => c?.isPrimary)?.category?.slug
            }`}
            title={
              product?.categories?.find((c) => c?.isPrimary)?.category?.name
            }
            className="border items-center justify-center flex border-stroke rounded-lg px-4 py-2 text-xs font-semibold"
          >
            {product?.categories?.find((c) => c?.isPrimary)?.category?.name}
          </Link>
        </div>
      </div>
      <div className="lg:container mx-auto px-6 lg:px-0 mt-6 md:mt-6 mb-16 md:mb-32 select-none">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_2fr] xl:grid-cols-[6fr_2fr] gap-6 items-start">
          <div className="lg:border lg:border-stroke lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-6 rounded-3xl">
            <div className="aspect-square w-full h-full border border-stroke rounded-2xl relative">
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <ProductFavoriteButton product={product} />
                <Link
                  href={`/compare/${product.slug}`}
                  className="bg-[#F4F6FA] w-12 h-12 rounded-xl flex items-center justify-center flex-col gap-3 cursor-pointer"
                >
                  <Image
                    src={"/assets/icons/compare.svg"}
                    alt="compare"
                    width={20}
                    height={20}
                  />
                </Link>
              </div>
              <EmblaCarousel
                slides={carouselImages.map((image) => (
                  <div
                    className="aspect-square rounded-2xl overflow-hidden"
                    key={image?.id}
                  >
                    <ZoomImage
                      src={`${imageBaseUrl}/${image?.file?.name}`}
                      // alt={image?.file?.alt || "product"}
                      width={500}
                      height={500}
                      className="object-contain w-full h-full"
                    />
                  </div>
                ))}
                withControls={false}
                withDots
                dotClassName="absolute md:-bottom-8 -bottom-4 md:right-8 right-4 md:left-8 left-4 items-center gap-3 !p-0"
                dotRender={(index, selected, onClick) => (
                  <button
                    className={`aspect-square rounded-lg bg-white border flex-1 border-stroke max-w-8 lg:max-w-16 ${
                      selected ? "!border-primary" : ""
                    }`}
                    onClick={onClick}
                  >
                    <Image
                      src={`${imageBaseUrl}/${carouselImages[index]?.file.name}`}
                      alt={carouselImages[index]?.file?.alt || "product"}
                      width={100}
                      height={100}
                      className="object-contain rounded-lg w-full h-full"
                    />
                  </button>
                )}
              />
            </div>
            {/* <div className="block md:hidden">
              <h1 className="font-noora text-lg font-bold">{product.name}</h1>
            </div> */}
            <div className="flex flex-col">
              <div>
                <h1 className="text-2xl leading-10 font-bold font-peydaEn mb-2">
                  {product.name}
                </h1>
                <h5 className="text-sm text-gray-800 font-peydaEn">
                  {product?.nameEn || product.name}
                </h5>
                <div className="my-4 lg:my-6 flex items-center text-sm font-medium gap-10">
                  <div className="flex items-center gap-1 mt-1">
                    <span>شناسه محصول:</span>
                    <span>{product.sku}</span>
                  </div>
                  {/* <div className="flex items-center">
                    <span>20 نظر ثبت شده</span>
                  </div> */}
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3.5">
                <Image
                  src={"/assets/icons/category-menu.svg"}
                  alt="category"
                  width={12}
                  height={12}
                />
                <span className="text-sm font-bold">مشخصات محصول</span>
              </div>
              {product.specifications.length ? (
                <div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {product.specifications
                      .filter((spec) => spec.specification.type === "select")
                      .map(
                        (spec, i) =>
                          i < 6 && (
                            <div
                              key={i}
                              className="border-1.5 border-stroke rounded-lg p-3 flex flex-col gap-2"
                            >
                              <span className="text-secondary-text text-sm line-clamp-1">
                                {spec.specification.name}
                              </span>
                              <span className="text-sm font-medium line-clamp-1">
                                {spec.specification.type === "text"
                                  ? spec.value
                                  : spec?.option?.value}
                              </span>
                            </div>
                          )
                      )}
                  </div>
                  <div className="flex items-center gap-2 mt-4 mb-5">
                    <div className="flex-1 h-[1px] bg-stroke" />
                    <div className="flex items-center gap-1">
                      <div
                        onClick={() => {
                          const element = document.getElementById("specs");
                          if (element) {
                            element.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }
                        }}
                        className="font-medium text-primary text-sm cursor-pointer select-none"
                      >
                        مشاهده همه مشخصات
                      </div>
                    </div>
                  </div>
                  <div className="flex lg:hidden flex-col gap-3 pb-6 border-b border-b-stroke mb-6">
                    <div className="flex items-center gap-2">
                      <Image
                        src={"/assets/icons/category-menu.svg"}
                        alt="category"
                        width={12}
                        height={12}
                      />
                      <span className="text-sm font-bold">نوع گارانتی</span>
                    </div>
                    <div
                      onClick={() => setOpenProductVariationsModal(true)}
                      className="bg-[#E6ECF3] text-[#023F88] py-3.5 px-3 rounded-lg cursor-pointer hover:bg-[#d5dce5] transition-colors"
                    >
                      <span className="font-semibold text-sm">
                        {activeVariant
                          ? activeVariant.attributeValues.find(
                              (av) =>
                                av.attributeValue.attribute.slug === "warranty"
                            )?.attributeValue.value ||
                            "گارانتی محصول را انتخاب کنید"
                          : "گارانتی محصول را انتخاب کنید"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3.5">
                    <Image
                      src={"/assets/icons/category-menu.svg"}
                      alt="category"
                      width={12}
                      height={12}
                    />
                    <span className="text-sm font-bold">توضیحات محصول</span>
                  </div>
                  <div
                    className="text-sm leading-7"
                    dangerouslySetInnerHTML={{
                      __html: product?.shortDescription
                        ? product?.shortDescription
                            ?.substring(0, 250)
                            .replace(/<[^>]*>?/g, "") + "..."
                        : "",
                    }}
                  />
                  <div className="block lg:hidden">
                    <div className="mt-4 flex gap-4">
                      <div className="text-xs font-semibold items-center px-3 py-2 gap-1 flex border border-stroke rounded-lg">
                        {product?.brand?.image?.name && (
                          <img
                            src={`${imageBaseUrl}/${product.brand?.image?.name}`}
                            alt={product.brand?.name || ""}
                            className="w-14 h-5 object-cover"
                          />
                        )}
                        <span className="mt-0.5">{product.brand?.name}</span>
                      </div>
                      <Link
                        href={`/products/category/${
                          product.categories.find((c) => c.isPrimary)?.category
                            ?.slug
                        }`}
                        title={
                          product.categories.find((c) => c.isPrimary)?.category
                            ?.name
                        }
                        className="border items-center justify-center flex border-stroke rounded-lg px-4 py-2 text-xs font-semibold"
                      >
                        {
                          product?.categories?.find((c) => c?.isPrimary)
                            ?.category?.name
                        }
                      </Link>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex-col hidden md:flex sticky top-24">
            {hasDiscount ? (
              <div className="bg-primary min-h-16 p-5 pb-8 rounded-t-3xl flex items-center justify-between -mb-4">
                <div className="flex items-center gap-2">
                  <Image
                    src={`/assets/icons/discount-red.svg`}
                    alt="sale"
                    width={24}
                    height={24}
                    className="object-cover rounded-full"
                  />
                  <span className="font-semibold text-white">فروش ویژه</span>
                </div>
                {product.saleStartDate &&
                product.saleEndDate &&
                new Date(product.saleStartDate).getTime() < Date.now() &&
                new Date(product.saleEndDate).getTime() > Date.now() ? (
                  <SaleTimer
                    saleStartDate={product.saleStartDate}
                    saleEndDate={product.saleEndDate}
                  />
                ) : null}
              </div>
            ) : null}
            <div className="bg-[#F4F6FA] p-6 rounded-2xl flex flex-col min-h-[450px]">
              <div className="flex-1">
                {warranties.length ? (
                  <div className="bg-white p-3 rounded-lg border border-stroke mb-2">
                    <div className="border-b border-b-stroke pb-3 flex items-center gap-2">
                      <Image
                        src={"/assets/icons/shield-verify.svg"}
                        alt="warranty"
                        width={20}
                        height={20}
                      />
                      <span className="font-semibold text-sm">نوع گارانتی</span>
                    </div>
                    {warranties.length
                      ? warranties.map((warranty) => (
                          <div
                            onClick={() => setSelectedWarranty(warranty.id)}
                            key={warranty.id}
                            className="py-3 flex items-center gap-2 border-b-2 last:border-b-0 last:pb-0 text-sm text-gray-800 border-dashed border-b-stroke"
                          >
                            <Image
                              src={
                                selectedWarranty === warranty.id
                                  ? "/assets/icons/secondary-checkbox-active.svg"
                                  : "/assets/icons/secondary-checkbox.svg"
                              }
                              alt="checkbox"
                              width={18}
                              height={18}
                            />
                            <span>{warranty.name}</span>
                          </div>
                        ))
                      : null}
                  </div>
                ) : null}
                <div className="border bg-white mb-2 text-sm font-semibold p-3 border-stroke flex items-center gap-2 rounded-lg">
                  <Image
                    src={"/assets/icons/truck-deliver.svg"}
                    alt="truck"
                    width={20}
                    height={20}
                  />
                  <span>تحویل اکسپرس و سریع کالا</span>
                </div>
                {product.showStock ? (
                  <div className="border bg-white p-3 border-stroke flex items-center gap-2 rounded-lg text-sm font-semibold">
                    <Image
                      src={"/assets/icons/box-deliverd.svg"}
                      alt="box"
                      width={20}
                      height={20}
                    />
                    <span>{product.stockQuantity} موجودی در انبار</span>
                  </div>
                ) : null}
              </div>
              <div>
                {regularPrice ? (
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-bold text-base">قیمت پرداختی:</div>
                    <div>
                      {hasDiscount ? (
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-800 line-through">
                            {formatNumber(regularPrice)}
                          </span>
                          <span className="bg-primary text-white rounded-tl-md rounded-bl-md rounded-tr-3xl py-0.5 text-sm rounded-br-3xl px-3">
                            {discountPercentage}%
                          </span>
                        </div>
                      ) : null}
                      <div className="flex justify-end gap-2 mt-1 items-center">
                        <span className="font-bold text-xl">
                          {formatNumber(salePrice ? salePrice : regularPrice)}
                        </span>
                        <span className="text-sm text-gray-800">تومان</span>
                      </div>
                    </div>
                  </div>
                ) : null}
                {regularPrice ? (
                  <Button
                    onClick={handleAddToCart}
                    title="افزودن به سبد خرید"
                    className="w-full"
                  />
                ) : (
                  <Button
                    href="tel:02145322"
                    link
                    title="تماس بگیرید"
                    className="w-full"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="block lg:hidden mt-6 border border-stroke rounded-lg p-5">
          <div className="border-b border-b-slate-200 pb-4 text-sm flex items-center justify-between">
            <span>
              <span className="text-secondary font-medium">۷ روز</span> ضمانت
              بازگشت بی قید و شرط
            </span>
            <Image
              src={`/assets/icons/shield.svg`}
              alt="shield"
              width={24}
              height={24}
            />
          </div>
          <div className="border-b border-b-slate-200 py-4 text-sm flex items-center justify-between">
            <span>
              ارسال تا <span className="text-secondary font-medium">۴ روز</span>{" "}
              کاری آینده
            </span>
            <Image
              src={`/assets/icons/truck-black.svg`}
              alt="truck"
              width={24}
              height={24}
            />
          </div>
          <div className="pt-3 text-sm flex items-center justify-between">
            <span>
              <span className="text-secondary font-medium">
                {product.stockQuantity}
              </span>{" "}
              موجودی در انبار
            </span>
            <Image
              src={`/assets/icons/package-black.svg`}
              alt="package"
              width={24}
              height={24}
            />
          </div>
        </div>

        <StoreBenefits className="my-16 border-t border-b border-dashed pt-8 border-t-stroke border-b-stroke pb-8 hidden lg:block" />
        <ProductTabs
          handleAddToCart={handleAddToCart}
          product={product}
          activeVariant={activeVariant}
        />
        <div
          className={`fixed lg:hidden left-0 right-0 px-6 bottom-0 bg-white z-50 ${
            regularPrice ? "py-2" : "py-4"
          } border-t border-stroke`}
        >
          {regularPrice ? (
            <div className="flex items-center justify-between my-2">
              <div className="font-bold text-base">قیمت پرداختی:</div>
              <div>
                {hasDiscount ? (
                  <div className="flex items-center gap-3 justify-end">
                    <span className="text-sm text-gray-800 line-through">
                      {formatNumber(regularPrice)}
                    </span>
                    <span className="bg-primary text-white rounded-tl-md rounded-bl-md rounded-tr-3xl py-0.5 text-sm rounded-br-3xl px-3">
                      {discountPercentage}%
                    </span>
                  </div>
                ) : null}
                <div className="flex justify-end gap-2 mt-1 items-center">
                  <span className="font-bold text-xl">
                    {formatNumber(salePrice ? salePrice : regularPrice)}
                  </span>
                  <span className="text-sm text-gray-800">تومان</span>
                </div>
              </div>
            </div>
          ) : null}
          {regularPrice ? (
            <Button
              title="افزودن به سبد خرید"
              className="w-full"
              onClick={handleAddToCart}
            />
          ) : (
            <Button
              title="تماس بگیرید"
              className="w-full"
              href="tel:02145322"
              link
            />
          )}
        </div>
      </div>
      <ProductVariationsModal
        open={openProductVariationsModal}
        setOpen={setOpenProductVariationsModal}
        variations={variations}
        activeVariant={activeVariant}
        onSelectVariation={(variation) => {
          // Find the warranty attribute value in the selected variation
          const warrantyAttr = variation.attributeValues.find(
            (av) => av.attributeValue.attribute.slug === "warranty"
          );

          if (warrantyAttr) {
            setSelectedWarranty(warrantyAttr.attributeValue.id);
          }
        }}
      />
    </>
  );
};

export default ProductPage;

ProductPage.getLayout = (page: React.ReactNode) => {
  return <SiteLayout>{page}</SiteLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const product = await ssrProductService.getProductBySlug(
      context.params?.slug as string
    );
    if (product.success) {
      return {
        props: {
          product: {
            ...product?.data,
            specifications: product?.data?.specifications?.sort(
              (a: any, b: any) => {
                const aIsSelect = a?.specification?.type === "select";
                const bIsSelect = b?.specification?.type === "select";

                // اولویت: select اول باشه
                if (aIsSelect && !bIsSelect) return -1;
                if (!aIsSelect && bIsSelect) return 1;

                // وقتی هر دو تو یه گروه هستن (یا هر دو select یا هر دو غیر select)
                return (a?.order ?? 0) - (b?.order ?? 0);
              }
            ),
          },
        },
      };
    } else {
      return {
        notFound: true,
      };
    }
  } catch (error) {
    console.error("Error fetching products:", error);

    return {
      props: {
        product: null,
      },
    };
  }
};
