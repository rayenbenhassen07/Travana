"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";

/**
 * AdminAuthGuard - Protects admin routes from unauthorized access
 */
const AdminAuthGuard = ({ children }) => {
  const router = useRouter();
  const { user, hydrateAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Check if token exists
      const token = localStorage.getItem("token");

      if (!token) {
        // No token, redirect to login
        router.push("/login");
        return;
      }

      // If no user loaded yet, try to fetch
      if (!user) {
        await hydrateAuth();
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // After loading, check if user is admin
  useEffect(() => {
    if (!isLoading && user) {
      if (user.user_type !== "admin") {
        // Not admin, redirect to home
        router.push("/");
      }
    }
  }, [isLoading, user, router]);

  // Show loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 font-medium">Vérification...</p>
        </div>
      </div>
    );
  }

  // Don't render if not admin
  if (!user || user.user_type !== "admin") {
    return null;
  }

  return <>{children}</>;
};

export default AdminAuthGuard;
