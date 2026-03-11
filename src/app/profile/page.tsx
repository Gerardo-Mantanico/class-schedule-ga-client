"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const resolveRoleProfilePath = (roleName?: string) => {
  const normalizedRole = (roleName || "").toUpperCase();

  if (normalizedRole.includes("ADMINISTRATIVO") || normalizedRole.includes("ADMIN_CONGRESO")) {
    return "/administrativo/profile";
  }
  if (normalizedRole.includes("ADMIN")) return "/admin/profile";
  if (normalizedRole.includes("PSM")) return "/psm/profile";
  if (
    normalizedRole.includes("PARTICIPANTE") ||
    normalizedRole.includes("PACIENTE") ||
    normalizedRole.includes("CLIENT")
  ) {
    return "/participante/profile";
  }

  return "/participante/profile";
};

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser } = useAuth();

  useEffect(() => {
    const target = resolveRoleProfilePath(currentUser?.role?.name);
    router.replace(target);
  }, [currentUser?.role?.name, router]);

  return null;
}
