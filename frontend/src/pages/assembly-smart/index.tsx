import Header from "@/components/site/layout/Header";
import SiteLayout from "@/components/site/layout/Layout";
import Card from "@/components/site/shared/Card";
// import SelectProductAssembleModal from "@/components/site/shared/Modal/SelectProductAssemble";
import { useIsMobile } from "@/hooks/useIsMobile";
import Image from "next/image";
import React, { ReactElement, useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { Product } from "@/services/user/product.service";
import { imageBaseUrl, siteUrl } from "@/utils/constants";
import { formatNumber } from "@/utils/formatNumber";
import { categorySpecificationService } from "@/services/user/categorySpecification.service";
import Button from "@/components/site/shared/Button";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/router";
import Head from "next/head";
const SelectProductAssembleModal = dynamic(
  () => import("@/components/site/shared/Modal/SelectProductAssemble"),
  {
    ssr: false,
  }
);

const AssemblySmartPage = () => {
  const isMobile = useIsMobile();

  const cpuAndMotherboardSpecificationName = "پشتیبانی سوکت پردازنده";
  const ramSpecificationName = "نوع حافظه";
  const fanAndMotherboardSpecificationName = "پشتیبانی سوکت پردازنده";
  const motherboardAndGraphicsCardSpecificationName = "رابط  اتصال گرافیک";
  const graphicsCardSpecificationName = "رابط اتصال";

  const [isTechnicalService, setIsTechnicalService] = useState(false);

  const [openSelectProductAssembleModal, setOpenSelectProductAssembleModal] =
    useState(false);

  const [motherboardOptionId, setMotherboardOptionId] = useState<number | null>(
    null
  );
  const [ramOptionId, setRamOptionId] = useState<number | null>(null);
  const [fanOptionId, setFanOptionId] = useState<number | null>(null);
  const [graphicsCardOptionIds, setGraphicsCardOptionIds] = useState<number[]>(
    []
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [selectedProducts, setSelectedProducts] = useState<
    {
      categoryId: number;
      products: Product[];
    }[]
  >([]);

  const { addToCart, clearCart } = useCart();

  // Categories that can have multiple products (up to 4)
  const multipleProductCategories = [41, 40, 72, 71]; // RAM, Graphics Card, HDD, SSD
  const maxProductsPerCategory = 4;

  const systemParts = [
    {
      id: 1,
      name: "پردازده (CPU)",
      slug: "cpu",
      icon: "/assets/icons/assemble/chipset.svg",
      categoryId: 39,
    },
    {
      id: 2,
      name: "مادربرد",
      slug: "motherboard",
      icon: "/assets/icons/assemble/chipset.svg",
      categoryId: 38,
    },
    {
      id: 3,
      name: "حافظه رم",
      slug: "ram",
      icon: "/assets/icons/assemble/chipset.svg",
      categoryId: 41,
    },
    {
      id: 3,
      name: "خنک‌ کننده",
      slug: "cooler",
      icon: "/assets/icons/assemble/chipset.svg",
      categoryId: 44,
    },
    {
      id: 4,
      name: "کارت گرافیک",
      slug: "graphics-card",
      icon: "/assets/icons/assemble/chipset.svg",
      categoryId: 40,
    },
    {
      id: 5,
      name: "ذخیره ساز (HDD)",
      slug: "hdd",
      icon: "/assets/icons/assemble/chipset.svg",
      categoryId: 72,
    },
    {
      id: 6,
      name: "ذخیره ساز (SSD)",
      slug: "ssd",
      icon: "/assets/icons/assemble/chipset.svg",
      categoryId: 71,
    },
    {
      id: 7,
      name: "درایو نوری",
      slug: "optical-drive",
      icon: "/assets/icons/assemble/chipset.svg",
      categoryId: 115,
    },
    {
      id: 8,
      name: "کیس",
      slug: "case",
      icon: "/assets/icons/assemble/chipset.svg",
      categoryId: 46,
    },
    {
      id: 9,
      name: "پاور",
      slug: "power-supply",
      icon: "/assets/icons/assemble/chipset.svg",
      categoryId: 45,
    },
  ];

  const handleSelectProduct = async (product: Product) => {
    if (selectedCategoryId === 39) {
      const selectedProductSpecification = product.specifications?.find(
        (item) => item.specification.name === cpuAndMotherboardSpecificationName
      );

      const specs =
        await categorySpecificationService.getCategorySpecifications(38);

      specs.data
        .find((item) => item.name === cpuAndMotherboardSpecificationName)
        ?.options?.find((item) => {
          if (
            selectedProductSpecification?.option?.value?.toLowerCase() ===
              item.value?.toLowerCase() ||
            selectedProductSpecification?.option?.value?.toLowerCase() ===
              item.label?.toLowerCase() ||
            selectedProductSpecification?.selectedOptions?.find(
              (option) =>
                option.option.value?.toLowerCase() ===
                  item.value?.toLowerCase() ||
                option.option.label?.toLowerCase() === item.label?.toLowerCase()
            )
          ) {
            setMotherboardOptionId(item.id);
            return true;
          }
        });
    }

    if (selectedCategoryId === 38) {
      const selectedProductSpecification = product.specifications?.find(
        (item) => item.specification.name === ramSpecificationName
      );

      const specs =
        await categorySpecificationService.getCategorySpecifications(41);

      specs.data
        .find((item) => item.name === ramSpecificationName)
        ?.options?.find((item) => {
          if (
            selectedProductSpecification?.option?.value?.toLowerCase() ===
              item.value?.toLowerCase() ||
            selectedProductSpecification?.option?.value?.toLowerCase() ===
              item.label?.toLowerCase() ||
            selectedProductSpecification?.selectedOptions?.find(
              (option) =>
                option.option.value?.toLowerCase() ===
                  item.value?.toLowerCase() ||
                option.option.label?.toLowerCase() === item.label?.toLowerCase()
            )
          ) {
            setRamOptionId(item.id);
            return true;
          }
        });
    }

    if (selectedCategoryId === 38) {
      const selectedProductSpecification = product.specifications?.find(
        (item) => item.specification.name === fanAndMotherboardSpecificationName
      );

      const specs =
        await categorySpecificationService.getCategorySpecifications(44);

      specs.data
        .find((item) => item.name === fanAndMotherboardSpecificationName)
        ?.options?.find((item) => {
          if (
            selectedProductSpecification?.option?.value?.toLowerCase() ===
              item.value?.toLowerCase() ||
            selectedProductSpecification?.option?.value?.toLowerCase() ===
              item.label?.toLowerCase() ||
            selectedProductSpecification?.selectedOptions?.find(
              (option) =>
                option.option.value?.toLowerCase() ===
                  item.value?.toLowerCase() ||
                option.option.label?.toLowerCase() === item.label?.toLowerCase()
            )
          ) {
            setFanOptionId(item.id);
            return true;
          }
        });
    }

    if (selectedCategoryId === 38) {
      const selectedProductSpecification = product.specifications?.find(
        (item) =>
          item.specification.name ===
          motherboardAndGraphicsCardSpecificationName
      );

      const specs =
        await categorySpecificationService.getCategorySpecifications(40);

      let optionIds: number[] = [];

      specs.data
        .find((item) => item.name === graphicsCardSpecificationName)
        ?.options?.find((item) => {
          if (
            selectedProductSpecification?.option?.value?.toLowerCase() ===
              item.value?.replace("-", " ")?.toLowerCase() ||
            selectedProductSpecification?.option?.value?.toLowerCase() ===
              item.label?.replace("-", " ")?.toLowerCase() ||
            selectedProductSpecification?.selectedOptions?.find(
              (option) =>
                option.option.value?.replace("-", " ")?.toLowerCase() ===
                  item.value?.replace("-", " ")?.toLowerCase() ||
                option.option.label?.replace("-", " ")?.toLowerCase() ===
                  item.label?.replace("-", " ")?.toLowerCase()
            )
          ) {
            optionIds.push(item.id);
          }
        });
      setGraphicsCardOptionIds(optionIds);
    }

    // Check if this category can have multiple products
    const canHaveMultiple =
      multipleProductCategories.includes(selectedCategoryId);
    const existingCategory = selectedProducts.find(
      (item) => item.categoryId === selectedCategoryId
    );

    if (canHaveMultiple && existingCategory) {
      // Check if product already exists
      const productExists = existingCategory.products.some(
        (p) => p.id === product.id
      );

      if (productExists) {
        // Product already added, don't add again
        toast.error("این محصول قبلا اضافه شده است");
        setOpenSelectProductAssembleModal(false);
        return;
      }

      // Check if we've reached the limit
      if (existingCategory.products.length >= maxProductsPerCategory) {
        // Reached limit, don't add more
        toast.error(
          `حداکثر ${maxProductsPerCategory} محصول می‌توانید اضافه کنید`
        );
        setOpenSelectProductAssembleModal(false);
        return;
      }

      // Add to existing products
      setSelectedProducts((prev) =>
        prev.map((item) =>
          item.categoryId === selectedCategoryId
            ? { ...item, products: [...item.products, product] }
            : item
        )
      );
      toast.success("محصول با موفقیت اضافه شد");
    } else if (canHaveMultiple && !existingCategory) {
      // First product for this category
      setSelectedProducts((prev) => [
        ...prev,
        { categoryId: selectedCategoryId, products: [product] },
      ]);
      toast.success("محصول با موفقیت اضافه شد");
    } else {
      // Single product category - replace
      setSelectedProducts((prev) => [
        ...prev.filter((item) => item.categoryId !== selectedCategoryId),
        { categoryId: selectedCategoryId, products: [product] },
      ]);
      toast.success("محصول با موفقیت انتخاب شد");
    }

    setOpenSelectProductAssembleModal(false);
  };

  const totalPrice = selectedProducts.reduce((acc, product) => {
    return (
      acc +
      product.products.reduce((acc, product) => {
        return (
          acc +
          (product.salePrice
            ? product.salePrice
            : product.regularPrice
            ? product.regularPrice
            : product.variations?.[0]?.price ?? 0)
        );
      }, 0)
    );
  }, 0);

  const deleteProduct = (categoryId: number, productId: number) => {
    setSelectedProducts(
      (prev) =>
        prev
          .map((item) =>
            item.categoryId === categoryId
              ? {
                  ...item,
                  products: item.products.filter(
                    (product) => product.id !== productId
                  ),
                }
              : item
          )
          .filter((item) => item.products.length > 0) // Remove empty categories
    );
  };

  const router = useRouter();

  const handleSubmitOrder = () => {
    clearCart();
    const assembleAmount = isTechnicalService ? (totalPrice * 3) / 100 : 0;
    if (assembleAmount > 0) {
      addToCart({
        id: 0,
        name: "هزینه اسمبل",
        price: assembleAmount,
        quantity: 1,
        image: "",
        category: "",
        isSinglePurchase: true,
        purchaseLimit: 0,
      });
    }

    selectedProducts.forEach((product) => {
      product.products.forEach((product) => {
        addToCart({
          id: product.id,
          name: product.name,
          price: product.salePrice
            ? product.salePrice
            : product.regularPrice
            ? product.regularPrice
            : product.variations?.[0]?.price ?? 0,
          quantity: 1,
          image: product.images?.[0]?.file?.name || "",
          category: product.categories?.[0]?.category?.name || "",
          isSinglePurchase: product.isSinglePurchase,
          purchaseLimit: product.purchaseLimit,
        });
      });
    });
    router.push("/cart");
  };

  return (
    <>
      <Head>
        <title>اسمبل هوشمند - حراج کامپیوتر</title>
        <meta
          key="description"
          name="description"
          content="قطعات را خودتان انتخاب کنید، ما آن را دقیقاً مطابق انتخابتان اسمبل می‌کنیم"
        />
        <link
          key="canonical"
          rel="canonical"
          href={`${siteUrl}/assembly-smart`}
        />

        {/* Open Graph Meta Tags */}
        <meta key="og:type" property="og:type" content="website" />
        <meta
          key="og:title"
          property="og:title"
          content="اسمبل هوشمند - حراج کامپیوتر"
        />
        <meta
          key="og:description"
          property="og:description"
          content="قطعات را خودتان انتخاب کنید، ما آن را دقیقاً مطابق انتخابتان اسمبل می‌کنیم"
        />
        <meta property="og:url" content={`${siteUrl}/assembly-smart`} />

        {/* Twitter Card Meta Tags */}
        <meta
          key="twitter:card"
          name="twitter:card"
          content="summary_large_image"
        />
        <meta
          key="twitter:title"
          name="twitter:title"
          content="اسمبل هوشمند - حراج کامپیوتر"
        />
        <meta
          key="twitter:description"
          name="twitter:description"
          content="قطعات را خودتان انتخاب کنید، ما آن را دقیقاً مطابق انتخابتان اسمبل می‌کنیم"
        />
      </Head>
      <div className="site mb-32">
        {!isMobile ? <Header /> : null}
        <div className="px-6 lg:px-0 lg:pt-6 pt-6 border-b border-b-stroke pb-6 flex lg:hidden">
          <Link
            href={"/"}
            className="bg-[#F4F6FA] flex items-center py-3 px-4 gap-2 rounded-lg"
          >
            <Image
              src={"/assets/icons/back.svg"}
              alt="arrow-right"
              width={20}
              height={20}
            />
            <p className="text-sm font-semibold text-center">اسمبل هوشمند</p>
          </Link>
        </div>
        <div className="lg:container lg:mx-auto px-6 lg:px-0 lg:pt-10">
          <div className="bg-[#F4F6FA] rounded-2xl py-10 grid-cols-[1fr_2fr_1fr] items-center hidden lg:grid">
            <Image
              src={"/assets/icons/assemble/smart-assemble.svg"}
              alt="assembly-smart"
              width={213}
              height={56}
            />
            <h1 className="lg:text-lg font-semibold text-center">
              قطعات را خودتان انتخاب کنید، ما آن را دقیقاً مطابق انتخابتان اسمبل
              می‌کنیم.
            </h1>
            <div />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 lg:mt-10 mt-6 items-start">
            <Card header="انتخاب قطعات" icon="/assets/icons/category-menu.svg">
              <div className="flex flex-col gap-4">
                {systemParts?.map((part) => {
                  const categoryProducts = selectedProducts.find(
                    (item) => item.categoryId === part.categoryId
                  );
                  const isMultipleCategory = multipleProductCategories.includes(
                    part.categoryId
                  );
                  const hasReachedLimit =
                    isMultipleCategory &&
                    categoryProducts &&
                    categoryProducts.products.length >= maxProductsPerCategory;
                  const canAddMore =
                    !hasReachedLimit &&
                    (!categoryProducts ||
                      categoryProducts.products.length <
                        maxProductsPerCategory ||
                      isMultipleCategory);

                  return (
                    <div
                      key={part.id}
                      className={`bg-[#F4F6FA] rounded-xl p-4 ${
                        canAddMore
                          ? "cursor-pointer"
                          : "cursor-not-allowed opacity-60"
                      }`}
                      onClick={() => {
                        if (canAddMore) {
                          setSelectedCategoryId(part.categoryId);
                          setTimeout(() => {
                            setOpenSelectProductAssembleModal(true);
                          }, 500);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Image
                            src={part.icon}
                            alt="icon"
                            width={28}
                            height={28}
                          />
                          <div className="w-0.5 h-4 bg-stroke" />
                          <span className="font-semibold text-sm">
                            {part.name}
                          </span>
                        </div>
                        {hasReachedLimit ? (
                          <div className="text-xs text-secondary-text bg-white px-3 py-2 rounded-lg">
                            حداکثر
                          </div>
                        ) : (
                          <Image
                            src={"/assets/icons/assemble/plus.svg"}
                            alt="icon"
                            width={36}
                            height={36}
                          />
                        )}
                      </div>
                      {selectedProducts.find(
                        (item) => item.categoryId === part.categoryId
                      )?.products.length ? (
                        <div className="mt-4 relative flex flex-col gap-3">
                          {selectedProducts
                            .find((item) => item.categoryId === part.categoryId)
                            ?.products.map((product, index) => (
                              <div
                                key={product.id}
                                className="bg-white rounded-xl overflow-hidden p-4 flex items-center gap-4"
                              >
                                {multipleProductCategories.includes(
                                  part.categoryId
                                ) && (
                                  <div className="flex items-center justify-center bg-primary text-white rounded-full w-6 h-6 text-xs font-semibold">
                                    {index + 1}
                                  </div>
                                )}
                                <Image
                                  src={`${imageBaseUrl}/${
                                    product.images?.find(
                                      (img) => img.isThumbnail
                                    )?.file.name
                                  }`}
                                  alt={product.name}
                                  width={isMobile ? 64 : 80}
                                  height={isMobile ? 64 : 80}
                                />
                                <div className="flex-1 flex flex-col gap-4">
                                  <h4 className="text-sm leading-6 lg:text-base">
                                    {product.name}
                                  </h4>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <span>
                                        {formatNumber(
                                          product.salePrice
                                            ? product.salePrice
                                            : product.regularPrice
                                            ? product.regularPrice
                                            : product.variations?.[0]?.price ??
                                              0
                                        )}
                                      </span>{" "}
                                      <span className="text-xs text-secondary-text">
                                        تومان
                                      </span>
                                    </div>
                                    <div
                                      className="cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        deleteProduct(
                                          part.categoryId,
                                          product.id
                                        );
                                      }}
                                    >
                                      <Image
                                        src={"/assets/icons/assemble/trash.svg"}
                                        alt="icon"
                                        width={24}
                                        height={24}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          {multipleProductCategories.includes(
                            part.categoryId
                          ) &&
                            selectedProducts.find(
                              (item) => item.categoryId === part.categoryId
                            )?.products.length! < maxProductsPerCategory && (
                              <div className="text-center text-xs text-secondary-text mt-1">
                                می‌توانید تا {maxProductsPerCategory} محصول
                                اضافه کنید (
                                {selectedProducts.find(
                                  (item) => item.categoryId === part.categoryId
                                )?.products.length || 0}
                                /{maxProductsPerCategory})
                              </div>
                            )}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </Card>
            <div className="sticky top-28 hidden lg:block">
              <Card header="سیستم شما" icon="/assets/icons/category-menu.svg">
                {selectedProducts?.length ? (
                  <>
                    <div>
                      {selectedProducts.map((product) => (
                        <div
                          key={product.categoryId}
                          className="mt-4 last:border-b-0 border-b border-stroke"
                        >
                          {product.products.map((product) => (
                            <div
                              key={product.id}
                              className="flex gap-4 py-4 first:pt-0 last:border-b-0 border-b border-stroke"
                            >
                              <div className="aspect-square">
                                <Image
                                  src={`${imageBaseUrl}/${
                                    product.images?.find(
                                      (img) => img.isThumbnail
                                    )?.file.name
                                  }`}
                                  alt={product.name}
                                  width={80}
                                  height={80}
                                />
                              </div>
                              <div className="flex-1 flex flex-col justify-around">
                                <p className="text-sm leading-6">
                                  {product.name}
                                </p>
                                <div>
                                  <span>
                                    {formatNumber(
                                      product.salePrice
                                        ? product.salePrice
                                        : product.regularPrice
                                        ? product.regularPrice
                                        : product.variations?.[0]?.price ?? 0
                                    )}
                                  </span>{" "}
                                  <span className="text-xs text-secondary-text">
                                    تومان
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border border-stroke rounded-xl">
                      <div className="flex items-center gap-4">
                        <Image
                          src={"/assets/icons/assemble/assemble.svg"}
                          alt="icon"
                          width={48}
                          height={48}
                        />
                        <div className="flex-1 flex flex-col gap-2">
                          <h4 className="text-[#0099FF] font-semibold text-sm">
                            خدمات فنی
                          </h4>
                          <p className="text-xs">
                            تمایل دارید سیستم شما توسط کارشناسان حراج کامپیوتر
                            اسمبل شود؟
                          </p>
                        </div>
                      </div>
                      <div className="bg-[#F4F6FA] rounded-lg p-3 flex items-center justify-between mt-4">
                        <span>هزینه اسمبل</span>
                        <div>
                          <span className="font-semibold">
                            {formatNumber((totalPrice * 3) / 100)}
                          </span>{" "}
                          <span className="text-xs text-secondary-text">
                            تومان
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <div
                          className={`border rounded-lg flex items-center gap-2 p-2.5 flex-1 cursor-pointer ${
                            isTechnicalService
                              ? "border-primary"
                              : "border-stroke"
                          }`}
                          onClick={() => setIsTechnicalService(true)}
                        >
                          <Image
                            src={
                              isTechnicalService
                                ? "/assets/icons/assemble/checkbox-fill.svg"
                                : "/assets/icons/assemble/checkbox.svg"
                            }
                            alt="icon"
                            width={16}
                            height={16}
                          />
                          <span className="text-sm">بله، اسمبل شود</span>
                        </div>
                        <div
                          className={`border rounded-lg flex items-center gap-2 p-2.5 flex-1 cursor-pointer ${
                            !isTechnicalService
                              ? "border-primary"
                              : "border-stroke"
                          }`}
                          onClick={() => setIsTechnicalService(false)}
                        >
                          <Image
                            src={
                              !isTechnicalService
                                ? "/assets/icons/assemble/checkbox-fill.svg"
                                : "/assets/icons/assemble/checkbox.svg"
                            }
                            alt="icon"
                            width={16}
                            height={16}
                          />
                          <span className="text-sm">خیر، نیازی نیست</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 border-dashed border-stroke pt-6 border-t-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">جمع کل:</span>
                        <span>
                          <span className="font-semibold text-xl">
                            {isTechnicalService
                              ? formatNumber(
                                  totalPrice + (totalPrice * 3) / 100
                                )
                              : formatNumber(totalPrice)}
                          </span>{" "}
                          <span className="text-sm text-secondary-text mr-0.5">
                            تومان
                          </span>
                        </span>
                      </div>
                    </div>
                    <Button
                      title="ثبت سفارش"
                      onClick={handleSubmitOrder}
                      className="w-full mt-6"
                    />
                  </>
                ) : (
                  <h2>هنوز قطعه‌ای انتخاب نشده !</h2>
                )}
              </Card>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 px-6 lg:hidden bg-white py-4">
          {selectedProducts?.length ? (
            <>
              <div className="p-4 border border-stroke rounded-xl">
                <div className="flex items-center gap-4">
                  <Image
                    src={"/assets/icons/assemble/assemble.svg"}
                    alt="icon"
                    width={40}
                    height={40}
                  />
                  <div className="flex-1 flex flex-col gap-2">
                    <h4 className="text-[#0099FF] font-semibold text-sm">
                      خدمات فنی
                    </h4>
                  </div>
                </div>
                <div className="bg-[#F4F6FA] rounded-lg p-3 flex items-center justify-between mt-4">
                  <span>هزینه اسمبل</span>
                  <div>
                    <span className="font-semibold">
                      {formatNumber((totalPrice * 3) / 100)}
                    </span>{" "}
                    <span className="text-xs text-secondary-text">تومان</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <div
                    className={`border rounded-lg flex items-center gap-2 p-2.5 flex-1 cursor-pointer ${
                      isTechnicalService ? "border-primary" : "border-stroke"
                    }`}
                    onClick={() => setIsTechnicalService(true)}
                  >
                    <Image
                      src={
                        isTechnicalService
                          ? "/assets/icons/assemble/checkbox-fill.svg"
                          : "/assets/icons/assemble/checkbox.svg"
                      }
                      alt="icon"
                      width={16}
                      height={16}
                    />
                    <span className="text-sm">بله، اسمبل شود</span>
                  </div>
                  <div
                    className={`border rounded-lg flex items-center gap-2 p-2.5 flex-1 cursor-pointer ${
                      !isTechnicalService ? "border-primary" : "border-stroke"
                    }`}
                    onClick={() => setIsTechnicalService(false)}
                  >
                    <Image
                      src={
                        !isTechnicalService
                          ? "/assets/icons/assemble/checkbox-fill.svg"
                          : "/assets/icons/assemble/checkbox.svg"
                      }
                      alt="icon"
                      width={16}
                      height={16}
                    />
                    <span className="text-sm">خیر، نیازی نیست</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 border-dashed border-stroke pt-6 border-t-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">جمع کل:</span>
                  <span>
                    <span className="font-semibold text-xl">
                      {isTechnicalService
                        ? formatNumber(totalPrice + (totalPrice * 3) / 100)
                        : formatNumber(totalPrice)}
                    </span>{" "}
                    <span className="text-sm text-secondary-text mr-0.5">
                      تومان
                    </span>
                  </span>
                </div>
              </div>
              <Button
                title="ثبت سفارش"
                onClick={handleSubmitOrder}
                className="w-full mt-6"
              />
            </>
          ) : (
            <h2></h2>
          )}
        </div>
      </div>
      <SelectProductAssembleModal
        open={openSelectProductAssembleModal}
        setOpen={setOpenSelectProductAssembleModal}
        categoryId={selectedCategoryId}
        onSelectProduct={handleSelectProduct}
        motherboardOptionId={motherboardOptionId}
        ramOptionId={ramOptionId}
        fanOptionId={fanOptionId}
        graphicsCardOptionIds={graphicsCardOptionIds}
      />
    </>
  );
};

export default AssemblySmartPage;
