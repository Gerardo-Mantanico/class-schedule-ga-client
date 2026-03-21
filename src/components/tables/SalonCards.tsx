"use client";

import React, { useState } from "react";
import { MdMeetingRoom, MdTag, MdPeopleAlt, MdSchedule, MdViewModule, MdScience, MdCheckCircle, MdUpdate } from "react-icons/md";
import { toast } from "react-hot-toast";
import { useModal } from "@/hooks/useModal";
import { useSalon, type Salon } from "@/hooks/useSalon";
import { useCurso } from "@/hooks/useCurso";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { PencilIcon, TrashBinIcon } from "@/icons";

const semesterOptions = [
  { value: 1, label: "Primer semestre" },
  { value: 2, label: "Segundo semestre" },
  { value: 3, label: "Tercer semestre" },
  { value: 4, label: "Cuarto semestre" },
  { value: 5, label: "Quinto semestre" },
  { value: 6, label: "Sexto semestre" },
  { value: 7, label: "Séptimo semestre" },
  { value: 8, label: "Octavo semestre" },
  { value: 9, label: "Noveno semestre" },
  { value: 10, label: "Décimo semestre" },
];

const formatSemester = (value?: number) => {
  const option = semesterOptions.find((item) => item.value === Number(value));
  return option?.label ?? `${Number(value || 1)}° semestre`;
};

const formatSchedule = (value?: string) => (value === "AFTERNOON" ? "Tarde" : "Mañana");
const formatDateTime = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("es-GT");
};

const fieldCardClass = "flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 dark:bg-white/5";

const emptyForm = {
  courseCode: 0,
  name: "",
  semester: 1,
  isCommonArea: false,
  isMandatory: true,
  hasLab: false,
  numberOfPeriods: 1,
  typeOfSchedule: "MORNING" as "MORNING" | "AFTERNOON",
};

