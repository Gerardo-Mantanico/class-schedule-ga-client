"use client";

import Button from "@/components/ui/button/Button";
import React, { useRef, useEffect, useState } from "react";
import SignaturePad from "signature_pad";
import { useSesiones } from "../../../hooks/historaClinica/useSesiones";

interface NotasProgresoProps {
  onSubmit?: (data: NotasProgresoData) => void;
  onCancel?: () => void;
  pacienteId?: string;
}

interface NotasProgresoData {
  fechaSesion: string;
  numeroSesion: number;
  asistencia: boolean;
  justificacionInasistencia?: string;
  temasAbordados: string;
  intervenciones: string;
  respuestaPaciente: string;
  tareasAsignadas?: string;
  observaciones?: string;
  proximaCita: string;
  firmaDigital: string;
}

export default function NotasProgreso({
  onSubmit,
  onCancel,
  pacienteId,
}: NotasProgresoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);

  const [formData, setFormData] = useState<NotasProgresoData>({
    fechaSesion: new Date().toISOString().slice(0, 16),
    numeroSesion: 1,
    asistencia: true,
    justificacionInasistencia: "",
    temasAbordados: " ",
    intervenciones: "",
    respuestaPaciente: "",
    tareasAsignadas: "",
    observaciones: "",
    proximaCita: "",
    firmaDigital: "",
  });

  const [etiquetasInput, setEtiquetasInput] = useState("");
  const [errores, setErrores] = useState<Record<string, string>>({});

  // Estado para las notas guardadas y la nota seleccionada
  const [notasGuardadas, setNotasGuardadas] = useState<NotasProgresoData[]>([]);
  const [notaSeleccionada, setNotaSeleccionada] = useState<NotasProgresoData | null>(null);

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

  const { getItem, createItem } = useSesiones();

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
      firmaDigital: firmaData,
      hcId: Number(hcId),
    };

    try {
      await createItem(payload);
      alert("Información guardada correctamente");
      setNotasGuardadas((prev) => [...prev, payload]); // Agrega la nota a la lista local
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
        {/* ...existing code... */}
        {/* Fila 1: Fecha y Número de Sesión */}
        {/* ...existing code... */}
        {/* Fila 2: Asistencia */}
        {/* ...existing code... */}
        {/* Justificación de Inasistencia */}
        {/* ...existing code... */}
        {/* Temas Abordados - Sistema de Etiquetas */}
        {/* ...existing code... */}
        {/* Intervenciones */}
        {/* ...existing code... */}
        {/* Respuesta del Paciente */}
        {/* ...existing code... */}
        {/* Tareas Asignadas */}
        {/* ...existing code... */}
        {/* Observaciones */}
        {/* ...existing code... */}
        {/* Próxima Cita */}
        {/* ...existing code... */}
        {/* Firma Digital */}
        {/* ...existing code... */}
        {/* Botones */}
        {/* ...existing code... */}
      </form>

      {/* Sección para ver las notas guardadas */}
      <div className="mt-8">
        <h4 className="font-semibold mb-2">Notas guardadas</h4>
        {notasGuardadas.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay notas registradas aún.</p>
        ) : (
          <ul className="divide-y divide-stroke">
            {notasGuardadas.map((nota, idx) => (
              <li key={idx} className="py-2 flex justify-between items-center">
                <span>
                  <b>Sesión:</b> {nota.numeroSesion} | <b>Fecha:</b> {nota.fechaSesion.slice(0, 10)}
                </span>
                <button
                  className="text-primary underline text-sm"
                  onClick={() => setNotaSeleccionada(nota)}
                  type="button"
                >
                  Ver detalles
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal simple para detalles */}
      {notaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => setNotaSeleccionada(null)}
              type="button"
            >
              ✕
            </button>
            <h5 className="font-bold mb-2">Detalles de la Nota</h5>
            <div className="text-sm space-y-1">
              <div><b>Fecha de Sesión:</b> {notaSeleccionada.fechaSesion}</div>
              <div><b>Número de Sesión:</b> {notaSeleccionada.numeroSesion}</div>
              <div><b>Asistencia:</b> {notaSeleccionada.asistencia ? "Sí" : "No"}</div>
              {notaSeleccionada.justificacionInasistencia && (
                <div><b>Justificación:</b> {notaSeleccionada.justificacionInasistencia}</div>
              )}
              <div><b>Temas Abordados:</b> {notaSeleccionada.temasAbordados}</div>
              <div><b>Intervenciones:</b> {notaSeleccionada.intervenciones}</div>
              <div><b>Respuesta del Paciente:</b> {notaSeleccionada.respuestaPaciente}</div>
              {notaSeleccionada.tareasAsignadas && (
                <div><b>Tareas Asignadas:</b> {notaSeleccionada.tareasAsignadas}</div>
              )}
              {notaSeleccionada.observaciones && (
                <div><b>Observaciones:</b> {notaSeleccionada.observaciones}</div>
              )}
              <div><b>Próxima Cita:</b> {notaSeleccionada.proximaCita}</div>
              <div>
                <b>Firma Digital:</b><br />
                <img src={notaSeleccionada.firmaDigital} alt="Firma" className="border mt-1" style={{maxWidth: 200}} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
