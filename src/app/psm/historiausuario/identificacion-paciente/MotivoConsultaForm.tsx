import React from "react";
import Label from "@/components/form/Label";
import TextCongreso from "@/components/form/input/TextArea";

interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function MotivoConsultaForm({ value, onChange, disabled }: Props) {
  return (
    <div>
      <Label htmlFor="motivoConsulta">
        Motivo de Consulta<span className="text-error-500">*</span>
      </Label>
     <TextCongreso
  placeholder="Describa el motivo de consulta (máximo 500 caracteres)"
  value={value}
  onChange={(val) => {
    if (val.length <= 500) {
      onChange(val);
    }
  }}
  className="max-w-full"
  rows={5}
  disabled={disabled}
/>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {value.length}/500 caracteres
      </p>
    </div>
  );
}