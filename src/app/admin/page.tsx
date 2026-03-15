import type { Metadata } from "next";
import React from "react";
import {
  TableIcon,
  UserCircleIcon,
  FileIcon,
  TaskIcon,
  CheckCircleIcon,
  TimeIcon,
} from "@/icons";
import StripedCard from "@/components/common/StripedCard";

export const metadata: Metadata = {
  title: "Panel administrativo",
  description: "Administra cursos, salones, docentes y generación de horarios.",
};

const accessCards = [
  {
    title: "Cursos",
    description: "Administra oferta académica, códigos únicos y asignación por carrera/semestre.",
    href: "/admin/cursos",
    icon: TableIcon,
    tone: "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300",
    stripe: "bg-brand-500",
    cta: "Gestionar cursos",
  },
  {
    title: "Salones",
    description: "Define capacidad, tipo de salón y disponibilidad por jornada.",
    href: "/admin/salones",
    icon: TableIcon,
    tone: "bg-blue-light-50 text-blue-light-700 dark:bg-blue-light-500/15 dark:text-blue-light-300",
    stripe: "bg-blue-light-500",
    cta: "Gestionar salones",
  },
  {
    title: "Docentes",
    description: "Controla registro personal, horario base y preferencias de cursos.",
    href: "/admin/docentes",
    icon: UserCircleIcon,
    tone: "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-300",
    stripe: "bg-success-500",
    cta: "Gestionar docentes",
  },
  {
    title: "Carga CSV",
    description: "Importa cursos, salones y docentes de forma masiva para la demo.",
    href: "/admin/carga-csv",
    icon: FileIcon,
    tone: "bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-300",
    stripe: "bg-warning-500",
    cta: "Cargar archivos",
  },
  {
    title: "Config. Horarios",
    description: "Configura periodos, jornadas y criterios para la generación de horarios.",
    href: "/admin/configuracion-horarios",
    icon: TaskIcon,
    tone: "bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300",
    stripe: "bg-purple-500",
    cta: "Configurar generación",
  },
  {
    title: "Horarios",
    description: "Edita horarios manualmente y valida colisiones de salón/docente.",
    href: "/admin/horarios",
    icon: TimeIcon,
    tone: "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300",
    stripe: "bg-cyan-500",
    cta: "Editar horarios",
  },
  {
    title: "Reportes",
    description: "Visualiza métricas y matriz de horarios por franja y salón.",
    href: "/admin/reporte",
    icon: CheckCircleIcon,
    tone: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
    stripe: "bg-indigo-500",
    cta: "Ver reportes",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-7">
      <section className="rounded-2xl border border-gray-200 bg-linear-to-r from-white to-brand-50 p-6 shadow-theme-sm dark:border-gray-800 dark:from-white/3 dark:to-brand-500/5">
        <p className="text-sm font-medium text-brand-600">Dashboard</p>
        <h1 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
          Panel de administración de horarios
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-gray-600 dark:text-gray-400">
          Este panel concentra únicamente los módulos vigentes del proyecto: carga de datos, catálogos
          académicos, configuración de generación y control operativo de horarios.
        </p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-brand-200 bg-white px-3 py-2 text-xs text-brand-700 dark:border-brand-800 dark:bg-white/5 dark:text-brand-300">
          <CheckCircleIcon className="h-4 w-4" />
          Demo activa sin dependencia de backend para datos de horarios
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {accessCards.map((card) => (
          <StripedCard
            key={card.href}
            title={card.title}
            icon={card.icon}
            tone={card.tone}
            stripe={card.stripe}
            href={card.href}
            actionText={card.cta}
          >
            <p>{card.description}</p>
          </StripedCard>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Flujo recomendado</h3>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-400">
            <li>Registrar cursos, salones y docentes.</li>
            <li>Cargar datos masivos por CSV cuando sea necesario.</li>
            <li>Definir la configuración de generación de horarios.</li>
            <li>Revisar, ajustar manualmente y exportar reportes.</li>
          </ol>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Modo demo</h3>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Los módulos de horarios operan con datos locales para facilitar la demostración sin dependencia del servidor.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Integración backend</h3>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            La guía funcional para conectar API y payloads esperados está documentada en el directorio de documentación del proyecto.
          </p>
        </div>
      </section>
    </div>
  );
}
