import React from "react";
import Label from "@/components/form/Label";
import Radio from "@/components/form/input/Radio";

const procedenciaOptions = [
  { value: "autoreferido", label: "Autoreferido" },
  { value: "medico", label: "Médico" },
  { value: "familiar", label: "Familiar" },
  { value: "escuela", label: "Escuela" },
  { value: "otro", label: "Otro" },
];

interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export default function ProcedenciaForm({ value, onChange, disabled }: Props) {
  return (
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
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}
