
"use client";
import React from 'react';
import Link from 'next/link';
import { MdMedicalServices } from 'react-icons/md';
import { useCita } from '@/hooks/useCita';

const KanbanBoard = () => {
  const { citas, loading, error, updateCita } = useCita();
  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;


  // Filtra por estado si lo necesitas
  const pendientes = citas.filter(c => c.estadoCita === "PROGRAMADA");
  const enCurso = citas.filter(c => c.estadoCita === "EN_PROCESO");



  return (
    <div className="mx-auto max-w-7xl p-4 pb-20 md:p-6 md:pb-6">
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div>
          <div className="flex flex-col items-center px-4 py-5 xl:px-6 xl:py-6">
            <div className="flex flex-col w-full gap-5 sm:justify-between xl:flex-row xl:items-center">
              <h1>Control de citas</h1>
            </div>
          </div>
          <div className="grid grid-cols-1 border-t border-gray-200 divide-x divide-gray-200 dark:border-gray-800 mt-7 dark:divide-gray-800 sm:mt-0 sm:grid-cols-2 xl:grid-cols-2">
            {/* Columna "Citas pendientes" */}
            <div>
              <div className="overflow-hidden">
                <div className="p-4 xl:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-brand-600 dark:text-brand-300">
                      <MdMedicalServices className="w-6 h-6" />
                      Citas pendientes
                      <span className="ml-2 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold bg-brand-100 text-brand-700 dark:bg-brand-400/10 dark:text-brand-200">
                        {pendientes.length}
                      </span>
                    </h3>
                  </div>
                  <div className="min-h-[200px] space-y-5 mt-5">
                    {pendientes.map(cita => (
                      <div key={cita.id} className="p-5 bg-white border border-gray-100 rounded-2xl shadow-theme-sm dark:border-gray-800 dark:bg-white/5 flex flex-col gap-3">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-400/10">
                              <MdMedicalServices className="w-6 h-6 text-brand-500 dark:text-brand-300" />
                            </div>
                            <div>
                              <h4 className="text-base font-semibold text-brand-600 dark:text-brand-200">
                                {cita.servicioMedico.nombre}
                              </h4>
                              <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                {new Date(cita.fechaCita).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <Link
                            href={`/psm/historiaClinica?id=${cita.historiaClinicaId}`}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-400/10 dark:text-green-300 dark:hover:bg-green-400/20 transition"
                            title="Empezar consulta"
                            onClick={async (e) => {
                              e.preventDefault();
                              await updateCita(cita.id, {  estado: "EN_PROCESO" });
                             // window.location.href = `/psm/historiaClinica?id=${cita.historiaClinicaId}`;
                            }}
                          >
                            <MdMedicalServices className="w-5 h-5" />
                            <span className="text-sm font-medium">Empezar consulta</span>
                          </Link>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div className="flex-1">

                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <span className="font-medium text-gray-500 dark:text-gray-400">Paciente:</span>
                              {cita.paciente.firstname} {cita.paciente.lastname}
                            </div>
                            {cita.nota && (
                              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic border-l-4 border-brand-200 pl-2">
                                <span className="block font-medium text-gray-500 dark:text-gray-400">Nota del paciente</span>
                                {cita.nota}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Columna "En curso" */}
            <div>
              <div className="overflow-hidden">
                <div className="p-4 xl:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-warning-700 dark:text-orange-400">
                      <MdMedicalServices className="w-6 h-6" />
                      En curso
                      <span className="ml-2 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-orange-400">
                        {enCurso.length}
                      </span>
                    </h3>
                  </div>
                  <div className="min-h-[200px] space-y-5 mt-5">
                    {enCurso.map(cita => (
                      <div key={cita.id} className="p-5 bg-white border border-gray-100 rounded-2xl shadow-theme-sm dark:border-gray-800 dark:bg-white/5 flex flex-col gap-3">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-warning-100 dark:bg-warning-400/10">
                              <MdMedicalServices className="w-6 h-6 text-warning-700 dark:text-orange-400" />
                            </div>
                            <div>
                              <h4 className="text-base font-semibold text-warning-700 dark:text-orange-300">
                                {cita.servicioMedico.nombre}
                              </h4>
                              <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                {new Date(cita.fechaCita).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div className="flex-1">

                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <span className="font-medium text-gray-500 dark:text-gray-400">Paciente:</span>
                              {cita.paciente.firstname} {cita.paciente.lastname}
                            </div>
                            {cita.nota && (
                              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic border-l-4 border-warning-200 pl-2">
                                {cita.nota}
                              </div>
                            )}
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default KanbanBoard;