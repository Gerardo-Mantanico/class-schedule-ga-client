"use client";

import React, { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useModal } from "@/hooks/useModal";
import { useConfiguracionHorarios } from "@/hooks/useConfiguracionHorarios";
import { GenericTable, type Column } from "@/components/ui/table/GenericTable";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import type { ConfiguracionHorario } from "@/interfaces/HorariosDemo";

const columns: Column<ConfiguracionHorario>[] = [
  {
    header: "Configuración",
    cell: (item) => (
      <div>
        <p className="font-medium text-gray-800 dark:text-white/90">{item.nombre}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{item.activa ? "Activa" : "Inactiva"}</p>
      </div>
    ),
  },
  {
    header: "Periodo (min)",
    accessorKey: "minutosPorPeriodo",
  },
  {
    header: "Jornada mañana",
    cell: (item) => `${item.jornadaMananaInicio} - ${item.jornadaMananaFin}`,
  },
  {
    header: "Jornada tarde",
    cell: (item) => `${item.jornadaTardeInicio} - ${item.jornadaTardeFin}`,
  },
  {
    header: "Generaciones",
    accessorKey: "maxGeneraciones",
  },
  {
    header: "Población inicial",
    accessorKey: "poblacionInicial",
  },
];

const initialForm: Omit<ConfiguracionHorario, "id"> = {
  nombre: "",
  minutosPorPeriodo: 50,
  jornadaMananaInicio: "07:00",
  jornadaMananaFin: "12:00",
  jornadaTardeInicio: "13:00",
  jornadaTardeFin: "18:00",
  maxGeneraciones: 200,
  poblacionInicial: 100,
  criterioFinalizacion: "max_generaciones",
  metodoSeleccion: "torneo",
  metodoCruce: "uniforme",
  metodoMutacion: "swap",
  activa: true,
};

