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
} from '@/icons';

export default function CatalogosIndex() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow p-6 dark:bg-gray-800">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Catálogos - Inventario</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">Administración de catálogos del inventario</p>
      </div>

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
            <h3 className="font-medium text-gray-900 dark:text-white">Unidades</h3>
          </div>
          <Link href="/administrativo/inventario/catalogos/unidades" className="text-brand-500 dark:text-brand-400">Ver unidades</Link>
        </div>
        <div className="bg-white rounded-xl shadow p-4 dark:bg-gray-800">
          <div className="flex items-center gap-3 rounded-xl">
            <BoxIconLine className="w-6 h-6 text-brand-500" />
            <h3 className="font-medium text-gray-900 dark:text-white">Formas</h3>
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
