"use client";

import React, { useRef, useState } from "react";
import Button from "@/components/ui/button/Button";
import { MdHistory, MdPictureAsPdf, MdImage, MdTableChart } from "react-icons/md";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { usePagoSesion } from "@/hooks/usePagoSesion";

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
  const [tipo, setTipo] = useState("conciliacionPagos");
  const refTabla = useRef<HTMLDivElement>(null);

  // Usa el hook para obtener los pagos
  const { pagos, loading, error } = usePagoSesion();

  // Estructura para conciliación de pagos
  const conciliacionPagos = pagos.map(p => ({
    id: p.id,
    codigo: p.codigo,
    fecha: p.fechaPago ? new Date(p.fechaPago).toLocaleDateString() : "",
    cliente: p.pacienteId,
    sesion: p.sessionId,
    monto: p.monto,
    pagado: p.pagado ? "Sí" : "No",
    nota: p.nota,
    comprobante: p.comprobante,
  }));

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
        <Button onClick={() => exportarExcel(conciliacionPagos, tipo)} className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1"><MdTableChart size={14}/>Excel</Button>
      </div>

      <div ref={refTabla} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        {loading ? (
          <div>Cargando pagos...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b py-1 px-2">Código</th>
                <th className="border-b py-1 px-2">Fecha</th>
                <th className="border-b py-1 px-2">Cliente</th>
                <th className="border-b py-1 px-2">Sesión</th>
                <th className="border-b py-1 px-2">Monto ($)</th>
                <th className="border-b py-1 px-2">Pagado</th>
                <th className="border-b py-1 px-2">Comprobante</th>
              </tr>
            </thead>
            <tbody>
              {conciliacionPagos.map((item, idx) => (
                <tr key={item.id} className={idx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-100 dark:bg-gray-700"}>
                  <td className="py-1 px-2">{item.codigo}</td>
                  <td className="py-1 px-2">{item.fecha}</td>
                  <td className="py-1 px-2">{item.cliente}</td>
                  <td className="py-1 px-2">{item.sesion}</td>
                  <td className="py-1 px-2">${item.monto}</td>
                  <td className="py-1 px-2">{item.pagado}</td>
                  <td className="py-1 px-2">
                    {item.comprobante ? (
                      <a
                        href={item.comprobante}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Ver comprobante
                      </a>
                    ) : (
                      <span className="text-gray-400">Sin comprobante</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}