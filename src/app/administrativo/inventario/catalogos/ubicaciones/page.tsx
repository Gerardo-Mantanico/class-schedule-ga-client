"use client";
import React from 'react';
import { Column } from '@/components/ui/table/GenericTable';
import GenericPage from '@/components/administrativo/GenericPage';
import GenericForm from '@/components/administrativo/GenericForm';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { useInventario } from '@/hooks/useInventario';

interface Ubicaciones {
  id: number;
  nombre: string;
}

interface UbicacionesForm {
  nombre: string;
}

export default function UbicacionessPage() {
  const { ubicaciones } = useInventario();

  const columns: Column<Ubicaciones>[] = [
    { header: 'Nombre', accessorKey: 'nombre' },
  ];

  return (
    <GenericPage<Ubicaciones>
      title="Ubicaciones"
      items={ubicaciones.items}
      fetchItems={ubicaciones.fetchItems}
      deleteItem={ubicaciones.deleteItem}
      columns={columns}
      itemName="Forma"
      itemsPerPage={10}
      modalSize="sm"
    >
      <GenericForm<UbicacionesForm, boolean>
        title="Nueva Ubicaciones"
        description="Registre una nueva Ubicaciones"
        onSubmit={(data) => ubicaciones.createItem(data)}
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
                placeholder="Ej. Tableta"
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
