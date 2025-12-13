"use client";

import React, { useEffect, useState } from 'react';
import useInventario from '@/hooks/useInventario';
import { GenericTable, Column } from '@/components/ui/table/GenericTable';
import { GenericModal } from '@/components/ui/modal/GenericModal';
import CategoriaForm from '@/components/administrativo/CategoriaForm';
import Button from '@/components/ui/button/Button';
import Alert from '@/components/ui/alert/Alert';

interface Categoria { id: number; nombre: string }

export default function CategoriasPage() {
  const { categorias, fetchCategorias, loading, error, deleteCategoria } = useInventario();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<{ id?: number; nombre?: string } | null>(null);
  const [alertData, setAlertData] = useState<{ variant: 'success' | 'error' | 'warning' | 'info'; title: string; message: string } | null>(null);
  const handleEdit = React.useCallback((c: Categoria) => { setEditing(c); setIsModalOpen(true); }, []);

  useEffect(() => { fetchCategorias(); }, [fetchCategorias]);

  const totalPages = Math.max(1, Math.ceil((categorias?.length || 0) / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageData = (categorias || []).slice(startIndex, startIndex + itemsPerPage);

  const columns: Column<Categoria>[] = [
    { header: 'Nombre', accessorKey: 'nombre' },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-gray-800">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/5">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Categoria
        </h3>
        <Button size="sm" onClick={() => { setEditing(null); setIsModalOpen(true); }}>
          Agregar Categoria
        </Button>
      </div>
      
  <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
        {loading && <div>Cargando categorías...</div>}
        {error && <div className="text-error-500">{error}</div>}
        {alertData && (
          <div className="mb-4">
            <Alert variant={alertData.variant} title={alertData.title} message={alertData.message} />
          </div>
        )}

        <GenericTable
          data={pageData}
          columns={columns}
          onDelete={async (c) => {
            try {
              await deleteCategoria(Number(c.id));
              await fetchCategorias();
              setAlertData({ variant: 'success', title: 'Categoría eliminada', message: 'La categoría se eliminó correctamente.' });
              setTimeout(() => setAlertData(null), 3000);
            } catch {
              setAlertData({ variant: 'error', title: 'Error', message: 'Error al eliminar la categoría' });
              setTimeout(() => setAlertData(null), 5000);
            }
          }}
          onEdit={handleEdit}
          pagination={{ currentPage, totalPages, onPageChange: setCurrentPage }}
        />

        <GenericModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? 'Editar categoría' : 'Nueva categoría'} size="sm">
          <CategoriaForm
            initial={editing || undefined}
            onCancel={() => setIsModalOpen(false)}
            onSaved={() => { setIsModalOpen(false); fetchCategorias(); }}
          />
        </GenericModal>
      </div>
    </div>
  );
}
