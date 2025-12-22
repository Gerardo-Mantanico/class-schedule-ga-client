"use client";

import React, { useRef, useEffect, useState } from "react";
import SignaturePad from "signature_pad";

interface NotasProgresoProps {
  onSubmit?: (data: NotasProgresoData) => void;
  onCancel?: () => void;
  pacienteId?: string;
}


// Tipos compartidos
export interface NotasProgresoData {
  id?: number;
  fechaSesion: string;
  numeroSesion: number;
  asistencia: boolean;
  justificacionInasistencia?: string;
  temasAbordados: string[];
  intervenciones: string;
  respuestaPaciente: string;
  tareasAsignadas?: string;
  observaciones?: string;
  proximaCita: string;
  firmaDigital: string;
}

// Listado de notas de progreso
export function NotasProgresoList({ notas, onNuevaNota, onVerDetalle }: {
  notas: NotasProgresoData[];
  onNuevaNota: () => void;
  onVerDetalle: (nota: NotasProgresoData) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Notas de Progreso</h2>
        <button
          className="rounded bg-blue-600 px-4 py-2 text-white"
          onClick={onNuevaNota}
        >
          Registrar Nota de Progreso
        </button>
      </div>
      <div>
        {notas.length === 0 && <p>No hay notas registradas.</p>}
        {notas.map((nota) => (
          <div key={nota.id} className="border-b py-2 flex justify-between items-center">
            <div>
              <strong>{nota.fechaSesion}</strong> — {nota.temasAbordados?.join(", ")}
            </div>
            <button
              className="text-blue-600 border border-blue-600 rounded px-2 py-1 ml-2"
              onClick={() => onVerDetalle(nota)}
            >
              Ver detalles
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Formulario de nota de progreso (modo detalle/nuevo)
import React, { useRef, useState, useEffect } from "react";
import SignaturePad from "signature_pad";

export function NotasProgresoForm({
  nota,
  modo,
  onCancel,
  onSubmit,
}: {
  nota?: NotasProgresoData;
  modo: "detalle" | "nuevo";
  onCancel: () => void;
  onSubmit?: (data: NotasProgresoData) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);

  const [formData, setFormData] = useState<NotasProgresoData>(
    nota || {
      fechaSesion: new Date().toISOString().slice(0, 16),
      numeroSesion: 1,
      asistencia: true,
      justificacionInasistencia: "",
      temasAbordados: [],
      intervenciones: "",
      respuestaPaciente: "",
      tareasAsignadas: "",
      observaciones: "",
      proximaCita: "",
      firmaDigital: "",
    }
  );
  const [etiquetasInput, setEtiquetasInput] = useState("");
  const [errores, setErrores] = useState<Record<string, string>>({});

  useEffect(() => {
    if (canvasRef.current && !signaturePadRef.current && modo === "nuevo") {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      signaturePadRef.current = new SignaturePad(canvas, {
        backgroundColor: "rgb(255, 255, 255)",
        penColor: "rgb(0, 0, 0)",
      });
    }
  }, [modo]);

  const validar = () => {
    const nuevosErrores: Record<string, string> = {};
    const fechaSesion = new Date(formData.fechaSesion);
    if (fechaSesion > new Date()) {
      nuevosErrores.fechaSesion = "La fecha debe ser igual o anterior a hoy";
    }
    const proximaCita = new Date(formData.proximaCita);
    if (proximaCita <= new Date()) {
      nuevosErrores.proximaCita = "La próxima cita debe ser posterior a hoy";
    }
    if (!formData.asistencia && !formData.justificacionInasistencia) {
      nuevosErrores.justificacionInasistencia = "La justificación es requerida cuando el paciente no asiste";
    }
    if (formData.temasAbordados.length === 0) {
      nuevosErrores.temasAbordados = "Debe seleccionar al menos un tema";
    }
    if (modo === "nuevo" && signaturePadRef.current?.isEmpty()) {
      nuevosErrores.firma = "La firma digital es requerida";
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleAgregarEtiqueta = () => {
    if (etiquetasInput.trim()) {
      setFormData({
        ...formData,
        temasAbordados: [...formData.temasAbordados, etiquetasInput.trim()],
      });
      setEtiquetasInput("");
    }
  };

  const handleEliminarEtiqueta = (index: number) => {
    setFormData({
      ...formData,
      temasAbordados: formData.temasAbordados.filter((_, i) => i !== index),
    });
  };

  const handleLimpiarFirma = () => {
    signaturePadRef.current?.clear();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;
    const firmaData = modo === "nuevo" ? signaturePadRef.current?.toDataURL() || "" : formData.firmaDigital;
    const datosCompletos: NotasProgresoData = {
      ...formData,
      firmaDigital: firmaData,
    };
    onSubmit?.(datosCompletos);
  };

  // Si modo es detalle, deshabilitar inputs
  const disabled = modo === "detalle";

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default">
      <div className="border-b border-stroke px-4 py-6 sm:px-6">
        <h3 className="font-medium text-black">{modo === "detalle" ? "Detalle de Nota de Progreso" : "Nueva Nota de Progreso"}</h3>
      </div>
      <form onSubmit={handleSubmit} className="p-4 sm:p-6">
        {/* Fecha y número de sesión */}
        <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label>Fecha de sesión</label>
            <input
              type="datetime-local"
              value={formData.fechaSesion}
              onChange={(e) => setFormData({ ...formData, fechaSesion: e.target.value })}
              className={`relative w-full appearance-none rounded border bg-white px-4 py-2 text-black outline-none transition focus:border-primary ${errores.fechaSesion ? "border-red-500" : "border-stroke"}`}
              max={new Date().toISOString().slice(0, 16)}
              disabled={disabled}
            />
            {errores.fechaSesion && <span className="text-red-500 text-xs">{errores.fechaSesion}</span>}
          </div>
          <div>
            <label>Número de sesión</label>
            <input
              type="number"
              value={formData.numeroSesion}
              onChange={(e) => setFormData({ ...formData, numeroSesion: Number(e.target.value) })}
              className="w-full rounded border border-stroke px-4 py-2"
              min={1}
              disabled={disabled}
            />
          </div>
        </div>
        {/* Temas abordados */}
        <div className="mb-6">
          <label>Temas abordados</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={etiquetasInput}
              onChange={(e) => setEtiquetasInput(e.target.value)}
              className="rounded border border-stroke px-2 py-1"
              disabled={disabled}
            />
            <button type="button" onClick={handleAgregarEtiqueta} disabled={disabled} className="bg-blue-500 text-white px-2 rounded">Agregar</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.temasAbordados.map((tema, i) => (
              <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {tema}
                {!disabled && (
                  <button type="button" onClick={() => handleEliminarEtiqueta(i)} className="ml-1 text-red-500">x</button>
                )}
              </span>
            ))}
          </div>
          {errores.temasAbordados && <span className="text-red-500 text-xs">{errores.temasAbordados}</span>}
        </div>
        {/* Asistencia */}
        <div className="mb-6">
          <label>¿Asistió?</label>
          <select
            value={formData.asistencia ? "si" : "no"}
            onChange={(e) => setFormData({ ...formData, asistencia: e.target.value === "si" })}
            className="rounded border border-stroke px-2 py-1"
            disabled={disabled}
          >
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
        </div>
        {/* Justificación inasistencia */}
        {!formData.asistencia && (
          <div className="mb-6">
            <label>Justificación de inasistencia</label>
            <input
              type="text"
              value={formData.justificacionInasistencia}
              onChange={(e) => setFormData({ ...formData, justificacionInasistencia: e.target.value })}
              className="w-full rounded border border-stroke px-4 py-2"
              disabled={disabled}
            />
            {errores.justificacionInasistencia && <span className="text-red-500 text-xs">{errores.justificacionInasistencia}</span>}
          </div>
        )}
        {/* Intervenciones */}
        <div className="mb-6">
          <label>Intervenciones</label>
          <textarea
            value={formData.intervenciones}
            onChange={(e) => setFormData({ ...formData, intervenciones: e.target.value })}
            rows={4}
            className="w-full rounded border border-stroke px-4 py-2"
            disabled={disabled}
          />
        </div>
        {/* Respuesta paciente */}
        <div className="mb-6">
          <label>Respuesta del paciente</label>
          <textarea
            value={formData.respuestaPaciente}
            onChange={(e) => setFormData({ ...formData, respuestaPaciente: e.target.value })}
            rows={4}
            className="w-full rounded border border-stroke px-4 py-2"
            disabled={disabled}
          />
        </div>
        {/* Tareas asignadas */}
        <div className="mb-6">
          <label>Tareas asignadas</label>
          <textarea
            value={formData.tareasAsignadas || ""}
            onChange={(e) => setFormData({ ...formData, tareasAsignadas: e.target.value })}
            rows={3}
            className="w-full rounded border border-stroke px-4 py-2"
            disabled={disabled}
          />
        </div>
        {/* Observaciones */}
        <div className="mb-6">
          <label>Observaciones</label>
          <textarea
            value={formData.observaciones || ""}
            onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
            rows={3}
            className="w-full rounded border border-stroke px-4 py-2"
            disabled={disabled}
          />
        </div>
        {/* Próxima cita */}
        <div className="mb-6">
          <label>Próxima cita</label>
          <input
            type="datetime-local"
            value={formData.proximaCita}
            onChange={(e) => setFormData({ ...formData, proximaCita: e.target.value })}
            className={`w-full rounded border bg-white px-4 py-2 text-black outline-none transition focus:border-primary ${errores.proximaCita ? "border-red-500" : "border-stroke"}`}
            min={new Date().toISOString().slice(0, 16)}
            disabled={disabled}
          />
          {errores.proximaCita && <span className="text-red-500 text-xs">{errores.proximaCita}</span>}
        </div>
        {/* Firma digital */}
        <div className="mb-6">
          <label>Firma digital</label>
          {modo === "detalle" ? (
            formData.firmaDigital ? (
              <img src={formData.firmaDigital} alt="Firma" className="border rounded" style={{ maxWidth: 300 }} />
            ) : (
              <span className="text-gray-500">Sin firma</span>
            )
          ) : (
            <>
              <canvas ref={canvasRef} width={300} height={100} className="border rounded" />
              <button type="button" onClick={handleLimpiarFirma} className="ml-2 text-sm text-blue-600">Limpiar</button>
              {errores.firma && <span className="text-red-500 text-xs block">{errores.firma}</span>}
            </>
          )}
        </div>
        {/* Botones */}
        <div className="flex gap-4 pt-4">
          <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
          {modo === "nuevo" && (
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
          )}
        </div>
      </form>
    </div>
  );
}

// Componente principal que orquesta el modo
export default function NotasProgreso({ pacienteId }: { pacienteId?: string }) {
  const [modo, setModo] = useState<"listado" | "detalle" | "nuevo">("listado");
  const [notaSeleccionada, setNotaSeleccionada] = useState<NotasProgresoData | null>(null);
  const [notas, setNotas] = useState<NotasProgresoData[]>([]); // Aquí deberías cargar desde API

  return (
    <>
      {modo === "listado" && (
        <NotasProgresoList
          notas={notas}
          onNuevaNota={() => setModo("nuevo")}
          onVerDetalle={(nota) => {
            setNotaSeleccionada(nota);
            setModo("detalle");
          }}
        />
      )}
      {modo === "detalle" && notaSeleccionada && (
        <NotasProgresoForm
          nota={notaSeleccionada}
          modo="detalle"
          onCancel={() => setModo("listado")}
        />
      )}
      {modo === "nuevo" && (
        <NotasProgresoForm
          modo="nuevo"
          onCancel={() => setModo("listado")}
          onSubmit={(nuevaNota) => {
            setNotas([...notas, { ...nuevaNota, id: Date.now() }]);
            setModo("listado");
          }}
        />
      )}
    </>
  );
}
            {formData.temasAbordados.map((tema, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-2 rounded-full bg-primary bg-opacity-20 px-3 py-1 text-sm text-primary"
              >
                <span>{tema}</span>
                <button
                  type="button"
                  onClick={() => handleEliminarEtiqueta(index)}
                  className="font-bold hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          {errores.temasAbordados && (
            <p className="mt-1 text-xs text-red-500">{errores.temasAbordados}</p>
          )}
        </div>

        {/* Intervenciones */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-black">
            Intervenciones <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.intervenciones}
            onChange={(e) =>
              setFormData({ ...formData, intervenciones: e.target.value })
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
            value={formData.respuestaPaciente}
            onChange={(e) =>
              setFormData({ ...formData, respuestaPaciente: e.target.value })
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
            className={`w-full appearance-none rounded border bg-white px-4 py-2 text-black outline-none transition focus:border-primary ${
              errores.proximaCita ? "border-red-500" : "border-stroke"
            }`}
            min={new Date().toISOString().slice(0, 16)}
          />
          {errores.proximaCita && (
            <p className="mt-1 text-xs text-red-500">{errores.proximaCita}</p>
          )}
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
          {errores.firma && (
            <p className="mt-1 text-xs text-red-500">{errores.firma}</p>
          )}
        </div>

        {/* Botones */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-white hover:bg-opacity-90"
          >
            Guardar Notas
          </button>
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
    </div>
  );
}
