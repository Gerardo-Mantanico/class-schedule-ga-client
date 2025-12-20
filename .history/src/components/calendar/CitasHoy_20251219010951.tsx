import React, { useEffect, useState } from 'react';
// Ajusta la importación del servicio según tu estructura real
// import { getCitasHoy } from '../../service/citas.service';

interface Cita {
  id: string;
  hora: string;
  paciente: string;
  motivo: string;
}

const CitasHoy: React.FC = () => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de fetch, reemplaza por llamada real a API
    const fetchCitas = async () => {
      setLoading(true);
      // const data = await getCitasHoy();
      const data: Cita[] = [
        { id: '1', hora: '09:00', paciente: 'Juan Pérez', motivo: 'Consulta general' },
        { id: '2', hora: '11:30', paciente: 'Ana López', motivo: 'Revisión' },
        { id: '3', hora: '15:00', paciente: 'Carlos Ruiz', motivo: 'Control' },
      ];
      setCitas(data);
      setLoading(false);
    };
    fetchCitas();
  }, []);

  if (loading) return <div>Cargando citas de hoy...</div>;

  return (
    <div>
      <h2>Citas para hoy</h2>
      {citas.length === 0 ? (
        <p>No hay citas para hoy.</p>
      ) : (
        <ul>
          {citas.map((cita) => (
            <li key={cita.id}>
              <strong>{cita.hora}</strong> - {cita.paciente} ({cita.motivo})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CitasHoy;
