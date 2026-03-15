"use client";

import React, { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useModal } from "@/hooks/useModal";
import { useCurso } from "@/hooks/useCurso";
import { GenericTable, type Column } from "@/components/ui/table/GenericTable";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import type { Curso, CursoCarreraSemestre } from "@/interfaces/HorariosDemo";

type FormData = {
  nombre: string;
  codigo: string;
  tipoHorario: "MANANA" | "TARDE" | "AMBOS";
  tieneLab: boolean;
  esAreaComun: boolean;
  semestreAreaComun: number;
  obligatorioAreaComun: boolean;
  periodos: number;
  carrera: string;
  semestre: number;
  seccion: string;
  tipo: "OBLIGATORIO" | "OPTATIVO";
};

const columns: Column<Curso>[] = [
  {
    header: "Curso",
    cell: (curso) => (
      <div>
        <p className="font-medium text-gray-800 dark:text-white/90">{curso.nombre}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Código: {curso.codigo}</p>
      </div>
    ),
  },
  {
    header: "Horario",
    accessorKey: "tipoHorario",
  },
  {
    header: "Periodos",
    accessorKey: "periodos",
  },
  {
    header: "Tipo",
    cell: (curso) => (
      <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
        {curso.esAreaComun ? "Área común" : "Por carrera"}
      </span>
    ),
  },
  {
    header: "Carreras/Sem.",
    cell: (curso) =>
      curso.esAreaComun ? (
        <span className="text-xs text-gray-600 dark:text-gray-300">Semestre común: {curso.semestreAreaComun}</span>
      ) : (
        <span className="text-xs text-gray-600 dark:text-gray-300">{curso.carrerasSemestres.length} asignaciones</span>
      ),
  },
];

const initialForm: FormData = {
  nombre: "",
  codigo: "",
  tipoHorario: "AMBOS",
  tieneLab: false,
  esAreaComun: false,
  semestreAreaComun: 1,
  obligatorioAreaComun: true,
  periodos: 1,
  carrera: "",
  semestre: 1,
  seccion: "A",
  tipo: "OBLIGATORIO",
};

