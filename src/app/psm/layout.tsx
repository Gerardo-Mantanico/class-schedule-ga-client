"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebarPsm from "@/layout/AppSidebarPsm";
import Backdrop from "@/layout/Backdrop";
import React from "react";
import RequireRole from "@/components/auth/RequireRole";


export default function PsmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebarPsm />
      <Backdrop />
      {/* Main Content Congreso */}
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <RequireRole allowedRoles={["PSM", "PSM", "ROLE_PSM"]}>
            {children}
          </RequireRole>
        </div>
      </div>
    </div>
  );
}
