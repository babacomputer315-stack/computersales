import SiteLayout from "@/components/site/layout/Layout";
import { ssrCategoryService } from "@/services/ssr/category.service";
import { Category } from "@/services/user/product.service";
import { imageBaseUrl } from "@/utils/constants";
import { detectDevice } from "@/utils/detectDevice";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import React, { ReactElement, useState } from "react";

const CategoriesPage = ({ categories }: { categories: Category[] }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  if (!selectedCategory) {
    return (
      <div className="px-6 pt-4 pb-20">
        {categories.map((category) => (
          <div
            key={category.id}
            className="py-4 border-b border-b-stroke last:border-b-0 flex items-center justify-between"
            onClick={() => setSelectedCategory(category)}
          >
            <div className="flex items-center gap-3">
              {category.image ? (
                <Image
                  src={`${imageBaseUrl}/${category.image.name}`}
                  alt={category.name}
                  width={48}
                  height={48}
                  className="rounded-lg"
                />
              ) : null}
              <h5 className="text-sm font-semibold">{category.name}</h5>
            </div>
            <Image
              src={"/assets/icons/arrow-left.svg"}
              alt="arrow"
              width={24}
              height={24}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="px-6 pt-8 pb-20">
      <div
        onClick={() => setSelectedCategory(null)}
        className="bg-[#F4F6FA] flex items-center gap-2 font-semibold text-sm rounded-lg w-fit py-3 px-4 mb-8"
      >
        <Image
          src={"/assets/icons/category-back.svg"}
          alt={"category-back"}
          width={24}
          height={24}
        />
        <span>{selectedCategory.name}</span>
      </div>
      {selectedCategory.children?.map((category) => (
        <div key={category.id} className="mb-10 flex flex-col">
          <div className="flex items-center gap-2">
            <Image
              src={"/assets/icons/category-menu.svg"}
              alt="arrow"
              width={15}
              height={15}
            />
            <h5 className="text-sm font-bold">{category.name}</h5>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Link
              href={`/products/category/${category.slug}`}
              className="bg-[#F5F7F8] p-3 rounded-xl flex items-center justify-center flex-col min-h-20 gap-2"
            >
              <Image
                src={"/assets/icons/category-grid.svg"}
                alt={"category-grid"}
                width={20}
                height={20}
              />
              <h5 className="text-sm font-medium">مشاهده همه</h5>
            </Link>
            {category?.children?.map((c) => (
              <Link
                href={`/products/category/${c.slug}`}
                key={c.id}
                className="bg-[#F5F7F8] p-3 rounded-xl flex items-center justify-center flex-col min-h-20"
              >
                {c.image ? (
                  <Image
                    src={`${imageBaseUrl}/${c.image?.name}`}
                    alt={c?.name?.slice(0, 5)}
                    width={46}
                    height={46}
                  />
                ) : null}
                <h5 className="text-sm font-medium line-clamp-1">{c.name}</h5>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoriesPage;

CategoriesPage.getLayout = function getLayout(page: ReactElement) {
  return <SiteLayout>{page}</SiteLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { isMobileSSR } = detectDevice(context);

  try {
    // Parse query parameters using utility function
    const categories = await ssrCategoryService.getCategories();
    console.log(categories);
    return {
      props: {
        isMobileSSR,
        categories: categories.data,
      },
    };
  } catch (error) {
    console.error("Error fetching products:", error);

    // Return fallback data on error
    return {
      props: {
        isMobileSSR,
        categories: [],
      },
    };
  }
};