export default function ConfiguracionHorariosTable() {
  const { isOpen, openModal, closeModal } = useModal();
  const {
    configuraciones,
    loading,
    error,
    createConfiguracion,
    updateConfiguracion,
    deleteConfiguracion,
  } = useConfiguracionHorarios();

  const [selected, setSelected] = useState<ConfiguracionHorario | null>(null);
  const [formData, setFormData] = useState(initialForm);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 7;
  const totalPages = Math.max(1, Math.ceil(configuraciones.length / itemsPerPage));
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return configuraciones.slice(start, start + itemsPerPage);
  }, [configuraciones, currentPage]);

  const handleAdd = () => {
    setSelected(null);
    setFormData(initialForm);
    openModal();
  };

  const handleEdit = (row: ConfiguracionHorario) => {
    setSelected(row);
    setFormData({
      nombre: row.nombre,
      minutosPorPeriodo: row.minutosPorPeriodo,
      jornadaMananaInicio: row.jornadaMananaInicio,
      jornadaMananaFin: row.jornadaMananaFin,
      jornadaTardeInicio: row.jornadaTardeInicio,
      jornadaTardeFin: row.jornadaTardeFin,
      maxGeneraciones: row.maxGeneraciones,
      poblacionInicial: row.poblacionInicial,
      criterioFinalizacion: row.criterioFinalizacion,
      metodoSeleccion: row.metodoSeleccion,
      metodoCruce: row.metodoCruce,
      metodoMutacion: row.metodoMutacion,
      activa: row.activa,
    });
    openModal();
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.nombre.trim()) {
      toast.error("Nombre de configuración obligatorio");
      return;
    }

    const success = selected
      ? await updateConfiguracion(selected.id, formData)
      : await createConfiguracion(formData);

    if (success) {
      toast.success(`Configuración ${selected ? "actualizada" : "creada"} con éxito`);
      closeModal();
    } else {
      toast.error("No fue posible guardar configuración");
    }
  };

  if (loading && configuraciones.length === 0) return <div>Cargando configuraciones...</div>;
  if (error && configuraciones.length === 0) return <div>Error: {error}</div>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-white/5">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Configuración de generación</h3>
        <Button size="sm" onClick={handleAdd}>
          Nueva configuración
        </Button>
      </div>

      <GenericTable
        data={currentData}
        columns={columns}
        onEdit={handleEdit}
        onDelete={(item) => deleteConfiguracion(item.id)}
        pagination={{ currentPage, totalPages, onPageChange: setCurrentPage }}
      />

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-190 m-4">
        <div className="no-scrollbar relative w-full max-w-190 overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {selected ? "Editar configuración" : "Crear configuración"}
          </h4>

          <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {error && (
              <div className="col-span-3 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/10 dark:text-red-400">{error}</div>
            )}

            <div className="col-span-3 lg:col-span-2">
              <Label>Nombre</Label>
              <Input value={formData.nombre} onChange={(event) => setFormData((prev) => ({ ...prev, nombre: event.target.value }))} />
            </div>

            <div>
              <Label>Minutos por periodo</Label>
              <Input
                type="number"
                min="40"
                max="60"
                value={formData.minutosPorPeriodo}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, minutosPorPeriodo: Number(event.target.value || 50) }))
                }
              />
            </div>

            <div>
              <Label>Mañana inicio</Label>
              <Input
                type="time"
                value={formData.jornadaMananaInicio}
                onChange={(event) => setFormData((prev) => ({ ...prev, jornadaMananaInicio: event.target.value }))}
              />
            </div>
            <div>
              <Label>Mañana fin</Label>
              <Input
                type="time"
                value={formData.jornadaMananaFin}
                onChange={(event) => setFormData((prev) => ({ ...prev, jornadaMananaFin: event.target.value }))}
              />
            </div>
            <div>
              <Label>Tarde inicio</Label>
              <Input
                type="time"
                value={formData.jornadaTardeInicio}
                onChange={(event) => setFormData((prev) => ({ ...prev, jornadaTardeInicio: event.target.value }))}
              />
            </div>
            <div>
              <Label>Tarde fin</Label>
              <Input
                type="time"
                value={formData.jornadaTardeFin}
                onChange={(event) => setFormData((prev) => ({ ...prev, jornadaTardeFin: event.target.value }))}
              />
            </div>

            <div>
              <Label>Máx. generaciones</Label>
              <Input
                type="number"
                min="1"
                value={formData.maxGeneraciones}
                onChange={(event) => setFormData((prev) => ({ ...prev, maxGeneraciones: Number(event.target.value || 1) }))}
              />
            </div>
            <div>
              <Label>Población inicial</Label>
              <Input
                type="number"
                min="1"
                value={formData.poblacionInicial}
                onChange={(event) => setFormData((prev) => ({ ...prev, poblacionInicial: Number(event.target.value || 1) }))}
              />
            </div>
            <div>
              <Label>Criterio finalización</Label>
              <Input
                value={formData.criterioFinalizacion}
                onChange={(event) => setFormData((prev) => ({ ...prev, criterioFinalizacion: event.target.value }))}
              />
            </div>
            <div>
              <Label>Método selección</Label>
              <Input
                value={formData.metodoSeleccion}
                onChange={(event) => setFormData((prev) => ({ ...prev, metodoSeleccion: event.target.value }))}
              />
            </div>
            <div>
              <Label>Método cruce</Label>
              <Input
                value={formData.metodoCruce}
                onChange={(event) => setFormData((prev) => ({ ...prev, metodoCruce: event.target.value }))}
              />
            </div>
            <div>
              <Label>Método mutación</Label>
              <Input
                value={formData.metodoMutacion}
                onChange={(event) => setFormData((prev) => ({ ...prev, metodoMutacion: event.target.value }))}
              />
            </div>

            <div className="col-span-3 flex items-center justify-end gap-3">
              <Button size="sm" variant="outline" type="button" onClick={closeModal}>
                Cancelar
              </Button>
              <Button size="sm" type="submit">
                {selected ? "Guardar cambios" : "Crear configuración"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
