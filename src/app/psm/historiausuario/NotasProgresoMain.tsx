import React, { useState, useEffect } from "react";
import { Sesion } from "@/interfaces/historiaClinica/Sesiones";
import NotasProgresoPanel from "./NotasProgresoPanel";
import NotasProgreso from "./NotasProgreso";
import { useSesiones } from "../../../hooks/historaClinica/useSesiones"; // Ajusta la ruta si es necesario
import { toast } from "react-hot-toast";

export default function NotasProgresoMain() {
    const [notas, setNotas] = useState<Sesion[]>([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const hcId = typeof window !== "undefined" ? localStorage.getItem("HistoriClinica") : null;


    const { getItemSesion } = useSesiones();

   useEffect(() => {
    async function cargarNotas() {
        try {
            const notasServidor = await getItemSesion(hcId ? parseInt(hcId) : 0);
            if (Array.isArray(notasServidor)) {
                setNotas(notasServidor);
            } else if (notasServidor) {
                setNotas([notasServidor]);
            } else {
                setNotas([]);
            }
        } catch (error) {
            console.error("Error al cargar notas de progreso:", error);
        }
    }
    cargarNotas();
}, []);

    // Cuando se guarda una nueva nota
    const handleGuardarNota = (nuevaNota: Sesion) => {
        setNotas((prev) => [...prev, nuevaNota]);
        setMostrarFormulario(false);
         toast.success('Información guardada correctamente');
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