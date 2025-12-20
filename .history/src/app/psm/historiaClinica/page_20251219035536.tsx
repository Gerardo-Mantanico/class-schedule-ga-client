"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { 
  ClipboardDocumentCheckIcon, 
  UserIcon, 
  UsersIcon, 
  ClockIcon, 
  DocumentTextIcon, 
  BeakerIcon, 
  ScaleIcon, 
  IdentificationIcon,
  ArchiveBoxIcon,
  CheckBadgeIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline"; // Asegúrate de tener heroicons instalado o usa SVGs

// Componentes dinámicos
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
  | "sesiones" | "evaluaciones" | "alta" | "antecedentes" | "identificacion"
  | "encabezado" | "escalas" | "estado" | "historia" | "impresion" | "objetivos";

interface TabConfig {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
}

const TABS: TabConfig[] = [
  { key: "encabezado", label: "Encabezado", icon: <ArchiveBoxIcon className="w-5 h-5" /> },
  { key: "identificacion", label: "Identificación", icon: <IdentificationIcon className="w-5 h-5" /> },
  { key: "antecedentes", label: "Antecedentes", icon: <UsersIcon className="w-5 h-5" /> },
  { key: "historia", label: "Historia Personal", icon: <UserIcon className="w-5 h-5" /> },
  { key: "estado", label: "Estado Actual", icon: <ClockIcon className="w-5 h-5" /> },
  { key: "escalas", label: "Escalas", icon: <ScaleIcon className="w-5 h-5" /> },
  { key: "impresion", label: "Impresión", icon: <DocumentTextIcon className="w-5 h-5" /> },
  { key: "objetivos", label: "Objetivos", icon: <ChartBarIcon className="w-5 h-5" /> },
  { key: "sesiones", label: "Notas (Sesiones)", icon: <ClipboardDocumentCheckIcon className="w-5 h-5" /> },
  { key: "evaluaciones", label: "Evaluaciones", icon: <BeakerIcon className="w-5 h-5" /> },
  { key: "alta", label: "Alta", icon: <CheckBadgeIcon className="w-5 h-5" /> },
];

// Datos de ejemplo
const sesionesEjemplo = [{ id: 1, fecha: "2025-12-01 10:00", tema: "Ansiedad" }];
const evaluacionesEjemplo = [{ id: 1, fecha: "2025-12-05", tipo: "Seguimiento", escala: 7 }];
const altasEjemplo = [{ id: 1, fecha: "2025-12-15", motivo: "Objetivos alcanzados" }];

export default function PsmHome() {
  const [tab, setTab] = useState<TabKey>("sesiones");
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const getTabClassName = (tabId: TabKey) => {
    const baseClasses = "inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ease-in-out whitespace-nowrap";
    if (tab === tabId) {
      return `${baseClasses} text-blue-600 border-blue-600 dark:text-blue-400 dark:border-blue-400`;
    }
    return `${baseClasses} bg-transparent text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200`;
  };

  return (
    <div className="mx-auto max-w-6xl py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Historia Clínica Psicológica</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Gestión integral de la historia clínica y sesiones del paciente.</p>
      </div>

      {/* Contenedor Estilo Card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
        
        {/* Navegación de Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
          <nav className="flex space-x-2 overflow-x-auto px-4 scrollbar-hide [&::-webkit-scrollbar]:h-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                className={getTabClassName(t.key)}
                onClick={() => {
                  setTab(t.key);
                  setShowForm(false);
                  setSelected(null);
                }}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Secciones con Listas (Sesiones, Evaluaciones, Alta) */}
          {tab === "sesiones" && (
            <div className="animate-in fade-in duration-300">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Sesiones registradas</h2>
                <button
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white font-semibold hover:bg-blue-700 transition"
                  onClick={() => { setShowForm(true); setSelected(null); }}
                >
                  + Nueva sesión
                </button>
              </div>
              <div className="space-y-2 mb-6">
                {sesionesEjemplo.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-bold">{s.fecha}</span> — {s.tema}
                    </span>
                    <button className="text-blue-600 text-sm font-bold hover:underline" onClick={() => { setSelected(s); setShowForm(false); }}>Ver</button>
                  </div>
                ))}
              </div>
              {(showForm || selected) && <NotasProgreso onCancel={() => { setShowForm(false); setSelected(null); }} />}
            </div>
          )}

          {tab === "evaluaciones" && (
             <div className="animate-in fade-in duration-300">
               <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Evaluaciones Periódicas</h2>
                <button
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white font-semibold hover:bg-blue-700 transition"
                  onClick={() => { setShowForm(true); setSelected(null); }}
                >
                  + Nueva evaluación
                </button>
              </div>
              {/* Similar estructura de lista que sesiones */}
              {showForm || selected ? <EvaluacionesPeriodicas onCancel={() => { setShowForm(false); setSelected(null); }} /> : null}
             </div>
          )}

          {tab === "alta" && (
            <div className="animate-in fade-in duration-300">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Altas Terapéuticas</h2>
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white font-semibold hover:bg-blue-700 transition" onClick={() => setShowForm(true)}>+ Nueva alta</button>
              </div>
              {showForm || selected ? <AltaTerapeutica onCancel={() => { setShowForm(false); setSelected(null); }} /> : null}
            </div>
          )}

          {/* Renderizado de Módulos Directos */}
          <div className="animate-in fade-in duration-300">
            {tab === "antecedentes" && <AntecedentesFamiliares />}
            {tab === "identificacion" && <DatosIdentificacionPaciente />}
            {tab === "encabezado" && <EncabezadoInstitucional />}
            {tab === "escalas" && <EscalasPruebasAplicadas />}
            {tab === "estado" && <EstadoActual />}
            {tab === "historia" && <HistoriaPersonal />}
            {tab === "impresion" && <ImpresionDiagnostica />}
            {tab === "objetivos" && <ObjetivosTerapeuticosConfiguracion />}
          </div>
        </div>
      </div>
    </div>
  );
}