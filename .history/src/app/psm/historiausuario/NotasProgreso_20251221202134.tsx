"use client";

import Button from "@/components/ui/button/Button";
import React, { useRef, useEffect, useState } from "react";
import SignaturePad from "signature_pad";
import { useSesiones } from "../../../hooks/historaClinica/useSesiones";
import { Sesion } from "@/interfaces/historiaClinica/Sesiones";
import ListaNotasProgreso from "./ListaNotasProgreso";

interface NotasProgresoProps {
  onSubmit?: (data: Sesion) => void;
  onCancel?: () => void;
  pacienteId?: string;
}



export default function NotasProgreso({
  onSubmit,
  onCancel,
  pacienteId,
}: NotasProgresoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);

  const [formData, setFormData] = useState<Sesion>({
    fecha: new Date().toISOString().slice(0, 16),
    numeroSesiones: 1,
    asistencia: true,
    justificacionInasistencia: "",
    temasAbordados: " ",
    intervencionesRealizadas: "",
    repuestaPaciente: "",
    tareasAsignadas: "",
    observaciones: "",
    proximaCita: "",
    firmaPsicologo: "",
  });
  // Estado para mostrar el modal y las notas guardadas
  const [mostrarNotas, setMostrarNotas] = useState(false);
  const [notasGuardadas, setNotasGuardadas] = useState<Sesion[]>([]);

  const [etiquetasInput, setEtiquetasInput] = useState("");
  const [errores, setErrores] = useState<Record<string, string>>({});

  



  // Inicializar SignaturePad
  useEffect(() => {
    if (canvasRef.current && !signaturePadRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      signaturePadRef.current = new SignaturePad(canvas, {
        backgroundColor: "rgb(255, 255, 255)",
        penColor: "rgb(0, 0, 0)",
      });
    }
  }, []);

  const validar = () => {
    const nuevosErrores: Record<string, string> = {};


    // Validar próxima cita
    const proximaCita = new Date(formData.proximaCita);
    if (proximaCita <= new Date()) {
      nuevosErrores.proximaCita = "La próxima cita debe ser posterior a hoy";
    }

    // Si no asiste, requiere justificación
    if (!formData.asistencia && !formData.justificacionInasistencia) {
      nuevosErrores.justificacionInasistencia =
        "La justificación es requerida cuando el paciente no asiste";
    }



    // Validar firma
    if (signaturePadRef.current?.isEmpty()) {
      nuevosErrores.firma = "La firma digital es requerida";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };




  const handleLimpiarFirma = () => {
    signaturePadRef.current?.clear();
  };


const hcId = typeof window !== "undefined" ? localStorage.getItem("HistoriClinica") : null;

 const { getItemSesion, createItem } = useSesiones();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) {
      return;
    }
    if (!hcId) {
      alert("No se encontró el id de la historia clínica");
      return;
    }
    const firmaData = signaturePadRef.current?.toDataURL() || "";
    const payload = {
      ...formData,
      firmaPsicologo: firmaData,
      hcId: Number(hcId),
    };
    try {
      await createItem(payload);
      alert("Información guardada correctamente");
      setNotasGuardadas((prev) => [...prev, payload]);
      onSubmit?.(payload);
    } catch (error: any) {
      alert(error?.message || "Error al guardar la información");
    }
  };
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default">
      <div className="border-b border-stroke px-4 py-6 sm:px-6">
        <h3 className="font-medium text-black">Notas de Progreso (por Sesión)</h3>
      </div>
      <form onSubmit={handleSubmit} className="p-4 sm:p-6">
        {/* ...formulario igual que antes... */}
        {/* Fila 1: Fecha y Número de Sesión */}
        <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Fecha de Sesión */}
          <div>
            <label className="mb-3 block text-sm font-medium text-black">
              Fecha de Sesión <span className="text-red-500">*</span>
            </label>
            <input
              disabled
              type="datetime-local"
              value={formData.fecha}
            />
          </div>
          {/* Número de Sesión */}
          <div>
            <label className="mb-3 block text-sm font-medium text-black">
              Nº de Sesión <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.numeroSesiones}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  numeroSesiones: parseInt(e.target.value) || 1,
                })
              }
              disabled
              className="w-full appearance-none rounded border border-stroke bg-gray-100 px-4 py-2 text-black outline-none transition disabled:cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">Autocalculado</p>
          </div>
        </div>
        {/* ...resto del formulario igual... */}
        {/* Botones */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-white hover:bg-opacity-90"
          >
            Guardar Notas
          </Button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex justify-center rounded border border-stroke bg-white px-6 py-2 font-medium text-black hover:bg-gray-100"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
      {/* Botón para mostrar todas las notas */}
      <Button
        type="button"
        className="mt-4 flex justify-center rounded bg-secondary px-6 py-2 font-medium text-white hover:bg-opacity-90"
        onClick={() => setMostrarNotas(true)}
      >
        Ver todas las notas
      </Button>
      {/* Modal de notas */}
      {mostrarNotas && (
        <ListaNotasProgreso
          notas={notasGuardadas}
          onClose={() => setMostrarNotas(false)}
        />
      )}
    </div>
  );
}