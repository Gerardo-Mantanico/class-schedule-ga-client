"use client";

import Button from "@/components/ui/button/Button";
import React, { useRef, useEffect, useState } from "react";
import SignaturePad from "signature_pad";
import { useSesiones } from "../../../hooks/historaClinica/useSesiones";
import { Sesion } from "@/interfaces/historiaClinica/Sesiones";
import ListaNotasProgreso from "./ListaNotasProgreso";
import NotasProgresoPanel from "./NotasProgresoPanel";

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
  // Estado para mostrar el formulario y las notas guardadas
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
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
    <div>
      {mostrarFormulario && (
        <div className="bg-white rounded shadow-lg p-6 w-full max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6">
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
            {/* Asistencia */}
            <div className="mb-6">
              <div className="flex items-center">
                <label className="mb-0 mr-4 text-sm font-medium text-black">
                  Asistencia <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={formData.asistencia}
                      onChange={(e) =>
                        setFormData({ ...formData, asistencia: e.target.checked })
                      }
                      className="mr-2 h-4 w-4 rounded border-stroke accent-primary"
                    />
                    <span className="text-sm text-black">
                      {formData.asistencia ? "Asistió" : "No asistió"}
                    </span>
                  </label>
                </div>
              </div>
            </div>
            {/* Justificación de Inasistencia */}
            {!formData.asistencia && (
              <div className="mb-6">
                <label className="mb-3 block text-sm font-medium text-black">
                  Justificación de Inasistencia
                  {!formData.asistencia && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  value={formData.justificacionInasistencia || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      justificacionInasistencia: e.target.value,
                    })
                  }
                  maxLength={100}
                  placeholder="Explique la razón de la inasistencia"
                  className="w-full appearance-none rounded border bg-white px-4 py-2 text-black outline-none transition focus:border-primary"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {(formData.justificacionInasistencia || "").length}/100
                </p>
              </div>
            )}
            {/* Temas Abordados */}
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-black">
                Temas Abordados <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.temasAbordados}
                onChange={(e) =>
                  setFormData({ ...formData, temasAbordados: e.target.value })
                }
                placeholder="Escriba un tema y presione Enter"
                className="flex-1 appearance-none rounded border border-stroke bg-white px-4 py-2 text-black outline-none transition focus:border-primary"
              />
            </div>
            {/* Intervenciones */}
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-black">
                Intervenciones <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.intervencionesRealizadas}
                onChange={(e) =>
                  setFormData({ ...formData, intervencionesRealizadas: e.target.value })
                }
                rows={4}
                placeholder="Describa las intervenciones realizadas"
                className="w-full appearance-none rounded border border-stroke bg-white px-4 py-2 text-black outline-none transition focus:border-primary"
              />
            </div>
            {/* Respuesta del Paciente */}
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-black">
                Respuesta del Paciente <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.repuestaPaciente}
                onChange={(e) =>
                  setFormData({ ...formData, repuestaPaciente: e.target.value })
                }
                rows={4}
                placeholder="Describa la respuesta del paciente a las intervenciones"
                className="w-full appearance-none rounded border border-stroke bg-white px-4 py-2 text-black outline-none transition focus:border-primary"
              />
            </div>
            {/* Tareas Asignadas */}
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-black">
                Tareas Asignadas
              </label>
              <textarea
                value={formData.tareasAsignadas || ""}
                onChange={(e) =>
                  setFormData({ ...formData, tareasAsignadas: e.target.value })
                }
                rows={3}
                placeholder="Describa las tareas asignadas al paciente (opcional)"
                className="w-full appearance-none rounded border border-stroke bg-white px-4 py-2 text-black outline-none transition focus:border-primary"
              />
            </div>
            {/* Observaciones */}
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-black">
                Observaciones
              </label>
              <textarea
                value={formData.observaciones || ""}
                onChange={(e) =>
                  setFormData({ ...formData, observaciones: e.target.value })
                }
                rows={3}
                placeholder="Añada observaciones adicionales (opcional)"
                className="w-full appearance-none rounded border border-stroke bg-white px-4 py-2 text-black outline-none transition focus:border-primary"
              />
            </div>
            {/* Próxima Cita */}
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-black">
                Próxima Cita <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.proximaCita}
                onChange={(e) =>
                  setFormData({ ...formData, proximaCita: e.target.value })
                }
                className="w-full appearance-none rounded border bg-white px-4 py-2 text-black outline-none transition focus:border-primary"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            {/* Firma Digital */}
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-black">
                Firma Digital <span className="text-red-500">*</span>
              </label>
              <div className="rounded border border-stroke overflow-hidden">
                <canvas
                  ref={canvasRef}
                  className="block w-full cursor-crosshair bg-white"
                  style={{ height: "200px" }}
                />
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={handleLimpiarFirma}
                  className="rounded border border-stroke bg-white px-4 py-2 font-medium text-black hover:bg-gray-100"
                >
                  Limpiar Firma
                </button>
              </div>
            </div>
            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-white hover:bg-opacity-90"
              >
                Guardar Notas
              </Button>
              <button
                type="button"
                onClick={() => setMostrarFormulario(false)}
                className="flex justify-center rounded border border-stroke bg-white px-6 py-2 font-medium text-black hover:bg-gray-100"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
      <NotasProgresoPanel
        notas={notasGuardadas}
        onRegistrar={() => setMostrarFormulario(true)}
      />
    </div>
  );
   
}