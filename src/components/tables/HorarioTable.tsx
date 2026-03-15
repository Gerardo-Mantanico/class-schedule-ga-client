"use client";

import React, { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useModal } from "@/hooks/useModal";
import { useHorario } from "@/hooks/useHorario";
import { GenericTable, type Column } from "@/components/ui/table/GenericTable";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import type { HorarioGenerado } from "@/interfaces/HorariosDemo";

const columns: Column<HorarioGenerado>[] = [
  { header: "Curso", cell: (item) => `${item.cursoCodigo} - ${item.cursoNombre}` },
  { header: "Docente", accessorKey: "docenteRegistro" },
  { header: "Salón", cell: (item) => (item.sinSalon ? "Sin salón" : item.salonNombre || "-") },
  { header: "Día", accessorKey: "dia" },
  { header: "Horario", cell: (item) => `${item.inicio} - ${item.fin}` },
  { header: "Tipo", accessorKey: "tipo" },
];

const initialForm: Omit<HorarioGenerado, "id"> = {
  configuracionId: 1,
  cursoCodigo: "",
  cursoNombre: "",
  salonNombre: "",
  docenteRegistro: "",
  dia: "Lunes",
  inicio: "07:00",
  fin: "07:50",
  tipo: "CURSO",
  sinSalon: false,
};

export default function HorarioTable() {
  const { isOpen, openModal, closeModal } = useModal();
  const { horarios, loading, error, createHorario, updateHorario, deleteHorario, validateHorario } = useHorario();

  const [selected, setSelected] = useState<HorarioGenerado | null>(null);
  const [formData, setFormData] = useState(initialForm);
  const [warnings, setWarnings] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const totalPages = Math.max(1, Math.ceil(horarios.length / itemsPerPage));
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return horarios.slice(start, start + itemsPerPage);
  }, [horarios, currentPage]);

  const handleAdd = () => {
    setSelected(null);
    setFormData(initialForm);
    setWarnings([]);
    openModal();
  };

  const handleEdit = (item: HorarioGenerado) => {
    setSelected(item);
    setFormData({
      configuracionId: item.configuracionId,
      cursoCodigo: item.cursoCodigo,
      cursoNombre: item.cursoNombre,
      salonNombre: item.salonNombre,
      docenteRegistro: item.docenteRegistro,
      dia: item.dia,
      inicio: item.inicio,
      fin: item.fin,
      tipo: item.tipo,
      sinSalon: item.sinSalon,
    });
    setWarnings([]);
    openModal();
  };

  const handleValidateWarnings = async () => {
    const currentWarnings = await validateHorario(formData, selected?.id);
    setWarnings(currentWarnings as string[]);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    const success = selected ? await updateHorario(selected.id, formData) : await createHorario(formData);

    if (success) {
      toast.success(`Horario ${selected ? "actualizado" : "creado"} con éxito`);
      closeModal();
      return;
    }

    toast.error("No fue posible guardar el horario");
  };

  if (loading && horarios.length === 0) return <div>Cargando horarios...</div>;
  if (error && horarios.length === 0) return <div>Error: {error}</div>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-white/5">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Modificación manual de horarios</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">El sistema advierte choques, pero permite guardar cambios.</p>
        </div>
        <Button size="sm" onClick={handleAdd}>
          Nuevo ajuste
        </Button>
      </div>

      <GenericTable
        data={currentData}
        columns={columns}
        onEdit={handleEdit}
        onDelete={(item) => deleteHorario(item.id)}
        pagination={{ currentPage, totalPages, onPageChange: setCurrentPage }}
      />

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-170 m-4">
        <div className="no-scrollbar relative w-full max-w-170 overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {selected ? "Editar horario" : "Crear horario"}
          </h4>

          <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {error && (
              <div className="col-span-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/10 dark:text-red-400">{error}</div>
            )}

            <div>
              <Label>Código curso</Label>
              <Input value={formData.cursoCodigo} onChange={(event) => setFormData((prev) => ({ ...prev, cursoCodigo: event.target.value.toUpperCase() }))} />
            </div>
            <div>
              <Label>Nombre curso</Label>
              <Input value={formData.cursoNombre} onChange={(event) => setFormData((prev) => ({ ...prev, cursoNombre: event.target.value }))} />
            </div>
            <div>
              <Label>Registro docente</Label>
              <Input value={formData.docenteRegistro} onChange={(event) => setFormData((prev) => ({ ...prev, docenteRegistro: event.target.value.toUpperCase() }))} />
            </div>
            <div>
              <Label>Salón</Label>
              <Input
                value={formData.salonNombre}
                disabled={formData.sinSalon}
                onChange={(event) => setFormData((prev) => ({ ...prev, salonNombre: event.target.value }))}
              />
            </div>

            <div>
              <Label>Día</Label>
              <select
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm dark:border-gray-700"
                value={formData.dia}
                onChange={(event) => setFormData((prev) => ({ ...prev, dia: event.target.value }))}
              >
                {[
                  "Lunes",
                  "Martes",
                  "Miércoles",
                  "Jueves",
                  "Viernes",
                  "Sábado",
                ].map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Tipo</Label>
              <select
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm dark:border-gray-700"
                value={formData.tipo}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, tipo: event.target.value as "CURSO" | "LAB" }))
                }
              >
                <option value="CURSO">Curso</option>
                <option value="LAB">Laboratorio</option>
              </select>
            </div>

            <div>
              <Label>Inicio</Label>
              <Input type="time" value={formData.inicio} onChange={(event) => setFormData((prev) => ({ ...prev, inicio: event.target.value }))} />
            </div>
            <div>
              <Label>Fin</Label>
              <Input type="time" value={formData.fin} onChange={(event) => setFormData((prev) => ({ ...prev, fin: event.target.value }))} />
            </div>

            <div className="col-span-2 flex items-center gap-2">
              <input
                id="sinSalon"
                type="checkbox"
                checked={formData.sinSalon}
                onChange={(event) => setFormData((prev) => ({ ...prev, sinSalon: event.target.checked }))}
              />
              <Label htmlFor="sinSalon">Marcar como "sin salón"</Label>
            </div>

            <div className="col-span-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
              Puedes validar choques antes de guardar; las advertencias no bloquean el guardado.
            </div>

            {warnings.length > 0 && (
              <div className="col-span-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/10 dark:text-red-400">
                <p className="mb-1 font-semibold">Advertencias de choque:</p>
                <ul className="list-disc pl-5">
                  {warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="col-span-2 flex items-center justify-end gap-3">
              <Button size="sm" type="button" variant="outline" onClick={handleValidateWarnings}>
                Validar choques
              </Button>
              <Button size="sm" type="button" variant="outline" onClick={closeModal}>
                Cancelar
              </Button>
              <Button size="sm" type="submit">
                {selected ? "Guardar cambios" : "Crear horario"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
