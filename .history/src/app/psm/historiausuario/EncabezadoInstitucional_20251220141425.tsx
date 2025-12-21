"use client";

import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { useHc } from "@/hooks/auth/useHc";




export const EncabezadoInstitucional = () => {

 const { hc, loading, error, } = useHc();
  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;


  return (
    <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">
        Encabezado Institucional
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Nombre de la Institución */}
        <div>
          <Label htmlFor="nombreInstitucion">
            Nombre de la Institución <span className="text-error-500">*</span>
          </Label>
          <Input
            placeholder={hc?.nombreInstitucion}
          />
        </div>

        {/* Servicio */}
        <div>
          <Label htmlFor="servicio">
            Servicio <span className="text-error-500">*</span>
          </Label>
            <Input
            placeholder={hc?.servicioNombre}
          />
      
        </div>

        {/* Número de Historia Clínica */}
        <div>
          <Label htmlFor="numeroHistoriaClinica">
            Número de Historia Clínica <span className="text-error-500">*</span>
          </Label>
          <Input
            placeholder={hc?.code}
            disabled
          />
        </div>

  {/* Número de Historia Clínica */}
        <div>
          <Label htmlFor="numeroHistoriaClinica">
            Número de Historia Clínica <span className="text-error-500">*</span>
          </Label>
          <Input
            placeholder={hc?.code}
            disabled
          />
        </div>

        {/* Psicólogo(a) Responsable */}
        <div>
          <Label htmlFor="psicologoResponsable">
            Psicólogo(a) Responsable <span className="text-error-500">*</span>
          </Label>
           <Input
            placeholder={hc?.code}
            disabled
          />
        </div>

        {/* Número de Colegiado */}
        <div>
          <Label htmlFor="numeroColegiado">
            Número de Colegiado <span className="text-error-500">*</span>
          </Label>
            <Input
            placeholder={hc?.code}
            disabled
          />
        </div>
      </div>
    </div>
  );
}
