"use client";

import React, { useState } from "react";
import { MdMeetingRoom, MdPeopleAlt, MdPlace, MdBuild } from "react-icons/md";
import { toast } from "react-hot-toast";
import { useModal } from "@/hooks/useModal";
import { useSalon, type Salon } from "@/hooks/useSalon";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextCongreso from "@/components/form/input/TextArea";
import { PencilIcon, TrashBinIcon } from "@/icons";

export default function SalonCards() {
  const { isOpen, openModal, closeModal } = useModal();
  const { salones, loading, error, createSalon, updateSalon, deleteSalon } = useSalon();

  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    codigoInterno: "",
    tipo: "AMBOS" as "LAB" | "CURSO" | "AMBOS",
    tipoHorario: "AMBOS" as "MANANA" | "TARDE" | "AMBOS",
    ubicacion: "",
    capacidad: 0,
    recursos: "",
    estado: "ACTIVO",
  });

  const handleAdd = () => {
    setSelectedSalon(null);
    setFormData({
      nombre: "",
      codigoInterno: "",
      tipo: "AMBOS",
      tipoHorario: "AMBOS",
      ubicacion: "",
      capacidad: 0,
      recursos: "",
      estado: "ACTIVO",
    });
    openModal();
  };

  const handleEdit = (salon: Salon) => {
    setSelectedSalon(salon);
    setFormData({
      nombre: salon.nombre,
      codigoInterno: salon.codigoInterno || "",
      tipo: salon.tipo || "AMBOS",
      tipoHorario: salon.tipoHorario || "AMBOS",
      ubicacion: salon.ubicacion,
      capacidad: salon.capacidad,
      recursos: salon.recursos,
      estado: salon.estado?.trim() || "ACTIVO",
    });
    openModal();
  };

  const handleDelete = async (salon: Salon) => {
    const success = await deleteSalon(salon.id);
    if (success) {
      toast.success("Salón eliminado con éxito");
      return;
    }

    toast.error("No fue posible eliminar el salón");
  };

  const handleSave = async (event: React.BaseSyntheticEvent) => {
    event.preventDefault();

    if (!formData.nombre.trim() || !formData.ubicacion.trim()) {
      toast.error("Completa nombre y ubicación del salón.");
      return;
    }

    if (!formData.codigoInterno.trim()) {
      toast.error("Completa el id/código interno del salón.");
      return;
    }

    if (formData.capacidad <= 0) {
      toast.error("La capacidad debe ser mayor a cero.");
      return;
    }

    const payload = {
      ...formData,
      estado: formData.estado.trim() || selectedSalon?.estado?.trim() || "ACTIVO",
    };

    let success = false;

    if (selectedSalon) {
      success = await updateSalon(selectedSalon.id, payload);
    } else {
      success = await createSalon(payload);
    }

    if (success) {
      toast.success(`Salón ${selectedSalon ? "actualizado" : "creado"} con éxito`);
      closeModal();
      return;
    }

    toast.error("No fue posible guardar el salón");
  };

  if (loading && salones.length === 0) {
    return <div>Cargando salones...</div>;
  }

  if (error && salones.length === 0) {
    return <div>Error: {error}</div>;
  }

  const addSalonCard = (
    <button
      type="button"
      onClick={handleAdd}
      className="flex min-h-55 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-brand-300 bg-white p-5 text-center shadow-theme-xs transition hover:border-brand-500 dark:border-brand-400/40 dark:bg-white/3"
    >
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-2xl font-semibold text-brand-600 dark:bg-brand-500/20 dark:text-brand-300">
        +
      </div>
      <h4 className="mt-4 text-base font-semibold text-gray-800 dark:text-white/90">Agregar salón</h4>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Registra un nuevo salón para el congreso.</p>
    </button>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-white/5 dark:bg-white/3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Salones</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gestiona espacios y capacidad para actividades del congreso.
          </p>
        </div>
      </div>

      {salones.length === 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {addSalonCard}

          <article className="rounded-2xl border border-dashed border-gray-300 bg-white p-5 shadow-theme-xs dark:border-white/10 dark:bg-white/3">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300">
                <MdMeetingRoom className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
                Ejemplo
              </span>
            </div>

            <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">Salón Magna 1</h4>

            <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <p className="flex items-center gap-2">
                <MdPlace className="h-4 w-4 text-brand-500" />
                <span>Torre central, nivel 3</span>
              </p>
              <p className="flex items-center gap-2">
                <MdPeopleAlt className="h-4 w-4 text-brand-500" />
                <span>Capacidad: 120</span>
              </p>
              <p className="flex items-start gap-2">
                <MdBuild className="mt-0.5 h-4 w-4 text-brand-500" />
                <span>Proyector, audio ambiental, pizarra digital, aire acondicionado</span>
              </p>
            </div>
          </article>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600 dark:border-white/5 dark:bg-white/3 dark:text-gray-300 sm:col-span-2 xl:col-span-2">
            No hay salones registrados todavía. Usa <span className="font-medium">Agregar salón</span> para registrar el primero.
          </div>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {addSalonCard}

          {salones.map((salon) => (
            <article
              key={salon.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-white/5 dark:bg-white/3"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300">
                  <MdMeetingRoom className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(salon)}
                    aria-label={`Editar ${salon.nombre}`}
                    className="rounded-lg bg-brand-50 p-2 text-brand-600 transition-colors hover:bg-brand-100 hover:text-brand-700 dark:bg-brand-500/20 dark:text-brand-300 dark:hover:bg-brand-500/30 dark:hover:text-brand-200"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(salon)}
                    aria-label={`Eliminar ${salon.nombre}`}
                    className="rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100 hover:text-red-700 dark:bg-red-500/20 dark:text-red-300 dark:hover:bg-red-500/30 dark:hover:text-red-200"
                  >
                    <TrashBinIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">{salon.nombre}</h4>

              <div className="mt-2">
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
                  {salon.estado || "Sin estado"}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p className="flex items-center gap-2">
                  <MdPlace className="h-4 w-4 text-brand-500" />
                  <span>{salon.ubicacion}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-xs font-medium">ID:</span>
                  <span>{salon.codigoInterno || "-"}</span>
                </p>
                <p className="flex items-center gap-2">
                  <MdPeopleAlt className="h-4 w-4 text-brand-500" />
                  <span>Capacidad: {salon.capacidad}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-xs font-medium">Tipo:</span>
                  <span>{salon.tipo || "AMBOS"}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-xs font-medium">Horario:</span>
                  <span>{salon.tipoHorario || "AMBOS"}</span>
                </p>
                <p className="flex items-start gap-2">
                  <MdBuild className="mt-0.5 h-4 w-4 text-brand-500" />
                  <span>{salon.recursos || "Sin recursos especificados"}</span>
                </p>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-175 m-4">
        <div className="no-scrollbar relative w-full max-w-175 overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {selectedSalon ? "Editar salón" : "Crear salón"}
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Completa la información del salón para su gestión en congresos.
            </p>
          </div>

          <form className="flex flex-col" onSubmit={handleSave}>
            <div className="custom-scrollbar h-120 overflow-y-auto px-2 pb-3">
              {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/10 dark:text-red-400">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1">
                  <Label>Nombre</Label>
                  <Input
                    type="text"
                    placeholder="Ej. Salón Principal"
                    value={formData.nombre}
                    onChange={(event) => setFormData({ ...formData, nombre: event.target.value })}
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Capacidad</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.capacidad}
                    onChange={(event) => setFormData({ ...formData, capacidad: Number(event.target.value || 0) })}
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>ID interno</Label>
                  <Input
                    type="text"
                    placeholder="Ej. LAB-101"
                    value={formData.codigoInterno}
                    onChange={(event) => setFormData({ ...formData, codigoInterno: event.target.value })}
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Tipo</Label>
                  <select
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm dark:border-gray-700"
                    value={formData.tipo}
                    onChange={(event) =>
                      setFormData({ ...formData, tipo: event.target.value as "LAB" | "CURSO" | "AMBOS" })
                    }
                  >
                    <option value="LAB">Lab</option>
                    <option value="CURSO">Curso</option>
                    <option value="AMBOS">Ambos</option>
                  </select>
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Tipo de horario</Label>
                  <select
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm dark:border-gray-700"
                    value={formData.tipoHorario}
                    onChange={(event) =>
                      setFormData({ ...formData, tipoHorario: event.target.value as "MANANA" | "TARDE" | "AMBOS" })
                    }
                  >
                    <option value="MANANA">Mañana</option>
                    <option value="TARDE">Tarde</option>
                    <option value="AMBOS">Ambos</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <Label>Ubicación</Label>
                  <Input
                    type="text"
                    placeholder="Ej. Edificio A, nivel 2"
                    value={formData.ubicacion}
                    onChange={(event) => setFormData({ ...formData, ubicacion: event.target.value })}
                  />
                </div>

                <div className="col-span-2">
                  <Label>Recursos</Label>
                  <TextCongreso
                    placeholder="Proyector, sonido, pizarra, aire acondicionado..."
                    value={formData.recursos}
                    onChange={(value) => setFormData({ ...formData, recursos: value })}
                  />
                </div>

              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 px-2 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal} type="button">
                Cancelar
              </Button>
              <Button size="sm" type="submit">
                {selectedSalon ? "Guardar cambios" : "Crear salón"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
