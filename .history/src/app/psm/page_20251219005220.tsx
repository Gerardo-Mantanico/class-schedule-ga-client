"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";



const NotasProgreso = dynamic(() => import("./historiausuario/NotasProgreso"), { ssr: false });
const EvaluacionesPeriodicas = dynamic(() => import("./historiausuario/EvaluacionesPeriodicas"), { ssr: false });
const AltaTerapeutica = dynamic(() => import("./historiausuario/AltaTerapeutica"), { ssr: false });
const AntecedentesFamiliares = dynamic(() => import("./historiausuario/AntecedentesFamiliares"), { ssr: false });
const DatosIdentificacionPaciente = dynamic(() => import("./historiausuario/DatosIdentificacionPaciente"), { ssr: false });
const EncabezadoInstitucional = dynamic(() => import("./historiausuario/EncabezadoInstitucional"), { ssr: false });
const EscalasPruebasAplicadas = dynamic(() => import("./historiausuario/EscalasPruebasAplicadas"), { ssr: false });
const EstadoActual = dynamic(() => import("./historiausuario/EstadoActual"), { ssr: false });
const HistoriaPersonal = dynamic(() => import("./historiausuario/HistoriaPersonal"), { ssr: false });
const ImpresionDiagnostica = dynamic(() => import("./historiausuario/ImpresionDiagnostica"), { ssr: false });
const ObjetivosTerapeuticosConfiguracion = dynamic(() => import("./historiausuario/ObjetivosTerapeuticosConfiguracion"), { ssr: false });

type TabKey =
  | "sesiones"
  | "evaluaciones"
  | "alta"
  | "antecedentes"
  | "identificacion"
  | "encabezado"
  | "escalas"
  | "estado"
  | "historia"
  | "impresion"
  | "objetivos";

const TABS: { key: TabKey; label: string }[] = [
  { key: "sesiones", label: "Notas de Progreso (Sesiones)" },
  { key: "evaluaciones", label: "Evaluaciones Periódicas" },
  { key: "alta", label: "Alta Terapéutica" },
  { key: "antecedentes", label: "Antecedentes Familiares" },
  { key: "identificacion", label: "Identificación del Paciente" },
  { key: "encabezado", label: "Encabezado Institucional" },
  { key: "escalas", label: "Escalas y Pruebas" },
  { key: "estado", label: "Estado Actual" },
  { key: "historia", label: "Historia Personal" },
  { key: "impresion", label: "Impresión Diagnóstica" },
  { key: "objetivos", label: "Objetivos Terapéuticos" },
];

// Simulación de datos para las listas
const sesionesEjemplo = [
  { id: 1, fecha: "2025-12-01T10:00", tema: "Ansiedad" },
  { id: 2, fecha: "2025-12-10T11:00", tema: "Autoestima" },
];
const evaluacionesEjemplo = [
  { id: 1, fecha: "2025-12-05", tipo: "Seguimiento", escala: 7 },
];
const altasEjemplo = [
  { id: 1, fecha: "2025-12-15", motivo: "Objetivos alcanzados" },
];

