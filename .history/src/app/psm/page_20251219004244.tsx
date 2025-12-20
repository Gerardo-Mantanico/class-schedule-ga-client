
import React, { useState } from "react";
import dynamic from "next/dynamic";
"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";

const NotasProgreso = dynamic(() => import("./NotasProgreso"), { ssr: false });
const EvaluacionesPeriodicas = dynamic(() => import("./EvaluacionesPeriodicas"), { ssr: false });
const AltaTerapeutica = dynamic(() => import("./AltaTerapeutica"), { ssr: false });

type TabKey = "sesiones" | "evaluaciones" | "alta";

const TABS: { key: TabKey; label: string }[] = [
  { key: "sesiones", label: "Notas de Progreso (Sesiones)" },
  { key: "evaluaciones", label: "Evaluaciones Periódicas" },
  { key: "alta", label: "Alta Terapéutica" },
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

  // Simulación de selección de registro para editar/ver (no implementado)
  // const [selected, setSelected] = useState<any>(null);

  return (
    <div className="mx-auto max-w-4xl py-8">
      <h1 className="mb-6 text-2xl font-bold text-primary">Módulo Psicología - PSM</h1>
      <div className="mb-6 flex gap-2 border-b border-stroke">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`px-4 py-2 font-medium transition border-b-2 ${
              tab === t.key
                ? "border-primary text-primary bg-primary bg-opacity-10"
                : "border-transparent text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => {
              setTab(t.key);
              setShowForm(false);
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Listado y botón para agregar */}
      <div className="mb-6">
        {tab === "sesiones" && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Sesiones registradas</h2>
              <button
                className="rounded bg-primary px-4 py-2 text-white font-medium hover:bg-opacity-90"
                onClick={() => setShowForm(true)}
              >
                Nueva sesión
              </button>
            </div>
            <ul className="mb-4 divide-y divide-stroke rounded border border-stroke bg-white">
              {sesionesEjemplo.map((s) => (
                <li key={s.id} className="flex items-center justify-between px-4 py-3">
                  <span>
                    <span className="font-medium">{s.fecha.replace("T", " ")}</span> — {s.tema}
                  </span>
                  <button className="text-primary hover:underline text-sm">Ver</button>
                </li>
              ))}
              {sesionesEjemplo.length === 0 && (
                <li className="px-4 py-3 text-gray-500">No hay sesiones registradas.</li>
              )}
            </ul>
            {showForm && (
              <NotasProgreso onCancel={() => setShowForm(false)} />
            )}
          </>
        )}

        {tab === "evaluaciones" && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Evaluaciones registradas</h2>
              <button
                className="rounded bg-primary px-4 py-2 text-white font-medium hover:bg-opacity-90"
                onClick={() => setShowForm(true)}
              >
                Nueva evaluación
              </button>
            </div>
            <ul className="mb-4 divide-y divide-stroke rounded border border-stroke bg-white">
              {evaluacionesEjemplo.map((e) => (
                <li key={e.id} className="flex items-center justify-between px-4 py-3">
                  <span>
                    <span className="font-medium">{e.fecha}</span> — {e.tipo} — Escala: {e.escala}
                  </span>
                  <button className="text-primary hover:underline text-sm">Ver</button>
                </li>
              ))}
              {evaluacionesEjemplo.length === 0 && (
                <li className="px-4 py-3 text-gray-500">No hay evaluaciones registradas.</li>
              )}
            </ul>
            {showForm && (
              <EvaluacionesPeriodicas onCancel={() => setShowForm(false)} />
            )}
          </>
        )}

        {tab === "alta" && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Altas terapéuticas</h2>
              <button
                className="rounded bg-primary px-4 py-2 text-white font-medium hover:bg-opacity-90"
                onClick={() => setShowForm(true)}
              >
                Nueva alta
              </button>
            </div>
            <ul className="mb-4 divide-y divide-stroke rounded border border-stroke bg-white">
              {altasEjemplo.map((a) => (
                <li key={a.id} className="flex items-center justify-between px-4 py-3">
                  <span>
                    <span className="font-medium">{a.fecha}</span> — {a.motivo}
                  </span>
                  <button className="text-primary hover:underline text-sm">Ver</button>
                </li>
              ))}
              {altasEjemplo.length === 0 && (
                <li className="px-4 py-3 text-gray-500">No hay altas registradas.</li>
              )}
            </ul>
            {showForm && (
              <AltaTerapeutica onCancel={() => setShowForm(false)} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
