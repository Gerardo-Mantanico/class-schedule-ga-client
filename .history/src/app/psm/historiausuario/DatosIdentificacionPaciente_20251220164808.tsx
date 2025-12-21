"use client";

import React, { useState, useEffect } from "react";
// Asegúrate de que tus componentes de formulario están importados correctamente
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";
import TextArea from "@/components/form/input/TextArea";
import Radio from "@/components/form/input/Radio"; // Asumiendo que Radio es la opción deseada
import { useInformacionPaciente } from "@/hooks/historaClinica/useInformacionPaciente";

// --- Definiciones de Tipos (Asegúrate de que tus tipos existen en tu proyecto) ---
// Simulación de los tipos para que el ejemplo sea completo
interface DatosIdentificacionData {
  nombreCompleto: string;
  fechaNacimiento: string;
  edad: number;
  genero: string;
  estadoCivil: string;
  ocupacion: string;
  nivelEducativo: string;
  direccion: string;
  telefono: string;
  correoElectronico: string;
  personaContacto: string;
  parentesco: string;
  telefonoContacto: string;
  // **Ajuste:** Asumiendo que 'procedencia' es una selección única (string)
  // Si debe ser múltiple (string[]), usar Checkbox y ajustar el state y handler
  procedencia: string; 
  motivoConsulta: string;
}

interface DatosIdentificacionPacienteProps extends DatosIdentificacionData {
  onChange?: (data: DatosIdentificacionData) => void;
  disabled?: boolean;
}

// --- Opciones de los Selects/Radios ---

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
  
  
  const { getItem } = useInformacionPaciente();
  // Almacena los datos del paciente si existe
  const [pacienteExistente, setPacienteExistente] = useState<DatosIdentificacionData | null>(null);
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
    field: keyof DatosIdentificacionData,
    // **Ajuste de tipo:** Ahora solo espera string o number, ya que procedencia es string.
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


  // --- Renderizado del Formulario ---

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">
        Datos de Identificación del Paciente
      </h2>

      {/* Mensaje de Deshabilitación/Lectura */}
      {!!pacienteExistente && (
        <div className="mb-4 rounded-lg bg-yellow-100 p-3 text-sm text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
          **Modo Solo Lectura:** Los datos de este paciente ya existen y han sido cargados. El formulario está deshabilitado para edición.
        </div>
      )}

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
            // **Aplicación de la lógica de deshabilitación**
            disabled={camposDeshabilitados} 
            required
            className="max-w-full"
          />
        </div>

        {/* Fecha de Nacimiento y Edad */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            {/* El DatePicker necesita tener su propia lógica de disabled */}
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
              // **Aplicación de la lógica de deshabilitación**
              disabled={camposDeshabilitados} 
            />
          </div>

          <div>
            <Label htmlFor="edad">Edad</Label>
            {/* Edad siempre es disabled porque es calculado */}
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
              // **Aplicación de la lógica de deshabilitación**
              disabled={camposDeshabilitados}
            />
            <Radio
              id="genero-masculino"
              name="genero"
              value="masculino"
              label="Masculino"
              checked={formData.genero === "masculino"}
              onChange={() => handleInputChange("genero", "masculino")}
              // **Aplicación de la lógica de deshabilitación**
              disabled={camposDeshabilitados}
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
              // **Aplicación de la lógica de deshabilitación**
              disabled={camposDeshabilitados} 
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
              // **Aplicación de la lógica de deshabilitación**
              disabled={camposDeshabilitados}
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
            // **Aplicación de la lógica de deshabilitación**
            disabled={camposDeshabilitados}
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
            // **Aplicación de la lógica de deshabilitación**
            disabled={camposDeshabilitados}
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
              // **Aplicación de la lógica de deshabilitación**
              disabled={camposDeshabilitados} 
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
              // **Aplicación de la lógica de deshabilitación**
              disabled={camposDeshabilitados}
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
                // **Aplicación de la lógica de deshabilitación**
                disabled={camposDeshabilitados}
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
                  // **Aplicación de la lógica de deshabilitación**
                  disabled={camposDeshabilitados}
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
                  // **Aplicación de la lógica de deshabilitación**
                  disabled={camposDeshabilitados}
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
                // Si 'procedencia' ahora es un string, se compara directamente.
                checked={formData.procedencia === option.value} 
                onChange={() => handleInputChange("procedencia", option.value)}
                // **Aplicación de la lógica de deshabilitación**
                disabled={camposDeshabilitados}
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
            // **Aplicación de la lógica de deshabilitación**
            disabled={camposDeshabilitados}
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