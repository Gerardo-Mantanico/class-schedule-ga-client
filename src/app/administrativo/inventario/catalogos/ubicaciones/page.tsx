"use client";

import React, { useEffect, useState } from 'react';
import useInventario from '@/hooks/useInventario';
import Link from 'next/link';
import { GenericTable, Column } from '@/components/ui/table/GenericTable';

export default function UbicacionesPage() {
  const { ubicaciones, fetchUbicaciones, loading, error } = useInventario();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  useEffect(() => { fetchUbicaciones(); }, [fetchUbicaciones]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded shadow p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Ubicaciones</h1>
        </div>
        <div>
          <Link href="/administrativo/inventario/catalogos/ubicaciones/new" className="btn btn-primary">Nueva ubicación</Link>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        {loading && <div>Cargando...</div>}
        {error && <div className="text-error-500">{error}</div>}

        {ubicaciones && (
          (() => {
            const totalPages = Math.max(1, Math.ceil((ubicaciones?.length || 0) / itemsPerPage));
            const startIndex = (currentPage - 1) * itemsPerPage;
            const pageData = (ubicaciones || []).slice(startIndex, startIndex + itemsPerPage);
            const columns: Column<any>[] = [{ header: 'Nombre', accessorKey: 'nombre' }];
            const renderActions = (u: any) => <Link href={`/administrativo/inventario/catalogos/ubicaciones/${u.id}`} className="text-brand-500">Editar</Link>;

            return (
              <GenericTable
                data={pageData}
                columns={columns}
                actions={renderActions}
                pagination={{ currentPage, totalPages, onPageChange: setCurrentPage }}
              />
            );
          })()
        )}
      </div>
    </div>
  );
}
