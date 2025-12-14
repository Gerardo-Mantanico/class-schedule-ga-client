"use client";
import React from 'react';
import { Column } from '@/components/ui/table/GenericTable';
import GenericPage from '@/components/administrativo/GenericPage';
import GenericForm from '@/components/administrativo/GenericForm';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { useInventario } from '@/hooks/useInventario';

interface Unidades {
  id: number;
  nombre: string;
  simbolo: string;
}

interface UnidadesForm {
  nombre: string;
  simbolo: string;
}

export default function UnidadessPage() {
  const { unidades } = useInventario();

  const columns: Column<Unidades>[] = [
    { header: 'Nombre', accessorKey: 'nombre' },
    { header: 'Símbolo', accessorKey: 'simbolo' },
  ];
  return (
    <GenericPage<Unidades>
      title="Unidades / Empaque"
      items={unidades.items}
      fetchItems={unidades.fetchItems}
      deleteItem={unidades.deleteItem}
      columns={columns}
      itemName="Unidad"
      itemsPerPage={10}
      modalSize="sm"
    >
      <GenericForm<UnidadesForm, boolean>
        title="Nueva Unidad"
        description="Registre una nueva Unidad"
        onSubmit={(data) => unidades.createItem(data)}
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
               {/* Símbolo */}
            <div className="flex flex-col">
              <Label htmlFor="unidad-simbolo">Símbolo</Label>

              <Input
                id="unidad-simbolo"
                value={values.simbolo ?? ''}
                onChange={(e) => setField('simbolo', e.target.value)}
                placeholder="Ej. tab"
                error={!!error}
                required
              />
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
