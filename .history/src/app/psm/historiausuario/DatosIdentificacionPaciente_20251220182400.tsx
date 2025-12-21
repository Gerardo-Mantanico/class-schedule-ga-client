"use client";

import React, { useState, useEffect, useCallback } from "react";

import DatosPersonalesForm from "@/app/psm/historiausuario/identificacion-paciente/DatosPersonalesForm";
import ContactoEmergenciaForm from "@/app/psm/historiausuario/identificacion-paciente/ContactoEmergenciaForm";
import ProcedenciaForm from "@/app/psm/historiausuario/identificacion-paciente/ProcedenciaForm";
import MotivoConsultaForm from "@/app/psm/historiausuario/identificacion-paciente/MotivoConsultaForm";

import { useInformacionPaciente } from "@/hooks/historaClinica/useInformacionPaciente";
import type { InformacionPaciente } from "@/interfaces/historiaClinica/InformacionPaciente";
import Button from "@/components/ui/button/Button";

interface Props extends Partial<InformacionPaciente> {
  onChange?: (data: InformacionPaciente) => void;
  disabled?: boolean;
}

const initialErrors = {
  telefono: "",
  telefonoContacto: "",
  email: "",
};

export default function DatosIdentificacionPaciente({
  onChange,
  disabled = false,
  ...props
}: Props) {
  const { getItem,createItem  } = useInformacionPaciente();

  const [formData, setFormData] = useState<InformacionPaciente>({
    hcId: 0,
    nombreCompleto: "",
    fechaNacimiento: "",
    edad: 0,
    genero: "",
    estadoCivil: "",
    ocupacion: "",
    nivelEducativo: "",
    direccion: "",
    telefono: "",
    email: "",
    personaContacto: "",
    parentescoContacto: "",
    telefonoContacto: "",
    procedencia: "",
    motivoConsulta: "",
    ...props,
  });

  const [errors, setErrors] = useState(initialErrors);
  const [pacienteExistente, setPacienteExistente] =
    useState<InformacionPaciente | null>(null);
  const [loading, setLoading] = useState(true);



//guardar info
    const handleGuardar = async () => {
    try {
      await saveItem(formData); // <-- llama al método del hook
      alert("Información guardada correctamente");
    } catch (error) {
      alert("Error al guardar la información");
    }
  };


  /* =======================
     CARGA DE PACIENTE
  ======================= */
  useEffect(() => {
    getItem(2)
      .then((data) => {
        if (data) {
          setPacienteExistente(data);
          setFormData(data);
        }
      })
      .finally(() => setLoading(false));
  }, [getItem]);

  /* =======================
     NOTIFICAR CAMBIOS
  ======================= */
  useEffect(() => {
    onChange?.(formData);
  }, [formData, onChange]);

  /* =======================
     CALCULAR EDAD
  ======================= */
  useEffect(() => {
    if (!formData.fechaNacimiento) return;

    const hoy = new Date();
    const nacimiento = new Date(formData.fechaNacimiento);

    let edad =
      hoy.getFullYear() - nacimiento.getFullYear() -
      (hoy < new Date(hoy.getFullYear(), nacimiento.getMonth(), nacimiento.getDate()) ? 1 : 0);

    setFormData((prev) => ({ ...prev, edad }));
  }, [formData.fechaNacimiento]);

  /* =======================
     VALIDACIONES
  ======================= */
  const validateField = useCallback((field: string, value: string) => {
    let error = "";

    if (field === "email") {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Correo inválido";
      }
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  /* =======================
     HANDLER ÚNICO
  ======================= */
  const handleChange = <K extends keyof InformacionPaciente>(
    field: K,
    value: InformacionPaciente[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (typeof value === "string") validateField(field, value);
  };

  if (loading) return <p>Cargando datos...</p>;

  const readOnly = !!pacienteExistente || disabled;


  /* =======================
       HANDLER GUARDAR
  ======================= */
  const handleGuardar = () => {
    // Aquí deberías llamar a tu función para guardar la información
    // Por ejemplo: savePaciente(formData)
    // Puedes mostrar un mensaje de éxito o error según la respuesta
    alert("Información guardada:\n" + JSON.stringify(formData, null, 2));
  };


  /* =======================
     RENDER
  ======================= */
  return (
    <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h2 className="text-xl font-semibold mb-4">
        Datos de Identificación del Paciente
      </h2>

      {pacienteExistente && (
        <div className="mb-4 p-3 text-sm bg-yellow-100 rounded">
          Modo solo lectura: paciente existente
        </div>
      )}


      <div className="space-y-6">
        <DatosPersonalesForm
          formData={{
            ...formData,
            correoElectronico: formData.email,
          }}
          onInputChange={(field, value) =>
            handleChange(field === "correoElectronico" ? "email" : field, value)
          }
          disabled={readOnly}
          telefonoError={errors.telefono}
          emailError={errors.email}
        />

        <ContactoEmergenciaForm
          formData={{
            personaContacto: formData.personaContacto,
            parentesco: formData.parentescoContacto,
            telefonoContacto: formData.telefonoContacto,
          }}
          onInputChange={(field, value) =>
            handleChange(
              field === "parentesco" ? "parentescoContacto" : field,
              value
            )
          }
          disabled={readOnly}
          telefonoContactoError={errors.telefonoContacto}
        />

        <ProcedenciaForm
          value={formData.procedencia}
          onChange={(v) => handleChange("procedencia", v)}
          disabled={readOnly}
        />

        <MotivoConsultaForm
          value={formData.motivoConsulta}
          onChange={(v) => handleChange("motivoConsulta", v)}
          disabled={pacienteExistente ? true : disabled}
        />
      </div>

      {/* Botón para guardar solo si NO existe el paciente */}
      {!pacienteExistente && (
        <div className="mt-8 flex justify-end">
          <Button onClick={handleGuardar} disabled={readOnly}>
            Guardar información
          </Button>
        </div>
      )}

    </div>
  );
}
