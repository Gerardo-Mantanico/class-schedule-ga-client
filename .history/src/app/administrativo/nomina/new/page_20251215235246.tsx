"use client";

import React from "react";
import GenericForm from "@/components/administrativo/GenericForm";
import { useNomina } from "@/hooks/useNomina";
import { useUser } from "@/hooks/useUser";
import Select from "@/components/form/Select";
import { useRouter } from "next/navigation";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";

interface NominaForm {
  userId: number;
  periodo: string;
  salarioBase: number;
  metodoPagoId: number;
  detallePago: string;
  fechaCierre: string;
}

export default function NewNominaPage() {
  const router = useRouter();
  const { nominas, tipoPago } = useNomina();
  const { users, fetchUsers } = useUser();

  React.useEffect(() => {
    fetchUsers();
    tipoPago.fetchItems();
  }, []);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <GenericForm<NominaForm>
        title="Nueva Nómina"
        description="Complete el formulario para crear una nueva nómina"
        onSubmit={async (data) => {
          const payload = {
            userId: data.userId,
            periodo: data.periodo,
            salarioBase: data.salarioBase,
            metodoPagoId: data.metodoPagoId,
            detallePago: data.detallePago,
            fechaCierre: data.fechaCierre,
          };

          const success = await nominas.createItem(payload);
          if (success) {
            router.push("/administrativo/nomina");
          }
          return success;
        }}
        onCancel={() => router.push("/administrativo/nomina")}
        renderFields={({ values, setField, isSaving, onCancel }) => (
          <>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <FormSelect
               //agregar el componente de busqueda de empleados
              />

              <FormInput
                label="Periodo"
                type="date"
                value={values.periodo || ""}
                onChange={(v: any) => setField("periodo", v)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <FormNumber
                label="Salario Base"
                value={values.salarioBase}
                onChange={(v: any) => setField("salarioBase", v)}
                step="0.01"
                min="0"
              />

              <FormSelect
                label="Método de Pago"
                options={tipoPago.items.map((t) => ({
                  value: String(t.id),
                  label: t.descripcion,
                }))}
                value={values.metodoPagoId ? String(values.metodoPagoId) : ""}
                onChange={(v: any) => setField("metodoPagoId", v)}
              />
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5">
              <FormInput
                label="Detalle de Pago"
                value={values.detallePago || ""}
                onChange={(v: any) => setField("detallePago", v)}
              />
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <FormInput
                label="Fecha de Cierre"
                type="date"
                value={values.fechaCierre || ""}
                onChange={(v: any) => setField("fechaCierre", v)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={isSaving}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
              >
                {isSaving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </>
        )}
      />
    </div>
  );
}

// Helper Components
function FormInput({ label, value, onChange, type = "text", min }: any) {
  return (
    <div className="flex flex-col gap-1">
      <Label>{label}</Label>
      <Input type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} min={min} />
    </div>
  );
}

function FormNumber({ label, value, onChange, step, min }: any) {
  return (
    <div className="flex flex-col gap-1">
      <Label>{label}</Label>
      <Input
        type="number"
        step={step}
        value={value ?? ""}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
      />
    </div>
  );
}

function FormSelect({ label, options, value, onChange }: any) {
  return (
    <div className="flex flex-col gap-1">
      <Label>{label}</Label>
      <Select
        options={options}
        defaultValue={value}
        onChange={(v) => onChange(v ? Number(v) : undefined)}
      />
    </div>
  );
}
