import React, { createContext, useContext, useEffect, useState } from "react";
import AuthService, { User } from "../services/auth.service";
import { setAuthContext } from "../services/httpClient";
import dynamic from "next/dynamic";

const AuthModal = dynamic(
  () => import("@/components/site/shared/Modal/AuthModal"),
  {
    ssr: false,
  }
);

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  forceLogout: () => void;
  updateUser: (user: User) => void;
  openAuthModal: boolean;
  setOpenAuthModal: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (AuthService.isAuthenticated()) {
          const currentUser = AuthService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          } else {
            // Try to get fresh user data
            const freshUser = await AuthService.getProfile();
            setUser(freshUser);
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // Clear invalid auth data
        AuthService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Set up token refresh interval
  useEffect(() => {
    if (!user) return;

    const refreshInterval = setInterval(async () => {
      try {
        // Check if token is about to expire (refresh 5 minutes before expiry)
        if (AuthService.isTokenExpiringSoon()) {
          await AuthService.refreshToken();
          console.log("Token refreshed automatically");
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
        // If refresh fails, logout user
        await logout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(refreshInterval);
  }, [user]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  let isForceLoggingOut = false;

  const forceLogout = () => {
    if (isForceLoggingOut) return;
    isForceLoggingOut = true;

    AuthService.logout();
    setUser(null);
    // toast.error("Session expired. Please login again.");

    setTimeout(() => {
      isForceLoggingOut = false;
    }, 2000);
  };

  // const forceLogout = () => {
  //   AuthService.logout();
  //   setUser(null);
  //   toast.error("Session expired. Please login again.");
  // };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    forceLogout,
    updateUser,
    openAuthModal,
    setOpenAuthModal,
  };

  // Set global auth context reference for HTTP client
  useEffect(() => {
    setAuthContext(value);
  }, [value]);

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthModal open={openAuthModal} setOpen={setOpenAuthModal} />
    </AuthContext.Provider>
  );
};
