import ActividadTable from "@/components/tables/ActividadTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Actividades",
  description: "Gestión de actividades de congresos",
};

export default function ActividadesPage() {
  return (
    <div className="space-y-6">
      <ActividadTable />
    </div>
  );
}
