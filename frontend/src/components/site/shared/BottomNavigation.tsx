import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const BottomNavigation = () => {
  const { pathname } = useRouter();
  const { isAuthenticated } = useAuth();

  const bottomnavigationitems = [
    {
      title: "خانه",
      href: "/",
      icon: "/assets/icons/bottom-navigation/home.svg",
      activeIcon: "/assets/icons/bottom-navigation/home-active.svg",
    },
    {
      title: "دسته بندی ها",
      href: "/categories",
      icon: "/assets/icons/bottom-navigation/category.svg",
      activeIcon: "/assets/icons/bottom-navigation/category-active.svg",
    },
    {
      title: "سبد خرید",
      href: "/cart",
      icon: "/assets/icons/bottom-navigation/bag.svg",
      activeIcon: "/assets/icons/bottom-navigation/bag-active.svg",
    },
    {
      title: isAuthenticated ? "پروفایل" : "ورود / ثبت نام",
      href: isAuthenticated ? "/profile" : "/auth",
      icon: "/assets/icons/bottom-navigation/user.svg",
      activeIcon: "/assets/icons/bottom-navigation/user-active.svg",
    },
  ];

  return (
    <div className="fixed site bottom-0 right-0 left-0 bg-white border-t-[#E6EAF3] border-t-1.5 py-3 px-6 grid grid-cols-4 gap-3 justify-between z-40 lg:hidden">
      {bottomnavigationitems.map((item) => (
        <Link
          href={item.href}
          key={item.title}
          className={`flex items-center justify-center flex-col py-1.5 rounded-xl gap-1.5
          ${pathname === item.href ? "bg-[#F9E8E8]" : "bg-white"}`}
        >
          <Image
            src={
              pathname === item.href ? item.activeIcon : item.icon
            }
            alt={item.title}
            width={24}
            height={24}
          />
          <span
            className={`text-xs ${
              pathname === item.href
                ? "text-primary font-semibold"
                : "text-gray-800 font-medium"
            }`}
          >
            {item.title}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default BottomNavigation;
