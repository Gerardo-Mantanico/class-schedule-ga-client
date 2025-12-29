"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useModal } from "../../hooks/useModal";
import { useArea } from "../../hooks/useArea";
import { useServicios } from "../../hooks/useServicios"; // Importa el hook de servicios
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import TextArea from "../form/input/TextArea";
import { GenericTable, Column } from "../ui/table/GenericTable";
import { toast } from "react-hot-toast";

interface Area {
  id: number;
  nombre: string;
  descripcion?: string;
  image?: string;
  servicioId?: number;
}

const columns: Column<Area>[] = [
  {
    header: "Area",
    cell: (area) => (
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 overflow-hidden rounded-full">
          <Image
            width={40}
            height={40}
            src={area.image || "/images/user/user-17.jpg"}
            alt={area.nombre}
          />
        </div>
        <div>
          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
            {area.nombre}
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

export default function AreaTable() {
  const { isOpen, openModal, closeModal } = useModal();
  const { areas, loading, error, createArea, updateArea, deleteArea } = useArea();
  const { services } = useServicios(); // Obtén los servicios

  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    image: "",
    servicioId: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const totalPages = Math.ceil(areas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentArea = areas.slice(startIndex, startIndex + itemsPerPage);

  const handleAdd = () => {
    setSelectedArea(null);
    setFormData({
      nombre: "",
      descripcion: "",
      image: "",
      servicioId: 0,
    });
    openModal();
  };

  const handleEdit = (area: Area) => {
    setSelectedArea(area);
    setFormData({
      nombre: area.nombre,
      descripcion: area.descripcion || "",
      image: area.image || "",
      servicioId: area.servicioId || 0,
    });
    openModal();
  };

  // Manejar la carga de imagen y convertirla a base64
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        image: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    let success = false;
    if (selectedArea) {
      success = await updateArea(selectedArea.id, formData);
    } else {
      success = await createArea(formData);
    }
    if (success) {
      closeModal();
    }
    toast.success(`Área ${selectedArea ? "actualizada" : "creada"} con éxito`);
  };

  if (loading && areas.length === 0) return <div>Cargando area...</div>;
  if (error && areas.length === 0) return <div>Error: {error}</div>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/5">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Areas
        </h3>
        <Button size="sm" onClick={handleAdd}>
          Agregar Area
        </Button>
      </div>

      <GenericTable
        data={currentArea}
        columns={columns}
        onEdit={handleEdit}
        onDelete={(area) => deleteArea(area.id)}
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
              {selectedArea ? "Editar area" : "Agregar area"}
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              {selectedArea
                ? "Actualizar los detalles del área"
                : "Agregar un nueva área"}
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
                  <div className="col-span-2">
                    <Label>Seleccionar servicio</Label>
                    <select
                      className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
                      value={formData.servicioId}
                      onChange={e =>
                        setFormData({ ...formData, servicioId: Number(e.target.value) })
                      }
                      required
                    >
                      <option value={0}>Seleccione un servicio</option>
                      {services.map((servicio: any) => (
                        <option key={servicio.id} value={servicio.id}>
                          {servicio.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal} type="button">
                Cancelar
              </Button>
              <Button size="sm" type="submit">
                {selectedArea ? "Guardar Cambios" : "Agregar Servicio"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}