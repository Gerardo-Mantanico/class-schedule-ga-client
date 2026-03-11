import CongresoTable from "@/components/tables/CongresoTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Congresos",
  description:
    "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default function BasicTables() {
  return (
    <div>
      <div className="space-y-6">
          <CongresoTable  />
      </div>
    </div>
  );
}
