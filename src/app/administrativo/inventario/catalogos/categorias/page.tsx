"use client";

import React from 'react';
import { Column } from '@/components/ui/table/GenericTable';
import GenericPage from '@/components/administrativo/GenericPage';
import GenericForm from '@/components/administrativo/GenericForm';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { useInventario } from '@/hooks/useInventario';

interface Categoria {
  id: number;
  nombre: string;
}

interface CategoriaForm {
  nombre: string;
}

export default function CategoriasPage() {
  const { categorias } = useInventario();

  const columns: Column<Categoria>[] = [
    { header: 'Nombre', accessorKey: 'nombre' },
  ];

  return (
    <GenericPage<Categoria>
      title="Categoría"
      items={categorias.items}
      fetchItems={categorias.fetchItems}
      deleteItem={categorias.deleteItem}
      columns={columns}
      itemName="Categoría"
      itemsPerPage={10}
      modalSize="sm"
    >
      <GenericForm<CategoriaForm, boolean>
        title="Nueva categoría"
        description="Registre una nueva categoría"
        onSubmit={(data) => categorias.createItem(data)}
        renderFields={({ values, setField, error, isSaving, onCancel }) => (
          <>
            <div className="flex flex-col">
              <Label htmlFor="categoria-nombre">
                Nombre
              </Label>

              <Input
                id="categoria-nombre"
                value={values.nombre ?? ''}
                onChange={(e) => setField('nombre', e.target.value)}
                placeholder="Ej. Analgésicos"
                error={!!error}
                autoFocus
                required
              />

              {error && (
                <p className="mt-2 text-sm text-error-500">
                  {error}
                </p>
              )}
            </div>

            <div className="mt-2 flex gap-2 justify-end">
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
                disabled={!values.nombre || isSaving}
              >
                Guardar
              </Button>
            </div>
          </>
        )}
      />
    </GenericPage>
  );
}