export default function PsmHome() {
  const [tab, setTab] = useState<TabKey>("sesiones");
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  // Estilos de tabs mejorados
  return (
    <div className="mx-auto max-w-5xl py-8">
      <h1 className="mb-8 text-3xl font-extrabold text-primary drop-shadow-sm">Módulo Psicología - PSM</h1>
      <div className="mb-8 flex flex-wrap gap-2 border-b border-stroke bg-white p-2 rounded shadow-sm">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`px-4 py-2 font-semibold rounded-t transition border-b-2 focus:outline-none ${
              tab === t.key
                ? "border-primary text-primary bg-primary bg-opacity-10 shadow"
                : "border-transparent text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => {
              setTab(t.key);
              setShowForm(false);
              setSelected(null);
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Listado y botón para agregar o ver */}
      <div className="mb-6">
        {/* Sesiones */}
        {tab === "sesiones" && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary">Sesiones registradas</h2>
              <button
                className="rounded bg-primary px-4 py-2 text-white font-semibold shadow hover:bg-opacity-90"
                onClick={() => {
                  setShowForm(true);
                  setSelected(null);
                }}
              >
                Nueva sesión
              </button>
            </div>
            <ul className="mb-4 divide-y divide-stroke rounded border border-stroke bg-white shadow">
              {sesionesEjemplo.map((s) => (
                <li key={s.id} className="flex items-center justify-between px-4 py-3">
                  <span>
                    <span className="font-medium">{s.fecha.replace("T", " ")}</span> — {s.tema}
                  </span>
                  <button
                    className="text-primary hover:underline text-sm font-semibold"
                    onClick={() => {
                      setSelected(s);
                      setShowForm(false);
                    }}
                  >
                    Ver
                  </button>
                </li>
              ))}
              {sesionesEjemplo.length === 0 && (
                <li className="px-4 py-3 text-gray-500">No hay sesiones registradas.</li>
              )}
            </ul>
            {showForm && <NotasProgreso onCancel={() => setShowForm(false)} />}
            {selected && (
              <div className="mb-4">
                <NotasProgreso onCancel={() => setSelected(null)} />
              </div>
            )}
          </>
        )}

        {/* Evaluaciones */}
        {tab === "evaluaciones" && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary">Evaluaciones registradas</h2>
              <button
                className="rounded bg-primary px-4 py-2 text-white font-semibold shadow hover:bg-opacity-90"
                onClick={() => {
                  setShowForm(true);
                  setSelected(null);
                }}
              >
                Nueva evaluación
              </button>
            </div>
            <ul className="mb-4 divide-y divide-stroke rounded border border-stroke bg-white shadow">
              {evaluacionesEjemplo.map((e) => (
                <li key={e.id} className="flex items-center justify-between px-4 py-3">
                  <span>
                    <span className="font-medium">{e.fecha}</span> — {e.tipo} — Escala: {e.escala}
                  </span>
                  <button
                    className="text-primary hover:underline text-sm font-semibold"
                    onClick={() => {
                      setSelected(e);
                      setShowForm(false);
                    }}
                  >
                    Ver
                  </button>
                </li>
              ))}
              {evaluacionesEjemplo.length === 0 && (
                <li className="px-4 py-3 text-gray-500">No hay evaluaciones registradas.</li>
              )}
            </ul>
            {showForm && <EvaluacionesPeriodicas onCancel={() => setShowForm(false)} />}
            {selected && (
              <div className="mb-4">
                <EvaluacionesPeriodicas onCancel={() => setSelected(null)} />
              </div>
            )}
          </>
        )}

        {/* Alta Terapéutica */}
        {tab === "alta" && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary">Altas terapéuticas</h2>
              <button
                className="rounded bg-primary px-4 py-2 text-white font-semibold shadow hover:bg-opacity-90"
                onClick={() => {
                  setShowForm(true);
                  setSelected(null);
                }}
              >
                Nueva alta
              </button>
            </div>
            <ul className="mb-4 divide-y divide-stroke rounded border border-stroke bg-white shadow">
              {altasEjemplo.map((a) => (
                <li key={a.id} className="flex items-center justify-between px-4 py-3">
                  <span>
                    <span className="font-medium">{a.fecha}</span> — {a.motivo}
                  </span>
                  <button
                    className="text-primary hover:underline text-sm font-semibold"
                    onClick={() => {
                      setSelected(a);
                      setShowForm(false);
                    }}
                  >
                    Ver
                  </button>
                </li>
              ))}
              {altasEjemplo.length === 0 && (
                <li className="px-4 py-3 text-gray-500">No hay altas registradas.</li>
              )}
            </ul>
            {showForm && <AltaTerapeutica onCancel={() => setShowForm(false)} />}
            {selected && (
              <div className="mb-4">
                <AltaTerapeutica onCancel={() => setSelected(null)} />
              </div>
            )}
          </>
        )}

        {/* Módulos de historia clínica */}
        {tab === "antecedentes" && (
          <div className="mb-4"><AntecedentesFamiliares /></div>
        )}
        {tab === "identificacion" && (
          <div className="mb-4"><DatosIdentificacionPaciente /></div>
        )}
        {tab === "encabezado" && (
          <div className="mb-4"><EncabezadoInstitucional /></div>
        )}
        {tab === "escalas" && (
          <div className="mb-4"><EscalasPruebasAplicadas /></div>
        )}
        {tab === "estado" && (
          <div className="mb-4"><EstadoActual /></div>
        )}
        {tab === "historia" && (
          <div className="mb-4"><HistoriaPersonal /></div>
        )}
        {tab === "impresion" && (
          <div className="mb-4"><ImpresionDiagnostica /></div>
        )}
        {tab === "objetivos" && (
          <div className="mb-4"><ObjetivosTerapeuticosConfiguracion /></div>
        )}
      </div>
    </div>
  );
}
