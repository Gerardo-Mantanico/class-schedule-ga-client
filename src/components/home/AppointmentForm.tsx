"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useServicios } from "../../hooks/useServicios";

export default function AppointmentForm() {
  const { services } = useServicios();
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    servicio: "",
    mensaje: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Aquí iría la llamada a tu API
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // });

      // Simulación de envío exitoso
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess(true);
      setFormData({
        nombre: "",
        telefono: "",
        email: "",
        servicio: "",
        mensaje: "",
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch {
      setError("Hubo un error al enviar tu solicitud. Por favor, intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mensaje de registro */}
      <div className="p-4 border border-orange-200 rounded-xl bg-orange-50 dark:bg-orange-950/30 dark:border-orange-800">
        <div className="flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white mb-1">
              Registro Requerido
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Para agendar una cita debes{" "}
              <Link
                href="/signup"
                className="font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 underline"
              >
                crear una cuenta
              </Link>{" "}
              primero. Si ya tienes cuenta,{" "}
              <Link
                href="/signin"
                className="font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 underline"
              >
                inicia sesión
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Mensajes de éxito o error */}
      {success && (
        <div className="p-4 border border-success-200 rounded-xl bg-success-50 dark:bg-success-950/30 dark:border-success-800">
          <p className="text-sm font-medium text-success-700 dark:text-success-300">
            ¡Solicitud enviada con éxito! Nos pondremos en contacto contigo pronto.
          </p>
        </div>
      )}

      {error && (
        <div className="p-4 border border-error-200 rounded-xl bg-error-50 dark:bg-error-950/30 dark:border-error-800">
          <p className="text-sm font-medium text-error-700 dark:text-error-300">
            {error}
          </p>
        </div>
      )}

      <div className="relative">
        {/* Overlay para deshabilitar el formulario */}
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl">
          <div className="text-center p-6 max-w-md">
            <div className="mb-4 text-5xl">🔒</div>
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              Autenticación Requerida
            </h3>
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
              Para poder agendar una cita necesitas estar registrado e iniciar sesión en nuestra plataforma.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white transition-all duration-200 rounded-lg bg-brand-600 hover:bg-brand-700 shadow-theme-md"
              >
                Crear Cuenta
              </Link>
              <Link
                href="/signin"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-brand-600 transition-all duration-200 bg-white border-2 border-brand-600 rounded-lg hover:bg-brand-50 dark:bg-gray-800 dark:text-brand-400 dark:border-brand-400 dark:hover:bg-gray-700"
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 opacity-50 pointer-events-none">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="nombre"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Nombre Completo <span className="text-error-500">*</span>
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-4 py-3 text-gray-900 transition-colors border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-brand-600"
              placeholder="Juan Pérez"
            />
          </div>
          <div>
            <label
              htmlFor="telefono"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Teléfono <span className="text-error-500">*</span>
            </label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              required
              value={formData.telefono}
              onChange={handleChange}
              className="w-full px-4 py-3 text-gray-900 transition-colors border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-brand-600"
              placeholder="+52 123 456 7890"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Correo Electrónico <span className="text-error-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 text-gray-900 transition-colors border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-brand-600"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="servicio"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Servicio de Interés <span className="text-error-500">*</span>
          </label>
          <select
            id="servicio"
            name="servicio"
            required
            value={formData.servicio}
            onChange={handleChange}
            className="w-full px-4 py-3 text-gray-900 transition-colors border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-brand-600"
          >
            <option value="">Selecciona un servicio</option>
            {services.map((service) => (
              <option key={service.id} value={service.nombre}>
                {service.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="mensaje"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Mensaje <span className="text-gray-500 text-xs">(Opcional)</span>
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            rows={4}
            value={formData.mensaje}
            onChange={handleChange}
            className="w-full px-4 py-3 text-gray-900 transition-colors border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-brand-600"
            placeholder="Cuéntanos brevemente el motivo de tu consulta..."
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-5 py-3.5 text-sm font-medium text-white transition-colors bg-brand-500 rounded-lg shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 disabled:cursor-not-allowed"
        >
          {isLoading ? "Enviando..." : "Agendar Cita"}
        </button>

        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          Al enviar este formulario, aceptas nuestros{" "}
          <Link href="/terminos" className="text-brand-600 hover:text-brand-700 dark:text-brand-400">
            términos y condiciones
          </Link>{" "}
          y{" "}
          <Link href="/privacidad" className="text-brand-600 hover:text-brand-700 dark:text-brand-400">
            política de privacidad
          </Link>
          .
        </p>
      </form>
      </div>

      {/* Opción de registro */}
      <div className="pt-6 text-center border-t border-gray-200 dark:border-gray-800">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          ¿No tienes una cuenta aún?{" "}
          <Link
            href="/signup"
            className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
