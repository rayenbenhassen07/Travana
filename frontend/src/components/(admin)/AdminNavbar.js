"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  FaBars,
  FaBell,
  FaSearch,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Image from "next/image";

const AdminNavbar = ({ onMenuClick, isCollapsed }) => {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user, logout } = useAuthStore();
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // Sample notifications
  const notifications = [
    {
      id: 1,
      title: "New Reservation",
      message: "John Doe booked Hotel Paradise",
      time: "5 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "New User",
      message: "Jane Smith registered",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "Payment Received",
      message: "Payment of $250 confirmed",
      time: "2 hours ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      router.push("/");
    }
  };

  return (
    <nav className="bg-white border-b border-neutral-200 h-16 sticky top-0 z-30">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onMenuClick}
            className="lg:hidden text-neutral-600 hover:text-primary-500 transition-colors"
          >
            <FaBars size={20} />
          </button>

          {/* Search Bar */}
          {/* <div className="hidden md:flex items-center bg-neutral-50 rounded-xl px-4 py-2 w-64 lg:w-96">
            <FaSearch className="text-neutral-400 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-sm text-neutral-700 placeholder-neutral-400 w-full"
            />
          </div> */}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Mobile Search Button */}
          {/* <button className="md:hidden text-neutral-600 hover:text-primary-500 transition-colors">
            <FaSearch size={18} />
          </button> */}

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-neutral-600 hover:text-primary-500 hover:bg-neutral-50 rounded-xl transition-all"
            >
              <FaBell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-primary-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
                  <h3 className="font-semibold text-neutral-800">
                    Notifications
                  </h3>
                  <p className="text-xs text-neutral-500">
                    You have {unreadCount} unread notifications
                  </p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors ${
                        notification.unread ? "bg-primary-50/30" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0">
                          {notification.unread && <></>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-neutral-800 truncate">
                            {notification.title}
                          </h4>
                          <p className="text-xs text-neutral-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-neutral-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 bg-neutral-50 text-center">
                  <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 md:gap-3 p-1 md:p-1 hover:bg-neutral-50 rounded-xl transition-all cursor-pointer"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-secondary-800 rounded-full flex items-center justify-center">
                <FaUserCircle className="text-white" size={24} />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-neutral-800">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-xs text-neutral-500">
                  {user?.type || "Administrator"}
                </p>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden">
                <div className="px-4 py-4 border-b border-neutral-200 bg-gradient-to-br from-primary-50 to-white">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                      <FaUserCircle className="text-white" size={28} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-800">
                        {user?.name || "Admin User"}
                      </h3>
                      <p className="text-xs text-neutral-500">
                        {user?.email || "admin@naseam.com"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors text-neutral-700">
                    <FaUser className="text-neutral-500" />
                    <span className="text-sm">My Profile</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors text-neutral-700">
                    <FaCog className="text-neutral-500" />
                    <span className="text-sm">Settings</span>
                  </button>
                </div>
                <div className="border-t border-neutral-200 py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600"
                  >
                    <FaSignOutAlt />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
