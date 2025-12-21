import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";

interface Props {
  formData: any;
  onInputChange: (field: string, value: string | number) => void;
  disabled: boolean;
  telefonoError: string;
  emailError: string;
}

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

export default function DatosPersonalesForm({
  formData,
  onInputChange,
  disabled,
  telefonoError,
  emailError,
}: Props) {
  return (
    <>
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
          onChange={(e) => onInputChange("nombreCompleto", e.target.value)}
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
                onInputChange("fechaNacimiento", formattedDate);
              }
            }}
            disabled={disabled}
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
          <Input
            as="radio"
            id="genero-femenino"
            name="genero"
            value="femenino"
            label="Femenino"
            checked={formData.genero === "femenino"}
            onChange={() => onInputChange("genero", "femenino")}
            disabled={disabled}
          />
          <Input
            as="radio"
            id="genero-masculino"
            name="genero"
            value="masculino"
            label="Masculino"
            checked={formData.genero === "masculino"}
            onChange={() => onInputChange("genero", "masculino")}
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
            onChange={(value) => onInputChange("estadoCivil", value)}
            defaultValue={formData.estadoCivil}
            disabled={disabled}
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
            onChange={(value) => onInputChange("nivelEducativo", value)}
            defaultValue={formData.nivelEducativo}
            disabled={disabled}
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
          onChange={(e) => onInputChange("ocupacion", e.target.value)}
          disabled={disabled}
          className="max-w-full"
        />
      </div>

      {/* Dirección */}
      <div>
        <Label htmlFor="direccion">Dirección</Label>
        <Input
          as="textarea"
          id="direccion"
          name="direccion"
          placeholder="Ingrese la dirección completa"
          value={formData.direccion}
          onChange={(e) => onInputChange("direccion", e.target.value)}
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
              if (/^[\d-]*$/.test(value)) {
                onInputChange("telefono", value);
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
            onChange={(e) => onInputChange("correoElectronico", e.target.value)}
            disabled={disabled}
            error={!!emailError}
            hint={emailError}
            className="max-w-full"
          />
        </div>
      </div>
    </>
  );
}
