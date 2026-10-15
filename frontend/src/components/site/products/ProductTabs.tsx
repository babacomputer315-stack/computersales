import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Button from "../shared/Button";
import { Product } from "@/types/product";
import { formatNumber } from "@/utils/formatNumber";
import { imageBaseUrl } from "@/utils/constants";
import { useIsMobile } from "@/hooks/useIsMobile";
import AddCommentModal from "../shared/Modal/AddCommentModal";
import ProductsComments from "./ProductsComments";

const tabs = [
  { id: "details", label: "توضیحات تکمیلی" },
  { id: "specs", label: "مشخصات محصول" },
  { id: "reviews", label: "دیدگاه کاربران" },
  // { id: "qa", label: "پرسش و پاسخ" },
  // { id: "faq", label: "سوالات متداول" },
];

export default function ProductTabs({
  product,
  activeVariant,
  handleAddToCart,
}: {
  product: Product;
  activeVariant: any;
  handleAddToCart: () => void;
}) {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const [showSpecs, setShowSpecs] = useState<boolean>(false);

  const [pageLoaded, setPageLoaded] = useState<boolean>(false);

  const [showAddCommentModal, setShowAddCommentModal] =
    useState<boolean>(false);

  const isMobile = useIsMobile(true);

  const hasVariantImage = activeVariant?.imageFile;

  const firstImage = hasVariantImage
    ? { id: "active", file: activeVariant.imageFile }
    : product.images.find((i) => i.isThumbnail);

  useEffect(() => {
    setTimeout(() => {
      setPageLoaded(true);
    }, 1000);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: isMobile ? "0px 0px -20% 0px" : "0px 0px -60% 0px",
      }
    );

    tabs.forEach((tab) => {
      const section = sectionRefs.current[tab.id];
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const handleTabClick = (id: string) => {
    const section = sectionRefs.current[id];
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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

  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    if (tabRefs.current[activeTab] && pageLoaded) {
      tabRefs.current[activeTab]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeTab]);

  return (
    <>
      <div className="w-full lg:border lg:border-stroke rounded-2xl mt-10 lg:mt-0">
        {/* Sticky Tabs */}
        <div className="sticky top-0 lg:top-20 z-20 bg-white lg:bg-[#F4F6FA] lg:rounded-t-2xl border-b border-stroke">
          <div className="flex lg:px-8 lg:gap-12 gap-6 overflow-x-auto hidden-scrollbar">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                ref={(el) => {
                  if (el) {
                    tabRefs.current[tab.id] = el;
                  }
                }}
                onClick={() => handleTabClick(tab.id)}
                className={`py-6 transition-colors relative whitespace-nowrap ${
                  activeTab === tab.id
                    ? "font-semibold text-sm lg:text-lg"
                    : "text-secondary-text text-sm lg:text-base"
                }`}
              >
                {tab.label}
                {activeTab === tab.id ? (
                  <span className="absolute left-0 right-0 h-1.5 bg-secondary bottom-0 rounded-t-full" />
                ) : null}
              </button>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="lg:p-8 grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-6 items-start pt-8">
          <div>
            <section
              className="scroll-mt-[180px]"
              id="details"
              ref={(el) => {
                sectionRefs.current.details = el;
              }}
            >
              <div className="flex items-center gap-2">
                <Image
                  src="/assets/icons/arrow-left.png"
                  alt="arrow-left"
                  width={24}
                  height={24}
                />
                <h2 className="text-sm lg:text-lg font-bold font-noora">
                  توضیحات محصول
                </h2>
              </div>
              <div className="text-sm mt-3">
                <div
                  className="leading-8"
                  dangerouslySetInnerHTML={{ __html: product?.htmlDescription }}
                ></div>
              </div>
            </section>

            <div className="w-full h-1 bg-stroke my-8" />

            <section
              className="scroll-mt-[180px]"
              id="specs"
              ref={(el) => {
                sectionRefs.current.specs = el;
              }}
            >
              <div className="flex items-center gap-2">
                <Image
                  src="/assets/icons/arrow-left.png"
                  alt="arrow-left"
                  width={24}
                  height={24}
                />
                <h2 className="text-sm lg:text-lg font-bold font-noora">
                  مشخصات محصول
                </h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                {product.specifications.map(
                  (spec, i) => (
                    // showSpecs ? (
                    <div
                      className={`${!showSpecs && i >= 6 ? "hidden" : ""}`}
                      key={i}
                    >
                      {spec.specification.type === "select" ? (
                        <div
                          key={i}
                          className="p-4 bg-[#F6F6F6] rounded-lg flex flex-col gap-4"
                        >
                          <span className="text-sm text-secondary-text">
                            {spec.specification.name}
                          </span>
                          <span className="text-sm font-medium">
                            {spec?.option?.value}
                          </span>
                        </div>
                      ) : spec.specification.type === "multi_select" ? (
                        <div
                          key={i}
                          className="p-4 bg-[#F6F6F6] rounded-lg flex flex-col gap-4"
                        >
                          <span className="text-sm text-secondary-text">
                            {spec.specification.name}
                          </span>
                          <span className="text-sm font-medium">
                            {spec?.selectedOptions
                              .map((option) => option?.option?.label)
                              .join(", ")}
                          </span>
                        </div>
                      ) : (
                        <div
                          key={i}
                          className="p-4 bg-[#F6F6F6] rounded-lg flex flex-col gap-4 lg:col-span-3"
                        >
                          <span className="text-sm text-secondary-text">
                            {spec.specification.name}
                          </span>
                          <span className="text-sm font-medium">
                            {spec.specification.type === "text" ? (
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: spec.value,
                                }}
                              />
                            ) : (
                              spec?.option?.value
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                  // ) : (
                  //   i < 6 && (
                  //     <div
                  //       key={i}
                  //       className="p-4 bg-[#F6F6F6] rounded-lg flex flex-col gap-4"
                  //     >
                  //       <span className="text-sm text-secondary-text">
                  //         {spec.specification.name}
                  //       </span>
                  //       <span className="text-sm font-medium">
                  //         {spec.specification.type === "text" ? (
                  //           <div
                  //             dangerouslySetInnerHTML={{ __html: spec.value }}
                  //           />
                  //         ) : (
                  //           spec?.option?.value
                  //         )}
                  //       </span>
                  //     </div>
                  //   )
                  // )
                )}
              </div>
              <div className="mt-4">
                <span
                  onClick={() => setShowSpecs(!showSpecs)}
                  className="text-secondary font-medium text-sm cursor-pointer"
                >
                  {showSpecs ? "نمایش کمتر" : "نمایش بیشتر"}
                </span>
              </div>
            </section>

            <div className="w-full h-1 bg-stroke my-8" />

            <section
              className="scroll-mt-[180px]"
              id="reviews"
              ref={(el) => {
                sectionRefs.current.reviews = el;
              }}
            >
              <div className="flex items-center justify-between pb-8">
                <div className="flex items-center gap-2">
                  <Image
                    src="/assets/icons/arrow-left.png"
                    alt="arrow-left"
                    width={24}
                    height={24}
                  />
                  <h2 className="text-sm lg:text-lg font-bold font-noora">
                    نظرات کاربران
                  </h2>
                </div>
                <Button
                  variant="secondary"
                  title="افزودن دیدگاه جدید"
                  onClick={() => {
                    setShowAddCommentModal(true);
                  }}
                />
              </div>
              <ProductsComments productId={product.id} />
            </section>

            {/* <div className="w-full h-1 bg-stroke my-8" /> */}

            {/* <section
            className="scroll-mt-[180px]"
            id="qa"
            ref={(el) => {
              sectionRefs.current.qa = el;
            }}
          >
            <div className="flex items-center justify-between pb-8">
              <div className="flex items-center gap-2">
                <Image
                  src="/assets/icons/arrow-left.png"
                  alt="arrow-left"
                  width={24}
                  height={24}
                />
                <h2 className="text-sm lg:text-lg font-bold font-noora">
                  پرسش و پاسخ
                </h2>
              </div>
              <Button variant="secondary" title="ثبت پرسش" />
            </div>
            <div className="flex flex-col gap-4">
              {Array.from({ length: 5 }).map((a, i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl border-1.5 border-stroke"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src="/assets/icons/help-circle.svg"
                      alt="product-reviews"
                      width={24}
                      height={24}
                    />
                    <span className="font-medium text-base">
                      آیا این محصول در دسترس است؟
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-success bg-success-light font-semibold text-sm px-4 py-1 rounded-lg">
                      پاسخ
                    </span>
                    <span className="text-sm text-secondary-text">
                      خیر متاسفانه! این محصول در حال حاضر در دسترس نیست
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section> */}

            {/* <div className="w-full h-1 bg-stroke my-8" /> */}

            {/* <section
            className="scroll-mt-[180px]"
            id="faq"
            ref={(el) => {
              sectionRefs.current.faq = el;
            }}
          >
            <div className="flex items-center gap-2">
              <Image
                src="/assets/icons/arrow-left.png"
                alt="arrow-left"
                width={24}
                height={24}
              />
              <h2 className="text-sm lg:text-lg font-bold font-noora">
                سوالات متداول
              </h2>
            </div>
            <div className="flex flex-col gap-6 mt-6">
              {Array.from({ length: 5 }).map((a, i) => (
                <Accordion
                  key={i}
                  title={`سوال ${i + 1}`}
                  content={`پاسخ ${i + 1}`}
                />
              ))}
            </div>
          </section> */}
          </div>
          <div className="sticky top-48 hidden lg:block">
            <div className="bg-[#F4F6FA] p-5 rounded-xl border-1.5 border-stroke">
              <div className="flex gap-2.5 pb-4 border-b border-b-slate-200 items-center">
                <div className="aspect-square items-center justify-center w-20 h-20">
                  <Image
                    src={`${imageBaseUrl}/${firstImage?.file?.name}`}
                    alt="product"
                    width={90}
                    height={90}
                    className="w-full h-full object-contain"
                  />
                </div>
                {/* <div className="flex flex-col gap-3 items-start"> */}
                <div className="flex-1">
                  <h4 className="text-sm font-semibold leading-8">
                    {product.name}
                  </h4>
                  {/* <div className="flex items-center gap-1 bg-white rounded-full px-1 py-0.5">
                  <div className="w-5 h-5 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs font-medium">زرد روشن</span>
                </div> */}
                </div>
              </div>
              <div className="pt-2">
                <div className="border bg-white my-2 text-sm font-semibold p-3 border-stroke flex items-center gap-2 rounded-lg">
                  <Image
                    src={"/assets/icons/truck-deliver.svg"}
                    alt="truck"
                    width={20}
                    height={20}
                  />
                  <span>تحویل اکسپرس و سریع کالا</span>
                </div>
                <div className="border bg-white my-2 text-sm font-semibold p-3 border-stroke flex items-center gap-2 rounded-lg">
                  <Image
                    src={"/assets/icons/shield-verify.svg"}
                    alt="shield"
                    width={20}
                    height={20}
                  />
                  <span>گارانتی اصالت و سلامت فیزیکی کالا</span>
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
              {regularPrice ? (
                <div className="mt-10 mb-2 text-left">
                  <div className="flex items-center justify-between mb-4">
                    {hasDiscount ? (
                      <div className="bg-primary text-white text-sm px-5 py-2 font-semibold rounded-lg">
                        {discountPercentage}%
                      </div>
                    ) : (
                      <div />
                    )}
                    <div className="flex items-end gap-2 flex-col">
                      {salePrice ? (
                        <div className="text-secondary-text">
                          {formatNumber(regularPrice)}{" "}
                          <span className="text-sm">تومان</span>
                        </div>
                      ) : null}
                      <div className={"text-xl font-bold"}>
                        {formatNumber(salePrice ? salePrice : regularPrice)}{" "}
                        <span className="text-base font-normal">تومان</span>
                      </div>
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
                  className="w-full mt-10"
                  href="tel:02145322"
                  link
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <AddCommentModal
        open={showAddCommentModal}
        productId={product.id}
        setOpen={setShowAddCommentModal}
        onSuccess={() => {
          setShowAddCommentModal(false);
        }}
      />
    </>
  );
}
