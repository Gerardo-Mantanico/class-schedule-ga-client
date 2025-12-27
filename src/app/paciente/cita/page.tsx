"use client";
import { useState } from "react";
import {
  MdMedicalServices,
  MdCalendarToday,
  MdAccessTime,
  MdNoteAdd,
  MdCheckCircle,
  MdPendingActions,
  MdEventAvailable,
} from "react-icons/md";
import { useServicios } from "@/hooks/useServicios";
import { useCita } from "@/hooks/useCita";
import Button from "@/components/ui/button/Button";
import toast from "react-hot-toast";

export default function CrearCitaPsicologica() {
  const [step, setStep] = useState(1);
  const [servicioMedicoId, setServicioMedicoId] = useState<number | null>(null);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [nota, setNota] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { services: serviciosMedicos } = useServicios();
  const { citas: citasView, createCita } = useCita();



  function generarHorarios() {
    const horarios: string[] = [];
    for (let h = 8; h <= 16; h++) {
      const horaStr = h.toString().padStart(2, "0") + ":00";
      horarios.push(horaStr);
    }
    return horarios;
  }


const handleConfirmar = async () => {
  setError("");
  setSuccess("");
  if (!fecha || !hora) {
    setError("Selecciona fecha y hora.");
    return;
  }

  // Construir fecha en UTC para evitar desfase horario
  const [year, month, day] = fecha.split("-");
  const [hour, minute] = hora.split(":");
  const fechaSeleccionada = new Date(Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute)
  ));

  const ahora = new Date();

  if (fechaSeleccionada < ahora) {
    setError("No puedes seleccionar una fecha y hora pasada.");
    return;
  }

  const citaNueva = {
    servicioMedicoId,
    fechaCita: fechaSeleccionada.toISOString(),
    nota,
  };

  const response = await createCita(citaNueva);

  if (response) {
    toast.success("cita registrada exitosamente");
    window.location.reload();
  } else {
    toast.error("No esta disponbile la cita en este momento, intenta con otra hora o fecha.");
  }

  setServicioMedicoId(null);
  setFecha("");
  setHora("");
  setNota("");
  setStep(1);
};

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto p-6  dark:bg-gray-900">
      {/* Columna izquierda: Formulario */}
      <div className="md:w-1/2">
        <div className="bg-white rounded-xl shadow space-y-6 p-6">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-700">
                <MdMedicalServices size={28} /> Selecciona el servicio médico
              </h2>
              <ul className="space-y-3">
                {serviciosMedicos.map(s => (
                  <li key={s.id}>
                    <button
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition
                        ${servicioMedicoId === s.id ? "bg-blue-100 border-blue-400" : "bg-gray-50 border-gray-300 hover:border-blue-300"}`}
                      onClick={() => { setServicioMedicoId(s.id); setStep(2); }}
                    >
                      <MdMedicalServices size={20} />
                      <span className="font-medium text-gray-800">{s.nombre}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {step === 2 && servicioMedicoId && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-700">
                <MdCalendarToday size={28} /> Selecciona fecha y hora
              </h2>
              <label className="block mb-2 font-semibold text-gray-700">Fecha:</label>
              <div className="flex items-center gap-2 mb-4">
                <MdCalendarToday className="text-blue-500" size={20} />
                <input
                  type="date"
                  className="border rounded p-2 w-full"
                  value={fecha}
                  min={new Date().toISOString().split("T")[0]} // <-- aquí
                  onChange={e => setFecha(e.target.value)}
                />
              </div>
              <label className="block mb-2 font-semibold text-gray-700">Hora:</label>
              <div className="flex items-center gap-2 mb-4">
                <MdAccessTime className="text-green-500" size={20} />
                <select
                  className="border rounded p-2 w-full"
                  value={hora}
                  onChange={e => setHora(e.target.value)}
                >
                  <option value="">Selecciona hora</option>
                  {generarHorarios().map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-1"
                  disabled={!fecha || !hora}
                  onClick={() => setStep(3)}
                >
                  <MdNoteAdd size={18} /> Siguiente
                </button>
                <button className="ml-2 text-gray-500" onClick={() => setStep(1)}>Atrás</button>
              </div>
            </div>
          )}
          {step === 3 && servicioMedicoId && fecha && hora && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-purple-700">
                <MdNoteAdd size={28} /> Motivo de la consulta (opcional)
              </h2>
              <textarea
                className="border rounded p-2 w-full mb-4"
                value={nota}
                onChange={e => setNota(e.target.value)}
                maxLength={100}
                placeholder="Describe brevemente el motivo de tu consulta"
              />
              <div className="mb-4 bg-gray-50 rounded-lg p-3">
                <strong className="block mb-2 text-gray-700">Resumen:</strong>
                <div className="flex items-center gap-2 mb-1">
                  <span>{serviciosMedicos.find(s => s.id === servicioMedicoId)?.nombre}</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <MdCalendarToday className="text-blue-500" /> <span>{fecha}</span>
                  <MdAccessTime className="text-green-500" /> <span>{hora}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MdNoteAdd className="text-purple-500" /> <span>{nota || "(Sin motivo)"}</span>
                </div>
              </div>
              {error && <div className="text-red-600 mb-2">{error}</div>}
              {success && (
                <div className="text-green-600 mb-2 flex items-center gap-2">
                  <MdCheckCircle size={20} /> {success}
                </div>
              )}
              <div className="flex gap-6">
                <Button
                  className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-1"
                  onClick={handleConfirmar}
                >
                  <MdCheckCircle size={18} /> Confirmar Cita
                </Button>
                <Button className="ml-2 bg-amber-400 text-gray-500" onClick={() => setStep(2)}>Atrás</Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Columna derecha: Lista de citas */}
      <div className="md:w-1/2 bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-700">
          <MdEventAvailable size={24} /> Tus citas
        </h2>
        {citasView.length === 0 ? (
          <div className="text-gray-500">No tienes citas programadas.</div>
        ) : (
          <ul className="space-y-3">
            {citasView.map(cita => (
              <li key={cita.id} className="border rounded-lg p-3 flex flex-col gap-1 bg-gray-50">
                <div className="flex items-center gap-2 font-medium text-gray-800">
                  <MdMedicalServices className="text-blue-600" /> {cita.servicioMedico.nombre}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <MdCalendarToday className="text-blue-500" /> {cita.fechaCita.split("T")[0]}
                  <MdAccessTime className="text-green-500" /> {cita.fechaCita.split("T")[1].substring(0, 5)}
                </div>
                <div className="flex items-center gap-2 font-medium text-gray-800">
                  <MdNoteAdd className="text-purple-600" /> {cita.nota || "(Sin motivo)"}
                </div>
                <div className="flex items-center gap-2">
                  {cita.estado === "PROGRAMADA" ? (
                    <MdCheckCircle className="text-green-600" />
                  ) : (
                    <MdPendingActions className="text-yellow-500" />
                  )}
                  <span className={`font-semibold ${cita.estadoCita === "PROGRAMADA" ? "text-green-700" : "text-yellow-700"}`}>
                    {cita.estadoCita}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}