import React, { useState } from "react";
import { Sesion } from "@/interfaces/historiaClinica/Sesiones";

interface ListaNotasProgresoProps {
  notas: Sesion[];
  onClose: () => void;
}

export default function ListaNotasProgreso({ notas, onClose }: ListaNotasProgresoProps) {
  const [notaSeleccionada, setNotaSeleccionada] = useState<Sesion | null>(null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-2xl relative">
        <button
          className="absolute top-2 right-2 text-gray-500"
          onClick={onClose}
          type="button"
        >
          ✕
        </button>
        <h4 className="font-bold mb-4">Notas de Progreso</h4>
        <ul className="divide-y divide-stroke mb-4">
          {notas.map((nota, idx) => (
            <li key={idx} className="py-2 flex justify-between items-center">
              <span>
                <b>Sesión:</b> {nota.numeroSesiones} | <b>Fecha:</b> {nota.fecha.slice(0, 10)}
              </span>
              <button
                className="text-primary underline text-sm"
                onClick={() => setNotaSeleccionada(nota)}
                type="button"
              >
                Ver detalles
              </button>
            </li>
          ))}
        </ul>
        {notaSeleccionada && (
          <div className="border-t pt-4 mt-4">
            <h5 className="font-bold mb-2">Detalles de la Nota</h5>
            <div className="text-sm space-y-1">
              <div><b>Fecha de Sesión:</b> {notaSeleccionada.fecha}</div>
              <div><b>Número de Sesión:</b> {notaSeleccionada.numeroSesiones}</div>
              <div><b>Asistencia:</b> {notaSeleccionada.asistencia ? "Sí" : "No"}</div>
              {notaSeleccionada.justificacionInasistencia && (
                <div><b>Justificación:</b> {notaSeleccionada.justificacionInasistencia}</div>
              )}
              <div><b>Temas Abordados:</b> {notaSeleccionada.temasAbordados}</div>
              <div><b>Intervenciones:</b> {notaSeleccionada.intervencionesRealizadas}</div>
              <div><b>Respuesta del Paciente:</b> {notaSeleccionada.repuestaPaciente}</div>
              {notaSeleccionada.tareasAsignadas && (
                <div><b>Tareas Asignadas:</b> {notaSeleccionada.tareasAsignadas}</div>
              )}
              {notaSeleccionada.observaciones && (
                <div><b>Observaciones:</b> {notaSeleccionada.observaciones}</div>
              )}
              <div><b>Próxima Cita:</b> {notaSeleccionada.proximaCita}</div>
              <div>
                <b>Firma Digital:</b><br />
                <img src={notaSeleccionada.firmaPsicologo} alt="Firma" className="border mt-1" style={{maxWidth: 200}} />
              </div>
            </div>
            <button
              className="mt-4 text-primary underline text-sm"
              onClick={() => setNotaSeleccionada(null)}
              type="button"
            >
              Cerrar detalles
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
