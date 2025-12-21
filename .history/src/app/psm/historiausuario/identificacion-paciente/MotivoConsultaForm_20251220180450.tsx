import React from "react";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";

interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled: true;
}

export default function MotivoConsultaForm({ value, onChange, disabled }: Props) {
  return (
    <div>
      <Label htmlFor="motivoConsulta">
        Motivo de Consulta<span className="text-error-500">*</span>
      </Label>
      <TextArea
        id="motivoConsulta"
        name="motivoConsulta"
        placeholder="Describa el motivo de consulta (máximo 500 caracteres)"
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          if (val.length <= 500) {
            onChange(val);
          }
        }}
        required
        className="max-w-full"
        rows={5}
      />
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {value.length}/500 caracteres
      </p>
    </div>
  );
}
