"use client";
import React, { useState } from "react";
import Image from "next/image";

import { useModal } from "../../hooks/useModal";
import { useEspecialidad } from "../../hooks/useEspecialidad";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import TextArea from "../form/input/TextArea";
import { GenericTable, Column } from "../ui/table/GenericTable";
import { toast } from "react-hot-toast";

interface Especialidad {
  id: number;
  nombre: string;
  descripcion?: string;
  image?: string;
}

const columns: Column<Especialidad>[] = [
  {
    header: "Especialidad",
    cell: (especialidad) => (
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 overflow-hidden rounded-full">
          <Image
            width={40}
            height={40}
            src={especialidad.image || "/images/user/user-17.jpg"}
            alt={especialidad.nombre}
          />
        </div>
        <div>
          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
            {especialidad.nombre}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Descripción",
    accessorKey: "descripcion",
  },
];

export default function EspecialidadTable() {
  const { isOpen, openModal, closeModal } = useModal();
  const {especialidades, loading, error, createEspecialidad, updateEspecialidad, deleteEspecialidad } = useEspecialidad();

  const [selectedEspecialidad, setSelectedEspecialidad] = useState<Especialidad | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    image: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const totalPages = Math.ceil(especialidades.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEspecialidad = especialidades.slice(startIndex, startIndex + itemsPerPage);

  const handleAdd = () => {
    setSelectedEspecialidad(null);
    setFormData({
      nombre: "",
      descripcion: "",
      image: "",
    });
    openModal();
  };

  const handleEdit = (especialidad: Especialidad) => {
    setSelectedEspecialidad(especialidad);
    setFormData({
      nombre: especialidad.nombre,
      descripcion: especialidad.descripcion || "",
      image: especialidad.image || "",
    });
    openModal();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    let success = false;
    if (selectedEspecialidad) {
      success = await updateEspecialidad(selectedEspecialidad.id, formData);
    } else {
      success = await createEspecialidad(formData);
    }
    
    if (success) {
      closeModal();
    }
    toast.success(`Especialidad ${selectedEspecialidad ? "actualizada" : "creada"} con éxito`);
  };

  if (loading && especialidades.length === 0) return <div>Cargando especialidad...</div>;
  // Solo mostrar error a pantalla completa si no hay datos
  if (error && especialidades.length === 0) return <div>Error: {error}</div>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      {/* Header con botón a la derecha */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/5">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Especialidades
        </h3>
        <Button size="sm" onClick={handleAdd}>
          Agregar Especialidad
        </Button>
      </div>

      <GenericTable
        data={currentEspecialidad}
        columns={columns}
        onEdit={handleEdit}
        onDelete={(especialidad) => deleteEspecialidad(especialidad.id)}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
        }}
      />
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {selectedEspecialidad ? "Editar especialidad" : "Agregar especialidad"}
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              {selectedEspecialidad
                ? "Actualizar los detalles del la especialidad"
                : "Agregar un nueva especialidad"}
            </p>
          </div>
          <form className="flex flex-col" onSubmit={handleSave}>
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              {error && (
                <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded-lg dark:bg-red-900/10 dark:text-red-400">
                  {error}
                </div>
              )}
              <div className="mt-7">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Nombre del servicio</Label>
                    <Input
                      type="text"
                      placeholder="Ingrese el nombre del servicio"
                      value={formData.nombre}
                      onChange={(e) =>
                        setFormData({ ...formData, nombre: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Descripción del servicio</Label>
                    <TextArea
                      placeholder="Escribe una descripción del servicio aquí..."
                      value={formData.descripcion}
                      onChange={(value) =>
                        setFormData({ ...formData, descripcion: value })
                      }
                    ></TextArea>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal} type="button">
                Cancelar
              </Button>
              <Button size="sm" type="submit">
                {selectedEspecialidad ? "Guardar Cambios" : "Agregar Servicio"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}