// components/UserMenu.js
"use client";

import Avatar from "@/components/Avatar";
import { useCallback, useEffect, useState } from "react";
import { MenuItem } from "./MenuItem";
import InlineLoader from "@/components/loading/InlineLoader";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import { FaWhatsapp } from "react-icons/fa";

const UserMenu = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { user, hydrateAuth, isHydrating, logout, isLoggingOut } =
    useAuthStore();

  useEffect(() => {
    if (!user && !isHydrating) {
      hydrateAuth();
    }
  }, [user, isHydrating, hydrateAuth]);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const handleLogout = useCallback(async () => {
    const result = await logout();
    if (result.success) {
      router.push("/");
    }
  }, [logout, router]);

  const onCall = useCallback(() => {
    window.location.href = "tel:+21694398054";
  }, []);

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        {/* Phone Number Button */}
        <a
          href="tel:+21694398054"
          onClick={onCall}
          className="hidden lg:flex items-center text-sm gap-2 px-4 py-2.5 bg-neutral-700 hover:bg-neutral-800 text-white font-semibold transition-all rounded-xl shadow-md hover:shadow-lg whitespace-nowrap"
        >
          <FaWhatsapp size={18} />
          <span>+216 94 398 054</span>
        </a>

        {/* User Menu Button */}
        <button
          onClick={toggleOpen}
          className="flex items-center gap-2  transition-all hover:bg-orange-50 rounded-xl cursor-pointer"
          aria-label="User menu"
        >
          <div
            className={`hidden md:block ${
              isOpen
                ? "border-2 border-neutral-800 ml-4 rounded-full transition-all"
                : ""
            }`}
          >
            <Avatar width={36} height={36} src={user?.avatar || null} />
          </div>
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Menu Content */}
          <div className="absolute right-0 rounded-2xl top-14 z-50 w-56 bg-white shadow-2xl overflow-hidden border border-orange-100">
            <div className="flex flex-col py-2">
              {isHydrating && !user ? (
                <div className="px-4 py-3">
                  <InlineLoader
                    text="Chargement..."
                    size="sm"
                    spinnerColor="orange"
                    textColor="text-neutral-500"
                  />
                </div>
              ) : user ? (
                <>
                  {/* User Info */}
                  <div className="px-2 py-1 mx-2 mb-2 bg-neutral-700  text-white rounded-t-xl">
                    <p className="font-bold truncate text-base">
                      {user.name || "Utilisateur"}
                    </p>
                    <p className="text-xs opacity-90 truncate mt-1">
                      {user.email}
                    </p>
                  </div>

                  {/* Admin/Client Space */}
                  {user.user_type === "admin" ? (
                    <MenuItem
                      label="Administration"
                      onClick={() => {
                        router.push("/admin");
                        setIsOpen(false);
                      }}
                    />
                  ) : (
                    <MenuItem
                      label="Espace client"
                      onClick={() => {
                        router.push("/client");
                        setIsOpen(false);
                      }}
                    />
                  )}

                  <hr className="border-orange-100 my-2" />

                  {/* Logout */}
                  <MenuItem
                    label={
                      isLoggingOut ? (
                        <InlineLoader
                          text="Déconnexion..."
                          size="xs"
                          spinnerColor="current"
                          textColor="text-current"
                        />
                      ) : (
                        "Se déconnecter"
                      )
                    }
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  />
                </>
              ) : (
                <>
                  {/* Login/Register */}
                  <MenuItem
                    onClick={() => {
                      router.push("/login");
                      setIsOpen(false);
                    }}
                    label="Connexion"
                  />
                  <MenuItem
                    onClick={() => {
                      router.push("/register");
                      setIsOpen(false);
                    }}
                    label="Inscription"
                  />
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;
