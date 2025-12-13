"use client";

import React, { useEffect, useState } from 'react';
import useInventario from '@/hooks/useInventario';
import Link from 'next/link';
import { GenericTable, Column } from '@/components/ui/table/GenericTable';
import { inventarioApi } from '@/service/inventario.service';

export default function FormasPage() {
  const { formas, fetchFormas, loading, error } = useInventario();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  useEffect(() => { fetchFormas(); }, [fetchFormas]);

  const totalPages = Math.max(1, Math.ceil((formas?.length || 0) / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageData = (formas || []).slice(startIndex, startIndex + itemsPerPage);

  const columns: Column<any>[] = [{ header: 'Nombre', accessorKey: 'nombre' }];
  const renderActions = (f: any) => <Link href={`/administrativo/inventario/catalogos/formas/${f.id}`} className="text-brand-500">Editar</Link>;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded shadow p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Formas farmacéuticas</h1>
        </div>
        <div>
          <Link href="/administrativo/inventario/catalogos/formas/new" className="btn btn-primary">Nueva forma</Link>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        {loading && <div>Cargando...</div>}
        {error && <div className="text-error-500">{error}</div>}

        <GenericTable
          data={pageData}
          columns={columns}
          onDelete={async (f) => {
            if (!confirm('Eliminar forma?')) return;
            try { await inventarioApi.deleteForma(Number(f.id)); await fetchFormas(); }
            catch (e) { console.error(e); alert('Error al eliminar'); }
          }}
          actions={renderActions}
          pagination={{ currentPage, totalPages, onPageChange: setCurrentPage }}
        />
      </div>
    </div>
  );
}