export default function SalonCards() {
  const { isOpen, openModal, closeModal } = useModal();
  const { salones, loading, error, createSalon, updateSalon, deleteSalon } = useSalon();
  const { cursos: cursosDisponibles, loading: loadingCursos } = useCurso();

  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const handleAdd = () => {
    setSelectedSalon(null);
    setFormData(emptyForm);
    openModal();
  };

  const handleEdit = (salon: Salon) => {
    setSelectedSalon(salon);
    setFormData({
      courseCode: Number(salon.courseCode ?? salon.id ?? 0),
      name: salon.name || "",
      semester: Number(salon.semester ?? 1),
      isCommonArea: Boolean(salon.isCommonArea),
      isMandatory: Boolean(salon.isMandatory ?? true),
      hasLab: Boolean(salon.hasLab),
      numberOfPeriods: Number(salon.numberOfPeriods ?? 1),
      typeOfSchedule: salon.typeOfSchedule === "AFTERNOON" ? "AFTERNOON" : "MORNING",
    });
    openModal();
  };

  const handleDelete = async (salon: Salon) => {
    const idToUse = Number(salon.courseCode ?? salon.id ?? 0);
    const success = await deleteSalon(idToUse);
    if (success) {
      toast.success("Registro eliminado con éxito");
      return;
    }

    toast.error("No fue posible eliminar el registro");
  };

  const handleSave = async (event: React.BaseSyntheticEvent) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Completa el nombre.");
      return;
    }

    if (formData.courseCode <= 0) {
      toast.error("Completa un código válido.");
      return;
    }

    if (formData.semester <= 0 || formData.numberOfPeriods <= 0) {
      toast.error("Semestre y número de periodos deben ser mayores a cero.");
      return;
    }

    const payload = { ...formData };

    const success = selectedSalon
      ? await updateSalon(Number(selectedSalon.courseCode ?? selectedSalon.id), payload)
      : await createSalon(payload);

    if (success) {
      toast.success(`Registro ${selectedSalon ? "actualizado" : "creado"} con éxito`);
      closeModal();
      return;
    }

    toast.error("No fue posible guardar el registro");
  };

  if (loading && salones.length === 0) {
    return <div>Cargando registros...</div>;
  }

  if (error && salones.length === 0) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-white/5 dark:bg-white/3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Salón</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Formulario en español, payload al servidor en inglés.</p>
        </div>
        <Button size="sm" onClick={handleAdd}>Agregar</Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {salones.map((salon) => (
          <article key={salon.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-white/5 dark:bg-white/3">
            <div className="mb-4 flex items-start justify-between gap-3 border-b border-gray-100 pb-4 dark:border-white/10">
              <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300">
                <MdMeetingRoom className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-base font-semibold text-gray-800 dark:text-white/90">{salon.name}</h4>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Código #{salon.courseCode ?? salon.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(salon)}
                  aria-label={`Editar ${salon.name}`}
                  className="rounded-lg bg-brand-50 p-2 text-brand-600 transition-colors hover:bg-brand-100"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(salon)}
                  aria-label={`Eliminar ${salon.name}`}
                  className="rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100"
                >
                  <TrashBinIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${salon.active ? "bg-success-50 text-success-700 dark:bg-success-500/20 dark:text-success-300" : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"}`}>
                {salon.active ? "Activo" : "Inactivo"}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Académico</p>
                <div className="grid grid-cols-1 gap-2 text-sm text-gray-600 dark:text-gray-300 sm:grid-cols-2">
                  <p className={fieldCardClass}><MdTag className="h-4 w-4 text-brand-500" />Código: {salon.courseCode ?? salon.id}</p>
                  <p className={fieldCardClass}><MdPeopleAlt className="h-4 w-4 text-brand-500" />{formatSemester(salon.semester)}</p>
                  <p className={fieldCardClass}><MdViewModule className="h-4 w-4 text-brand-500" />Periodos: {salon.numberOfPeriods}</p>
                  <p className={fieldCardClass}><MdSchedule className="h-4 w-4 text-brand-500" />Horario: {salon.typeOfSchedule} ({formatSchedule(salon.typeOfSchedule)})</p>
                  <p className={fieldCardClass}><MdScience className="h-4 w-4 text-brand-500" />Laboratorio: {salon.hasLab ? "Sí" : "No"}</p>
                  <p className={fieldCardClass}><MdCheckCircle className="h-4 w-4 text-brand-500" />Área común: {salon.isCommonArea ? "Sí" : "No"}</p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Auditoría</p>
                <div className="grid grid-cols-1 gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <p className={fieldCardClass}><MdUpdate className="h-4 w-4 text-brand-500" />Creado: {formatDateTime(salon.createdAt)}</p>
                  <p className={fieldCardClass}><MdUpdate className="h-4 w-4 text-brand-500" />Actualizado: {formatDateTime(salon.updatedAt)}</p>
                </div>
              </div>
            </div>
          </article>
        ))}

        {salones.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600 dark:border-white/5 dark:bg-white/3 dark:text-gray-300 sm:col-span-2 xl:col-span-3">
            No hay registros todavía. Usa <span className="font-medium">Agregar</span> para crear el primero.
          </div>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-175 m-4">
        <div className="no-scrollbar relative w-full max-w-175 overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">{selectedSalon ? "Editar" : "Crear"} registro</h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">Completa la información en español.</p>
          </div>

          <form className="flex flex-col" onSubmit={handleSave}>
            <div className="custom-scrollbar h-120 overflow-y-auto px-2 pb-3">
              {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/10 dark:text-red-400">{error}</div>}

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1">
                  <Label>Nombre</Label>
                  <Input type="text" placeholder="Ej. Algorithms" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Código del curso</Label>
                  <select
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm dark:border-gray-700"
                    value={formData.courseCode || ""}
                    onChange={(event) => {
                      const selectedCode = Number(event.target.value || 0);
                      setFormData((prev) => ({
                        ...prev,
                        courseCode: selectedCode,
                      }));
                    }}
                  >
                    <option value="" disabled>
                      {loadingCursos ? "Cargando cursos..." : "Selecciona un curso"}
                    </option>
                    {cursosDisponibles.map((curso) => {
                      const code = Number(curso.courseCode ?? curso.id ?? 0);
                      return (
                        <option key={code} value={code}>
                          {code} - {curso.name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Semestre</Label>
                  <select className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm dark:border-gray-700" value={formData.semester} onChange={(event) => setFormData({ ...formData, semester: Number(event.target.value) })}>
                    {semesterOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Número de periodos</Label>
                  <Input type="number" min="1" value={formData.numberOfPeriods} onChange={(event) => setFormData({ ...formData, numberOfPeriods: Number(event.target.value || 1) })} />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Tipo de horario</Label>
                  <select className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm dark:border-gray-700" value={formData.typeOfSchedule} onChange={(event) => setFormData({ ...formData, typeOfSchedule: event.target.value as "MORNING" | "AFTERNOON" })}>
                    <option value="MORNING">Mañana</option>
                    <option value="AFTERNOON">Tarde</option>
                  </select>
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Área común</Label>
                  <div className="mt-3 flex items-center gap-2">
                    <input id="isCommonArea" type="checkbox" checked={formData.isCommonArea} onChange={(event) => setFormData({ ...formData, isCommonArea: event.target.checked })} />
                    <label htmlFor="isCommonArea" className="text-sm text-gray-700 dark:text-gray-300">Es área común</label>
                  </div>
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Obligatorio</Label>
                  <div className="mt-3 flex items-center gap-2">
                    <input id="isMandatory" type="checkbox" checked={formData.isMandatory} onChange={(event) => setFormData({ ...formData, isMandatory: event.target.checked })} />
                    <label htmlFor="isMandatory" className="text-sm text-gray-700 dark:text-gray-300">Es obligatorio</label>
                  </div>
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Laboratorio</Label>
                  <div className="mt-3 flex items-center gap-2">
                    <input id="hasLab" type="checkbox" checked={formData.hasLab} onChange={(event) => setFormData({ ...formData, hasLab: event.target.checked })} />
                    <label htmlFor="hasLab" className="text-sm text-gray-700 dark:text-gray-300">Tiene laboratorio</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 px-2 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal} type="button">Cancelar</Button>
              <Button size="sm" type="submit">{selectedSalon ? "Guardar cambios" : "Crear"}</Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
