"use client";

import React, { useState } from "react";
import Button from "@/components/ui/button/Button";
import { MdAssignment, MdQuestionAnswer, MdSend, MdCheckCircle } from "react-icons/md";

type Mensaje = {
  id: number;
  tarea: string;
  mensaje: string;
  respuesta?: string;
};

export default function SoportePaciente() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    { id: 1, tarea: "Ejercicio de respiración", mensaje: "¿Cómo debo realizar la técnica correctamente?" },
    { id: 2, tarea: "Registro de emociones", mensaje: "¿Debo registrar cada emoción o solo las más importantes?" }
  ]);
  const [respuesta, setRespuesta] = useState<{ [id: number]: string }>({});

  const handleResponder = (id: number) => {
    setMensajes(mensajes.map(m =>
      m.id === id ? { ...m, respuesta: respuesta[id] || "" } : m
    ));
    setRespuesta({ ...respuesta, [id]: "" });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
        <MdAssignment className="text-blue-600 dark:text-blue-400" size={28} />
        Soporte para tareas del paciente
      </h2>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {mensajes.map(m => (
          <li key={m.id} className="py-6">
            <div className="mb-2 flex items-center gap-2">
              <MdAssignment className="text-blue-500 dark:text-blue-300" size={22} />
              <span className="font-semibold text-blue-700 dark:text-blue-300">{m.tarea}</span>
            </div>
            <div className="flex items-start gap-2">
              <MdQuestionAnswer className="text-gray-400 mt-1" size={20} />
              <p className="text-gray-700 dark:text-gray-300">{m.mensaje}</p>
            </div>
            {m.respuesta ? (
              <div className="bg-green-50 dark:bg-green-900 p-4 rounded mt-4 flex items-start gap-2">
                <MdCheckCircle className="text-green-600 dark:text-green-400 mt-1" size={22} />
                <div>
                  <span className="font-medium text-green-700 dark:text-green-300">Respuesta:</span>
                  <p className="text-gray-800 dark:text-gray-100 mt-1">{m.respuesta}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 mt-4">
                <div className="flex items-start gap-2">
                  <textarea
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
                    placeholder="Escribe tu respuesta..."
                    value={respuesta[m.id] || ""}
                    onChange={e => setRespuesta({ ...respuesta, [m.id]: e.target.value })}
                    rows={2}
                  />
                  <Button
                    onClick={() => handleResponder(m.id)}
                    disabled={!respuesta[m.id]}
                    className="flex items-center gap-1 h-fit px-3 py-2"
                  >
                    <MdSend size={18} />
                    Responder
                  </Button>
                </div>
              </div>
            )}
          </li>
        ))}
        {mensajes.length === 0 && (
          <li className="text-gray-500 py-4 text-center">No hay tareas pendientes.</li>
        )}
      </ul>
    </div>
  );
}