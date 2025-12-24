"use client";

import React from 'react';
import Link from 'next/link';
import {
  FolderIcon,
  BoxCubeIcon,
  BoxIconLine,
  BoltIcon,
  GroupIcon,
  PageIcon,
  CloseLineIcon,
  ChatIcon,
} from '@/icons';

const inventarioMinimo = [
  { nombre: "Paracetamol", stock: 5, minimo: 10 },
  { nombre: "Ibuprofeno", stock: 8, minimo: 10 },
];

export default function CatalogosIndex() {
  // Ejemplo de datos para gráfica (puedes integrar una librería real como recharts/chart.js)
  const totalCategorias = 6;
  const totalProductos = 120;
  const totalProveedores = 8;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow p-6 dark:bg-gray-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Catálogos - Inventario</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Administración de catálogos del inventario</p>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <ChatIcon className="w-8 h-8 text-blue-500" />
            <span className="text-xs text-gray-500 dark:text-gray-300">Productos</span>
            <span className="font-bold text-lg text-gray-900 dark:text-white">{totalProductos}</span>
          </div>
          <div className="flex flex-col items-center">
            <FolderIcon className="w-8 h-8 text-green-500" />
            <span className="text-xs text-gray-500 dark:text-gray-300">Categorías</span>
            <span className="font-bold text-lg text-gray-900 dark:text-white">{totalCategorias}</span>
          </div>
          <div className="flex flex-col items-center">
            <GroupIcon className="w-8 h-8 text-purple-500" />
            <span className="text-xs text-gray-500 dark:text-gray-300">Proveedores</span>
            <span className="font-bold text-lg text-gray-900 dark:text-white">{totalProveedores}</span>
          </div>
        </div>
      </div>

      {/* Alertas de inventario mínimo */}
      {inventarioMinimo.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-xl shadow flex items-center gap-3 dark:bg-yellow-900/30 dark:border-yellow-600">
          <CloseLineIcon className="w-6 h-6 text-yellow-500" />
          <div>
            <span className="font-semibold text-yellow-800 dark:text-yellow-200">¡Alerta!</span>
            <span className="ml-2 text-yellow-700 dark:text-yellow-100">
              Los siguientes productos están por debajo del inventario mínimo:
            </span>
            <ul className="ml-8 mt-1 list-disc text-yellow-800 dark:text-yellow-100 text-sm">
              {inventarioMinimo.map(item => (
                <li key={item.nombre}>
                  {item.nombre} (Stock: <span className="font-bold">{item.stock}</span> / Mínimo: {item.minimo})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-4 dark:bg-gray-800">
          <div className="flex items-center gap-3 rounded-xl">
            <FolderIcon className="w-6 h-6 text-brand-500" />
            <h3 className="font-medium text-gray-900 dark:text-white">Categorías</h3>
          </div>
          <Link href="/administrativo/inventario/catalogos/categorias" className="text-brand-500 dark:text-brand-400">Ver categorías</Link>
        </div>
        <div className="bg-white rounded-xl shadow p-4 dark:bg-gray-800">
          <div className="flex items-center gap-3 rounded-xl">
            <BoxCubeIcon className="w-6 h-6 text-brand-500" />
            <h3 className="font-medium text-gray-900 dark:text-white">Unidades / Empaque</h3>
          </div>
          <Link href="/administrativo/inventario/catalogos/unidades" className="text-brand-500 dark:text-brand-400">Ver unidades</Link>
        </div>
        <div className="bg-white rounded-xl shadow p-4 dark:bg-gray-800">
          <div className="flex items-center gap-3 rounded-xl">
            <BoxIconLine className="w-6 h-6 text-brand-500" />
            <h3 className="font-medium text-gray-900 dark:text-white">Forma farmacéutica</h3>
          </div>
          <Link href="/administrativo/inventario/catalogos/formas" className="text-brand-500 dark:text-brand-400">Ver formas</Link>
        </div>
        <div className="bg-white rounded-xl shadow p-4 dark:bg-gray-800">
          <div className="flex items-center gap-3 rounded-xl">
            <BoltIcon className="w-6 h-6 text-brand-500" />
            <h3 className="font-medium text-gray-900 dark:text-white">Principios activos</h3>
          </div>
          <Link href="/administrativo/inventario/catalogos/principios" className="text-brand-500 dark:text-brand-400">Ver principios</Link>
        </div>
        <div className="bg-white rounded-xl shadow p-4 dark:bg-gray-800">
          <div className="flex items-center gap-3 rounded-xl">
            <GroupIcon className="w-6 h-6 text-brand-500" />
            <h3 className="font-medium text-gray-900 dark:text-white">Proveedores</h3>
          </div>
          <Link href="/administrativo/inventario/catalogos/proveedores" className="text-brand-500 dark:text-brand-400">Ver proveedores</Link>
        </div>
        <div className="bg-white rounded-xl shadow p-4 dark:bg-gray-800">
          <div className="flex items-center gap-3 rounded-xl">
            <PageIcon className="w-6 h-6 text-brand-500" />
            <h3 className="font-medium text-gray-900 dark:text-white">Ubicaciones</h3>
          </div>
          <Link href="/administrativo/inventario/catalogos/ubicaciones" className="text-brand-500 dark:text-brand-400">Ver ubicaciones</Link>
        </div>
      </div>
    </div>
  );
}