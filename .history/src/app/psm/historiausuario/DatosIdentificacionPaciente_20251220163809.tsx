"use client";

import React, { useState, useEffect } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";
import TextArea from "@/components/form/input/TextArea";
import Radio from "@/components/form/input/Radio";




const estadoCivilOptions = [
  { value: "SOLTERO", label: "Soltero" },
  { value: "CASADO", label: "Casado" },
  { value: "DIVORCIADO", label: "Divorciado" },
  { value: "VIUDO", label: "Viudo" },
  { value: "UNION_LIBRE", label: "Unión libre" },
];

const nivelEducativoOptions = [
  { value: "PRIMARIA", label: "Primaria" },
  { value: "SEGUNDARIA", label: "Secundaria" },
  { value: "TECNICO", label: "Técnico" },
  { value: "UNIVERSITARIO", label: "Universitario" },
  { value: "POSGRADO", label: "Posgrado" },
];

const parentescoOptions = [
  { value: "PADRE", label: "Padre" },
  { value: "MADRE", label: "Madre" },
  { value: "HIJO", label: "Hijo" },
  { value: "CONYUGE", label: "Cónyuge" },
  { value: "HERMANO", label: "Hermano" },
  { value: "OTRO", label: "Otro" },
];

const procedenciaOptions = [
  { value: "autoreferido", label: "Autoreferido" },
  { value: "medico", label: "Médico" },
  { value: "familiar", label: "Familiar" },
  { value: "escuela", label: "Escuela" },
  { value: "otro", label: "Otro" },
];

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
  procedencia = [],
  motivoConsulta = "",
  onChange,
  disabled = false,
  
}: DatosIdentificacionPacienteProps) {
  const [formData, setFormData] = useState<DatosIdentificacionData>({
    nombreCompleto,
    fechaNacimiento,
    edad,
    genero,
    estadoCivil,
    ocupacion,
    nivelEducativo,
    direccion,
    telefono,
    correoElectronico,
    personaContacto,
    parentesco,
    telefonoContacto,
    procedencia,
    motivoConsulta,
  });

  const [telefonoError, setTelefonoError] = useState<string>("");
  const [telefonoContactoError, setTelefonoContactoError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  // Notificar cambios al componente padre
  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData, onChange]);

  // Calcular edad automáticamente cuando cambia la fecha de nacimiento
  useEffect(() => {
    if (formData.fechaNacimiento) {
      const edad = calcularEdad(formData.fechaNacimiento);
      setFormData((prev) => ({
        ...prev,
        edad,
      }));
    }
  }, [formData.fechaNacimiento]);

  const calcularEdad = (fechaNacimiento: string): number => {
    if (!fechaNacimiento) return 0;

    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return edad;
  };

  const handleInputChange = (
    field: keyof DatosIdentificacionData,
    value: string | number | string[]
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
    } else if (field === "correoElectronico") {
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

const handleProcedenciaChange = (value: string, checked: boolean) => {
  setFormData((prev) => {
    const newProcedencia = checked
      ? [...prev.procedencia, value]
      : prev.procedencia.filter((p) => p !== value);

    return {
      ...prev,
      procedencia: newProcedencia,
    };
  });
};


  return (
    <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">
        Datos de Identificación del Paciente
      </h2>

      <div className="space-y-6">
        {/* Nombre Completo */}
        <div>
          <Label htmlFor="nombreCompleto">
            Nombre Completo<span className="text-error-500">*</span>
          </Label>
          <Input
            type="text"
            id="nombreCompleto"
            name="nombreCompleto"
            placeholder="Nombre y apellidos completos"
            value={formData.nombreCompleto}
            onChange={(e) => handleInputChange("nombreCompleto", e.target.value)}
            disabled={disabled}
            required
            className="max-w-full"
          />
        </div>

        {/* Fecha de Nacimiento y Edad */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <DatePicker
              id="fechaNacimiento"
              label="Fecha de Nacimiento"
              placeholder="Seleccione la fecha"
              defaultDate={formData.fechaNacimiento || undefined}
              onChange={(selectedDates) => {
                if (selectedDates && selectedDates.length > 0) {
                  const date = selectedDates[0];
                  const formattedDate = date.toISOString().split("T")[0];
                  handleInputChange("fechaNacimiento", formattedDate);
                }
              }}
            />
          </div>

          <div>
            <Label htmlFor="edad">Edad</Label>
            <Input
              type="number"
              id="edad"
              name="edad"
              placeholder="Calculado automáticamente"
              value={formData.edad || ""}
              disabled
              className="max-w-full cursor-not-allowed"
            />
          </div>
        </div>

        {/* Género */}
        <div>
          <Label>
            Género<span className="text-error-500">*</span>
          </Label>
          <div className="mt-3 space-y-3">
            <Radio
              id="genero-femenino"
              name="genero"
              value="femenino"
              label="Femenino"
              checked={formData.genero === "femenino"}
              onChange={() => handleInputChange("genero", "femenino")}
              disabled={disabled}
            />
            <Radio
              id="genero-masculino"
              name="genero"
              value="masculino"
              label="Masculino"
              checked={formData.genero === "masculino"}
              onChange={() => handleInputChange("genero", "masculino")}
              disabled={disabled}
            />


          </div>
        </div>

        {/* Estado Civil y Nivel Educativo */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="estadoCivil">
              Estado Civil<span className="text-error-500">*</span>
            </Label>
            <Select
              options={estadoCivilOptions}
              placeholder="Seleccione estado civil"
              onChange={(value) => handleInputChange("estadoCivil", value)}
              defaultValue={formData.estadoCivil}
              className="max-w-full"
            />
          </div>

          <div>
            <Label htmlFor="nivelEducativo">
              Nivel Educativo<span className="text-error-500">*</span>
            </Label>
            <Select
              options={nivelEducativoOptions}
              placeholder="Seleccione nivel educativo"
              onChange={(value) => handleInputChange("nivelEducativo", value)}
              defaultValue={formData.nivelEducativo}
              className="max-w-full"
            />
          </div>
        </div>

        {/* Ocupación */}
        <div>
          <Label htmlFor="ocupacion">Ocupación</Label>
          <Input
            type="text"
            id="ocupacion"
            name="ocupacion"
            placeholder="Ingrese la ocupación"
            value={formData.ocupacion}
            onChange={(e) => handleInputChange("ocupacion", e.target.value)}
            disabled={disabled}
            className="max-w-full"
          />
        </div>

        {/* Dirección */}
        <div>
          <Label htmlFor="direccion">Dirección</Label>
          <TextArea
            id="direccion"
            name="direccion"
            placeholder="Ingrese la dirección completa"
            value={formData.direccion}
            onChange={(e) => handleInputChange("direccion", e.target.value)}
            disabled={disabled}
            className="max-w-full"
            rows={3}
          />
        </div>

        {/* Teléfono y Correo Electrónico */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="telefono">
              Teléfono<span className="text-error-500">*</span>
            </Label>
            <Input
              type="tel"
              id="telefono"
              name="telefono"
              placeholder="###-####-####"
              value={formData.telefono}
              onChange={(e) => {
                const value = e.target.value;
                // Permitir solo números y guión
                if (/^[\d-]*$/.test(value)) {
                  handleInputChange("telefono", value);
                }
              }}
              disabled={disabled}
              required
              error={!!telefonoError}
              hint={telefonoError}
              className="max-w-full"
            />
          </div>

          <div>
            <Label htmlFor="correoElectronico">Correo Electrónico</Label>
            <Input
              type="email"
              id="correoElectronico"
              name="correoElectronico"
              placeholder="ejemplo@correo.com"
              value={formData.correoElectronico}
              onChange={(e) =>
                handleInputChange("correoElectronico", e.target.value)
              }
              disabled={disabled}
              error={!!emailError}
              hint={emailError}
              className="max-w-full"
            />
          </div>
        </div>

        {/* Sección de Contacto de Emergencia */}
        <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-white">
            Contacto de Emergencia
          </h3>

          <div className="space-y-6">
            {/* Persona de Contacto */}
            <div>
              <Label htmlFor="personaContacto">
                Persona de Contacto<span className="text-error-500">*</span>
              </Label>
              <Input
                type="text"
                id="personaContacto"
                name="personaContacto"
                placeholder="Nombre completo del contacto"
                value={formData.personaContacto}
                onChange={(e) =>
                  handleInputChange("personaContacto", e.target.value)
                }
                disabled={disabled}
                required
                className="max-w-full"
              />
            </div>

            {/* Parentesco y Teléfono Contacto */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="parentesco">
                  Parentesco<span className="text-error-500">*</span>
                </Label>
                <Select
                  options={parentescoOptions}
                  placeholder="Seleccione parentesco"
                  onChange={(value) => handleInputChange("parentesco", value)}
                  defaultValue={formData.parentesco}
                  className="max-w-full"
                />
              </div>

              <div>
                <Label htmlFor="telefonoContacto">
                  Teléfono de Contacto<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="tel"
                  id="telefonoContacto"
                  name="telefonoContacto"
                  placeholder="###-####-####"
                  value={formData.telefonoContacto}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Permitir solo números y guión
                    if (/^[\d-]*$/.test(value)) {
                      handleInputChange("telefonoContacto", value);
                    }
                  }}
                  disabled={disabled}
                  required
                  error={!!telefonoContactoError}
                  hint={telefonoContactoError}
                  className="max-w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Procedencia */}
        <div>
          <Label>
            Procedencia<span className="text-error-500">*</span>
          </Label>
          <div className="mt-3 space-y-3">
 {procedenciaOptions.map((option) => (
      <Radio
        key={option.value}
        id={`procedencia-${option.value}`}
        name="procedencia"
        value={option.value}
        label={option.label}
        checked={formData.procedencia === option.value}
        onChange={() => handleInputChange("procedencia", option.value)}
        disabled={disabled}
      />
    ))}

          </div>
        </div>

        {/* Motivo de Consulta */}
        <div>
          <Label htmlFor="motivoConsulta">
            Motivo de Consulta<span className="text-error-500">*</span>
          </Label>
          <TextArea
            id="motivoConsulta"
            name="motivoConsulta"
            placeholder="Describa el motivo de consulta (máximo 500 caracteres)"
            value={formData.motivoConsulta}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 500) {
                handleInputChange("motivoConsulta", value);
              }
            }}
            disabled={disabled}
            required
            className="max-w-full"
            rows={5}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {formData.motivoConsulta.length}/500 caracteres
          </p>
        </div>
      </div>
    </div>
  );
}
