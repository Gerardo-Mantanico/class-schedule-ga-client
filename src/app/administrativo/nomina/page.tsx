"use client";

import React from "react";
import Link from "next/link";

import { Column } from "@/components/ui/table/GenericTable";
import GenericPage from "@/components/administrativo/GenericPage";
import GenericForm from "@/components/administrativo/GenericForm";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import Select from "@/components/form/Select";
import { useInventario } from "@/hooks/useInventario";

import {
  FolderIcon,
  BoxCubeIcon,
  BoxIconLine,
  BoltIcon,
  GroupIcon,
  PageIcon,
} from "@/icons";

/* =======================
   ENTIDADES
======================= */

export interface UnidadMedida {
  id: number;
  nombre: string;
  simbolo: string;
}

export interface PrincipioActivo {
  id: number;
  nombre: string;
  concentracion: number;
  unidadMedida: UnidadMedida | null;
}

export interface FormaFarmaceutica {
  id: number;
  nombre: string;
}

export interface Categoria {
  id: number;
  nombre: string;
}

export interface Medicamento {
  id: number;
  nombreComercial: string;
  formaFarmaceutica: FormaFarmaceutica | null;
  categoria: Categoria | null;
  unidadesPorEmpaque: number;
  stockMinimo: number;
  stockTotal?: number;
  precioVenta: number;
  activo: boolean;
  principiosActivos: PrincipioActivo[];
  
}

/* =======================
   FORM DTO
======================= */

interface MedicamentoForm {
  id?: number;
  nombreComercial: string;
  formaFarmaceuticaId?: number;
  categoriaId?: number;
  unidadesPorEmpaque?: number;
  stockMinimo?: number;
  stockTotal?: number;
  precioVenta?: number;
  activo?: boolean;
  principioActivoId?: number;
  concentracion?: number;
  unidadMedidaId?: number;
}

/* =======================
   PAGE
======================= */

