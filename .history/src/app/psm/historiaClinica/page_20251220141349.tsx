"use client";
import React, { useState } from "react";
import { 
  MdOutlineMedicalServices,
  MdPersonOutline,
  MdOutlineFamilyRestroom,
  MdOutlineHistory,
  MdOutlineAssessment,
  MdOutlineBarChart,
  MdOutlineDescription,
  MdOutlineTrackChanges,
  MdOutlineEventNote,
  MdOutlineTrendingUp,
  MdOutlineExitToApp
} from "react-icons/md";
import dynamic from "next/dynamic";


const NotasProgreso = dynamic(() => import("../historiausuario/NotasProgreso"), { ssr: false });
const EvaluacionesPeriodicas = dynamic(() => import("../historiausuario/EvaluacionesPeriodicas"), { ssr: false });
const AltaTerapeutica = dynamic(() => import("../historiausuario/AltaTerapeutica"), { ssr: false });
const AntecedentesFamiliares = dynamic(() => import("../historiausuario/AntecedentesFamiliares"), { ssr: false });
const DatosIdentificacionPaciente = dynamic(() => import("../historiausuario/DatosIdentificacionPaciente"), { ssr: false });

const EncabezadoInstitucional = dynamic(() => import("../historiausuario/EncabezadoInstitucional"), { ssr: false });

const EscalasPruebasAplicadas = dynamic(() => import("../historiausuario/EscalasPruebasAplicadas"), { ssr: false });
const EstadoActual = dynamic(() => import("../historiausuario/EstadoActual"), { ssr: false });
const HistoriaPersonal = dynamic(() => import("../historiausuario/HistoriaPersonal"), { ssr: false });
const ImpresionDiagnostica = dynamic(() => import("../historiausuario/ImpresionDiagnostica"), { ssr: false });
const ObjetivosTerapeuticosConfiguracion = dynamic(() => import("../historiausuario/ObjetivosTerapeuticosConfiguracion"), { ssr: false });

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

const TABS: { key: TabKey; label: string; icon: JSX.Element }[] = [
  { 
    key: "encabezado", 
    label: "Encabezado Institucional", 
    icon: <MdOutlineMedicalServices className="size-5" /> 
  },
  { 
    key: "identificacion", 
    label: "Identificación del Paciente", 
    icon: <MdPersonOutline className="size-5" /> 
  },
  { 
    key: "antecedentes", 
    label: "Antecedentes Familiares", 
    icon: <MdOutlineFamilyRestroom className="size-5" /> 
  },
  { 
    key: "historia", 
    label: "Historia Personal", 
    icon: <MdOutlineHistory className="size-5" /> 
  },
  { 
    key: "estado", 
    label: "Estado Actual", 
    icon: <MdOutlineAssessment className="size-5" /> 
  },
  { 
    key: "escalas", 
    label: "Escalas y Pruebas", 
    icon: <MdOutlineBarChart className="size-5" /> 
  },
  { 
    key: "impresion", 
    label: "Impresión Diagnóstica", 
    icon: <MdOutlineDescription className="size-5" /> 
  },
  { 
    key: "objetivos", 
    label: "Objetivos Terapéuticos", 
    icon: <MdOutlineTrackChanges className="size-5" /> 
  },
  { 
    key: "sesiones", 
    label: "Notas de Progreso", 
    icon: <MdOutlineEventNote className="size-5" /> 
  },
  { 
    key: "evaluaciones", 
    label: "Evaluaciones Periódicas", 
    icon: <MdOutlineTrendingUp className="size-5" /> 
  },
  { 
    key: "alta", 
    label: "Alta Terapéutica", 
    icon: <MdOutlineExitToApp className="size-5" /> 
  },
];

