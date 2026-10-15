import React from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/router";

interface CartIconProps {
  className?: string;
  showCount?: boolean;
}

const CartIcon: React.FC<CartIconProps> = ({ className = "", showCount = true }) => {
  const { getCartCount } = useCart();
  const router = useRouter();
  const cartCount = getCartCount();

  const handleClick = () => {
    router.push("/cart");
  };

  return (
    <div 
      className={`relative cursor-pointer ${className}`}
      onClick={handleClick}
    >
      <Image
        src="/assets/icons/shopping-bag.svg"
        alt="سبد خرید"
        width={24}
        height={24}
        className="w-6 h-6"
      />
      {showCount && cartCount > 0 && (
        <div className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
          {cartCount > 99 ? "99+" : cartCount}
        </div>
      )}
    </div>
  );
};

export default CartIcon;


