import { useAuth } from "@/context/AuthContext";

export const useAuthError = () => {
  const { forceLogout, setOpenAuthModal } = useAuth();

  const handleAuthError = (error: any) => {
    console.error("Auth error:", error);

    // Check if it's an authentication error
    if (error?.response?.status === 401) {
      // Force logout and show auth modal
      forceLogout();
      setOpenAuthModal(true);
      return true; // Indicates auth error was handled
    }

    return false; // Indicates auth error was not handled
  };

  const requireAuth = (callback: () => void) => {
    // This can be used to wrap functions that require authentication
    return () => {
      // Check if user is authenticated
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setOpenAuthModal(true);
        return;
      }

      callback();
    };
  };

  return {
    handleAuthError,
    requireAuth,
  };
};
