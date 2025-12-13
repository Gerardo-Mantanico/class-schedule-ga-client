"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface RequireRoleProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function RequireRole({ children, allowedRoles = [] }: Readonly<RequireRoleProps>) {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!currentUser) {
      // Not authenticated -> redirect to signin
      router.push("/signin");
      return;
    }

    if (allowedRoles.length > 0) {
      const roleName = (currentUser.role?.name || "").toLowerCase();
      const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());
      if (!normalizedAllowed.includes(roleName)) {
        router.push("/unauthorized");
      }
    }
  }, [isLoading, currentUser, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center p-8">
        <div className="text-sm text-gray-500">Cargando...</div>
      </div>
    );
  }

  // While redirect is happening this component renders nothing.
  if (!currentUser) return null;

  if (allowedRoles.length > 0) {
    const roleName = (currentUser.role?.name || "").toLowerCase();
    const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());
    if (!normalizedAllowed.includes(roleName)) return null;
  }

  return <>{children}</>;
}
