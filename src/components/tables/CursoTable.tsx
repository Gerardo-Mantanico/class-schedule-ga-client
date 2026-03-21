"use client";

import React, { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useModal } from "@/hooks/useModal";
import { useCurso, type Curso } from "@/hooks/useCurso";
import { GenericTable, type Column } from "@/components/ui/table/GenericTable";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

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

const scheduleLabel = (value?: string) => (value === "AFTERNOON" ? "Tarde" : "Mañana");
const semesterLabel = (value?: number) => {
  const option = semesterOptions.find((item) => item.value === Number(value));
  return option?.label ?? `${Number(value || 1)}° semestre`;
};

type FormData = {
  courseCode: number;
  name: string;
  semester: number;
  isCommonArea: boolean;
  isMandatory: boolean;
  hasLab: boolean;
  numberOfPeriods: number;
  typeOfSchedule: "MORNING" | "AFTERNOON";
};

const initialForm: FormData = {
  courseCode: 0,
  name: "",
  semester: 1,
  isCommonArea: false,
  isMandatory: true,
  hasLab: false,
  numberOfPeriods: 1,
  typeOfSchedule: "MORNING",
};

const columns: Column<Curso>[] = [
  {
    header: "Curso",
    cell: (item) => (
      <div>
        <p className="font-medium text-gray-800 dark:text-white/90">{item.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Código: {item.courseCode ?? item.id}</p>
      </div>
    ),
  },
  {
    header: "Semestre",
    cell: (item) => semesterLabel(item.semester),
  },
  {
    header: "Horario",
    cell: (item) => `${item.typeOfSchedule} (${scheduleLabel(item.typeOfSchedule)})`,
  },
  {
    header: "Periodo(s)",
    accessorKey: "numberOfPeriods",
  },
  {
    header: "Estado",
    cell: (item) => (
      <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
        {item.active ? "Activo" : "Inactivo"}
      </span>
    ),
  },
];

export default function CursoTable() {
  const { isOpen, openModal, closeModal } = useModal();
  const { cursos, loading, error, createCurso, updateCurso, deleteCurso } = useCurso();

  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
  const [formData, setFormData] = useState<FormData>(initialForm);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const totalPages = Math.max(1, Math.ceil(cursos.length / itemsPerPage));
  const currentCursos = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return cursos.slice(start, start + itemsPerPage);
  }, [cursos, currentPage]);

  const handleAdd = () => {
    setSelectedCurso(null);
    setFormData(initialForm);
    openModal();
  };

  const handleEdit = (curso: Curso) => {
    setSelectedCurso(curso);
    setFormData({
      courseCode: Number(curso.courseCode ?? curso.id ?? 0),
      name: curso.name,
      semester: Number(curso.semester ?? 1),
      isCommonArea: Boolean(curso.isCommonArea),
      isMandatory: Boolean(curso.isMandatory ?? true),
      hasLab: Boolean(curso.hasLab),
      numberOfPeriods: Number(curso.numberOfPeriods ?? 1),
      typeOfSchedule: curso.typeOfSchedule === "AFTERNOON" ? "AFTERNOON" : "MORNING",
    });
    openModal();
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }

    if (formData.courseCode <= 0) {
      toast.error("El código del curso debe ser mayor a cero");
      return;
    }

    if (formData.semester <= 0 || formData.numberOfPeriods <= 0) {
      toast.error("Semestre y número de periodos deben ser mayores a cero");
      return;
    }

    const payload = {
      courseCode: Number(formData.courseCode),
      name: formData.name.trim(),
      semester: Number(formData.semester),
      isCommonArea: formData.isCommonArea,
      isMandatory: formData.isMandatory,
      hasLab: formData.hasLab,
      numberOfPeriods: Number(formData.numberOfPeriods),
      typeOfSchedule: formData.typeOfSchedule,
    };

    const success = selectedCurso
      ? await updateCurso(Number(selectedCurso.courseCode ?? selectedCurso.id), payload)
      : await createCurso(payload);

    if (success) {
      toast.success(`Curso ${selectedCurso ? "actualizado" : "creado"} con éxito`);
      closeModal();
    } else {
      toast.error("No fue posible guardar el curso");
    }
  };

  if (loading && cursos.length === 0) return <div>Cargando cursos...</div>;
  if (error && cursos.length === 0) return <div>Error: {error}</div>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-white/5">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Gestión de cursos</h3>
        <Button size="sm" onClick={handleAdd}>
          Agregar curso
        </Button>
      </div>

      <GenericTable
        data={currentCursos}
        columns={columns}
        onEdit={handleEdit}
        onDelete={(item) => deleteCurso(Number(item.courseCode ?? item.id))}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
        }}
      />

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-190 m-4">
        <div className="no-scrollbar relative w-full max-w-190 overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {selectedCurso ? "Editar curso" : "Crear curso"}
          </h4>

          <form onSubmit={handleSave} className="flex flex-col gap-5">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/10 dark:text-red-400">{error}</div>
            )}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <Label>Nombre</Label>
                <Input value={formData.name} onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))} />
              </div>
              <div>
                <Label>Código del curso</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.courseCode}
                  onChange={(event) => setFormData((prev) => ({ ...prev, courseCode: Number(event.target.value || 0) }))}
                />
              </div>

              <div>
                <Label>Semestre</Label>
                <select
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm dark:border-gray-700"
                  value={formData.semester}
                  onChange={(event) => setFormData((prev) => ({ ...prev, semester: Number(event.target.value) }))}
                >
                  {semesterOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Número de periodos</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.numberOfPeriods}
                  onChange={(event) => setFormData((prev) => ({ ...prev, numberOfPeriods: Number(event.target.value || 1) }))}
                />
              </div>

              <div>
                <Label>Tipo de horario</Label>
                <select
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm dark:border-gray-700"
                  value={formData.typeOfSchedule}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, typeOfSchedule: event.target.value as FormData["typeOfSchedule"] }))
                  }
                >
                  <option value="MORNING">Mañana</option>
                  <option value="AFTERNOON">Tarde</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-7">
                <input
                  id="hasLab"
                  type="checkbox"
                  checked={formData.hasLab}
                  onChange={(event) => setFormData((prev) => ({ ...prev, hasLab: event.target.checked }))}
                />
                <Label htmlFor="hasLab">Tiene laboratorio</Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="isCommonArea"
                  type="checkbox"
                  checked={formData.isCommonArea}
                  onChange={(event) => setFormData((prev) => ({ ...prev, isCommonArea: event.target.checked }))}
                />
                <Label htmlFor="isCommonArea">Es área común</Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="isMandatory"
                  type="checkbox"
                  checked={formData.isMandatory}
                  onChange={(event) => setFormData((prev) => ({ ...prev, isMandatory: event.target.checked }))}
                />
                <Label htmlFor="isMandatory">Es obligatorio</Label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button size="sm" variant="outline" type="button" onClick={closeModal}>
                Cancelar
              </Button>
              <Button size="sm" type="submit">
                {selectedCurso ? "Guardar cambios" : "Crear curso"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
