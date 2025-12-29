"use client";
import React, { useState } from "react";
import Image from "next/image";

import { useModal } from "../../hooks/useModal";
import { useServicios } from "../../hooks/useServicios";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import TextArea from "../form/input/TextArea";
import { GenericTable, Column } from "../ui/table/GenericTable";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Service {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  img?: string;
}

const columns: Column<Service>[] = [
  {
    header: "Servicio",
    cell: (service) => (
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 overflow-hidden rounded-full">
          <Image
            width={40}
            height={40}
            src={service.img || "/images/user/user-17.jpg"}
            alt={service.nombre}
          />
        </div>
        <div>
          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
            {service.nombre}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Descripción",
    accessorKey: "descripcion",
  },
  {
    header: "Precio",
    cell: (service) => <span>${service.precio}</span>,
  },
];

export default function ServiceTable() {
  const { isOpen, openModal, closeModal } = useModal();
  const { services, loading, error, createService, updateService, deleteService } = useServicios();
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    img: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const totalPages = Math.ceil(services.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentServices = services.slice(startIndex, startIndex + itemsPerPage);

  const handleAdd = () => {
    setSelectedService(null);
    setFormData({
      nombre: "",
      precio: "",
      descripcion: "",
      img: "",
    });
    openModal();
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setFormData({
      nombre: service.nombre,
      precio: service.precio,
      descripcion: service.descripcion,
      img: service.img || "",
    });
    openModal();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedService) {
      await updateService(selectedService.id, formData);
    } else {
      await createService(formData);
    }
    toast.success(`Servicio ${selectedService ? "actualizado" : "creado"} con éxito`);
    router.refresh();
    closeModal();
  };

  if (loading && services.length === 0) return <div>Cargando servicios...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      {/* Header con botón a la derecha */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/5">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Servicios
        </h3>
        <Button size="sm" onClick={handleAdd}>
          Agregar Servicios
        </Button>
      </div>

      <GenericTable
        data={currentServices}
        columns={columns}
        onEdit={handleEdit}
        onDelete={(service) => deleteService(service.id)}
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
              {selectedService ? "Editar servicio" : "Agregar servicio"}
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              {selectedService
                ? "Actualizar los detalles del servicio"
                : "Agregar un nuevo servicio"}
            </p>
          </div>
          <form className="flex flex-col" onSubmit={handleSave}>
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
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
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Precio</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={formData.precio}
                      onChange={(e) =>
                        setFormData({ ...formData, precio: e.target.value })
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
                    <Label>Subir imagen</Label>
                    <Input
                      type="file"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData((prev) => ({
                              ...prev,
                              img: reader.result as string,
                            }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {/* Vista previa de la imagen */}
                    {formData.img && (
                      <div className="mt-2">
                        <img
                          src={formData.img}
                          alt="Vista previa"
                          className="h-20 w-20 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal} type="button">
                Cancelar
              </Button>
              <Button size="sm" type="submit">
                {selectedService ? "Guardar Cambios" : "Agregar Servicio"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}