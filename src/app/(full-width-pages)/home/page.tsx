import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import AppointmentForm from "@/components/home/AppointmentForm";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import ServicesSection from "@/components/home/ServicesSection";
import AreaSection from "@/components/home/AreaSection";
import EspecialidadSection from "@/components/home/EspecialidadSection";

export const metadata: Metadata = {
  title: "PsiFirm - Clínica Psicológica Profesional",
  description:
    "Centro de atención psicológica integral. Ofrecemos servicios especializados en terapia individual, familiar, infantil y más.",
};

// Datos de profesionales
const professionals = [
  {
    id: 1,
    name: "Dra. María González",
    specialty: "Psicología Clínica",
    credentials: "Lic. en Psicología, Maestría en Terapia Cognitivo-Conductual",
    experience: "15 años de experiencia",
    image: "/images/user/user-01.png",
  },
  {
    id: 2,
    name: "Dr. Carlos Ramírez",
    specialty: "Psicología Infantil",
    credentials: "Lic. en Psicología, Especialidad en Desarrollo Infantil",
    experience: "12 años de experiencia",
    image: "/images/user/user-02.png",
  },
  {
    id: 3,
    name: "Lic. Ana Martínez",
    specialty: "Terapia Familiar",
    credentials: "Lic. en Psicología, Maestría en Terapia Familiar Sistémica",
    experience: "10 años de experiencia",
    image: "/images/user/user-03.png",
  },
  {
    id: 4,
    name: "Dr. Roberto Silva",
    specialty: "Neuropsicología",
    credentials: "Lic. en Psicología, Doctorado en Neurociencias",
    experience: "18 años de experiencia",
    image: "/images/user/user-04.png",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Theme Toggle Button - Fixed position */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeTogglerTwo />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[600px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
          src="/images/carousel/vitaly-gariev-iyeUwItlIPk-unsplash.jpg" 
            alt="Hero Background"
            fill
            className="object-cover blur-[3px] scale-105"
            priority
          />
        </div>
        
        {/* Overlay - Minimal dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="">
          <div className="absolute inset-0 bg-[url('/images/shape/grid.svg')] bg-center opacity-30"></div>
        </div>
        <div className="relative z-10 px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">

            <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl lg:text-6xl drop-shadow-lg">
              Tu salud mental, <br className="hidden sm:block" />
              nuestra <span className="text-brand-200">prioridad</span>
            </h1>
            <p className="max-w-3xl mx-auto mb-8 text-lg text-white sm:text-xl lg:text-2xl drop-shadow-md font-medium">
              Atención psicológica profesional con un equipo altamente calificado y comprometido con tu bienestar emocional.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/signin"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-brand-600 transition-all duration-200 bg-white rounded-lg shadow-theme-lg hover:bg-brand-50 hover:shadow-theme-xl"
              >
                <span className="mr-2"></span>
                Agendar Cita
              </Link>
              <Link
                href="#servicios"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white transition-all duration-200 border-2 border-white rounded-lg hover:bg-white/10"
              >
                Conocer Servicios
                <span className="ml-2"></span>
              </Link>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-3 gap-6 mt-16 text-center">
              <div>
                <div className="text-3xl font-bold text-white sm:text-4xl">20+</div>
                <div className="mt-1 text-sm text-brand-100">Años de experiencia</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white sm:text-4xl">5K+</div>
                <div className="mt-1 text-sm text-brand-100">Pacientes atendidos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white sm:text-4xl">98%</div>
                <div className="mt-1 text-sm text-brand-100">Satisfacción</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave decoration */}
       <div className="absolute bottom-0 left-0 right-0 z-10 text-black">

          <svg
            className="w-full h-auto text-gray-50 dark:text-gray-950"
            viewBox="0 0 1440 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 48h1440V0c-240 48-480 48-720 0S240 -48 0 0v48z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      {/* Servicios Section */}
      <ServicesSection />

      {/* Especialidades Section */}
      <EspecialidadSection />

      {/* Áreas de Atención Section */}
      <AreaSection />

      {/* Profesionales Section */}
      <section id="profesionales" className="px-4 py-16 bg-white dark:bg-gray-900 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
              Nuestro Equipo
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
              Profesionales certificados y con amplia experiencia en el campo de la psicología
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {professionals.map((professional) => (
              <div
                key={professional.id}
                className="overflow-hidden transition-all duration-200 bg-white border border-gray-200 rounded-2xl hover:shadow-theme-lg dark:bg-white/[0.03] dark:border-gray-800"
              >
                <div className="p-6">
                  <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-800">
                    <div className="flex items-center justify-center w-full h-full text-4xl font-bold text-brand-500">
                      {professional.name.charAt(0)}
                    </div>
                  </div>
                  <h3 className="mb-1 text-lg font-semibold text-center text-gray-900 dark:text-white">
                    {professional.name}
                  </h3>
                  <p className="mb-3 text-sm font-medium text-center text-brand-600 dark:text-brand-400">
                    {professional.specialty}
                  </p>
                  <p className="mb-2 text-xs text-center text-gray-600 dark:text-gray-400">
                    {professional.credentials}
                  </p>
                  <p className="text-xs text-center text-gray-500 dark:text-gray-500">
                    {professional.experience}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Información de la Clínica Section */}
      <section id="clinica" className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-24">
        <div className="overflow-hidden bg-white border border-gray-200 shadow-theme-lg rounded-3xl dark:bg-white/[0.03] dark:border-gray-800">
          <div className="grid gap-0 lg:grid-cols-2">
            <div className="p-8 lg:p-12">
              <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
                Sobre Nuestra Clínica
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  <strong className="text-gray-900 dark:text-white">PsiFirm</strong> es un centro 
                  de atención psicológica con más de 20 años de experiencia brindando servicios de 
                  salud mental de alta calidad. Nos especializamos en el tratamiento integral de 
                  personas de todas las edades.
                </p>
                <p>
                  Nuestro compromiso es proporcionar un espacio seguro, confidencial y profesional 
                  donde cada persona pueda encontrar el apoyo necesario para su bienestar emocional 
                  y desarrollo personal.
                </p>
                <div className="pt-6 mt-6 space-y-3 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-start">
                    <span className="mr-3 text-2xl">📍</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Dirección</p>
                      <p className="text-sm">Av. Principal 123, Col. Centro, Ciudad</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-3 text-2xl">📞</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Teléfono</p>
                      <p className="text-sm">+52 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-3 text-2xl">✉️</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Email</p>
                      <p className="text-sm">contacto@psifirm.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-3 text-2xl">🕐</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Horario</p>
                      <p className="text-sm">Lunes a Viernes: 9:00 - 20:00</p>
                      <p className="text-sm">Sábados: 9:00 - 14:00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-linear-to-br from-brand-500 to-brand-700 dark:from-brand-800 dark:to-brand-950 p-8 lg:p-12 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-white rounded-full bg-opacity-20">
                    <span className="text-4xl">🧠</span>
                  </div>
                </div>
                <h3 className="mb-4 text-2xl font-bold">¿Listo para comenzar?</h3>
                <p className="mb-6 text-brand-100">
                  Da el primer paso hacia tu bienestar emocional. Agenda tu cita hoy mismo.
                </p>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-medium transition-all duration-200 bg-white rounded-lg text-brand-600 hover:bg-brand-50 shadow-theme-lg"
                >
                  Registrarse para Agendar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formulario de Contacto */}
      <section id="contacto" className="px-4 py-16 bg-white dark:bg-gray-900 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Información de contacto */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
                  Agenda tu Cita
                </h2>
                <p className="mb-4 text-lg text-gray-600 dark:text-gray-400">
                  Para agendar una cita, primero debes crear una cuenta en nuestra plataforma.
                </p>
              </div>

              {/* Información de contacto */}
              <div className="p-6 border border-gray-200 rounded-2xl dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Información de Contacto
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-950/30">
                      <span className="text-lg">📍</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Dirección</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Av. Principal 123, Col. Centro, Ciudad
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-950/30">
                      <span className="text-lg">📞</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Teléfono</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        +52 (555) 123-4567
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-950/30">
                      <span className="text-lg">✉️</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        contacto@psifirm.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-950/30">
                      <span className="text-lg">🕐</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Horario</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Lunes a Viernes: 9:00 - 20:00
                        <br />
                        Sábados: 9:00 - 14:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Beneficios */}
              <div className="p-6 mt-6 border border-success-200 rounded-2xl bg-success-50 dark:bg-success-950/30 dark:border-success-800">
                <h3 className="mb-3 text-sm font-semibold text-success-900 dark:text-success-300">
                  ¿Por qué elegirnos?
                </h3>
                <ul className="space-y-2 text-sm text-success-800 dark:text-success-200">
                  <li className="flex items-center gap-2">
                    <span className="text-success-500">✓</span>
                    Primera consulta sin costo
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-success-500">✓</span>
                    Atención personalizada
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-success-500">✓</span>
                    Horarios flexibles
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-success-500">✓</span>
                    Consultas presenciales y en línea
                  </li>
                </ul>
              </div>
            </div>

            {/* Formulario */}
            <div className="lg:col-span-3">
              <div className="p-6 border border-gray-200 rounded-2xl bg-white dark:bg-white/[0.03] dark:border-gray-800 md:p-8">
                <AppointmentForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 bg-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 text-lg font-bold text-white">PsiFirm</h3>
              <p className="text-sm text-gray-400">
                Centro de atención psicológica profesional comprometido con tu bienestar emocional.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#servicios" className="hover:text-white">Servicios</Link></li>
                <li><Link href="#especialidades" className="hover:text-white">Especialidades</Link></li>
                <li><Link href="#profesionales" className="hover:text-white">Profesionales</Link></li>
                <li><Link href="#contacto" className="hover:text-white">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">Contacto</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>+52 (555) 123-4567</li>
                <li>contacto@psifirm.com</li>
                <li>Av. Principal 123, Col. Centro</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 mt-8 text-center border-t border-gray-800">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} PsiFirm - Todos los derechos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
