import React, { useState } from "react";
import { Sesion } from "@/interfaces/historiaClinica/Sesiones";
import NotasProgresoPanel from "./NotasProgresoPanel";
import NotasProgreso from "./NotasProgreso";

export default function NotasProgresoMain() {
  const [notas, setNotas] = useState<Sesion[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Cuando se guarda una nueva nota
  const handleGuardarNota = (nuevaNota: Sesion) => {
    setNotas((prev) => [...prev, nuevaNota]);
    setMostrarFormulario(false);
  };

  return (
    <div>
      {!mostrarFormulario && (
        <NotasProgresoPanel
          notas={notas}
          onRegistrar={() => setMostrarFormulario(true)}
        />
      )}
      {mostrarFormulario && (
        <NotasProgreso
          onSubmit={handleGuardarNota}
          onCancel={() => setMostrarFormulario(false)}
        />
      )}
    </div>
  );
}
