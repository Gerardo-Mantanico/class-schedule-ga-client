"use client";

import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";
import AsyncSearchableSelect from "@/components/form/AsyncSearchableSelect";



export default function EncabezadoInstitucional({
  formData,
  servicioOptions,
  disabled = false,
  today,
  colegiadoError,
  handleInputChange,
  handlePsicologoSelect,
  formatUserOption,
}: EncabezadoInstitucionalProps) {
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
            id="nombreInstitucion"
            name="nombreInstitucion"
            placeholder="Ingrese el nombre de la institución"
      //      value={formData.nombreInstitucion}
            onChange={(e) =>
              handleInputChange("nombreInstitucion", e.target.value)
            }
            disabled={disabled}
            required
          />
        </div>

        {/* Servicio */}
        <div>
          <Label htmlFor="servicio">
            Servicio <span className="text-error-500">*</span>
          </Label>
            <Input
            id="nombreInstitucion"
            name="nombreInstitucion"
            placeholder="Ingrese el nombre de la institución"
      //      value={formData.nombreInstitucion}
            onChange={(e) =>
              handleInputChange("nombreInstitucion", e.target.value)
            }
            disabled={disabled}
            required
          />
      
        </div>

        {/* Número de Historia Clínica */}
        <div>
          <Label htmlFor="numeroHistoriaClinica">
            Número de Historia Clínica <span className="text-error-500">*</span>
          </Label>
          <Input
            type="text"
            id="numeroHistoriaClinica"
            name="numeroHistoriaClinica"
            placeholder="Autoincremental"
      //      value={formData.numeroHistoriaClinica || ""}
            disabled
            required
            className="cursor-not-allowed"
          />
        </div>

  {/* Número de Historia Clínica */}
        <div>
          <Label htmlFor="numeroHistoriaClinica">
            Número de Historia Clínica <span className="text-error-500">*</span>
          </Label>
          <Input
            type="text"
            id="numeroHistoriaClinica"
            name="numeroHistoriaClinica"
            placeholder="Autoincremental"
      //      value={formData.numeroHistoriaClinica || ""}
            disabled
            required
            className="cursor-not-allowed"
          />
        </div>

       

        {/* Psicólogo(a) Responsable */}
        <div>
          <Label htmlFor="psicologoResponsable">
            Psicólogo(a) Responsable <span className="text-error-500">*</span>
          </Label>
          <Input
            id="nombreInstitucion"
            name="nombreInstitucion"
            placeholder="Ingrese el nombre de la institución"
      //      value={formData.nombreInstitucion}
            onChange={(e) =>
              handleInputChange("nombreInstitucion", e.target.value)
            }
            disabled={disabled}
            required
          />
        </div>

        {/* Número de Colegiado */}
        <div>
          <Label htmlFor="numeroColegiado">
            Número de Colegiado <span className="text-error-500">*</span>
          </Label>
          <Input
            id="numeroColegiado"
            name="numeroColegiado"
            placeholder="####-###"
       //     value={formData.numeroColegiado}
            onChange={(e) => {
              const value = e.target.value;
              if (/^[\d-]*$/.test(value)) {
                handleInputChange("numeroColegiado", value);
              }
            }}
            disabled={disabled}
            required
            error={!!colegiadoError}
            hint={colegiadoError}
          />
        </div>
      </div>
    </div>
  );
}
