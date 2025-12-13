"use client";

import React, { useEffect, useState } from 'react';
import useInventario from '@/hooks/useInventario';
import Link from 'next/link';
import { GenericTable, Column } from '@/components/ui/table/GenericTable';
import { inventarioApi } from '@/service/inventario.service';

export default function PrincipiosPage() {
  const { principios, fetchPrincipios, loading, error } = useInventario();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  useEffect(() => { fetchPrincipios(); }, [fetchPrincipios]);

  const totalPages = Math.max(1, Math.ceil((principios?.length || 0) / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageData = (principios || []).slice(startIndex, startIndex + itemsPerPage);

  const columns: Column<any>[] = [{ header: 'Nombre', accessorKey: 'nombre' }];
  const renderActions = (p: any) => <Link href={`/administrativo/inventario/catalogos/principios/${p.id}`} className="text-brand-500">Editar</Link>;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded shadow p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Principios activos</h1>
        </div>
        <div>
          <Link href="/administrativo/inventario/catalogos/principios/new" className="btn btn-primary">Nuevo principio</Link>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        {loading && <div>Cargando...</div>}
        {error && <div className="text-error-500">{error}</div>}

        <GenericTable
          data={pageData}
          columns={columns}
          onDelete={async (p) => {
            if (!confirm('Eliminar principio?')) return;
            try { await inventarioApi.deletePrincipio(Number(p.id)); await fetchPrincipios(); }
            catch (e) { console.error(e); alert('Error al eliminar'); }
          }}
          actions={renderActions}
          pagination={{ currentPage, totalPages, onPageChange: setCurrentPage }}
        />
      </div>
    </div>
  );
}
