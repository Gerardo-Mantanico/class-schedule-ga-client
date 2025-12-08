"use client";
import React from "react";
import Image from "next/image";
import { useServicios } from "../../hooks/useServicios";
import { CheckCircleIcon, ArrowRightIcon, BoxIcon } from "../../icons";

export default function ServicesSection() {
  const { services, loading, error } = useServicios();

  if (loading) {
    return (
      <section id="servicios" className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-24">
        <div className="text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400">Cargando servicios...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="servicios" className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-24">
        <div className="text-center">
          <p className="text-lg text-red-600 dark:text-red-400">Error al cargar servicios: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="servicios" className="relative py-20 overflow-hidden bg-white dark:bg-gray-900">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        
        {/* Header with Photo and Intro */}
        <div className="grid items-center gap-12 mb-20 lg:grid-cols-2">
            <div className="relative order-2 lg:order-1">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                    <Image 
                        src="/images/carousel/carousel-01.png" 
                        alt="Servicios Profesionales" 
                        width={600} 
                        height={400}
                        className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-8">
                        <p className="text-white font-bold text-xl mb-2">Excelencia Clínica</p>
                        <p className="text-white/80 text-sm">Comprometidos con tu salud mental</p>
                    </div>
                </div>
                {/* Decorative element */}
                <div className="absolute -z-10 top-6 -left-6 w-full h-full border-2 border-brand-100 dark:border-brand-900/30 rounded-2xl"></div>
                <div className="absolute -z-10 -bottom-6 -right-6 w-24 h-24 bg-brand-50 dark:bg-brand-900/20 rounded-full blur-2xl"></div>
            </div>

            <div className="order-1 lg:order-2">
                <span className="inline-block px-4 py-1 mb-4 text-sm font-semibold tracking-wider text-brand-600 uppercase bg-brand-50 rounded-full dark:bg-brand-900/20 dark:text-brand-400">
                    Nuestros Servicios
                </span>
                <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white leading-tight">
                    Soluciones Integrales para tu <span className="text-brand-600 dark:text-brand-400">Bienestar</span>
                </h2>
                <p className="mb-8 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    Ofrecemos un enfoque personalizado y profesional, adaptando nuestras terapias a tus necesidades específicas para garantizar los mejores resultados.
                </p>
                
                <ul className="space-y-4">
                    {['Atención Personalizada y Confidencial', 'Profesionales Altamente Calificados', 'Enfoque Basado en Evidencia'].map((item) => (
                        <li key={item} className="flex items-center space-x-3">
                            <div className="shrink-0 text-brand-500">
                                <CheckCircleIcon className="w-6 h-6" />
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 font-medium">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
                <div key={service.id} className="group relative p-8 bg-gray-50 dark:bg-white/5 rounded-3xl hover:bg-brand-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white text-brand-600 shadow-sm group-hover:bg-white/20 group-hover:text-white transition-colors">
                         {service.image ? (
                            <Image src={service.image} width={32} height={32} alt={service.nombre} className="rounded-lg object-cover w-8 h-8"/>
                         ) : (
                            <BoxIcon className="w-8 h-8" />
                         )}
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white group-hover:text-white transition-colors">
                        {service.nombre}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 group-hover:text-white/90 transition-colors mb-6 line-clamp-3">
                        {service.descripcion}
                    </p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-brand-600 font-semibold group-hover:text-white transition-colors cursor-pointer">
                            <span>Más información</span>
                            <ArrowRightIcon className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                        {service.precio && (
                           <span className="text-sm font-bold text-gray-900 dark:text-white bg-white/20 px-3 py-1 rounded-full group-hover:text-white group-hover:bg-white/20">
                             ${service.precio}
                           </span>
                        )}
                    </div>
                </div>
            ))}
        </div>

      </div>
    </section>
  );
}