// Función para estilos de pestañas
const getTabClassName = (tabId: TabKey, activeTab: TabKey) => {
  const baseClasses = "inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ease-in-out whitespace-nowrap";
  
  if (activeTab === tabId) {
    return `${baseClasses} text-blue-600 border-blue-600 dark:text-blue-400 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/20`;
  }
  
  return `${baseClasses} bg-transparent text-gray-600 border-transparent hover:text-gray-800 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-700`;
};

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
  const [activeTab, setActiveTab] = useState<TabKey>("encabezado");
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  return (
    <div className="mx-auto max-w-6xl py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-tight dark:text-white">
          Historia Clínica Psicológica
        </h1>
        <p className="text-gray-500 text-base mb-6 dark:text-gray-400">
          Gestión integral de la historia clínica y sesiones del paciente.
        </p>
        
        {/* Navegación con pestañas con línea e ícono */}
        <div className="border border-gray-200 rounded-xl dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="border-b border-gray-200 dark:border-gray-800">
                <nav className="-mb-px flex flex-wrap gap-1 px-4">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  className={getTabClassName(tab.key, activeTab)}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setShowForm(false);
                    setSelected(null);
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          
          {/* Contenido principal */}
          <div className="p-6">
            {/* Sesiones */}
            {activeTab === "sesiones" && (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                    Notas de Progreso (Sesiones)
                  </h2>
                  <button
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-white font-medium shadow-sm hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                    onClick={() => {
                      setShowForm(true);
                      setSelected(null);
                    }}
                  >
                    <MdOutlineEventNote className="size-5" />
                    Nueva sesión
                  </button>
                </div>
                <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                  <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {sesionesEjemplo.map((s) => (
                      <div key={s.id} className="flex items-center justify-between px-4 py-3 hover:bg-white dark:hover:bg-gray-800 transition-colors">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {new Date(s.fecha).toLocaleDateString('es-ES', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400 ml-2">— {s.tema}</span>
                        </div>
                        <button
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors flex items-center gap-1"
                          onClick={() => {
                            setSelected(s);
                            setShowForm(false);
                          }}
                        >
                          <MdOutlineDescription className="size-4" />
                          Ver detalles
                        </button>
                      </div>
                    ))}
                    {sesionesEjemplo.length === 0 && (
                      <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                        <MdOutlineEventNote className="size-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                        <p>No hay sesiones registradas.</p>
                        <p className="text-sm mt-1">Comienza agregando una nueva sesión.</p>
                      </div>
                    )}
                  </div>
                </div>
                {showForm && (
                  <div className="mb-6">
                    <NotasProgreso onCancel={() => setShowForm(false)} />
                  </div>
                )}
                {selected && (
                  <div className="mb-6">
                    <NotasProgreso onCancel={() => setSelected(null)} />
                  </div>
                )}
              </>
            )}

            {/* Evaluaciones */}
            {activeTab === "evaluaciones" && (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                    Evaluaciones Periódicas
                  </h2>
                  <button
                    className="rounded-lg bg-green-600 px-4 py-2.5 text-white font-medium shadow-sm hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
                    onClick={() => {
                      setShowForm(true);
                      setSelected(null);
                    }}
                  >
                    <MdOutlineTrendingUp className="size-5" />
                    Nueva evaluación
                  </button>
                </div>
                <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                  <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {evaluacionesEjemplo.map((e) => (
                      <div key={e.id} className="flex items-center justify-between px-4 py-3 hover:bg-white dark:hover:bg-gray-800 transition-colors">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">{e.fecha}</span>
                          <span className="text-gray-600 dark:text-gray-400 ml-2">
                            — {e.tipo} — Escala: <span className="font-medium">{e.escala}/10</span>
                          </span>
                        </div>
                        <button
                          className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium transition-colors flex items-center gap-1"
                          onClick={() => {
                            setSelected(e);
                            setShowForm(false);
                          }}
                        >
                          <MdOutlineAssessment className="size-4" />
                          Ver evaluación
                        </button>
                      </div>
                    ))}
                    {evaluacionesEjemplo.length === 0 && (
                      <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                        <MdOutlineTrendingUp className="size-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                        <p>No hay evaluaciones registradas.</p>
                        <p className="text-sm mt-1">Comienza agregando una nueva evaluación.</p>
                      </div>
                    )}
                  </div>
                </div>
                {showForm && (
                  <div className="mb-6">
                    <EvaluacionesPeriodicas onCancel={() => setShowForm(false)} />
                  </div>
                )}
                {selected && (
                  <div className="mb-6">
                    <EvaluacionesPeriodicas onCancel={() => setSelected(null)} />
                  </div>
                )}
              </>
            )}

            {/* Alta Terapéutica */}
            {activeTab === "alta" && (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                    Altas Terapéuticas
                  </h2>
                  <button
                    className="rounded-lg bg-purple-600 px-4 py-2.5 text-white font-medium shadow-sm hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2"
                    onClick={() => {
                      setShowForm(true);
                      setSelected(null);
                    }}
                  >
                    <MdOutlineExitToApp className="size-5" />
                    Nueva alta
                  </button>
                </div>
                <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                  <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {altasEjemplo.map((a) => (
                      <div key={a.id} className="flex items-center justify-between px-4 py-3 hover:bg-white dark:hover:bg-gray-800 transition-colors">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">{a.fecha}</span>
                          <span className="text-gray-600 dark:text-gray-400 ml-2">— {a.motivo}</span>
                        </div>
                        <button
                          className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 text-sm font-medium transition-colors flex items-center gap-1"
                          onClick={() => {
                            setSelected(a);
                            setShowForm(false);
                          }}
                        >
                          <MdOutlineDescription className="size-4" />
                          Ver alta
                        </button>
                      </div>
                    ))}
                    {altasEjemplo.length === 0 && (
                      <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                        <MdOutlineExitToApp className="size-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                        <p>No hay altas registradas.</p>
                        <p className="text-sm mt-1">Agrega una alta terapéutica cuando el paciente complete su tratamiento.</p>
                      </div>
                    )}
                  </div>
                </div>
                {showForm && (
                  <div className="mb-6">
                    <AltaTerapeutica onCancel={() => setShowForm(false)} />
                  </div>
                )}
                {selected && (
                  <div className="mb-6">
                    <AltaTerapeutica onCancel={() => setSelected(null)} />
                  </div>
                )}
              </>
            )}

            {/* Módulos de historia clínica */}
            {activeTab === "antecedentes" && (
              <div className="mb-6">
                <AntecedentesFamiliares />
                <div className="flex justify-end mt-4">
                  <button
                    className="rounded-lg bg-blue-600 px-6 py-2 text-white font-semibold shadow hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      const idx = TABS.findIndex(t => t.key === activeTab);
                      if (idx !== -1 && idx < TABS.length - 1) setActiveTab(TABS[idx + 1].key as TabKey);
                    }}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            )}
            {activeTab === "identificacion" && (
              <div className="mb-6">
                <DatosIdentificacionPaciente />
                <div className="flex justify-end mt-4">
                  <button
                    className="rounded-lg bg-blue-600 px-6 py-2 text-white font-semibold shadow hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      const idx = TABS.findIndex(t => t.key === activeTab);
                      if (idx !== -1 && idx < TABS.length - 1) setActiveTab(TABS[idx + 1].key as TabKey);
                    }}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            )}
            {activeTab === "encabezado" && (
              <div className="mb-6">
                <EncabezadoInstitucional />
                <div className="flex justify-end mt-4">
                  <button
                    className="rounded-lg bg-blue-600 px-6 py-2 text-white font-semibold shadow hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      const idx = TABS.findIndex(t => t.key === activeTab);
                      if (idx !== -1 && idx < TABS.length - 1) setActiveTab(TABS[idx + 1].key as TabKey);
                    }}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            )}
            {activeTab === "escalas" && (
              <div className="mb-6">
                <EscalasPruebasAplicadas />
                <div className="flex justify-end mt-4">
                  <button
                    className="rounded-lg bg-blue-600 px-6 py-2 text-white font-semibold shadow hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      const idx = TABS.findIndex(t => t.key === activeTab);
                      if (idx !== -1 && idx < TABS.length - 1) setActiveTab(TABS[idx + 1].key as TabKey);
                    }}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            )}
            {activeTab === "estado" && (
              <div className="mb-6">
                <EstadoActual />
                <div className="flex justify-end mt-4">
                  <button
                    className="rounded-lg bg-blue-600 px-6 py-2 text-white font-semibold shadow hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      const idx = TABS.findIndex(t => t.key === activeTab);
                      if (idx !== -1 && idx < TABS.length - 1) setActiveTab(TABS[idx + 1].key as TabKey);
                    }}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            )}
            {activeTab === "historia" && (
              <div className="mb-6">
                <HistoriaPersonal />
                <div className="flex justify-end mt-4">
                  <button
                    className="rounded-lg bg-blue-600 px-6 py-2 text-white font-semibold shadow hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      const idx = TABS.findIndex(t => t.key === activeTab);
                      if (idx !== -1 && idx < TABS.length - 1) setActiveTab(TABS[idx + 1].key as TabKey);
                    }}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            )}
            {activeTab === "impresion" && (
              <div className="mb-6">
                <ImpresionDiagnostica />
                <div className="flex justify-end mt-4">
                  <button
                    className="rounded-lg bg-blue-600 px-6 py-2 text-white font-semibold shadow hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      const idx = TABS.findIndex(t => t.key === activeTab);
                      if (idx !== -1 && idx < TABS.length - 1) setActiveTab(TABS[idx + 1].key as TabKey);
                    }}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            )}
            {activeTab === "objetivos" && (
              <div className="mb-6">
                <ObjetivosTerapeuticosConfiguracion />
                <div className="flex justify-end mt-4">
                  <button
                    className="rounded-lg bg-blue-600 px-6 py-2 text-white font-semibold shadow hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      const idx = TABS.findIndex(t => t.key === activeTab);
                      if (idx !== -1 && idx < TABS.length - 1) setActiveTab(TABS[idx + 1].key as TabKey);
                    }}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}