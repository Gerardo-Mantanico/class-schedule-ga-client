import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import React, { useState } from "react";


type Medicamento = {
  id: number;
  nombre: string;
  dosis: string;
  frecuencia: string;
  entregado: boolean;
};

const medicamentosInventario = [
  "Paracetamol",
  "Ibuprofeno",
  "Amoxicilina",
  "Omeprazol",
  "Loratadina"
  // Puedes cargar esto dinámicamente desde tu inventario real
];

export default function RecetaMedica() {
  const [lista, setLista] = useState<Medicamento[]>([]);
  const [nuevo, setNuevo] = useState<Omit<Medicamento, "id">>({
    nombre: "",
    dosis: "",
    frecuencia: "",
    entregado: false
  });

  const agregarMedicamento = () => {
    if (!nuevo.nombre || !nuevo.dosis || !nuevo.frecuencia) return;
    setLista([
      ...lista,
      { ...nuevo, id: Date.now() }
    ]);
    setNuevo({ nombre: "", dosis: "", frecuencia: "", entregado: false });
  };

  const marcarEntregado = (id: number) => {
    setLista(lista.map(m =>
      m.id === id ? { ...m, entregado: !m.entregado } : m
    ));
  };

  const eliminarMedicamento = (id: number) => {
    setLista(lista.filter(m => m.id !== id));
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Receta Médica</h2>
      <div className="mb-4 flex flex-col gap-2">
        <Select
          value={nuevo.nombre}
          onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })}
        >
          <option value="">Selecciona medicamento</option>
          {medicamentosInventario.map(med => (
            <option key={med} value={med}>{med}</option>
          ))}
        </Select>
        <Input
          placeholder="Dosis (ej: 500mg)"
          value={nuevo.dosis}
          onChange={e => setNuevo({ ...nuevo, dosis: e.target.value })}
        />
        <Input
          placeholder="Frecuencia (ej: 2 veces al día)"
          value={nuevo.frecuencia}
          onChange={e => setNuevo({ ...nuevo, frecuencia: e.target.value })}
        />
        <Button onClick={agregarMedicamento}>
          Agregar medicamento
        </Button>
      </div>
      <ul className="divide-y divide-gray-200">
        {lista.map(m => (
          <li key={m.id} className="flex items-center justify-between py-2">
            <div>
              <span className="font-medium">{m.nombre}</span> — {m.dosis}, {m.frecuencia}
              <span className={`ml-2 text-xs px-2 py-0.5 rounded ${m.entregado ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {m.entregado ? "Entregado" : "Pendiente"}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={m.entregado ? "secondary" : "success"}
                size="sm"
                onClick={() => marcarEntregado(m.id)}
              >
                {m.entregado ? "Desmarcar" : "Marcar entregado"}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => eliminarMedicamento(m.id)}
              >
                Eliminar
              </Button>
            </div>
          </li>
        ))}
        {lista.length === 0 && (
          <li className="text-gray-500 py-4 text-center">No hay medicamentos registrados.</li>
        )}
      </ul>
    </div>
  );
}