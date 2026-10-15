import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import Button from "./Button";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

const UserMenu: React.FC = () => {
  const { user, isAuthenticated, logout, loading, setOpenAuthModal } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      toast.error("خطا در خروج از حساب کاربری");
    } finally {
      setLogoutLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div>
        <Button
          title="ورود / ثبت نام"
          onClick={() => setOpenAuthModal(true)}
          link
          href="/auth"
          className="h-10 hidden md:flex border border-white-25 bg-white-10 items-center justify-center"
        />
        <button
          onClick={() => setOpenAuthModal(true)}
          className="flex items-center w-12 h-12 rounded-lg border border-stroke justify-center md:hidden"
        >
          <Image
            src={"/assets/icons/user.svg"}
            alt="User Avatar"
            width={24}
            height={24}
          />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center w-12 h-12 rounded-xl border border-white-25 bg-white-10 justify-center"
      >
        <Image
          src={"/assets/icons/user-avatar.svg"}
          alt="User Avatar"
          width={24}
          height={24}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown menu */}
          <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg border border-stroke z-20">
            <div className="p-4 border-b border-stroke flex items-center justify-between">
              <p className="text-sm font-medium text-dark">
                {user?.name || "کاربر"}
              </p>
              <p className="text-xs text-dark">{user?.mobile}</p>
            </div>

            <div className="p-2 flex flex-col gap-3 py-3">
              <Link
                onClick={() => setIsOpen(false)}
                href="/profile"
                className="w-full text-right px-3 text-sm text-dark hover:bg-gray-100 rounded-md transition-colors"
              >
                پروفایل
              </Link>
              <Link
                onClick={() => setIsOpen(false)}
                href="/profile/orders"
                className="w-full text-right px-3 text-sm text-dark hover:bg-gray-100 rounded-md transition-colors"
              >
                سفارشات
              </Link>
              <Link
                onClick={() => setIsOpen(false)}
                href="/profile/favorites"
                className="w-full text-right px-3 text-sm text-dark hover:bg-gray-100 rounded-md transition-colors"
              >
                علاقه مندی ها
              </Link>
              <Link
                onClick={() => setIsOpen(false)}
                href="/profile/messages"
                className="w-full text-right px-3 text-sm text-dark hover:bg-gray-100 rounded-md transition-colors"
              >
                پیام ها
              </Link>
            </div>

            <div className="p-2 border-t border-stroke">
              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                className="w-full text-right px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
              >
                {logoutLoading ? "در حال خروج..." : "خروج"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;
