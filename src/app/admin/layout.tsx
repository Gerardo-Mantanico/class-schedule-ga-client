"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebarAdmin from "@/layout/AppSidebarAdmin";
import Backdrop from "@/layout/Backdrop";
import React from "react";
import RequireRole from "@/components/auth/RequireRole";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  let mainContentMargin = "lg:ml-[90px]";
  if (isMobileOpen) {
    mainContentMargin = "ml-0";
  } else if (isExpanded || isHovered) {
    mainContentMargin = "lg:ml-[290px]";
  }

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebarAdmin />
      <Backdrop />
      {/* Main Content Congreso */}
      <div
        className={`min-w-0 flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        <div className="mx-auto min-w-0 max-w-(--breakpoint-2xl) overflow-x-hidden p-4 md:p-6">
          <RequireRole allowedRoles={["ADMIN", "ADMINISTRADOR", "ROLE_ADMIN"]}>
            {children}
          </RequireRole>
        </div>
      </div>
    </div>
  );
}
