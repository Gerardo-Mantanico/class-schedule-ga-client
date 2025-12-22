import React, { useState } from "react";
import { Sesion } from "@/interfaces/historiaClinica/Sesiones";
import Button from "@/components/ui/button/Button";

interface NotasProgresoPanelProps {
  notas: Sesion[];
  onRegistrar: () => void;
}

export default function NotasProgresoPanel({ notas, onRegistrar }: NotasProgresoPanelProps) {
  const [notaSeleccionada, setNotaSeleccionada] = useState<Sesion | null>(null);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Notas de Progreso</h2>
        <Button onClick={onRegistrar} className="bg-green-600 hover:bg-green-700">
          Registrar nota de progreso
        </Button>
      </div>
      <ul className="divide-y divide-stroke">
        {notas.length === 0 && (
          <li className="py-4 text-gray-500">No hay notas registradas.</li>
        )}
        {notas.map((nota, idx) => (
          <li key={idx} className="py-3 flex justify-between items-center">
            <span>
              <b>{nota.fecha ? nota.fecha.slice(0, 10) : "Sin fecha"}</b>
              {" — "}
              {nota.temasAbordados ? nota.temasAbordados : "Sin tema"}
            </span>
            <Button
              type="button"
              onClick={() => setNotaSeleccionada(nota)}
            >
              Ver detalles
            </Button>
          </li>
        ))}
      </ul>
      {notaSeleccionada && (
        <div className="mt-6 bg-gray-50 p-4 rounded shadow-inner">
          <h3 className="text-lg font-bold mb-2">Detalles de la Nota</h3>
          <p><b>Fecha:</b> {notaSeleccionada.fecha}</p>
          <p><b>Temas Abordados:</b> {notaSeleccionada.temasAbordados}</p>
          <p><b>Observaciones:</b> {notaSeleccionada.observaciones}</p>
          {/* Agrega más campos según tu modelo */}
          <Button
            className="mt-4 bg-blue-600 text-white"
            onClick={() => setNotaSeleccionada(null)}
          >
            Cerrar
          </Button>
        </div>
      )}
    </div>
  );
}