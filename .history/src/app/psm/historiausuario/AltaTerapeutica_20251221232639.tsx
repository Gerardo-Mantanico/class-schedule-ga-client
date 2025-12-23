"use client";

import React, { useRef, useEffect, useState } from "react";
import SignaturePad from "signature_pad";
import { useAltaTerapeutica } from "@/hooks/historaClinica/useAltaTerapeutica";
import type { AltaTerapeutica } from "@/interfaces/historiaClinica/AltaTerapeutica";

interface AltaTerapeuticaProps {
  onSubmit?: (data: AltaTerapeutica) => void;
  onCancel?: () => void;
  pacienteId?: string;
}

export default function AltaTerapeutica({
  onSubmit,
  onCancel,
  pacienteId,
}: AltaTerapeuticaProps) {
  const canvasPacienteRef = useRef<HTMLCanvasElement>(null);
  const canvasPsicologoRef = useRef<HTMLCanvasElement>(null);
  const signaturePacienteRef = useRef<SignaturePad | null>(null);
  const signaturePsicologoRef = useRef<SignaturePad | null>(null);

  const [formData, setFormData] = useState<AltaTerapeutica>({
    id: 0,
    fechaAlta: new Date().toISOString().split("T")[0],
    hcId: 0,
    motivoAlta: 1,
    estadoAlta: "",
    recomendacionesPosteriores: "",
    seguimientoProgramada: false,
    fechaSeguimiento: "",
    firmaPaciente: "",
    firmaPsicologo: "",
  });

  const [errores, setErrores] = useState<Record<string, string>>({});

  const hcId = typeof window !== "undefined" ? localStorage.getItem("HistoriClinica") : null;
  const { getItem, createItem } = useAltaTerapeutica();
  const [altaExistente, setAltaExistente] = useState<AltaTerapeutica | null>(null);
  useEffect(() => {
    const fetchAlta = async () => {
      if (hcId) {
        try {
          const alta = await getItem(parseInt(hcId));
          if (alta) setAltaExistente(alta);
        } catch (e) {
          // No hacer nada si no hay alta
        }
      }
    };
    fetchAlta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hcId]);


 
const motivosAlta = {
  "Objetivos alcanzados": 1,
  "Abandono": 2,
  "Derivación": 3,
  "Otro": 4,
};


  // Inicializar SignaturePads
  useEffect(() => {
    const initializeSignaturePad = (
      ref: React.RefObject<HTMLCanvasElement>,
      signaturePadRef: React.MutableRefObject<SignaturePad | null>
    ) => {
      if (ref.current && !signaturePadRef.current) {
        const canvas = ref.current;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        signaturePadRef.current = new SignaturePad(canvas, {
          backgroundColor: "rgb(255, 255, 255)",
          penColor: "rgb(0, 0, 0)",
        });
      }
    };

    initializeSignaturePad(canvasPacienteRef, signaturePacienteRef);
    initializeSignaturePad(canvasPsicologoRef, signaturePsicologoRef);
  }, []);

  const validar = () => {
      if (altaExistente) return false;
    const nuevosErrores: Record<string, string> = {};

    // Validar fecha de alta
    const fechaAlta = new Date(formData.fechaAlta);
    if (fechaAlta > new Date()) {
      nuevosErrores.fechaAlta = "La fecha de alta no puede ser posterior a hoy";
    }

    // Validar estado al alta
    if (!formData.estadoAlta.trim()) {
      nuevosErrores.estadoAlta = "El estado al alta es requerido";
    }

    // Si seguimiento programado es true, validar fecha de seguimiento
    if (formData.seguimientoProgramada) {
      if (!formData.fechaSeguimiento) {
        nuevosErrores.fechaSeguimiento =
          "La fecha de seguimiento es requerida cuando está programado";
      } else {
        const fechaSeguimiento = new Date(formData.fechaSeguimiento);
        if (fechaSeguimiento <= fechaAlta) {
          nuevosErrores.fechaSeguimiento =
            "La fecha de seguimiento debe ser posterior a la fecha de alta";
        }
      }
    }

    // Validar firmas
    if (signaturePacienteRef.current?.isEmpty()) {
      nuevosErrores.firmaPaciente = "La firma del paciente es requerida";
    }

    if (signaturePsicologoRef.current?.isEmpty()) {
      nuevosErrores.firmaPsicologo = "La firma del psicólogo es requerida";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleLimpiarFirma = (
    signaturePadRef: React.MutableRefObject<SignaturePad | null>
  ) => {
    signaturePadRef.current?.clear();
  };

  const handleSubmit = async (e: React.FormEvent) => {
      if (altaExistente) return;
    e.preventDefault();

    if (!validar()) {
      return;
    }

    const firmaPacienteData = signaturePacienteRef.current?.toDataURL() || "";
    const firmaPsicologoData = signaturePsicologoRef.current?.toDataURL() || "";

    const datosCompletos: AltaTerapeutica = {
      ...formData,
      firmaPaciente: firmaPacienteData,
      firmaPsicologo: firmaPsicologoData,
    };

    
    try {
      datosCompletos.hcId = hcId ? parseInt(hcId) : 0;
      await createItem(datosCompletos);
      onSubmit?.(datosCompletos); 
       } catch (error) {
       console.error("Error al crear el alta terapéutica:", error);
    }
  

    onSubmit?.(datosCompletos);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default">
      <div className="border-b border-stroke px-4 py-6 sm:px-6">
        <h3 className="font-medium text-black">Alta Terapéutica</h3>
        {altaExistente && (
          <p className="mt-2 text-red-500">
            Ya existe un registro de alta terapéutica. No es posible crear otro.
          </p>
        )}
      </div>
      <div className="border-b border-stroke px-4 py-6 sm:px-6">
        <h3 className="font-medium text-black">Alta Terapéutica</h3>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6">
        {/* Fila 1: Fecha y Motivo del Alta */}
        <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Fecha de Alta */}
          <div>
            <label className="mb-3 block text-sm font-medium text-black">
              Fecha de Alta <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.fechaAlta}
              onChange={(e) =>
                setFormData({ ...formData, fechaAlta: e.target.value })
              }
              className={`w-full appearance-none rounded border bg-white px-4 py-2 text-black outline-none transition focus:border-primary ${
                errores.fechaAlta ? "border-red-500" : "border-stroke"
              }`}
              max={new Date().toISOString().split("T")[0]}
              disabled={!!altaExistente}
            />
                          disabled={!!altaExistente}
              disabled={!!altaExistente}
              disabled={!!altaExistente}
                          disabled={!!altaExistente}
                          disabled={!!altaExistente}
                          disabled={!!altaExistente}
                          disabled={!!altaExistente}
                          disabled={!!altaExistente}
            {errores.fechaAlta && (
              <p className="mt-1 text-xs text-red-500">{errores.fechaAlta}</p>
            )}
          </div>

          {/* Motivo del Alta */}
          <div>
            <label className="mb-3 block text-sm font-medium text-black">
              Motivo del Alta <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
           {Object.entries(motivosAlta).map(([motivo, valor]) => (
  <label key={motivo} className="flex cursor-pointer items-center">
    <input
      type="radio"
      name="motivoAlta"
      value={valor}
      checked={formData.motivoAlta === valor}
      onChange={(e) =>
        setFormData({
          ...formData,
          motivoAlta: Number(e.target.value),
        })
      }
      className="mr-2 h-4 w-4 accent-primary"
      disabled={!!altaExistente}
    />
    <span className="text-sm text-black">{motivo}</span>
  </label>
))}
            </div>
          </div>
        </div>

        {/* Estado al Alta */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-black">
            Estado al Alta <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.estadoAlta}
            onChange={(e) =>
              setFormData({ ...formData, estadoAlta: e.target.value })
            }
            rows={4}
            placeholder="Describa el estado general del paciente al momento del alta"
            className={`w-full appearance-none rounded border bg-white px-4 py-2 text-black outline-none transition focus:border-primary ${
              errores.estadoAlta ? "border-red-500" : "border-stroke"
            }`}
            disabled={!!altaExistente}
          />
          {errores.estadoAlta && (
            <p className="mt-1 text-xs text-red-500">{errores.estadoAlta}</p>
          )}
        </div>

        {/* Recomendaciones Posteriores */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-black">
            Recomendaciones Posteriores
          </label>
          <textarea
            value={formData.recomendacionesPosteriores || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                recomendacionesPosteriores: e.target.value,
              })
            }
            rows={4}
            placeholder="Proporcione recomendaciones para el cuidado posterior (opcional)"
            className="w-full appearance-none rounded border border-stroke bg-white px-4 py-2 text-black outline-none transition focus:border-primary"
            disabled={!!altaExistente}
          />
        </div>

        {/* Seguimiento Programado */}
        <div className="mb-6">
          <label className="flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={formData.seguimientoProgramada}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  seguimientoProgramada: e.target.checked,
                })
              }
              className="mr-3 h-4 w-4 rounded border-stroke accent-primary"
              disabled={!!altaExistente}
            />
            <span className="text-sm font-medium text-black">
              Seguimiento Programado
            </span>
          </label>
        </div>

        {/* Fecha de Seguimiento (Condicional) */}
        {formData.seguimientoProgramada && (
          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium text-black">
              Fecha de Seguimiento <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.fechaSeguimiento || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fechaSeguimiento: e.target.value,
                })
              }
              className={`w-full appearance-none rounded border bg-white px-4 py-2 text-black outline-none transition focus:border-primary ${
                errores.fechaSeguimiento ? "border-red-500" : "border-stroke"
              }`}
              min={new Date().toISOString().split("T")[0]}
              disabled={!!altaExistente}
            />
            {errores.fechaSeguimiento && (
              <p className="mt-1 text-xs text-red-500">
                {errores.fechaSeguimiento}
              </p>
            )}
          </div>
        )}

        {/* Separador */}
        <div className="my-8 border-t border-stroke"></div>

        {/* Firma del Paciente */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-black">
            Firma del Paciente <span className="text-red-500">*</span>
          </label>
          <div className="rounded border border-stroke overflow-hidden">
            <canvas
              ref={canvasPacienteRef}
              className="block w-full cursor-crosshair bg-white"
              style={{ height: "200px" }}
              disabled={!!altaExistente}
            />
          </div>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => handleLimpiarFirma(signaturePacienteRef)}
              className="rounded border border-stroke bg-white px-4 py-2 font-medium text-black hover:bg-gray-100"
              disabled={!!altaExistente}
            >
                          disabled={!!altaExistente}
                          disabled={!!altaExistente}
                          disabled={!!altaExistente}
                          disabled={!!altaExistente}
                          disabled={!!altaExistente}
                          disabled={!!altaExistente}
              Limpiar Firma
            </button>
          </div>
          {errores.firmaPaciente && (
            <p className="mt-1 text-xs text-red-500">{errores.firmaPaciente}</p>
          )}
        </div>

        {/* Firma del Psicólogo */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-black">
            Firma del Psicólogo <span className="text-red-500">*</span>
          </label>
          <div className="rounded border border-stroke overflow-hidden">
            <canvas
              ref={canvasPsicologoRef}
              className="block w-full cursor-crosshair bg-white"
              style={{ height: "200px" }}
              disabled={!!altaExistente}
            />
          </div>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => handleLimpiarFirma(signaturePsicologoRef)}
              className="rounded border border-stroke bg-white px-4 py-2 font-medium text-black hover:bg-gray-100"
              disabled={!!altaExistente}
            >
              Limpiar Firma
            </button>
          </div>
          {errores.firmaPsicologo && (
            <p className="mt-1 text-xs text-red-500">{errores.firmaPsicologo}</p>
          )}
        </div>

        {/* Botones */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-white hover:bg-opacity-90"
            disabled={!!altaExistente}
          >
            Registrar Alta
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex justify-center rounded border border-stroke bg-white px-6 py-2 font-medium text-black hover:bg-gray-100"
              disabled={!!altaExistente}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
