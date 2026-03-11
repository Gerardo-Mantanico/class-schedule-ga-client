import Institucion from "@/components/tables/InstitucionTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Instituciones | Admin",
  description: "Gestión de instituciones",
};

export default function InstitucionesPage() {
  return (
    <div>
      <div className="space-y-6">
        <Institucion />
      </div>
    </div>
  );
}
