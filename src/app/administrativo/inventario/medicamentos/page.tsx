"use client";

import React from 'react';
import { Column } from '@/components/ui/table/GenericTable';
import GenericPage from '@/components/administrativo/GenericPage';
import GenericForm from '@/components/administrativo/GenericForm';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { useInventario } from '@/hooks/useInventario';
import {
  FolderIcon,
  BoxCubeIcon,
  BoxIconLine,
  BoltIcon,
  GroupIcon,
  PageIcon,
} from '@/icons';
import Link from 'next/link';

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
  unidadMedida: UnidadMedida;
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
  formaFarmaceutica: FormaFarmaceutica;
  categoria: Categoria;
  unidadesPorEmpaque: number;
  stockMinimo: number;
  precioVenta: number;
  activo: boolean;
  principiosActivos: PrincipioActivo[];
}

/* =======================
   FORM DTO
======================= */

interface MedicamentoForm {
  nombreComercial: string;
}

/* =======================
   PAGE
======================= */

export default function MedicamentosPage() {
  const { medicamentos } = useInventario();

  const columns: Column<Medicamento>[] = [
    {
      header: 'Nombre comercial',
      accessorKey: 'nombreComercial',
    },
    {
      header: 'Forma farmacéutica',
      accessorKey: 'formaFarmaceutica',
      cell: (row) => row.formaFarmaceutica.nombre,
    },
    {
      header: 'Categoría',
      accessorKey: 'categoria',
      cell: (row) => row.categoria.nombre,
    },
    {
      header: 'Unidades / Empaque',
      accessorKey: 'unidadesPorEmpaque',
    },
    {
      header: 'Stock mínimo',
      accessorKey: 'stockMinimo',
    },
    {
      header: 'Precio',
      accessorKey: 'precioVenta',
      cell: (row) => `Q ${row.precioVenta.toFixed(2)}`,
    },
    {
      header: 'Principios activos',
      accessorKey: 'principiosActivos',
      cell: (row) =>
        row.principiosActivos
          .map(
            (p) =>
              `${p.nombre} ${p.concentracion}${p.unidadMedida.simbolo}`
          )
          .join(', '),
    },
    {
      header: 'Estado',
      accessorKey: 'activo',
      cell: (row) => (row.activo ? 'Activo' : 'Inactivo'),
    },
  ];

  return (
<div className="space-y-4">
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow p-6 dark:bg-gray-800">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Catálogos - Inventario</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">Administración de catálogos del inventario</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-4 dark:bg-gray-800">
          <div className="flex items-center gap-3 rounded-xl">
            <FolderIcon className="w-6 h-6 text-brand-500" />
            <h3 className="font-medium text-gray-900 dark:text-white">Categorías</h3>
          </div>
          <Link href="/administrativo/inventario/catalogos/categorias" className="text-brand-500 dark:text-brand-400">Ver categorías</Link>
        </div>

        <div className="bg-white rounded-xl shadow p-4 dark:bg-gray-800">
          <div className="flex items-center gap-3 rounded-xl">
            <BoxCubeIcon className="w-6 h-6 text-brand-500" />
            <h3 className="font-medium text-gray-900 dark:text-white">Unidades / Empaque</h3>
          </div>
          <Link href="/administrativo/inventario/catalogos/unidades" className="text-brand-500 dark:text-brand-400">Ver unidades</Link>
        </div>
        <div className="bg-white rounded-xl shadow p-4 dark:bg-gray-800">
          <div className="flex items-center gap-3 rounded-xl">
            <BoxIconLine className="w-6 h-6 text-brand-500" />
            <h3 className="font-medium text-gray-900 dark:text-white">Forma farmacéutica</h3>
          </div>
          <Link href="/administrativo/inventario/catalogos/formas" className="text-brand-500 dark:text-brand-400">Ver formas</Link>
        </div>
        <div className="bg-white rounded-xl shadow p-4 dark:bg-gray-800">
          <div className="flex items-center gap-3 rounded-xl">
            <BoltIcon className="w-6 h-6 text-brand-500" />
            <h3 className="font-medium text-gray-900 dark:text-white">Principios activos</h3>
          </div>
          <Link href="/administrativo/inventario/catalogos/principios" className="text-brand-500 dark:text-brand-400">Ver principios</Link>
        </div>
        <div className="bg-white rounded-xl shadow p-4 dark:bg-gray-800">
          <div className="flex items-center gap-3 rounded-xl">
            <GroupIcon className="w-6 h-6 text-brand-500" />
            <h3 className="font-medium text-gray-900 dark:text-white">Proveedores</h3>
          </div>
          <Link href="/administrativo/inventario/catalogos/proveedores" className="text-brand-500 dark:text-brand-400">Ver proveedores</Link>
        </div>
        <div className="bg-white rounded-xl shadow p-4 dark:bg-gray-800">
          <div className="flex items-center gap-3 rounded-xl">
            <PageIcon className="w-6 h-6 text-brand-500" />
            <h3 className="font-medium text-gray-900 dark:text-white">Ubicaciones</h3>
          </div>
          <Link href="/administrativo/inventario/catalogos/ubicaciones" className="text-brand-500 dark:text-brand-400">Ver ubicaciones</Link>
        </div>
           <div className="bg-white rounded-xl shadow p-4 dark:bg-gray-800">
          <div className="flex items-center gap-3 rounded-xl">
            <PageIcon className="w-6 h-6 text-brand-500" />
            <h3 className="font-medium text-gray-900 dark:text-white">Ubicaciones</h3>
          </div>
          <Link href="/administrativo/inventario/catalogos/ubicaciones" className="text-brand-500 dark:text-brand-400">Ver ubicaciones</Link>
        </div>
      </div>
    </div>
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
        title="Nuevo medicamento"
        description="Registre un nuevo medicamento"
        onSubmit={(data) => medicamentos.createItem(data)}
        renderFields={({ values, setField, error, isSaving, onCancel }) => (
          <>
            {/* NOMBRE COMERCIAL */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="medicamento-nombre">
                Nombre comercial
              </Label>

              <Input
                id="medicamento-nombre"
                value={values.nombreComercial ?? ''}
                onChange={(e) =>
                  setField('nombreComercial', e.target.value)
                }
                placeholder="Ej. Aspirina"
                error={!!error}
                required
                autoFocus
              />
            </div>

            {/* BOTONES */}
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
