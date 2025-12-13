"use client";

import React, { useState, useEffect } from 'react';
import useInventario from '@/hooks/useInventario';
import { useRouter } from 'next/navigation';
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

export default function MedicamentoForm({ initial }: { initial?: any }) {
  const [nombreComercial, setNombreComercial] = useState(initial?.nombreComercial || '');
  const [formaFarmaceuticaId, setFormaFarmaceuticaId] = useState(initial?.formaFarmaceuticaId || 1);
  const [categoriaId, setCategoriaId] = useState(initial?.categoriaId || 1);
  const [unidadesPorEmpaque, setUnidadesPorEmpaque] = useState(initial?.unidadesPorEmpaque || 1);
  const [stockMinimo, setStockMinimo] = useState(initial?.stockMinimo || 0);
  const [precioVenta, setPrecioVenta] = useState(initial?.precioVenta || 0);
  const { createMedicamento, updateMedicamento } = useInventario();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { nombreComercial, formaFarmaceuticaId, categoriaId, unidadesPorEmpaque, stockMinimo, precioVenta, activo: true };
    try {
      if (initial?.id) {
        await updateMedicamento(initial.id, payload);
      } else {
        await createMedicamento(payload);
      }
      router.push('/administrativo/inventario/medicamentos');
    } catch (err) {
      // TODO: show error
      console.error(err);
    }
  };

  return (
 
    <div className="no-scrollbar relative w-full sm:w-auto sm:max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
      <div className="px-2 pr-14">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Registro de medicamento
        </h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
          Complete el formulario para registrar un nuevo medicamento
        </p>
      </div>
      <form className="flex flex-col">
        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
          <div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
              <div>
                <Label className="block text-sm">Nombre comercial</Label>
                <Input value={nombreComercial} onChange={(e) => setNombreComercial(e.target.value)} className="input" required />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

              <div>
                <Label className="block text-sm">Unidades por empaque</Label>
                <Input type="number" value={unidadesPorEmpaque} onChange={(e) => setUnidadesPorEmpaque(Number(e.target.value))} className="input" />
              </div>
              <div>
                <Label className="block text-sm">Stock mínimo</Label>
                <Input type="number" value={stockMinimo} onChange={(e) => setStockMinimo(Number(e.target.value))} className="input" />
              </div>
              <div>
                <Label className="block text-sm">Precio venta</Label>
                <Input type="number" value={precioVenta} onChange={(e) => setPrecioVenta(Number(e.target.value))} className="input" />
              </div>
            </div>
          </div>
        </div>
          <div className="mt-4 flex gap-2">
        <button type="submit" className="btn btn-primary">Guardar</button>
       </div>
      </form>
    </div>
  );
}
