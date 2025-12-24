import React, { useState } from "react";
import { Sesion } from "@/interfaces/historiaClinica/Sesiones";
import Button from "@/components/ui/button/Button";
import GenericModal from "@/components/ui/modal/GenericModal";


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
  <GenericModal
    isOpen={mostrarDetalles}
    onClose={() => setMostrarDetalles(false)}
    title={
      <span className="flex items-center gap-2 text-blue-700">
        <span className="material-icons text-blue-500">description</span>
        Detalles de la Nota
      </span>
    }
  >
    <div className="space-y-3 text-gray-700">
      <div>
        <span className="font-semibold">Fecha de Sesión:</span>{" "}
        {notaSeleccionada.fechaSesion
          ? notaSeleccionada.fechaSesion.replace("T", " ").slice(0, 16)
          : "Sin fecha"}
      </div>
      <div>
        <span className="font-semibold">Número de Sesión:</span>{" "}
        {notaSeleccionada.numeroSesion ?? "Sin número"}
      </div>
      <div>
        <span className="font-semibold">Asistencia:</span>{" "}
        {notaSeleccionada.asistencia ? "Sí" : "No"}
      </div>
      {!notaSeleccionada.asistencia && (
        <div>
          <span className="font-semibold">Justificación de Inasistencia:</span>{" "}
          {notaSeleccionada.justificacionInasistencia || "Sin justificación"}
        </div>
      )}
      <div>
        <span className="font-semibold">Temas Abordados:</span>{" "}
        {notaSeleccionada.temasAbordados || "Sin temas"}
      </div>
      <div>
        <span className="font-semibold">Intervenciones Realizadas:</span>{" "}
        {notaSeleccionada.intervencionesRealizadas || "Sin intervenciones"}
      </div>
      <div>
        <span className="font-semibold">Respuesta del Paciente:</span>{" "}
        {notaSeleccionada.repuestaPaciente || "Sin respuesta"}
      </div>
      <div>
        <span className="font-semibold">Tareas Asignadas:</span>{" "}
        {notaSeleccionada.tareasAsignadas || "Sin tareas"}
      </div>
      <div>
        <span className="font-semibold">Observaciones:</span>{" "}
        {notaSeleccionada.observaciones || "Sin observaciones"}
      </div>
      <div>
        <span className="font-semibold">Próxima Cita:</span>{" "}
        {notaSeleccionada.proximaCita
          ? notaSeleccionada.proximaCita.replace("T", " ").slice(0, 16)
          : "Sin próxima cita"}
      </div>
      <div>
        <span className="font-semibold">Firma del Psicólogo:</span>{" "}
        <img src={notaSeleccionada.firmaPsicologo || "image"} alt="Firma del Psicólogo" />
    
      </div>
    </div>
    <div className="flex justify-end mt-8 gap-2">
      <Button
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        onClick={() => setMostrarDetalles(false)}
      >
        Cerrar
      </Button>
    </div>
  </GenericModal>
)}
    </div>
  );
}