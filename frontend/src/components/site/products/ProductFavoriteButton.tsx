import { useIsMobile } from "@/hooks/useIsMobile";
import { Product } from "@/types/product";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ProductFavoriteButton = ({ product }: { product: Product }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const isMobile = useIsMobile();

  const handleFavorite = () => {
    const productData = {
      name: product.name,
      id: product.id,
      image: product.images?.find((i) => i.isThumbnail)?.file?.name,
      slug: product.slug,
    };
    setIsFavorite(!isFavorite);
    const favoriteProducts = localStorage.getItem("favoriteProducts");
    if (favoriteProducts) {
      let favoriteProductsArray = JSON.parse(favoriteProducts);
      if (favoriteProductsArray?.length) {
        if (favoriteProductsArray.find((p: Product) => p.id === product.id)) {
          favoriteProductsArray.splice(
            favoriteProductsArray.findIndex(
              (p: Product) => p.id === product.id
            ),
            1
          );
          toast.success("محصول از علاقمندی ها حذف شد");
        } else {
          favoriteProductsArray.push(productData);
          toast.success("محصول به علاقمندی ها اضافه شد");
        }
      } else {
        favoriteProductsArray = [productData];
        toast.success("محصول به علاقمندی ها اضافه شد");
      }
      localStorage.setItem(
        "favoriteProducts",
        JSON.stringify(favoriteProductsArray)
      );
    } else {
      localStorage.setItem("favoriteProducts", JSON.stringify([productData]));
      toast.success("محصول به علاقمندی ها اضافه شد");
    }
  };

  useEffect(() => {
    const favoriteProducts = localStorage.getItem("favoriteProducts");
    if (favoriteProducts) {
      let favoriteProductsArray = JSON.parse(favoriteProducts);
      setIsFavorite(
        favoriteProductsArray.find((p: Product) => p.id === product.id)
      );
    }
  }, [product.id]);

  return (
    <div
      onClick={handleFavorite}
      className="bg-[#F4F6FA] w-12 h-12 rounded-xl flex items-center justify-center flex-col gap-3 cursor-pointer"
    >
      <Image
        src={`/assets/icons/heart${isFavorite ? "-fill" : ""}.svg`}
        alt="product"
        width={isMobile ? 20 : 24}
        height={isMobile ? 20 : 24}
      />
    </div>
  );
};

export default ProductFavoriteButton;
