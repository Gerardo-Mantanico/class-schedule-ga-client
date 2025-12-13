"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useInventario from '@/hooks/useInventario';

export default function MedicamentoDetail({ id }: { id: string | number }) {
  const { getMedicamento, loading } = useInventario();
  const [med, setMed] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMedicamento(Number(id));
        setMed(data);
      } catch (e: any) {
        setError(e?.message || String(e));
      }
    };
    load();
  }, [id, getMedicamento]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="text-error-500">{error}</div>;
  if (!med) return <div>No se encontró el medicamento</div>;

  return (
    <div className="bg-white rounded shadow p-6">
      <h1 className="text-2xl font-semibold mb-2">{med.nombreComercial}</h1>
      <p className="text-sm text-gray-600">Categoría: {med.categoria?.nombre}</p>
      <p className="text-sm text-gray-600">Forma: {med.formaFarmaceutica?.nombre}</p>
      <p className="text-sm text-gray-600">Unidades por empaque: {med.unidadesPorEmpaque}</p>
      <p className="text-sm text-gray-600">Stock mínimo: {med.stockMinimo}</p>
      <p className="text-sm text-gray-600">Precio venta: {med.precioVenta}</p>
      <div className="mt-4">
        <h3 className="font-semibold">Principios activos</h3>
        <ul className="mt-2 list-disc ml-6">
          {med.principiosActivos?.map((p: any) => (
            <li key={p.id}>{p.nombre} — {p.concentracion} {p.unidadMedida?.simbolo}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
