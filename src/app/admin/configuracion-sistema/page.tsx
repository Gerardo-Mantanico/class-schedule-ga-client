import ConfiguracionSistemaTable from "@/components/tables/ConfiguracionSistemaTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Configuración del sistema | Admin",
  description: "Configuración del sistema",
};

export default function ConfiguracionSistemaPage() {
  return (
    <div>
      <div className="space-y-6">
        <ConfiguracionSistemaTable />
      </div>
    </div>
  );
}
