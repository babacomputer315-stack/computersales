import { Product, userProductService } from "@/services/user/product.service";
import { imageBaseUrl } from "@/utils/constants";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const LandingDiscountProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const getDiscountProducts = async () => {
    try {
      const response = await userProductService.getProducts({
        sortBy: "salePrice",
        sortOrder: "asc",
        limit: 8,
        page: 1,
      });
      setProducts(response?.data?.data?.filter((item) => item.salePrice) || []);
    } catch (error) {
      console.error("Error fetching discount products:", error);
    }
  };

  useEffect(() => {
    getDiscountProducts();
  }, []);

  if(products.length === 0) return null;

  return (
    <div>
      <div className="relative hidden lg:block">
        <Image
          src={"/assets/images/landing-discount-desktop.png"}
          alt="landing-discount"
          width={2000}
          height={500}
        />
        <div className="absolute left-0 top-4 w-2/3 bottom-0 flex items-center gap-6 justify-end pl-6">
          {products.slice(0, 8).map((product) => (
            <Link
              key={product.id}
              className="w-20 h-20 bg-white-10 rounded-xl relative"
              href={`/products/${product.slug}`}
            >
              <Image
                src={`${imageBaseUrl}/${
                  product.images.find((image) => image.isThumbnail)?.file.name
                }`}
                alt={product.name}
                width={80}
                height={80}
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute top-3 left-0 bg-primary text-white pr-3 pl-2 rounded-r-full py-0.5 text-sm">
                {Math.round(
                  ((product.regularPrice - (product.salePrice || 0)) /
                    product.regularPrice) *
                    100 || 0
                )}
                %
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="relative block lg:hidden">
        <Image
          src={"/assets/images/landing-discount-mobile.png"}
          alt="landing-discount"
          width={1000}
          height={1000}
          className="block lg:hidden"
        />
        <div className="absolute left-0 top-20 right-0 bottom-0 flex items-center gap-6 justify-between px-6">
          {products.slice(0, 4).map((product) => (
            <Link
              key={product.id}
              className="w-16 h-16 bg-white-10 rounded-xl relative"
              href={`/products/${product.slug}`}
            >
              <Image
                src={`${imageBaseUrl}/${
                  product.images.find((image) => image.isThumbnail)?.file.name
                }`}
                alt={product.name}
                width={64}
                height={64}
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute top-2 left-0 bg-primary text-white pr-2 pl-2 rounded-r-full py-0.5 text-xs">
                {Math.round(
                  ((product.regularPrice - (product.salePrice || 0)) /
                    product.regularPrice) *
                    100 || 0
                )}
                %
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingDiscountProducts;
