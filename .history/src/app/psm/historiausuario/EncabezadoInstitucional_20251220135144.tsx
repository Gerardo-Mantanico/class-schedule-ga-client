"use client";

import React, { useEffect, useState } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";

interface EncabezadoInstitucionalProps {
  citaId: number;
  disabled?: boolean;
}

export default function EncabezadoInstitucional({
  citaId,
  disabled = false,
}: EncabezadoInstitucionalProps) {
  const [formData, setFormData] = useState({
    nombreInstitucion: "",
    servicioNombre: "",
    code: "",
    date: "",
    psicologo: "",
    estado: false,
  });

  const [loading, setLoading] = useState(true);

  // Función para actualizar campos del formulario
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Traer datos de la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8090/api/v1/hc/encabezado?citaId=2`
        );
        if (!response.ok) throw new Error("Error al obtener los datos");
        const data = await response.json();
        setFormData({
          nombreInstitucion: data.nombreInstitucion,
          servicioNombre: data.servicioNombre,
          code: data.code,
          date: data.date,
          psicologo: data.psicologo,
          estado: data.estado,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [citaId]);

  if (loading) return <div>Cargando...</div>;

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
            value={formData.nombreInstitucion}
            onChange={(e) =>
              handleInputChange("nombreInstitucion", e.target.value)
            }
            disabled={disabled}
            required
          />
        </div>

        {/* Servicio */}
        <div>
          <Label htmlFor="servicioNombre">
            Servicio <span className="text-error-500">*</span>
          </Label>
          <Input
            id="servicioNombre"
            name="servicioNombre"
            placeholder="Ingrese el servicio"
            value={formData.servicioNombre}
            onChange={(e) =>
              handleInputChange("servicioNombre", e.target.value)
            }
            disabled={disabled}
            required
          />
        </div>

        {/* Número de Historia Clínica */}
        <div>
          <Label htmlFor="code">
            Número de Historia Clínica <span className="text-error-500">*</span>
          </Label>
          <Input
            type="text"
            id="code"
            name="code"
            placeholder="Autoincremental"
            value={formData.code}
            disabled
            required
            className="cursor-not-allowed"
          />
        </div>

        {/* Psicólogo Responsable */}
        <div>
          <Label htmlFor="psicologo">
            Psicólogo(a) Responsable <span className="text-error-500">*</span>
          </Label>
          <Input
            id="psicologo"
            name="psicologo"
            placeholder="Ingrese el psicólogo responsable"
            value={formData.psicologo}
            onChange={(e) =>
              handleInputChange("psicologo", e.target.value)
            }
            disabled={disabled}
            required
          />
        </div>
      </div>
    </div>
  );
}
