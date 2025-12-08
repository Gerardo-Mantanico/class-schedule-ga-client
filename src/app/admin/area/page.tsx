import AreaTable from "@/components/tables/AreaTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Areas",
  description:
    "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default function BasicTables() {
  return (
    <div>
      <div className="space-y-6">
          <AreaTable  />
      </div>
    </div>
  );
}
