import ProfilePanel from "@/components/user-profile/ProfilePanel";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Profile",
  description:
    "This is Next.js Profile page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function Profile() {
  return <ProfilePanel title="Perfil" showPsmCard />;
}
