import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const profileLinks = [
  {
    label: "اطلاعات حساب کاربری",
    href: "/profile",
    icon: "/assets/icons/profile/user-info.svg",
    activeIcon: "/assets/icons/profile/user-info-active.svg",
  },
  {
    label: "سفارشات من",
    href: "/profile/orders",
    icon: "/assets/icons/profile/orders.svg",
    activeIcon: "/assets/icons/profile/orders-active.svg",
  },
  {
    label: "پیام ها",
    href: "/profile/messages",
    icon: "/assets/icons/profile/messages.svg",
    activeIcon: "/assets/icons/profile/messages-active.svg",
  },
  {
    label: "علاقه مندی ها",
    href: "/profile/favorites",
    icon: "/assets/icons/profile/favorites.svg",
    activeIcon: "/assets/icons/profile/favorites-active.svg",
  },
];

const ProfileSidebar = () => {
  const { pathname } = useRouter();

  const { user } = useAuth();

  return (
    <div className="bg-secondary-900 rounded-lg py-6 md:sticky top-24 h-fit">
      <div className="flex items-center gap-3 pb-6 border-b-2 border-dashed border-b-slate-500 mx-6">
        <div className="w-14 h-14 rounded-lg flex items-center justify-center bg-white">
          <Image
            src="/assets/icons/user.svg"
            alt="user"
            width={24}
            height={24}
          />
        </div>
        <div className="flex flex-col gap-2 flex-1 text-white">
          <span className="text-sm font-semibold">{user?.name}</span>
          <span className="text-sm tracking-wider text-white">
            {user?.mobile}
          </span>
        </div>
        {/* <div>
          <Image
            src="/assets/icons/edit-profile.svg"
            alt="edit"
            width={24}
            height={24}
          />
        </div> */}
      </div>
      <div className="mt-6 flex flex-col gap-6">
        {profileLinks.map((link) => (
          <Link
            href={link.href}
            key={link.label}
            className={`text-sm flex items-center gap-2 px-6 relative ${
              pathname === link.href ||
              (pathname.includes(link.href) && link.href !== "/profile")
                ? "bg-secondary-900 text-white font-medium"
                : "text-white-70"
            }`}
          >
            {pathname === link.href ||
            (pathname.includes(link.href) && link.href !== "/profile") ? (
              <div className="w-1 h-12 rounded-e-lg bg-primary absolute right-0" />
            ) : null}
            <div
              className={`${
                pathname === link.href ||
                (pathname.includes(link.href) && link.href !== "/profile")
                  ? "bg-primary"
                  : "bg-white-05"
              } w-12 h-12 flex items-center justify-center rounded-xl`}
            >
              <Image
                src={
                  pathname === link.href ||
                  (pathname.includes(link.href) && link.href !== "/profile")
                    ? link.activeIcon
                    : link.icon
                }
                alt={link.label}
                width={24}
                height={24}
              />
            </div>
            <span className="mt-0.5">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProfileSidebar;
