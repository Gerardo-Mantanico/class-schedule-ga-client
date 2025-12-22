"use client";

import Button from "@/components/ui/button/Button";
import React, { useRef, useEffect, useState } from "react";
import SignaturePad from "signature_pad";
import { useSesiones } from "../../../hooks/historaClinica/useSesiones";
import { Sesion } from "@/interfaces/historiaClinica/Sesiones";
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
    temasAbordados: "",
    intervencionesRealizadas: "",
    repuestaPaciente: "",
    tareasAsignadas: "",
    observaciones: "",
    proximaCita: "",
    firmaPsicologo: "",
  });

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [notasGuardadas, setNotasGuardadas] = useState<Sesion[]>([]);
  const [errores, setErrores] = useState<Record<string, string>>({});

  // ✅ FIRMA: inicialización correcta del canvas
  useEffect(() => {
    if (canvasRef.current && !signaturePadRef.current) {
      const canvas = canvasRef.current;

      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const width = canvas.offsetWidth;
      const height = 200;

      canvas.width = width * ratio;
      canvas.height = height * ratio;

      canvas.getContext("2d")?.scale(ratio, ratio);

      signaturePadRef.current = new SignaturePad(canvas, {
        backgroundColor: "rgb(255, 255, 255)",
        penColor: "rgb(0, 0, 0)",
      });
    }
  }, []);

  const validar = () => {
    const nuevosErrores: Record<string, string> = {};

    if (signaturePadRef.current?.isEmpty()) {
      nuevosErrores.firma = "La firma digital es requerida";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleLimpiarFirma = () => {
    signaturePadRef.current?.clear();
  };

  const hcId =
    typeof window !== "undefined"
      ? localStorage.getItem("HistoriClinica")
      : null;

  const { createItem } = useSesiones();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;

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
      setMostrarFormulario(false);
      signaturePadRef.current?.clear();
    } catch (error: any) {
      alert(error?.message || "Error al guardar la información");
    }
  };

  return (
    <div>
      {mostrarFormulario && (
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          {/* FIRMA DIGITAL */}
          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium text-black">
              Firma Digital <span className="text-red-500">*</span>
            </label>

            <div className="rounded border border-stroke bg-white">
              <canvas
                ref={canvasRef}
                className="block w-full cursor-crosshair bg-white"
                style={{ height: 200 }} // ✅ altura visual
              />
            </div>

            {errores.firma && (
              <p className="mt-1 text-sm text-red-500">{errores.firma}</p>
            )}

            <div className="mt-2">
              <button
                type="button"
                onClick={handleLimpiarFirma}
                className="rounded border border-stroke bg-white px-4 py-2 text-sm hover:bg-gray-100"
              >
                Limpiar firma
              </button>
            </div>
          </div>

          {/* BOTONES */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="rounded bg-primary px-6 py-2 text-white"
            >
              Guardar Notas
            </Button>

            <button
              type="button"
              onClick={() => setMostrarFormulario(false)}
              className="rounded border border-stroke bg-white px-6 py-2"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <NotasProgresoPanel
        notas={notasGuardadas}
        onRegistrar={() => setMostrarFormulario(true)}
      />
    </div>
  );
}
