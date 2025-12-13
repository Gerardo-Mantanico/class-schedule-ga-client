"use client";

import React, { useEffect, useState } from 'react';
import useInventario from '@/hooks/useInventario';
import Link from 'next/link';
import { GenericTable, Column } from '../ui/table/GenericTable';
import { GenericModal } from '../ui/modal/GenericModal';
import MedicamentoForm from './MedicamentoForm';
import Button from '../ui/button/Button';

interface Medicamento {
  id: number;
  nombreComercial: string;
  formaFarmaceutica?: { id: number; nombre: string };
  categoria?: { id: number; nombre: string };
  unidadesPorEmpaque?: number;
  stockMinimo?: number;
  precioVenta?: number;
}

export default function MedicamentosTable() {
  const { medicamentos, loading, error, fetchMedicamentos, deleteMedicamento, getMedicamento } = useInventario();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Medicamento | null>(null);

  useEffect(() => {
    fetchMedicamentos();
  }, [fetchMedicamentos]);

  const totalPages = Math.max(1, Math.ceil((medicamentos?.length || 0) / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageData = (medicamentos || []).slice(startIndex, startIndex + itemsPerPage);
  if (loading && (medicamentos?.length || 0) === 0) return <div>Cargando medicamentos...</div>;
  if (error && (medicamentos?.length || 0) === 0) return <div className="text-error-500">{error}</div>;

  const columns: Column<Medicamento>[] = [
    { header: 'Nombre', accessorKey: 'nombreComercial' },
    { header: 'Categoría', cell: (m) => m.categoria?.nombre || '-' },
    { header: 'Forma', cell: (m) => m.formaFarmaceutica?.nombre || '-' },
    { header: 'Stock mínimo', accessorKey: 'stockMinimo' },
    { header: 'Precio', accessorKey: 'precioVenta' },
  ];
  const openNew = () => { setEditing(null); setIsModalOpen(true); };
  const openEdit = async (id: number) => {
    try {
      const data = await getMedicamento(id);
      setEditing(data as Medicamento);
      setIsModalOpen(true);
    } catch (e) { console.error(e); }
  };

  const actionsRenderer = (m: Medicamento) => (
    <div className="flex items-center gap-3">
      <button onClick={() => openEdit(Number(m.id))} className="text-brand-500">Ver</button>
      <Link href={`/administrativo/inventario/medicamentos/${m.id}`} className="text-gray-500">Abrir página</Link>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
 
  {/* Header con botón a la derecha */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/5">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Medicamentos
        </h3>
        <Button size="sm" onClick={openNew}>
          Agregar Medicamento
        </Button>
      </div>
      
      <GenericTable
        data={pageData}
        columns={columns}
        onDelete={async (m) => {
          if (!confirm('Eliminar medicamento?')) return;
          try {
            await deleteMedicamento(Number(m.id));
            // refresh
            await fetchMedicamentos();
          } catch (e) {
            console.error(e);
            alert('Error al eliminar');
          }
        }}
        actions={actionsRenderer}
        pagination={{ currentPage, totalPages, onPageChange: setCurrentPage }}
      />

      <GenericModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? 'Editar Medicamento' : 'Nuevo Medicamento'}
        size="auto"
        className="w-full sm:w-auto m-4"
      >
        <MedicamentoForm initial={editing} />
      </GenericModal>
    </div>
  );
}
