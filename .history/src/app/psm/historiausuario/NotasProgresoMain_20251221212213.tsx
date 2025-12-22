import React, { useState, useEffect } from "react";
import { Sesion } from "@/interfaces/historiaClinica/Sesiones";
import NotasProgresoPanel from "./NotasProgresoPanel";
import NotasProgreso from "./NotasProgreso";
import useSesiones from "@/hooks/historiaClinica/useSesiones"; // Ajusta la ruta si es necesario

export default function NotasProgresoMain() {
  const [notas, setNotas] = useState<Sesion[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const { getItem } = useSesiones();

  // Cargar notas desde el servidor al montar el componente
  useEffect(() => {
    async function cargarNotas() {
      try {
        const notasServidor = await getItem();
        setNotas(notasServidor || []);
      } catch (error) {
        console.error("Error al cargar notas de progreso:", error);
      }
    }
    cargarNotas();
  }, [getItem]);

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