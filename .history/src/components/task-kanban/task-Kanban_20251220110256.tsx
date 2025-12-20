
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { MdOutlineMessage } from 'react-icons/md';
import { MdMedicalServices } from 'react-icons/md';
import { useCita } from '@/hooks/useCita';
import Pagination from '../tables/Pagination';

const KanbanBoard = () => {
 const {citas, loading,error, fetchCitas, params, setParams} = useCita();
 const [totalPages, setTotalPages] = useState(1);

 if(loading) return <div>Cargando...</div>;
 if(error) return <div>Error: {error}</div>;


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
            {/* Columna "Hacer" */}
            <div>
              <div className="overflow-hidden">
                <div className="p-4 xl:p-6">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="flex items-center gap-3 text-base font-medium text-gray-800 dark:text-white/90">
                      Citas pendientes
                      <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-white/[0.03] dark:text-white/80">
                        {pendientes.length}
                      </span>
                    </h3>
                  </div>
                  <div className="min-h-[200px] space-y-5 mt-5">
                    {pendientes.map(cita => (
                      <div key={cita.id} className="p-5 bg-white border border-gray-200 task rounded-xl shadow-theme-sm dark:border-gray-800 dark:bg-white/5">
                        <div className="flex items-start justify-between gap-6">
                          <div>
                            <h4 className="mb-5 text-base text-gray-800 dark:text-white/90">
                              {cita.servicioMedico.nombre}
                            </h4>
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer dark:text-gray-400">
                                {new Date(cita.fechaCita).toLocaleString()}
                              </span>
                              <Link href={`/psm/historiaClinica?id=${cita.historiaClinicaId}`} className="flex items-center gap-1 text-green-500 dark:text-green-400" title="Empezar consulta">
                                <MdMedicalServices className="w-5 h-5" />
                                <span>Empezar consulta</span>
                              </Link>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span title="Mensajes">
                              <MdOutlineMessage className="w-5 h-5 text-blue-500" />
                            </span>
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
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="flex items-center gap-3 text-base font-medium text-gray-800 dark:text-white/90">
                      En curso
                      <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-orange-400">
                        {enCurso.length}
                      </span>
                    </h3>
                  </div>
                  <div className="min-h-[200px] space-y-5 mt-5">
                    {enCurso.map(cita => (
                      <div key={cita.id} className="p-5 bg-brand-100 border border-gray-200 task rounded-xl shadow-theme-sm dark:border-gray-800 dark:bg-white/5">
                        <div className="flex items-start justify-between gap-6">
                          <div>
                            <h4 className="mb-5 text-base text-gray-800 dark:text-white/90">
                              {cita.servicioMedico.nombre}
                            </h4>
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer dark:text-gray-400">
                                {new Date(cita.fechaCita).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full border-[0.5px] border-gray-200 dark:border-gray-800">
                            <img src="/images/user/user-01.jpg" alt={cita.paciente.firstname} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <Pagination
  currentPage={params.page + 1}
  totalPages={totalPages || 1} // asegúrate de tener totalPages en tu hook
  onPageChange={(page) => {
    setParams({ ...params, page: page - 1 });
    fetchCitas();
  }}
/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default KanbanBoard;