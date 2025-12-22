import React, { useState } from "react";
import { Sesion } from "@/interfaces/historiaClinica/Sesiones";
import Button from "@/components/ui/button/Button";


interface NotasProgresoPanelProps {
  notas: Sesion[];
  onRegistrar: () => void;
}

export default function NotasProgresoPanel({ notas, onRegistrar }: NotasProgresoPanelProps) {
  const [notaSeleccionada, setNotaSeleccionada] = useState<Sesion | null>(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);

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
             
              onClick={() => {
                setNotaSeleccionada(nota);
                setMostrarDetalles(true);
              }}
            >
              Ver detalles
            </Button>
          </li>
        ))}
      </ul>
{mostrarDetalles && notaSeleccionada && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full relative">
      <h3 className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
        <span className="material-icons text-blue-500">description</span>
        Detalles de la Nota
      </h3>
      <div className="space-y-2 text-gray-700">
        <div>
          <span className="font-semibold">Fecha:</span> {notaSeleccionada.fecha ? notaSeleccionada.fecha.slice(0, 10) : "Sin fecha"}
        </div>
        <div>
          <span className="font-semibold">Temas Abordados:</span> {notaSeleccionada.temasAbordados || "Sin tema"}
        </div>
        <div>
          <span className="font-semibold">Observaciones:</span> {notaSeleccionada.observaciones || "Sin observaciones"}
        </div>
        <div>
          <span className="font-semibold">Intervenciones:</span> {notaSeleccionada.intervenciones || "Sin intervenciones"}
        </div>
        <div>
          <span className="font-semibold">Tareas:</span> {notaSeleccionada.tareas || "Sin tareas"}
        </div>
        <div>
          <span className="font-semibold">Diagnóstico:</span> {notaSeleccionada.diagnostico || "Sin diagnóstico"}
        </div>
        <div>
          <span className="font-semibold">Plan:</span> {notaSeleccionada.plan || "Sin plan"}
        </div>
        {/* Agrega aquí más campos si tu modelo Sesion tiene otros */}
      </div>
      <div className="flex justify-end mt-6">
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          onClick={() => setMostrarDetalles(false)}
        >
          Cerrar
        </Button>
      </div>
      <button
        className="absolute top-3 right-3 text-gray-400 hover:text-blue-600"
        onClick={() => setMostrarDetalles(false)}
        aria-label="Cerrar"
      >
        <span className="material-icons">close</span>
      </button>
    </div>
  </div>
)}
    </div>
  );
}