export default function MedicamentosPage() {
  const {
    medicamentos,
    categorias,
    formas,
    principios,
    unidades,
  } = useInventario();

  const columns: Column<Medicamento>[] = [
    { header: "Nombre comercial", accessorKey: "nombreComercial" },
    {
      header: "Forma farmacéutica",
      accessorKey: "formaFarmaceutica",
      cell: (row) => row.formaFarmaceutica?.nombre ?? "—",
    },
    {
      header: "Categoría",
      accessorKey: "categoria",
      cell: (row) => row.categoria?.nombre ?? "—",
    },
    { header: "Unidades / Empaque", accessorKey: "unidadesPorEmpaque" },
    { header: "Stock mínimo", accessorKey: "stockMinimo" },
    { header: "Stock total", accessorKey: "stockTotal" },
    {
      header: "Precio",
      accessorKey: "precioVenta",
      cell: (row) => `Q ${row.precioVenta.toFixed(2)}`,
    },
    {
      header: "Principios activos",
      accessorKey: "principiosActivos",
      cell: (row) =>
        row.principiosActivos?.length
          ? row.principiosActivos
              .map(
                (p) =>
                  `${p.nombre} ${p.concentracion}${p.unidadMedida?.simbolo ?? ""}`
              )
              .join(", ")
          : "—",
    },
    {
      header: "Estado",
      accessorKey: "activo",
      cell: (row) => (row.activo ? "Activo" : "Inactivo"),
    },
  ];

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="bg-white rounded-xl shadow p-6 dark:bg-gray-800">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Nomina
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Administración de medicamentos
        </p>
      </div>

      {/* CATÁLOGOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CatalogCard icon={<FolderIcon />} title="Categorías" href="/administrativo/inventario/catalogos/categorias" />
        <CatalogCard icon={<BoxCubeIcon />} title="Unidades / Empaque" href="/administrativo/inventario/catalogos/unidades" />
        <CatalogCard icon={<BoxIconLine />} title="Forma farmacéutica" href="/administrativo/inventario/catalogos/formas" />
        <CatalogCard icon={<BoltIcon />} title="Principios activos" href="/administrativo/inventario/catalogos/principios" />
        <CatalogCard icon={<GroupIcon />} title="Proveedores" href="/administrativo/inventario/catalogos/proveedores" />
        <CatalogCard icon={<PageIcon />} title="Ubicaciones" href="/administrativo/inventario/catalogos/ubicaciones" />
        <CatalogCard icon={<PageIcon />} title="Ingresar Medicamento" href="/administrativo/inventario/lote" />
  
      </div>

      {/* TABLA + FORM */}
      <GenericPage<Medicamento>
        title="Medicamentos"
        items={medicamentos.items}
        fetchItems={medicamentos.fetchItems}
        deleteItem={medicamentos.deleteItem}
        columns={columns}
        itemName="Medicamentos"
        itemsPerPage={10}
        modalSize="lg"
      >
        <GenericForm<MedicamentoForm>
          title="Medicamento"
          description="Crear / editar medicamento"
          initialValues={(item) =>
            item
              ? {
                  id: item.id,
                  nombreComercial: item.nombreComercial,
                  categoriaId: item.categoria?.id,
                  formaFarmaceuticaId: item.formaFarmaceutica?.id,
                  unidadesPorEmpaque: item.unidadesPorEmpaque,
                  stockMinimo: item.stockMinimo,
                  stockTotal: item.stockTotal,
                  precioVenta: item.precioVenta,
                  activo: item.activo,

                  principioActivoId: item.principiosActivos?.[0]?.id,
                  concentracion: item.principiosActivos?.[0]?.concentracion,
                  unidadMedidaId:
                    item.principiosActivos?.[0]?.unidadMedida?.id,
                }
              : { nombreComercial: "", activo: true }
          }
          onSubmit={(data) => {
            const payload: any = {
              nombreComercial: data.nombreComercial,
              activo: data.activo ?? true,
            };

            if (data.categoriaId) payload.categoriaId = data.categoriaId;
            if (data.formaFarmaceuticaId)
              payload.formaFarmaceuticaId = data.formaFarmaceuticaId;
            if (data.unidadesPorEmpaque)
              payload.unidadesPorEmpaque = data.unidadesPorEmpaque;
            if (data.stockMinimo)
              payload.stockMinimo = data.stockMinimo;
            if (typeof data.stockTotal !== "undefined")
              payload.stockTotal = data.stockTotal;
            if (data.precioVenta)
              payload.precioVenta = data.precioVenta;

            if (data.principioActivoId)
              payload.principioActivoId = data.principioActivoId;
            if (data.concentracion)
              payload.concentracion = data.concentracion;
            if (data.unidadMedidaId)
              payload.unidadMedidaId = data.unidadMedidaId;

            return data.id
              ? medicamentos.updateItem(data.id, payload)
              : medicamentos.createItem(payload);
          }}
          renderFields={({ values, setField, isSaving, onCancel }) => (
            <>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                      <FormInput
                label="Nombre comercial"
                value={values.nombreComercial}
                onChange={(v) => setField("nombreComercial", v)}
              />

              <FormSelect
                label="Categoría"
                options={categorias.items.map((c) => ({
                  value: String(c.id),
                  label: c.nombre,
                }))}
                value={values.categoriaId ? String(values.categoriaId) : ""}
                onChange={(v) => setField("categoriaId", v)}
              />

                </div>
          
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                     <FormSelect
                label="Forma farmacéutica"
                options={formas.items.map((f) => ({
                  value: String(f.id),
                  label: f.nombre,
                }))}
                value={
                  values.formaFarmaceuticaId
                    ? String(values.formaFarmaceuticaId)
                    : ""
                }
                onChange={(v) => setField("formaFarmaceuticaId", v)}
              />

              <FormNumber
                label="Unidades por empaque"
                value={values.unidadesPorEmpaque}
                onChange={(v) => setField("unidadesPorEmpaque", v)}
              />

            </div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <FormNumber
                label="Stock mínimo"
                value={values.stockMinimo}
                onChange={(v) => setField("stockMinimo", v)}
              />

              <FormNumber
                label="Precio"
                step={0.01}
                value={values.precioVenta}
                onChange={(v) => setField("precioVenta", v)}
              />
                </div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <FormNumber
                label="Stock total"
                value={values.stockTotal}
                onChange={(v) => setField("stockTotal", v)}
              />
              <div />
                </div>
           
             <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

              <FormSelect
                label="Principio activo"
                options={principios.items.map((p) => ({
                  value: String(p.id),
                  label: p.nombre,
                }))}
                value={
                  values.principioActivoId
                    ? String(values.principioActivoId)
                    : ""
                }
                onChange={(v) => setField("principioActivoId", v)}
              />

              <FormNumber
                label="Concentración"
                value={values.concentracion}
                onChange={(v) => setField("concentracion", v)}
              />

             </div>

              <FormSelect
                label="Unidad de medida"
                options={unidades.items.map((u) => ({
                  value: String(u.id),
                  label: `${u.nombre} (${u.simbolo})`,
                }))}
                value={
                  values.unidadMedidaId
                    ? String(values.unidadMedidaId)
                    : ""
                }
                onChange={(v) => setField("unidadMedidaId", v)}
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={values.activo ?? true}
                  onChange={(e) => setField("activo", e.target.checked)}
                />
                <Label>Activo</Label>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSaving}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={!values.nombreComercial || isSaving}
                >
                  Guardar
                </Button>
              </div>
            </>
          )}
        />
      </GenericPage>
    </div>
  );
}


function CatalogCard({
  icon,
  title,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  href: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-4 dark:bg-gray-800">
      <div className="flex items-center gap-3">
        {icon}
        <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
      </div>
      <Link href={href} className="text-brand-500 dark:text-brand-400">
        Ver {title.toLowerCase()}
      </Link>
    </div>
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
      <Input
        type="number"
        step={step}
        value={value ?? ""}
        onChange={(e) => onChange(Number(e.target.value))}
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
        value={value}
        onChange={(v) => onChange(v ? Number(v) : undefined)}
      />
    </div>
  );
}
