import SiteLayout from "@/components/site/layout/Layout";
import ProfileSidebar from "@/components/site/layout/ProfileSidebar";
import { imageBaseUrl } from "@/utils/constants";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";

interface FavoriteProduct {
  id: number;
  name: string;
  image: string;
  slug: string;
}

const FavoritesPage = () => {
  const [favoriteProducts, setFavoriteProducts] = useState<FavoriteProduct[]>(
    []
  );

  useEffect(() => {
    const favoriteProducts = localStorage.getItem("favoriteProducts");
    if (favoriteProducts) {
      setFavoriteProducts(JSON.parse(favoriteProducts) as FavoriteProduct[]);
    }
  }, []);

  const handleRemoveFavorite = (id: number) => {
    const favoriteProducts = localStorage.getItem("favoriteProducts");
    if (favoriteProducts) {
      const favoriteProductsArray = JSON.parse(
        favoriteProducts
      ) as FavoriteProduct[];
      setFavoriteProducts(favoriteProductsArray.filter((p) => p.id !== id));
      localStorage.setItem(
        "favoriteProducts",
        JSON.stringify(favoriteProductsArray.filter((p) => p.id !== id))
      );
    }
  };

  const router = useRouter();

  return (
    <div className="container mx-auto px-6 md:px-0 mt-6 md:mt-8 mb-16 md:mb-32">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-6">
        <ProfileSidebar />
        <div className="flex flex-col gap-6">
          <div className="border-1.5 border-stroke p-6 rounded-lg">
            <div className="flex items-center justify-between pb-6 border-b-1.5 border-b-stroke">
              <h4 className="text-base font-semibold font-noora">
                علاقه مندی ها
              </h4>
              <div className="bg-[#FDE9EB] font-semibold text-primary px-4 py-2 rounded-lg flex items-center justify-center text-sm">
                {favoriteProducts.length} محصول
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-6">
              {favoriteProducts.map((product) => (
                <div
                  key={product.id}
                  className="border-1.5 border-stroke rounded-lg"
                >
                  <div className={`aspect-[4/3] relative`}>
                    <Image
                      src={`${imageBaseUrl}/${product.image}`}
                      alt="product"
                      width={500}
                      height={500}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <div className="p-5 pt-2">
                    <h2 className="font-bold text-sm font-noora">
                      {product.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-5 border-t border-t-stroke pt-5">
                      <button
                        className="icon-btn bg-gray flex-1 font-semibold text-sm"
                        onClick={() => router.push(`/products/${product.slug}`)}
                      >
                        مشاهده محصول
                      </button>
                      <button className="icon-btn bg-gray">
                        <Image
                          src="/assets/icons/trash.svg"
                          alt="shopping-bag"
                          width={24}
                          height={24}
                          onClick={() => handleRemoveFavorite(product.id)}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;

FavoritesPage.getLayout = function getLayout(page: ReactElement) {
  return <SiteLayout>{page}</SiteLayout>;
};
