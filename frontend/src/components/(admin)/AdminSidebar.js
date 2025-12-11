"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaTachometerAlt,
  FaHotel,
  FaCalendarAlt,
  FaUsers,
  FaMapMarkerAlt,
  FaBell,
  FaCog,
  FaChartBar,
  FaPlane,
  FaThList,
  FaBars,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaChevronUp,
  FaBlog,
  FaBlogger,
  FaLanguage,
  FaCube,
  FaDollarSign,
} from "react-icons/fa";
import { MdCategory, MdTag } from "react-icons/md";
import Image from "next/image";

const AdminSidebar = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = useState({});

  const menuItems = [
    {
      title: "Dashboard",
      icon: <FaTachometerAlt />,
      href: "/admin",
      badge: null,
    },
    {
      title: "Reservations",
      icon: <FaCalendarAlt />,
      href: "/admin/reservations",
      badge: "12",
    },
    {
      title: "Listings",
      icon: <FaHotel />,
      href: "/admin/listings",
      hasSubmenu: true,
      submenu: [
        {
          title: "Calendar",
          icon: <FaCalendarAlt />,
          href: "/admin/listings/calendar",
        },
        {
          title: "Categories",
          icon: <MdCategory />,
          href: "/admin/listings/categories",
        },
        {
          title: "Facilities",
          icon: <FaThList />,
          href: "/admin/listings/facilities",
        },
        {
          title: "Alerts",
          icon: <FaBell />,
          href: "/admin/listings/alerts",
        },
      ],
    },
    {
      title: "Cities",
      icon: <FaMapMarkerAlt />,
      href: "/admin/cities",
      badge: null,
    },
    {
      title: "Languages",
      icon: <FaLanguage />,
      href: "/admin/languages",
      badge: null,
    },
    {
      title: "Currencies",
      icon: <FaDollarSign />,
      href: "/admin/currencies",
      badge: null,
    },
    {
      title: "Users",
      icon: <FaUsers />,
      href: "/admin/users",
      badge: null,
    },
    {
      title: "Blogs",
      icon: <FaBlogger />,
      href: "/admin/blogs",
      hasSubmenu: true,
      submenu: [
        {
          title: "Categories",
          icon: <MdCategory />,
          href: "/admin/blogs/blog-categories",
        },
        {
          title: "Tags",
          icon: <MdTag />,
          href: "/admin/blogs/blog-tags",
        },
      ],
    },
  ];

  const isActive = (href) => {
    if (href === "/admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Check if any submenu item is active
  const isSubmenuActive = (submenu) => {
    return submenu?.some((item) => pathname.startsWith(item.href));
  };

  // Auto-expand submenus if a submenu item is active
  React.useEffect(() => {
    menuItems.forEach((item) => {
      if (item.hasSubmenu && isSubmenuActive(item.submenu)) {
        setOpenSubmenus((prev) => ({ ...prev, [item.title]: true }));
      }
    });
  }, [pathname]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-white border-r border-neutral-200 
          transition-all duration-300 z-50
          ${isCollapsed ? "w-20" : "w-72"}
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200">
          {!isCollapsed && (
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-lg font-bold text-neutral-800 leading-tight">
                  Travana.tn
                </h1>
                <p className="text-xs text-neutral-500 leading-tight">
                  Admin Panel
                </p>
              </div>
            </Link>
          )}

          {isCollapsed && (
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-xl">T</span>
            </div>
          )}

          {/* Close button for mobile */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-neutral-600 hover:text-primary-500"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 h-[calc(100vh-8rem)]">
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <div key={index}>
                {/* Main Menu Item */}
                {item.hasSubmenu ? (
                  <button
                    onClick={() =>
                      setOpenSubmenus((prev) => ({
                        ...prev,
                        [item.title]: !prev[item.title],
                      }))
                    }
                    className={`
                      w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all
                      ${
                        isActive(item.href) || isSubmenuActive(item.submenu)
                          ? "bg-primary-50 text-primary-600 font-semibold"
                          : "text-neutral-600 hover:bg-neutral-50 hover:text-primary-600"
                      }
                      ${isCollapsed ? "justify-center" : ""}
                    `}
                    title={isCollapsed ? item.title : ""}
                  >
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.title}</span>
                        {item.badge && (
                          <span className="bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {item.badge}
                          </span>
                        )}
                        <span
                          className="text-sm transition-transform duration-200"
                          style={{
                            transform: openSubmenus[item.title]
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                          }}
                        >
                          <FaChevronDown className="cursor-pointer" />
                        </span>
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-3 rounded-xl transition-all
                      ${
                        isActive(item.href)
                          ? "bg-primary-50 text-primary-600 font-semibold"
                          : "text-neutral-600 hover:bg-neutral-50 hover:text-primary-600"
                      }
                      ${isCollapsed ? "justify-center" : ""}
                    `}
                    title={isCollapsed ? item.title : ""}
                  >
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    {!isCollapsed && (
                      <>
                        <span className="flex-1">{item.title}</span>
                        {item.badge && (
                          <span className="bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                )}

                {/* Submenu with smooth animation */}
                {item.hasSubmenu && !isCollapsed && item.submenu && (
                  <div
                    className={`
                      overflow-hidden transition-all duration-300 ease-in-out
                      ${
                        openSubmenus[item.title]
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }
                    `}
                  >
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-neutral-200 pl-3">
                      {/* Main Link */}
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={`
                          flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm
                          ${
                            pathname === item.href
                              ? "bg-primary-50 text-primary-600 font-semibold"
                              : "text-neutral-600 hover:bg-neutral-50 hover:text-primary-600"
                          }
                        `}
                      >
                        <span className="flex-shrink-0">{item.icon}</span>
                        <span>All {item.title}</span>
                      </Link>

                      {/* Submenu Items */}
                      {item.submenu.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          href={subItem.href}
                          onClick={() => setIsMobileOpen(false)}
                          className={`
                            flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm
                            ${
                              isActive(subItem.href)
                                ? "bg-primary-50 text-primary-600 font-semibold"
                                : "text-neutral-600 hover:bg-neutral-50 hover:text-primary-600"
                            }
                          `}
                        >
                          <span className="flex-shrink-0">{subItem.icon}</span>
                          <span>{subItem.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Collapse Button - Desktop Only */}
        <div className="hidden lg:block absolute bottom-4 left-0 right-0 px-3">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-xl transition-all"
          >
            {isCollapsed ? (
              <FaChevronRight size={16} />
            ) : (
              <>
                <FaChevronLeft size={16} />
                <span className="text-sm font-medium">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
