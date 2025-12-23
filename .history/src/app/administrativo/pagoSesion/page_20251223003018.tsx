"use client";

import React, { useState } from "react";
import Button from "@/components/ui/button/Button";
import { MdPayment } from "react-icons/md";
import Input from "@/components/form/input/InputField";

const pacientes = [
  { id: 1, nombre: "Ana Pérez" },
  { id: 2, nombre: "Luis Gómez" },
];

export default function PagoSesion() {
  const [paciente, setPaciente] = useState("");
  const [fecha, setFecha] = useState("");
  const [monto, setMonto] = useState("");
  const [metodo, setMetodo] = useState("efectivo");
  const [comentario, setComentario] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar el pago
    setMensaje("¡Pago registrado correctamente!");
    setPaciente("");
    setFecha("");
    setMonto("");
    setMetodo("efectivo");
    setComentario("");
    setTimeout(() => setMensaje(""), 3000);
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg mt-8">
      <div className="flex items-center gap-3 mb-6">
        <MdPayment className="text-green-600 dark:text-green-400" size={28} />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Pago de Sesión</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-200">Paciente</label>
          <select
            value={paciente}
            onChange={e => setPaciente(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
          >
            <option value="">Selecciona un paciente</option>
            {pacientes.map(p => (
              <option key={p.id} value={p.nombre}>{p.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-200">Fecha de sesión</label>
          <Input
            type="date"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-200">Monto ($)</label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={monto}
            onChange={e => setMonto(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-200">Método de pago</label>
          <select
            value={metodo}
            onChange={e => setMetodo(e.target.value)}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
          >
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-200">Comentario (opcional)</label>
          <textarea
            value={comentario}
            onChange={e => setComentario(e.target.value)}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
            rows={2}
          />
        </div>
        <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
          Registrar Pago
        </Button>
        {mensaje && <div className="mt-2 text-green-600 font-semibold">{mensaje}</div>}
      </form>
    </div>
  );
}