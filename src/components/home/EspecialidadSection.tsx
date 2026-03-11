"use client";
import React from "react";
import { useEspecialidad } from "../../hooks/useEspecialidad";
import { 
  ShootingStarIcon, 
  UserIcon, 
  GroupIcon, 
  BoxIconLine, 
  BoltIcon, 
  GridIcon 
} from "../../icons";

const specialtyStyles = [
  {
    icon: <ShootingStarIcon className="w-6 h-6" />,
    bgClass: "bg-indigo-50 dark:bg-indigo-900/20",
    textClass: "text-indigo-600 dark:text-indigo-400",
    borderClass: "border-indigo-100 dark:border-indigo-800"
  },
  {
    icon: <UserIcon className="w-6 h-6" />,
    bgClass: "bg-rose-50 dark:bg-rose-900/20",
    textClass: "text-rose-600 dark:text-rose-400",
    borderClass: "border-rose-100 dark:border-rose-800"
  },
  {
    icon: <GroupIcon className="w-6 h-6" />,
    bgClass: "bg-emerald-50 dark:bg-emerald-900/20",
    textClass: "text-emerald-600 dark:text-emerald-400",
    borderClass: "border-emerald-100 dark:border-emerald-800"
  },
  {
    icon: <BoxIconLine className="w-6 h-6" />,
    bgClass: "bg-amber-50 dark:bg-amber-900/20",
    textClass: "text-amber-600 dark:text-amber-400",
    borderClass: "border-amber-100 dark:border-amber-800"
  },
  {
    icon: <BoltIcon className="w-6 h-6" />,
    bgClass: "bg-cyan-50 dark:bg-cyan-900/20",
    textClass: "text-cyan-600 dark:text-cyan-400",
    borderClass: "border-cyan-100 dark:border-cyan-800"
  },
  {
    icon: <GridIcon className="w-6 h-6" />,
    bgClass: "bg-fuchsia-50 dark:bg-fuchsia-900/20",
    textClass: "text-fuchsia-600 dark:text-fuchsia-400",
    borderClass: "border-fuchsia-100 dark:border-fuchsia-800"
  }
];

export default function EspecialidadSection() {
  const { especialidades, loading, error } = useEspecialidad();


  if (loading) {
    return (
      <section id="congresos" className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-24">
        <div className="text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400">Cargando especialidades...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="congresos" className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-24">
        <div className="text-center">
          <p className="text-lg text-red-600 dark:text-red-400">Error al cargar especialidades: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="especialidades" className="relative px-4 py-16 overflow-hidden bg-gray-50 dark:bg-gray-900 sm:px-6 lg:px-8 lg:py-24">
      {/* Thematic Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
        <svg className="w-full h-full" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="2" fill="none" className="text-gray-900 dark:text-white"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <span className="inline-block px-4 py-1 mb-4 text-sm font-semibold tracking-wider text-brand-600 uppercase bg-brand-50 rounded-full dark:bg-brand-900/20 dark:text-brand-400">
            Nuestras Especialidades
          </span>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
            Expertos en Salud Mental
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            Contamos con un equipo multidisciplinario de especialistas dedicados a tu bienestar integral.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {especialidades.map((especialidad, index) => {
            const style = specialtyStyles[index % specialtyStyles.length];
            return (
              <div
                key={especialidad.id}
                className={`group relative p-8 bg-white dark:bg-gray-800 border rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${style.borderClass}`}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 mb-6 rounded-xl ${style.bgClass} ${style.textClass} group-hover:scale-110 transition-transform duration-300`}>
                  {style.icon}
                </div>
                
                <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {especialidad.nombre}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {especialidad.descripcion}
                </p>

                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                  <div className={`transform rotate-12 scale-150 ${style.textClass}`}>
                    {style.icon}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}