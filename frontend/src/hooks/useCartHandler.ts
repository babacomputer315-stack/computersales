import { useCart, CartItem } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export const useCartHandler = () => {
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount, getCartDiscount, getCartFinalTotal } = useCart();
  const { user, setOpenAuthModal } = useAuth();
  const router = useRouter();

  const addItemToCart = (item: CartItem) => {
    if (!user) {
      setOpenAuthModal(true);
      return false;
    }

    addToCart(item);
    toast.success("محصول به سبد خرید اضافه شد");
    return true;
  };

  const removeItemFromCart = (itemId: number) => {
    removeFromCart(itemId);
    toast.success("محصول از سبد خرید حذف شد");
  };

  const updateItemQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItemFromCart(itemId);
      return;
    }

    updateQuantity(itemId, quantity);
    toast.success("تعداد محصول بروزرسانی شد");
  };

  const clearCartItems = () => {
    clearCart();
    toast.success("سبد خرید پاک شد");
  };

  const proceedToCheckout = () => {
    if (!user) {
      setOpenAuthModal(true);
      return;
    }

    if (cart.length === 0) {
      toast.error("سبد خرید شما خالی است");
      return;
    }

    router.push("/cart/user-info");
  };

  const getCartSummary = () => {
    return {
      total: getCartTotal(),
      count: getCartCount(),
      discount: getCartDiscount(),
      finalTotal: getCartFinalTotal(),
      items: cart.length,
    };
  };

  const isCartEmpty = cart.length === 0;

  return {
    cart,
    addItemToCart,
    removeItemFromCart,
    updateItemQuantity,
    clearCartItems,
    proceedToCheckout,
    getCartSummary,
    isCartEmpty,
    getCartTotal,
    getCartCount,
    getCartDiscount,
    getCartFinalTotal,
  };
};

