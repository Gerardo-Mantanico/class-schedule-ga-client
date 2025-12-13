"use client";

import React, { useState } from 'react';
import useInventario from '@/hooks/useInventario';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import Button from '../ui/button/Button';
import Alert from '../ui/alert/Alert';

interface Props {
  initial?: { id?: number; nombre?: string };
  onSaved?: () => void;
  onCancel?: () => void;
}

export default function CategoriaForm(props: Readonly<Props>) {
  const { initial, onSaved, onCancel } = props;
  const [nombre, setNombre] = useState(initial?.nombre || '');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [alert, setAlert] = useState<{
    show: boolean;
    variant: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  } | null>(null);
  const { createCategoria, updateCategoria } = useInventario();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Client-side validation
    if (!nombre || nombre.trim().length === 0) {
      setError('El nombre es obligatorio');
      return;
    }

    setError(null);
    setIsSaving(true);
    try {
      if (initial?.id) {
        await updateCategoria(initial.id, { nombre: nombre.trim() });
        // mostrar alerta de éxito para edición
        setAlert({
          show: true,
          variant: 'success',
          title: 'Categoría actualizada',
          message: 'La categoría se actualizó correctamente.',
        });
      } else {
        await createCategoria({ nombre: nombre.trim() });
        // mostrar alerta de éxito para creación
        setAlert({
          show: true,
          variant: 'success',
          title: 'Categoría guardada',
          message: 'La nueva categoría se ha creado correctamente.',
        });
      }
      setIsSaving(false);
      // esperar un momento para que el usuario vea la alerta y luego cerrar/notify al padre
      setTimeout(() => {
        setAlert(null);
        onSaved?.();
      }, 1200);
    } catch (err) {
      // Show a minimal inline error; page.tsx can show global Alert if desired
      console.error(err);
      setError('Error al guardar la categoría');
      setIsSaving(false);
      setAlert({
        show: true,
        variant: 'error',
        title: 'Error',
        message: 'Ocurrió un error al guardar la categoría. Intenta de nuevo.',
      });
    }
  };

  return (

    <div className="no-scrollbar relative w-full sm:w-auto sm:max-w-[700px] overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-8">
      {alert?.show && (
        <div className="mb-4">
          <Alert
            variant={alert.variant}
            title={alert.title}
            message={alert.message}
          />
        </div>
      )}
      <div className="">
        <h4 className="mb-1 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {initial?.id ? 'Editar categoría' : 'Nueva categoría'}
        </h4>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Complete el formulario para {initial?.id ? 'actualizar' : 'registrar'} una categoría
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <Label htmlFor="categoria-nombre" className="block text-sm font-medium">Nombre</Label>
          <Input
            id="categoria-nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="input mt-2"
            placeholder="Ej. Analgésicos"
            error={!!error}
            autoFocus
            required
          />
          {error && <p className="mt-2 text-sm text-error-500" role="alert">{error}</p>}
        </div>

        <div className="mt-2 flex gap-2 justify-end">
          <Button size="sm" variant="outline" onClick={onCancel} type="button" disabled={isSaving}>
                Cancelar
              </Button>
          <Button type="submit" className="btn btn-primary" disabled={nombre.trim() === '' || isSaving}>
            {initial?.id ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </form>
    </div>
  );
}
