import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import TextArea from "@/components/form/input/TextArea";
import Button from "@/components/ui/button/Button";
import { EscalaPruebaAplicada } from "@/interfaces/historiaClinica/EscalaPrueba";

interface EscalaPruebaFormProps {
  prueba: EscalaPruebaAplicada;
  pruebasOptions: { value: string; label: string }[];
  onChange: (campo: keyof EscalaPruebaAplicada, valor: any) => void;
  onFileChange: (file: File) => void;
  onSave: () => void;
  onCancel: () => void;
  disabled?: boolean;
}

const EscalaPruebaForm: React.FC<EscalaPruebaFormProps> = ({
  prueba,
  pruebasOptions,
  onChange,
  onFileChange,
  onSave,
  onCancel,
  disabled = false,
}) => (
  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-5 mb-4 dark:border-yellow-700 dark:bg-yellow-900">
    <Label>Prueba</Label>
    <Select
      options={pruebasOptions}
      defaultValue={String(prueba.prueba || prueba.prueba)}
      onChange={(value) => onChange("prueba", value)}
    />
    <Label>Fecha de aplicación</Label>
    <Input
      type="date"
      value={prueba.fechaAplicacion || ""}
      onChange={(e) => onChange("fechaAplicacion", e.target.value)}
      disabled={disabled}
    />
    <Label>Resultado</Label>
    <Input
      type="number"
      value={prueba.resultado ?? ""}
      onChange={(e) => onChange("resultado", e.target.value)}
      disabled={disabled}
    />
    <Label>Interpretación</Label>
    <TextArea
      value={prueba.interpretacion || ""}
      onChange={(value) => onChange("interpretacion",value)}
      disabled={disabled}
    />
    <Label>Archivo adjunto</Label>
    <Input
      type="file"
      //accept=".pdf,.png,.jpg,.jpeg"
      onChange={(e) => {
        if (e.target.files?.[0]) onFileChange(e.target.files[0]);
      }}
      disabled={disabled}
    />
    <div className="flex gap-2 mt-4">
      <Button onClick={onSave} disabled={disabled} variant="primary" size="sm">
        Guardar
      </Button>
      <Button onClick={onCancel}  className="bg-red-500 hover:bg-red-600" size="sm">
        Cancelar
      </Button>
    </div>
  </div>
);

export default EscalaPruebaForm;