"use client";

import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { useHc } from "@/hooks/auth/useHc";

const EncabezadoInstitucional = () => {
  const { hc } = useHc(); // Solo necesitamos la función hc
  const [hcs, setHcs] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    hc(2)
      .then((data) => {
        setHcs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudo cargar la información.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!hcs) return null;

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
          <Input placeholder={hcs?.nombreInstitucion || ""} disabled />
        </div>

        {/* Servicio */}
        <div>
          <Label htmlFor="servicio">
            Servicio <span className="text-error-500">*</span>
          </Label>
          <Input placeholder={hcs?.servicioNombre || ""} disabled/>
        </div>

        {/* Número de Historia Clínica */}
        <div>
          <Label htmlFor="numeroHistoriaClinica">
            Número de Historia Clínica <span className="text-error-500">*</span>
          </Label>
          <Input placeholder={hcs?.code || ""} disabled />
        </div>

        {/* Psicólogo(a) Responsable */}
        <div>
          <Label htmlFor="psicologoResponsable">
            Psicólogo(a) Responsable <span className="text-error-500">*</span>
          </Label>
          <Input placeholder={hcs?.psicologo || ""} disabled />
        </div>

        {/* Número de Colegiado */}
        <div>
          <Label htmlFor="numeroColegiado">
            Número de Colegiado <span className="text-error-500">*</span>
          </Label>
          <Input placeholder={hcs?.psicologo || ""} disabled />
        </div>
      </div>
    </div>
  );
};

export default EncabezadoInstitucional;
