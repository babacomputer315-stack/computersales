import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import UserMenu from "../shared/UserMenu";
import { categoryService } from "@/services/user/category.service";
import {
  Category,
  Product,
  userProductService,
} from "@/services/user/product.service";
import { imageBaseUrl } from "@/utils/constants";
import Drawer from "./Drawer";
import dynamic from "next/dynamic";

const SearchModal = dynamic(() => import("../shared/Modal/SearchModal"), {
  ssr: false,
});

const Header = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  useEffect(() => {
    return () => {
      handleSearch();
    };
  }, [search]);

  const handleSearch = async () => {
    if (search.length < 3) {
      setSearchResults([]);
      return;
    }
    const response = await userProductService.searchProducts(search, 5);
    setSearchResults(response.data);
  };

  const getCategories = async () => {
    const response = await categoryService.getCategories();
    setCategories(response.data);
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    const resetSearch = () => {
      setSearch("");
      setSearchResults([]);
    };

    const lastRun = { time: 0 };
    const delay = 200;

    const throttledScroll = () => {
      const now = Date.now();
      if (now - lastRun.time > delay) {
        resetSearch();
        lastRun.time = now;
      }
    };

    window.addEventListener("scroll", throttledScroll);

    return () => {
      window.removeEventListener("scroll", throttledScroll);
    };
  }, []);

  return (
    <>
      {isCategoriesModalOpen ? (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 backdrop-blur-sm z-30"></div>
      ) : null}
      <div
        className={`lg:container mx-auto sticky lg:relative top-0 z-50 bg-white lg:bg-transparent ${
          searchResults?.length > 0 ? "lg:z-50" : "lg:z-20"
        }`}
      >
        <div className="py-6 mx-6 lg:mx-0 lg:border-none">
          <div className="flex justify-between items-center sticky top-0 z-50">
            <div className="flex items-center justify-between lg:justify-start gap-2 lg:gap-8 lg:flex-[1.5]">
              <button
                className="icon-btn lg:hidden"
                onClick={() => setIsMobileDrawerOpen(true)}
              >
                <Image
                  src={"/assets/icons/menu.svg"}
                  width={24}
                  height={24}
                  alt="menu"
                />
              </button>
              <Link href={"/"}>
                <Image
                  src={"/assets/images/logo-full.svg"}
                  className="hidden lg:flex"
                  width={157}
                  height={40}
                  alt="logo"
                />
              </Link>
              <div className="flex-1 relative">
                <input
                  type="text"
                  className="bg-gray w-full h-12 rounded-lg border-none outline-none hidden lg:flex px-4 text-sm cursor-pointer"
                  placeholder="جستجو ..."
                  readOnly
                  onClick={() => setIsSearchModalOpen(true)}
                />
              </div>
              <div className="hidden lg:flex gap-8 items-center">
                <Link href={"/blog"} className="text-secondary-text">
                  مطالب آموزشی
                </Link>
                <Link href={"/about-us"} className="text-secondary-text">
                  درباره ما
                </Link>
                <Link href={"/contact"} className="text-secondary-text">
                  تماس با ما
                </Link>
              </div>
            </div>
            <Link href={"/"} className="lg:hidden">
              <Image
                src={"/assets/images/logo-full.svg"}
                className="lg:hidden"
                width={142}
                height={36}
                alt="logo"
              />
            </Link>
            <div className="flex gap-3 lg:flex-1 justify-end">
              <div className="flex-col items-end justify-between hidden lg:flex">
                <span className="text-gray-800 text-sm">پشتیبانی 24 ساعته</span>
                <Link href={"tel:02145322"} className="font-bold tracking-wide">
                  <span>45322</span> <span className="text-primary">-</span>{" "}
                  <span className="text-primary">021</span>
                </Link>
              </div>
              <div className="w-12 h-12 bg-[#FDE9EB] rounded-xl flex items-center justify-center">
                <Image
                  src={"/assets/icons/call-wire.svg"}
                  width={24}
                  height={24}
                  alt="call-wire"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:hidden mx-6 border-b-1.5 border-b-stroke pb-6 relative">
        <input
          type="text"
          className="bg-[#F4F6FA] h-12 rounded-lg border-none outline-none w-full px-4 text-sm cursor-pointer"
          placeholder="جستجو ..."
          readOnly
          onClick={() => setIsSearchModalOpen(true)}
        />
      </div>
      <div
        onMouseLeave={() => {
          setIsCategoriesModalOpen(false);
          setSelectedCategory(null);
        }}
        className="bg-secondary-900 text-white hidden lg:block sticky top-0 z-30"
      >
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between relative">
            <div className="flex items-center">
              <div
                // onMouseEnter={() => {
                onClick={() => {
                  setIsCategoriesModalOpen(true);
                  setSelectedCategory(null);
                  setSearch("");
                  setSearchResults([]);
                }}
                className="border border-white-25 cursor-pointer px-4 h-12 rounded-lg bg-white-10 flex items-center gap-2"
              >
                <Image
                  src={"/assets/icons/category.svg"}
                  width={24}
                  height={24}
                  alt="grid"
                />
                <span className="font-semibold">
                  دسته بندی{" "}
                  <span className="text-sm font-normal inline-block mr-0.5">
                    محصولات
                  </span>
                </span>
                <Image
                  src={"/assets/icons/arrow-bottom.svg"}
                  width={24}
                  height={24}
                  alt="chevron-down"
                />
              </div>
              <div className="px-6">
                <div className="bg-stroke w-[1.5px] h-6" />
              </div>
              <div className="flex gap-8">
                {categories.map((category, index) =>
                  index <= 1 ? (
                    <Link
                      href={`/products/category/${category?.slug}`}
                      key={category?.id}
                    >
                      {category.name}
                    </Link>
                  ) : null
                )}
                <Link href={`/assembly-smart`}>اسمبل هوشمند</Link>
                {/* <Link href={"/products"} className="flex items-center gap-1">
                  <Image
                    src={"/assets/icons/award.svg"}
                    width={24}
                    height={24}
                    alt="award"
                  />
                  محصولات پرفروش
                </Link>
                <Link href={"/"} className="flex items-center gap-1">
                  <Image
                    src={"/assets/icons/discount.svg"}
                    width={24}
                    height={24}
                    alt="discount"
                  />
                  پرتخفیف
                </Link>
                <Link href={"/"} className="flex items-center gap-1">
                  <Image
                    src={"/assets/icons/zap.svg"}
                    width={24}
                    height={24}
                    alt="zap"
                  />
                  جدید
                </Link> */}
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <UserMenu />
              <Link
                href={"/cart"}
                className="bg-primary w-12 h-12 flex rounded-xl items-center justify-center"
              >
                <Image
                  src={"/assets/icons/cart.svg"}
                  width={24}
                  height={24}
                  alt="menu"
                />
                {/* <span className="hidden lg:flex font-semibold">سبد خرید</span> */}
              </Link>
              {/* <div>
                <span>
                  <span className="font-medium mr-1">021</span>
                  <span>-</span>
                  <span className="font-semibold text-lg ml-1">3456789</span>
                </span>
              </div>
              <div className="h-6 w-[1.5px] bg-stroke mx-4" />
              <div className="flex items-center gap-2">
                <span className="text-secondary font-semibold text-sm">
                  ارتباط با پشتیبانی
                </span>
                <Image
                  src={"/assets/icons/phone-call.svg"}
                  width={24}
                  height={24}
                  alt="phone-call"
                />
              </div> */}
            </div>
            {isCategoriesModalOpen ? (
              <div className="absolute top-16 left-0 right-0 w-full bg-white z-50 rounded-xl shadow-md p-6 text-dark flex gap-20 max-h-[600px]">
                <div className="flex flex-col gap-8 overflow-y-auto pl-6">
                  {categories?.map((category) => (
                    <div
                      // onClick={() => setSelectedCategory(category)}
                      onMouseEnter={() => setSelectedCategory(category)}
                      onClick={() => {
                        setSelectedCategory(null);
                        setIsCategoriesModalOpen(false);
                      }}
                      key={category.id}
                      className={`cursor-pointer flex items-center gap-2 ${
                        selectedCategory?.id === category.id
                          ? "text-primary font-bold"
                          : ""
                      }`}
                    >
                      {category.image?.name ? (
                        <Image
                          src={`${imageBaseUrl}/${category.image?.name}`}
                          alt={category.name}
                          width={48}
                          height={48}
                          className="rounded-md"
                        />
                      ) : null}
                      <Link href={`/products/category/${category?.slug}`}>
                        {category.name}
                      </Link>
                    </div>
                  ))}
                </div>
                <div
                  className="flex-1 overflow-y-auto"
                  onClick={() => {
                    setIsCategoriesModalOpen(false);
                    setSelectedCategory(null);
                  }}
                >
                  {selectedCategory?.children?.map((child) => (
                    <div key={child.id} className="flex flex-col gap-4 mb-8">
                      <Link
                        href={`/products/category/${child?.slug}`}
                        className="flex items-center gap-2 font-bold text-sm"
                      >
                        <Image
                          src={"/assets/icons/category-menu.svg"}
                          width={14}
                          height={14}
                          alt="category-menu"
                        />
                        {child?.name}
                      </Link>
                      <div className="flex gap-4">
                        <Link
                          href={`/products/category/${child?.slug}`}
                          className="bg-white border border-stroke p-4 rounded-xl flex items-center gap-2 flex-col justify-center"
                        >
                          <Image
                            src={"/assets/icons/category-grid.svg"}
                            alt={"category-grid"}
                            width={24}
                            height={24}
                          />
                          <span className="font-semibold text-sm">
                            مشاهده همه
                          </span>
                        </Link>
                        {child?.children?.map((child) => (
                          <Link
                            href={`/products/category/${child?.slug}`}
                            key={child.id}
                            className="bg-[#F5F7F8] p-4 rounded-xl flex flex-col items-center justify-center gap-2"
                          >
                            {child?.image ? (
                              <Image
                                src={`${imageBaseUrl}/${child?.image?.name}`}
                                alt={child?.name}
                                width={46}
                                height={46}
                              />
                            ) : null}
                            <span className="text-sm font-medium">
                              {child?.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <Drawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        // title="منو"
      >
        <div className="flex flex-col gap-2">
          <Link
            href={"/"}
            className="py-3 px-2 rounded-lg hover:bg-gray/60"
            onClick={() => setIsMobileDrawerOpen(false)}
          >
            صفحه اصلی
          </Link>
          <Link
            href={"/assembly-smart"}
            className="py-3 px-2 rounded-lg hover:bg-gray/60"
            onClick={() => setIsMobileDrawerOpen(false)}
          >
            اسمبل هوشمند
          </Link>
          <Link
            href={"/blog"}
            className="py-3 px-2 rounded-lg hover:bg-gray/60"
            onClick={() => setIsMobileDrawerOpen(false)}
          >
            مطالب آموزشی
          </Link>
          <Link
            href={"/about-us"}
            className="py-3 px-2 rounded-lg hover:bg-gray/60"
            onClick={() => setIsMobileDrawerOpen(false)}
          >
            درباره ما
          </Link>
          <Link
            href={"/contact"}
            className="py-3 px-2 rounded-lg hover:bg-gray/60"
            onClick={() => setIsMobileDrawerOpen(false)}
          >
            تماس با ما
          </Link>
        </div>
      </Drawer>
      <SearchModal open={isSearchModalOpen} setOpen={setIsSearchModalOpen} />
    </>
  );
};

export default Header;
