"use client";

import React from 'react';
import MedicamentoDetail from '@/components/administrativo/MedicamentoDetail';

interface Props {
  params: { id: string };
}

export default function MedicamentoDetailPage({ params }: Props) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded shadow p-6">
        <h1 className="text-2xl font-semibold">Detalle de Medicamento</h1>
      </div>
      <MedicamentoDetail id={params.id} />
    </div>
  );
}