export default function CursoTable() {
  const { isOpen, openModal, closeModal } = useModal();
  const { cursos, loading, error, createCurso, updateCurso, deleteCurso } = useCurso();

  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [asignaciones, setAsignaciones] = useState<CursoCarreraSemestre[]>([]);

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
    setAsignaciones([]);
    openModal();
  };

  const handleEdit = (curso: Curso) => {
    setSelectedCurso(curso);
    setFormData({
      nombre: curso.nombre,
      codigo: curso.codigo,
      tipoHorario: curso.tipoHorario,
      tieneLab: curso.tieneLab,
      esAreaComun: curso.esAreaComun,
      semestreAreaComun: curso.semestreAreaComun ?? 1,
      obligatorioAreaComun: curso.obligatorioAreaComun ?? true,
      periodos: curso.periodos,
      carrera: "",
      semestre: 1,
      seccion: "A",
      tipo: "OBLIGATORIO",
    });
    setAsignaciones(curso.carrerasSemestres || []);
    openModal();
  };

  const addAsignacion = () => {
    if (!formData.carrera.trim()) {
      toast.error("Ingresa una carrera para asignar");
      return;
    }

    setAsignaciones((prev) => [
      ...prev,
      {
        carrera: formData.carrera.trim(),
        semestre: Number(formData.semestre),
        seccion: formData.seccion.trim(),
        tipo: formData.tipo,
      },
    ]);

    setFormData((prev) => ({ ...prev, carrera: "", semestre: 1, seccion: "A" }));
  };

  const removeAsignacion = (index: number) => {
    setAsignaciones((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.nombre.trim() || !formData.codigo.trim()) {
      toast.error("Nombre y código son obligatorios");
      return;
    }

    if (!formData.esAreaComun && asignaciones.length === 0) {
      toast.error("Debes asignar al menos una carrera y semestre");
      return;
    }

    const payload = {
      nombre: formData.nombre.trim(),
      codigo: formData.codigo.trim(),
      tipoHorario: formData.tipoHorario,
      tieneLab: formData.tieneLab,
      esAreaComun: formData.esAreaComun,
      semestreAreaComun: formData.esAreaComun ? Number(formData.semestreAreaComun) : undefined,
      obligatorioAreaComun: formData.esAreaComun ? formData.obligatorioAreaComun : undefined,
      periodos: Number(formData.periodos),
      carrerasSemestres: formData.esAreaComun ? [] : asignaciones,
      usadoEnHorario: selectedCurso?.usadoEnHorario ?? false,
    };

    const success = selectedCurso
      ? await updateCurso(selectedCurso.id, payload)
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
        onDelete={(item) => deleteCurso(item.id)}
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
                <Input value={formData.nombre} onChange={(event) => setFormData((prev) => ({ ...prev, nombre: event.target.value }))} />
              </div>
              <div>
                <Label>Código</Label>
                <Input value={formData.codigo} onChange={(event) => setFormData((prev) => ({ ...prev, codigo: event.target.value.toUpperCase() }))} />
              </div>

              <div>
                <Label>Tipo horario</Label>
                <select
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm dark:border-gray-700"
                  value={formData.tipoHorario}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, tipoHorario: event.target.value as FormData["tipoHorario"] }))
                  }
                >
                  <option value="MANANA">Mañana</option>
                  <option value="TARDE">Tarde</option>
                  <option value="AMBOS">Ambos</option>
                </select>
              </div>
              <div>
                <Label>Periodos</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.periodos}
                  onChange={(event) => setFormData((prev) => ({ ...prev, periodos: Number(event.target.value || 1) }))}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="tieneLab"
                  type="checkbox"
                  checked={formData.tieneLab}
                  onChange={(event) => setFormData((prev) => ({ ...prev, tieneLab: event.target.checked }))}
                />
                <Label htmlFor="tieneLab">Tiene laboratorio</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="esAreaComun"
                  type="checkbox"
                  checked={formData.esAreaComun}
                  onChange={(event) => setFormData((prev) => ({ ...prev, esAreaComun: event.target.checked }))}
                />
                <Label htmlFor="esAreaComun">Es área común</Label>
              </div>
            </div>

            {formData.esAreaComun ? (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div>
                  <Label>Semestre área común</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.semestreAreaComun}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, semestreAreaComun: Number(event.target.value || 1) }))
                    }
                  />
                </div>
                <div className="flex items-center gap-2 pt-7">
                  <input
                    id="obligatorioAreaComun"
                    type="checkbox"
                    checked={formData.obligatorioAreaComun}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, obligatorioAreaComun: event.target.checked }))
                    }
                  />
                  <Label htmlFor="obligatorioAreaComun">Obligatorio en área común</Label>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 p-4 dark:border-white/10">
                <h5 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Asignar carrera y semestre</h5>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                  <div className="lg:col-span-2">
                    <Label>Carrera</Label>
                    <Input
                      value={formData.carrera}
                      onChange={(event) => setFormData((prev) => ({ ...prev, carrera: event.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Semestre</Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.semestre}
                      onChange={(event) => setFormData((prev) => ({ ...prev, semestre: Number(event.target.value || 1) }))}
                    />
                  </div>
                  <div>
                    <Label>Sección</Label>
                    <Input
                      value={formData.seccion}
                      onChange={(event) => setFormData((prev) => ({ ...prev, seccion: event.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Tipo</Label>
                    <select
                      className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm dark:border-gray-700"
                      value={formData.tipo}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, tipo: event.target.value as FormData["tipo"] }))
                      }
                    >
                      <option value="OBLIGATORIO">Obligatorio</option>
                      <option value="OPTATIVO">Optativo</option>
                    </select>
                  </div>
                </div>

                <div className="mt-3 flex justify-end">
                  <Button size="sm" type="button" variant="outline" onClick={addAsignacion}>
                    Agregar asignación
                  </Button>
                </div>

                <div className="mt-3 space-y-2 text-sm">
                  {asignaciones.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">No hay asignaciones agregadas.</p>
                  ) : (
                    asignaciones.map((item, index) => (
                      <div key={`${item.carrera}-${index}`} className="flex items-center justify-between rounded-lg bg-gray-50 p-2 dark:bg-white/5">
                        <span className="text-gray-700 dark:text-gray-300">
                          {item.carrera} - Sem {item.semestre} - Sec {item.seccion || "-"} - {item.tipo}
                        </span>
                        <button
                          type="button"
                          className="text-xs font-medium text-red-600 dark:text-red-300"
                          onClick={() => removeAsignacion(index)}
                        >
                          Quitar
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

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
