"use client";

import React, { useEffect, useState } from 'react';
import useInventario from '@/hooks/useInventario';
import Link from 'next/link';
import { GenericTable, Column } from '@/components/ui/table/GenericTable';

export default function UnidadesPage() {
  const { unidades, fetchUnidades, loading, error, deleteUnidad } = useInventario();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => { fetchUnidades(); }, [fetchUnidades]);

  const totalPages = Math.max(1, Math.ceil((unidades?.length || 0) / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageData = (unidades || []).slice(startIndex, startIndex + itemsPerPage);

  const columns: Column<any>[] = [
    { header: 'Nombre', accessorKey: 'nombre' },
    { header: 'Símbolo', accessorKey: 'simbolo' },
  ];

  const renderActions = (u: any) => (
    <Link href={`/administrativo/inventario/catalogos/unidades/${u.id}`} className="text-brand-500">Editar</Link>
  );

  return (
    <div className="space-y-4">
      <div className="bg-white rounded shadow p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Unidades de medida</h1>
        </div>
        <div>
          <Link href="/administrativo/inventario/catalogos/unidades/new" className="btn btn-primary">Nueva unidad</Link>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        {loading && <div>Cargando...</div>}
        {error && <div className="text-error-500">{error}</div>}

        <GenericTable
          data={pageData}
          columns={columns}
          onDelete={async (u) => {
            if (!confirm('Eliminar unidad?')) return;
            try { await deleteUnidad(Number(u.id)); await fetchUnidades(); }
            catch (e) { console.error(e); alert('Error al eliminar'); }
          }}
          actions={renderActions}
          pagination={{ currentPage, totalPages, onPageChange: setCurrentPage }}
        />
      </div>
    </div>
  );
}
