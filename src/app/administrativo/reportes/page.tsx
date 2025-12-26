"use client";

import React, { useRef, useState } from "react";
import Button from "@/components/ui/button/Button";
import { MdPictureAsPdf, MdImage, MdTableChart, MdBarChart } from "react-icons/md";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import useInventario from "@/hooks/reporte/useReporteGlobal";
import useNomina from "@/hooks/useNomina";


// Datos de ejemplo
const reportes = {
  financieros: [
    { periodo: "Enero 2025", ingresos: 12000, ganancias: 4000, nomina: 3000 },
    { periodo: "Febrero 2025", ingresos: 15000, ganancias: 5000, nomina: 3200 },
  ],
  recursosHumanos: [
    { empleado: "Ana Pérez", pagos: 2000, bonos: 200, retenciones: 150 },
    { empleado: "Luis Gómez", pagos: 2200, bonos: 150, retenciones: 180 },
  ],
};

function exportar(ref: React.RefObject<HTMLDivElement | null >, nombre: string, tipo: "pdf" | "img") {
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

const opciones = [
  { value: "financieros", label: "Financieros: Ingresos, Ganancias y Nómina" },
  { value: "inventario", label: "Inventario: Medicamentos y Ventas" },
  { value: "recursosHumanos", label: "Recursos Humanos: Pagos, Bonos y Retenciones" },
];

export default function Reportes() {
  const [tipo, setTipo] = useState("financieros");
  const refTabla = useRef<HTMLDivElement>(null);
  const { reporteMedicamentos } = useInventario();
  const { items: inventario } = reporteMedicamentos;

  const {pagarNomina} = useNomina();
  const { items: recursosHumanos } = pagarNomina;






  return (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <MdBarChart className="text-blue-600 dark:text-blue-400" size={28} />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Reportes</h1>
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
        {tipo === "financieros" && (
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b py-1 px-2">Período</th>
                <th className="border-b py-1 px-2">Ingresos</th>
                <th className="border-b py-1 px-2">Ganancias</th>
                <th className="border-b py-1 px-2">Costo Nómina</th>
              </tr>
            </thead>
            <tbody>
              {reportes.financieros.map((item, idx) => (
                <tr key={item.periodo} className={idx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-100 dark:bg-gray-700"}>
                  <td className="py-1 px-2">{item.periodo}</td>
                  <td className="py-1 px-2">${item.ingresos}</td>
                  <td className="py-1 px-2">${item.ganancias}</td>
                  <td className="py-1 px-2">${item.nomina}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {tipo === "inventario" && (
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr>
                  <th className="border-b py-1 px-2">Nombre Comercial</th>
                  <th className="border-b py-1 px-2">Stock Total</th>
                  <th className="border-b py-1 px-2">Stock Mínimo</th>
                  <th className="border-b py-1 px-2">Precio Venta</th>
                  <th className="border-b py-1 px-2">Diferencia</th>
                  <th className="border-b py-1 px-2">Activo</th>

              </tr>
            </thead>
            <tbody>
              {inventario.map((item, idx) => (
                  <tr key={item.medicamentoId} className={idx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-100 dark:bg-gray-700"}>
                    <td className="py-1 px-2">{item.nombreComercial}</td>
                    <td className="py-1 px-2">{item.stockTotal}</td>
                    <td className="py-1 px-2">{item.stockMinimo}</td>
                    <td className="py-1 px-2">{item.precioVenta}</td>
                    <td className="py-1 px-2">{item.diferencia}</td>
                    <td className="py-1 px-2">{item.activo ? "Sí" : "No"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
        {tipo === "recursosHumanos" && (
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b py-1 px-2">Factura</th>
                <th className="border-b py-1 px-2">Empleado</th>
                <th className="border-b py-1 px-2">Pagos</th>
                <th className="border-b py-1 px-2">Bonos</th>
                <th className="border-b py-1 px-2">Retenciones</th>
                <th className="border-b py-1 px-2">Netos</th>
                <th className="border-b py-1 px-2">Fecha Pago</th>
                <th className="border-b py-1 px-2">Método Pago</th>
              </tr>
            </thead>
            <tbody>
            {recursosHumanos.map((item, idx) => {
        // Parsear dataJson si es string
        const data = typeof item.dataJson === "string" ? JSON.parse(item.dataJson) : item.dataJson;
        const bonos = (data.bonos || []).reduce((sum: number, b: { monto?: number }) => sum + (b.monto || 0), 0);
                  const retenciones = (data.retenciones || []).reduce((sum: number, r: { monto?: number }) => sum + (r.monto || 0), 0);
        return (
          <tr key={item.codigoFactura} className={idx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-100 dark:bg-gray-700"}>
            <td className="py-1 px-2">{item.codigoFactura}</td>
            <td className="py-1 px-2">{data.user.firstname} {data.user.lastname}</td>
            <td className="py-1 px-2">${data.salarioBase}</td>
            <td className="py-1 px-2">${bonos}</td>
            <td className="py-1 px-2">${retenciones}</td>
            <td className="py-1 px-2">${data.salarioBase + bonos - retenciones}</td>
            <td className="py-1 px-2">{item.fechaPago ? new Date(item.fechaPago).toLocaleDateString() : "N/A"}</td>
            <td className="py-1 px-2">{data.metodoPago}</td>
          </tr>
        );
      })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}