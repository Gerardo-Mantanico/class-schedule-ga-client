"use client";

import React, { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useModal } from "@/hooks/useModal";
import { useDocente } from "@/hooks/useDocente";
import { GenericTable, type Column } from "@/components/ui/table/GenericTable";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import type { Docente } from "@/interfaces/HorariosDemo";

const columns: Column<Docente>[] = [
  {
    header: "Docente",
    cell: (item) => (
      <div>
        <p className="font-medium text-gray-800 dark:text-white/90">{item.nombre}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Registro: {item.registroPersonal}</p>
      </div>
    ),
  },
  {
    header: "Horario",
    cell: (item) => `${item.horaEntrada} - ${item.horaSalida}`,
  },
  {
    header: "Cursos preferidos",
    cell: (item) => (
      <span className="text-xs text-gray-600 dark:text-gray-300">
        {item.cursosPreferidos.length ? item.cursosPreferidos.join(", ") : "Sin cursos por defecto"}
      </span>
    ),
  },
];

type FormData = {
  nombre: string;
  registroPersonal: string;
  horaEntrada: string;
  horaSalida: string;
  cursosPreferidos: string;
};

const initialForm: FormData = {
  nombre: "",
  registroPersonal: "",
  horaEntrada: "07:00",
  horaSalida: "13:00",
  cursosPreferidos: "",
};

export default function DocenteTable() {
  const { isOpen, openModal, closeModal } = useModal();
  const { docentes, loading, error, createDocente, updateDocente, deleteDocente } = useDocente();

  const [selectedDocente, setSelectedDocente] = useState<Docente | null>(null);
  const [formData, setFormData] = useState<FormData>(initialForm);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const totalPages = Math.max(1, Math.ceil(docentes.length / itemsPerPage));
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return docentes.slice(start, start + itemsPerPage);
  }, [docentes, currentPage]);

  const handleAdd = () => {
    setSelectedDocente(null);
    setFormData(initialForm);
    openModal();
  };

  const handleEdit = (docente: Docente) => {
    setSelectedDocente(docente);
    setFormData({
      nombre: docente.nombre,
      registroPersonal: docente.registroPersonal,
      horaEntrada: docente.horaEntrada,
      horaSalida: docente.horaSalida,
      cursosPreferidos: docente.cursosPreferidos.join(", "),
    });
    openModal();
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.nombre.trim() || !formData.registroPersonal.trim()) {
      toast.error("Nombre y registro son obligatorios");
      return;
    }

    const payload = {
      nombre: formData.nombre.trim(),
      registroPersonal: formData.registroPersonal.trim(),
      horaEntrada: formData.horaEntrada,
      horaSalida: formData.horaSalida,
      cursosPreferidos: formData.cursosPreferidos
        .split(",")
        .map((item) => item.trim().toUpperCase())
        .filter(Boolean),
    };

    const success = selectedDocente
      ? await updateDocente(selectedDocente.id, payload)
      : await createDocente(payload);

    if (success) {
      toast.success(`Docente ${selectedDocente ? "actualizado" : "creado"} con éxito`);
      closeModal();
    } else {
      toast.error("No fue posible guardar el docente");
    }
  };

  if (loading && docentes.length === 0) return <div>Cargando docentes...</div>;
  if (error && docentes.length === 0) return <div>Error: {error}</div>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-white/5">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Gestión de docentes</h3>
        <Button size="sm" onClick={handleAdd}>
          Agregar docente
        </Button>
      </div>

      <GenericTable
        data={currentData}
        columns={columns}
        onEdit={handleEdit}
        onDelete={(item) => deleteDocente(item.id)}
        pagination={{ currentPage, totalPages, onPageChange: setCurrentPage }}
      />

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-160 m-4">
        <div className="no-scrollbar relative w-full max-w-160 overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {selectedDocente ? "Editar docente" : "Crear docente"}
          </h4>
          <form className="grid grid-cols-1 gap-4 lg:grid-cols-2" onSubmit={handleSave}>
            {error && (
              <div className="col-span-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/10 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="col-span-2 lg:col-span-1">
              <Label>Nombre</Label>
              <Input value={formData.nombre} onChange={(event) => setFormData((prev) => ({ ...prev, nombre: event.target.value }))} />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Label>Registro de personal</Label>
              <Input
                value={formData.registroPersonal}
                onChange={(event) => setFormData((prev) => ({ ...prev, registroPersonal: event.target.value.toUpperCase() }))}
              />
            </div>

            <div>
              <Label>Hora entrada</Label>
              <Input
                type="time"
                value={formData.horaEntrada}
                onChange={(event) => setFormData((prev) => ({ ...prev, horaEntrada: event.target.value }))}
              />
            </div>
            <div>
              <Label>Hora salida</Label>
              <Input
                type="time"
                value={formData.horaSalida}
                onChange={(event) => setFormData((prev) => ({ ...prev, horaSalida: event.target.value }))}
              />
            </div>

            <div className="col-span-2">
              <Label>Cursos por defecto (códigos separados por coma)</Label>
              <Input
                value={formData.cursosPreferidos}
                onChange={(event) => setFormData((prev) => ({ ...prev, cursosPreferidos: event.target.value }))}
              />
            </div>

            <div className="col-span-2 flex justify-end gap-3">
              <Button size="sm" type="button" variant="outline" onClick={closeModal}>
                Cancelar
              </Button>
              <Button size="sm" type="submit">
                {selectedDocente ? "Guardar cambios" : "Crear docente"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
