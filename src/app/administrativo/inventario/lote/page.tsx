"use client";

import React from "react";
import { Column } from "@/components/ui/table/GenericTable";
import GenericPage from "@/components/administrativo/GenericPage";
import GenericForm from "@/components/administrativo/GenericForm";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import Select from "@/components/form/Select";
import { useInventario } from "@/hooks/useInventario";

interface Lote {
  id: number;
  medicamentoId: number;
  proveedorId: number;
  ubicacionId: number;
  numeroLote: string;
  fechaVencimiento: string;
  cantidad: number;
  precioCompra: number;
}

interface LoteForm {
  id?: number;
  medicamentoId?: number;
  proveedorId?: number;
  ubicacionId?: number;
  numeroLote?: string;
  fechaVencimiento?: string;
  cantidad?: number;
  precioCompra?: number;
}

export default function LotesPage() {
  const { lotes, medicamentos, proveedores, ubicaciones } = useInventario();

  const columns: Column<Lote>[] = [
  { header: "Medicamento", accessorKey: "medicamentoId", cell: (r) => medicamentos.items.find((m) => m.id === r.medicamentoId)?.nombreComercial ?? "—" },
    { header: "Proveedor", accessorKey: "proveedorId", cell: (r) => proveedores.items.find((p) => p.id === r.proveedorId)?.nombre ?? "—" },
    { header: "Ubicación", accessorKey: "ubicacionId", cell: (r) => ubicaciones.items.find((u) => u.id === r.ubicacionId)?.nombre ?? "—" },
    { header: "Número lote", accessorKey: "numeroLote" },
    { header: "Vencimiento", accessorKey: "fechaVencimiento", cell: (r) => r.fechaVencimiento ? new Date(r.fechaVencimiento).toLocaleDateString() : "—" },
    { header: "Cantidad", accessorKey: "cantidad" },
    { header: "Precio compra", accessorKey: "precioCompra", cell: (r) => `Q ${Number(r.precioCompra).toFixed(2)}` },
  ];

  return (
    <GenericPage<Lote>
      title="Ingreso de lotes"
      items={lotes.items}
      fetchItems={lotes.fetchItems}
      deleteItem={lotes.deleteItem}
      columns={columns}
      itemName="Lote"
      itemsPerPage={10}
      modalSize="md"
    >
      <GenericForm<LoteForm>
        title="Lote"
        description="Crear / editar lote"
        initial={(item) =>
          item
            ? {
                id: (item as any).id,
                medicamentoId: (item as any).medicamentoId,
                proveedorId: (item as any).proveedorId,
                ubicacionId: (item as any).ubicacionId,
                numeroLote: (item as any).numeroLote,
                fechaVencimiento: (item as any).fechaVencimiento,
                cantidad: (item as any).cantidad,
                precioCompra: (item as any).precioCompra,
              }
            : ({})
        }
        onSubmit={(data) => {
          const payload: any = {
            medicamentoId: data.medicamentoId,
            proveedorId: data.proveedorId,
            ubicacionId: data.ubicacionId,
            numeroLote: data.numeroLote,
            fechaVencimiento: data.fechaVencimiento,
            cantidad: data.cantidad ?? 0,
            precioCompra: data.precioCompra ?? 0,
          };

          return data.id ? lotes.updateItem(data.id, payload) : lotes.createItem(payload);
        }}
        renderFields={({ values, setField, isSaving, onCancel }) => (
          <>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <FormSelect
                label="Medicamento"
                options={medicamentos.items.map((m) => ({ value: String(m.id), label: m.nombreComercial }))}
                value={values.medicamentoId ? String(values.medicamentoId) : ""}
                onChange={(v: any) => setField("medicamentoId", v)}
              />

              <FormSelect
                label="Proveedor"
                options={proveedores.items.map((p) => ({ value: String(p.id), label: p.nombre }))}
                value={values.proveedorId ? String(values.proveedorId) : ""}
                onChange={(v: any) => setField("proveedorId", v)}
              />
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <FormSelect
                label="Ubicación"
                options={ubicaciones.items.map((u) => ({ value: String(u.id), label: u.nombre }))}
                value={values.ubicacionId ? String(values.ubicacionId) : ""}
                onChange={(v: any) => setField("ubicacionId", v)}
              />

              <FormInput label="Número de lote" value={values.numeroLote} onChange={(v: any) => setField("numeroLote", v)} />
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div className="flex flex-col gap-1">
                <Label>Fecha de vencimiento</Label>
                <Input type="date" value={values.fechaVencimiento ?? ""} onChange={(e) => setField("fechaVencimiento", e.target.value)} />
              </div>

              <FormNumber label="Cantidad" value={values.cantidad} onChange={(v: any) => setField("cantidad", v)} />
            </div>

            <FormNumber label="Precio de compra" step={0.01} value={values.precioCompra} onChange={(v: any) => setField("precioCompra", v)} />

            <div className="mt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving || !values.medicamentoId}>
                Guardar
              </Button>
            </div>
          </>
        )}
      />
    </GenericPage>
  );
}

function FormInput({ label, value, onChange }: any) {
  return (
    <div className="flex flex-col gap-1">
      <Label>{label}</Label>
      <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function FormNumber({ label, value, onChange, step }: any) {
  return (
    <div className="flex flex-col gap-1">
      <Label>{label}</Label>
      <Input type="number" step={step} value={value ?? ""} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

function FormSelect({ label, options, value, onChange }: any) {
  return (
    <div className="flex flex-col gap-1">
      <Label>{label}</Label>
      <Select options={options} defaultValue={value} onChange={(v) => onChange(v ? Number(v) : undefined)} />
    </div>
  );
}
