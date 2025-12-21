"use client";

import React, { useState, useEffect } from "react";
// Asegúrate de que tus componentes de formulario están importados correctamente
import DatosPersonalesForm from "@/app/psm/historiausuario/identificacion-paciente/DatosPersonalesForm";
import ContactoEmergenciaForm from "@/app/psm/historiausuario/identificacion-paciente/ContactoEmergenciaForm";
import ProcedenciaForm from "@/app/psm/historiausuario/identificacion-paciente/ProcedenciaForm";
import MotivoConsultaForm from "@/app/psm/historiausuario/identificacion-paciente/MotivoConsultaForm";
import { useInformacionPaciente } from "@/hooks/historaClinica/useInformacionPaciente";


interface DatosIdentificacionPacienteProps extends DatosIdentificacionData {
import type { InformacionPaciente } from "@/interfaces/historiaClinica/InformacionPaciente";

interface DatosIdentificacionPacienteProps extends InformacionPaciente {
  onChange?: (data: InformacionPaciente) => void;
  disabled?: boolean;
}


// --- Componente Principal ---

export default function DatosIdentificacionPaciente({
  nombreCompleto = "",
  fechaNacimiento = "",
  edad = 0,
  genero = "",
  estadoCivil = "",
  ocupacion = "",
  nivelEducativo = "",
  direccion = "",
  telefono = "",
  correoElectronico = "",
  personaContacto = "",
  parentesco = "",
  telefonoContacto = "",
  procedencia = "", // **Ajuste:** Inicializado como string (selección única)
  motivoConsulta = "",
  onChange,
  // Esta prop 'disabled' puede ser usada para deshabilitar desde el padre,
  // pero la deshabilitación por existencia de paciente tiene prioridad.
  disabled = false, 
}: DatosIdentificacionPacienteProps) {

  // **Ajuste:** Inicializar el estado con el valor de la prop `procedencia`
  const [formData, setFormData] = useState<InformacionPaciente>({
    hcId: 0,
    nombreCompleto,
    edad,
    genero,
    estadoCivil,
    ocupacion,
    nivelEducativo,
    direccion,
    telefono,
    email: correoElectronico,
    personaContacto,
    parentescoContacto: parentesco,
    telefonoContacto,
    procedencia,
    motivoConsulta,
  });

  const [telefonoError, setTelefonoError] = useState<string>("");
  const [telefonoContactoError, setTelefonoContactoError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  
  
  const { getItem } = useInformacionPaciente();
  // Almacena los datos del paciente si existe
  const [pacienteExistente, setPacienteExistente] = useState<DatosIdentificacionData | null>(null);
    const [pacienteExistente, setPacienteExistente] = useState<InformacionPaciente | null>(null);
  const [loadingPaciente, setLoadingPaciente] = useState(true);

  // --- Lógica de Petición al Servidor (useInformacionPaciente) ---
  useEffect(() => {
    // Aquí es donde se hace la petición. Usar getItem(id)
    // Usaremos un ID de ejemplo (2). Debes cambiarlo por tu ID real.
    getItem(2)
      .then((data) => {
        if (data) {
          setPacienteExistente(data);
          // Si existe, llenamos el formulario con sus datos
          setFormData(data); 
        }
        setLoadingPaciente(false);
      })
      .catch(() => {
        // En caso de error, también finalizamos la carga
        setLoadingPaciente(false);
      });
  }, [getItem]);

  // Si está cargando, mostramos un loader
  if (loadingPaciente) return <div>Cargando datos del paciente...</div>;

  // **Lógica Central de Deshabilitación:**
  // Los campos están deshabilitados si:
  // 1. El paciente existe (!!pacienteExistente)
  // 2. O la prop 'disabled' del componente es true.
  const camposDeshabilitados = !!pacienteExistente || disabled;


  // --- Efectos y Handlers ---

  // Notificar cambios al componente padre
  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData, onChange]);

  // Calcular edad automáticamente cuando cambia la fecha de nacimiento
  useEffect(() => {
    if (formData.fechaNacimiento) {
      const edadCalculada = calcularEdad(formData.fechaNacimiento);
      setFormData((prev) => ({
        ...prev,
        edad: edadCalculada,
      }));
    }
  }, [formData.fechaNacimiento]);

  const calcularEdad = (fechaNacimiento: string): number => {
    if (!fechaNacimiento) return 0;

    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edadCalculada = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edadCalculada--;
    }

    return edadCalculada;
  };

  const handleInputChange = (
  const handleInputChange = (
    field: keyof InformacionPaciente,
    value: string | number 
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Validaciones específicas
    if (field === "telefono") {
      validateTelefono(value as string, setTelefonoError);
    } else if (field === "telefonoContacto") {
      validateTelefono(value as string, setTelefonoContactoError);
    } else if (field === "email") {
      validateEmail(value as string);
    }
  };

  const validateTelefono = (
    value: string,
    setError: (error: string) => void
  ) => {
    // Formato: ###-####-####
    const telefonoPattern = /^\d{3}-\d{4}-\d{4}$/;

    if (!value) {
      setError("");
      return;
    }

    if (!telefonoPattern.test(value)) {
      setError("Formato debe ser ###-####-#### (ejemplo: 502-1234-5678)");
    } else {
      setError("");
    }
  };

  const validateEmail = (value: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) {
      setEmailError("");
      return;
    }

    if (!emailPattern.test(value)) {
      setEmailError("Formato de correo electrónico inválido");
    } else {
      setEmailError("");
    }
  };


  // --- Renderizado del Formulario ---
  return (
    <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">
        Datos de Identificación del Paciente
      </h2>
      {!!pacienteExistente && (
        <div className="mb-4 rounded-lg bg-yellow-100 p-3 text-sm text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
          **Modo Solo Lectura:** Los datos de este paciente ya existen y han sido cargados. El formulario está deshabilitado para edición.
        </div>
      )}
      <div className="space-y-6">
        <DatosPersonalesForm
        <DatosPersonalesForm
          formData={{
            nombreCompleto: formData.nombreCompleto,
            edad: formData.edad,
            genero: formData.genero,
            estadoCivil: formData.estadoCivil,
            ocupacion: formData.ocupacion,
            nivelEducativo: formData.nivelEducativo,
            direccion: formData.direccion,
            telefono: formData.telefono,
            correoElectronico: formData.email,
          }}
          onInputChange={(field, value) => {
            if (field === "correoElectronico") {
              handleInputChange("email", value);
            } else {
              handleInputChange(field as keyof InformacionPaciente, value);
            }
          }}
          disabled={camposDeshabilitados}
          telefonoError={telefonoError}
          emailError={emailError}
        />
        <ContactoEmergenciaForm
          formData={{
            personaContacto: formData.personaContacto,
            parentesco: formData.parentescoContacto,
            telefonoContacto: formData.telefonoContacto,
          }}
          onInputChange={(field, value) => {
            if (field === "parentesco") {
              handleInputChange("parentescoContacto", value);
            } else {
              handleInputChange(field as keyof InformacionPaciente, value);
            }
          }}
          disabled={camposDeshabilitados}
          telefonoContactoError={telefonoContactoError}
        />
        <ProcedenciaForm
          value={formData.procedencia}
          onChange={(value) => handleInputChange("procedencia", value)}
          disabled={camposDeshabilitados}
        />
        <MotivoConsultaForm
          value={formData.motivoConsulta}
          onChange={(value) => handleInputChange("motivoConsulta", value)}
          disabled={camposDeshabilitados}
        />
      </div>
    </div>
  );
}