"use client";

import React, { useState, useEffect } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";
import AsyncSearchableSelect from "@/components/form/AsyncSearchableSelect";

interface EncabezadoInstitucionalProps {
  nombreInstitucion?: string;
  servicio?: string;
  numeroHistoriaClinica?: number;
  fechaApertura?: string;
  psicologoResponsableId?: string;
  psicologoResponsableNombre?: string;
  numeroColegiado?: string;
  onChange?: (data: EncabezadoData) => void;
  disabled?: boolean;
}

export interface EncabezadoData {
  nombreInstitucion: string;
  servicio: string;
  numeroHistoriaClinica: number;
  fechaApertura: string;
  psicologoResponsableId: string;
  psicologoResponsableNombre: string;
  numeroColegiado: string;
}

const servicioOptions = [
  { value: "psicologia_clinica", label: "Psicología Clínica" },
  { value: "psicologia_educativa", label: "Psicología Educativa" },
  { value: "neuropsicologia", label: "Neuropsicología" },
];

export default function EncabezadoInstitucional({
  nombreInstitucion = "",
  servicio = "",
  numeroHistoriaClinica = 0,
  fechaApertura = "",
  psicologoResponsableId = "",
  psicologoResponsableNombre = "",
  numeroColegiado = "",
  onChange,
  disabled = false,
}: EncabezadoInstitucionalProps) {
  const [formData, setFormData] = useState<EncabezadoData>({
    nombreInstitucion,
    servicio,
    numeroHistoriaClinica,
    fechaApertura,
    psicologoResponsableId,
    psicologoResponsableNombre,
    numeroColegiado,
  });

  const [colegiadoError, setColegiadoError] = useState<string>("");

  // Notificar cambios al componente padre
  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData, onChange]);

  const handleInputChange = (
    field: keyof EncabezadoData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Validar formato de número de colegiado
    if (field === "numeroColegiado") {
      validateColegiado(value as string);
    }
  };

  const validateColegiado = (value: string) => {
    // Formato: ####-###
    const colegiadoPattern = /^\d{4}-\d{3}$/;

    if (!value) {
      setColegiadoError("");
      return;
    }

    if (!colegiadoPattern.test(value)) {
      setColegiadoError("Formato debe ser ####-### (ejemplo: 1234-567)");
    } else {
      setColegiadoError("");
    }
  };

  const handlePsicologoSelect = (userId: string) => {
    setFormData((prev) => ({
      ...prev,
      psicologoResponsableId: userId,
    }));
  };

  const formatUserOption = (user: any) => ({
    value: user.id.toString(),
    label: `${user.firstname} ${user.lastname}`,
    searchText: `${user.firstname} ${user.lastname} ${user.dpi || ""}`,
  });

  // Obtener fecha máxima (hoy)
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">
        Encabezado Institucional
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Nombre de la Institución */}
        <div>
          <Label htmlFor="nombreInstitucion">
            Nombre de la Institución
            <span className="text-error-500">*</span>
          </Label>
          <Input
            type="text"
            id="nombreInstitucion"
            name="nombreInstitucion"
            placeholder="Ingrese el nombre de la institución"
            value={formData.nombreInstitucion}
            onChange={(e) =>
              handleInputChange("nombreInstitucion", e.target.value)
            }
            disabled={disabled}
            required
            className="max-w-full"
          />
        </div>

        {/* Servicio */}
        <div>
          <Label htmlFor="servicio">
            Servicio<span className="text-error-500">*</span>
          </Label>
          <Select
            options={servicioOptions}
            placeholder="Seleccione un servicio"
            onChange={(value) => handleInputChange("servicio", value)}
            defaultValue={formData.servicio}
            className="max-w-full"
          />
        </div>

        {/* Número de Historia Clínica */}
        <div>
          <Label htmlFor="numeroHistoriaClinica">
            Número de Historia Clínica
            <span className="text-error-500">*</span>
          </Label>
          <Input
            type="number"
            id="numeroHistoriaClinica"
            name="numeroHistoriaClinica"
            placeholder="Autoincremental"
            value={formData.numeroHistoriaClinica || ""}
            disabled
            required
            className="max-w-full cursor-not-allowed"
          />
        </div>

        {/* Fecha de Apertura */}
        <div>
          <DatePicker
            id="fechaApertura"
            label="Fecha de Apertura"
            placeholder="Seleccione la fecha"
            defaultDate={formData.fechaApertura || undefined}
            onChange={(selectedDates) => {
              if (selectedDates && selectedDates.length > 0) {
                const date = selectedDates[0];
                const formattedDate = date.toISOString().split("T")[0];
                handleInputChange("fechaApertura", formattedDate);
              }
            }}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            La fecha no puede ser mayor a hoy ({today})
          </p>
        </div>

        {/* Psicólogo(a) Responsable */}
        <div>
          <Label htmlFor="psicologoResponsable">
            Psicólogo(a) Responsable
            <span className="text-error-500">*</span>
          </Label>
          <AsyncSearchableSelect
            searchEndpoint={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"}/users/search`}
            placeholder={
              formData.psicologoResponsableNombre ||
              "Buscar psicólogo por nombre o DPI"
            }
            onChange={handlePsicologoSelect}
            value={formData.psicologoResponsableId}
            searchPlaceholder="Buscar por nombre o DPI..."
            formatOption={formatUserOption}
            minChars={2}
            debounceMs={300}
            className="max-w-full"
          />
        </div>

        {/* Número de Colegiado */}
        <div>
          <Label htmlFor="numeroColegiado">
            Número de Colegiado
            <span className="text-error-500">*</span>
          </Label>
          <Input
            type="text"
            id="numeroColegiado"
            name="numeroColegiado"
            placeholder="####-###"
            value={formData.numeroColegiado}
            onChange={(e) => {
              const value = e.target.value;
              // Permitir solo números y guión
              if (/^[\d-]*$/.test(value)) {
                handleInputChange("numeroColegiado", value);
              }
            }}
            disabled={disabled}
            required
            error={!!colegiadoError}
            hint={colegiadoError}
            className="max-w-full"
          />
        </div>
      </div>
    </div>
  );
}
