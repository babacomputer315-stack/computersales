import Header from "@/components/site/layout/Header";
import SelectProductCompareModal from "@/components/site/shared/Modal/SelectProductCompareModal";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  Category,
  Product,
  userProductService,
} from "@/services/user/product.service";
import { imageBaseUrl } from "@/utils/constants";
import { formatNumber } from "@/utils/formatNumber";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const ComparePage = () => {
  const router = useRouter();
  const slugs = (router.query.slug as string[]) || [];
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAddProductModal, setOpenAddProductModal] = useState(false);

  const isMobile = useIsMobile();


  useEffect(() => {
    if (!router.isReady) return;

    const fetchProducts = async () => {
      setLoading(true);
      setProducts([]);
      try {
        const productPromises = slugs?.map((slug) =>
          userProductService.getProductBySlug(slug as string)
        );
        const results = await Promise.all(productPromises || []);
        setProducts(results.map((result) => result.data));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [router.isReady, router.query.slug]);

  const handleDeleteProduct = (id: number) => {
    // Remove the product from the state
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);

    // Update the URL with remaining product slugs
    if (updatedProducts.length === 0) {
      // If no products left, redirect to home
      router.push("/");
    } else {
      // Build new URL with remaining slugs
      const remainingSlugs = updatedProducts.map((product) => product.slug);
      router.push(`/compare/${remainingSlugs.join("/")}`);
    }
  };

  useEffect(() => {
    if (isMobile && products.length > 1) {
      router.push(
        `/compare/${products
          .slice(0, 2)
          .map((product) => product.slug)
          .join("/")}`
      );
    }
  }, [isMobile]);

  if (loading) {
    return (
      <div className="site">
        <div className="lg:container lg:mx-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SelectProductCompareModal
        open={openAddProductModal}
        setOpen={setOpenAddProductModal}
        primaryCategory={
          products?.[0]?.categories?.find((category) => category.isPrimary)
            ?.category as Category
        }
      />
      <div className="site">
        {!isMobile ? <Header /> : null}
        <div className="lg:container lg:mx-auto">
          <div className="px-6 lg:px-0 lg:pt-6 pt-4 flex">
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
              <p className="text-sm font-semibold text-center">
                مقایسه{" "}
                {
                  products?.[0]?.categories?.find(
                    (category) => category.isPrimary
                  )?.category?.name
                }
              </p>
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-b py-5 mt-4 lg:mt-6 border-stroke sticky top-0 lg:top-20 bg-white z-10 items-start">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col items-center border-l last:border-l-0 border-stroke px-2 gap-2 lg:gap-4 relative lg:items-start h-full"
              >
                <Image
                  src={`${imageBaseUrl}/${
                    product.images?.find((image) => image.isThumbnail)?.file
                      ?.name
                  }`}
                  alt={product.name}
                  width={100}
                  height={100}
                />
                <div className="flex-1 flex flex-col justify-between gap-2 items-center lg:items-start">
                  <h2 className="font-peydaEn font-medium text-xs !leading-7 text-center lg:text-start lg:text-sm">
                    {product.name}
                  </h2>
                  <p className="flex items-center gap-1 text-xs lg:text-sm">
                    <span>
                      {product.salePrice ? (
                        <>
                          <span className="font-semibold">
                            {formatNumber(product.salePrice)}
                          </span>
                          <span className="text-gray-500 mr-1">تومان</span>
                        </>
                      ) : product.regularPrice ? (
                        <>
                          <span className="font-semibold">
                            {formatNumber(product.regularPrice)}
                          </span>
                          <span className="text-gray-500 mr-1">تومان</span>
                        </>
                      ) : (
                        "تماس بگیرید"
                      )}
                    </span>
                  </p>
                </div>
                <div
                  className="absolute top-0 left-2 cursor-pointer"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  <Image
                    src={"/assets/icons/delete-compare.svg"}
                    alt="delete-compare"
                    width={24}
                    height={24}
                  />
                </div>
              </div>
            ))}
            {(isMobile && products?.length < 2) ||
            (!isMobile && products?.length < 4) ? (
              <div
                onClick={() => setOpenAddProductModal(true)}
                className="bg-[#E6ECF3] rounded-lg cursor-pointer border border-secondary-900 text-secondary-900 text-sm font-medium py-3 px-4 flex items-center justify-center h-12 mx-4 self-end"
              >
                افزودن کالا
              </div>
            ) : null}
          </div>
          <div className="px-6 lg:px-0 py-8 pb-32 flex flex-col gap-4">
            {products?.[0]?.specifications?.map((spec, index) => (
              <div
                key={spec.specification.id}
                className={`${
                  index % 2 === 0 ? "bg-[#F4F6FA]" : "bg-white"
                } py-2.5 lg:p-5 px-4 rounded-lg`}
              >
                <h3 className="font-peydaEn font-medium text-xs mb-3 text-center lg:text-start lg:text-sm">
                  {spec.specification.name}
                </h3>
                <div
                  className={`grid grid-cols-2 lg:grid-cols-4 text-xs lg:text-sm text-gray-800 gap-2`}
                >
                  {products.map((product, productIndex) => {
                    const productSpec = product.specifications?.find(
                      (s) => s.specification.id === spec.specification.id
                    );
                    return (
                      <div
                        key={product.id}
                        className={`${
                          productIndex < products.length - 1
                            ? "border-l border-[#E6ECF3]"
                            : ""
                        } leading-5 ${
                          isMobile
                            ? productIndex === 0
                              ? "text-start"
                              : "text-end"
                            : "text-start"
                        } px-2 lg:px-0`}
                      >
                        {productSpec
                          ? productSpec.specification.type === "select"
                            ? productSpec?.option?.value
                            : productSpec.value
                          : "-"}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ComparePage;
