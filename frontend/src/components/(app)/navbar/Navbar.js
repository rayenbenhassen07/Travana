"use client";

import Container from "../Container";
import UserMenu from "./UserMenu";
import Logo from "./Logo";
import Menu from "./Menu";
import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import InlineLoader from "@/components/loading/InlineLoader";
import useAuthStore from "@/store/useAuthStore";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, hydrateAuth, isHydrating, logout, isLoggingOut } =
    useAuthStore();

  useEffect(() => {
    if (!user && !isHydrating) {
      hydrateAuth();
    }
  }, [user, isHydrating, hydrateAuth]);

  const handleMobileLogout = async () => {
    setIsMobileMenuOpen(false);
    await logout();
  };

  return (
    <div
      className={`fixed w-full bg-white z-50 transition-all duration-300 border-b shadow-sm py-3 border-transparent`}
    >
      <Container>
        <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
          <Logo />

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <Menu />
            <UserMenu />
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl hover:bg-orange-50 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <FiX size={26} className="text-neutral-800" />
              ) : (
                <FiMenu size={26} className="text-neutral-800" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 bg-white rounded-2xl shadow-2xl border border-orange-100 overflow-hidden">
            <div className="flex flex-col">
              <Menu mobile />

              <div className="border-t border-orange-100 my-2"></div>

              <div className="flex flex-col px-2">
                {isHydrating && !user ? (
                  <div className="p-3">
                    <InlineLoader
                      text="Chargement..."
                      size="sm"
                      spinnerColor="orange"
                      textColor="text-neutral-500"
                    />
                  </div>
                ) : user ? (
                  <>
                    {user.type === "admin" ? (
                      <MobileMenuItem
                        label="Administration"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          window.location.href = "/admin";
                        }}
                      />
                    ) : (
                      <MobileMenuItem
                        label="Espace client"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          window.location.href = "/client";
                        }}
                      />
                    )}
                    <MobileMenuItem
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
                      onClick={handleMobileLogout}
                      disabled={isLoggingOut}
                    />
                  </>
                ) : (
                  <>
                    <MobileMenuItem
                      label="Connexion"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        window.location.href = "/login";
                      }}
                    />
                    <MobileMenuItem
                      label="Inscription"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        window.location.href = "/register";
                      }}
                    />
                  </>
                )}
              </div>

              <div className="border-t border-orange-100 my-2"></div>

              <a
                href="tel:+21694398054"
                className="flex items-center justify-center gap-2 p-3 mx-2 rounded-xl text-white font-semibold bg-neutral-700 hover:bg-neutral-800transition-colors shadow-md"
              >
                <FaWhatsapp size={18} />
                <span>+216 94 398 054</span>
              </a>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

const MobileMenuItem = ({ label, onClick, disabled = false }) => (
  <button
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    className={`text-left p-3 rounded-xl font-medium transition-colors w-full ${
      disabled
        ? "text-neutral-400 cursor-not-allowed"
        : "text-neutral-700 hover:bg-orange-50 hover:text-primary-600"
    }`}
  >
    {label}
  </button>
);

export default Navbar;
