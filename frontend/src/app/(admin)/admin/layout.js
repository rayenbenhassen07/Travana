"use client";
import React, { useState } from "react";
import AdminSidebar from "@/components/(admin)/AdminSidebar";
import AdminNavbar from "@/components/(admin)/AdminNavbar";
import AdminAuthGuard from "@/components/(admin)/AdminAuthGuard";

export default function AdminLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-neutral-50">
        {/* Sidebar */}
        <AdminSidebar
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
          isMobileOpen={mobileSidebarOpen}
          setIsMobileOpen={setMobileSidebarOpen}
        />

        {/* Main Content */}
        <div
          className={`transition-all duration-300 ${
            sidebarCollapsed ? "lg:ml-20" : "lg:ml-72"
          }`}
        >
          {/* Navbar */}
          <AdminNavbar
            onMenuClick={() => setMobileSidebarOpen(true)}
            isCollapsed={sidebarCollapsed}
          />

          {/* Page Content */}
          <main className="p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
