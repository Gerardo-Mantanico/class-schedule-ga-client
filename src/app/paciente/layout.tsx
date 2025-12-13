"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebarPaciente from "@/layout/AppSidebarPaciente";
import Backdrop from "@/layout/Backdrop";
import React from "react";
import RequireRole from "@/components/auth/RequireRole";

export default function PacienteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  let mainContentMargin = "lg:ml-[90px]";
  if (isMobileOpen) {
    mainContentMargin = "ml-0";
  } else if (isExpanded || isHovered) {
    mainContentMargin = "lg:ml-[290px]";
  }

  return (
    
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebarPaciente />
      <Backdrop />
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
           <RequireRole allowedRoles={["CLIENTE", "PACIENTE", "ROLE_PACIENTE"]}>
                     {children}
           </RequireRole>
        </div>
      </div>
    </div>
  );
}
