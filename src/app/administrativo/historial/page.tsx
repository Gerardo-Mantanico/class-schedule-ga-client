"use client";

import React, { useRef, useState } from "react";
import Button from "@/components/ui/button/Button";
import { MdHistory, MdPictureAsPdf, MdImage, MdTableChart } from "react-icons/md";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Datos de ejemplo
const reportes = {
  cuentasPorCobrar: [
    { cliente: "Ana Pérez", total: 1200, vencimiento: "2025-01-15" },
    { cliente: "Luis Gómez", total: 800, vencimiento: "2025-01-20" },
  ],
  historialClientes: [
    { cliente: "Ana Pérez", sesiones: 10, ultimoPago: "2024-12-10" },
    { cliente: "Luis Gómez", sesiones: 8, ultimoPago: "2024-12-15" },
  ],
  conciliacionPagos: [
    { fecha: "2024-12-10", cliente: "Ana Pérez", monto: 300, metodo: "Efectivo" },
    { fecha: "2024-12-15", cliente: "Luis Gómez", monto: 200, metodo: "Tarjeta" },
  ],
};

const opciones = [
  { value: "cuentasPorCobrar", label: "Cuentas por Cobrar" },
  { value: "historialClientes", label: "Historial de Clientes" },
  { value: "conciliacionPagos", label: "Conciliación de Pagos" },
];

function exportar(ref: React.RefObject<HTMLDivElement | null>, nombre: string, tipo: "pdf" | "img") {
  if (!ref.current) return;
  html2canvas(ref.current).then(canvas => {
    if (tipo === "pdf") {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${nombre}.pdf`);
    } else {
      canvas.toBlob(blob => {
        if (blob) saveAs(blob, `${nombre}.png`);
      });
    }
  });
}

function exportarExcel(datos: any[], nombre: string) {
  const ws = XLSX.utils.json_to_sheet(datos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Reporte");
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, `${nombre}.xlsx`);
}

export default function HistorialReportes() {
  const [tipo, setTipo] = useState("cuentasPorCobrar");
  const refTabla = useRef<HTMLDivElement>(null);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <MdHistory className="text-blue-600 dark:text-blue-400" size={28} />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Reportes de Historial</h1>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <label htmlFor="tipoReporte" className="font-semibold text-gray-700 dark:text-gray-200">
          Selecciona el tipo de reporte:
        </label>
        <select
          id="tipoReporte"
          value={tipo}
          onChange={e => setTipo(e.target.value)}
          className="border rounded px-2 py-1 dark:bg-gray-800 dark:text-white"
        >
          {opciones.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-1 mb-2">
        <Button onClick={() => exportar(refTabla, tipo, "pdf")} className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1"><MdPictureAsPdf size={14}/>PDF</Button>
        <Button onClick={() => exportar(refTabla, tipo, "img")} className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1"><MdImage size={14}/>Imagen</Button>
        <Button onClick={() => exportarExcel(reportes[tipo as keyof typeof reportes], tipo)} className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1"><MdTableChart size={14}/>Excel</Button>
      </div>

      <div ref={refTabla} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        {tipo === "cuentasPorCobrar" && (
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b py-1 px-2">Cliente</th>
                <th className="border-b py-1 px-2">Total ($)</th>
                <th className="border-b py-1 px-2">Vencimiento</th>
              </tr>
            </thead>
            <tbody>
              {reportes.cuentasPorCobrar.map((item, idx) => (
                <tr key={item.cliente} className={idx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-100 dark:bg-gray-700"}>
                  <td className="py-1 px-2">{item.cliente}</td>
                  <td className="py-1 px-2">${item.total}</td>
                  <td className="py-1 px-2">{item.vencimiento}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {tipo === "historialClientes" && (
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b py-1 px-2">Cliente</th>
                <th className="border-b py-1 px-2">Sesiones</th>
                <th className="border-b py-1 px-2">Último Pago</th>
              </tr>
            </thead>
            <tbody>
              {reportes.historialClientes.map((item, idx) => (
                <tr key={item.cliente} className={idx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-100 dark:bg-gray-700"}>
                  <td className="py-1 px-2">{item.cliente}</td>
                  <td className="py-1 px-2">{item.sesiones}</td>
                  <td className="py-1 px-2">{item.ultimoPago}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {tipo === "conciliacionPagos" && (
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b py-1 px-2">Fecha</th>
                <th className="border-b py-1 px-2">Cliente</th>
                <th className="border-b py-1 px-2">Monto ($)</th>
                <th className="border-b py-1 px-2">Método</th>
              </tr>
            </thead>
            <tbody>
              {reportes.conciliacionPagos.map((item, idx) => (
                <tr key={item.fecha + item.cliente} className={idx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-100 dark:bg-gray-700"}>
                  <td className="py-1 px-2">{item.fecha}</td>
                  <td className="py-1 px-2">{item.cliente}</td>
                  <td className="py-1 px-2">${item.monto}</td>
                  <td className="py-1 px-2">{item.metodo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}