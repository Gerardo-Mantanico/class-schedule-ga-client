import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";

interface Props {
  formData: any;
  onInputChange: (field: string, value: string | number) => void;
  disabled: boolean;
  telefonoContactoError: string;
}

const parentescoOptions = [
  { value: "PADRE", label: "Padre" },
  { value: "MADRE", label: "Madre" },
  { value: "HIJO", label: "Hijo" },
  { value: "CONYUGE", label: "Cónyuge" },
  { value: "HERMANO", label: "Hermano" },
  { value: "OTRO", label: "Otro" },
];

export default function ContactoEmergenciaForm({
  formData,
  onInputChange,
  disabled,
  telefonoContactoError,
}: Props) {
  return (
    <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-white">
        Contacto de Emergencia
      </h3>
      <div className="space-y-6">
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
            onChange={(e) => onInputChange("personaContacto", e.target.value)}
            disabled={disabled}
            required
            className="max-w-full"
          />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="parentesco">
              Parentesco<span className="text-error-500">*</span>
            </Label>
            <Select
              options={parentescoOptions}
              placeholder="Seleccione parentesco"
              onChange={(value) => onInputChange("parentesco", value)}
              defaultValue={formData.parentesco}
              disabled={disabled}
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
                if (/^[\d-]*$/.test(value)) {
                  onInputChange("telefonoContacto", value);
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
  );
}
