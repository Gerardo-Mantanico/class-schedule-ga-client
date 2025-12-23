"use client";

import React, { useState } from "react";

import { Button } from "@/app/ui/Button";
import { Textarea } from "@/app/ui/Textarea";

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
    // Puedes cargar esto dinámicamente
  ]);
  const [respuesta, setRespuesta] = useState<{ [id: number]: string }>({});

  const handleResponder = (id: number) => {
    setMensajes(mensajes.map(m =>
      m.id === id ? { ...m, respuesta: respuesta[id] || "" } : m
    ));
    setRespuesta({ ...respuesta, [id]: "" });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Soporte para tareas del paciente</h2>
      <ul className="divide-y divide-gray-200">
        {mensajes.map(m => (
          <li key={m.id} className="py-4">
            <div className="mb-2">
              <span className="font-semibold text-blue-700 dark:text-blue-300">{m.tarea}</span>
              <p className="text-gray-700 dark:text-gray-300 mt-1">{m.mensaje}</p>
            </div>
            {m.respuesta ? (
              <div className="bg-green-50 dark:bg-green-900 p-3 rounded mt-2">
                <span className="font-medium text-green-700 dark:text-green-300">Respuesta:</span>
                <p className="text-gray-800 dark:text-gray-100">{m.respuesta}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <Textarea
                  placeholder="Escribe tu respuesta..."
                  value={respuesta[m.id] || ""}
                  onChange={e => setRespuesta({ ...respuesta, [m.id]: e.target.value })}
                  rows={2}
                />
                <Button
                  onClick={() => handleResponder(m.id)}
                  disabled={!respuesta[m.id]}
                >
                  Responder
                </Button>
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